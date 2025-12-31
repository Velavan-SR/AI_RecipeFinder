# Setup Guide - AI Recipe Vibe Finder

This guide will walk you through setting up the Recipe Vibe Finder application from scratch.

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- OpenAI API account

## Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd AI_RecipeFinder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: MongoDB Atlas Setup

### Create a Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **FREE** tier (M0 Sandbox)
5. Select a cloud provider and region (choose one closest to you)
6. Name your cluster (e.g., `RecipeVibeCluster`)
7. Click **"Create Cluster"** (takes 3-5 minutes)

### Configure Network Access

1. In Atlas dashboard, go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production, restrict to your server's IP
4. Click **"Confirm"**

### Create Database User

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username (e.g., `recipeAdmin`) and password (save this!)
5. Set role to **"Read and write to any database"**
6. Click **"Add User"**

### Get Connection String

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** driver, version **6.9 or later**
5. Copy the connection string (looks like: `mongodb+srv://recipeAdmin:<password>@cluster0.xxxxx.mongodb.net/`)
6. Replace `<password>` with your actual password
7. Add database name before the `?`: `mongodb+srv://recipeAdmin:yourpassword@cluster0.xxxxx.mongodb.net/recipevibe?retryWrites=true&w=majority`

## Step 3: Create Vector Search Index

**CRITICAL:** This step is required for mood-based search to work!

1. In MongoDB Atlas, go to your cluster
2. Click **"Search"** tab
3. Click **"Create Search Index"**
4. Choose **"JSON Editor"**
5. Select your database: `recipevibe`
6. Select collection: `recipes`
7. Name the index: `vector_index`
8. Paste this configuration:

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "type": "knnVector",
        "dimensions": 1536,
        "similarity": "cosine"
      }
    }
  }
}
```

9. Click **"Create Search Index"**
10. Wait for status to change from "Building" to "Active" (1-2 minutes)

## Step 4: OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to **"API Keys"** section
4. Click **"Create new secret key"**
5. Name it (e.g., `recipe-vibe-finder`)
6. Copy the key immediately (you won't see it again!)
7. Save it securely

**Cost Note:** 
- Embeddings: ~$0.0001 per recipe
- GPT-4 API calls: ~$0.03 per 1K tokens
- Expect ~$1-5 for testing with 50-100 recipes

## Step 5: Configure Environment Variables

### Backend Configuration

Create `backend/.env`:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://recipeAdmin:yourpassword@cluster0.xxxxx.mongodb.net/recipevibe?retryWrites=true&w=majority

# OpenAI API Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Server Port
PORT=3001

# Optional: Node Environment
NODE_ENV=development
```

### Frontend Configuration (Optional)

The frontend uses Vite's proxy configuration by default. If deploying separately:

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## Step 6: Verify Setup

### Test Backend Connection

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 3001
✅ MongoDB connected successfully
```

### Test Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

## Step 7: Add Your First Recipe

1. Open http://localhost:5173 in your browser
2. Click **"Add Your Own Recipe"**
3. Paste a recipe URL (e.g., from AllRecipes, Food Network)
4. Click **"Upload Recipe"**
5. Wait 5-10 seconds for:
   - Web scraping
   - AI vibe tag generation
   - Embedding creation
   - MongoDB storage

## Step 8: Test Mood Search

Try these sample queries:

- "Something my grandmother would make"
- "I need comfort food after a long day"
- "Healthy but filling meal"
- "Rainy Sunday afternoon"
- "Quick weeknight dinner"

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: Authentication failed`
- ✅ Check username and password in connection string
- ✅ Ensure password is URL-encoded (replace special characters)
- ✅ Verify database user has "Read and write" permissions

**Error:** `ECONNREFUSED` or timeout
- ✅ Check Network Access whitelist includes your IP
- ✅ Verify connection string format
- ✅ Test connection from MongoDB Compass

### Vector Search Not Working

**Error:** `No search results` or `index not found`
- ✅ Verify vector index is "Active" in Atlas
- ✅ Index name must be exactly `vector_index`
- ✅ Dimensions must be `1536` (OpenAI embedding size)
- ✅ Wait 1-2 minutes after creation for index to activate

### OpenAI API Errors

**Error:** `Invalid API Key`
- ✅ Check .env file has correct key
- ✅ Key should start with `sk-proj-` or `sk-`
- ✅ No extra spaces or quotes in .env

**Error:** `Rate limit exceeded`
- ✅ You've hit OpenAI's free tier limit
- ✅ Add payment method or wait for reset
- ✅ Reduce number of concurrent requests

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
- ✅ Backend is not running (start with `npm run dev`)
- ✅ Check Vite proxy in `frontend/vite.config.ts`
- ✅ Verify backend port is 3001

### Recipe Scraping Fails

**Error:** `Failed to scrape recipe from URL`
- ✅ Some websites block scrapers
- ✅ Try different recipe websites (AllRecipes works well)
- ✅ Check recipe URL is direct (not search results)
- ✅ Website might require JavaScript rendering (Cheerio limitation)

## Advanced Configuration

### Custom Vector Index Settings

For better performance with large datasets (1000+ recipes):

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "type": "knnVector",
        "dimensions": 1536,
        "similarity": "cosine"
      },
      "vibeTags": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "title": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}
```

### Database Indexes for Performance

Run in MongoDB Shell:

```javascript
use recipevibe;
db.recipes.createIndex({ "vibeTags": 1 });
db.recipes.createIndex({ "title": "text", "ingredients": "text" });
db.recipes.createIndex({ "createdAt": -1 });
```

## Next Steps

- ✅ Test with 10+ diverse recipes
- ✅ Try different mood queries
- ✅ Explore Substitute Finder feature
- ✅ Create a 3-course meal with Meal Planner
- ✅ Favorite recipes and build your collection
- ✅ Toggle dark mode for better UI experience

For deployment to production, see [DEPLOYMENT.md](./DEPLOYMENT.md).

For testing guidelines, see [TESTING.md](./TESTING.md).
