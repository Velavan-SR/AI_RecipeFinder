import { getRecipesCollection } from '../models/Recipe.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateMealPlan = async (vibe) => {
  try {
    const recipes = getRecipesCollection();
    
    // Get all recipes
    const allRecipes = await recipes.find({}, {
      projection: { _id: 1, title: 1, vibeTags: 1, flavorProfile: 1, ingredients: 1 }
    }).limit(50).toArray();

    if (allRecipes.length < 3) {
      throw new Error('Not enough recipes in database. Add more recipes first!');
    }

    // Use LLM to select 3 recipes that work well together
    const recipesText = allRecipes.map((r, idx) => 
      `${idx}. ${r.title} - Vibes: ${r.vibeTags.join(', ')}`
    ).join('\n');

    const prompt = `Given these recipes:
${recipesText}

User wants a 3-course meal plan with this vibe: "${vibe}"

Select 3 recipes (by their index numbers) that would make a perfect meal together:
1. An appetizer/starter
2. A main course
3. A dessert

Consider:
- The vibe should match "${vibe}"
- Flavors should complement each other
- Variety in cooking methods and textures

Return JSON:
{
  "appetizer": index_number,
  "main": index_number,
  "dessert": index_number,
  "explanation": "2-3 sentences explaining why these recipes work together and match the vibe"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional meal planner who understands flavor pairing and course progression.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const selection = JSON.parse(jsonMatch[0]);

    // Get full recipe details
    const mealPlan = {
      appetizer: allRecipes[selection.appetizer],
      main: allRecipes[selection.main],
      dessert: allRecipes[selection.dessert],
      explanation: selection.explanation,
      vibe: vibe
    };

    return mealPlan;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

export const generateShoppingList = async (recipeIds) => {
  try {
    const recipes = getRecipesCollection();
    const recipeList = await recipes.find({
      _id: { $in: recipeIds }
    }).toArray();

    const allIngredients = recipeList.flatMap(r => r.ingredients);
    
    // Use LLM to consolidate and organize
    const prompt = `Given these ingredients from multiple recipes:
${allIngredients.join('\n')}

Create a consolidated shopping list:
1. Combine duplicate ingredients (e.g., "2 eggs" + "3 eggs" = "5 eggs")
2. Group by category (Produce, Dairy, Meat, Pantry, etc.)
3. Remove items people typically have (salt, pepper, water)

Return JSON:
{
  "categories": {
    "Produce": ["item1", "item2"],
    "Dairy": ["item1"],
    ...
  }
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { categories: { 'All Items': allIngredients } };
  } catch (error) {
    console.error('Error generating shopping list:', error);
    return { categories: { 'All Items': allIngredients } };
  }
};
