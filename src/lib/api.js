const SUPABASE_URL = 'https://kibfdaxeegvddusnknfs.supabase.co/rest/v1';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmZkYXhlZWd2ZGR1c25rbmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMTQ2NzMsImV4cCI6MjAzOTg5MDY3M30.l9HjERTXw_8mAqzIOkv8vck82CBbh2wPiZ_pS96k7Mg';

/**
 * Helper function to generate a URL-friendly slug from title
 * @param {string} title - The title to convert
 * @returns {string} - URL-friendly slug
 */
function generateTitleSlug(title) {

  const croatianToAsciiMap = {
    č: 'c',
    ć: 'c',
    ž: 'z',
    đ: 'dj',
    š: 's',
    Č: 'C',
    Ć: 'C',
    Ž: 'Z',
    Đ: 'Dj',
    Š: 'S'
  };


  const normalizedTitle = title
    .split('')
    .map(char => croatianToAsciiMap[char] || char)
    .join('');

  // Generate the slug
  return normalizedTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
}


/**
 * Helper function to generate a full article slug
 * @param {string} title - Article title
 * @param {number|string} postId - Article ID
 * @returns {string} - URL slug in format "title-id"
 */
function generateArticleSlug(title, postId) {
  const titleSlug = generateTitleSlug(title);
  return `${titleSlug}-${postId}`;
}

/**
 * Fetch a list of articles
 * @param {object} options - Filtering options
 * @param {string} options.category - Article category
 * @param {number} options.limit - Number of articles to fetch
 * @param {number} options.page - Current page number
 * @returns {Promise<Array>} - Array of articles with slugs
 */
async function fetchArticles(options = {}) {
  const { category, limit = 12, page = 1 } = options;
  const offset = (page - 1) * limit;
  let url = `${SUPABASE_URL}/articles?select=*`;
  
  if (category) {
    url += `&category_name=eq.${encodeURIComponent(category)}`;
  }
  
  url += `&order=date_unparsed.desc&limit=${limit}&offset=${offset}`;
  console.log('Fetching articles with URL:', url);
  
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  
  const articles = await response.json();
  
  // Add slug to each article
  articles.forEach(article => {
    article.slug = generateArticleSlug(article.title, article.post_id);
  });
  
  console.log('Sample article structure:', articles[0]);
  console.log(`Fetched ${articles.length} articles for category: ${category}, page: ${page}`);
  return articles;
}

/**
 * Fetch a single article by category and slug
 * @param {string} category - Article category
 * @param {string} fullSlug - Full slug of the article in format "title-id"
 * @returns {Promise<Object>} - Article data
 */
async function fetchArticleBySlug(category, fullSlug) {
  // Extract post_id from the end of the slug
  const postId = fullSlug.split('-').pop();
  
  if (!postId || isNaN(postId)) {
    throw new Error('Invalid article URL');
  }

  const url = `${SUPABASE_URL}/articles?post_id=eq.${postId}&select=*`;
  console.log('Fetching article with URL:', url);
  
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!response.ok) {
    console.error('Failed to fetch article. Status:', response.status);
    throw new Error('Failed to fetch article');
  }
  
  const articles = await response.json();
  
  if (articles.length === 0) {
    console.error('No article found with post_id:', postId);
    throw new Error('Article not found');
  }

  const article = articles[0];
  
  // Validate the category
  if (article.category_name.toLowerCase() !== category.toLowerCase()) {
    console.error('Category mismatch. Expected:', category, 'Got:', article.category_name);
    throw new Error('Article not found in this category');
  }

  // Add the slug to the article
  article.slug = generateArticleSlug(article.title, article.post_id);
  
  return article;
}

/**
 * Fetch latest news for sidebar
 * @param {number} limit - Number of articles to fetch
 * @returns {Promise<Array>} - Array of latest articles
 */
async function fetchLatestNews(limit = 4) {
  const url = `${SUPABASE_URL}/articles?select=*&order=date_unparsed.desc&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch latest news');
  }
  
  const articles = await response.json();
  
  // Add slug to each article
  articles.forEach(article => {
    article.slug = generateArticleSlug(article.title, article.post_id);
  });
  
  return articles;
}

export { fetchArticles, fetchArticleBySlug, fetchLatestNews };