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
          category: 'Crna kronika',
          limit: 5 
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
  
  <div class="mt-12">
    <!-- Category Header -->
    <div class="flex items-center mb-8 gap-6">
      <h2 class="text-3xl font-bold text-primary shrink-0">Crna kronika</h2>
      <div class="h-0.5 bg-gray-200 w-full"></div>
    </div>
  
    {#if loading}
      <div class="mb-4 space-y-6">
        {#each Array(5) as _, i}
          <div class="flex items-start gap-4 animate-pulse">
            <div class="text-4xl font-bold text-gray-200 leading-none">{i + 1}</div>
            <div class="flex-1">
              <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else if error}
      <div class="text-red-500 p-4 text-center">{error}</div>
    {:else}
      <div class="mb-4">
        {#each articles as article, i}
          <div class="flex items-start gap-4 mb-6 last:mb-0">
            <div class="text-4xl font-bold text-gray-200 leading-none">{i + 1}</div>
            <a href="/crna-kronika/{article.slug}" class="group flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-lg md:text-xl group-hover:text-primary">
                  {article.title}
                </h3>
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-2">
                <time>{formatTimeAgo(article.date_unparsed)}</time>
                <span class="mx-2">•</span>
                <span>{article.category_name}</span>
              </div>
            </a>
          </div>
        {/each}
      </div>
  
      <!-- More News Button -->
      <div class="flex justify-end">
        <a 
          href="/crna-kronika" 
          class="inline-flex items-center text-primary hover:text-secondary font-semibold"
        >
          <span>Više iz kategorije Crna kronika</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 ml-2" 
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