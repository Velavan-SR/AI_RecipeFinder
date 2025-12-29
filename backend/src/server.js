import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './models/Recipe.js';
import recipeRoutes from './routes/recipeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/recipes', recipeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Recipe Vibe Finder API is running' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGODB_URI);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API: http://localhost:${PORT}/api/recipes`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
