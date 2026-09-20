# RealityGraph — Spec Addendum

This is an **addendum to the existing RealityGraph specification**, not a replacement.

The existing specification remains the primary engineering contract. **Do not restart, rewrite, or unnecessarily refactor completed work.** Continue from the current implementation state and use the priorities below to guide remaining development.

## 1. Feature Priority

### MUST HAVE — Build Regardless

These are required for a functional hackathon MVP:

* Authentication
* Workspace / Command Center
* Source upload and management
* PDF/TXT/document ingestion
* Text extraction and chunking
* Embeddings + vector search
* Entity extraction
* Relationship extraction
* Knowledge graph
* Hybrid RAG + graph retrieval
* Discovery / hidden-connection detection
* Evidence-backed answers
* Source citations / evidence panel
* Natural-language querying
* Basic confidence scoring
* Reliable end-to-end demo flow

### IF TIME PERMITS

Build these only after the MVP works reliably:

* Timeline intelligence
* Change detection
* Contradiction detection
* Personalized impact analysis
* Impact scoring
* Realtime processing/status
* Better graph interactions
* Notifications
* Additional document formats
* Advanced filtering/search

### IF EVERYTHING GOES WELL — GO CRAZY

Only attempt these after all core functionality is stable:

* What-if simulation
* Counterfactual reasoning
* Predictive impact analysis
* Autonomous monitoring
* Advanced multi-agent reasoning
* Continuous information ingestion
* Advanced contradiction resolution

**Never sacrifice MVP reliability for bonus features.**

---

## 2. Command Center

The main authenticated experience should feel like an **AI Intelligence Command Center**, not a generic admin dashboard.

The Command Center should communicate:

* What information has been ingested
* What the system currently understands
* Important discovered relationships
* Active risks / impacts
* Recent discoveries
* Processing status
* Knowledge graph overview
* Quick natural-language query

The user should immediately understand:

> "This system is continuously connecting information and discovering consequences I may have missed."

---

## 3. Explainability Architecture

Explainability is a **first-class feature**, not a cosmetic UI element.

Every important AI-generated discovery or conclusion should be traceable to evidence.

For each inference, maintain:

* Conclusion
* Fact vs inference vs speculation
* Confidence score
* Supporting entities
* Supporting relationships
* Source document(s)
* Relevant source chunks
* Reasoning/evidence chain
* Timestamp where applicable

When the user clicks **"Why?"**, show a clear evidence chain such as:

`Exam Schedule → Exam on Monday`
↓
`Construction Notice → Main Gate closed Monday`
↓
`Transport Notice → Route 4 diverted`
↓
`Student Profile → User normally uses Route 4`
↓
`Inference → User may need additional travel time`

The user should be able to distinguish:

**What the documents explicitly say**
from
**What RealityGraph inferred from those facts.**

---

## 4. Hallucination Firewall

Implement a lightweight **Hallucination Firewall** for AI-generated insights.

Rules:

1. AI must not present unsupported information as fact.
2. Important claims must have evidence IDs/source references.
3. Clearly label inferred conclusions.
4. Assign confidence to non-trivial inferences.
5. If evidence is insufficient, say so instead of inventing an answer.
6. If sources contradict each other, surface the contradiction.
7. Never fabricate document names, citations, dates, people, or relationships.

Preferred response structure:

```text
Conclusion
Type: Confirmed / Inferred / Speculative
Confidence: 0–100%

Why:
1. Evidence A
2. Evidence B
3. Relationship connecting A → B

Sources:
- Document X
- Document Y
```

This is a major part of RealityGraph's differentiation.

---

## 5. Demo-First Engineering

Every major implementation decision should be evaluated against the final hackathon demo.

The critical demo path is:

`Upload Documents`
→ `AI Processing`
→ `Entities Extracted`
→ `Relationships Discovered`
→ `Knowledge Graph`
→ `Hidden Connection`
→ `Why?`
→ `Evidence Chain`
→ `Natural Language Query`
→ `Impact / Consequence`

This flow must work reliably before advanced features are attempted.

Avoid fake functionality. If a feature cannot be implemented robustly within the available time, reduce its scope rather than creating a misleading simulation.

---

## 6. Implementation Strategy

Use the following order:

**Phase 1:** Make the application run end-to-end.

**Phase 2:** Make ingestion + RAG reliable.

**Phase 3:** Make entity + relationship extraction reliable.

**Phase 4:** Make the knowledge graph useful and visually understandable.

**Phase 5:** Implement discovery + evidence + explainability.

**Phase 6:** Polish the Command Center and demo experience.

**Phase 7:** Add bonus features only if the complete MVP is stable.

At every phase:

`Build → Run → Test → Fix → Verify → Continue`

Do not proceed while a critical previous phase is broken.

---

## 7. Hackathon Scope Rule

This is a 24-hour hackathon project.

Prioritize:

**Functionality > Reliability > Demo Experience > Visual Polish > Bonus Features**

Do not over-engineer infrastructure that does not contribute to the working demo.

Prefer simple, maintainable implementations that can be completed and demonstrated reliably.

---

## 8. Requirements Traceability

For every major feature, maintain this mental mapping:

`Hackathon Goal`
→ `RealityGraph Feature`
→ `Technical Implementation`
→ `Visible Demo Moment`
→ `Judging Value`

Prioritize features that simultaneously demonstrate:

* Innovation
* Technical implementation
* Problem solving
* Functionality
* User experience
* Real-world impact
* Scalability

---

## 9. Current-State Rule

Before implementing this addendum:

1. Inspect the current codebase.
2. Identify what from the original specification is already implemented.
3. Do **not** rebuild completed functionality.
4. Do **not** introduce unnecessary architectural changes.
5. Continue from the current state.
6. Focus remaining effort on the highest-priority incomplete functionality.

The original specification + this addendum together form the current RealityGraph development direction.
