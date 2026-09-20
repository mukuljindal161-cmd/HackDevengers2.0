from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.core.database import get_db
from backend.app.models.models import Event, Workspace
from backend.app.schemas.schemas import EventResponse
from backend.app.api.deps import verify_workspace_access

router = APIRouter()

@router.get("/workspaces/{workspace_id}/timeline", response_model=List[EventResponse])
async def get_timeline(
    workspace_id: str,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Event)
        .where(Event.workspace_id == workspace_id)
        .order_by(Event.start_time.asc().nulls_last())
    )
    events = (await db.execute(stmt)).scalars().all()
    return [EventResponse.model_validate(e) for e in events]

@router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Event).where(Event.id == event_id)
    event = (await db.execute(stmt)).scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return EventResponse.model_validate(event)
