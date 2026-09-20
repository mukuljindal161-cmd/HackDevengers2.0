from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.core.database import get_db
from backend.app.models.models import Discovery, Workspace, Entity, Relationship, Event
from backend.app.schemas.schemas import DiscoveryResponse
from backend.app.api.deps import verify_workspace_access
from backend.app.agents.discovery_agent import discovery_agent
from backend.app.agents.temporal_agent import temporal_agent
from backend.app.agents.explanation_agent import explanation_agent

router = APIRouter()

@router.get("/workspaces/{workspace_id}/discoveries", response_model=List[DiscoveryResponse])
async def list_discoveries(
    workspace_id: str,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Discovery)
        .where(Discovery.workspace_id == workspace_id, Discovery.status != "dismissed")
        .order_by(Discovery.impact_score.desc(), Discovery.created_at.desc())
    )
    discoveries = (await db.execute(stmt)).scalars().all()
    return [DiscoveryResponse.model_validate(d) for d in discoveries]

@router.get("/discoveries/{discovery_id}", response_model=DiscoveryResponse)
async def get_discovery(discovery_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Discovery).where(Discovery.id == discovery_id)
    discovery = (await db.execute(stmt)).scalar_one_or_none()
    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")
    return DiscoveryResponse.model_validate(discovery)

@router.get("/discoveries/{discovery_id}/explain")
async def explain_discovery(discovery_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Discovery).where(Discovery.id == discovery_id)
    discovery = (await db.execute(stmt)).scalar_one_or_none()
    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")
    
    explanation = explanation_agent.format_explanation({
        "title": discovery.title,
        "description": discovery.description,
        "impact_score": discovery.impact_score,
        "confidence": discovery.confidence,
        "type": discovery.type,
        "reasoning": discovery.reasoning,
        "evidence": discovery.evidence,
        "affected_entities": discovery.affected_entities,
        "recommended_actions": discovery.recommended_actions
    })
    return explanation

@router.post("/workspaces/{workspace_id}/discoveries/generate", response_model=List[DiscoveryResponse])
async def trigger_discovery_generation(
    workspace_id: str,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    ent_stmt = select(Entity).where(Entity.workspace_id == workspace_id)
    entities = (await db.execute(ent_stmt)).scalars().all()

    rel_stmt = select(Relationship).where(Relationship.workspace_id == workspace_id)
    relationships = (await db.execute(rel_stmt)).scalars().all()

    ev_stmt = select(Event).where(Event.workspace_id == workspace_id)
    events = (await db.execute(ev_stmt)).scalars().all()

    temporal_clashes = temporal_agent.analyze_temporal_overlaps([
        {"id": e.id, "title": e.title, "start_time": e.start_time.isoformat() if e.start_time else None, "end_time": e.end_time.isoformat() if e.end_time else None}
        for e in events
    ])

    raw_disc = await discovery_agent.generate_discoveries(
        [{"name": e.name, "id": e.id} for e in entities],
        [{"source_id": r.source_entity_id, "target_id": r.target_entity_id, "type": r.relationship_type} for r in relationships],
        temporal_clashes
    )

    created = []
    for d in raw_disc:
        chk_stmt = select(Discovery).where(Discovery.workspace_id == workspace_id, Discovery.title == d["title"])
        existing = (await db.execute(chk_stmt)).scalars().first()
        if not existing:
            new_d = Discovery(
                workspace_id=workspace_id,
                title=d["title"],
                description=d["description"],
                severity=d.get("severity", "medium"),
                impact_score=d.get("impact_score", 50.0),
                confidence=d.get("confidence", 0.9),
                type=d.get("type", "inferred"),
                evidence=d.get("evidence", []),
                reasoning=d.get("reasoning", []),
                affected_entities=d.get("affected_entities", []),
                recommended_actions=d.get("recommended_actions", [])
            )
            db.add(new_d)
            created.append(new_d)
        else:
            created.append(existing)

    await db.commit()
    for item in created:
        await db.refresh(item)
    return [DiscoveryResponse.model_validate(d) for d in created]

@router.post("/discoveries/{discovery_id}/dismiss")
async def dismiss_discovery(discovery_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Discovery).where(Discovery.id == discovery_id)
    discovery = (await db.execute(stmt)).scalar_one_or_none()
    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")
    discovery.status = "dismissed"
    await db.commit()
    return {"message": "Discovery dismissed."}
