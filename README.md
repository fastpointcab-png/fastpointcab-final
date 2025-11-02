# FastPoint Cab - Fixed (ready for local test & Vercel)

## Local setup

1. Install dependencies:
```bash
npm install
```

2. Add your Brevo API key to `.env`:
```
BREVO_API_KEY=your_real_brevo_api_key_here
```

3. Run in development (auto-restart):
```bash
npm run dev
```

The server will run at `http://localhost:3000` and the booking endpoint is:
```
POST http://localhost:3000/api/book
```

## Git & GitHub

Initialize git (if not already) and push:

```bash
git init
git add .
git commit -m "Initial working version"
git branch -M main
git remote add origin https://github.com/fastpointcab-png/fastpoint-cab.git
git push -u origin main
```

## Vercel Deployment

- Push to GitHub and import the repo in Vercel.
- Vercel will detect `api/server.js` as your serverless entry (or use adapters). No extra config needed for basic setups.

