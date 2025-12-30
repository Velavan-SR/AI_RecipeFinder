import * as cheerio from 'cheerio';
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const scrapeRecipeFromURL = async (url) => {
  try {
    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Add protocol if missing
    let validUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      validUrl = 'https://' + url;
    }

    const response = await fetch(validUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    if (!html || html.trim().length === 0) {
      throw new Error('URL returned empty content');
    }

    const $ = cheerio.load(html);

    // Common recipe selectors (works for many recipe sites)
    const title = $('h1').first().text().trim() || 
                  $('[class*="recipe-title"]').first().text().trim() ||
                  $('[itemprop="name"]').first().text().trim() ||
                  $('title').text().trim() ||
                  'Untitled Recipe';

    // Try to find ingredients with multiple selectors
    const ingredients = [];
    const ingredientSelectors = [
      '[class*="ingredient"]',
      '[itemprop="recipeIngredient"]',
      '.ingredients li',
      '.ingredient-list li',
      '[data-ingredient]',
      'li[class*="ingredient"]'
    ];

    ingredientSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length > 2 && !ingredients.includes(text)) {
          ingredients.push(text);
        }
      });
    });

    // Try to find instructions with multiple selectors
    let instructions = '';
    const instructionSelectors = [
      '[class*="instruction"]',
      '[itemprop="recipeInstructions"]',
      '.instructions',
      '.directions',
      '.recipe-directions',
      '[class*="direction"]',
      '[class*="step"]'
    ];

    instructionSelectors.forEach(selector => {
      $(selector).each((i, elem) => {
        const text = $(elem).text().trim();
        if (text && text.length > 20) {
          instructions += text + '\n\n';
        }
      });
    });

    // Fallback: get all paragraph text if specific selectors fail
    if (!instructions || instructions.length < 50) {
      $('p').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 50) {
          instructions += text + '\n\n';
        }
      });
    }

    // Clean up title (remove site name suffix)
    const cleanTitle = title.split('|')[0].split('-')[0].trim();

    // Validate we got meaningful data
    const finalIngredients = ingredients.length > 0 
      ? ingredients 
      : ['Unable to extract ingredients from this page'];

    const finalInstructions = instructions.trim().length > 20
      ? instructions.trim()
      : 'Unable to extract instructions from this page';

    return {
      title: cleanTitle.length > 100 ? cleanTitle.substring(0, 100) + '...' : cleanTitle,
      ingredients: finalIngredients,
      instructions: finalInstructions,
      source: validUrl
    };
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw new Error(`Failed to scrape recipe from URL: ${error.message}`);
  }
};

export const extractRecipeFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error('PDF appears to be empty or unreadable');
    }

    // Split into lines and clean
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      throw new Error('No readable text found in PDF');
    }

    // First non-empty line is likely the title
    const title = lines[0] || 'Untitled PDF Recipe';
    
    // Look for ingredients section
    const ingredientsStartIdx = lines.findIndex(line => 
      /^(ingredients?|what you need|you will need|materials?):/i.test(line)
    );
    
    const instructionsStartIdx = lines.findIndex(line => 
      /^(instructions?|directions?|method|steps?|how to make|preparation):/i.test(line)
    );

    let ingredients = [];
    let instructions = '';

    // Extract ingredients if section found
    if (ingredientsStartIdx !== -1) {
      const endIdx = instructionsStartIdx !== -1 ? instructionsStartIdx : lines.length;
      const ingredientLines = lines.slice(ingredientsStartIdx + 1, endIdx);
      
      ingredients = ingredientLines.filter(line => 
        // Lines with measurements or bullet points
        /\d+\s*(cup|tbsp|tsp|tablespoon|teaspoon|oz|lb|g|kg|ml|l|piece|clove|inch|pound)/i.test(line) ||
        /^[-•*]\s/.test(line) ||
        /^\d+\.?\s/.test(line)
      ).map(line => line.replace(/^[-•*]\s*/, '').trim());
    } else {
      // Fallback: look for measurement patterns
      ingredients = lines.filter(line => 
        /\d+\s*(cup|tbsp|tsp|oz|lb|g|kg|ml|l|piece|clove)/i.test(line)
      );
    }

    // Extract instructions if section found
    if (instructionsStartIdx !== -1) {
      const instructionLines = lines.slice(instructionsStartIdx + 1);
      instructions = instructionLines.join('\n');
    } else {
      // Fallback: use all text after ingredients
      if (ingredientsStartIdx !== -1) {
        instructions = lines.slice(ingredientsStartIdx + ingredients.length + 1).join('\n');
      } else {
        instructions = text;
      }
    }

    // Validate we have at least some data
    if (ingredients.length === 0) {
      ingredients = ['Unable to parse ingredients - please check the PDF manually'];
    }

    if (!instructions || instructions.trim().length < 10) {
      instructions = 'Unable to parse instructions - please check the PDF manually';
    }

    return {
      title: title.length > 100 ? title.substring(0, 100) + '...' : title,
      ingredients,
      instructions: instructions.trim(),
      source: 'PDF Upload'
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to extract recipe from PDF: ${error.message}`);
  }
};
