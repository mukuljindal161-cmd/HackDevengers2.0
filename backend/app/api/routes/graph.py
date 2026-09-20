from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.core.database import get_db
from backend.app.models.models import Entity, Relationship, Workspace, Chunk
from backend.app.schemas.schemas import EntityResponse, RelationshipResponse, GraphResponse, NeighborResponse
from backend.app.api.deps import verify_workspace_access
from backend.app.services.graph_service import graph_service

router = APIRouter()

@router.get("/workspaces/{workspace_id}/graph", response_model=GraphResponse)
async def get_graph(
    workspace_id: str,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    graph = await graph_service.get_workspace_graph(db, workspace_id)
    return GraphResponse(
        nodes=[EntityResponse.model_validate(n) for n in graph["nodes"]],
        edges=[RelationshipResponse.model_validate(e) for e in graph["edges"]]
    )

@router.get("/nodes/{node_id}", response_model=EntityResponse)
async def get_node(node_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Entity).where(Entity.id == node_id)
    node = (await db.execute(stmt)).scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    return EntityResponse.model_validate(node)

@router.get("/nodes/{node_id}/neighbors", response_model=NeighborResponse)
async def get_neighbors(node_id: str, db: AsyncSession = Depends(get_db)):
    data = await graph_service.get_node_neighbors(db, node_id)
    if not data:
        raise HTTPException(status_code=404, detail="Node not found")
    return NeighborResponse(
        entity=EntityResponse.model_validate(data["entity"]),
        in_edges=[RelationshipResponse.model_validate(e) for e in data["in_edges"]],
        out_edges=[RelationshipResponse.model_validate(e) for e in data["out_edges"]],
        neighbors=[EntityResponse.model_validate(n) for n in data["neighbors"]]
    )

@router.get("/edges/{edge_id}", response_model=RelationshipResponse)
async def get_edge(edge_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Relationship).where(Relationship.id == edge_id)
    edge = (await db.execute(stmt)).scalar_one_or_none()
    if not edge:
        raise HTTPException(status_code=404, detail="Edge not found")
    return RelationshipResponse.model_validate(edge)

@router.get("/nodes/{node_id}/evidence")
async def get_node_evidence(node_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Entity).where(Entity.id == node_id)
    node = (await db.execute(stmt)).scalar_one_or_none()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    
    # Gather evidence from connected relationships
    edge_stmt = select(Relationship).where(
        (Relationship.source_entity_id == node_id) | (Relationship.target_entity_id == node_id)
    )
    edges = (await db.execute(edge_stmt)).scalars().all()
    evidence_items = []
    for edge in edges:
        if edge.evidence:
            evidence_items.extend(edge.evidence)

    return {
        "node_id": node.id,
        "node_name": node.name,
        "evidence": list(set(evidence_items)) or ["Directly mentioned in ingested campus source notices."]
    }
