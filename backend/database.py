"""
database.py
-----------
SQLite database setup, table creation, and initial data seeding
for the developer portfolio backend.
"""

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "portfolio.db")


def get_connection():
    """Return a new SQLite connection with row_factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables and seed initial data if the database is fresh."""
    conn = get_connection()
    cursor = conn.cursor()

    # ── Tables ──────────────────────────────────────────────────────────
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS projects (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT NOT NULL,
            description TEXT NOT NULL,
            tech_stack  TEXT NOT NULL,          -- JSON array
            image_url   TEXT DEFAULT '',
            github_url  TEXT DEFAULT '',
            sort_order  INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS experience (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            role        TEXT NOT NULL,
            company     TEXT NOT NULL,
            period      TEXT NOT NULL,
            description TEXT NOT NULL,          -- JSON array of bullet points
            sort_order  INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS skills (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            items    TEXT NOT NULL              -- JSON array
        );

        CREATE TABLE IF NOT EXISTS contacts (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            email      TEXT NOT NULL,
            message    TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS visits (
            id    INTEGER PRIMARY KEY CHECK (id = 1),
            count INTEGER DEFAULT 0
        );
    """)

    # ── Seed data (only if tables are empty) ────────────────────────────
    if cursor.execute("SELECT COUNT(*) FROM projects").fetchone()[0] == 0:
        _seed_projects(cursor)

    if cursor.execute("SELECT COUNT(*) FROM experience").fetchone()[0] == 0:
        _seed_experience(cursor)

    if cursor.execute("SELECT COUNT(*) FROM skills").fetchone()[0] == 0:
        _seed_skills(cursor)

    if cursor.execute("SELECT COUNT(*) FROM visits").fetchone()[0] == 0:
        cursor.execute("INSERT INTO visits (id, count) VALUES (1, 0)")

    conn.commit()
    conn.close()


# ── Seed helpers ────────────────────────────────────────────────────────────

def _seed_projects(cursor):
    projects = [
        {
            "title": "Fraud Shield – Real-Time AI-Powered Scam Intelligence System",
            "description": (
                "Designed and developed a real-time fraud intelligence platform "
                "targeting Indian digital scams (UPI fraud, KYC phishing, OTP theft, "
                "fake job scams). Built a hybrid multi-factor risk engine (0–100 scoring "
                "model) combining Keyword Analysis (30%), Identifier Pattern Matching (25%), "
                "Report Frequency Escalation (20%), and Gemini AI Confidence (25%). "
                "Integrated Gemini 1.5 Flash for structured scam classification. "
                "Developed REST APIs for fraud reporting, identifier lookup, AI-powered "
                "content analysis, and dashboard analytics."
            ),
            "tech_stack": json.dumps(["Python", "FastAPI", "Gemini AI", "SQLite"]),
            "image_url": "/images/fraud-shield.png",
            "github_url": "https://github.com/aviral022",
            "sort_order": 1,
        },
        {
            "title": "Telecom Customer Attrition Prediction",
            "description": (
                "Built machine learning models to predict telecom customer churn. "
                "Performed feature engineering and data preprocessing. Evaluated models "
                "using accuracy, precision, recall, and F1-score. Delivered business "
                "insights to reduce churn risk."
            ),
            "tech_stack": json.dumps(["Python", "Scikit-learn", "SQL"]),
            "image_url": "/images/telecom-churn.png",
            "github_url": "https://github.com/aviral022",
            "sort_order": 2,
        },
        {
            "title": "AI-Based Medicine Recommendation Chatbot",
            "description": (
                "Developed AI chatbot for symptom-based medicine suggestions. "
                "Implemented NLP pipeline for query interpretation. Designed structured "
                "response logic for safe recommendations."
            ),
            "tech_stack": json.dumps(["Python", "NLP"]),
            "image_url": "/images/medicine-bot.png",
            "github_url": "https://github.com/aviral022",
            "sort_order": 3,
        },
    ]
    for p in projects:
        cursor.execute(
            "INSERT INTO projects (title, description, tech_stack, image_url, github_url, sort_order) "
            "VALUES (:title, :description, :tech_stack, :image_url, :github_url, :sort_order)",
            p,
        )


def _seed_experience(cursor):
    experience = [
        {
            "role": "Data Science Intern",
            "company": "YBI Foundation",
            "period": "2024",
            "description": json.dumps([
                "Worked on fraud detection use cases and exploratory data analysis.",
                "Developed Power BI dashboards for business insights and reporting.",
                "Performed data cleaning, transformation, and model validation.",
            ]),
            "sort_order": 1,
        },
        {
            "role": "Salesforce Summer Intern",
            "company": "SmartInternz",
            "period": "Jul 2024",
            "description": json.dumps([
                "Gained experience in Salesforce automation, Apex, LWC, and security models.",
                "Completed Apex Specialist & Process Automation Superbadges.",
            ]),
            "sort_order": 2,
        },
    ]
    for e in experience:
        cursor.execute(
            "INSERT INTO experience (role, company, period, description, sort_order) "
            "VALUES (:role, :company, :period, :description, :sort_order)",
            e,
        )


def _seed_skills(cursor):
    skills = [
        {"category": "Languages", "items": json.dumps(["Python", "SQL"])},
        {"category": "Frameworks", "items": json.dumps(["FastAPI", "React"])},
        {"category": "AI & ML", "items": json.dumps(["Gemini AI", "Scikit-learn", "NLP", "Risk Modeling"])},
        {"category": "Data & Analytics", "items": json.dumps(["Power BI", "Pandas", "NumPy"])},
        {"category": "Databases", "items": json.dumps(["SQLite", "MySQL"])},
        {"category": "Tools", "items": json.dumps(["Git", "VS Code", "REST APIs"])},
        {"category": "Gen AI", "items": json.dumps([
            "Prompt Engineering", "LangChain", "RAG Pipelines",
            "Gemini API", "ChatGPT", "AI Agents",
        ])},
        {"category": "Salesforce", "items": json.dumps([
            "Apex", "LWC", "SOQL", "Flows", "Process Automation",
        ])},
        {"category": "Concepts", "items": json.dumps([
            "Risk Scoring Systems", "Fraud Detection",
            "Data Analysis", "API Design", "System Architecture",
        ])},
    ]
    for s in skills:
        cursor.execute(
            "INSERT INTO skills (category, items) VALUES (:category, :items)",
            s,
        )
