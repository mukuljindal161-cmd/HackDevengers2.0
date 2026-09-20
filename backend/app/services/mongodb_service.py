import asyncio
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class MongoDBService:
    def __init__(self):
        self.client = None
        self.db = None
        self.is_connected = False
        self._init_connection()

    def _init_connection(self):
        mongo_url = settings.MONGODB_URL
        if not mongo_url or not mongo_url.startswith("mongodb"):
            self.is_connected = False
            return

        try:
            from pymongo import MongoClient
            self.client = MongoClient(
                mongo_url,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                socketTimeoutMS=5000,
                appname="RealityGraph"
            )
            self.db = self.client.get_database("realitygraph")
            self.is_connected = True
            logger.info("MongoDB Atlas client configured successfully for 'realitygraph' database.")
        except Exception as e:
            logger.warning(f"Failed to initialize MongoDB Atlas client: {e}")
            self.is_connected = False
            self.client = None
            self.db = None

    def check_connection(self) -> bool:
        """Pings MongoDB Atlas to verify live connectivity."""
        if not self.is_connected or self.client is None:
            return False
        try:
            self.client.admin.command('ping')
            return True
        except Exception as e:
            logger.debug(f"MongoDB ping failed: {e}")
            return False

    async def ping_async(self) -> bool:
        """Asynchronously tests connection without blocking the main event loop."""
        try:
            return await asyncio.wait_for(asyncio.to_thread(self.check_connection), timeout=5.0)
        except Exception:
            return False

    async def archive_document(self, source_id: str, name: str, content: str, workspace_id: str, metadata: Optional[Dict[str, Any]] = None):
        """Archives an ingested document into MongoDB Atlas."""
        if not self.is_connected or self.db is None:
            return

        def _insert():
            try:
                coll = self.db["documents"]
                doc = {
                    "source_id": source_id,
                    "name": name,
                    "content": content,
                    "workspace_id": workspace_id,
                    "metadata": metadata or {},
                    "archived_at": datetime.now(timezone.utc).isoformat()
                }
                coll.update_one({"source_id": source_id}, {"$set": doc}, upsert=True)
                logger.info(f"Archived document '{name}' ({source_id}) to MongoDB Atlas.")
            except Exception as e:
                logger.warning(f"Failed to archive document to MongoDB Atlas: {e}")

        try:
            await asyncio.to_thread(_insert)
        except Exception as e:
            logger.warning(f"Non-blocking MongoDB document archive error: {e}")

    async def archive_query_log(self, question: str, workspace_id: str, conclusion: str, confidence: float, reasoning_steps: list, sources: list):
        """Archives a user query and synthesis result to MongoDB Atlas."""
        if not self.is_connected or self.db is None:
            return

        def _insert():
            try:
                coll = self.db["query_logs"]
                log_entry = {
                    "question": question,
                    "workspace_id": workspace_id,
                    "conclusion": conclusion,
                    "confidence": confidence,
                    "reasoning_steps": reasoning_steps,
                    "sources_count": len(sources),
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                coll.insert_one(log_entry)
                logger.info(f"Archived query log for '{question[:40]}...' to MongoDB Atlas.")
            except Exception as e:
                logger.warning(f"Failed to archive query log to MongoDB Atlas: {e}")

        try:
            await asyncio.to_thread(_insert)
        except Exception as e:
            logger.warning(f"Non-blocking MongoDB query archive error: {e}")

    async def archive_simulation(self, workspace_id: str, change: Dict[str, Any], simulation_result: Dict[str, Any]):
        """Archives a what-if simulation run and counterfactual outcome to MongoDB Atlas."""
        if not self.is_connected or self.db is None:
            return

        def _insert():
            try:
                coll = self.db["simulation_audits"]
                record = {
                    "workspace_id": workspace_id,
                    "change": change,
                    "impacted_nodes_count": len(simulation_result.get("impacted_nodes", [])),
                    "new_conflicts": simulation_result.get("new_conflicts", []),
                    "resolved_conflicts": simulation_result.get("resolved_conflicts", []),
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                coll.insert_one(record)
                logger.info("Archived simulation audit to MongoDB Atlas.")
            except Exception as e:
                logger.warning(f"Failed to archive simulation to MongoDB Atlas: {e}")

        try:
            await asyncio.to_thread(_insert)
        except Exception as e:
            logger.warning(f"Non-blocking MongoDB simulation archive error: {e}")

mongodb_service = MongoDBService()
