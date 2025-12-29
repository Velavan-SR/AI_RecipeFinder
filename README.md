# AI Recipe "Vibe" Finder

## Project Overview

Traditional recipe apps are limited to ingredients. **Vibe Finder** uses "Conceptual Search" to understand the emotional and situational context of food. Instead of searching for "Tomato Soup," users can search for "Something my grandmother would make to cure a cold," and the AI connects the vibe of the query to flavor profiles in the database.

### Core Concept
- **Recipe Scraping**: Upload PDF of family recipes or paste URLs from food blogs
- **Flavor Profiling**: LLM generates "Hidden Tags" (e.g., "Savory," "Umami," "Comfort Food," "Rainy Day")
- **Mood-Based Search**: Type queries like "I'm stressed and want something crunchy but healthy"
- **Vector Match**: System calculates distance between mood and flavor profiles in MongoDB Atlas
- **Interactive Recipe Card**: Display recipe with "Vibe Match" score and AI-generated summary

### Optional Features
- **Substitute Finder** (Agentic RAG): AI searches database for ingredient substitutions
- **Meal Planner**: AI suggests 3 recipes that share a vibe for a 3-course dinner

---

## 🗓️ Development Schedule (4 Hours × 3 Days)

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

#### Hour 3: Recipe Detail Page & PDF Processing
- [ ] Build comprehensive recipe detail view:
  - Ingredients list with checkboxes
  - Step-by-step instructions
  - Full vibe tags display
  - Match explanation
- [ ] Implement PDF text extraction (pdf-parse or pdf.js)
- [ ] Handle edge cases (malformed recipes, missing data)
- [ ] Add image placeholder or optional image upload

#### Hour 4: Polish Search Experience
- [ ] Add example mood queries ("Feeling nostalgic," "Need energy," "Comfort food")
- [ ] Implement search history/recent searches
- [ ] Add loading states and error handling
- [ ] Create "Surprise Me" random recipe button
- [ ] Improve responsive design for mobile

---

### **Day 3: Optional Features & Production Polish** (4 hours)

#### Hour 1: Substitute Finder (Agentic RAG)
- [ ] Add "Missing an ingredient?" button on recipe page
- [ ] Implement RAG flow:
  1. User selects missing ingredient
  2. Search recipes with similar vibe tags
  3. Extract substitute patterns (e.g., "Flax-meal for eggs in vegan recipes")
  4. LLM generates context-aware suggestion
- [ ] Display substitution with confidence score
- [ ] Add "Why this substitute?" explanation

#### Hour 2: Meal Planner Feature
- [ ] Create "Plan a Meal" interface
- [ ] Implement 3-course meal suggestion:
  - Appetizer, Main, Dessert with shared vibe
  - Consider flavor balance (savory → sweet)
- [ ] Use LLM to explain meal cohesion
- [ ] Add "Regenerate" option for different suggestions
- [ ] Display combined shopping list

#### Hour 3: Enhanced UI/UX & Styling
- [ ] Refine color scheme (food-themed, warm tones)
- [ ] Add micro-animations (recipe card hover, vibe score)
- [ ] Implement dark mode toggle
- [ ] Add recipe favoriting/bookmarking (localStorage)
- [ ] Create "My Recipe Box" section
- [ ] Improve accessibility (ARIA labels, keyboard navigation)

#### Hour 4: Testing, Deployment & Documentation
- [ ] Test with 10+ diverse recipes (family recipes, blogs, complex PDFs)
- [ ] Test edge cases:
  - Ambiguous mood queries
  - Recipes without clear vibe
  - PDF parsing failures
- [ ] Deploy backend to Railway/Render/Vercel Functions
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Set up environment variables securely
- [ ] Write README with:
  - Setup instructions
  - API key requirements (OpenAI, MongoDB)
  - Sample queries to try
  - Architecture diagram
- [ ] Record demo video showcasing mood search

---

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: React Context / Zustand (lightweight)

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB Atlas (with Vector Search)
- **LLM**: OpenAI GPT-4 (for vibe tagging) + Embeddings API
- **Scraping**: Cheerio (HTML) + pdf-parse (PDF)

### Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / Vercel Serverless Functions
- **Database**: MongoDB Atlas (Free tier supports Vector Search)

---

## Key Learning Outcomes

1. **Vector Embeddings**: Understand how to convert text to numerical representations
2. **Semantic Search**: Implement cosine similarity for "vibe matching"
3. **Agentic RAG**: Use LLM to intelligently query and reason over database
4. **Multi-Modal Data**: Handle text extraction from URLs and PDFs
5. **Prompt Engineering**: Craft prompts for consistent metadata generation
6. **MongoDB Atlas Vector Search**: Configure and query vector indexes
7. **UX for AI**: Design interfaces that encourage descriptive, natural language input

---

## Getting Started

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cd backend
cp .env.example .env
# Add: OPENAI_API_KEY, MONGODB_URI (see MONGODB_SETUP.md)

# Create MongoDB Atlas Vector Search index
# See detailed instructions in MONGODB_SETUP.md

# Run development servers
cd backend && npm run dev    # Port 3001
cd frontend && npm run dev   # Port 5173

# Optional: Upload test recipes
cd backend && node src/testRecipes.js
```

For detailed setup instructions, see:
- [MONGODB_SETUP.md](MONGODB_SETUP.md) - MongoDB Atlas & Vector Search configuration
- [TESTING.md](TESTING.md) - Hour 2 testing checklist

---

## Success Criteria

- [ ] Successfully scrape and store 10+ recipes with AI-generated vibe tags
- [ ] Mood search returns relevant recipes with >70% vibe match scores
- [ ] Recipe detail page clearly explains "why" the match works
- [ ] At least 1 optional feature implemented (Substitute Finder OR Meal Planner)
- [ ] Deployed and accessible via public URL
- [ ] Clean, intuitive UI that encourages exploration