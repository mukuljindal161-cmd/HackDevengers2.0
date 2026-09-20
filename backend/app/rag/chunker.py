import re
from typing import List, Dict, Any

def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[Dict[str, Any]]:
    """Chunks text into sliding window passages with metadata."""
    cleaned_text = re.sub(r'\s+', ' ', text).strip()
    if not cleaned_text:
        return []
        
    words = cleaned_text.split(' ')
    chunks = []
    start = 0
    chunk_index = 0
    
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk_content = ' '.join(words[start:end])
        chunks.append({
            "chunk_index": chunk_index,
            "content": chunk_content,
            "metadata": {
                "word_count": len(words[start:end]),
                "start_word": start,
                "end_word": end
            }
        })
        chunk_index += 1
        if end == len(words):
            break
        start += (chunk_size - overlap)
        
    return chunks
