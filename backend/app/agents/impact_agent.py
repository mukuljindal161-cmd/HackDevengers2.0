from typing import List, Dict, Any

class ImpactAgent:
    def evaluate_impact(
        self,
        severity: str,
        affected_entities_count: int,
        confidence: float,
        has_temporal_overlap: bool = False,
        path_length: int = 2
    ) -> Dict[str, Any]:
        """Calculates a transparent, explainable impact score (0-100)."""
        severity_base = {
            "low": 20,
            "medium": 45,
            "high": 70,
            "critical": 90
        }.get(severity.lower(), 40)

        # Multipliers / Additions
        entity_factor = min(affected_entities_count * 5, 20)
        overlap_bonus = 15 if has_temporal_overlap else 0
        depth_bonus = min(path_length * 3, 10)
        
        raw_score = (severity_base * 0.5) + (entity_factor) + (overlap_bonus) + (depth_bonus)
        # Scale with confidence
        final_score = min(max(round(raw_score * confidence, 1), 10.0), 99.0)

        urgency = "High" if final_score > 75 else "Medium" if final_score > 40 else "Low"

        return {
            "impact_score": final_score,
            "severity": severity,
            "urgency": urgency,
            "breakdown": {
                "severity_base": severity_base,
                "affected_entities_bonus": entity_factor,
                "temporal_overlap_bonus": overlap_bonus,
                "confidence_factor": round(confidence, 2)
            }
        }

impact_agent = ImpactAgent()
