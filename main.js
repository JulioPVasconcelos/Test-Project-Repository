// main.js
document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Loading...';

  try {
    // Make an AJAX call to the backend endpoint with the keyword
    const response = await fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    const products = data.products;
    if (products.length === 0) {
      resultsDiv.innerHTML = '<p>No products found.</p>';
      return;
    }

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Iterate through the products and display each one
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      const image = document.createElement('img');
      image.src = product.imageUrl || '';
      image.alt = product.title;

      const detailsDiv = document.createElement('div');
      detailsDiv.classList.add('product-details');

      const title = document.createElement('h3');
      title.textContent = product.title;

      const rating = document.createElement('p');
      rating.textContent = `Rating: ${product.rating || 'N/A'}`;

      const reviews = document.createElement('p');
      reviews.textContent = `Reviews: ${product.reviewCount || 'N/A'}`;

      detailsDiv.appendChild(title);
      detailsDiv.appendChild(rating);
      detailsDiv.appendChild(reviews);

      productDiv.appendChild(image);
      productDiv.appendChild(detailsDiv);

      resultsDiv.appendChild(productDiv);
    });
  } catch (error) {
    resultsDiv.innerHTML = `<p>An error occurred: ${error.message}</p>`;
  }
});
