import express from 'express';
import { scrapeRecipeFromURL, extractRecipeFromPDF } from '../services/scraperService.js';
import { generateVibeTags, generateRecipeEmbedding, generateMatchExplanation } from '../services/openaiService.js';
import { createRecipe, findRecipeById, vectorSearch, getRecipesCollection } from '../models/Recipe.js';
import { generateEmbedding } from '../services/openaiService.js';

const router = express.Router();

// POST /api/recipes/scrape - Handle URL/PDF input
router.post('/scrape', async (req, res) => {
  try {
    const { url, pdfBuffer } = req.body;
    
    if (!url && !pdfBuffer) {
      return res.status(400).json({ 
        error: 'URL or PDF required',
        details: 'Please provide either a URL or PDF file to upload'
      });
    }

    let recipeData;
    
    if (url) {
      console.log('📥 Scraping recipe from URL:', url);
      try {
        recipeData = await scrapeRecipeFromURL(url);
      } catch (scrapeError) {
        return res.status(400).json({ 
          error: 'Failed to scrape recipe from URL',
          details: scrapeError.message
        });
      }
    } else if (pdfBuffer) {
      console.log('📄 Extracting recipe from PDF');
      try {
        const buffer = Buffer.from(pdfBuffer, 'base64');
        recipeData = await extractRecipeFromPDF(buffer);
      } catch (pdfError) {
        return res.status(400).json({ 
          error: 'Failed to extract recipe from PDF',
          details: pdfError.message
        });
      }
    }

    // Validate recipe data
    if (!recipeData.title || !recipeData.ingredients || !recipeData.instructions) {
      return res.status(400).json({ 
        error: 'Incomplete recipe data',
        details: 'Recipe must have title, ingredients, and instructions'
      });
    }

    // Generate vibe tags and flavor profile
    console.log('🎨 Generating vibe tags...');
    try {
      const { vibeTags, flavorProfile } = await generateVibeTags(recipeData);
      recipeData.vibeTags = vibeTags || [];
      recipeData.flavorProfile = flavorProfile || 'No flavor profile available';
    } catch (tagError) {
      console.error('Failed to generate vibe tags:', tagError);
      // Continue with default values
      recipeData.vibeTags = ['Uncategorized'];
      recipeData.flavorProfile = 'Unable to generate flavor profile';
    }

    // Generate embedding
    console.log('🔢 Generating embedding...');
    try {
      recipeData.embedding = await generateRecipeEmbedding(recipeData);
    } catch (embeddingError) {
      console.error('Failed to generate embedding:', embeddingError);
      return res.status(500).json({ 
        error: 'Failed to generate recipe embedding',
        details: 'OpenAI API may be unavailable. Please check your API key and try again.'
      });
    }

    // Save to database
    try {
      const result = await createRecipe(recipeData);
      
      // Remove embedding from response (too large)
      delete recipeData.embedding;
      
      res.json({
        success: true,
        recipeId: result.insertedId,
        recipe: recipeData
      });
    } catch (dbError) {
      console.error('Failed to save recipe:', dbError);
      return res.status(500).json({ 
        error: 'Failed to save recipe to database',
        details: dbError.message
      });
    }
  } catch (error) {
    console.error('Error processing recipe:', error);
    res.status(500).json({ 
      error: 'Unexpected error processing recipe',
      details: error.message 
    });
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

    // Convert score to vibe match percentage and generate explanations
    const recipesWithVibeMatch = await Promise.all(
      results.map(async (recipe) => {
        const vibeMatch = Math.round(recipe.score * 100);
        const matchExplanation = await generateMatchExplanation(query, recipe, vibeMatch);
        return {
          ...recipe,
          vibeMatch,
          matchExplanation
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

export default router;
