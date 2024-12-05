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
  
      if (diff < 60) {
        return 'just now';
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `in ${minutes} minutes`;
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `in ${hours} hours`;
      } else {
        return date.toLocaleDateString();
      }
    }
  
    onMount(async () => {
      try {
        // Fetch latest 10 articles (increased from 8 to accommodate 5 articles in right section)
        const latestArticles = await fetchArticles({ limit: 10 });
        articles = latestArticles.sort((a, b) => 
          new Date(b.date_unparsed) - new Date(a.date_unparsed)
        );
        loading = false;
      } catch (err) {
        error = err.message;
        loading = false;
      }
    });
  </script>
  
  <div class="container-auto">
    {#if loading}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
        <div class="lg:col-span-3 animate-pulse">
          <div class="bg-gray-200 h-64 rounded-sm mb-4"></div>
          <div class="bg-gray-200 h-64 rounded-sm"></div>
        </div>
        <div class="lg:col-span-6 animate-pulse">
          <div class="bg-gray-200 h-96 rounded-sm mb-4"></div>
          <div class="bg-gray-200 h-32 rounded-sm"></div>
        </div>
        <div class="lg:col-span-3 animate-pulse">
          <div class="bg-gray-200 space-y-4">
            {#each Array(5) as _}
              <div class="h-24 bg-gray-200 rounded-sm"></div>
            {/each}
          </div>
        </div>
      </div>
    {:else if error}
      <div class="text-red-500 p-4 text-center">{error}</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
        <!-- Left Section - Two Articles -->
        <div class="lg:col-span-3">
          {#each articles.slice(1, 3) as article}
            <article class="bg-white rounded-sm shadow-sm mb-4 md:mb-6 last:mb-0">
              <a href="/{article.category_name.toLowerCase()}/{article.slug}" class="group">
                {#if article.image_url}
                  <div class="aspect-w-16 aspect-h-9">
                    <img src={article.image_url} alt={article.title} class="w-full h-full object-cover">
                  </div>
                {/if}
                <div class="p-3 md:p-4">
                  <h3 class="font-semibold text-base md:text-lg mb-2 group-hover:text-primary line-clamp-2">
                    {article.title}
                  </h3>
                  <div class="flex items-center text-xs md:text-sm text-gray-500">
                    <span class="text-primary">{article.category_name}</span>
                    <span class="mx-2">•</span>
                    <time>{formatTimeAgo(article.date_unparsed)}</time>
                  </div>
                </div>
              </a>
            </article>
          {/each}
        </div>
  
        <!-- Center Section - Main Article + Two Bullets -->
        <div class="lg:col-span-6">
          {#if articles[0]}
            <article class="bg-white rounded-sm shadow-sm mb-4 md:mb-6">
              <a href="/{articles[0].category_name.toLowerCase()}/{articles[0].slug}" class="group">
                {#if articles[0].image_url}
                  <div class="aspect-w-16 aspect-h-9">
                    <img src={articles[0].image_url} alt={articles[0].title} class="w-full h-full object-cover">
                  </div>
                {/if}
                <div class="p-3 md:p-4">
                  <h2 class="font-bold text-xl md:text-2xl mb-2 md:mb-3 group-hover:text-primary">
                    {articles[0].title}
                  </h2>
                  {#if articles[0].summary}
                    <p class="text-gray-600 text-sm md:text-base mb-2 md:mb-3 line-clamp-2 md:line-clamp-3">
                      {articles[0].summary}
                    </p>
                  {/if}
                  <div class="flex items-center text-xs md:text-sm text-gray-500">
                    <span class="text-primary">{articles[0].category_name}</span>
                    <span class="mx-2">•</span>
                    <time>{formatTimeAgo(articles[0].date_unparsed)}</time>
                  </div>
                </div>
              </a>
            </article>
          {/if}
  
          <!-- Two Bullet Points -->
          <div class="bg-white rounded-sm shadow-sm p-3 md:p-4">
            {#each articles.slice(3, 5) as article}
              <article class="border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <a href="/{article.category_name.toLowerCase()}/{article.slug}" class="group">
                  <h3 class="font-semibold text-sm md:text-base group-hover:text-primary line-clamp-2">
                    {article.title}
                  </h3>
                  <div class="flex items-center text-xs md:text-sm text-gray-500 mt-2">
                    <span class="text-primary">{article.category_name}</span>
                    <span class="mx-2">•</span>
                    <time>{formatTimeAgo(article.date_unparsed)}</time>
                  </div>
                </a>
              </article>
            {/each}
          </div>
        </div>
  
        <!-- Right Section - Five Articles -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-sm shadow-sm p-3 md:p-4">
            {#each articles.slice(5, 10) as article} 
              <article class="border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <a href="/{article.category_name.toLowerCase()}/{article.slug}" class="group block">
                  <h3 class="font-semibold text-sm md:text-base mb-2 group-hover:text-primary line-clamp-2">
                    {article.title}
                  </h3>
                  <div class="flex items-center text-xs text-gray-500">
                    <span class="text-primary">{article.category_name}</span>
                    <span class="mx-2">•</span>
                    <time>{formatTimeAgo(article.date_unparsed)}</time>
                  </div>
                </a>
              </article>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>