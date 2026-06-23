# Aegis Hunter

A static web dashboard for the autonomous cybersecurity threat hunter design.

## Files
- `index.html` — deployable dashboard page
- `vercel.json` — static deployment config for Vercel

## Run locally
Open `index.html` in a browser, or run a simple static server:

```bash
cd aegis-hunter
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub deployment
1. Initialize git:

```bash
git init
git branch -M main
git add .
git commit -m "Initial Aegis Hunter dashboard"
```

2. Create a GitHub repository with your account.
3. Add the remote and push:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Vercel deployment
### Option 1: Vercel dashboard
- Connect your GitHub repository to Vercel.
- Select the `aegis-hunter` project folder.
- Deploy.

### Option 2: Vercel CLI

```bash
cd aegis-hunter
vercel login
vercel --prod
```

The site is a static HTML dashboard that uses Tailwind CSS via CDN, so no additional build step is required.
