# Amazon Product Scraper

This project is a simple web application to scrape Amazon product listings from the first page of search results for a given keyword. The backend is built with Bun (using Express, Axios, and JSDOM) and the frontend is built using HTML, CSS, and vanilla JavaScript (with Vite for bundling).

## Features

- Scrapes Amazon search results based on a provided keyword.
- Extracts product title, rating, number of reviews, and product image URL.
- Provides a backend API endpoint `/api/scrape`.
- User-friendly frontend for input and display of results.

## Prerequisites

- [Bun](https://bun.sh/) installed on your system.
- [Node.js](https://nodejs.org/) (if needed for Vite).
