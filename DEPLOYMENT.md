# RealityGraph Deployment Guide (Vercel & Render)

This guide walks you through deploying the **RealityGraph** full-stack application:
- **Backend**: FastAPI Python service deployed on **Render**
- **Frontend**: React + Vite application deployed on **Vercel**

---

## Part 1: Deploy Backend on Render

1. Log in to [Render.com](https://render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository: `https://github.com/mukuljindal161-cmd/HackDevengers2.0`
4. Configure the Web Service settings:
   - **Name**: `realitygraph-backend`
   - **Environment**: `Python 3`
   - **Region**: Any (e.g., Singapore / Oregon)
   - **Branch**: `main`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. Add **Environment Variables** under *Advanced*:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
   - `MONGODB_URI`: *(Your MongoDB Atlas connection string, optional)*
   - `AUTH_SECRET`: *(Any secret random string for JWT)*
6. Click **Create Web Service**.
7. Once deployment finishes, copy your backend URL (e.g., `https://realitygraph-backend.onrender.com`).

---

## Part 2: Deploy Frontend on Vercel

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `mukuljindal161-cmd/HackDevengers2.0`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables**:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://realitygraph-backend.onrender.com` *(Replace with your actual Render URL from Part 1)*
6. Click **Deploy**.

---

## Verification
- Open your Vercel URL (e.g., `https://hackdevengers2-0.vercel.app`).
- Test **1-Click Hackathon Demo Access**, navigation, and natural language queries!
