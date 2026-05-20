# PsyMind.AI Local Setup Guide

Follow this guide to configure and run the PsyMind.AI application locally for development and testing.

---

## 📋 Prerequisites

- **Node.js**: `≥ 18.0.0` (LTS recommended)
- **Package Manager**: `npm` (packaged with Node.js)

We highly recommend pinning your Node runtime environment using `nvm` (Node Version Manager):

```bash
# Pin Node.js to LTS version
nvm install --lts
nvm use --lts
```

---

## 🔑 Gemini API Key Configuration

To experience real AI-generated study paths and self-regulation chats, you need a Google Gemini API Key.

### 1. Get an API Key
1. Navigate to [Google AI Studio](https://aistudio.google.com/).
2. Log in with your Google account.
3. Click **Get API Key** and create a new key.
4. Copy your generated key to your clipboard.

### 2. Configure the Environment
Duplicate the environment template file at the project root:

```bash
cp .env.example .env
```

Open `.env` in your text editor and set your key:

```env
VITE_GEMINI_API_KEY=your_copied_api_key_here
```

---

## 📦 Running the Application

Install the node modules and start the Vite local development server:

```bash
# Install dependencies
npm install

# Start Vite hot-reloading development server
npm run dev
```

The terminal will print the local host URI (default: `http://localhost:5173`). Open it in your browser.

---

## 🧪 Demo Mode Fallback

If you don't configure `VITE_GEMINI_API_KEY` in `.env`, the application automatically falls back to **Demo Mode**.
- Simulated streaming logic runs client-side to emulate Gemini API responses.
- Enables complete visual evaluation and testing of all UI features (chats, modals, OBI Judge) without consuming Google API quotas or requiring an active internet connection.

---

## ⚡ Production Verification Commands

To validate that your modifications build and test cleanly before submitting, execute these build scripts:

```bash
# 1. Type-Checking (Validate TypeScript compiling)
npm run type-check

# 2. Linting (Validate code syntax & style conformance)
npm run lint

# 3. Unit Testing (Run Vitest suites)
npm run test

# 4. CI Test Run (Run Vitest with code coverage analysis)
npm run test:ci

# 5. Production Compilation
npm run build

# 6. Local Preview (Serve the compiled dist folder locally)
npm run preview
```

---

## 📊 Google AI Studio Free Tier Quota Limits

If your API key requests fail with HTTP `429 Too Many Requests`, check your usage against the Google Free Tier quotas:

| Metric | Quota Value |
|---|---|
| Requests Per Minute (RPM) | 15 requests |
| Requests Per Day (RPD) | 1,500 requests |

*Note: Quota limits can be verified or upgraded directly inside the [Google AI Studio Console](https://aistudio.google.com/).*
