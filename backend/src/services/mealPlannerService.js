import { getDb } from '../config/db.js';
import { generateEmbedding } from './openaiService.js';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate a 3-course meal plan (appetizer, main, dessert) based on mood/vibe
 * @param {string} moodQuery - User's mood or vibe description
 * @returns {Object} - { appetizer, main, dessert, explanation, shoppingList }
 */
export const generateMealPlan = async (moodQuery) => {
  try {
    const db = getDb();
    const recipes = db.collection('recipes');

    // Generate embedding for the mood query
    const queryEmbedding = await generateEmbedding(moodQuery);

    // Search for recipes with vector similarity
    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 50
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          ingredients: 1,
          instructions: 1,
          vibeTags: 1,
          flavorProfile: 1,
          source: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ];

    const allRecipes = await recipes.aggregate(pipeline).toArray();

    if (allRecipes.length < 3) {
      throw new Error('Not enough recipes in database to create a meal plan. Please add more recipes.');
    }

    // Use LLM to intelligently select 3 courses with flavor balance
    const selectionPrompt = `You are a professional meal planner. Given these recipes with their vibe tags and flavor profiles, select 3 recipes for a cohesive 3-course meal:
- 1 appetizer (light, starter)
- 1 main course (substantial, filling)
- 1 dessert (sweet, concluding)

The recipes should share the vibe: "${moodQuery}"
Consider flavor balance: start light, build to savory, end sweet.

Available recipes:
${allRecipes.slice(0, 30).map((r, i) => `${i + 1}. ${r.title} - Tags: ${r.vibeTags.join(', ')} - Flavor: ${r.flavorProfile}`).join('\n')}

Respond ONLY with JSON in this exact format (no markdown, no code blocks):
{
  "appetizer": 5,
  "main": 12,
  "dessert": 8,
  "explanation": "Brief explanation of why these 3 recipes work together as a cohesive meal"
}

Use the recipe numbers from the list above.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: selectionPrompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Parse JSON response
    let selection;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      selection = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', responseText);
      // Fallback: manually select diverse recipes
      selection = {
        appetizer: 0,
        main: Math.floor(allRecipes.length / 2),
        dessert: allRecipes.length - 1,
        explanation: 'A curated selection of recipes that complement each other and match your mood.'
      };
    }

    // Get the selected recipes (convert 1-indexed to 0-indexed)
    const appetizer = allRecipes[selection.appetizer - 1] || allRecipes[0];
    const main = allRecipes[selection.main - 1] || allRecipes[Math.floor(allRecipes.length / 2)];
    const dessert = allRecipes[selection.dessert - 1] || allRecipes[allRecipes.length - 1];

    // Generate combined shopping list (deduplicate ingredients)
    const allIngredients = [
      ...(appetizer.ingredients || []),
      ...(main.ingredients || []),
      ...(dessert.ingredients || [])
    ];

    // Simple deduplication (case-insensitive)
    const uniqueIngredients = [...new Set(allIngredients.map(i => i.toLowerCase()))];
    
    // Use LLM to organize and format shopping list
    const shoppingListPrompt = `Organize this shopping list by category (Produce, Proteins, Dairy, Pantry, etc.):

${uniqueIngredients.join('\n')}

Respond ONLY with JSON in this exact format (no markdown):
{
  "Produce": ["ingredient1", "ingredient2"],
  "Proteins": ["ingredient3"],
  "Dairy": ["ingredient4"],
  "Pantry": ["ingredient5", "ingredient6"],
  "Other": ["ingredient7"]
}`;

    const shoppingCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: shoppingListPrompt }],
      temperature: 0.5,
      max_tokens: 800
    });

    let organizedShoppingList;
    try {
      const shoppingResponse = shoppingCompletion.choices[0].message.content.trim();
      const cleanedShopping = shoppingResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      organizedShoppingList = JSON.parse(cleanedShopping);
    } catch {
      // Fallback to simple list
      organizedShoppingList = { "Shopping List": uniqueIngredients };
    }

    return {
      appetizer: {
        _id: appetizer._id,
        title: appetizer.title,
        ingredients: appetizer.ingredients,
        instructions: appetizer.instructions,
        vibeTags: appetizer.vibeTags,
        flavorProfile: appetizer.flavorProfile,
        source: appetizer.source,
        vibeMatch: Math.round(appetizer.score * 100)
      },
      main: {
        _id: main._id,
        title: main.title,
        ingredients: main.ingredients,
        instructions: main.instructions,
        vibeTags: main.vibeTags,
        flavorProfile: main.flavorProfile,
        source: main.source,
        vibeMatch: Math.round(main.score * 100)
      },
      dessert: {
        _id: dessert._id,
        title: dessert.title,
        ingredients: dessert.ingredients,
        instructions: dessert.instructions,
        vibeTags: dessert.vibeTags,
        flavorProfile: dessert.flavorProfile,
        source: dessert.source,
        vibeMatch: Math.round(dessert.score * 100)
      },
      explanation: selection.explanation,
      shoppingList: organizedShoppingList,
      moodQuery
    };

  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};
