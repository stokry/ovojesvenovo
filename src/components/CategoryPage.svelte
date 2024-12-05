<script>
    import { onMount } from 'svelte';
    import { fetchArticles } from '../lib/api.js';
  
    export let category;
  
    let articles = [];
    let loading = true;
    let error = null;
    let page = 1;
    let articlesPerPage = 12;
    let loadingMore = false;
  
    $: categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
    $: {
      if (category) {
        console.log(`Category changed to: ${category}`);
        page = 1;
        articles = [];
        loadArticles();
      }
    }
  
    onMount(async () => {
      await loadArticles();
    });
  
    async function loadArticles() {
      try {
        loading = true;
        console.log(`Fetching articles for page ${page}`);
        const fetchedArticles = await fetchArticles({ category: categoryTitle, limit: articlesPerPage, page });
        console.log(`Fetched ${fetchedArticles.length} articles`);
        
        if (page === 1) {
          articles = fetchedArticles;
        } else {
          articles = [...articles, ...fetchedArticles];
        }
        
        console.log(`Total articles: ${articles.length}`);
        loading = false;
      } catch (err) {
        console.error('Error fetching articles:', err);
        error = err.message;
        loading = false;
      }
    }
  
    async function loadMore() {
      if (!loadingMore) {
        loadingMore = true;
        page += 1;
        console.log(`Loading more articles, page: ${page}`);
        await loadArticles();
        loadingMore = false;
      }
    }
  
    function formatTimeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) {
        return `${minutes} minutes ago`;
      }
      
      const hours = Math.floor(diff / 3600000);
      if (hours < 24) {
        return `${hours} hours ago`;
      }
      
      return date.toLocaleDateString();
    }
  </script>
  
  <div class="container-auto">
    <!-- Breadcrumb -->
    <div class="bg-white p-3 md:p-4 rounded-sm shadow-sm mb-4 md:mb-6">
      <div class="flex items-center text-sm">
        <a href="/" class="text-primary hover:text-secondary">Home</a>
        <span class="mx-2 text-gray-500">/</span>
        <span class="text-gray-600">{categoryTitle}</span>
      </div>
    </div>
  
    <!-- Category Header -->
    <div class="flex items-center mb-6 md:mb-8 gap-4 md:gap-6">
      <h1 class="text-2xl md:text-3xl font-bold text-primary shrink-0">{categoryTitle}</h1>
      <div class="h-0.5 bg-gray-200 w-full"></div>
    </div>
  
    {#if loading && articles.length === 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {#each Array(6) as _}
          <div class="bg-white rounded-sm shadow-sm animate-pulse">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else if error}
      <div class="text-red-500 p-4 text-center">{error}</div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" id="articles-container">
        {#each articles as article}
          <article class="bg-white rounded-sm shadow-sm">
           <a href="/{category.toLowerCase()}/{article.slug}" class="group block">
              {#if article.image_url}
                <div class="aspect-w-16 aspect-h-9">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    loading="lazy"
                    class="w-full h-full object-cover"
                  >
                </div>
              {/if}
              
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 group-hover:text-primary line-clamp-2">
                  {article.title}
                </h3>
                {#if article.summary}
                  <p class="text-gray-600 mb-2 text-sm line-clamp-2">
                    {article.summary}
                  </p>
                {/if}
                <div class="flex items-center text-xs text-gray-500">
                  <time>{formatTimeAgo(article.date_unparsed)}</time>
                  <span class="mx-2">•</span>
                  <span>{article.category_name}</span>
                </div>
              </div>
            </a>
          </article>
        {/each}
      </div>
  
      {#if articles.length >= articlesPerPage && !loading && !error}
        <div class="flex justify-center mt-8">
          <button 
            class="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      {/if}
    {/if}
  </div>
  
  