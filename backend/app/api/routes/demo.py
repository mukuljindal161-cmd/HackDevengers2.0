from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import get_db
from backend.app.models.models import Workspace, Source
from backend.app.api.deps import verify_workspace_access
from backend.app.workflows.pipeline import pipeline

router = APIRouter()

DEMO_DOCUMENTS = [
    {
        "name": "Mid-Semester Examination Schedule.txt",
        "type": "txt",
        "content": (
            "CAMPUS ACADEMIC NOTICE - FALL 2026\n"
            "Subject: Mid-Semester Examination Schedule\n"
            "Date: September 20, 2026\n"
            "Start Time: 09:00 AM\n"
            "End Time: 12:00 PM\n"
            "Location: Academic Block A, Examination Hall 101.\n"
            "All registered students in Computer Science and Engineering must report by 08:45 AM.\n"
            "No late entries permitted after 09:15 AM."
        )
    },
    {
        "name": "Campus Construction Advisory - Main Gate.txt",
        "type": "txt",
        "content": (
            "DEPARTMENT OF ESTATE & INFRASTRUCTURE\n"
            "Urgent Roadworks and Pipeline Maintenance Notice\n"
            "Effective Dates: September 19, 2026 to September 21, 2026.\n"
            "The Campus Main Gate will be completely closed to all vehicular and shuttle traffic.\n"
            "Emergency vehicles and pedestrian detours will be redirected to the North Gate perimeter."
        )
    },
    {
        "name": "Campus Shuttle & Transit Advisory.txt",
        "type": "txt",
        "content": (
            "CAMPUS TRANSPORTATION SERVICES\n"
            "Advisory regarding Transit Line Detours:\n"
            "Due to the Main Gate closure scheduled September 19–21, 2026, Bus Route 4 will be diverted.\n"
            "Bus Route 4 normally passes through Main Gate directly to Academic Block A.\n"
            "During the closure, Route 4 will terminate at Outer Ring Road, requiring a 25-minute transfer or walk."
        )
    },
    {
        "name": "Met Office Weather Warning.txt",
        "type": "txt",
        "content": (
            "METEOROLOGICAL SERVICES FORECAST BULLETIN\n"
            "Weather Alert: September 20, 2026.\n"
            "Severe localized storm system forecasted. Heavy rainfall and waterlogging expected between 06:00 AM and 03:00 PM.\n"
            "City transit and arterial roads surrounding the campus may experience severe congestion and 30-40 min travel delays."
        )
    },
    {
        "name": "Student Profile & Academic Record.txt",
        "type": "txt",
        "content": (
            "STUDENT REGISTRATION RECORD\n"
            "Student Name: Alex Morgan (ID: STU-8921)\n"
            "Major: Computer Science (Semester 5)\n"
            "Venue: Academic Block A\n"
            "Daily Transit Mode: Bus Route 4 commuter from South City Terminal."
        )
    }
]

@router.post("/workspaces/{workspace_id}/load-demo")
async def load_demo_dataset(
    workspace_id: str,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    results = []
    for doc in DEMO_DOCUMENTS:
        source = Source(
            workspace_id=workspace_id,
            name=doc["name"],
            type=doc["type"],
            status="processing",
            metadata_={"is_demo": True}
        )
        db.add(source)
        await db.commit()
        await db.refresh(source)

        await pipeline.process_source(db, source.id, doc["content"], doc["name"], workspace_id)
        results.append({"id": source.id, "name": source.name, "status": "completed"})

    return {
        "message": "Demo dataset loaded and processed through the AI intelligence pipeline successfully.",
        "documents_processed": len(results),
        "sources": results
    }
