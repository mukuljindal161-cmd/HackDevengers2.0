RealityGraph

Context & Relationship Intelligence Platform

Information tells you what happened. RealityGraph tells you what it
means.

🚀 Problem

Important information is scattered across PDFs, notices, schedules,
policies, and other sources. Traditional search and RAG systems can
retrieve relevant information, but often fail to reveal the
relationships, conflicts, dependencies, and real-world impact between
different pieces of information.

💡 Solution

RealityGraph transforms scattered information into a connected
knowledge graph and uses AI to understand how different entities and
events are related. It combines Hybrid RAG, Knowledge Graphs, temporal
reasoning, conflict detection, and evidence-grounded AI to provide
explainable insights and actionable context.

✨ Core Features

🕸️ Interactive Knowledge Graph --- Explore entities, events, and
relationships visually.

🧠 Entity & Relationship Extraction --- Automatically identify
important entities and multi-hop relationships.

🔎 Hybrid RAG --- Combines semantic retrieval with graph-based
context.

⚠️ Conflict & Contradiction Detection --- Detect schedule
clashes, commute collisions, and conflicting information.

💬 Evidence-Grounded AI Answers --- Answers are supported by
retrieved source evidence.

🛡️ Hallucination Firewall --- Shows conclusion type, confidence,
evidence chain, and mitigation.

⏳ Timeline Intelligence --- Understand events and changes in
temporal context.

🔮 What-If Simulation --- Change an event or condition and see
how connected conflicts are recalculated.

⚡ Real-Time Processing --- Live processing updates and
notifications using SSE.

🏫 College Intelligence Demo --- One-click demo scenario using
campus notices.

🔄 How It Works

Documents / Notices
        ↓
Processing & Chunking
        ↓
Embeddings + Entity Extraction
        ↓
Knowledge Graph
        ↓
Hybrid RAG + Graph Reasoning
        ↓
Conflict & Impact Discovery
        ↓
Evidence-Grounded Insights

🎯 Demo Scenario

The current demo focuses on college/campus intelligence.
RealityGraph connects exam schedules, gate closures, transport changes,
weather alerts, and other notices to identify hidden conflicts and
understand their impact on students.

Load Scenario → Discover Conflicts → Ask AI → Inspect Evidence → Run
What-If Simulation

🖼️ Screenshots

Command Center- <img width="1917" height="970" alt="image" src="https://github.com/user-attachments/assets/2c23c1cb-659e-4d22-a523-8b6bba6170a5" />


Knowledge Graph- <img width="1917" height="967" alt="image" src="https://github.com/user-attachments/assets/4b8dc8fb-d7e7-4c97-8764-2f3df198f8fd" />


Discoveries & Evidence- <img width="1917" height="968" alt="image" src="https://github.com/user-attachments/assets/b7ee7283-8cd3-4e08-8446-e03b692fd15b" />


What-If Simulation- <img width="1917" height="968" alt="image" src="https://github.com/user-attachments/assets/a7cd9ef5-d0ed-4b8e-aeb9-585ad83a28b7" />


🌐 Live Demo

Frontend / Live Demo: https://hack-devengers2-0-olive.vercel.app/

Backend / API: https://hackdevengers2-0.onrender.com

🛠️ Technology Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui,
React Flow

Backend: Python, FastAPI, Pydantic, Server-Sent Events (SSE)

AI/ML: Google Gemini, Gemini Embeddings, Hybrid RAG, graph-based
reasoning

Database: SQLite, MongoDB Atlas

Authentication: JWT, bcrypt, workspace isolation

Development: Google Antigravity

⚙️ Setup

git clone https://github.com/mukuljindal161-cmd/HackDevengers2.0/
cd RealityGraph

Create your environment file:

cp .env.example .env

Add the required configuration values to .env and follow the
frontend/backend installation commands provided in the project.

Frontend:-

```bash
cd frontend
npm install
npm run dev
```
Backend:-

```bash
pip install -r backend/requirements.txt
```

🔐 Environment Variables

```env
DATABASE_URL=
REDIS_URL=
SECRET_KEY=
GEMINI_API_KEY=
LLM_MODEL=
EMBEDDING_MODEL=
STORAGE_PROVIDER=
STORAGE_BUCKET=
NEXT_PUBLIC_API_URL=
```

🏆 Hackathon

Built for HackDevengers 2.0 --- Open Innovation Hackathon.

RealityGraph

From scattered information to explainable consequences.

## Project Status

**Status:** 🚀 Completed

👨‍💻 Developer
Mukul Jindal

GitHub: https://github.com/mukuljindal161-cmd

LinkedIn: https://www.linkedin.com/in/mukuljindal07/

⭐ Feel free to explore and share your feedback!
