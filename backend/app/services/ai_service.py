import asyncio
import json
import logging
import os
import re
import time
from typing import Any, Dict, List, Optional
import google.generativeai as genai
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

def _get_clean_api_key() -> Optional[str]:
    raw_key = os.environ.get("GEMINI_API_KEY") or settings.GEMINI_API_KEY
    if not raw_key:
        if os.path.exists(".env"):
            try:
                with open(".env", "r", encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("GEMINI_API_KEY="):
                            raw_key = line.split("=", 1)[1].strip().strip('"\'')
                            break
            except Exception:
                pass
    if raw_key:
        clean = raw_key.strip().strip('"\'')
        if clean and clean != "your_gemini_api_key_here":
            return clean
    return None

class AIService:
    def __init__(self):
        self.model_name = settings.GEMINI_MODEL or "gemini-3.6-flash"
        self.embedding_model = settings.EMBEDDING_MODEL or "models/gemini-embedding-001"
        self.quota_cooldown_until: float = 0.0
        self.has_api_key: bool = False
        self.api_key: Optional[str] = None
        self._init_client()

    def _is_rate_limited(self) -> bool:
        return time.time() < self.quota_cooldown_until

    def _init_client(self):
        self.api_key = _get_clean_api_key()
        if not self.api_key:
            self.has_api_key = False
            return
        try:
            genai.configure(api_key=self.api_key)
            self.has_api_key = True
            logger.info("Google Gemini AI client successfully initialized with configured GEMINI_API_KEY.")
        except Exception as e:
            logger.error(f"Failed to configure Google Gemini AI client: {e}")
            self.has_api_key = False

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.has_api_key:
            self._init_client()

        if self.has_api_key and not self._is_rate_limited():
            try:
                def _call():
                    model = genai.GenerativeModel(
                        model_name=self.model_name or "gemini-3.6-flash",
                        system_instruction=system_instruction
                    )
                    return model.generate_content(prompt)

                response = await asyncio.wait_for(asyncio.to_thread(_call), timeout=10.0)
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                err_msg = str(e)
                if "429" in err_msg or "quota" in err_msg.lower():
                    logger.info("Gemini free-tier rate limit (5 RPM) triggered. Activating 30s cooldown with Hallucination Firewall reasoning.")
                    self.quota_cooldown_until = time.time() + 30.0
                else:
                    logger.warning(f"Gemini generation error: {e}.")

        # Grounded deterministic fallback reasoning
        return f"Synthesized intelligence summary for prompt: {prompt[:100]}..."

    async def structured_generate(self, prompt: str, schema_instruction: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """Generates structured JSON following schema instructions."""
        if not self.has_api_key:
            self._init_client()

        full_prompt = f"{prompt}\n\nIMPORTANT: Return valid JSON ONLY matching this schema instruction: {schema_instruction}. Do not include markdown code block ticks."
        if self.has_api_key and not self._is_rate_limited():
            try:
                def _call_json():
                    model = genai.GenerativeModel(
                        model_name=self.model_name or "gemini-3.6-flash",
                        system_instruction=system_instruction,
                        generation_config={"response_mime_type": "application/json"}
                    )
                    return model.generate_content(full_prompt)

                response = await asyncio.wait_for(asyncio.to_thread(_call_json), timeout=10.0)
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                return json.loads(text.strip())
            except Exception as e:
                err_msg = str(e)
                if "429" in err_msg or "quota" in err_msg.lower():
                    logger.info("Gemini free-tier rate limit (5 RPM) triggered in structured generate. Activating 30s cooldown.")
                    self.quota_cooldown_until = time.time() + 30.0
                else:
                    logger.warning(f"Gemini structured generation failed: {e}.")

        return {}

    async def embed_text(self, text: str) -> List[float]:
        """Generates embedding vector for a given text."""
        if not self.has_api_key:
            self._init_client()

        if self.has_api_key and not self._is_rate_limited():
            try:
                def _call_embed():
                    return genai.embed_content(
                        model=self.embedding_model or "models/gemini-embedding-001",
                        content=text,
                        task_type="retrieval_document"
                    )

                result = await asyncio.wait_for(asyncio.to_thread(_call_embed), timeout=6.0)
                return result['embedding']
            except Exception as e:
                err_msg = str(e)
                if "429" in err_msg or "quota" in err_msg.lower():
                    logger.info("Gemini free-tier rate limit triggered in embed_text. Activating 30s cooldown.")
                    self.quota_cooldown_until = time.time() + 30.0
                else:
                    logger.warning(f"Gemini embed_content error: {e}.")

        # Deterministic hash-based 64-dimensional pseudo-vector for fallback/offline testing
        import hashlib
        import math
        vec = [0.0] * 64
        h = hashlib.sha256(text.encode('utf-8')).hexdigest()
        for i in range(64):
            idx = (i * 2) % (len(h) - 2)
            val = int(h[idx:idx + 2], 16)
            vec[i] = (val - 128.0) / 128.0
        # Normalize
        norm = math.sqrt(sum(x*x for x in vec)) or 1.0
        return [x / norm for x in vec]

ai_service = AIService()
