# Orbit OS — Railway Deployment Guide

> Deploy Orbit OS to Railway from the GitHub repository in minutes.

---

## Prerequisites

- GitHub repository: `https://github.com/ozanggnr/orbit-os`
- Railway account: [railway.app](https://railway.app) (free tier available)
- Node.js 20.x (Railway auto-detects this)

---

## Build & Start Commands

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Start Command** | `npm run start` |
| **Node.js Version** | `20.x` (auto-detected via `package.json engines`) |
| **Install Command** | `npm install` (auto-detected) |

These are already configured correctly for Next.js. Railway will pick them up automatically.

---

## Step-by-Step Deployment

### 1. Connect GitHub Repository to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project**
3. Choose **Deploy from GitHub repo**
4. Authorize Railway to access your GitHub account
5. Select `ozanggnr/orbit-os`
6. Railway will detect it as a Next.js project automatically
7. Click **Deploy Now**

> Railway will run `npm install && npm run build && npm run start` automatically.

---

### 2. Add Environment Variables in Railway

1. In your Railway project, click the **service** (orbit-os)
2. Go to **Variables** tab
3. Add the following variables one by one:

#### Required (for live app)
```
NEXT_PUBLIC_APP_NAME=Orbit OS
NEXT_PUBLIC_APP_URL=https://YOUR-RAILWAY-DOMAIN.railway.app
```

#### Gemini AI (enables real AI insights)
```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

#### OpenWeather (enables live weather)
```
OPENWEATHER_API_KEY=your_openweather_key_here
OPENWEATHER_DEFAULT_CITY=Ankara
OPENWEATHER_DEFAULT_COUNTRY=TR
```

#### Google Calendar OAuth (enables real calendar events)
```
GOOGLE_CALENDAR_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
GOOGLE_CALENDAR_REDIRECT_URI=https://YOUR-RAILWAY-DOMAIN.railway.app/api/auth/google/callback
```

#### Spotify OAuth (enables real music data)
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://YOUR-RAILWAY-DOMAIN.railway.app/api/auth/spotify/callback
```

> **Tip:** Use Railway's **bulk edit** mode to paste multiple variables at once (one per line in `KEY=VALUE` format).

> **Note:** The app works without ANY of these keys — all features fall back to rich mock data. Only add keys for features you want to go live.

---

### 3. Get Your Railway Production Domain

After the first deployment:

1. Go to your Railway service → **Settings** → **Networking**
2. Click **Generate Domain** (or use a custom domain)
3. You'll get a URL like: `orbit-os-production.up.railway.app`
4. Update `NEXT_PUBLIC_APP_URL` to `https://orbit-os-production.up.railway.app`

---

### 4. Update OAuth Redirect URIs

After getting your Railway domain, update these in **both** Railway variables **and** the respective provider dashboards:

#### Google Calendar
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Click your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR-RAILWAY-DOMAIN.railway.app/api/auth/google/callback
   ```
5. Save and update `GOOGLE_CALENDAR_REDIRECT_URI` in Railway

#### Spotify
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click your app → **Edit Settings**
3. Under **Redirect URIs**, add:
   ```
   https://YOUR-RAILWAY-DOMAIN.railway.app/api/auth/spotify/callback
   ```
4. Save and update `SPOTIFY_REDIRECT_URI` in Railway

---

### 5. Trigger a Redeploy

After adding/updating environment variables:

1. Go to your Railway service
2. Click **Deployments** tab
3. Click **Redeploy** on the latest deployment
   — or — push a new commit to `main` (Railway auto-deploys on push)

> **Important:** Railway only picks up new env vars on the next deployment. Always redeploy after adding variables.

---

## Automatic Deployments

Railway automatically redeploys when you push to the `main` branch:

```bash
# Make changes locally
git add .
git commit -m "feat: your feature"
git push origin main
# → Railway detects the push and starts a new deployment automatically
```

---

## Health Check

After deployment, verify everything is working:

```bash
# Check which API services are configured
curl https://YOUR-RAILWAY-DOMAIN.railway.app/api/health

# Expected response (no keys configured):
# { "status": "ok", "services": { "gemini": "not_configured", ... } }

# Expected response (with keys):
# { "status": "ok", "services": { "gemini": "configured", ... } }
```

---

## Production Environment Variable Checklist

After Railway generates your domain, update these values:

| Variable | Local Value | Production Value |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-domain.railway.app` |
| `GOOGLE_CALENDAR_REDIRECT_URI` | `http://localhost:3000/api/auth/google/callback` | `https://your-domain.railway.app/api/auth/google/callback` |
| `SPOTIFY_REDIRECT_URI` | `http://localhost:3000/api/auth/spotify/callback` | `https://your-domain.railway.app/api/auth/spotify/callback` |

---

## Troubleshooting

### Build fails with "Module not found"
```bash
# Ensure local build passes first
npm run build

# Check Node.js version matches
node -v  # Should be 20.x
```

### Environment variables not loading
- Ensure there are no spaces around `=` in Railway variables
- Redeploy after adding new variables (they don't hot-reload)
- Variables starting with `NEXT_PUBLIC_` are baked into the client bundle at build time — changing them requires a full rebuild

### OAuth redirect mismatch error
- Ensure the `REDIRECT_URI` in Railway **exactly matches** what's registered in Google/Spotify dashboards
- Must include `https://`, not `http://`
- No trailing slash

### App shows mock data only (no live API data)
- Check `/api/health` to see which services are configured
- Verify API keys are correct (no extra spaces)
- Ensure you redeployed after adding keys

### 504 Gateway Timeout on AI insights
- Gemini API can take 3–8 seconds on first call
- Railway free tier has no timeout limits
- The app automatically falls back to mock data on timeout

### "Invalid redirect URI" from Spotify
- Spotify requires exact URI match — no trailing slash
- HTTP is only allowed for `localhost` — production must use HTTPS
- Wait 5 minutes after saving Spotify settings (CDN propagation delay)

---

## Resource Usage (Railway Free Tier)

| Resource | Usage | Free Tier Limit |
|----------|-------|----------------|
| Memory | ~180MB idle | 512MB |
| CPU | ~0.1 vCPU | 1 vCPU |
| Bandwidth | Minimal | 100GB/month |
| Build time | ~60–90 seconds | Unlimited |

Orbit OS runs comfortably on Railway's free tier.

---

## Custom Domain (Optional)

1. Railway → Service → Settings → Networking → **Custom Domain**
2. Add your domain (e.g., `orbitos.yourdomain.com`)
3. Add the CNAME record Railway provides to your DNS provider
4. Update all three production URLs to use your custom domain

---

## Next Steps After Deployment (Phase 5)

- [ ] Add **Supabase** for persistent user data storage
- [ ] Add **Firebase Auth** or **NextAuth.js** for user authentication
- [ ] Implement **OAuth token refresh** so Google/Spotify sessions don't expire
- [ ] Set up **Uptime monitoring** (UptimeRobot free tier)
- [ ] Configure **Sentry** for error tracking in production

---

*Orbit OS · Railway Deployment Guide · May 2026*
