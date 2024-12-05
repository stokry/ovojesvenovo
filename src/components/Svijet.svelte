<script>
    import { onMount } from 'svelte';
    import { fetchArticles } from '../lib/api.js';
  
    export let categoryName = 'Svijet';
    export let viewMoreLink = '/svijet';
    
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
        const fetchedArticles = await fetchArticles({ 
          category: categoryName,
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
      <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-primary shrink-0">{categoryName}</h2>
      <div class="h-0.5 bg-gray-200 w-full"></div>
    </div>
  
    {#if loading}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div class="lg:col-span-8 animate-pulse">
          <div class="bg-gray-200 h-96 rounded-sm mb-4"></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div class="bg-gray-200 h-64 rounded-sm"></div>
            <div class="bg-gray-200 h-64 rounded-sm"></div>
            <div class="bg-gray-200 h-64 rounded-sm"></div>
          </div>
        </div>
        <div class="lg:col-span-4 animate-pulse">
          <div class="bg-gray-200 h-64 rounded-sm mb-4"></div>
          <div class="bg-gray-200 h-32 rounded-sm"></div>
        </div>
      </div>
    {:else if error}
      <div class="text-red-500 p-4 text-center">{error}</div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <!-- Left Section -->
        <div class="lg:col-span-8">
          <!-- Main Article -->
          {#if articles[0]}
            <article class="bg-white rounded-sm shadow-sm mb-4 md:mb-6">
              <a href="/{categoryName.toLowerCase()}/{articles[0].slug}" class="group block">
                <div class="flex flex-col md:grid md:grid-cols-12 md:gap-6">
                  <div class="md:col-span-5 md:order-2">
                    {#if articles[0].image_url}
                      <div class="aspect-w-16 aspect-h-9 md:h-full">
                        <img src={articles[0].image_url} alt={articles[0].title} class="w-full h-full object-cover">
                      </div>
                    {/if}
                  </div>
                  <div class="p-4 md:p-6 md:col-span-7 md:order-1">
                    <h3 class="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 leading-tight group-hover:text-primary">
                      {articles[0].title}
                    </h3>
                    {#if articles[0].summary}
                      <p class="text-gray-600 mb-3 md:mb-4 text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-4">
                        {articles[0].summary}
                      </p>
                    {/if}
                    <div class="flex items-center text-xs md:text-sm text-gray-500">
                      <time>{formatTimeAgo(articles[0].date_unparsed)}</time>
                      <span class="mx-2">•</span>
                      <span>{articles[0].category_name}</span>
                    </div>
                  </div>
                </div>
              </a>
            </article>
          {/if}
  
          <!-- Three Articles Below -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {#each articles.slice(1, 4) as article}
              <article class="bg-white rounded-sm shadow-sm">
                <a href="/{categoryName.toLowerCase()}/{article.slug}" class="group block">
                  {#if article.image_url}
                    <div class="aspect-w-16 aspect-h-9">
                      <img src={article.image_url} alt={article.title} class="w-full h-full object-cover">
                    </div>
                  {/if}
                  <div class="p-3 md:p-4">
                    <h3 class="text-sm md:text-base font-semibold mb-2 group-hover:text-primary line-clamp-2">
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
        </div>
  
        <!-- Right Section -->
        <div class="lg:col-span-4">
          {#if articles[4]}
            <article class="bg-white rounded-sm shadow-sm mb-4 md:mb-6">
              <a href="/{categoryName.toLowerCase()}/{articles[4].slug}" class="group block">
                {#if articles[4].image_url}
                  <div class="aspect-w-16 aspect-h-9">
                    <img src={articles[4].image_url} alt={articles[4].title} class="w-full h-full object-cover">
                  </div>
                {/if}
                <div class="p-3 md:p-4">
                  <h3 class="text-sm md:text-base font-semibold mb-2 group-hover:text-primary line-clamp-2">
                    {articles[4].title}
                  </h3>
                  {#if articles[4].summary}
                    <p class="text-gray-600 mb-2 text-xs md:text-sm line-clamp-2">
                      {articles[4].summary}
                    </p>
                  {/if}
                  <div class="flex items-center text-xs text-gray-500">
                    <time>{formatTimeAgo(articles[4].date_unparsed)}</time>
                    <span class="mx-2">•</span>
                    <span>{articles[4].category_name}</span>
                  </div>
                </div>
              </a>
            </article>
          {/if}
  
          <!-- Articles Without Images -->
          <div class="bg-white rounded-sm shadow-sm p-3 md:p-4">
            {#each articles.slice(5) as article}
              <article class="border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <a href="/{categoryName.toLowerCase()}/{article.slug}" class="group block">
                  <h3 class="text-sm md:text-base font-semibold mb-2 group-hover:text-primary line-clamp-2">
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
                </a>
              </article>
            {/each}
          </div>
        </div>
      </div>
  
      <!-- View More Link -->
      <div class="flex justify-end mt-4 md:mt-6">
        <a href={viewMoreLink} 
           class="inline-flex items-center text-primary hover:text-secondary font-semibold text-sm md:text-base">
          <span>Vidi više</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
          </svg>
        </a>
      </div>
    {/if}
  </div>