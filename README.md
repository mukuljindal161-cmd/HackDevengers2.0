# RealityGraph

> **Information tells you what happened. RealityGraph tells you what it means.**

RealityGraph is an AI-powered **Context and Relationship Intelligence Platform** designed according to [spec.md](file:///c:/Users/Mukul%20Jindal/OneDrive/Desktop/Hackathon/spec.md). It ingests information from multiple fragmented sources (notices, schedules, road closures, weather warnings, and profiles), builds a dynamic knowledge graph, performs temporal and impact reasoning across seemingly unrelated facts, and reveals actionable, evidence-grounded discoveries.

---

## 🌟 The Core Breakthrough: "Connecting the Dots"

Traditional search and RAG systems answer *"What does this document say?"* when asked a question. RealityGraph proactively answers:
> *"What does all this information mean together, and how does it affect me?"*

### The Campus Intelligence Scenario:
1. **Document A (Exam Notice):** Examination scheduled for **September 20 at 9:00 AM** in **Academic Block A**.
2. **Document B (Construction Notice):** Campus **Main Gate closed** for emergency repairs **September 19–21**.
3. **Document C (Transit Advisory):** **Bus Route 4** diverted away from Main Gate.
4. **Document D (Weather Alert):** **Torrential rainfall** forecasted for **September 20**.
5. **Document E (Student Profile):** Commutes via **Bus Route 4**.

Individually, each notice seems ordinary. **RealityGraph synthesizes the hidden risk:**
> **⚠️ Critical Commute & Examination Risk:** The student's commute to their September 20 exam will be severely impacted by the Main Gate closure, Route 4 detour, and forecasted torrential rainfall—delaying arrival by 35-45 minutes without an early departure.

Every finding is backed by a **step-by-step reasoning chain**, **exact source passages**, an **impact score (0–100)**, and an **AI Hallucination Firewall** classification.

---

## 🚀 Key Features

* **Multi-Format Ingestion:** Supports PDF, TXT, Markdown, and direct notice text entry with automatic sliding-window chunking.
* **Hybrid RAG & Vector Search:** Combines semantic vector similarity search with knowledge graph entity traversal.
* **Interactive Knowledge Graph:** Radial visual canvas with zoom, pan, search, entity type filters (Events, Locations, Transport, Risks, Policies, Persons), and a node inspector drawer.
* **Relationship & Temporal Agents:** Discovers multi-hop dependencies (`affects`, `causes`, `depends_on`, `delays`, `impacts`) and calendar clashes.
* **Discovery Engine & Impact Scoring:** Transparent 0–100 impact scoring factoring in severity, urgency, affected entity reach, and confidence.
* **Deep Explainability ("Why?") Modal:** Inspect the exact reasoning steps and corroborating source citations behind any conclusion.
* **AI Hallucination Firewall:** Classifies every insight into `CONFIRMED` (explicitly cited), `INFERRED` (multi-source deduction), or `SPECULATIVE`.
* **Real-Time Execution Pipeline:** Server-Sent Events (SSE) tracking live agent progress (`✓ Ingestion`, `✓ Chunking`, `✓ Entity Detection`, `⟳ Relationship Analysis`, `○ Discovery Generation`).
* **What-If Simulation Engine:** Test counterfactual hypotheses (e.g. extending gate closure dates) and watch downstream impacts recalculate in real-time.
* **1-Click Campus Demo Dataset:** Pre-loaded with the official hackathon scenario for instant demonstration.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
│   Knowledge Graph • Discoveries • Timeline • Query UI   │
└───────────────────────────┬────────────────────────────┘
                            │ REST / SSE
┌───────────────────────────▼────────────────────────────┐
│                  FastAPI Backend Engine                │
│                                                        │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │ Ingestion & RAG│  │Knowledge Graph │  │Simulations│ │
│  └────────┬───────┘  └────────┬───────┘  └─────┬─────┘ │
│           │                   │                │       │
│  ┌────────▼───────────────────▼────────────────▼─────┐ │
│  │                AI Agent Orchestrator              │ │
│  │ Extraction • Relationships • Temporal • Discovery │ │
│  │       Verification (Firewall) • Explanation       │ │
│  └────────────────────────┬──────────────────────────┘ │
└───────────────────────────┼────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│      Storage Layer (PostgreSQL / SQLite + pgvector)    │
└────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

* **Node.js**: v18.0 or newer (tested with v24)
* **Python**: v3.11 or newer (tested with v3.12)
* **Docker & Docker Compose** *(Optional, for PostgreSQL + pgvector)*

---

## 🛠️ Step-by-Step Local Setup

### 1. Clone & Configure Environment

Clone the repository and enter the directory:
```bash
git clone <repo-url>
cd Hackathon
```

Copy the sample environment file:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Configure `.env`:
* `GEMINI_API_KEY`: *(Optional)* Add your Google Gemini API key. If left blank or default, RealityGraph runs in resilient local fallback mode so you can test all features offline!
* `DATABASE_URL`: Defaults to `sqlite+aiosqlite:///./realitygraph.db` for instant local execution. To use PostgreSQL with pgvector, uncomment the postgres URL.

---

### 2. Optional: Run PostgreSQL with pgvector via Docker

If you wish to use PostgreSQL instead of SQLite:
```bash
docker compose up -d
```

---

### 3. Backend Setup

Create and activate a Python virtual environment:

**Windows (PowerShell):**
```powershell
python -m venv backend/.venv
.\backend\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r backend/requirements.txt
```

Run the backend server:
```bash
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now live at `http://127.0.0.1:8000`.
Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

---

### 4. Frontend Setup

In a new terminal, navigate to `frontend`:
```bash
cd frontend
npm install
npm run dev
```
The frontend application is now running at `http://localhost:5173`.

---

## 🧪 Running Automated Tests

Run the complete backend test suite covering Health, Authentication, Workspace Isolation, RAG Chunking, Knowledge Graph, Discovery Engine, and What-If Simulations:

```bash
# From the project root with the venv active
pytest backend/tests -v
```

All tests run asynchronously with zero mock dependencies required.

---

## 🎯 Hackathon Demo Walkthrough (The "Wow Moment")

1. Open `http://localhost:5173` in your browser.
2. Click **"Sign In"** -> click the **"1-Click Hackathon Demo Access"** button to enter immediately.
3. In the left sidebar, click the gradient **"Load Campus Demo"** button:
   - Notice the **Live Execution Tracker** appears in the bottom right corner showing the AI pipeline stages.
   - 5 disparate campus documents (Exam schedule, Main Gate closure, Bus route diversion, Weather alert, Student profile) are ingested and chunked.
4. Go to **"Knowledge Graph"**:
   - Explore the color-coded nodes (Exam, Academic Block A, Main Gate Closure, Bus Route 4, Heavy Rainfall Alert).
   - Click on any node to view connected edges and source citations in the Inspector.
5. Go to **"Discoveries"**:
   - Notice the synthesized insight: **"Severe Examination Commute Disruption via Route 4 Detour & Weather"** with an Impact Score of **88/100**.
   - Click **"Inspect Why?"** to open the deep explainability modal showing the 5-step reasoning chain and anti-hallucination firewall verification.
6. Go to **"What-If Simulation"**:
   - Change `end_date` of `Main Gate Closure` to `2026-09-23` and click **"Run Simulation"**.
   - Watch the downstream impact and emergent risks calculated across the graph.
7. Go to **"Hybrid AI Query"**:
   - Ask: *"What could affect my commute this week?"*
   - View the grounded response complete with relevant graph entity chips and semantic chunk citations.

---

## 📂 Project Structure

```text
Hackathon/
├── backend/
│   ├── app/
│   │   ├── api/routes/      # Auth, Workspaces, Sources, Graph, Discoveries, Timeline, Query, Simulate, Demo
│   │   ├── core/            # Config, Security (JWT/bcrypt), Database (SQLAlchemy)
│   │   ├── models/          # Users, Workspaces, Sources, Chunks, Entities, Relationships, Discoveries
│   │   ├── schemas/         # Pydantic validation models
│   │   ├── services/        # AIService, StorageService, GraphService
│   │   ├── agents/          # Extraction, Relationship, Temporal, Impact, Discovery, Verification, Explanation
│   │   ├── workflows/       # Pipeline orchestration
│   │   ├── rag/             # Sliding-window chunker, Vector cosine search
│   │   ├── realtime/        # Server-Sent Events (SSE) manager
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/               # Pytest suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # LiveExecutionTracker, WhyModal, NodeInspector
│   │   ├── pages/           # LandingPage, AuthPage, GraphPage, DiscoveriesPage, SourcesPage, TimelinePage, QueryPage, SimulationPage
│   │   ├── layouts/         # AppLayout
│   │   ├── context/         # AuthContext
│   │   ├── services/        # Typed API client
│   │   └── index.css        # Command-center styling
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml       # PostgreSQL with pgvector
├── .env.example             # Template environment variables
├── pytest.ini               # Pytest async configuration
├── README.md                # Comprehensive documentation
└── spec.md                  # Project specification (Single Source of Truth)
```

---

## ⚖️ License
Built for **HackDevengers 2.0 Hackathon**.
