<script>
    import { navigate } from '../lib/router.js';
    import { onMount } from 'svelte';
    let isMenuOpen = false;
    let innerWidth;
  
    const navigationItems = [
      { href: '/vijesti', text: 'Vijesti', position: 'left' },
      { href: '/svijet', text: 'Svijet', position: 'left' },
      { href: '/regija', text: 'Regija', position: 'left' },
      { href: '/crna-kronika', text: 'Crna kronika', position: 'left' },
      { href: '/sport', text: 'Sport', position: 'right' },
      { href: '/lifestyle', text: 'Lifestyle', position: 'right' },
      { href: '/magazin', text: 'Magazin', position: 'right' },
      { href: '/zdravlje', text: 'Zdravlje', position: 'right' }
    ];
  
    $: leftNavItems = navigationItems.filter(item => item.position === 'left');
    $: rightNavItems = navigationItems.filter(item => item.position === 'right');
  
    function handleNavClick(href, event) {
        event.preventDefault();
        navigate(href);
        if (isMenuOpen) {
          toggleMobileMenu();
        }
      }
    
      function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
          document.body.classList.add('overflow-hidden');
        } else {
          document.body.classList.remove('overflow-hidden');
        }
      }
  
    function handleClickOutside(event) {
      if (isMenuOpen) {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuButton = document.getElementById('menuButton');
        if (mobileMenu && 
            menuButton && 
            !mobileMenu.contains(event.target) && 
            !menuButton.contains(event.target)) {
          toggleMobileMenu();
        }
      }
    }

  
    $: if (innerWidth >= 1024 && isMenuOpen) {
      isMenuOpen = false;
      document.body.classList.remove('overflow-hidden');
    }
  
    onMount(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.body.classList.remove('overflow-hidden');
      };
    });
  </script>
  
  <svelte:window bind:innerWidth={innerWidth} />
  
  <header class="border-b bg-white sticky top-0 z-50">
    <div class="max-w-[1200px] mx-auto px-4">
      <!-- Mobile Nav -->
      <nav class="lg:hidden flex justify-between items-center h-16">
        <a href="/" class="text-xl font-bold flex items-center">
          <span class="text-primary">news</span>
          <span class="text-secondary">.info</span>
        </a>
  
        <button 
          class="text-gray-600 hover:text-primary p-2 focus:outline-none" 
          aria-label="Toggle menu"
          id="menuButton"
          aria-expanded={isMenuOpen}
          on:click|stopPropagation={toggleMobileMenu}
        >
          {#if !isMenuOpen}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          {/if}
        </button>
      </nav>
  
      <!-- Mobile Menu -->
      {#if isMenuOpen}
        <div 
          id="mobileMenu" 
          class="lg:hidden bg-white"
          on:click|stopPropagation
        >
          <div class="py-4 border-t">
            <div class="grid grid-cols-2 gap-y-3 gap-x-4">
              {#each navigationItems as item}
                <a 
                  href={item.href} 
                  class="text-gray-600 hover:text-primary py-2"
                  on:click={handleNavClick}
                >
                  {item.text}
                </a>
              {/each}
            </div>
          </div>
        </div>
      {/if}
  
      <!-- Desktop Nav -->
      <nav class="hidden lg:flex justify-between items-center h-16">
        <div class="flex space-x-6 items-center flex-1">
          {#each leftNavItems as item}
            <a 
              href={item.href} 
              class="text-gray-600 hover:text-primary"
              on:click|preventDefault={(e) => handleNavClick(item.href, e)}
            >
              {item.text}
            </a>
          {/each}
        </div>
  
        <div class="flex justify-center flex-1">
          <a 
            href="/" 
            class="text-2xl font-bold flex items-center"
            on:click|preventDefault={() => navigate('/')}
          >
            <span class="text-primary">news</span>
            <span class="text-secondary">.info</span>
          </a>
        </div>
  
        <div class="flex space-x-6 items-center justify-end flex-1">
          {#each rightNavItems as item}
            <a 
              href={item.href} 
              class="text-gray-600 hover:text-primary"
              on:click|preventDefault={(e) => handleNavClick(item.href, e)}
            >
              {item.text}
            </a>
          {/each}
        </div>
      </nav>
    </div>
  </header>