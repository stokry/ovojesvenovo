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
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 pt-6">
        <!-- Category and Time -->
        <div class="flex items-center text-sm mb-4">
          <a href="/{category.toLowerCase()}" class="text-primary hover:text-secondary font-medium">{article.category_name}</a>
          <span class="mx-2 text-gray-400">•</span>
          <time class="text-gray-500">prije {formatTimeAgo(article.date_unparsed)}</time>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>

        <!-- Summary -->
        {#if article.summary}
          <div class="text-lg text-gray-600 mb-6 leading-relaxed">
            {article.summary}
          </div>
        {/if}
      </div>

      <!-- Featured Image -->
      {#if article.image_url}
        <div class="mt-4 mb-6">
          <img 
            src={article.image_url} 
            alt={article.title}
            class="w-full h-auto"
          >
          {#if article.image_caption}
            <div class="px-6 mt-2">
              <figcaption class="text-sm text-gray-500 italic">{article.image_caption}</figcaption>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Article Content -->
      <div class="px-6 pb-6">
        <div class="article-content prose prose-lg max-w-none">
          {@html marked(article.content)}
        </div>
      </div>

      <!-- Back Link -->
      <div class="px-6 pb-6 border-t border-gray-100">
        <div class="pt-6">
          <a href="/{category.toLowerCase()}" class="inline-flex items-center text-primary hover:text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Natrag na {article.category_name}
          </a>
        </div>
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
