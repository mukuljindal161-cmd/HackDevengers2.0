from typing import List, Dict, Any
from datetime import datetime

class TemporalAgent:
    def analyze_temporal_overlaps(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detects date collisions, overlaps, and sequence conflicts."""
        clashes = []
        parsed_events = []
        
        for ev in events:
            st = ev.get("start_time")
            et = ev.get("end_time") or st
            if st:
                try:
                    # Parse ISO or date string
                    st_dt = datetime.fromisoformat(str(st))
                    et_dt = datetime.fromisoformat(str(et)) if et else st_dt
                    parsed_events.append({
                        "id": ev.get("id"),
                        "title": ev.get("title"),
                        "start": st_dt,
                        "end": et_dt,
                        "raw": ev
                    })
                except Exception:
                    pass

        # Check pairwise overlaps
        for i in range(len(parsed_events)):
            for j in range(i + 1, len(parsed_events)):
                e1 = parsed_events[i]
                e2 = parsed_events[j]
                
                # Check overlap: (StartA <= EndB) and (EndA >= StartB)
                if (e1["start"] <= e2["end"]) and (e1["end"] >= e2["start"]):
                    clashes.append({
                        "event_a": e1["title"],
                        "event_b": e2["title"],
                        "overlap_start": max(e1["start"], e2["start"]).isoformat(),
                        "overlap_end": min(e1["end"], e2["end"]).isoformat(),
                        "conflict_type": "Schedule Collision / Simultaneous Impact"
                    })
        return clashes

temporal_agent = TemporalAgent()
