// ---------- data ----------
const PROJECTS = [
  {
    id: "sentimentiq", name: "SentimentIQ", tags: ["web", "ml", "java"], flagship: true,
    blurb: "Real-time emotion analysis across 28 categories: fine-tuned DistilBERT served through five Dockerized services, 300ms end to end.",
    stack: ["Spring Boot 3.5", "Java 21", "React 18", "FastAPI", "DistilBERT", "MLflow", "PostgreSQL 16", "Redis 7", "Docker"],
    repo: "https://github.com/PriyanshCh/sentimentiq",
    detail: {
      problem: "Most ML projects stop at the model. This one starts there: what does it take to serve a fine-tuned model to real users, with auth, caching, streaming and a live UI?",
      metrics: [["0.57", "F1 across 28 emotions"], ["43,410", "training samples"], ["<1ms", "cache hit vs 50ms inference"], ["300ms", "browser → model → browser"]],
      built: [
        "Fine-tuned DistilBERT on GoEmotions; loss fell from 0.70 to 0.07 over 3 epochs, every run tracked in MLflow",
        "Spring Boot 3.5 (Java 21) backend with JWT auth, PostgreSQL persistence and Redis caching",
        "Server-Sent Events push each result to the browser the moment inference finishes",
        "React dashboard with live Recharts views: emotion bars, sentiment trend, real-time feed",
        "All 5 services start in order with health checks from one docker compose up",
      ],
      decisions: [
        "ML lives in its own FastAPI service, so the model can change without touching the Java backend",
        "SSE instead of WebSockets: the stream only goes one way, server to client",
        "Redis in front of the model: repeated text returns in under 1ms instead of 50ms",
        "Hard parts were the glue: SSE through Nginx, circular Spring bean dependencies, Docker layer cache corruption",
      ],
      table: [["frontend", "React 18 + Vite + Nginx", "3000"], ["backend", "Spring Boot 3.5 + JWT", "8080"], ["ml-service", "FastAPI + DistilBERT", "8000"], ["postgres", "PostgreSQL 16", "5432"], ["redis", "Redis 7", "6379"]],
    },
  },
  {
    id: "onestack", name: "Core Banking & UPI Platform", tags: ["web", "work"], work: "OneStack",
    blurb: "22 features shipped across core banking, UPI payments, KYC and regulatory reporting for banks, in production at OneStack.",
    stack: ["PHP", "CodeIgniter", "MySQL", "Symfony", "Twig", "jQuery", "Bootstrap", "REST APIs"],
    detail: {
      problem: "Banks run on dozens of connected workflows: accounts, payments, KYC, reconciliation and regulator reports. Each one needs correct data, fast queries and failures you can actually trace.",
      metrics: [["22", "features & modules"], ["15+", "bank MIS reports"], ["150+", "automated backend tests"], ["P2PM", "Yes Bank API integration"]],
      built: [
        "<b>Payments:</b> end-to-end P2M console, and P2PM merchant onboarding and VPA generation through Yes Bank seller and terminal APIs, with callbacks, JWT signature checks, encryption and queue-based error tracking",
        "<b>Dashboards:</b> refactored UPI 1.0/2.0 and Soundbox dashboards; optimized aggregation queries on large transaction tables",
        "<b>Reporting:</b> 15+ bank MIS reports, Monthly MIS refactor, reconciliation dashboard and RBI regulatory reports",
        "<b>Core banking:</b> share certificates, cheque books, statements, passbooks, demand drafts, cash register, board resolutions and MoM",
        "<b>KYC:</b> Face Liveness API, unified mobile KYC, eKYC Setu app and TransUnion UI",
        "<b>Quality:</b> 150+ automated backend tests for the CBS Debugger (Symfony + Twig); project-wide jQuery and Bootstrap upgrade",
      ],
      decisions: [
        "Profile before rewriting: query execution analysis found the bottlenecks in Monthly MIS before any joins changed",
        "One central mapper instead of mapping logic copied across modules",
        "Failed onboarding is logged with queue status, so payment errors are visible instead of silent",
      ],
    },
  },
  {
    id: "semantiq", name: "SemantiQ", tags: ["ml"],
    blurb: "Semantic question matching engine that flags duplicate questions.",
    stack: ["Python", "Deep learning", "Jupyter"],
    repo: "https://github.com/PriyanshCh/Duplicate-Question-Detection-DQD-",
    detail: {
      problem: "Forums, support desks and knowledge bases fill up with the same question asked in different words.",
      built: ["A deep-learning model that compares question pairs by meaning rather than exact wording", "Notebook pipeline covering preprocessing, training and evaluation"],
      decisions: ["Matching on meaning catches paraphrases that keyword search misses"],
    },
  },
  {
    id: "sorting", name: "Sorting Visualizer", tags: ["web"],
    blurb: "Interactive visualizer for five classic sorting algorithms.",
    stack: ["HTML", "CSS", "JavaScript"],
    repo: "https://github.com/PriyanshCh/Sorting-Visualizer", live: "https://sorting-algo-4a223a.netlify.app/",
    detail: {
      problem: "Sorting algorithms are easy to memorize and hard to picture.",
      built: ["Bubble, Selection, Insertion, Merge and Quick sort, animated step by step", "Adjustable array size and speed", "No framework: plain DOM and JavaScript, deployed on Netlify"],
      decisions: ["A smaller version runs in the Lab section of this page"],
    },
  },
  {
    id: "nst", name: "Neural Style Transfer", tags: ["ml", "work"],
    blurb: "Internship project: a model that turns photos into high-quality artistic images.",
    stack: ["Python", "OpenCV", "Deep learning"], work: "IBM",
    detail: {
      problem: "Generate artistic versions of images fast enough to be usable, not just in a research notebook.",
      built: ["A Neural Style Transfer model built during my IBM internship (Jun–Aug 2024)", "Optimized the inference pipeline to reduce processing latency", "Documented findings and presented results to mentors and tech leads"],
      decisions: ["Iterated with a small research team on visual AI models"],
    },
  },
  {
    id: "finger", name: "Finger Canvas", tags: ["ml"],
    blurb: "Draw and sketch with finger gestures, using gesture recognition in Python.",
    stack: ["Python", "Computer vision"],
    repo: "https://github.com/PriyanshCh/Finger-Canvas-Digital-Sketchpad",
    detail: {
      problem: "Drawing on a computer usually needs a mouse or a stylus.",
      built: ["Gesture recognition that turns finger movement into strokes", "A Python UI for a smooth sketching experience"],
      decisions: [],
    },
  },
  {
    id: "fraud", name: "Credit Card Fraud Detection", tags: ["ml"],
    blurb: "Classifying fraudulent transactions in a heavily imbalanced dataset.",
    stack: ["Python", "scikit-learn", "Jupyter"],
    repo: "https://github.com/PriyanshCh/Credit-Card-Fraud-Detection",
    detail: {
      problem: "Fraud is rare, so a model that always predicts 'legit' looks accurate and catches nothing.",
      built: ["Notebook pipeline for exploring, training and evaluating fraud classifiers"],
      decisions: [],
    },
  },
  {
    id: "leetcode", name: "LeetCode Solutions", tags: ["java"],
    blurb: "My running archive of solved LeetCode problems in Java.",
    stack: ["Java", "DSA"],
    repo: "https://github.com/PriyanshCh/LeetCode-All-Problems",
    detail: {
      problem: "Interview-grade problem solving takes steady practice.",
      built: ["Solutions committed as I solve them, organized for revision"],
      decisions: [],
    },
  },
];

const ARCH = {
  frontend: ["Frontend", "React 18 + Vite + Nginx", ":3000 → 80", "The dashboard. Sends text to /api and renders live Recharts views (emotion bars, sentiment trend, feed) as results stream back over SSE. About 300ms end to end."],
  backend: ["Backend", "Spring Boot 3.5 · Java 21 · JWT", ":8080", "Auth, persistence and orchestration. Calls the ML service over HTTP and streams results to the browser."],
  ml: ["ML service", "FastAPI + DistilBERT (PyTorch)", ":8000", "DistilBERT fine-tuned on 43,410 GoEmotions samples, F1 0.57 across 28 emotions, about 50ms per inference. Returns 503 until a model is trained."],
  postgres: ["PostgreSQL", "PostgreSQL 16", ":5432", "Stores users and analysis history."],
  redis: ["Redis", "Redis 7", ":6379", "Caches results by text: a repeat request returns in under 1ms instead of a 50ms model call."],
};
