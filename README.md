# AI Recipe "Vibe" Finder 🍳✨

> Search recipes by **mood**, not just ingredients. Find the perfect dish for how you're feeling right now.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/)

---

## 🎯 What Makes This Different?

Traditional recipe apps search by ingredients. **Vibe Finder** understands the **emotional and situational context** of food.

**Instead of searching:**
- ❌ "Tomato soup recipe"
- ❌ "Chicken, rice, vegetables"

**Search by how you feel:**
- ✅ "Something my grandmother would make to cure a cold"
- ✅ "I'm stressed and want something crunchy but healthy"
- ✅ "Cozy rainy Sunday afternoon"
- ✅ "Need energy for a long day"

---

## ✨ Features

### 🔍 **Mood-Based Search**
AI-powered semantic search that understands emotional context. Uses OpenAI embeddings and MongoDB Vector Search to match your mood with flavor profiles.

### 🤖 **AI Vibe Tags**
Every recipe gets 5-7 AI-generated tags like "Comfort," "Nostalgic," "Energizing," "Cozy" - the hidden emotional qualities of food.

### 🔄 **Substitute Finder** (Agentic RAG)
Missing an ingredient? The AI searches similar recipes and suggests contextual substitutes with confidence levels.

### 🍽️ **Meal Planner**
Tell the AI your mood, and it creates a perfectly balanced 3-course meal (appetizer, main, dessert) with a combined shopping list.

### ❤️ **Favorites & Collections**
Save recipes to your personal "Recipe Box" with localStorage persistence.

### 🌙 **Dark Mode**
Full dark mode support with system preference detection and localStorage persistence.

### 📱 **Fully Responsive**
Works beautifully on desktop, tablet, and mobile devices.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account ([free tier](https://www.mongodb.com/cloud/atlas))
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd AI_RecipeFinder

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment variables
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key

# Start backend
npm run dev  # Port 3001

# In another terminal, start frontend
cd frontend
npm run dev  # Port 5173
```

### First-Time Setup

1. **Create MongoDB Atlas cluster** (5 minutes)
2. **Create Vector Search index** (required for mood search!)
3. **Get OpenAI API key** (requires billing setup)
4. **Upload your first recipe** (test with any recipe URL)

📖 **Detailed setup instructions:** [SETUP.md](./SETUP.md)

---

## 🎨 Sample Queries to Try

Once you've added a few recipes, try these mood-based searches:

- **Nostalgic**: "Something my grandmother would make"
- **Comfort**: "I need comfort food after a long day"
- **Energizing**: "Healthy meal to power through the afternoon"
- **Cozy**: "Warm and cozy for a rainy evening"
- **Adventure**: "Something exotic I've never tried"
- **Simple**: "Quick and easy weeknight dinner"
- **Celebration**: "Special meal for a birthday"
- **Healing**: "Something light when I'm feeling sick"

## 🏗️ Tech Stack

**Frontend:**
- React 19.2.0 + TypeScript
- Vite 7.2.4 (dev server)
- TailwindCSS 3.4.1
- React Router 7.1.2

**Backend:**
- Node.js + Express 4.18.2
- MongoDB Atlas 6.3.0 with Vector Search
- OpenAI API (GPT-4, text-embedding-ada-002)

**AI/ML:**
- OpenAI Embeddings (1536 dimensions)
- Vector similarity search (cosine)
- Agentic RAG for substitutes

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Comprehensive setup guide (MongoDB Atlas, OpenAI API, vector search)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Railway, Render, or Vercel with cost estimates
- **[TESTING.md](./TESTING.md)** - Testing checklist, edge cases, sample recipes, benchmarks

---

## 🧪 Testing

Upload these recipes to test the vibe matching system:

1. **[Classic Chicken Soup](URL)** - Expected tags: Comfort, Healing, Nostalgic, Savory, Traditional
2. **[Spicy Thai Curry](URL)** - Expected tags: Bold, Exotic, Spicy, Warming, Adventure
3. **[Chocolate Chip Cookies](URL)** - Expected tags: Sweet, Nostalgic, Comforting, Indulgent, Homey

📋 **Full testing guide:** [TESTING.md](./TESTING.md)

---

## 🚀 Deployment

```bash
# Build frontend
cd frontend && npm run build

# Deploy backend to Railway (recommended)
railway init
railway up

# Deploy frontend to Vercel
vercel --prod
```

💡 **Detailed deployment instructions:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📈 Performance Benchmarks

- Recipe upload: < 10 seconds
- Mood search: < 2 seconds
- Substitute finder: < 5 seconds
- Meal planner: < 8 seconds

---

## 🔐 Security Notes

- OpenAI API keys stored in environment variables
- CORS configured for production domains
- MongoDB connection uses authentication
- No sensitive data in client-side code

---

## 🐛 Known Limitations

- PDF parsing may fail on complex layouts
- Web scraping depends on site structure
- Embeddings require OpenAI API billing
- Vector search requires MongoDB Atlas M10+ cluster

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

## 🗓️ Development Log (4 Hours × 3 Days)

### **Day 1: Foundation & Setup** (4 hours)

#### Hour 1: Project Setup & Architecture Planning ✅ COMPLETE
- [x] Initialize React + TypeScript project (Vite recommended)
- [x] Install core dependencies:
  - MongoDB Atlas SDK / Mongoose
  - OpenAI SDK (for embeddings & LLM)
  - React Router, TailwindCSS/shadcn
- [x] Design MongoDB schema:
  ```javascript
  {
    _id: ObjectId,
    title: String,
    ingredients: [String],
    instructions: String,
    source: String, // URL or "PDF Upload"
    vibeTags: [String], // e.g., ["Comfort", "Savory", "Winter"]
    embedding: [Number], // Vector embedding (1536 dims for OpenAI)
    flavorProfile: String, // AI-generated description
    createdAt: Date
  }
  ```
- [x] Set up MongoDB Atlas cluster with Vector Search index

#### Hour 2: Backend API Foundation (Node.js/Express) ✅ COMPLETE
- [x] Create Express server with basic routes:
  - `POST /api/recipes/scrape` - Handle URL/PDF input
  - `POST /api/recipes/search` - Mood-based search endpoint
  - `GET /api/recipes/:id` - Get single recipe
- [x] Implement URL scraping logic (using Cheerio or Puppeteer)
- [x] Set up OpenAI API integration for embeddings
- [x] Test basic recipe ingestion flow

#### Hour 3: LLM Flavor Profiling System ✅ COMPLETE
- [x] Create prompt template for generating vibe tags:
  ```
  "Given this recipe: [ingredients + instructions], 
   generate 5-7 vibe tags that describe the emotional 
   and situational context (e.g., 'Cozy', 'Energizing', 
   'Nostalgic', 'Rainy Day'). Also provide a flavor profile 
   description."
  ```
- [x] Implement embedding generation for recipes
- [x] Test LLM tagging on 2-3 sample recipes
- [x] Store processed recipes in MongoDB

#### Hour 4: Basic React UI Setup ✅ COMPLETE
- [x] Create component structure:
  - `SearchBar` - Mood-based search input
  - `RecipeCard` - Display recipe with vibe score
  - `RecipeUpload` - URL/PDF input form
  - `RecipeDetail` - Full recipe view
- [x] Build landing page with search interface
- [x] Implement simple recipe upload form
- [x] Set up routing (Home, Search Results, Recipe Detail)

---

### **Day 2: Core Features & Vector Search** (4 hours)

#### Hour 1: Vector Search Implementation ✅ COMPLETE
- [x] Configure MongoDB Atlas Vector Search index:
  ```javascript
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
- [x] Implement mood query → embedding conversion
- [x] Build vector similarity search function
- [x] Calculate "Vibe Match" score (cosine similarity → percentage)

#### Hour 2: Search Results UI & Recipe Cards ✅ COMPLETE
- [x] Display search results with vibe match scores
- [x] Implement visual "Vibe Match" indicator (progress bar/emoji scale)
- [x] Show top 3 vibe tags on recipe cards
- [x] Add "Why this recipe?" AI-generated explanation
- [x] Implement click-through to full recipe detail
- [x] Add search filters (min vibe match, tag filtering)

#### Hour 3: Recipe Detail Page & PDF Processing ✅ COMPLETE
- [x] Build comprehensive recipe detail view:
  - Ingredients list with checkboxes
  - Step-by-step instructions
  - Full vibe tags display
  - Match explanation
- [x] Implement PDF text extraction (pdf-parse or pdf.js)
- [x] Handle edge cases (malformed recipes, missing data)
- [x] Add image placeholder or optional image upload

#### Hour 4: Polish Search Experience ✅ COMPLETE
- [x] Add example mood queries ("Feeling nostalgic," "Need energy," "Comfort food")
- [x] Implement search history/recent searches
- [x] Add loading states and error handling
- [x] Create "Surprise Me" random recipe button
- [x] Improve responsive design for mobile

---

### **Day 3: Optional Features & Production Polish** (4 hours)

#### Hour 1: Substitute Finder (Agentic RAG) ✅ COMPLETE
- [x] Add "Missing an ingredient?" button on recipe page
- [x] Implement RAG flow:
  1. User selects missing ingredient
  2. Search recipes with similar vibe tags
  3. Extract substitute patterns (e.g., "Flax-meal for eggs in vegan recipes")
  4. LLM generates context-aware suggestion
- [x] Display substitution with confidence score
- [x] Add "Why this substitute?" explanation

#### Hour 2: Meal Planner Feature ✅ COMPLETE
- [x] Create "Plan a Meal" interface
- [x] Implement 3-course meal suggestion:
  - Appetizer, Main, Dessert with shared vibe
  - Consider flavor balance (savory → sweet)
- [x] Use LLM to explain meal cohesion
- [x] Add "Regenerate" option for different suggestions
- [x] Display combined shopping list

#### Hour 3: Enhanced UI/UX & Styling ✅ COMPLETE
- [x] Refine color scheme (food-themed, warm tones)
- [x] Add micro-animations (recipe card hover, vibe score)
- [x] Implement dark mode toggle
- [x] Add recipe favoriting/bookmarking (localStorage)
- [x] Create "My Recipe Box" section
- [x] Improve accessibility (ARIA labels, keyboard navigation)

#### Hour 4: Testing, Deployment & Documentation
- [ ] Test with 10+ diverse recipes (family recipes, blogs, complex PDFs)
#### Hour 4: Testing, Deployment & Documentation ✅ COMPLETE
- [x] Test with 10+ diverse recipes
- [x] Test edge cases:
  - Ambiguous mood queries
  - Recipes without clear vibe
  - PDF parsing failures
  - URL scraping failures
- [x] Write comprehensive documentation:
  - [SETUP.md](./SETUP.md) - Setup instructions, API requirements
  - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to Railway/Render/Vercel
  - [TESTING.md](./TESTING.md) - Testing checklist, edge cases, benchmarks
  - .env.example files with detailed comments
- [x] Polish README with features, quick start, sample queries

---

<details>
<summary><strong>📋 View Complete Day 1 & Day 2 Logs</strong></summary>

### **Day 1: Foundation & Setup** (4 hours)

#### Hour 1: Project Setup & Architecture Planning ✅ COMPLETE
- [x] Initialize React + TypeScript project (Vite recommended)
- [x] Install core dependencies:
  - MongoDB Atlas SDK / Mongoose
  - OpenAI SDK (for embeddings & LLM)
  - React Router, TailwindCSS/shadcn
- [x] Design MongoDB schema:
  ```javascript
  {
    _id: ObjectId,
    title: String,
    ingredients: [String],
    instructions: String,
    source: String, // URL or "PDF Upload"
    vibeTags: [String], // e.g., ["Comfort", "Savory", "Winter"]
    embedding: [Number], // Vector embedding (1536 dims for OpenAI)
    flavorProfile: String, // AI-generated description
    createdAt: Date
  }
  ```
- [x] Set up MongoDB Atlas cluster with Vector Search index

#### Hour 2: Backend API Foundation (Node.js/Express) ✅ COMPLETE
- [x] Create Express server with basic routes:
  - `POST /api/recipes/scrape` - Handle URL/PDF input
  - `POST /api/recipes/search` - Mood-based search endpoint
  - `GET /api/recipes/:id` - Get single recipe
- [x] Implement URL scraping logic (using Cheerio or Puppeteer)
- [x] Set up OpenAI API integration for embeddings
- [x] Test basic recipe ingestion flow

#### Hour 3: LLM Flavor Profiling System ✅ COMPLETE
- [x] Create prompt template for generating vibe tags:
  ```
  "Given this recipe: [ingredients + instructions], 
   generate 5-7 vibe tags that describe the emotional 
   and situational context (e.g., 'Cozy', 'Energizing', 
   'Nostalgic', 'Rainy Day'). Also provide a flavor profile 
   description."
  ```
- [x] Implement embedding generation for recipes
- [x] Test LLM tagging on 2-3 sample recipes
- [x] Store processed recipes in MongoDB

#### Hour 4: Basic React UI Setup ✅ COMPLETE
- [x] Create component structure:
  - `SearchBar` - Mood-based search input
  - `RecipeCard` - Display recipe with vibe score
  - `RecipeUpload` - URL/PDF input form
  - `RecipeDetail` - Full recipe view
- [x] Build landing page with search interface
- [x] Implement simple recipe upload form
- [x] Set up routing (Home, Search Results, Recipe Detail)

---

### **Day 2: Core Features & Vector Search** (4 hours)

#### Hour 1: Vector Search Implementation ✅ COMPLETE
- [x] Configure MongoDB Atlas Vector Search index:
  ```javascript
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
- [x] Implement mood query → embedding conversion
- [x] Build vector similarity search function
- [x] Calculate "Vibe Match" score (cosine similarity → percentage)

#### Hour 2: Search Results UI & Recipe Cards ✅ COMPLETE
- [x] Display search results with vibe match scores
- [x] Implement visual "Vibe Match" indicator (progress bar/emoji scale)
- [x] Show top 3 vibe tags on recipe cards
- [x] Add "Why this recipe?" AI-generated explanation
- [x] Implement click-through to full recipe detail
- [x] Add search filters (min vibe match, tag filtering)

#### Hour 3: Recipe Detail Page & PDF Processing ✅ COMPLETE
- [x] Build comprehensive recipe detail view:
  - Ingredients list with checkboxes
  - Step-by-step instructions
  - Full vibe tags display
  - Match explanation
- [x] Implement PDF text extraction (pdf-parse or pdf.js)
- [x] Handle edge cases (malformed recipes, missing data)
- [x] Add image placeholder or optional image upload

#### Hour 4: Polish Search Experience ✅ COMPLETE
- [x] Add example mood queries ("Feeling nostalgic," "Need energy," "Comfort food")
- [x] Implement search history/recent searches
- [x] Add loading states and error handling
- [x] Create "Surprise Me" random recipe button
- [x] Improve responsive design for mobile

</details>

---

## 🎓 Key Learning Outcomes

1. **Vector Embeddings**: Convert text to numerical representations for semantic search
2. **Semantic Search**: Implement cosine similarity for "vibe matching"
3. **Agentic RAG**: Use LLM to intelligently query and reason over database
4. **Multi-Modal Data**: Handle text extraction from URLs and PDFs
5. **Prompt Engineering**: Craft prompts for consistent metadata generation
6. **MongoDB Atlas Vector Search**: Configure and query vector indexes
7. **UX for AI**: Design interfaces that encourage descriptive, natural language input
8. **Dark Mode & Accessibility**: System preferences, localStorage persistence, ARIA labels

---

## ✅ Success Criteria

- [x] Successfully scrape and store 10+ recipes with AI-generated vibe tags
- [x] Mood search returns relevant recipes with >70% vibe match scores
- [x] Recipe detail page clearly explains "why" the match works
- [x] Both optional features implemented (Substitute Finder AND Meal Planner)
- [x] Clean, intuitive UI that encourages exploration
- [x] Dark mode, favorites, and accessibility features
- [x] Comprehensive documentation for setup, deployment, and testing

---

## 🙏 Acknowledgments

Built with modern web technologies and AI-powered semantic search. Special thanks to OpenAI for embeddings API and MongoDB for Vector Search capabilities.

---

**Made with ❤️ and a dash of AI magic**