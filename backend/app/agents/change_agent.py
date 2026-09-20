from typing import List, Dict, Any, Optional

class ChangeAgent:
    """Detects delta changes, state evolutions, and emerging/resolving conflicts across document updates."""
    
    def detect_changes(
        self,
        current_entities: List[Dict[str, Any]],
        current_relationships: List[Dict[str, Any]],
        new_discoveries: List[Dict[str, Any]],
        existing_discoveries: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        changes = []
        existing_titles = {d.get("title") for d in existing_discoveries}
        
        # 1. Detect Emerged Conflicts & Contradictions
        for disc in new_discoveries:
            if disc.get("title") not in existing_titles:
                if disc.get("type") in ["contradiction", "personalized_impact"] or disc.get("severity") in ["high", "critical"]:
                    changes.append({
                        "change_type": "emerged_conflict",
                        "title": f"New Critical Alert: {disc.get('title')}",
                        "description": f"Ingestion introduced a high-priority risk: {disc.get('description')[:120]}...",
                        "severity": disc.get("severity", "high"),
                        "impact_delta": disc.get("impact_score", 85.0),
                        "affected_entities": disc.get("affected_entities", [])
                    })

        # 2. Detect Operational Status / Route Modifications
        for ent in current_entities:
            name = ent.get("name", "")
            desc = ent.get("description", "")
            if "closed" in desc.lower() or "diverted" in desc.lower() or "detour" in desc.lower():
                changes.append({
                    "change_type": "status_change",
                    "title": f"Operational State Shift: {name}",
                    "description": f"Entity condition modified to restricted access or route alteration.",
                    "severity": "medium",
                    "impact_delta": 40.0,
                    "affected_entities": [name]
                })

        return changes

change_agent = ChangeAgent()
