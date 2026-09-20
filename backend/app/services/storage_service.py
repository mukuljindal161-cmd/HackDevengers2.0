import os
import aiofiles
from pathlib import Path
from backend.app.core.config import settings

class StorageService:
    def __init__(self):
        self.base_dir = Path(settings.STORAGE_LOCAL_DIR)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def save_file(self, filename: str, content: bytes, workspace_id: str) -> str:
        workspace_dir = self.base_dir / workspace_id
        workspace_dir.mkdir(parents=True, exist_ok=True)
        file_path = workspace_dir / filename
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
        return str(file_path)

    async def read_file(self, storage_path: str) -> bytes:
        async with aiofiles.open(storage_path, "rb") as f:
            return await f.read()

storage_service = StorageService()
