# Deployment Guide - AI Recipe Vibe Finder

This guide covers deploying the Recipe Vibe Finder to production environments.

## Overview

- **Backend**: Railway, Render, or Vercel Functions
- **Frontend**: Vercel or Netlify
- **Database**: MongoDB Atlas (already cloud-hosted)

## Option 1: Deploy Backend to Railway (Recommended)

Railway is the easiest option with excellent MongoDB Atlas integration.

### Prerequisites

- Railway account (free tier: 500 hours/month, $5 credit)
- GitHub repository with your code

### Steps

1. **Go to [Railway](https://railway.app/)**
   - Sign up with GitHub

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository

3. **Configure Environment Variables**
   - In your project, click **"Variables"**
   - Add:
     ```
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/recipevibe?retryWrites=true
     OPENAI_API_KEY=sk-proj-xxxxx
     PORT=3001
     NODE_ENV=production
     ```

4. **Configure Build Settings**
   - Railway auto-detects Node.js
   - Root directory: `/backend`
   - Build command: `npm install`
   - Start command: `npm start`

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build
   - Get your deployment URL (e.g., `https://your-app.up.railway.app`)

6. **Enable CORS for Frontend**
   - Your backend will need to allow your frontend domain
   - Update `backend/src/server.js` CORS settings:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend.vercel.app', 'http://localhost:5173']
   }));
   ```

## Option 2: Deploy Backend to Render

### Steps

1. **Go to [Render](https://render.com/)**
   - Sign up with GitHub

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repo
   - Name: `recipe-vibe-api`

3. **Configure Service**
   - Environment: `Node`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - In the service settings, add:
     ```
     MONGODB_URI=mongodb+srv://...
     OPENAI_API_KEY=sk-proj-...
     PORT=3001
     NODE_ENV=production
     ```

5. **Deploy**
   - Click **"Create Web Service"**
   - First deploy takes 5-10 minutes
   - Get your URL (e.g., `https://recipe-vibe-api.onrender.com`)

**Note:** Free tier on Render spins down after 15 minutes of inactivity (cold starts).

## Option 3: Deploy Backend to Vercel Functions

Vercel Functions are serverless - good for low traffic.

### Convert to Serverless

1. **Create `backend/api/` folder structure**

2. **Create `backend/api/recipes/index.js`:**
   ```javascript
   import express from 'express';
   import { connectDB } from '../../src/config/db.js';
   import recipeRoutes from '../../src/routes/recipeRoutes.js';

   const app = express();
   app.use(express.json());
   app.use('/api/recipes', recipeRoutes);

   export default async (req, res) => {
     await connectDB(process.env.MONGODB_URI);
     return app(req, res);
   };
   ```

3. **Create `vercel.json` in backend:**
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "api/**/*.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "/api/$1" }
     ],
     "env": {
       "MONGODB_URI": "@mongodb-uri",
       "OPENAI_API_KEY": "@openai-api-key"
     }
   }
   ```

4. **Deploy:**
   ```bash
   cd backend
   vercel
   ```

## Deploy Frontend to Vercel

### Steps

1. **Go to [Vercel](https://vercel.com/)**
   - Sign up with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app/api
     ```

5. **Deploy**
   - Click **"Deploy"**
   - First build takes 1-2 minutes
   - Get your URL (e.g., `https://recipe-vibe.vercel.app`)

6. **Update CORS in Backend**
   - Add your Vercel URL to backend CORS whitelist
   - Redeploy backend

## Deploy Frontend to Netlify

### Steps

1. **Go to [Netlify](https://www.netlify.com/)**
   - Sign up with GitHub

2. **Add New Site**
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect to GitHub
   - Select repository

3. **Configure Build**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Add Environment Variables**
   - Go to **"Site settings"** → **"Environment variables"**
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app/api
     ```

5. **Deploy**
   - Click **"Deploy site"**
   - Get your URL (e.g., `https://recipe-vibe.netlify.app`)

## Post-Deployment Checklist

- [ ] Backend is accessible (test `/api/recipes` endpoint)
- [ ] Frontend loads without errors
- [ ] MongoDB Atlas connection works
- [ ] OpenAI API calls succeed
- [ ] CORS allows frontend domain
- [ ] Environment variables are set correctly
- [ ] Recipe upload works (test with URL)
- [ ] Mood search returns results
- [ ] Substitute Finder works
- [ ] Meal Planner generates meals
- [ ] Dark mode persists correctly
- [ ] Favorites save to localStorage

## Testing Production Deployment

### Test Backend API

```bash
# Replace with your backend URL
curl https://your-backend.railway.app/api/recipes
```

Should return JSON array of recipes (empty if none added yet).

### Test Recipe Upload

```bash
curl -X POST https://your-backend.railway.app/api/recipes/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.allrecipes.com/recipe/12345/test-recipe"}'
```

### Test Vector Search

```bash
curl -X POST https://your-backend.railway.app/api/recipes/search \
  -H "Content-Type: application/json" \
  -d '{"query": "comfort food"}'
```

## Monitoring & Maintenance

### Railway

- View logs in Railway dashboard
- Monitor memory/CPU usage
- Set up usage alerts
- Free tier: 500 hours/month, $5 credit

### Render

- Check service logs
- Monitor request metrics
- Free tier spins down after 15 min inactivity
- Upgrade to prevent cold starts

### Vercel

- View deployment logs
- Check Serverless Function execution time
- Free tier: 100GB bandwidth, 100 hours compute
- Analytics available on Pro plan

### MongoDB Atlas

- Monitor cluster metrics
- Set up alerts for storage/connections
- Free tier: 512MB storage, 100 connections
- Upgrade when you hit limits

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files
- ✅ Use platform secret managers
- ✅ Rotate API keys periodically
- ✅ Restrict MongoDB network access

### CORS Configuration

```javascript
// backend/src/server.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://recipe-vibe.vercel.app']
    : ['http://localhost:5173'],
  credentials: true
}));
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Scaling Considerations

### When to Upgrade

- **MongoDB**: When you exceed 512MB storage or need more connections
- **Backend**: When response times > 1s or frequent 429 errors
- **Frontend**: When bandwidth exceeds free tier

### Optimization Tips

1. **Enable caching**
   - Cache recipe embeddings
   - Use CDN for frontend assets

2. **Optimize vector search**
   - Index frequently used fields
   - Limit search results (top 20)

3. **Reduce OpenAI calls**
   - Cache vibe tags
   - Batch embedding generation

4. **Database optimization**
   - Create indexes on `vibeTags`, `title`
   - Archive old recipes

## Troubleshooting Production Issues

### Frontend can't reach backend

- ✅ Check VITE_API_URL is correct
- ✅ Verify backend is running
- ✅ Check CORS configuration
- ✅ Inspect browser network tab

### MongoDB connection fails

- ✅ Verify MONGODB_URI format
- ✅ Check Atlas network whitelist (allow 0.0.0.0/0 or add hosting IPs)
- ✅ Ensure database user exists

### OpenAI rate limit errors

- ✅ Add payment method
- ✅ Implement request queuing
- ✅ Add exponential backoff

### Cold start delays (Render/Vercel)

- ✅ Upgrade to paid tier
- ✅ Implement health check pings
- ✅ Show loading state in UI

## Cost Estimates

### Free Tier (Good for MVP)

- Railway: $5 credit + 500 hours/month
- Vercel: Unlimited deployments, 100GB bandwidth
- MongoDB Atlas: 512MB storage
- OpenAI: Pay-as-you-go (~$2-5 for 100 recipes)
- **Total**: ~$5-10/month

### Production Scale (1000 users/month)

- Railway Pro: $20/month
- Vercel Pro: $20/month  
- MongoDB M10: $0.08/hour (~$57/month)
- OpenAI: ~$50/month
- **Total**: ~$147/month

## Need Help?

- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
