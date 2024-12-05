<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import { fetchArticleBySlug } from '../lib/api.js';
  import { navigate } from '../lib/router.js';

  export let category;
  export let slug;

  let article = null;
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
      article = await fetchArticleBySlug(category, slug);
      loading = false;
    } catch (err) {
      console.error('Error fetching article:', err);
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
    const diff = Math.floor((now - date) / 1000); // difference in seconds

    if (diff < 60) return 'prije par sekundi';
    if (diff < 3600) return `prije ${Math.floor(diff / 60)} minuta`;
    if (diff < 86400) return `prije ${Math.floor(diff / 3600)} sati`;
    if (diff < 2592000) return `prije ${Math.floor(diff / 86400)} dana`;
    
    // If more than 30 days, show the date
    return date.toLocaleDateString('hr-HR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

{#if loading}
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div class="aspect-w-16 aspect-h-9 mb-8">
          <div class="w-full h-full bg-gray-200 rounded"></div>
        </div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
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
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="flex items-center text-sm text-gray-500 mb-6">
        <a href="/" class="hover:text-primary">Home</a>
        <span class="mx-2">/</span>
        <a href="/{category.toLowerCase()}" class="hover:text-primary">{article.category_name}</a>
      </div>

      <!-- Article Header -->
      <header class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        {#if article.subtitle}
          <p class="text-xl text-gray-600 mb-4">{article.subtitle}</p>
        {/if}
        <div class="flex items-center text-sm text-gray-500">
          <time datetime={article.date_unparsed}>{formatTimeAgo(article.date_unparsed)}</time>
          <span class="mx-2">•</span>
          <span>{article.category_name}</span>
        </div>
      </header>

      <!-- Featured Image -->
      {#if article.image_url}
        <figure class="mb-8">
          <img 
            src={article.image_url} 
            alt={article.title}
            class="w-full h-auto rounded-lg shadow-lg"
          >
          {#if article.image_caption}
            <figcaption class="mt-2 text-sm text-gray-500 text-center">{article.image_caption}</figcaption>
          {/if}
        </figure>
      {/if}

      <!-- Article Content -->
      <article class="article-content prose prose-lg max-w-none">
        {@html marked(article.content)}
      </article>

      <div class="mt-8 pt-8 border-t">
        <a href="/{category.toLowerCase()}" class="inline-flex items-center text-primary hover:text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Natrag na {article.category_name}
        </a>
      </div>
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
