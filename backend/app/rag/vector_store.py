import math
from typing import List, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.models.models import Chunk, Document, Source

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a, b in zip(v1, v1)))
    norm2 = math.sqrt(sum(b * b for a, b in zip(v2, v2)))
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return dot / (norm1 * norm2)

class VectorStore:
    async def search_similar_chunks(
        self,
        db: AsyncSession,
        workspace_id: str,
        query_vector: List[float],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        # Fetch chunks belonging to documents in the workspace
        stmt = (
            select(Chunk, Document.title, Source.name)
            .join(Document, Chunk.document_id == Document.id)
            .join(Source, Document.source_id == Source.id)
            .where(Source.workspace_id == workspace_id)
        )
        result = await db.execute(stmt)
        rows = result.all()
        
        scored_chunks = []
        for chunk, doc_title, source_name in rows:
            if chunk.embedding:
                score = cosine_similarity(query_vector, chunk.embedding)
                scored_chunks.append({
                    "id": chunk.id,
                    "content": chunk.content,
                    "chunk_index": chunk.chunk_index,
                    "score": round(score, 4),
                    "document_title": doc_title,
                    "source_name": source_name,
                    "metadata": chunk.metadata_
                })
        
        # Sort descending by similarity score
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]

vector_store = VectorStore()
