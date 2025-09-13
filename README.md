🛠 IT Incident Reporter

AI-powered agent to summarise IT incidents & predict root causes using NLP, embeddings, and local LLMs.

📌 Overview

Managing IT incidents can be time-consuming for Site Reliability Engineers (SREs). Our system autonomously:

Ingests incident descriptions, logs, and close notes

Uses vector embeddings + similarity search (FAISS) to fetch relevant past incidents

Leverages local LLMs (e.g., T5, Mistral) to generate:

✅ Concise summaries

✅ Root cause predictions

✅ References to similar incidents

This drastically reduces Mean Time To Resolution (MTTR) while staying modular and API-free.

⚙️ System Architecture

+-------------------------+
|  New Incident Input     |
|  (Short + Full Desc)    |
+-----------+-------------+
            |
            v
+-------------------------+
| Embed Input (Text)      |
| → SentenceTransformer   |
|   (all-MiniLM-L6-v2)    |
+-----------+-------------+
            |
            v
+-------------------------+
| Query Vector DB (FAISS) |
| → Top-K Similar Incidents|
+-----------+-------------+
            |
            v
+-----------------------------+
| (Optional) RCA Classifier   |
| → Predict Root Cause Tag    |
+-----------+-----------------+
            |
            v
+-------------------------------+
| Construct LLM Prompt          |
| (Incident + Context + RCA)    |
+-----------+-------------------+
            |
            v
+-------------------------------+
|   LLM Agent (Local / API)     |
|   Tasks:                      |
|   ✅ Summarise Incident       |
|   ✅ Predict Root Cause       |
+-----------+-------------------+
            |
            v
+-------------------------------+
|           Output              |
| - Short Summary               |
| - Root Cause (Text / Label)   |
| - References (Incident IDs)   |
+-------------------------------+


🎯 Solution Approach

Input Handling: Incident short + full descriptions, logs, and notes

Embedding: SentenceTransformers → FAISS Vector DB for similarity search

RCA Classifier (optional): Predicts potential root cause tags

LLM Agent: Local lightweight models (T5, Mistral, etc.)

Output:

Concise summaries

Root cause predictions

Similar incident references

🌟 Innovation & Uniqueness

Combines RAG (Retrieval-Augmented Generation) with RCA prediction

Runs on local open-source LLMs → no API costs

Self-improving loop via SRE feedback integration

Modular design → scalable dashboard & API integration

📊 Business Model Canvas
Key Partners	Key Activities	Value Propositions
- Cloud Providers (AWS, GCP, Azure)
- HuggingFace, SentenceTransformers
- ITSM Tools (JIRA, ServiceNow)	- Data ingestion & embedding
- RCA classification
- Summarisation
- Dashboard & API	- ⏱ Reduce MTTR by >30%
- 🧠 Summarise noisy logs & alerts
- 🔍 RCA with historical context
- 🚫 No reliance on paid APIs
Customer Relationships	Customer Segments	Channels
- Onboarding & integration support
- Feedback loop
- SLA tiers	- IT Ops Teams
- Enterprises with large ticket volumes
- ITSM vendors
- MSPs	- Web dashboard (React)
- REST API (FastAPI)
- ITSM plugins
Key Resources	Cost Structure	Revenue Streams
- Skilled ML/NLP team
- GPU infrastructure
- Vector DB infra
- Training datasets	- Cloud infra
- Team salaries
- Maintenance & updates	- SaaS licensing
- Enterprise licensing
- Consulting & deployment
- Model training on custom data
🚀 One-Liner Value Prop

"We turn chaotic IT tickets into instant summaries and root causes using LLMs — helping SREs fix faster and breathe easier."

📂 Tech Stack

Backend: Python, FastAPI

ML/NLP: HuggingFace Transformers, SentenceTransformers, FAISS

LLM: T5, Mistral (local, API-free)

Frontend: React (dashboard)

Infra: Docker, GPU-enabled environment

🏁 Getting Started
# Clone repo
git clone https://github.com/Dhanushreddy9/IT_Incident_Reporter.git
cd IT_Incident_Summariser

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn app.main:app --reload
