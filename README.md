# CampusCalm · Campus Mental Health & Wellness Companion
> *Infinity Hacks 2k25 · Theme 4 · Problem 16*
> **One calm, private space to check in, write, unwind, and reach a counselor when it helps.**

### 🌐 Live GitHub Pages Links
- **Login & Onboarding Portal:** [https://murarinaganithin.github.io/CampusCalm/login.html](https://murarinaganithin.github.io/CampusCalm/login.html)
- **Main Application:** [https://murarinaganithin.github.io/CampusCalm/](https://murarinaganithin.github.io/CampusCalm/)

---

## 🌟 Executive Overview
University students face continuous pressures: relentless examination schedules, 75% attendance anxiety, hostel friction, and social transition stress. Yet, campus resources are often fragmented and stigmatized, making students hesitant to seek support under their real names or roll numbers.

**CampusCalm** provides a serene, anonymous, security-first mental health companion engineered specifically for campus life, implementing every requirement from the problem statement and presentation pitch deck:
- 📊 **Track**: One-tap daily mood check-in with contextual campus factors (Exams, Hostel, Sleep, Attendance) and an interactive 14-day wellness trajectory chart.
- 📝 **Write**: Anonymous journaling with **AES-256-CBC database encryption**, zero required PII, and an AI sentiment reflection layer.
- 🚨 **Crisis Safety Net**: Real-time distress keyword scanning with immediate 24/7 crisis helplines including **Tele-MANAS (14416 / 1800-891-4416)** and **KIRAN (1800-599-0019)**.
- 🌿 **Calm**: Interactive visual box breathing pacer (4-4-4-4 & 4-7-8), 5-4-3-2-1 sensory grounding guide, and offline Web Audio API soundscape synthesis (Rain, Ocean, Forest, Lo-fi).
- 🤝 **Connect**: Confidential counselor appointments with **consent-first sharing** (students control whether 14-day mood curves are shared with counselors; journal entries are strictly private).
- 🏫 **Campus Pulse**: Aggregated, anonymized campus-level stress heatmap and exam-cycle intelligence for student welfare committees.

---

## 🔒 Security & Privacy Architecture

| Feature | Implementation | Security Guarantee |
|---|---|---|
| **Anonymous by Default** | Pseudonym generation (e.g. `QuietSparrow #24`) | No student roll numbers, college emails, or real names required. |
| **Journal Encryption at Rest** | Node.js `crypto` with AES-256-CBC & dynamic IVs | Database records store encrypted cipher text. Raw entries are never visible in SQLite. |
| **Consent-Gated Sharing** | Explicit database toggle (`shared_mood_snapshot`) | Counselors see mood score charts **only** if student grants consent. Journal entries are **never** accessible to counselors. |
| **Brute Force Defense** | `express-rate-limit` (300 requests / 15m) | Protects authentication and booking endpoints against brute force attacks. |
| **Security Headers** | Custom HTTP headers (`nosniff`, `DENY` frames, `XSS`) | Hardened against clickjacking and cross-site scripting attacks. |
| **Aggregates Only Authority View** | Anonymized SQL groupings (`AVG`, `COUNT`) | Campus administrators and counselors view macro trends only; individual identities cannot be unmasked. |

---

## 🏗️ Tech Stack
- **Backend**: Node.js & Express REST API
- **Database**: SQLite3 (`saathi.db`) with relational integrity and automatic schema migrations
- **Cryptography**: Native `crypto` (AES-256-CBC with 16-byte random IVs) & `bcryptjs`
- **Frontend**: Clean single-page application (SPA) with responsive Tailwind CSS, custom Calm Sage & Cream aesthetic, Chart.js, and Lucide icons
- **Audio Engine**: Web Audio API mathematical sound synthesizer (Pink noise rain, rhythmic ocean waves, resonant meditation bell) — runs 100% offline without external audio files

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- NPM

### 2. Run the Application
```bash
# Navigate to the project directory
cd "C:\Users\HP\.gemini\antigravity\scratch\saathi-wellness"

# Install dependencies (already installed)
npm install

# Start the server
npm start
```
The application will launch on:
```
http://localhost:5000
```

---

## 🧪 Pre-configured Demo Accounts

For hackathon presentation and live evaluations, pre-seeded accounts are provided:

1. **Anonymous Student Account**:
   - **Pseudonym**: `QuietSparrow #24`
   - **PIN**: `1234`
   - *Includes 14 days of realistic pre-seeded mood history, midterms panic journal entry, and booked consultation with Dr. Ananya Sharma.*

2. **Campus Psychologist Account**:
   - **Name**: `Dr. Ananya Sharma`
   - **PIN**: `1234`
   - *Accesses counselor practice desk, booked student appointments, and consent-gated mood curves.*

3. **Fresh Anonymous Student**:
   - Click **"🎲 Generate New Fresh Anonymous Identity"** in the top navigation to test zero-config instant anonymous onboarding!

---

## 🧭 Project File Structure
```
saathi-wellness/
├── backend/
│   ├── cryptoUtils.js         # AES-256-CBC encryption and decryption routines
│   ├── db.js                  # SQLite database connection, tables, and seeding
│   ├── sentiment.js           # AI reflection engine and Crisis safety net keyword scanner
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role validation middleware
│   └── routes/
│       ├── auth.js            # Pseudonym authentication and consent preference updates
│       ├── moods.js           # Mood logging, 14-day history, streaks, and early warning nudges
│       ├── journals.js        # AES-256 encrypted reflections and AI sentiment suggestions
│       ├── counselors.js      # Counselor directory, booking, and consent-gated telemetry
│       ├── campus.js          # Aggregated campus stress heatmaps & semester benchmarks
│       └── resources.js       # Curated stress guides, breathing protocols, and helplines
├── public/
│   ├── index.html             # Responsive frontend UI matching pitch deck theme
│   ├── style.css              # Custom animations, breathing bubble pacer, and typography
│   ├── audioEngine.js         # Offline Web Audio API sound synthesizer
│   └── app.js                 # Frontend state, Chart.js trends, modals, and API client
├── server.js                  # Main Express entry point with security middleware
├── package.json               # Node.js dependencies and run scripts
└── README.md                  # Comprehensive project documentation
```

---

## 💡 Pitch Deck Alignment Checklist
- [x] **Slide 1 (Saathi)**: Working title and calm campus wellness branding.
- [x] **Slide 2 (The Problem)**: Tackles constant pressure, fragmented resources, and stigma.
- [x] **Slide 3 (Our Solution)**: Four pillars: Track, Write, Calm, Connect.
- [x] **Slide 4 (AI Layer)**: Sentiment reflection, early-warning nudge on low-mood streak, Tele-MANAS 14416 crisis safety net, and prominent disclaimer *"Saathi is a support tool, not a therapist"*.
- [x] **Slide 5 (Privacy and Consent)**: Anonymous by default, consent before sharing, and aggregates-only authority view.
- [x] **Slide 6 (Prototype and Demo)**: 4 distinct screens + Counselor practice view.
- [x] **Slide 7 (Responsible Support)**: Scalable, consent-first, secure campus architecture.
