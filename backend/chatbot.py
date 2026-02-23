"""
chatbot.py
----------
Intelligent portfolio chatbot with:
  - Intent detection (greetings, small talk, domain queries)
  - TF-IDF similarity matching on an expanded resume corpus
  - Structured, formatted responses
  - Contextual fallback handling
"""

import re
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


# ═══════════════════════════════════════════════════════════════════════════
# 1. INTENT PATTERNS — matched before TF-IDF for speed and accuracy
# ═══════════════════════════════════════════════════════════════════════════

GREETING_PATTERNS = re.compile(
    r"^(hi|hello|hey|hii+|hola|greetings|good\s*(morning|afternoon|evening|day)|yo|sup|what'?s?\s*up)(\s+\w+)?[\s!?.]*$",
    re.IGNORECASE,
)

SMALLTALK_PATTERNS = {
    re.compile(r"(who\s+are\s+you|what\s+are\s+you|about\s+you)", re.I): (
        "I'm Aviral's AI portfolio assistant! 🤖 I can tell you about his "
        "skills, projects, work experience, education, and more. "
        "Just ask me anything — for example:\n\n"
        "• \"What projects has Aviral built?\"\n"
        "• \"What tech stack does he use?\"\n"
        "• \"Tell me about his experience\""
    ),
    re.compile(r"(what\s+(can|do)\s+you\s+do|how\s+can\s+you\s+help|help)", re.I): (
        "I can answer questions about Aviral's portfolio! Try asking about:\n\n"
        "🔹 Projects — Fraud Shield, Telecom Churn, Medicine Bot\n"
        "🔹 Skills — Python, AI/ML, FastAPI, and more\n"
        "🔹 Experience — Data Science & Salesforce internships\n"
        "🔹 Education — B.Tech at Manipal University Jaipur\n"
        "🔹 Contact — Email, LinkedIn, GitHub"
    ),
    re.compile(r"(thank|thanks|thx|ty)", re.I): (
        "You're welcome! 😊 Feel free to ask if you have more questions about Aviral."
    ),
    re.compile(r"(bye|goodbye|see\s*you|take\s*care)", re.I): (
        "Goodbye! 👋 Thanks for visiting Aviral's portfolio. Have a great day!"
    ),
    re.compile(r"(how\s+are\s+you|how\s+do\s+you\s+do)", re.I): (
        "I'm doing great, thank you for asking! 😊 "
        "I'm here to help you learn about Aviral. What would you like to know?"
    ),
}

GREETING_RESPONSES = [
    "Hey there! 👋 Welcome to Aviral's portfolio. What would you like to know about him?",
    "Hi! 😊 I'm Aviral's portfolio assistant. Ask me about his projects, skills, or experience!",
    "Hello! 🚀 Great to have you here. I can tell you about Aviral's work, tech stack, or background.",
    "Hey! 👋 I know all about Aviral's skills and projects. What are you curious about?",
]


# ═══════════════════════════════════════════════════════════════════════════
# 2. EXPANDED KNOWLEDGE CORPUS — richer, more detailed training data
# ═══════════════════════════════════════════════════════════════════════════

KNOWLEDGE_BASE = [
    # ── Professional Summary ────────────────────────────────────────────
    {
        "label": "About Aviral",
        "keywords": "about aviral dubey who is he summary introduction profile overview background",
        "content": (
            "Aviral Dubey is a Data Analyst & Applied AI Engineer based in India. "
            "He specializes in fraud detection, machine learning, and risk analytics. "
            "He has built real-time AI-powered fraud intelligence systems integrating "
            "LLMs with hybrid risk scoring models.\n\n"
            "🎓 B.Tech in Information Technology — Manipal University Jaipur\n"
            "📊 GPA: 10.0 (Final Semester)\n"
            "🔬 Focus: AI, Fraud Detection, Data Analytics"
        ),
    },
    # ── Skills ──────────────────────────────────────────────────────────
    {
        "label": "Technical Skills",
        "keywords": "skills tech stack technologies programming languages frameworks tools what can he do abilities",
        "content": (
            "Aviral's technical skill set:\n\n"
            "💻 Languages: Python, SQL\n"
            "⚙️ Frameworks: FastAPI, React\n"
            "🤖 AI & ML: Gemini AI, Scikit-learn, NLP, Risk Modeling\n"
            "📊 Data & Analytics: Power BI, Pandas, NumPy\n"
            "🗄️ Databases: SQLite, MySQL\n"
            "🛠️ Tools: Git, VS Code, REST APIs\n"
            "📐 Concepts: Risk Scoring, Fraud Detection, API Design, System Architecture"
        ),
    },
    {
        "label": "Python & AI Skills",
        "keywords": "python programming machine learning artificial intelligence deep learning model ml ai nlp",
        "content": (
            "Aviral is proficient in Python for data science and AI development.\n\n"
            "His Python expertise includes:\n"
            "• Machine Learning with Scikit-learn\n"
            "• Natural Language Processing (NLP)\n"
            "• REST API development with FastAPI\n"
            "• Data analysis with Pandas & NumPy\n"
            "• AI integration with Gemini AI\n"
            "• Risk modeling and statistical analysis"
        ),
    },
    # ── Projects ────────────────────────────────────────────────────────
    {
        "label": "All Projects",
        "keywords": "projects portfolio work built what has he built developed created applications",
        "content": (
            "Aviral has built 3 major projects:\n\n"
            "🚨 Fraud Shield — Real-time AI scam intelligence system\n"
            "   Tech: Python, FastAPI, Gemini AI, SQLite\n\n"
            "📊 Telecom Churn Prediction — ML-based customer attrition model\n"
            "   Tech: Python, Scikit-learn, SQL\n\n"
            "💊 Medicine Recommendation Bot — NLP-powered symptom analyzer\n"
            "   Tech: Python, NLP"
        ),
    },
    {
        "label": "Fraud Shield Project",
        "keywords": "fraud shield scam detection upi phishing risk engine real time intelligence system fraud detection",
        "content": (
            "🚨 Fraud Shield — Real-Time AI-Powered Scam Intelligence System\n\n"
            "A comprehensive fraud detection platform targeting Indian digital scams "
            "(UPI fraud, KYC phishing, OTP theft, fake job scams).\n\n"
            "Key features:\n"
            "• Hybrid multi-factor risk engine with 0–100 scoring:\n"
            "  — Keyword Analysis (30%)\n"
            "  — Identifier Pattern Matching (25%)\n"
            "  — Report Frequency Escalation (20%)\n"
            "  — Gemini AI Confidence (25%)\n"
            "• Gemini 1.5 Flash integration for scam classification\n"
            "• REST APIs for fraud reporting & dashboard analytics\n"
            "• Identifier reputation tracking & repeat-offender detection\n\n"
            "Tech Stack: Python, FastAPI, Gemini AI, SQLite"
        ),
    },
    {
        "label": "Telecom Churn Project",
        "keywords": "telecom churn attrition customer prediction machine learning classification",
        "content": (
            "📊 Telecom Customer Attrition Prediction\n\n"
            "Built ML models to predict telecom customer churn.\n\n"
            "Highlights:\n"
            "• Feature engineering & data preprocessing\n"
            "• Model evaluation: accuracy, precision, recall, F1-score\n"
            "• Delivered actionable business insights to reduce churn\n\n"
            "Tech Stack: Python, Scikit-learn, SQL"
        ),
    },
    {
        "label": "Medicine Chatbot Project",
        "keywords": "medicine recommendation chatbot health symptom medical drug pharmacy ai bot",
        "content": (
            "💊 AI-Based Medicine Recommendation Chatbot\n\n"
            "An intelligent chatbot for symptom-based medicine suggestions.\n\n"
            "Features:\n"
            "• NLP pipeline for query interpretation\n"
            "• Structured response logic for safe recommendations\n"
            "• Handles natural language symptom descriptions\n\n"
            "Tech Stack: Python, NLP"
        ),
    },
    # ── Experience ──────────────────────────────────────────────────────
    {
        "label": "Work Experience",
        "keywords": "experience work internship job career professional intern company",
        "content": (
            "Aviral's professional experience:\n\n"
            "📊 Data Science Intern — YBI Foundation (2024)\n"
            "• Fraud detection use cases & exploratory data analysis\n"
            "• Power BI dashboards for business insights\n"
            "• Data cleaning, transformation & model validation\n\n"
            "☁️ Salesforce Summer Intern — SmartInternz (Jul 2024)\n"
            "• Salesforce automation, Apex, LWC & security models\n"
            "• Completed Apex Specialist & Process Automation Superbadges"
        ),
    },
    {
        "label": "Data Science Internship",
        "keywords": "data science intern ybi foundation power bi dashboard analytics",
        "content": (
            "📊 Data Science Intern — YBI Foundation (2024)\n\n"
            "Key responsibilities:\n"
            "• Worked on fraud detection use cases and exploratory data analysis\n"
            "• Developed Power BI dashboards for business insights and reporting\n"
            "• Performed data cleaning, transformation, and model validation"
        ),
    },
    {
        "label": "Salesforce Internship",
        "keywords": "salesforce intern smartinternz apex lwc lightning crm cloud summer",
        "content": (
            "☁️ Salesforce Summer Intern — SmartInternz (Jul 2024)\n\n"
            "Key achievements:\n"
            "• Gained hands-on experience in Salesforce automation\n"
            "• Worked with Apex, Lightning Web Components (LWC), and security models\n"
            "• Completed Apex Specialist & Process Automation Superbadges"
        ),
    },
    # ── Education ───────────────────────────────────────────────────────
    {
        "label": "Education",
        "keywords": "education university college degree btech bachelor study student academic gpa grade school",
        "content": (
            "🎓 Education\n\n"
            "B.Tech in Information Technology\n"
            "Manipal University Jaipur (2021–2025)\n"
            "Final Semester GPA: 10.0\n\n"
            "Aviral has a strong academic foundation in computer science, "
            "data structures, algorithms, and software engineering."
        ),
    },
    # ── Contact ─────────────────────────────────────────────────────────
    {
        "label": "Contact Information",
        "keywords": "contact email phone reach connect linkedin github social media hire hiring",
        "content": (
            "📬 Contact Aviral\n\n"
            "📧 Email: er.aviraldubey@gmail.com\n"
            "🔗 LinkedIn: linkedin.com/in/aviral-dubey-ml-engineer\n"
            "💻 GitHub: github.com/aviral022\n"
            "📍 Location: India"
        ),
    },
    # ── Extra context sections for better matching ──────────────────────
    {
        "label": "Fraud Detection Expertise",
        "keywords": "fraud detection risk scoring risk analytics cybersecurity fintech financial security",
        "content": (
            "Aviral specializes in fraud detection and risk analytics.\n\n"
            "His expertise includes:\n"
            "• Building hybrid risk scoring models (0–100 scale)\n"
            "• Integrating LLMs for scam classification\n"
            "• Real-time identifier reputation tracking\n"
            "• UPI fraud, KYC phishing, and OTP theft detection\n"
            "• API-driven fraud intelligence dashboards"
        ),
    },
    {
        "label": "Data Analytics",
        "keywords": "data analysis analytics power bi visualization reporting dashboard pandas numpy",
        "content": (
            "Aviral has strong data analytics skills:\n\n"
            "• Power BI for interactive business dashboards\n"
            "• Pandas & NumPy for data manipulation\n"
            "• SQL for database querying and analysis\n"
            "• Exploratory Data Analysis (EDA)\n"
            "• Business insights and trend visualization"
        ),
    },
]


# ═══════════════════════════════════════════════════════════════════════════
# 3. TF-IDF MODEL — built from combined content + keywords
# ═══════════════════════════════════════════════════════════════════════════

_labels = [item["label"] for item in KNOWLEDGE_BASE]
# Combine keywords + content for richer matching
_corpus = [f"{item['keywords']} {item['content']}" for item in KNOWLEDGE_BASE]
_responses = [item["content"] for item in KNOWLEDGE_BASE]

_vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2),    # Unigrams + bigrams for better phrase matching
    max_df=0.95,           # Ignore terms in >95% of docs
    min_df=1,
)
_tfidf_matrix = _vectorizer.fit_transform(_corpus)


# ═══════════════════════════════════════════════════════════════════════════
# 4. FALLBACK RESPONSES — varied to feel natural
# ═══════════════════════════════════════════════════════════════════════════

FALLBACK_RESPONSES = [
    (
        "I'm not quite sure about that, but I can tell you about Aviral's:\n\n"
        "🔹 Projects — Fraud Shield, Telecom Churn, Medicine Bot\n"
        "🔹 Skills — Python, AI/ML, FastAPI\n"
        "🔹 Experience — Data Science & Salesforce internships\n"
        "🔹 Education — B.Tech at Manipal University"
    ),
    (
        "That's outside my area of expertise! I'm best at answering questions about "
        "Aviral's work and background. Try asking:\n\n"
        "• \"What projects has he built?\"\n"
        "• \"What are his skills?\"\n"
        "• \"Tell me about his experience\""
    ),
    (
        "Hmm, I don't have specific info on that. But I'd love to help with "
        "questions about Aviral's skills, projects, or career! 😊"
    ),
]


# ═══════════════════════════════════════════════════════════════════════════
# 5. MAIN ANSWER FUNCTION
# ═══════════════════════════════════════════════════════════════════════════

def get_answer(query: str) -> dict:
    """
    Process a user query through the intent pipeline:
      1. Empty check
      2. Greeting detection
      3. Small talk detection
      4. TF-IDF similarity matching
      5. Fallback response
    """
    # ── Step 1: Empty input ─────────────────────────────────────────────
    if not query or not query.strip():
        return {
            "section": "👋 Welcome",
            "answer": random.choice(GREETING_RESPONSES),
            "confidence": 1.0,
            "intent": "greeting",
        }

    cleaned = query.strip()

    # ── Step 2: Greeting detection ──────────────────────────────────────
    if GREETING_PATTERNS.match(cleaned):
        return {
            "section": "👋 Hello!",
            "answer": random.choice(GREETING_RESPONSES),
            "confidence": 1.0,
            "intent": "greeting",
        }

    # ── Step 3: Small talk detection ────────────────────────────────────
    for pattern, response in SMALLTALK_PATTERNS.items():
        if pattern.search(cleaned):
            return {
                "section": "💬 Chat",
                "answer": response,
                "confidence": 1.0,
                "intent": "smalltalk",
            }

    # ── Step 4: TF-IDF similarity match ─────────────────────────────────
    query_vec = _vectorizer.transform([cleaned])
    similarities = cosine_similarity(query_vec, _tfidf_matrix).flatten()

    # Get top 2 matches for potential multi-section answers
    top_indices = np.argsort(similarities)[::-1][:2]
    best_idx = int(top_indices[0])
    best_score = float(similarities[best_idx])

    # High confidence — return the best match
    if best_score >= 0.08:
        return {
            "section": f"📌 {_labels[best_idx]}",
            "answer": _responses[best_idx],
            "confidence": round(float(best_score), 4),
            "intent": "domain_query",
        }

    # ── Step 5: Fallback ────────────────────────────────────────────────
    return {
        "section": "🤔 Hmm...",
        "answer": random.choice(FALLBACK_RESPONSES),
        "confidence": round(float(best_score), 4),
        "intent": "fallback",
    }
