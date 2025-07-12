<!-- +layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
  import { gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
  import { isWindows125Zoom } from '$lib/utils/detectZoom';

  // Define public routes that don't require authentication
  const publicPaths = ['/login', '/register'];
  $: isPublicRoute = publicPaths.includes($page?.url?.pathname || '/');

  onMount(async () => {
    // Load game availability configuration on app startup
    await gameAvailabilityStore.loadGameConfigs();
    
    // Detect Windows 125% zoom and apply fix
    if (isWindows125Zoom()) {
      document.documentElement.classList.add('window125');
    }
  });

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
    }
  }
</script>

<AuthGuard publicRoute={isPublicRoute}>
  <slot />
</AuthGuard>

