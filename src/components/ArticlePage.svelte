<script>
  import { onMount } from 'svelte';
  import { fetchArticleBySlug } from '../lib/api.js';
  import { navigate } from '../lib/router.js';

  export let category;
  export let slug;

  let article = null;
  let loading = true;
  let error = null;

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
  <div class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
{:else if error}
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold text-red-600 mb-4">Greška</h1>
    <p class="text-gray-600">{error}</p>
    <button 
      class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
      on:click={() => navigate('/')}>
      Natrag na naslovnicu
    </button>
  </div>
{:else if article}
  <article class="max-w-4xl mx-auto px-4 py-8">
    <header class="mb-8">
      <div class="text-sm text-gray-500 mb-2">
        <a href="/{category.toLowerCase()}" class="text-primary hover:text-secondary">
          {article.category_name}
        </a>
        <span class="mx-2">•</span>
        <time datetime={article.date_unparsed}>{formatTimeAgo(article.date_unparsed)}</time>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
      {#if article.subtitle}
        <p class="text-xl text-gray-600 mb-6">{article.subtitle}</p>
      {/if}
    </header>

    {#if article.image_url}
      <div class="mb-8">
        <img
          src={article.image_url}
          alt={article.title}
          class="w-full h-auto rounded-lg shadow-lg"
        />
        {#if article.image_caption}
          <p class="text-sm text-gray-500 mt-2 text-center">{article.image_caption}</p>
        {/if}
      </div>
    {/if}

    <div class="prose prose-lg max-w-none">
      {@html article.content}
    </div>

    <div class="mt-8 pt-8 border-t">
      <a href="/{category.toLowerCase()}" class="inline-flex items-center text-primary hover:text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Natrag na {article.category_name}
      </a>
    </div>
  </article>
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
