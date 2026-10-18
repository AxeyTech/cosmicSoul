<div align="center">

# 🌌 CosmicSoul — AI-Powered Vedic Astrology & Numerology

*Where ancient Vedic wisdom meets modern Generative AI.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Deployed on Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com)

[Explore Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Team](#-team--credits)

</div>

---

## 🔮 Overview

**CosmicSoul** is a full-stack Vedic Astrology and Numerology web application engineered to give users personalized astrological readings and deep planetary insights.

By combining authentic astronomical mathematics (**astronomy-engine** with high-precision **Lahiri Chitrapaksha Ayanamsa**) with Google's **Gemini 2.5 Flash LLM**, CosmicSoul delivers instant, rich, and culturally authentic Vedic readings along with interactive 12-house Kundli chart visualisations.

---

## ✨ Key Features

| Category | Highlights |
| :--- | :--- |
| 🔢 **Numerology Engine** | Calculates **Mulank** (Birth Number) and **Bhagyank** (Destiny Number) along with their ruling planets. |
| 🪐 **Authentic Vedic Math** | High-precision ephemeris calculations for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu. |
| 🗺️ **Full Kundli Visualization** | Dynamic North-Indian style 12-house Vedic birth chart with planetary placements and degrees. |
| ⭐ **Nakshatra & Signs** | Pinpoints exact birth Nakshatra (birth star), Nakshatra lord, Moon sign (Rashi), Sun sign, and Lagna (Ascendant). |
| 🤖 **AI-Powered Predictions** | Detailed Gemini AI readings covering: **Personality**, **Love & Relationships**, **Career & Finance**, **Health Guidance**, **Remedies**, and **Yearly Forecast**. |
| 🌐 **Bilingual Support** | One-click toggle between **English** and **Hindi (हिंदी)** for reading generation and interface labels. |
| 🌌 **Cosmic Dark UI** | Deep space theme with responsive interactive canvas starfields, glowing particle grids, and fluid zodiac loader animations. |
| 🏙️ **200+ City Geocoder** | Built-in coordinate database for 200+ Indian and global cities to calculate accurate local ascendants without external API dependencies. |

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3 (Cosmic Glassmorphism), [Vite](https://vitejs.dev/)
- **Backend:** [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), CORS, Dotenv
- **Ephemeris & Math:** [`astronomy-engine`](https://github.com/cosinekitty/astronomy) (VSOP87 theory & IAU precession for Lahiri Ayanamsa)
- **AI Agent & LLM:** Google Gemini 2.5 Flash via `@google/generative-ai`
- **Deployment:** [Render](https://render.com) (with automatic `render.yaml` blueprint) & [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)

---

## 📁 Repository Structure

```text
CosmicSoul/
├── backend/
│   ├── cities.js           # 200+ cities coordinates lookup database
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Express API, Vedic ephemeris engine & Gemini integration
├── frontend/
│   ├── index.html          # Semantic HTML5 entry point
│   ├── package.json        # Frontend build dependencies (Vite)
│   ├── vite.config.js      # Vite build configuration
│   └── src/
│       ├── app.js          # Kundli rendering & astrological UI logic
│       ├── main.js         # Interactive starfield canvas & API client
│       └── style.css       # Cosmic UI animations & glassmorphism styles
├── package.json            # Root orchestration build & start scripts
├── render.yaml             # Render cloud infrastructure blueprint
├── LICENSE                 # MIT Open-Source License
└── README.md               # Documentation
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites

- **Node.js** v18 or higher installed
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/AxeyTech/cosmicSoul.git
cd cosmicSoul
```

### 2. Install Dependencies

```bash
npm run setup
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Servers

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

---

## ☁️ Deployment

### Deploy on Render (Recommended)

This repository includes a pre-configured `render.yaml` blueprint.

1. Sign in to [Render](https://dashboard.render.com/) with GitHub.
2. Click **New +** → **Web Service** and connect this repository.
3. Add the following environment variable in the Render dashboard:
   - `GEMINI_API_KEY`: *(Your Google AI Studio API key)*
4. Click **Create Web Service**. Render will automatically build the Vite frontend and serve it using Express with free SSL/HTTPS!

---

## 👥 Team & Credits

- **Team Name:** Cloud Nexus (IBMBH09372)
- **Team Leader:** Akshay Sharma ([@AxeyTech](https://github.com/AxeyTech))
- **Team Member:** Mohit Guwalani
- **College:** Vivekananda Institute of Professional Studies – Technical Campus (VIPS-TC), Delhi
- **Internship:** AICTE | IBM SkillsBuild Gen AI & Cloud Computing Internship | BharatCares

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for personal, educational, and commercial use.
