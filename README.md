# 🧠 PsyMind.AI  
**AI-Assisted Psychoeducational System for Behavioral Awareness in Adolescents**

---

## Overview

**PsyMind.AI** is an AI-assisted psychoeducational platform designed to help high school students understand, interpret, and regulate their emotions and behaviors through evidence-based psychology.

The system analyzes student self-reports and generates structured, empathetic feedback grounded in established psychological frameworks. It aims to reduce maladaptive patterns such as procrastination, anxiety, and self-sabotage while promoting self-awareness and academic performance.

Unlike generic conversational agents, PsyMind.AI is explicitly designed with **ethical safeguards**, **scientific grounding**, and **educational intent**, positioning it at the intersection of AI, psychology, and human-centered design.

---

## Problem Statement

Adolescents frequently experience:
- Difficulty understanding their emotional states  
- Low self-regulation and inconsistent motivation  
- High levels of academic stress and anxiety  

Existing tools are often:
- Clinically oriented (limited accessibility)  
- Generic and not evidence-based  

**PsyMind.AI addresses this gap** by providing a structured, AI-assisted system for emotional interpretation and behavioral guidance.

---

## Scientific Foundation

This project is grounded in established psychological theories:

- Cognitive Behavioral Therapy (CBT)  
- Self-Determination Theory (Deci & Ryan)  
- Growth Mindset (Carol Dweck)  

These frameworks guide how the AI interprets user input and generates feedback, ensuring theoretical consistency and educational value.

---

## Core Features

### 🧠 Intelligent Chat
- Context-aware conversations powered by Google Gemini  
- Structured emotional interpretation  
- Empathetic and age-appropriate responses  

### 🎯 Student Tools
- **Pomodoro Timer** – Focus sessions with break cycles  
- **Mood Tracker** – Daily emotional monitoring  
- **Guided Breathing** – Visual and timed exercises  
- **Reflections** – Curated prompts for self-awareness  
- **Soundscapes** – Ambient audio for concentration  

### ♿ Accessibility
- Light/Dark themes  
- Adjustable font sizes  
- High contrast mode  
- Reduced motion support  
- Voice input via Web Speech API  

---

## System Architecture

### Frontend
- React  
- Vite  
- Framer Motion  

### AI Layer
- Google Gemini 1.5 Flash  
- Prompt engineering via NotebookLM  
- Personality tuning via Gemini Gems  

### Data Flow

    User Input  
       ↓  
    Prompt Builder (NotebookLM-informed)  
       ↓  
    Gemini API  
       ↓  
    Response Structuring Layer  
       ↓  
    User Interface  

---

## Evaluation (Planned)

To assess effectiveness, the following metrics are proposed:

- Self-reported reduction in procrastination  
- Mood progression over time  
- User engagement (session duration & frequency)  
- Qualitative feedback on perceived usefulness  

---

## Ethical Considerations

PsyMind.AI is designed with strict ethical boundaries:

- Does **not** replace professional psychological care  
- Encourages seeking professional help when necessary  
- Avoids diagnostic or clinical claims  
- Focuses on educational and supportive guidance  

A future module aims to connect users with:
- Volunteer psychologists  
- Free or accessible mental health services  

---

## Technologies

### Frontend
- React  
- Vite  
- Framer Motion  
- Web Speech API  

### AI & Research
- Google Gemini API  
- NotebookLM  
- Gemini Gems  

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)  
- npm or yarn  

### Installation

    git clone https://github.com/LeonZZlambda/PsyMindAI.git
    cd PsyMindAI
    npm install

### Environment Setup (Optional)

    cp .env.example .env
    # Add your VITE_GEMINI_API_KEY

### Run the Project

    npm run dev

---

## Deployment (Recommended)

For public access and portfolio usage:

- Vercel  
- Netlify  

---

## Disclaimer

**PsyMind.AI provides educational support and does not replace professional psychological or psychiatric care.**  
Users experiencing severe symptoms are strongly encouraged to seek qualified professionals.

---

## License

This project is licensed under the **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

---

## Future Work

- Integration with mental health support networks  
- Personalization via longitudinal user data  
- Improved behavioral modeling  
- Multilingual support  
- Mobile-first optimization  

---

## Author

Developed by **Leonardo** as an interdisciplinary project combining:
- Artificial Intelligence  
- Psychology  
- Education  
