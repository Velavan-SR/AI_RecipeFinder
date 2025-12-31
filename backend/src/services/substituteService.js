import { getRecipesCollection } from '../models/Recipe.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const findSubstitute = async (recipeId, missingIngredient) => {
  try {
    const recipes = getRecipesCollection();
    const currentRecipe = await recipes.findOne({ _id: recipeId });
    
    if (!currentRecipe) {
      throw new Error('Recipe not found');
    }

    // Search for recipes with similar vibe tags
    const similarRecipes = await recipes.find({
      vibeTags: { $in: currentRecipe.vibeTags },
      _id: { $ne: recipeId }
    }).limit(20).toArray();

    // Extract ingredients from similar recipes
    const allIngredients = similarRecipes.flatMap(r => r.ingredients);

    // Use LLM to find substitute
    const prompt = `A user is making this recipe: "${currentRecipe.title}"
Vibe: ${currentRecipe.vibeTags.join(', ')}
They are missing: ${missingIngredient}

From similar recipes with the same vibe, here are ingredients used: ${allIngredients.join(', ')}

Suggest the best substitute for "${missingIngredient}" in this context. Consider:
1. Similar recipes that share the same vibe
2. Dietary restrictions (if it's vegan, suggest vegan alternatives)
3. The flavor profile and texture match

Return a JSON response:
{
  "substitute": "ingredient name",
  "reason": "1-2 sentence explanation why this works in this context",
  "confidence": "high/medium/low"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a culinary expert who understands ingredient substitutions and recipe compatibility. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('Error finding substitute:', error);
    throw error;
  }
};
