import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.models import (
    Source, Document, Chunk, Entity, Relationship, Event, Discovery, Execution, AgentRun,
    Notification, Workspace, generate_uuid, utc_now
)
from backend.app.rag.chunker import chunk_text
from backend.app.services.ai_service import ai_service
from backend.app.agents.extraction_agent import extraction_agent
from backend.app.agents.relationship_agent import relationship_agent
from backend.app.agents.temporal_agent import temporal_agent
from backend.app.agents.impact_agent import impact_agent
from backend.app.agents.discovery_agent import discovery_agent
from backend.app.agents.verification_agent import verification_agent
from backend.app.agents.change_agent import change_agent
from backend.app.realtime.manager import realtime_manager
from backend.app.services.mongodb_service import mongodb_service

class ProcessingPipeline:
    async def process_source(self, db: AsyncSession, source_id: str, content: str, title: str, workspace_id: str) -> str:
        # Create Execution record
        execution = Execution(
            workspace_id=workspace_id,
            workflow_id="FULL_INTELLIGENCE_PIPELINE",
            status="running",
            metadata_={"source_id": source_id, "title": title}
        )
        db.add(execution)
        await db.commit()
        await db.refresh(execution)

        try:
            # 1. DOCUMENT_INGESTION & EXTRACTION
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Ingestion",
                "status": "running",
                "message": "Validating and extracting document text..."
            })
            
            document = Document(
                source_id=source_id,
                title=title,
                content=content,
                metadata_={"length": len(content)}
            )
            db.add(document)
            await db.commit()
            await db.refresh(document)

            # 2. CHUNKING & EMBEDDINGS
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Chunking",
                "status": "running",
                "message": "Splitting text into semantic passages..."
            })
            
            chunks_data = chunk_text(content)
            chunk_objs = []
            for c in chunks_data:
                embedding = await ai_service.embed_text(c["content"])
                chunk_obj = Chunk(
                    document_id=document.id,
                    content=c["content"],
                    chunk_index=c["chunk_index"],
                    embedding=embedding,
                    metadata_=c["metadata"]
                )
                chunk_objs.append(chunk_obj)
            db.add_all(chunk_objs)
            await db.commit()

            # 3. ENTITY & EVENT DETECTION AGENT
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Entity Detection",
                "status": "running",
                "message": "Extracting entities, locations, transport routes, and events..."
            })
            
            extracted = await extraction_agent.extract_knowledge(content, title)
            entities_data = extracted.get("entities", [])
            events_data = extracted.get("events", [])

            created_entities = []
            for ent in entities_data:
                # Check if entity exists in workspace to avoid duplicate nodes
                stmt = select(Entity).where(Entity.workspace_id == workspace_id, Entity.name == ent["name"])
                res = await db.execute(stmt)
                existing = res.scalars().first()
                if not existing:
                    new_ent = Entity(
                        workspace_id=workspace_id,
                        name=ent["name"],
                        type=ent.get("type", "Topic"),
                        description=ent.get("description"),
                        confidence=ent.get("confidence", 0.9)
                    )
                    db.add(new_ent)
                    await db.flush()
                    created_entities.append(new_ent)
                else:
                    created_entities.append(existing)

            for ev in events_data:
                st = None
                et = None
                if ev.get("start_time"):
                    try:
                        st = datetime.fromisoformat(str(ev["start_time"]))
                    except Exception:
                        pass
                if ev.get("end_time"):
                    try:
                        et = datetime.fromisoformat(str(ev["end_time"]))
                    except Exception:
                        pass
                event_obj = Event(
                    workspace_id=workspace_id,
                    title=ev.get("title", "Notice Event"),
                    start_time=st,
                    end_time=et,
                    event_type=ev.get("event_type", "general"),
                    confidence=ev.get("confidence", 0.9)
                )
                db.add(event_obj)

            await db.commit()

            # 4. RELATIONSHIP DETECTION AGENT
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Relationship Detection",
                "status": "running",
                "message": "Analyzing multi-entity dependencies and connections..."
            })

            # Fetch all workspace entities to find cross-source relationships
            stmt = select(Entity).where(Entity.workspace_id == workspace_id)
            all_workspace_entities_res = await db.execute(stmt)
            all_workspace_entities = all_workspace_entities_res.scalars().all()

            entities_dict_list = [{"name": e.name, "id": e.id, "type": e.type} for e in all_workspace_entities]
            rels_data = await relationship_agent.extract_relationships(entities_dict_list, content)

            entity_by_name = {e.name: e for e in all_workspace_entities}
            for rel in rels_data:
                s_name = rel.get("source_name")
                t_name = rel.get("target_name")
                if s_name in entity_by_name and t_name in entity_by_name:
                    src = entity_by_name[s_name]
                    tgt = entity_by_name[t_name]
                    
                    # Check if relationship already exists
                    stmt = select(Relationship).where(
                        Relationship.workspace_id == workspace_id,
                        Relationship.source_entity_id == src.id,
                        Relationship.target_entity_id == tgt.id,
                        Relationship.relationship_type == rel.get("relationship_type")
                    )
                    existing_rel = (await db.execute(stmt)).scalars().first()
                    if not existing_rel:
                        db_rel = Relationship(
                            workspace_id=workspace_id,
                            source_entity_id=src.id,
                            target_entity_id=tgt.id,
                            relationship_type=rel.get("relationship_type", "related_to"),
                            confidence=rel.get("confidence", 0.9),
                            evidence=[rel.get("evidence_summary")] if rel.get("evidence_summary") else []
                        )
                        db.add(db_rel)

            await db.commit()

            # 5. TEMPORAL & IMPACT REASONING
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Temporal & Impact Analysis",
                "status": "running",
                "message": "Detecting schedule overlaps, sequence clashes, and severity..."
            })

            # Fetch all workspace events
            ev_stmt = select(Event).where(Event.workspace_id == workspace_id)
            all_events = (await db.execute(ev_stmt)).scalars().all()
            events_json = [{"id": ev.id, "title": ev.title, "start_time": ev.start_time.isoformat() if ev.start_time else None, "end_time": ev.end_time.isoformat() if ev.end_time else None} for ev in all_events]
            
            temporal_clashes = temporal_agent.analyze_temporal_overlaps(events_json)

            # 6. DISCOVERY GENERATION AGENT
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Discovery Generation",
                "status": "running",
                "message": "Uncovering hidden relationships across documents..."
            })

            rels_stmt = select(Relationship).where(Relationship.workspace_id == workspace_id)
            all_rels = (await db.execute(rels_stmt)).scalars().all()
            rels_json = [{"source_id": r.source_entity_id, "target_id": r.target_entity_id, "type": r.relationship_type} for r in all_rels]

            # Check existing workspace discoveries for change detection
            disc_all_stmt = select(Discovery).where(Discovery.workspace_id == workspace_id)
            existing_discoveries = (await db.execute(disc_all_stmt)).scalars().all()
            existing_disc_dicts = [{"title": d.title, "type": d.type, "severity": d.severity} for d in existing_discoveries]

            # Find workspace owner for notifications
            ws_stmt = select(Workspace).where(Workspace.id == workspace_id)
            ws_obj = (await db.execute(ws_stmt)).scalar_one_or_none()
            owner_id = ws_obj.owner_id if ws_obj else None

            discoveries_raw = await discovery_agent.generate_discoveries(entities_dict_list, rels_json, temporal_clashes)

            # 7. CHANGE DETECTION AGENT
            changes = change_agent.detect_changes(
                current_entities=entities_dict_list,
                current_relationships=rels_json,
                new_discoveries=discoveries_raw,
                existing_discoveries=existing_disc_dicts
            )
            if changes:
                await realtime_manager.broadcast_event(workspace_id, "change_detected", {
                    "changes": changes,
                    "count": len(changes)
                })

            # 8. VERIFICATION AGENT (HALLUCINATION FIREWALL) & NOTIFICATIONS
            for disc in discoveries_raw:
                orig_type = disc.get("type", "inferred")
                v_res = verification_agent.verify_discovery(disc, [c["content"] for c in chunks_data])
                disc["confidence"] = v_res["confidence"]
                if orig_type in ["contradiction", "personalized_impact"]:
                    disc["type"] = orig_type
                else:
                    disc["type"] = v_res["classification"]

                # Check if discovery already recorded
                disc_stmt = select(Discovery).where(Discovery.workspace_id == workspace_id, Discovery.title == disc["title"])
                existing_disc = (await db.execute(disc_stmt)).scalars().first()
                if not existing_disc:
                    db_disc = Discovery(
                        workspace_id=workspace_id,
                        title=disc["title"],
                        description=disc["description"],
                        severity=disc.get("severity", "medium"),
                        impact_score=disc.get("impact_score", 50.0),
                        confidence=disc.get("confidence", 0.9),
                        type=disc.get("type", "inferred"),
                        evidence=disc.get("evidence", []),
                        reasoning=disc.get("reasoning", []),
                        affected_entities=disc.get("affected_entities", []),
                        recommended_actions=disc.get("recommended_actions", [])
                    )
                    db.add(db_disc)

                    # Proactive notifications for high-severity or specialized intelligence
                    if owner_id and (disc.get("severity") in ["high", "critical"] or disc.get("type") in ["contradiction", "personalized_impact"]):
                        notif_type = "alert" if disc.get("type") == "contradiction" else "warning"
                        notif = Notification(
                            user_id=owner_id,
                            workspace_id=workspace_id,
                            type=notif_type,
                            title=disc["title"],
                            message=disc["description"][:280]
                        )
                        db.add(notif)
                        await realtime_manager.broadcast_event(workspace_id, "new_notification", {
                            "title": notif.title,
                            "message": notif.message,
                            "type": notif.type
                        })

            # Update Source status to completed
            src_stmt = select(Source).where(Source.id == source_id)
            src_obj = (await db.execute(src_stmt)).scalar_one_or_none()
            if src_obj:
                src_obj.status = "completed"

            # Update Execution status
            execution.status = "completed"
            execution.completed_at = utc_now()
            await db.commit()

            # Final success event
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Complete",
                "status": "completed",
                "message": "Intelligence pipeline completed successfully."
            })

            # Asynchronously archive raw document payload to MongoDB Atlas
            await mongodb_service.archive_document(
                source_id=source_id,
                name=title,
                content=content,
                workspace_id=workspace_id
            )

            return execution.id

        except Exception as e:
            execution.status = "failed"
            execution.error = str(e)
            execution.completed_at = utc_now()
            await db.commit()
            
            await realtime_manager.broadcast_event(workspace_id, "agent_step", {
                "execution_id": execution.id,
                "step": "Pipeline Error",
                "status": "failed",
                "message": str(e)
            })
            raise e

pipeline = ProcessingPipeline()
