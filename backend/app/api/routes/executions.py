import asyncio
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.core.database import get_db
from backend.app.models.models import Execution, Workspace
from backend.app.schemas.schemas import ExecutionResponse, ExecutionStep
from backend.app.api.deps import verify_workspace_access
from backend.app.realtime.manager import realtime_manager

router = APIRouter()

@router.get("/workspaces/{workspace_id}/executions", response_model=List[ExecutionResponse])
async def list_executions(
    workspace_id: str,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Execution)
        .where(Execution.workspace_id == workspace_id)
        .order_by(Execution.started_at.desc())
        .limit(20)
    )
    executions = (await db.execute(stmt)).scalars().all()
    
    resp = []
    for ex in executions:
        resp.append(ExecutionResponse(
            id=ex.id,
            workspace_id=ex.workspace_id,
            workflow_id=ex.workflow_id,
            status=ex.status,
            started_at=ex.started_at,
            completed_at=ex.completed_at,
            steps=[]
        ))
    return resp

@router.get("/workspaces/{workspace_id}/events")
async def sse_events_stream(
    workspace_id: str,
    request: Request
):
    """Server-Sent Events (SSE) stream for live agent execution progress."""
    queue = realtime_manager.subscribe(workspace_id)

    async def event_generator():
        try:
            # Yield initial connection confirmation
            yield f"data: {{\"event\": \"connected\", \"workspace_id\": \"{workspace_id}\"}}\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    payload = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"data: {payload}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive ping
                    yield ": ping\n\n"
        finally:
            realtime_manager.unsubscribe(workspace_id, queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )
