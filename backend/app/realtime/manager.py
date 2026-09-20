import asyncio
import json
from typing import Dict, List, Any
from fastapi import WebSocket

class RealtimeManager:
    def __init__(self):
        # workspace_id -> list of asyncio.Queue for SSE subscribers
        self._queues: Dict[str, List[asyncio.Queue]] = {}

    def subscribe(self, workspace_id: str) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue()
        if workspace_id not in self._queues:
            self._queues[workspace_id] = []
        self._queues[workspace_id].append(queue)
        return queue

    def unsubscribe(self, workspace_id: str, queue: asyncio.Queue):
        if workspace_id in self._queues and queue in self._queues[workspace_id]:
            self._queues[workspace_id].remove(queue)
            if not self._queues[workspace_id]:
                del self._queues[workspace_id]

    async def broadcast_event(self, workspace_id: str, event_type: str, data: Any):
        payload = json.dumps({"event": event_type, "data": data})
        if workspace_id in self._queues:
            for queue in self._queues[workspace_id]:
                await queue.put(payload)

realtime_manager = RealtimeManager()
