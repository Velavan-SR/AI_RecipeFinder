import * as cheerio from 'cheerio';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const scrapeRecipeFromURL = async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Common recipe selectors (works for many recipe sites)
    const title = $('h1').first().text().trim() || 
                  $('[class*="recipe-title"]').first().text().trim() ||
                  $('title').text().trim();

    // Try to find ingredients
    const ingredients = [];
    $('[class*="ingredient"], [itemprop="recipeIngredient"], .ingredients li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 2) {
        ingredients.push(text);
      }
    });

    // Try to find instructions
    let instructions = '';
    $('[class*="instruction"], [itemprop="recipeInstructions"], .instructions, .directions').each((i, elem) => {
      instructions += $(elem).text().trim() + '\n';
    });

    // Fallback: get all paragraph text if specific selectors fail
    if (!instructions) {
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 50) {
          instructions += text + '\n';
        }
      });
    }

    return {
      title: title || 'Untitled Recipe',
      ingredients: ingredients.length > 0 ? ingredients : ['No ingredients found'],
      instructions: instructions.trim() || 'No instructions found',
      source: url
    };
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw new Error('Failed to scrape recipe from URL');
  }
};

export const extractRecipeFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    const text = data.text;

    // Simple parsing - split by common patterns
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    const title = lines[0] || 'PDF Recipe';
    
    // Try to identify ingredients (lines with measurements)
    const ingredients = lines.filter(line => 
      /\d+\s*(cup|tbsp|tsp|oz|lb|g|kg|ml|l|piece|clove|inch)/i.test(line) ||
      line.match(/^[-•*]\s/)
    );

    // Rest is instructions
    const instructions = text;

    return {
      title,
      ingredients: ingredients.length > 0 ? ingredients : ['See PDF for ingredients'],
      instructions: instructions || 'See PDF for instructions',
      source: 'PDF Upload'
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract recipe from PDF');
  }
};
