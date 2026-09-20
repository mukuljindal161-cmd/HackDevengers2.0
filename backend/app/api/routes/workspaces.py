from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.core.database import get_db
from backend.app.models.models import User, Workspace, WorkspaceMember
from backend.app.schemas.schemas import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse
from backend.app.api.deps import get_current_user, verify_workspace_access

router = APIRouter()

@router.get("", response_model=List[WorkspaceResponse])
async def list_workspaces(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Return workspaces owned or where user is member
    stmt = (
        select(Workspace)
        .outerjoin(WorkspaceMember, Workspace.id == WorkspaceMember.workspace_id)
        .where((Workspace.owner_id == current_user.id) | (WorkspaceMember.user_id == current_user.id))
        .distinct()
        .order_by(Workspace.created_at.desc())
    )
    workspaces = (await db.execute(stmt)).scalars().all()
    return [WorkspaceResponse.model_validate(w) for w in workspaces]

@router.post("", response_model=WorkspaceResponse)
async def create_workspace(
    ws_in: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    workspace = Workspace(
        owner_id=current_user.id,
        name=ws_in.name,
        description=ws_in.description
    )
    db.add(workspace)
    await db.flush()

    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=current_user.id,
        role="owner"
    )
    db.add(member)
    await db.commit()
    await db.refresh(workspace)
    return WorkspaceResponse.model_validate(workspace)

@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(workspace: Workspace = Depends(verify_workspace_access)):
    return WorkspaceResponse.model_validate(workspace)

@router.patch("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    ws_in: WorkspaceUpdate,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    if ws_in.name is not None:
        workspace.name = ws_in.name
    if ws_in.description is not None:
        workspace.description = ws_in.description
    await db.commit()
    await db.refresh(workspace)
    return WorkspaceResponse.model_validate(workspace)

@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    await db.delete(workspace)
    await db.commit()
    return {"message": "Workspace deleted successfully."}
