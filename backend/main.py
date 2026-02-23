"""
main.py
-------
FastAPI application entry point.
Serves the portfolio REST API with CORS enabled.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import json

from database import init_db, get_connection
from chatbot import get_answer

# ── App setup ───────────────────────────────────────────────────────────────

app = FastAPI(title="Aviral Dubey – Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    """Initialize database and seed data on server start."""
    init_db()


# ── Pydantic models ────────────────────────────────────────────────────────

class ContactForm(BaseModel):
    name: str
    email: str
    message: str


class ChatQuery(BaseModel):
    query: str


# ── Routes: Projects ───────────────────────────────────────────────────────

@app.get("/api/projects")
def list_projects():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM projects ORDER BY sort_order").fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "title": r["title"],
            "description": r["description"],
            "tech_stack": json.loads(r["tech_stack"]),
            "image_url": r["image_url"],
            "github_url": r["github_url"],
        }
        for r in rows
    ]


# ── Routes: Experience ─────────────────────────────────────────────────────

@app.get("/api/experience")
def list_experience():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM experience ORDER BY sort_order").fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "role": r["role"],
            "company": r["company"],
            "period": r["period"],
            "description": json.loads(r["description"]),
        }
        for r in rows
    ]


# ── Routes: Skills ─────────────────────────────────────────────────────────

@app.get("/api/skills")
def list_skills():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM skills").fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "category": r["category"],
            "items": json.loads(r["items"]),
        }
        for r in rows
    ]


# ── Routes: Contact ────────────────────────────────────────────────────────

@app.post("/api/contact")
def submit_contact(form: ContactForm):
    conn = get_connection()
    conn.execute(
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
        (form.name, form.email, form.message),
    )
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Thank you for reaching out!"}


@app.get("/api/contacts")
def list_contacts():
    """Admin endpoint — list all submitted messages."""
    conn = get_connection()
    rows = conn.execute("SELECT * FROM contacts ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Routes: Chatbot ────────────────────────────────────────────────────────

@app.post("/api/chatbot")
def chatbot(query: ChatQuery):
    return get_answer(query.query)


# ── Routes: Analytics ──────────────────────────────────────────────────────

@app.get("/api/analytics")
def get_analytics():
    conn = get_connection()
    row = conn.execute("SELECT count FROM visits WHERE id = 1").fetchone()
    conn.close()
    return {"total_visits": row["count"] if row else 0}


@app.post("/api/analytics/visit")
def record_visit():
    conn = get_connection()
    conn.execute("UPDATE visits SET count = count + 1 WHERE id = 1")
    conn.commit()
    row = conn.execute("SELECT count FROM visits WHERE id = 1").fetchone()
    conn.close()
    return {"total_visits": row["count"]}


# ── Run ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
