
<script>
  import { onMount } from 'svelte';
  import { currentRoute } from './lib/router';
  import Nav from './components/Nav.svelte';
  import Hero from './components/Hero.svelte';
  import Svijet from './components/Svijet.svelte';
  import Regija from './components/Regija.svelte';
  import Magazin from './components/Magazin.svelte';
  import NumberedNews from './components/NumberedNews.svelte';
  import Zdravlje from './components/Zdravlje.svelte';
  import Lifestyle from './components/Lifestyle.svelte';
  import Footer from './components/Footer.svelte';
  import CategoryPage from './components/CategoryPage.svelte';
  import ArticlePage from './components/ArticlePage.svelte';
  import SEO from './components/SEO.svelte';

  import { fetchArticles } from './lib/api.js';
  import './styles/article.css';

  let featuredArticles = [];
  let categoryArticles = {
    svijet: [],
    lifestyle: [],
    'crna-kronika': []
  };
  let loading = true;
  let error = null;

  $: path = $currentRoute.path;
  $: pathParts = path.split('/').filter(Boolean);
  $: currentCategory = pathParts[0];
  $: articleSlug = pathParts[1];

  // SEO data based on current route
  $: seoData = {
    title: getSeoTitle(),
    description: getSeoDescription(),
    image: getSeoImage(),
    type: articleSlug ? 'article' : 'website',
    url: typeof window !== 'undefined' ? window.location.href : '',
    siteName: 'Your News Portal',
    twitterHandle: '@yournewsportal'
  };

  function getSeoTitle() {
    if (path === '/') {
      return 'Latest News - Your News Portal';
    } else if (currentCategory && !articleSlug) {
      return `${capitalizeFirstLetter(currentCategory)} News - Your News Portal`;
    } else if (articleSlug) {
      // The actual article title will be set by ArticlePage component
      return 'Loading...';
    }
    return 'Your News Portal';
  }

  function getSeoDescription() {
    if (path === '/') {
      return 'Stay updated with the latest news, breaking stories, and in-depth coverage across various categories.';
    } else if (currentCategory && !articleSlug) {
      return `Latest ${capitalizeFirstLetter(currentCategory)} news and updates - comprehensive coverage and analysis.`;
    }
    return 'Your trusted source for the latest news and updates.';
  }

  function getSeoImage() {
    if (featuredArticles.length > 0 && path === '/') {
      return featuredArticles[0].image;
    }
    return '/default-og-image.jpg'; // Your default OG image
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  onMount(async () => {
    try {
      // Fetch featured articles (latest 5)
      const latest = await fetchArticles({ limit: 5 });
      featuredArticles = latest.map(article => ({
        title: article.title,
        url: `/${article.category_name.toLowerCase()}/${article.slug}`,
        image: article.image_url,
        category: article.category_name,
        publishedAt: formatDate(article.date_unparsed)
      }));

      // Fetch articles for each category
      const [svijetArticles, lifestyleArticles, crnaKronikaArticles] = await Promise.all([
        fetchArticles({ category: 'Svijet', limit: 6 }),
        fetchArticles({ category: 'Lifestyle', limit: 6 }),
        fetchArticles({ category: 'Crna kronika', limit: 5 })
      ]);

      categoryArticles = {
        svijet: svijetArticles,
        lifestyle: lifestyleArticles,
        'crna-kronika': crnaKronikaArticles
      };

      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });

  function formatDate(dateString) {
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

<!-- Add default SEO that will be overridden by page-specific SEO -->
<SEO {...seoData} />

<Nav />
<main class="bg-gray-50">
  <div class="container mx-auto px-4">
    {#if path === '/'}
      {#if loading}
        <div class="animate-pulse space-y-8">
          <div class="h-96 bg-gray-200 rounded"></div>
          <div class="h-64 bg-gray-200 rounded"></div>
          <div class="h-48 bg-gray-200 rounded"></div>
        </div>
      {:else if error}
        <div class="text-red-500 p-4 text-center">
          {error}
        </div>
      {:else}
        <Hero news={featuredArticles} />
        <Svijet categoryName="Svijet" viewMoreLink="/svijet" />
        <Regija />
        <NumberedNews articles={categoryArticles['crna-kronika']} />
        <Lifestyle />
        <Magazin />
        <Zdravlje />
      {/if}
    {:else if currentCategory && !articleSlug}
      <CategoryPage category={currentCategory} />
    {:else if currentCategory && articleSlug}
      <ArticlePage category={currentCategory} slug={articleSlug} />
    {:else}
      <div class="text-center py-20">
        <h1 class="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
        <p class="mt-4 text-gray-600">The page you're looking for doesn't exist.</p>
      </div>
    {/if}
  </div>
</main>
<Footer />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  main {
    min-height: 100vh;
    padding: 2rem 0;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem 0;
    }
  }
</style>