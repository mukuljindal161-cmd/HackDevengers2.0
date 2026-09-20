from typing import List, Optional
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pypdf import PdfReader

from backend.app.core.database import get_db
from backend.app.models.models import Source, Document, Chunk, Entity, Workspace
from backend.app.schemas.schemas import SourceCreate, SourceResponse, SourceStatusResponse
from backend.app.api.deps import verify_workspace_access
from backend.app.services.storage_service import storage_service
from backend.app.workflows.pipeline import pipeline

router = APIRouter()

@router.get("/workspaces/{workspace_id}/sources", response_model=List[SourceResponse])
async def list_sources(
    workspace_id: str,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Source).where(Source.workspace_id == workspace_id).order_by(Source.created_at.desc())
    sources = (await db.execute(stmt)).scalars().all()
    return [SourceResponse.model_validate(s) for s in sources]

@router.post("/workspaces/{workspace_id}/sources", response_model=SourceResponse)
async def create_source(
    workspace_id: str,
    source_in: SourceCreate,
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    source = Source(
        workspace_id=workspace_id,
        name=source_in.name,
        type=source_in.type,
        uri=source_in.uri,
        status="processing",
        metadata_=source_in.metadata or {}
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)

    content = source_in.content or ""
    # Process through intelligence pipeline asynchronously
    await pipeline.process_source(db, source.id, content, source.name, workspace_id)
    await db.refresh(source)
    return SourceResponse.model_validate(source)

@router.post("/workspaces/{workspace_id}/sources/upload", response_model=SourceResponse)
async def upload_source_file(
    workspace_id: str,
    file: UploadFile = File(...),
    workspace: Workspace = Depends(verify_workspace_access),
    db: AsyncSession = Depends(get_db)
):
    content_bytes = await file.read()
    filename = file.filename or "uploaded_file"
    file_type = "txt"
    extracted_text = ""

    if filename.lower().endswith(".pdf"):
        file_type = "pdf"
        try:
            reader = PdfReader(io.BytesIO(content_bytes))
            for page in reader.pages:
                extracted_text += page.extract_text() or ""
        except Exception as e:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")
    else:
        file_type = "txt"
        extracted_text = content_bytes.decode("utf-8", errors="ignore")

    storage_path = await storage_service.save_file(filename, content_bytes, workspace_id)

    source = Source(
        workspace_id=workspace_id,
        name=filename,
        type=file_type,
        storage_path=storage_path,
        status="processing",
        metadata_={"filesize": len(content_bytes), "content_type": file.content_type}
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)

    # Process through pipeline
    await pipeline.process_source(db, source.id, extracted_text, filename, workspace_id)
    await db.refresh(source)
    return SourceResponse.model_validate(source)

@router.get("/sources/{source_id}", response_model=SourceResponse)
async def get_source(source_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Source).where(Source.id == source_id)
    source = (await db.execute(stmt)).scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    return SourceResponse.model_validate(source)

@router.delete("/sources/{source_id}")
async def delete_source(source_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Source).where(Source.id == source_id)
    source = (await db.execute(stmt)).scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    await db.delete(source)
    await db.commit()
    return {"message": "Source deleted successfully."}

@router.get("/sources/{source_id}/status", response_model=SourceStatusResponse)
async def get_source_status(source_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Source).where(Source.id == source_id)
    source = (await db.execute(stmt)).scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")

    # Count chunks
    chunk_stmt = (
        select(func.count(Chunk.id))
        .join(Document, Chunk.document_id == Document.id)
        .where(Document.source_id == source_id)
    )
    chunk_count = (await db.execute(chunk_stmt)).scalar() or 0

    return SourceStatusResponse(
        source_id=source.id,
        status=source.status,
        chunks_count=chunk_count,
        entities_count=0
    )
