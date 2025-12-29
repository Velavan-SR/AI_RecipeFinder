import { MongoClient, ObjectId } from 'mongodb';

let db;

export const connectDB = async (uri) => {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db('recipe-vibe-finder');
  console.log('✅ Connected to MongoDB Atlas');
  
  // Create vector search index (manual step in Atlas UI or via API)
  console.log('ℹ️  Remember to create Vector Search index in MongoDB Atlas:');
  console.log('   Index name: vector_index');
  console.log('   Field: embedding');
  console.log('   Dimensions: 1536');
  console.log('   Similarity: cosine');
};

// MongoDB Schema Design
export const recipeSchema = {
  _id: ObjectId,
  title: String,
  ingredients: Array, // [String]
  instructions: String,
  source: String, // URL or "PDF Upload"
  vibeTags: Array, // ["Comfort", "Savory", "Winter"]
  embedding: Array, // [Number] - 1536 dimensions for OpenAI
  flavorProfile: String, // AI-generated description
  createdAt: Date
};

export const getRecipesCollection = () => {
  return db.collection('recipes');
};

export const createRecipe = async (recipeData) => {
  const recipes = getRecipesCollection();
  const result = await recipes.insertOne({
    ...recipeData,
    createdAt: new Date()
  });
  return result;
};

export const findRecipeById = async (id) => {
  const recipes = getRecipesCollection();
  return await recipes.findOne({ _id: new ObjectId(id) });
};

export const vectorSearch = async (queryEmbedding, limit = 10) => {
  const recipes = getRecipesCollection();
  
  const pipeline = [
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: 50,
        limit: limit
      }
    },
    {
      $project: {
        title: 1,
        vibeTags: 1,
        flavorProfile: 1,
        ingredients: 1,
        source: 1,
        score: { $meta: 'vectorSearchScore' }
      }
    }
  ];
  
  return await recipes.aggregate(pipeline).toArray();
};
