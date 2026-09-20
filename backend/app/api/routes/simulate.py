from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models.models import Workspace
from backend.app.schemas.schemas import SimulationRequest, SimulationResponse, EntityResponse
from backend.app.api.deps import verify_workspace_access
from backend.app.services.graph_service import graph_service
from backend.app.services.mongodb_service import mongodb_service

router = APIRouter()

@router.post("/workspaces/{workspace_id}/simulate", response_model=SimulationResponse)
async def simulate_scenario(
    workspace_id: str,
    sim_in: SimulationRequest,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    change = sim_in.change
    result = await graph_service.simulate_change(
        db=db,
        workspace_id=workspace_id,
        entity_name=change.entity,
        property_name=change.property,
        new_value=change.value
    )

    # Asynchronously archive simulation to MongoDB Atlas
    await mongodb_service.archive_simulation(
        workspace_id=workspace_id,
        change={"entity": change.entity, "property": change.property, "value": change.value},
        simulation_result=result
    )

    return SimulationResponse(
        simulation_id=result["simulation_id"],
        original_state=result["original_state"],
        modified_state=result["modified_state"],
        impacted_nodes=[EntityResponse.model_validate(n) for n in result["impacted_nodes"]],
        new_conflicts=result["new_conflicts"],
        resolved_conflicts=result["resolved_conflicts"],
        summary=result["summary"]
    )

@router.get("/simulations/{simulation_id}", response_model=SimulationResponse)
async def get_simulation_by_id(simulation_id: str):
    result = graph_service.get_simulation(simulation_id)
    if not result:
        raise HTTPException(status_code=404, detail="Simulation record not found")
    return SimulationResponse(
        simulation_id=result["simulation_id"],
        original_state=result["original_state"],
        modified_state=result["modified_state"],
        impacted_nodes=[EntityResponse.model_validate(n) for n in result["impacted_nodes"]],
        new_conflicts=result["new_conflicts"],
        resolved_conflicts=result["resolved_conflicts"],
        summary=result["summary"]
    )

@router.get("/workspaces/{workspace_id}/simulations/{simulation_id}", response_model=SimulationResponse)
async def get_workspace_simulation(
    workspace_id: str,
    simulation_id: str,
    workspace: Workspace = Depends(verify_workspace_access)
):
    return await get_simulation_by_id(simulation_id)

