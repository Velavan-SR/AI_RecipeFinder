import express from 'express';
import { scrapeRecipeFromURL, extractRecipeFromPDF } from '../services/scraperService.js';
import { generateVibeTags, generateRecipeEmbedding, generateMatchExplanation } from '../services/openaiService.js';
import { createRecipe, findRecipeById, vectorSearch, getRecipesCollection } from '../models/Recipe.js';
import { generateEmbedding } from '../services/openaiService.js';
import { findSubstitute } from '../services/substituteService.js';
import { generateMealPlan, generateShoppingList } from '../services/mealPlannerService.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// POST /api/recipes/scrape - Handle URL/PDF input
router.post('/scrape', async (req, res) => {
  try {
    const { url, pdfBuffer } = req.body;
    
    let recipeData;
    
    if (url) {
      console.log('📥 Scraping recipe from URL:', url);
      recipeData = await scrapeRecipeFromURL(url);
    } else if (pdfBuffer) {
      console.log('📄 Extracting recipe from PDF');
      const buffer = Buffer.from(pdfBuffer, 'base64');
      recipeData = await extractRecipeFromPDF(buffer);
    } else {
      return res.status(400).json({ error: 'URL or PDF required' });
    }

    // Generate vibe tags and flavor profile
    console.log('🎨 Generating vibe tags...');
    const { vibeTags, flavorProfile } = await generateVibeTags(recipeData);
    
    recipeData.vibeTags = vibeTags;
    recipeData.flavorProfile = flavorProfile;

    // Generate embedding
    console.log('🔢 Generating embedding...');
    recipeData.embedding = await generateRecipeEmbedding(recipeData);

    // Save to database
    const result = await createRecipe(recipeData);
    
    res.json({
      success: true,
      recipeId: result.insertedId,
      recipe: recipeData
    });
  } catch (error) {
    console.error('Error processing recipe:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/recipes/search - Mood-based search
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    console.log('🔍 Searching for:', query);

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Perform vector search
    const results = await vectorSearch(queryEmbedding, 10);

    // Convert score to vibe match percentage and add explanations
    const recipesWithVibeMatch = await Promise.all(
      results.map(async (recipe) => {
        const explanation = await generateMatchExplanation(query, recipe);
        return {
          ...recipe,
          vibeMatch: Math.round(recipe.score * 100),
          matchExplanation: explanation
        };
      })
    );

    res.json({
      query,
      results: recipesWithVibeMatch
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/recipes/:id - Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await findRecipeById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Remove embedding from response (too large)
    delete recipe.embedding;

    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/recipes - Get all recipes (for testing)
router.get('/', async (req, res) => {
  try {
    const recipes = getRecipesCollection();
    const allRecipes = await recipes.find({}, { 
      projection: { embedding: 0 } // Exclude embeddings
    }).limit(50).toArray();
    
    res.json(allRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/recipes/:id/substitute - Find ingredient substitute
router.post('/:id/substitute', async (req, res) => {
  try {
    const { ingredient } = req.body;
    
    if (!ingredient) {
      return res.status(400).json({ error: 'Ingredient required' });
    }

    const result = await findSubstitute(new ObjectId(req.params.id), ingredient);
    res.json(result);
  } catch (error) {
    console.error('Error finding substitute:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/meal-planner - Generate meal plan
router.post('/meal-planner', async (req, res) => {
  try {
    const { vibe } = req.body;
    
    if (!vibe) {
      return res.status(400).json({ error: 'Vibe required' });
    }

    const mealPlan = await generateMealPlan(vibe);
    res.json(mealPlan);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shopping-list - Generate shopping list
router.post('/shopping-list', async (req, res) => {
  try {
    const { recipeIds } = req.body;
    
    if (!recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({ error: 'Recipe IDs array required' });
    }

    const objectIds = recipeIds.map(id => new ObjectId(id));
    const shoppingList = await generateShoppingList(objectIds);
    
    res.json(shoppingList);
  } catch (error) {
    console.error('Error generating shopping list:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
