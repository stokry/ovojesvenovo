<script>
    import { onMount } from 'svelte';
    import { fetchArticles } from '../lib/api.js';
  
    let articles = [];
    let loading = true;
    let error = null;
  
    function formatTimeAgo(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);
      
      if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} minutes ago`;
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} hours ago`;
      } else {
        const days = Math.floor(diff / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      }
    }
  
    onMount(async () => {
      try {
        const fetchedArticles = await fetchArticles({ 
          category: 'Regija',
          limit: 6 
        });
        articles = fetchedArticles.sort((a, b) => 
          new Date(b.date_unparsed) - new Date(a.date_unparsed)
        );
        loading = false;
      } catch (err) {
        error = err.message;
        loading = false;
      }
    });
  </script>
  
  <div class="mt-8 md:mt-12">
    <!-- Category Header -->
    <div class="flex items-center mb-4 md:mb-8 gap-4 md:gap-6">
      <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-primary shrink-0">Regija</h2>
      <div class="h-0.5 bg-gray-200 w-full"></div>
    </div>
  
    {#if loading}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4">
        {#each Array(6) as _}
          <div class="animate-pulse bg-white rounded-sm shadow-sm">
            <div class="aspect-w-16 aspect-h-9 bg-gray-200"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else if error}
      <div class="text-red-500 p-4 text-center">{error}</div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4">
        {#each articles as article}
          <article class="bg-white rounded-sm shadow-sm">
            <a href="/regija/{article.slug}" class="group block">
              {#if article.image_url}
                <div class="aspect-w-16 aspect-h-9">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    class="w-full h-full object-cover"
                    loading="lazy"
                  >
                </div>
              {/if}
              <div class="p-3 md:p-4">
                <h3 class="text-base md:text-lg font-semibold mb-2 group-hover:text-primary line-clamp-2">
                  {article.title}
                </h3>
                {#if article.summary}
                  <p class="text-gray-600 mb-2 text-xs md:text-sm line-clamp-2">
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
  
      <!-- View More Link -->
      <div class="flex justify-end mt-4 md:mt-6">
        <a 
          href="/regija" 
          class="inline-flex items-center text-primary hover:text-secondary font-semibold text-sm md:text-base"
        >
          <span>Vidi više</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 md:h-5 md:w-5 ml-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fill-rule="evenodd" 
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </div>
    {/if}
  </div>