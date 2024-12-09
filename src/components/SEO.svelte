<script>
  import { onMount } from 'svelte';

  // Props for SEO metadata
  export let title = '';
  export let description = '';
  export let keywords = '';
  export let image = '';
  export let type = 'website';
  export let url = '';
  export let author = '';
  export let siteName = 'Your Site Name';
  export let twitterHandle = '@yourhandle';
  export let publishedTime = '';
  export let modifiedTime = '';
  export let articleSection = '';

  // Function to safely remove existing meta tags
  function removeMetaTag(selector) {
    const existingTag = document.querySelector(selector);
    if (existingTag) {
      existingTag.remove();
    }
  }

  // Function to create or update meta tag
  function setMetaTag(attributes) {
    const selector = attributes.property 
      ? `meta[property="${attributes.property}"]`
      : `meta[name="${attributes.name}"]`;
    
    let tag = document.querySelector(selector);
    
    if (!tag) {
      tag = document.createElement('meta');
      document.head.appendChild(tag);
    }

    Object.entries(attributes).forEach(([key, value]) => {
      tag.setAttribute(key, value);
    });
  }

  // Function to update canonical URL
  function updateCanonicalUrl() {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  // Function to update meta tags
  function updateMetaTags() {
    if (typeof window === 'undefined') return;

    // Update document title
    document.title = title ? `${title} | ${siteName}` : siteName;

    // Update canonical URL
    if (url) {
      updateCanonicalUrl();
    }

    // Basic meta tags
    setMetaTag({ name: 'description', content: description });
    if (keywords) {
      setMetaTag({ name: 'keywords', content: keywords });
    }

    // Open Graph meta tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:type': type,
      'og:url': url,
      'og:image': image,
      'og:site_name': siteName
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      if (content) {
        setMetaTag({ property, content });
      }
    });

    // Article specific meta tags
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag({ property: 'article:published_time', content: publishedTime });
      }
      if (modifiedTime) {
        setMetaTag({ property: 'article:modified_time', content: modifiedTime });
      }
      if (articleSection) {
        setMetaTag({ property: 'article:section', content: articleSection });
      }
      if (author) {
        setMetaTag({ property: 'article:author', content: author });
      }
    }

    // Twitter Card meta tags
    const twitterTags = {
      'twitter:card': image ? 'summary_large_image' : 'summary',
      'twitter:site': twitterHandle,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image,
      'twitter:creator': author || twitterHandle
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (content) {
        setMetaTag({ name, content });
      }
    });

    // Schema.org JSON-LD
    let schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = type === 'article' ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: image ? [image] : [],
      author: author ? {
        '@type': 'Person',
        name: author
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        url: new URL(url).origin
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      }
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: description,
      publisher: {
        '@type': 'Organization',
        name: siteName
      }
    };

    schemaScript.textContent = JSON.stringify(schemaData);
  }

  // Update meta tags when props change
  $: {
    if (typeof window !== 'undefined') {
      updateMetaTags();
    }
  }

  // Initial update on mount
  onMount(() => {
    updateMetaTags();

    // Cleanup function
    return () => {
      // Remove schema script on component unmount
      const schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  });
</script>