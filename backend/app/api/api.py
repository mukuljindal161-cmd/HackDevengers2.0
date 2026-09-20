from fastapi import APIRouter

from backend.app.api.routes import (
    health,
    auth,
    workspaces,
    sources,
    graph,
    discoveries,
    timeline,
    query,
    simulate,
    executions,
    demo,
    notifications
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["Workspaces"])
api_router.include_router(sources.router, tags=["Sources"])
api_router.include_router(graph.router, tags=["Graph"])
api_router.include_router(discoveries.router, tags=["Discoveries"])
api_router.include_router(timeline.router, tags=["Timeline"])
api_router.include_router(query.router, tags=["Query"])
api_router.include_router(simulate.router, tags=["Simulate"])
api_router.include_router(executions.router, tags=["Executions"])
api_router.include_router(demo.router, tags=["Demo"])
api_router.include_router(notifications.router, tags=["Notifications"])
