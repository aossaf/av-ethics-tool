# AV Ethics Tool — Deployment Guide

## What this is
An interactive tool exploring ethical dilemmas in autonomous vehicle decision-making, built with Next.js and ready to deploy on Vercel.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Upload to GitHub
1. Go to [github.com](https://github.com) and create a new repository (call it `av-ethics-tool`)
2. Upload all the files from this folder into that repository

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Select your `av-ethics-tool` repository
4. Click **"Deploy"** — Vercel will detect Next.js automatically

### Step 3 — Add your Anthropic API key
1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** to apply the variable

### Step 4 — Done!
Vercel gives you a live URL like `av-ethics-tool.vercel.app`. Share it with anyone.

---

## Project structure
```
av-ethics-tool/
├── pages/
│   ├── _app.js          # Next.js app wrapper
│   ├── index.js         # Main tool (all logic + UI)
│   └── api/
│       └── claude.js    # Secure API proxy (keeps your key hidden)
├── styles/
│   ├── globals.css      # Global reset
│   └── Home.module.css  # All component styles
└── package.json
```

## Running locally
```bash
npm install
# Create a .env.local file with: ANTHROPIC_API_KEY=your_key_here
npm run dev
# Visit http://localhost:3000
```

---

## Notes
- The API key is stored securely as an environment variable — it is never exposed to the browser
- The `/api/claude` route proxies all requests to Anthropic server-side
- The tool works without an API key (the "closing thought" feature simply won't appear)
