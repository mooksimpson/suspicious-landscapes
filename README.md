# Field Guide to Suspicious Landscapes

A critical theory field guide app. Point your phone at a painting, landscape, or scene and get a structured investigation: historical context, awkward details, operating mythologies, cultural anxieties, and where the monsters should go.

Built for the *There Be Monsters* project by Mook Simpson.

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub

Create a new repo on github.com, then:

```bash
cd suspicious-landscapes
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/suspicious-landscapes.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `suspicious-landscapes` repo
4. Before clicking Deploy, go to **Environment Variables**
5. Add: `ANTHROPIC_API_KEY` = your Anthropic API key
6. Click **Deploy**

### 3. Share

Vercel gives you a URL like `suspicious-landscapes.vercel.app`. Works on any phone browser. Share it.

## Cost

Each investigation costs roughly 3-5 cents (Claude Sonnet vision request). Set a spending limit in your Anthropic console if you're sharing widely.

## Local development

```bash
cp .env.example .env.local
# Edit .env.local with your API key
npm install
npm run dev
```
