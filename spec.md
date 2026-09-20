# RealityGraph

## Spec-Driven Development Specification

**Version:** 1.0
**Project Type:** 24-Hour Open Innovation Hackathon
**Hackathon:** HackDevengers 2.0
**Development Environment:** Google Antigravity
**Primary Goal:** Build a working, polished, demonstrable MVP with strong innovation, technical depth, explainable AI, and real-world scalability.

---

# 1. Project Overview

## 1.1 Product Name

**RealityGraph**

### Tagline

> **Information tells you what happened. RealityGraph tells you what it means.**

---

## 1.2 Core Problem

Modern organizations and individuals have large amounts of fragmented information distributed across:

* PDFs
* Notices
* Documents
* Emails
* Web pages
* Images
* Announcements
* Calendars
* Schedules
* Reports
* Policies
* Structured data

Traditional search and RAG systems retrieve relevant documents when a user asks a question, but they generally do not proactively identify relationships between seemingly unrelated pieces of information.

For example:

* An examination is scheduled for September 20.
* A campus gate is closed from September 19–21.
* A bus route passes through that gate.
* Heavy rainfall is expected on September 20.

Each piece of information is individually understandable.

The important insight emerges only when they are connected:

> **The student's examination commute may be significantly affected.**

RealityGraph exists to discover these hidden relationships and convert fragmented information into **explainable, actionable insights**.

---

# 2. Product Vision

RealityGraph is an AI-powered **Context and Relationship Intelligence Platform**.

It ingests information from multiple sources, extracts entities/events/facts, constructs a dynamic knowledge graph, identifies relationships and dependencies, performs temporal and impact reasoning, and presents actionable discoveries to users.

The system should answer not only:

> "What does this document say?"

but:

> "What does all this information mean together?"

and:

> "How does it affect me?"

---

# 3. Product Principles

The application must follow these principles:

1. **Evidence before inference**
2. **Relationships over isolated facts**
3. **Explainability over black-box conclusions**
4. **Actionable insights over information overload**
5. **Confidence-aware reasoning**
6. **Human-readable AI explanations**
7. **Source traceability**
8. **Privacy by design**
9. **Modular architecture**
10. **MVP-first development**

---

# 4. Primary Use Case

The initial MVP should focus on **college/campus intelligence**, because it provides an easily understandable demonstration dataset while keeping the architecture general-purpose.

Example sources:

* Exam schedules
* Academic calendars
* Campus notices
* Transport notices
* Hostel notices
* Event announcements
* Scholarship deadlines
* Construction notices
* Weather information
* College policies

However, the backend and data model must remain domain-agnostic enough to later support:

* Organizations
* Businesses
* Government
* Disaster management
* Personal productivity
* Supply chains
* Research
* Enterprise intelligence

---

# 5. Core User Journey

```text
User
 ↓
Create account / Login
 ↓
Create Workspace
 ↓
Upload or connect information sources
 ↓
Document ingestion
 ↓
Text extraction
 ↓
Chunking
 ↓
Embedding generation
 ↓
Vector storage
 ↓
Entity/Event extraction
 ↓
Relationship extraction
 ↓
Knowledge Graph construction
 ↓
Temporal reasoning
 ↓
Impact analysis
 ↓
Confidence evaluation
 ↓
Discovery generation
 ↓
User explores graph
 ↓
User asks natural-language questions
 ↓
AI answers with evidence
```

---

# 6. Core Innovation

RealityGraph must NOT behave like a conventional chatbot.

The primary interface is a **dynamic information graph + discovery engine**.

The system should discover relationships such as:

```text
Exam
 ├── occurs_on → September 20
 ├── located_at → Block A
 └── affected_by → Road Closure

Road Closure
 ├── affects → Main Gate
 └── affects → Bus Route 4

Bus Route 4
 └── used_by → Student

Weather Event
 └── increases → Travel Risk
```

The resulting insight:

> **Your September 20 examination may be affected by the main gate closure and Route 4 diversion. Heavy rainfall may further increase travel time.**

Every conclusion must be traceable back to evidence.

---

# 7. Feature Classification

## 7.1 Must-Have Features

### Authentication

* Sign up
* Login
* Logout
* Protected routes
* Session persistence
* User profile

### Workspace

* Create workspace
* Rename workspace
* Delete workspace
* Workspace-specific data isolation

### Source Management

Support:

* PDF upload
* TXT upload
* DOC/DOCX where practical
* Image upload
* Text input
* URL ingestion where practical

Each source should store:

* filename/title
* source type
* upload timestamp
* processing status
* owner/workspace
* extracted metadata

### Document Processing

Pipeline:

```text
Source
 ↓
Validation
 ↓
Text Extraction
 ↓
Cleaning
 ↓
Chunking
 ↓
Metadata attachment
 ↓
Embedding
 ↓
Vector storage
```

### Knowledge Extraction

Extract:

* People
* Organizations
* Locations
* Dates
* Times
* Events
* Deadlines
* Requirements
* Restrictions
* Resources
* Topics
* Important facts

### Relationship Extraction

Detect relationships such as:

* affects
* causes
* depends_on
* occurs_before
* occurs_after
* located_at
* applies_to
* conflicts_with
* requires
* related_to
* scheduled_for
* impacts
* blocks
* enables

### Knowledge Graph

Graph must support:

* Nodes
* Edges
* Node metadata
* Relationship metadata
* Evidence references
* Confidence scores
* Temporal information

### Discovery Engine

Automatically identify:

* Conflicts
* Dependencies
* Deadlines
* Risks
* Potential disruptions
* Important relationships
* Changes
* Hidden connections

### Evidence System

Every AI-generated discovery must provide:

* Source
* Relevant document
* Relevant passage/chunk
* Reasoning chain
* Confidence
* Direct vs inferred classification

### Natural Language Query

User should be able to ask:

> What could affect me this week?

> Why is this event important?

> What deadlines are connected?

> What depends on this decision?

> What happens if this changes?

> Show me conflicts.

---

# 8. Advanced / Bonus Features

Implement only after the core system is stable.

## 8.1 Personalized Impact

Allow user preferences such as:

* Preferred transport
* Department
* Course
* Hostel
* Important deadlines
* Areas of interest

Then calculate:

> **Impact on Me**

rather than generic impact.

---

## 8.2 What-If Simulation

Users can modify graph conditions.

Example:

> "What if the road closure is extended by 2 days?"

System recalculates affected nodes and relationships.

---

## 8.3 Counterfactual Reasoning

Support queries such as:

> "What if the exam moves to September 22?"

The system should identify:

* New conflicts
* Resolved conflicts
* New dependencies
* Changed risks

---

## 8.4 Confidence Scoring

Each relationship should have:

```text
Direct Evidence
Inferred
Weak Inference
```

Example:

```text
Confidence: 91%
Type: Inferred
Evidence: 3 sources
```

---

## 8.5 Change Detection

If a newer source contradicts or modifies an older source:

```text
OLD
Exam: Sept 20

NEW
Exam: Sept 22
```

Generate:

> ⚠️ Schedule changed.

And identify downstream consequences.

---

## 8.6 AI Hallucination Firewall

The system must distinguish:

### Confirmed

Explicitly stated by a source.

### Inferred

Derived from multiple sources.

### Speculative

Possible but insufficiently supported.

Never present speculation as fact.

---

## 8.7 Source Contradiction Detection

Detect:

```text
Document A:
Exam starts at 9:00 AM

Document B:
Exam starts at 10:00 AM
```

Generate:

> ⚠️ Conflicting information detected.

Show both sources.

Do not arbitrarily choose one without evidence.

---

## 8.8 Timeline Intelligence

Display events chronologically.

Support:

* Before
* During
* After
* Deadline
* Recurring events
* Overlapping events

---

## 8.9 Impact Score

Calculate an approximate impact score using:

* Severity
* Urgency
* Number of affected entities
* Dependency depth
* Time proximity
* Confidence

Example:

```text
Impact Score
87 / 100

Severity: High
Urgency: High
Affected entities: 12
Confidence: 91%
```

The scoring system must be transparent and explainable.

---

# 9. AI Agent Architecture

RealityGraph should use modular AI agents rather than one monolithic prompt.

## Agent 1 — Ingestion Agent

Responsibilities:

* Validate source
* Detect source type
* Extract content
* Normalize content

---

## Agent 2 — Entity Extraction Agent

Extract:

* Entities
* Events
* Dates
* Locations
* Organizations
* People
* Important facts

Output must be structured JSON.

---

## Agent 3 — Relationship Agent

Identify relationships between extracted entities.

Output:

```json
{
  "source": "Road Closure",
  "relationship": "affects",
  "target": "Bus Route 4",
  "confidence": 0.91,
  "evidence": ["chunk_id"]
}
```

---

## Agent 4 — Temporal Reasoning Agent

Understand:

* dates
* intervals
* sequence
* duration
* before/after
* overlapping periods
* deadlines

---

## Agent 5 — Impact Agent

Determine:

* affected entities
* severity
* urgency
* possible consequences
* recommended actions

---

## Agent 6 — Verification Agent

Check whether generated conclusions are supported by source evidence.

It must flag unsupported reasoning.

---

## Agent 7 — Discovery Agent

Find non-obvious connections across the graph.

Example:

```text
Event A
 +
Event B
 +
User context
 =
Potential consequence
```

---

## Agent 8 — Explanation Agent

Convert machine reasoning into concise human-readable explanations.

---

## Agent 9 — Query Agent

Translate natural-language questions into:

* graph queries
* semantic retrieval queries
* temporal filters
* reasoning tasks

---

# 10. Agent Orchestration

Preferred orchestration:

```text
                    ┌──────────────┐
                    │ User / Source│
                    └──────┬───────┘
                           ↓
                    Ingestion Agent
                           ↓
                  Entity Extraction
                           ↓
                 Relationship Agent
                           ↓
              ┌────────────┴────────────┐
              ↓                         ↓
       Temporal Agent             Vector Search
              ↓                         ↓
              └────────────┬────────────┘
                           ↓
                     Impact Agent
                           ↓
                   Discovery Agent
                           ↓
                   Verification Agent
                           ↓
                  Explanation Agent
                           ↓
                        User
```

Agents should communicate through structured data.

Do not pass unnecessarily large natural-language context between agents.

---

# 11. RAG Architecture

RealityGraph must use a hybrid retrieval architecture.

## Semantic Retrieval

Use embeddings to retrieve relevant chunks.

```text
User Query
 ↓
Embedding
 ↓
Vector Search
 ↓
Top-K Chunks
```

## Graph Retrieval

Use graph relationships:

```text
Entity
 ↓
Related Nodes
 ↓
Relevant Events
 ↓
Dependencies
```

## Hybrid Retrieval

Final reasoning context:

```text
Semantic Evidence
+
Graph Context
+
Temporal Context
+
User Context
```

---

# 12. Knowledge Graph Design

## Node

Each node should contain:

```text
id
type
name
description
workspace_id
source_ids
confidence
created_at
updated_at
metadata
```

Possible node types:

```text
Person
Organization
Location
Event
Document
Deadline
Policy
Resource
Transport
Risk
Task
Topic
```

## Edge

Each relationship:

```text
id
source_node
target_node
relationship_type
confidence
evidence_ids
temporal_metadata
created_at
```

---

# 13. Technology Stack

Use a modern, practical stack that can be implemented quickly.

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* TanStack Query
* Lucide Icons
* Recharts where useful
* Graph visualization library such as React Flow/Cytoscape/D3

## Backend

Preferred:

* Python
* FastAPI
* Pydantic
* Async architecture

## AI

Primary AI provider:

* Google Gemini API

Use Gemini for:

* extraction
* reasoning
* summarization
* classification
* explanation
* agent tasks

## Embeddings

Use a Google-compatible embedding model/API.

## Database

Preferred:

* PostgreSQL

Use relational tables for application data.

For vector search, use:

* pgvector

For graph representation, initially store graph nodes and edges in PostgreSQL.

Do NOT introduce a separate graph database unless genuinely necessary for the MVP.

## Storage

Use object storage for uploaded documents.

Architecture must abstract storage behind a service layer.

## Authentication

Use a secure authentication mechanism compatible with the selected backend/database architecture.

## Real-Time Layer

Use:

* WebSockets or Server-Sent Events

for:

* document processing status
* agent execution status
* graph generation
* discovery generation
* notifications

---

# 14. Frontend Pages

## 14.1 Landing Page

Sections:

* Hero
* Problem
* How RealityGraph works
* Example graph
* Features
* Use cases
* CTA

Primary CTA:

> **Explore Your Reality**

---

## 14.2 Authentication

Pages:

* Login
* Signup
* Forgot Password where supported

---

## 14.3 Dashboard

Show:

* Workspaces
* Recent sources
* Recent discoveries
* Processing activity
* Risk/impact summary
* Quick actions

---

## 14.4 Workspace

Main application.

Layout:

```text
Sidebar
    Sources
    Graph
    Discoveries
    Timeline
    Queries
    Settings

Main Area
    Interactive Graph

Right Panel
    Selected node / discovery details
```

---

## 14.5 Sources Page

Features:

* Upload
* URL import
* Text input
* Source list
* Processing status
* Delete
* Reprocess
* View source

---

## 14.6 Graph Page

Features:

* Zoom
* Pan
* Search
* Filter by node type
* Filter by relationship
* Select node
* Highlight connections
* Expand neighbors
* Evidence panel

---

## 14.7 Discoveries Page

Cards should show:

```text
Discovery
Impact
Confidence
Why it matters
Affected entities
Evidence
Recommended action
```

---

## 14.8 Timeline Page

Show:

* chronological events
* deadlines
* conflicts
* dependencies
* changes

---

## 14.9 Query / AI Page

Chat-style interface.

Every answer should show:

* answer
* relevant graph nodes
* evidence
* confidence
* reasoning summary

---

# 15. Dashboard UX

The UI must feel like an **intelligence command center**, not a generic admin dashboard.

Visual priorities:

1. Graph
2. Discoveries
3. Timeline
4. Evidence
5. Query interface

Use clean spacing, strong hierarchy, subtle animations, and meaningful visual states.

Avoid:

* unnecessary gradients
* excessive cards
* clutter
* excessive animations
* generic AI robot imagery

---

# 16. API Architecture

Base URL:

```text
/api/v1
```

---

# 17. Health and Authentication Endpoints

```http
GET /api/v1/health
```

Returns service health.

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
POST /api/v1/auth/refresh
```

---

# 18. Workspace Endpoints

```http
GET    /api/v1/workspaces
POST   /api/v1/workspaces
GET    /api/v1/workspaces/{workspace_id}
PATCH  /api/v1/workspaces/{workspace_id}
DELETE /api/v1/workspaces/{workspace_id}
```

---

# 19. Source Endpoints

```http
GET    /api/v1/workspaces/{workspace_id}/sources
POST   /api/v1/workspaces/{workspace_id}/sources
GET    /api/v1/sources/{source_id}
DELETE /api/v1/sources/{source_id}
POST   /api/v1/sources/{source_id}/process
GET    /api/v1/sources/{source_id}/status
```

---

# 20. Graph Endpoints

```http
GET /api/v1/workspaces/{workspace_id}/graph
GET /api/v1/nodes/{node_id}
GET /api/v1/nodes/{node_id}/neighbors
GET /api/v1/edges/{edge_id}
GET /api/v1/nodes/{node_id}/evidence
```

---

# 21. Discovery Endpoints

```http
GET  /api/v1/workspaces/{workspace_id}/discoveries
GET  /api/v1/discoveries/{discovery_id}
POST /api/v1/workspaces/{workspace_id}/discoveries/generate
POST /api/v1/discoveries/{discovery_id}/dismiss
```

---

# 22. Timeline Endpoints

```http
GET /api/v1/workspaces/{workspace_id}/timeline
GET /api/v1/events/{event_id}
```

---

# 23. Query Endpoints

```http
POST /api/v1/workspaces/{workspace_id}/query
```

Request:

```json
{
  "query": "What could affect me this week?"
}
```

Response should include:

```json
{
  "answer": "...",
  "confidence": 0.91,
  "sources": [],
  "nodes": [],
  "reasoning": [],
  "discoveries": []
}
```

---

# 24. Simulation Endpoints

For the bonus feature:

```http
POST /api/v1/workspaces/{workspace_id}/simulate
GET  /api/v1/simulations/{simulation_id}
```

Example:

```json
{
  "change": {
    "entity": "Road Closure",
    "property": "end_date",
    "value": "2026-09-23"
  }
}
```

---

# 25. Notifications

```http
GET  /api/v1/notifications
POST /api/v1/notifications/{id}/read
POST /api/v1/notifications/read-all
```

---

# 26. Database Collections / Tables

Use PostgreSQL.

## users

```text
id
email
password_hash / auth_provider_id
name
created_at
updated_at
```

## workspaces

```text
id
owner_id
name
description
created_at
updated_at
```

## workspace_members

```text
id
workspace_id
user_id
role
created_at
```

## sources

```text
id
workspace_id
name
type
uri
storage_path
status
metadata
created_at
updated_at
```

## documents

```text
id
source_id
title
content
metadata
created_at
```

## chunks

```text
id
document_id
content
chunk_index
embedding
metadata
created_at
```

## entities

```text
id
workspace_id
type
name
description
metadata
confidence
created_at
updated_at
```

## relationships

```text
id
workspace_id
source_entity_id
target_entity_id
relationship_type
confidence
evidence
temporal_metadata
created_at
```

## events

```text
id
workspace_id
entity_id
start_time
end_time
event_type
metadata
confidence
```

## discoveries

```text
id
workspace_id
title
description
severity
impact_score
confidence
type
status
evidence
created_at
```

## executions

```text
id
workspace_id
workflow_id
status
started_at
completed_at
metadata
error
```

## agent_runs

```text
id
execution_id
agent_name
status
input
output
started_at
completed_at
error
```

## notifications

```text
id
user_id
workspace_id
type
title
message
read
created_at
```

---

# 27. Workflow System

A workflow represents an AI processing pipeline.

Example:

```text
DOCUMENT_INGESTION
 ↓
EXTRACTION
 ↓
ENTITY_DETECTION
 ↓
RELATIONSHIP_DETECTION
 ↓
TEMPORAL_ANALYSIS
 ↓
IMPACT_ANALYSIS
 ↓
DISCOVERY_GENERATION
 ↓
VERIFICATION
```

Each workflow should be observable.

The UI should show:

```text
✓ Ingestion
✓ Extraction
✓ Entity Detection
⟳ Relationship Analysis
○ Impact Analysis
○ Verification
```

---

# 28. Execution System

Every major AI operation should create an execution.

Execution states:

```text
queued
running
completed
failed
cancelled
```

Each execution can contain multiple agent runs.

This enables:

* debugging
* observability
* progress UI
* retry
* error handling
* demo visibility

---

# 29. Real-Time Processing

When a document is uploaded:

```text
Upload
 ↓
API response
 ↓
Execution created
 ↓
Background processing
 ↓
WebSocket/SSE events
 ↓
Frontend progress updates
```

Example:

```text
Processing document...

✓ Extracting text
✓ Creating chunks
✓ Generating embeddings
✓ Extracting entities
⟳ Finding relationships
○ Detecting impacts
○ Generating discoveries
```

---

# 30. Security Requirements

## Authentication

* Never store plaintext passwords.
* Use secure password hashing.
* Protect authenticated endpoints.
* Validate sessions/tokens.

## Authorization

Every workspace resource must verify:

```text
authenticated user
        ↓
workspace membership
        ↓
resource ownership/access
```

Users must never access another user's workspace data.

## File Security

Validate:

* file type
* MIME type
* file size
* filename
* malicious content where practical

Do not execute uploaded files.

## API Security

* Validate all request bodies.
* Validate IDs.
* Rate-limit expensive AI operations where practical.
* Never expose secrets to frontend.

## Secrets

Never hardcode:

* API keys
* database passwords
* authentication secrets
* private credentials

Use environment variables.

Never commit `.env`.

Provide `.env.example`.

---

# 31. Environment Variables

Create:

```text
DATABASE_URL=
GEMINI_API_KEY=
AUTH_SECRET=
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_BUCKET=
FRONTEND_URL=
BACKEND_URL=
```

Only variable names should appear in documentation.

Never commit actual values.

---

# 32. Error Handling

Every API should return structured errors.

Example:

```json
{
  "error": {
    "code": "PROCESSING_FAILED",
    "message": "Unable to process document."
  }
}
```

Never expose:

* stack traces
* secrets
* internal credentials
* sensitive system information

to users.

---

# 33. Observability

Log:

* request ID
* execution ID
* agent name
* status
* duration
* errors

Do not log:

* passwords
* API keys
* tokens
* sensitive document contents unnecessarily

---

# 34. Folder Structure

Recommended monorepo:

```text
realitygraph/
│
├── README.md
├── spec.md
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── stores/
│   │   ├── styles/
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── agents/
│   │   ├── workflows/
│   │   ├── rag/
│   │   ├── graph/
│   │   ├── ingestion/
│   │   ├── realtime/
│   │   ├── database/
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
│
├── scripts/
│
└── docs/
    ├── architecture.md
    ├── api.md
    └── demo.md
```

---

# 35. Backend Module Responsibilities

## `agents/`

Contains independent AI agents.

```text
extraction_agent.py
relationship_agent.py
temporal_agent.py
impact_agent.py
verification_agent.py
discovery_agent.py
explanation_agent.py
query_agent.py
```

## `rag/`

Contains:

* embedding generation
* vector search
* chunk retrieval
* context construction

## `graph/`

Contains:

* node creation
* edge creation
* graph traversal
* graph querying
* graph scoring

## `workflows/`

Contains:

* workflow definitions
* execution orchestration
* state management

## `services/`

Contains application/business logic.

---

# 36. Development Phases

Development must follow strict incremental phases.

---

## Phase 0 — Project Initialization

Create:

* repository
* frontend
* backend
* environment configuration
* database connection
* basic routing
* health endpoint

Do not implement advanced AI yet.

---

## Phase 1 — Authentication + Workspace

Implement:

* signup
* login
* logout
* session
* protected routes
* workspace CRUD

Verify that workspace isolation works.

---

## Phase 2 — Source Ingestion

Implement:

* file upload
* source management
* PDF extraction
* text extraction
* chunking
* source metadata

At the end of this phase a user must be able to upload a document and view extracted content.

---

## Phase 3 — RAG

Implement:

```text
chunk
 ↓
embedding
 ↓
vector storage
 ↓
semantic retrieval
```

Add query endpoint.

---

## Phase 4 — Entity Extraction

Implement Gemini-powered extraction.

Structured output:

```text
entities
events
dates
locations
facts
```

Store results in PostgreSQL.

---

## Phase 5 — Knowledge Graph

Implement:

* nodes
* relationships
* evidence references
* confidence
* graph API
* graph visualization

At the end of this phase the core RealityGraph should visually exist.

---

## Phase 6 — Relationship Intelligence

Implement:

* relationship extraction
* temporal relationships
* dependency detection
* conflict detection

---

## Phase 7 — Discovery Engine

Implement:

* impact analysis
* discovery generation
* confidence
* evidence
* recommended actions

This is the primary innovation milestone.

---

## Phase 8 — Explainability

Implement:

> Why?

For every discovery show:

```text
Conclusion
 ↓
Reasoning chain
 ↓
Supporting relationships
 ↓
Source chunks
 ↓
Confidence
```

---

## Phase 9 — Real-Time Execution UI

Implement:

* execution tracking
* agent status
* progress
* WebSocket/SSE
* error states

---

## Phase 10 — Advanced Features

Only after MVP stability:

* personalization
* what-if simulation
* counterfactual reasoning
* change detection
* contradiction detection
* notifications

---

## Phase 11 — Polish

Focus on:

* visual quality
* responsiveness
* loading states
* empty states
* error states
* animations
* accessibility
* demo reliability

---

## Phase 12 — Demo Preparation

Create a controlled dataset specifically designed to demonstrate hidden relationships.

The demo must be deterministic and reliable.

---

# 37. Demo Dataset

Create realistic sample documents around a fictional college.

Example:

### Document A

**Mid-Semester Examination Schedule**

Exam:

September 20, 9:00 AM

Location:

Academic Block A

---

### Document B

**Campus Construction Notice**

Main Gate closed:

September 19–21

---

### Document C

**Transportation Notice**

Bus Route 4 normally enters through Main Gate.

During closure:

Route 4 will be diverted.

---

### Document D

**Weather Information**

Heavy rainfall expected September 20.

---

### Document E

**Student Profile**

Preferred transportation:

Bus Route 4

---

RealityGraph should discover:

```text
Exam
 ↓
September 20
 ↓
Main Gate Closure
 ↓
Bus Route 4
 ↓
Student
```

and:

```text
Weather
 ↓
Travel Risk
 ↓
Exam Commute
```

Final discovery:

> **Your September 20 examination may be affected by the main gate closure and Route 4 diversion. Heavy rainfall may further increase travel time.**

---

# 38. Demo "Wow Moment"

The main demo should be approximately:

### Step 1

Upload several documents.

### Step 2

Show AI processing.

### Step 3

Graph automatically appears.

### Step 4

Show seemingly unrelated nodes.

### Step 5

System highlights a hidden connection.

### Step 6

Open:

> **Why?**

### Step 7

Show evidence chain.

### Step 8

Ask:

> "What happens if the gate closure is extended by two days?"

### Step 9

Show updated impact graph.

The judge should understand the product without requiring a technical explanation.

---

# 39. AI Prompting Rules

All AI prompts must:

1. Require structured output whenever possible.
2. Explicitly prohibit unsupported claims.
3. Include source evidence.
4. Include confidence.
5. Separate facts from inference.
6. Prefer deterministic JSON schemas.
7. Avoid unnecessary verbosity.
8. Never invent source information.

---

# 40. AI Output Contract

For reasoning tasks use a structure similar to:

```json
{
  "conclusion": "",
  "type": "confirmed|inferred|speculative",
  "confidence": 0.0,
  "reasoning": [
    {
      "step": 1,
      "statement": "",
      "evidence_ids": []
    }
  ],
  "affected_entities": [],
  "recommended_actions": []
}
```

The backend must validate AI responses before storing them.

---

# 41. Performance Requirements

The MVP should prioritize perceived speed.

Use:

* asynchronous processing
* background jobs where necessary
* streaming progress
* cached embeddings
* batched operations
* pagination
* lazy graph loading

Do not block HTTP requests for long-running AI pipelines.

---

# 42. Scalability Requirements

The architecture should allow future migration from:

```text
PostgreSQL graph tables
```

to:

```text
Dedicated graph database
```

without rewriting the frontend.

Keep graph operations behind a graph service interface.

Similarly, keep AI provider calls behind an AI service abstraction.

---

# 43. Provider Abstraction

Do not tightly couple business logic directly to Gemini.

Create an abstraction:

```text
AIService
 ├── generate()
 ├── structured_generate()
 ├── embed()
 └── stream()
```

The initial implementation should use Gemini.

This allows future support for other models.

---

# 44. Frontend State Rules

Use server-state management for API data.

Do not duplicate server data unnecessarily in global state.

Use local state for:

* filters
* UI toggles
* selected graph node
* modal state

Use global state only where genuinely required.

---

# 45. UI States

Every major screen must implement:

### Loading

Show meaningful skeleton/progress state.

### Empty

Explain what the user should do next.

### Error

Provide a clear recovery action.

### Success

Provide visual confirmation.

### Processing

Show real-time execution progress.

---

# 46. Accessibility

Support:

* keyboard navigation
* readable contrast
* semantic HTML
* accessible buttons
* form labels
* focus states
* screen-reader-friendly important elements

---

# 47. Mobile Responsiveness

Desktop is the primary target because the hackathon demo will likely be desktop-based.

However:

* authentication
* dashboard
* discoveries
* source list
* query interface

should remain usable on smaller screens.

---

# 48. Security Rules for AI

Never send unnecessary user data to AI providers.

Only send relevant context.

Never send:

* passwords
* authentication tokens
* API keys
* internal credentials

to AI models.

---

# 49. Anti-Hallucination Rules

The AI must never:

* invent sources
* invent dates
* invent relationships
* claim certainty without evidence
* fabricate user context

When evidence is insufficient:

> **Insufficient evidence to establish this relationship.**

---

# 50. Codex / Antigravity Development Instructions

You are the primary coding agent responsible for implementing RealityGraph according to this specification.

## Rules

### Rule 1 — Follow the spec

Treat `spec.md` as the source of truth.

Do not introduce major architectural changes without necessity.

---

### Rule 2 — Build incrementally

Do not attempt to generate the entire application in one step.

Complete each development phase, verify it, then proceed.

---

### Rule 3 — Keep the MVP working

At every stage:

```text
Build
 ↓
Run
 ↓
Test
 ↓
Fix
 ↓
Continue
```

Never leave the project in a knowingly broken state before moving to another phase.

---

### Rule 4 — Prioritize Core Features

Priority order:

```text
P0
Authentication
Workspace
Source Upload
Document Processing
RAG
Entity Extraction
Knowledge Graph
Relationship Detection
Discovery Engine
Evidence
Graph UI

P1
Temporal Reasoning
Real-Time Execution
Impact Scoring
Timeline
Query Interface

P2
Personalization
What-If
Counterfactuals
Change Detection
Notifications
```

Never sacrifice P0 functionality for P2 features.

---

### Rule 5 — Do not over-engineer

For the 24-hour hackathon:

Prefer:

```text
simple + reliable
```

over:

```text
complex + fragile
```

Do not introduce unnecessary infrastructure.

---

### Rule 6 — AI must be structured

Use schema-constrained outputs whenever possible.

Validate model output with Pydantic or equivalent schemas.

---

### Rule 7 — Evidence is mandatory

Every relationship and discovery should retain evidence references whenever possible.

---

### Rule 8 — Keep secrets secure

Never place secrets in source code.

Never generate `.env` with real credentials.

---

### Rule 9 — Test critical paths

At minimum test:

```text
Authentication
Workspace isolation
Document upload
Document processing
Embedding
Entity extraction
Graph creation
Relationship creation
Discovery generation
Query
```

---

### Rule 10 — Do not fake functionality

Do not create buttons that appear functional but are not.

Do not use hardcoded AI responses for the actual product flow.

Demo seed data may be used, but clearly separate seed/demo data from production logic.

---

### Rule 11 — Make the demo reliable

If an external service fails:

* show an understandable error
* preserve previously processed data
* allow retry
* do not crash the application

---

### Rule 12 — Maintain clean code

Use:

* typed interfaces
* clear service boundaries
* reusable components
* meaningful variable names
* small functions
* comments only where useful

---

# 51. Definition of Done

RealityGraph MVP is considered complete when:

* [ ] User can register/login.
* [ ] User can create a workspace.
* [ ] User can upload documents.
* [ ] Documents are processed.
* [ ] Text is chunked.
* [ ] Embeddings are generated.
* [ ] Semantic search works.
* [ ] Entities are extracted.
* [ ] Relationships are extracted.
* [ ] Knowledge graph is created.
* [ ] Graph is visually displayed.
* [ ] Discoveries are generated.
* [ ] Discoveries have evidence.
* [ ] Discoveries have confidence.
* [ ] User can inspect why a discovery exists.
* [ ] Natural-language querying works.
* [ ] Processing progress is visible.
* [ ] Errors are handled.
* [ ] Workspace data is isolated.
* [ ] Secrets are protected.
* [ ] Demo dataset works end-to-end.
* [ ] Application is responsive.
* [ ] README contains setup instructions.
* [ ] `.env.example` exists.
* [ ] Project can be deployed.

---

# 52. Final Product Positioning

RealityGraph should NOT be marketed as:

> "An AI chatbot for documents."

It should be positioned as:

> **An AI-powered Context Intelligence Engine that transforms fragmented information into an explainable map of relationships, dependencies, risks, and consequences.**

Short pitch:

> **RealityGraph connects the dots hidden inside your information. It combines RAG, knowledge graphs, temporal reasoning, and AI agents to discover relationships humans may miss—and explains exactly why each discovery matters.**

---

# 53. Future Vision

RealityGraph can evolve into a general-purpose intelligence layer for:

```text
Personal Intelligence
        ↓
Team Intelligence
        ↓
Enterprise Intelligence
        ↓
Government Intelligence
        ↓
Real-World Intelligence
```

Long-term capabilities:

* continuous information ingestion
* live knowledge graphs
* autonomous monitoring
* predictive impact analysis
* decision simulation
* multi-agent reasoning
* cross-source contradiction resolution
* personalized intelligence
* external API integrations
* real-time alerts

The ultimate vision:

> **RealityGraph becomes a system that continuously watches the information around you and tells you what changed, what connects, what matters, and what you should do next.**

---

# 54. Final Instruction to the Development Agent

Build RealityGraph as a production-quality hackathon MVP.

The priority is not maximum feature count.

The priority is:

```text
Strong Problem
      +
Original Concept
      +
Reliable AI Pipeline
      +
Visible Knowledge Graph
      +
Hidden Relationship Discovery
      +
Evidence-Based Reasoning
      +
Excellent UX
      +
Memorable Demo
```

The application must make the following transformation visible:

```text
FRAGMENTED INFORMATION
          ↓
      UNDERSTANDING
          ↓
     RELATIONSHIPS
          ↓
       REASONING
          ↓
       DISCOVERY
          ↓
      EXPLANATION
          ↓
       ACTION
```

The core experience should make the user think:

> **"I gave RealityGraph information. It found something I didn't realize was there."**

That is the defining experience of the product.
