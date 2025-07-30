<!-- +layout.svelte -->
<script lang="ts">
  import '$lib/utils/scaling.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
  import { gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
  import { isWindows125Zoom } from '$lib/utils/detectZoom';

  // Define public routes that don't require authentication
  const publicPaths = ['/login', '/register'];
  $: isPublicRoute = publicPaths.includes($page?.url?.pathname || '/');

  let needsWindows125Viewport = false;
  onMount(() => {
    if (isWindows125Zoom()) {
      needsWindows125Viewport = true;
    }
  });

  // Function to calculate and set scale factor based on viewport width
  function updateScaleFactor() {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    let scaleFactor = 1; // Default for large screens
    
    if (width >= 1920) {
      scaleFactor = 1;
    } else if (width >= 1600) {
      scaleFactor = 0.85;
    } else if (width >= 1440) {
      scaleFactor = 0.75;
    } else if (width >= 1366) {
      scaleFactor = 0.7;
    } else if (width >= 1280) {
      scaleFactor = 0.65;
    } else {
      scaleFactor = 0.6;
    }
    
    document.documentElement.style.setProperty('--scale-factor', scaleFactor.toString());
    
    // Calculate and set minimum size protection
    // This ensures no calculated size goes below 18px
    const minSizePx = 18;
    const minSizeRem = minSizePx / 16; // Convert 18px to rem (assuming 16px base)
    document.documentElement.style.setProperty('--min-size-rem', minSizeRem.toString());
    
    console.log(`Scale factor updated: ${scaleFactor} for width: ${width}px`);
    console.log(`Minimum size protection: ${minSizeRem}rem (${minSizePx}px)`);
  }

  onMount(() => {
    // Load game availability configuration on app startup
    gameAvailabilityStore.loadGameConfigs();
    
    // Detect Windows 125% zoom and apply fix
    if (isWindows125Zoom()) {
      document.documentElement.classList.add('window125');
    }
    
    // Set initial scale factor immediately
    updateScaleFactor();
    
    // Update scale factor on window resize
    window.addEventListener('resize', updateScaleFactor);
    
    // Cleanup on destroy
    return () => {
      window.removeEventListener('resize', updateScaleFactor);
    };
  });

  // Set scale factor immediately when script loads (before onMount)
  if (typeof document !== 'undefined') {
    updateScaleFactor();
  }

  // Detect game route and set appropriate class
  $: {
    const pathname = $page?.url?.pathname || '';
    const gameMatch = pathname.match(/\/games\/game(\d+)/);
    const gameClass = gameMatch ? `game-${gameMatch[1]}` : '';
    
    if (typeof document !== 'undefined') {
      // Remove any existing game classes
      document.documentElement.classList.forEach(className => {
        if (className.startsWith('game-')) {
          document.documentElement.classList.remove(className);
        }
      });
      
      // Add new game class if we're on a game route
      if (gameClass) {
        document.documentElement.classList.add(gameClass);
      }
      
      // Update scale factor on route change (fixes SPA navigation issue)
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(updateScaleFactor, 0);
    }
  }
</script>

<svelte:head>
  {#if needsWindows125Viewport}
    <meta name="viewport" content="width=device-width, initial-scale=0.9, user-scalable=no">
  {:else}
    <meta name="viewport" content="width=device-width, initial-scale=1">
  {/if}
</svelte:head>

<AuthGuard publicRoute={isPublicRoute}>
  <slot />
</AuthGuard>

