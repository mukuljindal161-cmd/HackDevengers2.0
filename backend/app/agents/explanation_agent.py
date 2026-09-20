from typing import Dict, Any, List

class ExplanationAgent:
    def format_explanation(self, discovery: Dict[str, Any]) -> Dict[str, Any]:
        """Generates deep explainability metadata answering 'Why?'."""
        return {
            "title": discovery.get("title"),
            "core_conclusion": discovery.get("description"),
            "impact_score": discovery.get("impact_score"),
            "confidence": f"{int(discovery.get('confidence', 0.9) * 100)}%",
            "classification": discovery.get("type", "inferred").upper(),
            "reasoning_chain": discovery.get("reasoning", []),
            "evidence_citations": discovery.get("evidence", []),
            "affected_entities": discovery.get("affected_entities", []),
            "action_items": discovery.get("recommended_actions", [])
        }

explanation_agent = ExplanationAgent()
