# Setup

## Prerequisites

- Node.js ≥ 18 (LTS recommended)
- npm or yarn

Recommended: use `nvm` to pin Node.js for reproducible builds:

```bash
nvm install --lts
nvm use --lts
```

## Gemini API Key

### 1. Get a key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API Key**
4. Copy the generated key

### 2. Configure

```bash
cp .env.example .env
```

Open `.env` and set:

```
VITE_GEMINI_API_KEY=your_key_here
```

### 3. Run

```bash
npm install
npm run dev
```

---

## Demo Mode

If no API key is set, the app runs in **demo mode** — all UI features work with simulated AI responses. Useful for development and UI testing without consuming API quota.

---

## Troubleshooting

**`API Key not configured`**
- Confirm `.env` exists at the project root
- Confirm the variable is named exactly `VITE_GEMINI_API_KEY`
- Restart the dev server after editing `.env`

**`Failed to fetch`**
- Check your internet connection
- Validate the key in [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check if you've exceeded the free tier quota

---

## Free Tier Limits

| Limit | Value |
|---|---|
| Requests per minute | 60 |
| Requests per day | 1,500 |

For production use, consider upgrading to a paid plan.

---

## Google Technologies Used

| Tool | Purpose |
|---|---|
| Gemini 1.5 Flash | Core AI model |
| NotebookLM | Prompt engineering and refinement |
| Gemini Gems | Personality and tone calibration |
| Google AI Studio | API key management |
