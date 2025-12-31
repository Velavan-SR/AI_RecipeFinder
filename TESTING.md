# Testing Guide - AI Recipe Vibe Finder

Comprehensive testing guidelines for the Recipe Vibe Finder application.

## Testing Overview

This guide covers:
- Feature testing checklist
- Edge cases to test
- Sample recipes for testing
- Performance benchmarks
- Known limitations

## Quick Test Checklist

### Basic Functionality

- [ ] **Recipe Upload from URL**
  - [ ] Upload from AllRecipes.com
  - [ ] Upload from Food Network
  - [ ] Upload from personal blog
  - [ ] Verify all fields populated (title, ingredients, instructions)
  - [ ] Check vibe tags generated (5-7 tags)
  - [ ] Confirm flavor profile created

- [ ] **Mood-Based Search**
  - [ ] Search "comfort food" - returns relevant recipes
  - [ ] Search "healthy quick meal" - filters appropriately
  - [ ] Search "nostalgic grandma recipes" - matches sentiment
  - [ ] Empty search returns friendly message
  - [ ] Results show vibe match percentage

- [ ] **Recipe Detail Page**
  - [ ] All recipe info displays correctly
  - [ ] Ingredient checkboxes work
  - [ ] Instructions formatted properly
  - [ ] Vibe tags displayed
  - [ ] Source link works

- [ ] **Substitute Finder (Agentic RAG)**
  - [ ] Click ingredient → modal opens
  - [ ] Loading state shows
  - [ ] Substitute suggestion appears
  - [ ] Confidence badge displayed (high/medium/low)
  - [ ] "Why this substitute?" explanation clear

- [ ] **Meal Planner**
  - [ ] Enter mood → generates 3-course meal
  - [ ] Appetizer, main, dessert all different
  - [ ] Cohesion explanation makes sense
  - [ ] Shopping list organized by category
  - [ ] "Regenerate" gives different recipes

- [ ] **Favorites System**
  - [ ] Heart button toggles favorite
  - [ ] Favorites persist after refresh (localStorage)
  - [ ] "My Recipe Box" shows all favorites
  - [ ] Remove from favorites works
  - [ ] Empty state displays correctly

- [ ] **Dark Mode**
  - [ ] Toggle switches between light/dark
  - [ ] Preference persists after refresh
  - [ ] All pages styled correctly in both modes
  - [ ] Text readable in dark mode

## Edge Cases to Test

### 1. Ambiguous Mood Queries

Test searches that are vague or contradictory:

```
Test Query: "sad but happy"
Expected: Should handle gracefully, possibly return comfort foods

Test Query: "asdfghjkl"
Expected: No results or fallback to random recipes

Test Query: "" (empty)
Expected: Error message or prompt to enter query

Test Query: "🍕🍔🌮" (only emojis)
Expected: Handle without crashing

Test Query: "I hate everything and want to die but also celebrate"
Expected: Graceful handling, possibly return general recipes
```

### 2. Recipes Without Clear Vibe

Upload recipes that are unusual or hard to categorize:

```
Test Recipe: "Plain White Rice"
- Very simple, few ingredients
- Expected: Should generate basic tags like "Simple", "Staple", "Neutral"

Test Recipe: "Molecular Gastronomy Foam"
- Extremely technical
- Expected: Tags like "Experimental", "Technical", "Modern"

Test Recipe: "Bachelor's Microwave Surprise"
- Unconventional ingredients
- Expected: Handle without judgment, tag as "Quick", "Easy"
```

### 3. PDF Parsing Failures

Test with problematic PDFs:

- **Scanned image PDFs** (no selectable text)
  - Expected: Error message "Could not extract text from PDF"
  
- **Password-protected PDFs**
  - Expected: Error message or prompt to unlock
  
- **Multi-recipe PDFs**
  - Expected: Extract first recipe or prompt user

- **PDFs with images only**
  - Expected: Graceful failure message

### 4. URL Scraping Failures

Test with difficult websites:

```
Test URL: https://www.nytimes.com/recipes (paywall)
Expected: Error message about paywall

Test URL: https://pinterest.com/pin/12345 (redirect)
Expected: Handle redirect or fail gracefully

Test URL: https://instagram.com/p/recipe (requires login)
Expected: Error message

Test URL: https://not-a-real-url.com
Expected: "Invalid URL" error
```

### 5. Missing or Malformed Data

- **Recipe with no ingredients listed**
  - Expected: Show "No ingredients available"
  
- **Recipe with no instructions**
  - Expected: Show "No instructions available"

- **Recipe with only title**
  - Expected: Generate minimal vibe tags based on title

### 6. Database Issues

- **Empty database (0 recipes)**
  - Search: "comfort food"
  - Expected: "No recipes found. Add some recipes first!"
  
- **1-2 recipes only (insufficient for Meal Planner)**
  - Expected: Error message "Need at least 3 recipes"

- **Substitute Finder with no similar recipes**
  - Expected: "No substitute found" message

### 7. Large Scale Testing

- **100+ recipes in database**
  - Search should complete in < 3 seconds
  - Results should be ranked by relevance
  
- **Very long recipe (500+ ingredients)**
  - Should handle without crashing
  - May need to truncate display

- **Rapid consecutive searches**
  - Test 10 searches in 10 seconds
  - Should not rate-limit or crash

## Sample Test Recipes

### Recipe 1: Classic Comfort Food
```
URL: https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/
Expected Tags: Comfort, Hearty, Italian, Family, Cheesy
Expected Vibe Match: High for "comfort food" searches
```

### Recipe 2: Healthy Quick Meal
```
URL: https://www.foodnetwork.com/recipes/food-network-kitchen/grilled-chicken-with-quinoa-salad
Expected Tags: Healthy, Quick, Protein-rich, Light, Balanced
Expected Vibe Match: High for "healthy dinner" searches
```

### Recipe 3: Nostalgic Dessert
```
URL: https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/
Expected Tags: Nostalgic, Sweet, Childhood, Comforting, Baked
Expected Vibe Match: High for "grandma recipes" searches
```

### Recipe 4: Exotic/Adventure
```
URL: https://www.seriouseats.com/thai-green-curry-recipe
Expected Tags: Exotic, Spicy, Thai, Adventurous, Flavorful
Expected Vibe Match: High for "trying something new" searches
```

### Recipe 5: Simple Staple
```
URL: https://www.foodnetwork.com/recipes/alton-brown/perfect-scrambled-eggs-recipe
Expected Tags: Simple, Breakfast, Quick, Classic, Easy
Expected Vibe Match: High for "easy breakfast" searches
```

## Performance Benchmarks

### Target Metrics

- **Recipe upload**: < 10 seconds (includes scraping + AI processing)
- **Mood search**: < 2 seconds for results
- **Substitute finder**: < 5 seconds
- **Meal planner**: < 8 seconds (3 recipes + shopping list)
- **Page load**: < 1 second
- **Dark mode toggle**: Instant (< 100ms)

### Load Testing

Test with multiple concurrent users:

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3001/api/recipes

# Target: < 500ms average response time
```

## Error Handling Tests

### Frontend Error States

- [ ] No internet connection
- [ ] Backend server down
- [ ] API returns 500 error
- [ ] Malformed JSON response
- [ ] Request timeout (> 30s)

### Backend Error States

- [ ] MongoDB connection lost
- [ ] OpenAI API key invalid
- [ ] Rate limit exceeded
- [ ] Out of memory
- [ ] Invalid request body

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Enter key submits forms
- [ ] Space bar activates buttons
- [ ] Escape closes modals
- [ ] Focus indicators visible

### Screen Reader Testing

- [ ] Recipe cards have descriptive labels
- [ ] Form inputs properly labeled
- [ ] Error messages announced
- [ ] Button purposes clear
- [ ] Image alt text present

### Color Contrast

- [ ] All text readable in light mode (4.5:1 ratio)
- [ ] All text readable in dark mode (4.5:1 ratio)
- [ ] Links distinguishable from text
- [ ] Focus indicators high contrast

## Browser Compatibility

Test in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Known Limitations

### Recipe Scraping

- **Limitation**: Only works with public URLs (no paywalls)
- **Workaround**: Copy-paste recipe text manually

- **Limitation**: Some sites block automated scraping
- **Workaround**: Try different recipe websites

### Vector Search

- **Limitation**: Requires at least 5-10 recipes for good results
- **Workaround**: Seed database with sample recipes

### OpenAI Costs

- **Limitation**: Each recipe costs $0.001-0.01 to process
- **Workaround**: Cache embeddings, batch operations

### Substitute Finder

- **Limitation**: Needs recipes with similar vibe tags
- **Workaround**: Add diverse recipe collection

### Dark Mode

- **Limitation**: localStorage only (not synced across devices)
- **Workaround**: Future: Add user accounts

## Regression Testing

After making changes, re-test these critical paths:

1. **Upload → Search → View**
   - Upload new recipe
   - Search for it by mood
   - View full details

2. **Favorites Flow**
   - Favorite a recipe
   - Navigate to My Recipe Box
   - Unfavorite and verify removal

3. **Meal Planner Flow**
   - Enter mood
   - Generate meal plan
   - Regenerate
   - View individual recipes

4. **Dark Mode Persistence**
   - Toggle dark mode
   - Refresh page
   - Verify still in dark mode

## Automated Testing (Future)

### Unit Tests

```javascript
// Example: Test vibe tag generation
describe('generateVibeTags', () => {
  it('should generate 5-7 tags', async () => {
    const recipe = { title: 'Chocolate Chip Cookies', ingredients: [...] };
    const result = await generateVibeTags(recipe);
    expect(result.vibeTags.length).toBeGreaterThanOrEqual(5);
    expect(result.vibeTags.length).toBeLessThanOrEqual(7);
  });
});
```

### Integration Tests

```javascript
// Example: Test full search flow
describe('Recipe Search', () => {
  it('should return results for valid query', async () => {
    const response = await request(app)
      .post('/api/recipes/search')
      .send({ query: 'comfort food' });
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

### E2E Tests (Playwright/Cypress)

```javascript
// Example: Test recipe upload flow
test('upload recipe from URL', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Add Your Own Recipe');
  await page.fill('input[placeholder*="URL"]', 'https://example.com/recipe');
  await page.click('button:has-text("Upload")');
  await expect(page.locator('text=Recipe uploaded')).toBeVisible();
});
```

## Test Data Cleanup

After testing, clean up test data:

```javascript
// Run in MongoDB Shell
use recipevibe;
db.recipes.deleteMany({ title: /Test Recipe/i });
```

## Reporting Bugs

When you find a bug, report with:

1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots/logs**
5. **Environment** (browser, OS, Node version)

## Success Criteria

The application is production-ready when:

- ✅ All basic functionality tests pass
- ✅ 0 critical bugs
- ✅ < 3 minor bugs
- ✅ All edge cases handled gracefully
- ✅ Performance targets met
- ✅ Accessibility score > 90 (Lighthouse)
- ✅ Works in all major browsers
- ✅ Mobile responsive
- ✅ Dark mode fully functional
- ✅ Error messages user-friendly

Happy testing! 🧪
