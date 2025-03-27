// server.js
import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const port = 3000;

/**
 * Endpoint: GET /api/scrape
 * Query Param: keyword - the search term to query Amazon.
 */
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword query parameter is required' });
  }

  // Construct the Amazon search URL using the provided keyword
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    // Fetch the Amazon search results page with a user-agent header
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/85.0.4183.102 Safari/537.36'
      }
    });

    // Use JSDOM to parse the returned HTML content
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Select each product listing from the first page.
    // Amazon marks product listings with data-component-type="s-search-result"
    const productNodes = document.querySelectorAll('div.s-result-item[data-component-type="s-search-result"]');
    const products = [];

    productNodes.forEach(node => {
      // Extract product title (usually within <h2> > <a> > <span>)
      const titleElement = node.querySelector('h2 a span');
      const title = titleElement ? titleElement.textContent.trim() : null;

      // Extract rating (located in a span with class 'a-icon-alt')
      const ratingElement = node.querySelector('span.a-icon-alt');
      let rating = ratingElement ? ratingElement.textContent.trim() : null;
      if (rating) {
        // Format rating (e.g., "4.5 out of 5 stars" -> "4.5")
        rating = rating.split(' ')[0];
      }

      // Extract number of reviews (this may vary by listing)
      const reviewElement = node.querySelector('span.a-size-base');
      const reviewCount = reviewElement ? reviewElement.textContent.trim() : null;

      // Extract product image URL (using the 's-image' class)
      const imageElement = node.querySelector('img.s-image');
      const imageUrl = imageElement ? imageElement.src : null;

      // Only add the product if a title was found
      if (title) {
        products.push({ title, rating, reviewCount, imageUrl });
      }
    });

    // Return the extracted product data as JSON
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping data' });
  }
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
