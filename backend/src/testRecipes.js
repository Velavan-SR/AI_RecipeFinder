// Quick test script to add sample recipes
// Run with: node backend/src/testRecipes.js

import { connectDB, createRecipe } from './models/Recipe.js';
import { generateVibeTags, generateRecipeEmbedding } from './services/openaiService.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleRecipes = [
  {
    title: "Grandma's Chicken Noodle Soup",
    ingredients: [
      "1 whole chicken",
      "8 cups chicken broth",
      "3 carrots, chopped",
      "3 celery stalks, chopped",
      "1 onion, diced",
      "2 cups egg noodles",
      "Fresh dill",
      "Salt and pepper"
    ],
    instructions: "In a large pot, simmer chicken with broth, vegetables, and seasonings for 1 hour. Remove chicken, shred meat, return to pot. Add noodles and cook until tender. Garnish with fresh dill. This recipe has been passed down for three generations.",
    source: "Family Recipe"
  },
  {
    title: "Crunchy Asian Slaw with Peanuts",
    ingredients: [
      "1/2 head cabbage, shredded",
      "2 carrots, julienned",
      "1 red pepper, sliced thin",
      "1/2 cup roasted peanuts",
      "3 tbsp rice vinegar",
      "2 tbsp sesame oil",
      "1 tbsp honey",
      "Lime juice"
    ],
    instructions: "Combine all vegetables in a large bowl. Whisk together vinegar, sesame oil, honey, and lime juice. Toss with vegetables and top with peanuts. Refrigerate for 30 minutes before serving for maximum crunch.",
    source: "Test Recipe"
  },
  {
    title: "Midnight Chocolate Lava Cake",
    ingredients: [
      "4 oz dark chocolate",
      "1/2 cup butter",
      "2 eggs",
      "2 egg yolks",
      "1/4 cup sugar",
      "2 tbsp flour",
      "Vanilla ice cream"
    ],
    instructions: "Melt chocolate and butter together. Whisk eggs, yolks, and sugar until thick. Fold in chocolate mixture and flour. Pour into greased ramekins. Bake at 425°F for 13 minutes. Centers should be molten. Serve immediately with ice cream.",
    source: "Test Recipe"
  }
];

async function testRecipeUpload() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectDB(process.env.MONGODB_URI);
    
    for (const recipe of sampleRecipes) {
      console.log(`\n📝 Processing: ${recipe.title}`);
      
      // Generate vibe tags
      console.log('  🎨 Generating vibe tags...');
      const { vibeTags, flavorProfile } = await generateVibeTags(recipe);
      recipe.vibeTags = vibeTags;
      recipe.flavorProfile = flavorProfile;
      
      console.log(`  ✨ Tags: ${vibeTags.join(', ')}`);
      console.log(`  💭 Profile: ${flavorProfile.substring(0, 80)}...`);
      
      // Generate embedding
      console.log('  🔢 Generating embedding...');
      recipe.embedding = await generateRecipeEmbedding(recipe);
      
      // Save to database
      const result = await createRecipe(recipe);
      console.log(`  ✅ Saved with ID: ${result.insertedId}`);
    }
    
    console.log('\n🎉 All sample recipes uploaded successfully!');
    console.log('💡 Try searching for:');
    console.log('   - "Something my grandmother would make"');
    console.log('   - "I need something crunchy and healthy"');
    console.log('   - "Comfort food for a rainy day"');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testRecipeUpload();
