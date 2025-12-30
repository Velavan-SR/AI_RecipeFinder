import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

export const generateVibeTags = async (recipe) => {
  const prompt = `Given this recipe:

Title: ${recipe.title || 'Untitled'}
Ingredients: ${recipe.ingredients.join(', ')}
Instructions: ${recipe.instructions}

Generate a JSON response with:
1. "vibeTags": 5-7 descriptive vibe tags that capture the emotional and situational context (e.g., "Cozy", "Energizing", "Nostalgic", "Rainy Day", "Comfort Food", "Celebration", "Quick & Easy")
2. "flavorProfile": A 2-3 sentence description of the flavor profile and mood this recipe evokes

Return ONLY valid JSON in this format:
{
  "vibeTags": ["tag1", "tag2", "tag3"],
  "flavorProfile": "description here"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a culinary expert who understands the emotional and cultural significance of food. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response from OpenAI');
  } catch (error) {
    console.error('Error generating vibe tags:', error);
    throw error;
  }
};

export const generateRecipeEmbedding = async (recipe) => {
  const embeddingText = `${recipe.title} ${recipe.ingredients.join(' ')} ${recipe.instructions} ${recipe.vibeTags ? recipe.vibeTags.join(' ') : ''} ${recipe.flavorProfile || ''}`;
  return await generateEmbedding(embeddingText);
};

export const generateMatchExplanation = async (query, recipe, vibeMatch) => {
  const prompt = `A user searched for: "${query}"

We matched them with this recipe:
Title: ${recipe.title}
Vibe Tags: ${recipe.vibeTags.join(', ')}
Flavor Profile: ${recipe.flavorProfile}
Match Score: ${vibeMatch}%

Write a brief 1-2 sentence explanation of why this recipe matches their search query. Focus on the emotional/situational connection. Be warm and conversational.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a friendly culinary assistant explaining recipe matches. Keep it brief and warm.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating match explanation:', error);
    // Return a fallback explanation
    return `This recipe matches your vibe with its ${recipe.vibeTags.slice(0, 2).join(' and ')} qualities.`;
  }
};
