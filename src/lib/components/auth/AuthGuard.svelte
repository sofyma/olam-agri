<!-- AuthGuard.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  
  export let publicRoute = false;
  
  let isLoading = true;
  
  onMount(async () => {
    // Check if user is authenticated
    const isAuth = $authStore.isAuthenticated;
    
    if (!isAuth && !publicRoute) {
      goto('/login');
    }
    isLoading = false;
  });
</script>

{#if isLoading}
  <div class="loading">Loading...</div>
{:else}
  <slot />
{/if}

<style>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--full-height, 100vh);
    font-size: 1.2rem;
    color: #666;
  }
</style> 