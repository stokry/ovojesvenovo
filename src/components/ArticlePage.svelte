<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import { fetchArticleBySlug, fetchLatestNews } from '../lib/api.js';
  import { navigate } from '../lib/router.js';

  export let category;
  export let slug;

  let article = null;
  let latestNews = [];
  let loading = true;
  let error = null;

  // Configure marked to only allow specific HTML tags
  const renderer = new marked.Renderer();
  marked.setOptions({
    renderer: renderer,
    headerIds: false,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: false
  });

  onMount(async () => {
    try {
      const [articleData, latestNewsData] = await Promise.all([
        fetchArticleBySlug(category, slug),
        fetchLatestNews(4)
      ]);
      article = articleData;
      latestNews = latestNewsData.filter(news => news.post_id !== article.post_id);
      loading = false;
    } catch (err) {
      console.error('Error fetching data:', err);
      error = err.message === 'Article not found in this category' 
        ? 'Članak nije pronađen u ovoj kategoriji. Možda je premješten u drugu kategoriju.'
        : err.message === 'Invalid article URL'
        ? 'Nevažeći URL članka.'
        : 'Članak nije pronađen.';
      loading = false;
    }
  });

  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `prije ${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minuta'}`;
    }
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `prije ${diffHours} ${diffHours === 1 ? 'sat' : 'sati'}`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `prije ${diffDays} ${diffDays === 1 ? 'dan' : 'dana'}`;
    }
    
    return date.toLocaleDateString('hr-HR');
  }
</script>

{#if loading}
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-grow lg:w-3/4">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 w-1/4 mb-4"></div>
            <div class="h-8 bg-gray-200 w-3/4 mb-6"></div>
            <div class="space-y-4">
              <div class="h-4 bg-gray-200"></div>
              <div class="h-4 bg-gray-200 w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
      <aside class="lg:w-1/4">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 w-1/2 mb-4"></div>
            <div class="space-y-4">
              {#each Array(4) as _}
                <div class="h-4 bg-gray-200"></div>
              {/each}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
{:else if error}
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-red-50 border-l-4 border-red-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else if article}
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Main Article -->
      <div class="flex-grow lg:w-3/4">
        <article class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-4 md:p-6">
            <!-- Category and Time -->
            <div class="flex items-center text-sm mb-4">
              <a href="/{category.toLowerCase()}" class="text-primary hover:text-secondary font-medium">{article.category_name}</a>
              <span class="mx-2 text-gray-400">•</span>
              <time class="text-gray-500">{formatTimeAgo(article.date_unparsed)}</time>
            </div>

            <!-- Title -->
            <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{article.title}</h1>

            <!-- Summary -->
            {#if article.summary}
              <p class="text-lg text-gray-600 mb-6">{article.summary}</p>
            {/if}

            <!-- Featured Image -->
            {#if article.image_url}
              <div class="mb-6">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  class="w-full rounded-sm"
                >
                {#if article.image_caption}
                  <figcaption class="mt-2 text-sm text-gray-500 italic">{article.image_caption}</figcaption>
                {/if}
              </div>
            {/if}

            <!-- Article Content -->
            <div class="article-content prose max-w-none">
              {@html marked(article.content)}
            </div>

           <!-- Keywords -->
            {#if article.keywords && article.keywords.length > 0}
            <div class="mt-8 pt-8 border-t">
              <div class="flex flex-wrap gap-2">
                {#each article.keywords as keyword}
                  <a href="/search?q={encodeURIComponent(keyword)}" 
                    class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    {keyword}
                  </a>
                {/each}
              </div>
            </div>
            {/if}

         
          </div>
        </article>
      </div>

      <!-- Sidebar -->
      <aside class="lg:w-1/4">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h2 class="text-xl font-bold mb-4 text-primary">Zadnje novosti</h2>
          <div class="space-y-4">
            {#each latestNews as news}
              <article class="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <a class="group block" href="/{news.category_name.toLowerCase()}/{news.slug}">
                  <h3 class="font-semibold text-base mb-2 group-hover:text-primary line-clamp-2">
                    {news.title}
                  </h3>
                  <div class="flex items-center text-xs text-gray-500">
                    <span class="text-primary">{news.category_name}</span>
                    <span class="mx-2">•</span>
                    <time>{formatTimeAgo(news.date_unparsed)}</time>
                  </div>
                </a>
              </article>
            {/each}
          </div>
        </div>
      </aside>
    </div>
  </div>
{/if}

<style>
  :global(.prose) {
    @apply text-gray-800;
  }
  :global(.prose a) {
    @apply text-primary hover:text-secondary no-underline;
  }
  :global(.prose img) {
    @apply rounded-lg shadow-lg mx-auto;
  }
  :global(.prose h2) {
    @apply text-2xl font-bold mt-8 mb-4;
  }
  :global(.prose p) {
    @apply mb-4;
  }
  :global(.prose ul) {
    @apply list-disc list-inside mb-4;
  }
  :global(.prose ol) {
    @apply list-decimal list-inside mb-4;
  }
  :global(.prose blockquote) {
    @apply border-l-4 border-primary pl-4 italic my-4;
  }
</style>
