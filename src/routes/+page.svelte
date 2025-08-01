<!-- +page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { gameAvailabilityStore, game1Availability, game2Availability, game3Availability, game4Availability, game5Availability, game6Availability } from '$lib/stores/gameAvailabilityStore';
  import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let timeUntilGame1: number | null = null;
  let timeUntilGame2: number | null = null;
  let timeUntilGame3: number | null = null;
  let timeUntilGame4: number | null = null;
  let timeUntilGame5: number | null = null;
  let timeUntilGame6: number | null = null;

  // Reactive statement to update dates when store changes
  $: game1Date = $gameAvailabilityStore.isLoading ? { text: '', type: 'none' } : formatAvailableDate('game1');
  $: game2Date = $gameAvailabilityStore.isLoading ? { text: '', type: 'none' } : formatAvailableDate('game2');
  $: game3Date = $gameAvailabilityStore.isLoading ? { text: '', type: 'none' } : formatAvailableDate('game3');
  $: game4Date = $gameAvailabilityStore.isLoading ? { text: '', type: 'none' } : formatAvailableDate('game4');
  $: game5Date = $gameAvailabilityStore.isLoading ? { text: '', type: 'none' } : formatAvailableDate('game5');
  $: game6Date = $gameAvailabilityStore.isLoading ? { text: '', type: 'none' } : formatAvailableDate('game6');

  onMount(() => {
    // Load game configs and then set up the rest
    gameAvailabilityStore.loadGameConfigs().then(() => {
      // Initial check after data is loaded
      timeUntilGame1 = gameAvailabilityStore.getTimeUntilAvailable('game1');
      timeUntilGame2 = gameAvailabilityStore.getTimeUntilAvailable('game2');
      timeUntilGame3 = gameAvailabilityStore.getTimeUntilAvailable('game3');
      timeUntilGame4 = gameAvailabilityStore.getTimeUntilAvailable('game4');
      timeUntilGame5 = gameAvailabilityStore.getTimeUntilAvailable('game5');
      timeUntilGame6 = gameAvailabilityStore.getTimeUntilAvailable('game6');
    });
    
    // Set up interval to refresh availability every minute
    const interval = setInterval(() => {
      gameAvailabilityStore.refreshAvailability();
      timeUntilGame1 = gameAvailabilityStore.getTimeUntilAvailable('game1');
      timeUntilGame2 = gameAvailabilityStore.getTimeUntilAvailable('game2');
      timeUntilGame3 = gameAvailabilityStore.getTimeUntilAvailable('game3');
      timeUntilGame4 = gameAvailabilityStore.getTimeUntilAvailable('game4');
      timeUntilGame5 = gameAvailabilityStore.getTimeUntilAvailable('game5');
      timeUntilGame6 = gameAvailabilityStore.getTimeUntilAvailable('game6');
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  });

  function formatTimeUntil(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  function formatAvailableDate(gameId: 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6'): { text: string; type: 'from' | 'until' | 'none' } {
    const config = gameAvailabilityStore.getGameConfig(gameId);
    console.log(`formatAvailableDate for ${gameId}:`, config);
    
    if (!config) {
      console.warn(`No config found for ${gameId}`);
      return { text: 'Coming Soon', type: 'none' };
    }
    
    const now = new Date();
    
    // Check if availableUntil exists and is in the future
    if (config.availableUntil) {
      try {
        const untilDate = new Date(config.availableUntil);
        if (!isNaN(untilDate.getTime()) && untilDate > now) {
          const month = untilDate.toLocaleDateString('en-US', { month: 'short' });
          const day = untilDate.getDate();
          const result = `${month} ${day}`;
          console.log(`Formatted until date for ${gameId}:`, result);
          return { text: result, type: 'until' };
        }
      } catch (error) {
        console.error('Error formatting until date for', gameId, ':', error);
      }
    }
    
    // Check if availableFrom exists and is in the future
    if (config.availableFrom) {
      try {
        const fromDate = new Date(config.availableFrom);
        if (!isNaN(fromDate.getTime()) && fromDate > now) {
          const month = fromDate.toLocaleDateString('en-US', { month: 'short' });
          const day = fromDate.getDate();
          const result = `${month} ${day}`;
          console.log(`Formatted from date for ${gameId}:`, result);
          return { text: result, type: 'from' };
        }
      } catch (error) {
        console.error('Error formatting from date for', gameId, ':', error);
      }
    }
    
    console.warn(`No valid future dates for ${gameId}`);
    return { text: '', type: 'none' };
  }
</script>

<div class="container">
  <header class="header">
    <div class="wrapper">
      <div class="row">
        <div class="column">
          {#if $authStore.isAuthenticated}
            <a href="/" class="logo-link">
              <Game1Logo />
            </a>
          {:else}
            <Game1Logo />
          {/if}
        </div>

        <div class="column">
          <nav class="navigation">
            <ul class="navigation-list">
              <li class="navigation-item">
                <a class="navigation-link" href="/terms">Terms</a>
              </li>

              <li class="navigation-item">
                <a class="navigation-link btn" href="/ranking">Ranking</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
  
  <main class="content">
    <!-- First Section -->
    <section class="hero-section">
      <div class="hero-container">
        <h1 class="hero-title">Do You Have What It Takes to Be a Brand Hero?</h1>
        <p class="hero-paragraph">A new learning adventure begins at Olam Agri and <strong>you are the protagonist</strong>.</p>
        <p class="hero-paragraph"><strong>Welcome to the Brand Heroes Challenge</strong>, a thrilling journey where you'll put your knowledge to the test and prove your power as a true hero of our brand.</p>
      </div>
    </section>

    <!-- Second Section -->
    <section class="map-section">
      <div class="map-container">
        <h2 class="map-title">We're Looking for the 3 Brand Heroes of Each Region</h2>
        <p class="map-paragraph"><strong>The 12 top players</strong> from Olam Agri's world will earn the title and become Brand Heroes</p>
        <p class="map-paragraph"><strong>Are you ready to claim your place?</strong></p>
        <img class="map-image" src="/images/site-map.png" alt="Site Map">
      </div>
    </section>

    <!-- Third Section -->
    <section class="info-section">
      <div class="info-container">
        <h2 class="info-title">Heroes Are Made, Not Born.<br>Show Us What You've Got!</h2>
        <p class="info-paragraph">Every Tuesday for 6 weeks, a new Brand Heroes post will be published on The Loop. This post will take you to the Brand Heroes site, where you'll find:</p>
        <ul class="info-list">
          <li class="info-list-item">
            <strong>A new brand-related micro-content</strong><br>
            Each week, we'll focus on a key brand topic, from our name and logo to our tone of voice and other essential points. You'll need this knowledge to succeed in the game.
          </li>
          <li class="info-list-item">
            <strong>A new game unlocked</strong><br>
            Put your knowledge to the test and see how well you can apply what you've learned
          </li>
        </ul>
        <p class="info-paragraph orange">Learn about our brand, play to climb the ranks and win the final prize!</p>
        <div class="hero-tip">
          <span class="tip-icon">💡</span>
          <p class="tip-text"><strong>Hero Tip:</strong> Set a reminder for Tuesdays!</p>
        </div>
        <button class="cta-button" style="inline-size: 19rem;">Add to calendar</button>
      </div>
    </section>

    <!-- Fourth Section - Games -->
    <section class="games-section">
      <div class="games-container">
        <h2 class="games-title">The Adventure Starts Here!</h2>
        
        <div class="games-description">
          <p class="games-paragraph">
            In this epic quest, you will find heroes like yourself, who will help you achieve your mission, but you will also find villains who will get in the way and try to make you fail.
          </p>
          <p class="games-paragraph">
            You will meet <strong>Vision Queen</strong> and her super-sight powers. You will have to stop the attacks of <strong>Mr Confusion</strong>. You will also meet <strong>Dr Genius, Rocket Girl</strong> and many more characters that populate the Olam Agri's world.
          </p>
          <p class="games-paragraph bold">
            Are you up to the test?
          </p>
        </div>
        
        <div class="games-grid">
          <!-- First Row -->
          <div class="games-row">
            <!-- Game 1 Card -->
            <div class="game-card game1-card" class:locked={!$game1Availability.isAvailable}>
              <div class="game-label game1-label">Topic 1</div>
              <h3 class="game-name">The Importance of Brand</h3>
              
              {#if $game1Availability.isAvailable}
                <a href="/games/info/1" class="cta-button game1-button">Let's Play!</a>
              {:else}
                <div class="cta-button game1-button locked">
                  <svg class="lock-icon" width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.53 10.0109H18.92V8.17114C18.92 3.66931 15.37 0 11 0C6.63 0 3.07 3.66931 3.07 8.17114V10.0109H2.46C1.1 10.0109 0 11.1518 0 12.5496V27.268C0 28.6658 1.1 29.8067 2.46 29.8067H19.53C20.89 29.8067 21.99 28.6658 21.99 27.268V12.5496C21.99 11.1415 20.89 10.0109 19.53 10.0109ZM13.56 24.8115C13.66 25.3151 13.28 25.7879 12.78 25.7879H9.21C8.71 25.7879 8.33 25.3151 8.43 24.8115L9.48 19.3949C8.69 18.881 8.16 17.9765 8.16 16.9384C8.16 15.3247 9.43 14.0297 10.99 14.0297C12.55 14.0297 13.82 15.335 13.82 16.9384C13.82 17.9765 13.29 18.881 12.5 19.3949L13.55 24.8115H13.56ZM14.94 10.0109H7.05V8.17114C7.05 5.9305 8.82 4.11127 11 4.11127C13.18 4.11127 14.95 5.9305 14.95 8.17114V10.0109H14.94Z" fill="#FF7000"/>
                  </svg>
                </div>
                <p class="locked-text">
                  {#if $gameAvailabilityStore.isLoading}
                    Loading...
                  {:else}
                    {#if game1Date.type === 'from'}
                      Content available<br>from {game1Date.text}
                    {:else}
                      Content blocked{#if game1Date.text}<br>until {game1Date.text}{/if}
                    {/if}
                  {/if}
                </p>
              {/if}
            </div>
            
            <!-- Game 2 Card -->
            <div class="game-card game2-card" class:locked={!$game2Availability.isAvailable}>
              <div class="game-label game2-label">Topic 2</div>
              <h3 class="game-name">Our Brand Name & Logo</h3>
              
              {#if $game2Availability.isAvailable}
                <a href="/games/info/2" class="cta-button game2-button">Let's Play!</a>
              {:else}
                <div class="cta-button game2-button locked">
                  <svg class="lock-icon" width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.53 10.0109H18.92V8.17114C18.92 3.66931 15.37 0 11 0C6.63 0 3.07 3.66931 3.07 8.17114V10.0109H2.46C1.1 10.0109 0 11.1518 0 12.5496V27.268C0 28.6658 1.1 29.8067 2.46 29.8067H19.53C20.89 29.8067 21.99 28.6658 21.99 27.268V12.5496C21.99 11.1415 20.89 10.0109 19.53 10.0109ZM13.56 24.8115C13.66 25.3151 13.28 25.7879 12.78 25.7879H9.21C8.71 25.7879 8.33 25.3151 8.43 24.8115L9.48 19.3949C8.69 18.881 8.16 17.9765 8.16 16.9384C8.16 15.3247 9.43 14.0297 10.99 14.0297C12.55 14.0297 13.82 15.335 13.82 16.9384C13.82 17.9765 13.29 18.881 12.5 19.3949L13.55 24.8115H13.56ZM14.94 10.0109H7.05V8.17114C7.05 5.9305 8.82 4.11127 11 4.11127C13.18 4.11127 14.95 5.9305 14.95 8.17114V10.0109H14.94Z" fill="#8E75F8"/>
                  </svg>
                </div>
                <p class="locked-text">
                  {#if $gameAvailabilityStore.isLoading}
                    Loading...
                  {:else}
                    {#if game2Date.type === 'from'}
                      Content available<br>from {game2Date.text}
                    {:else}
                      Content blocked{#if game2Date.text}<br>until {game2Date.text}{/if}
                    {/if}
                  {/if}
                </p>
              {/if}
            </div>

            <!-- Game 3 Card -->
            <div class="game-card game3-card" class:locked={!$game3Availability.isAvailable}>
              <div class="game-label game3-label">Topic 3</div>
              <h3 class="game-name">Colors & Typography</h3>
              
              {#if $game3Availability.isAvailable}
                <a href="/games/info/3" class="cta-button game3-button">Let's Play!</a>
              {:else}
                <div class="cta-button game3-button locked">
                  <svg class="lock-icon" width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.53 10.0109H18.92V8.17114C18.92 3.66931 15.37 0 11 0C6.63 0 3.07 3.66931 3.07 8.17114V10.0109H2.46C1.1 10.0109 0 11.1518 0 12.5496V27.268C0 28.6658 1.1 29.8067 2.46 29.8067H19.53C20.89 29.8067 21.99 28.6658 21.99 27.268V12.5496C21.99 11.1415 20.89 10.0109 19.53 10.0109ZM13.56 24.8115C13.66 25.3151 13.28 25.7879 12.78 25.7879H9.21C8.71 25.7879 8.33 25.3151 8.43 24.8115L9.48 19.3949C8.69 18.881 8.16 17.9765 8.16 16.9384C8.16 15.3247 9.43 14.0297 10.99 14.0297C12.55 14.0297 13.82 15.335 13.82 16.9384C13.82 17.9765 13.29 18.881 12.5 19.3949L13.55 24.8115H13.56ZM14.94 10.0109H7.05V8.17114C7.05 5.9305 8.82 4.11127 11 4.11127C13.18 4.11127 14.95 5.9305 14.95 8.17114V10.0109H14.94Z" fill="#FF5BAF"/>
                  </svg>
                </div>
                <p class="locked-text">
                  {#if $gameAvailabilityStore.isLoading}
                    Loading...
                  {:else}
                    {#if game3Date.type === 'from'}
                      Content available<br>from {game3Date.text}
                    {:else}
                      Content blocked{#if game3Date.text}<br>until {game3Date.text}{/if}
                    {/if}
                  {/if}
                </p>
              {/if}
            </div>
          </div>

          <!-- Second Row -->
          <div class="games-row">
            <!-- Game 4 Card -->
            <div class="game-card game4-card" class:locked={!$game4Availability.isAvailable}>
              <div class="game-label game4-label">Topic 4</div>
              <h3 class="game-name">The Brand in Use</h3>
              
              {#if $game4Availability.isAvailable}
                <a href="/games/info/4" class="cta-button game4-button">Let's Play!</a>
              {:else}
                <div class="cta-button game4-button locked">
                  <svg class="lock-icon" width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.53 10.0109H18.92V8.17114C18.92 3.66931 15.37 0 11 0C6.63 0 3.07 3.66931 3.07 8.17114V10.0109H2.46C1.1 10.0109 0 11.1518 0 12.5496V27.268C0 28.6658 1.1 29.8067 2.46 29.8067H19.53C20.89 29.8067 21.99 28.6658 21.99 27.268V12.5496C21.99 11.1415 20.89 10.0109 19.53 10.0109ZM13.56 24.8115C13.66 25.3151 13.28 25.7879 12.78 25.7879H9.21C8.71 25.7879 8.33 25.3151 8.43 24.8115L9.48 19.3949C8.69 18.881 8.16 17.9765 8.16 16.9384C8.16 15.3247 9.43 14.0297 10.99 14.0297C12.55 14.0297 13.82 15.335 13.82 16.9384C13.82 17.9765 13.29 18.881 12.5 19.3949L13.55 24.8115H13.56ZM14.94 10.0109H7.05V8.17114C7.05 5.9305 8.82 4.11127 11 4.11127C13.18 4.11127 14.95 5.9305 14.95 8.17114V10.0109H14.94Z" fill="#FFC400"/>
                  </svg>
                </div>
                <p class="locked-text">
                  {#if $gameAvailabilityStore.isLoading}
                    Loading...
                  {:else}
                    {#if game4Date.type === 'from'}
                      Content available<br>from {game4Date.text}
                    {:else}
                      Content blocked{#if game4Date.text}<br>until {game4Date.text}{/if}
                    {/if}
                  {/if}
                </p>
              {/if}
            </div>

            <!-- Game 5 Card -->
            <div class="game-card game5-card" class:locked={!$game5Availability.isAvailable}>
              <div class="game-label game5-label">Topic 5</div>
              <h3 class="game-name">The Brand Hub</h3>
              
              {#if $game5Availability.isAvailable}
                <a href="/games/info/5" class="cta-button game5-button">Let's Play!</a>
              {:else}
                <div class="cta-button game5-button locked">
                  <svg class="lock-icon" width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.53 10.0109H18.92V8.17114C18.92 3.66931 15.37 0 11 0C6.63 0 3.07 3.66931 3.07 8.17114V10.0109H2.46C1.1 10.0109 0 11.1518 0 12.5496V27.268C0 28.6658 1.1 29.8067 2.46 29.8067H19.53C20.89 29.8067 21.99 28.6658 21.99 27.268V12.5496C21.99 11.1415 20.89 10.0109 19.53 10.0109ZM13.56 24.8115C13.66 25.3151 13.28 25.7879 12.78 25.7879H9.21C8.71 25.7879 8.33 25.3151 8.43 24.8115L9.48 19.3949C8.69 18.881 8.16 17.9765 8.16 16.9384C8.16 15.3247 9.43 14.0297 10.99 14.0297C12.55 14.0297 13.82 15.335 13.82 16.9384C13.82 17.9765 13.29 18.881 12.5 19.3949L13.55 24.8115H13.56ZM14.94 10.0109H7.05V8.17114C7.05 5.9305 8.82 4.11127 11 4.11127C13.18 4.11127 14.95 5.9305 14.95 8.17114V10.0109H14.94Z" fill="#00B2E7"/>
                  </svg>
                </div>
                <p class="locked-text">
                  {#if $gameAvailabilityStore.isLoading}
                    Loading...
                  {:else}
                    {#if game5Date.type === 'from'}
                      Content available<br>from {game5Date.text}
                    {:else}
                      Content blocked{#if game5Date.text}<br>until {game5Date.text}{/if}
                    {/if}
                  {/if}
                </p>
              {/if}
            </div>

            <!-- Game 6 Card -->
            <div class="game-card game6-card" class:locked={!$game6Availability.isAvailable}>
              <div class="game-label game6-label">Topic 6</div>
              <h3 class="game-name">The Ultimate Challenge</h3>
              
              {#if $game6Availability.isAvailable}
                <a href="/games/info/6" class="cta-button game6-button">Let's Play!</a>
              {:else}
                <div class="cta-button game6-button locked">
                  <svg class="lock-icon" width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.53 10.0109H18.92V8.17114C18.92 3.66931 15.37 0 11 0C6.63 0 3.07 3.66931 3.07 8.17114V10.0109H2.46C1.1 10.0109 0 11.1518 0 12.5496V27.268C0 28.6658 1.1 29.8067 2.46 29.8067H19.53C20.89 29.8067 21.99 28.6658 21.99 27.268V12.5496C21.99 11.1415 20.89 10.0109 19.53 10.0109ZM13.56 24.8115C13.66 25.3151 13.28 25.7879 12.78 25.7879H9.21C8.71 25.7879 8.33 25.3151 8.43 24.8115L9.48 19.3949C8.69 18.881 8.16 17.9765 8.16 16.9384C8.16 15.3247 9.43 14.0297 10.99 14.0297C12.55 14.0297 13.82 15.335 13.82 16.9384C13.82 17.9765 13.29 18.881 12.5 19.3949L13.55 24.8115H13.56ZM14.94 10.0109H7.05V8.17114C7.05 5.9305 8.82 4.11127 11 4.11127C13.18 4.11127 14.95 5.9305 14.95 8.17114V10.0109H14.94Z" fill="#00A865"/>
                  </svg>
                </div>
                <p class="locked-text">
                  {#if $gameAvailabilityStore.isLoading}
                    Loading...
                  {:else}
                    {#if game6Date.type === 'from'}
                      Content available<br>from {game6Date.text}
                    {:else}
                      Content blocked{#if game6Date.text}<br>until {game6Date.text}{/if}
                    {/if}
                  {/if}
                </p>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fifth Section - Hero's Reward -->
    <section class="hero-reward-section">
      <div class="hero-reward-container">
        <h2 class="hero-reward-title">The Hero's Reward</h2>
        <p class="hero-reward-paragraph">True heroes don't fight for fame or fortune, they fight for justice and the common good. Even so, they receive the affection and recognition of society, and often must accept gestures of respect and admiration.</p>
        <p class="hero-reward-paragraph">This is why the top 3 winners in each region will receive:</p>
        
        <div class="rewards-grid">
          <!-- First Row -->
          <div class="reward-row">
            <div class="reward-image-column">
              <img src="/images/site-pop-badge.png" alt="Funko Badge" class="reward-image">
            </div>
            <div class="reward-text-column">
              <p class="reward-title">An exclusive personalised Brand Hero Funko</p>
              <p class="reward-description">Just like every superhero, you'll have your own action figure with your face on it!</p>
            </div>
          </div>

          <!-- Second Row -->
          <div class="reward-row">
            <div class="reward-image-column">
              <img src="/images/site-certificate.png" alt="Certificate" class="reward-image">
            </div>
            <div class="reward-text-column">
              <p class="reward-title">The exceptional Brand Hero Certificate</p>
              <p class="reward-description">The recognition of your Brand Hero journey!</p>
            </div>
          </div>

          <!-- Third Row -->
          <div class="reward-row">
            <div class="reward-image-column">
              <img src="/images/badge-brand-hero-400.png" alt="Brand Hero Badge" class="reward-image">
            </div>
            <div class="reward-text-column">
              <p class="reward-title">The official Brand Hero badge in The Loop</p>
              <p class="reward-description">A mark of honour that only true heroes will carry!</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sixth Section - Brand Defender -->
    <section class="brand-defender-section">
      <img src="/images/group-126.png" alt="Brand Defender" class="brand-defender-hero-image">
      
      <div class="brand-defender-container">
        <h2 class="brand-defender-title">But wait, there's more!</h2>
        
        <div class="brand-defender-content">
          <div class="brand-defender-image-column">
            <img src="/images/badge-brand-defender-400.png" alt="Brand Defender Badge" class="brand-defender-badge">
          </div>
          <div class="brand-defender-text-column">
            <p class="brand-defender-paragraph">
              <strong>Everyone who completes all the games</strong> will be considered a Brand Defender and will receive the honorary <strong>Brand Defender badge</strong> in The Loop, even if they are not in the top 3 of the region.
            </p>
          </div>
        </div>
        
        <h3 class="brand-defender-cta-title">Become a Brand Hero.<br>Protect what makes us unique!</h3>
      </div>
    </section>
  </main>

  <Footer />
</div>

<style lang="scss">
  .content {
    position: relative;
    z-index: 1;

    // .wrapper {
    //   background-color: #FFF;
    //   max-inline-size: calc(128rem * var(--scale-factor));
    //   margin-inline: auto;
    //   padding-block: calc(5rem * var(--scale-factor)) calc(15rem * var(--scale-factor));
    // }
  }

  .header {
    background-image: url('/images/home-hero.jpg');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    block-size: calc(88.2rem * var(--scale-factor));
    padding-block-start: calc(7rem * var(--scale-factor));
    position: relative;

    :global(.logo path) {
      fill: #FFF;
    }

    .logo-link {
      text-decoration: none;
      display: inline-block;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }
    }

    .wrapper {
      max-inline-size: calc(142rem * var(--scale-factor));
      margin-inline: auto;
      padding-inline: 0;
    }

    @media (max-width: 932px) {
      .wrapper {
        padding-inline: 2rem;
      }
    }
  }



  .hero-section {
    padding-block: calc(12rem * var(--scale-factor));
    padding-inline: 2rem;
  }

  .hero-container {
    max-inline-size: calc(98rem * var(--scale-factor));
    margin-inline: auto;
  }

  .hero-title {
    color: #FF7000;
    font-size: calc(6rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    margin-block-end: calc(3rem * var(--scale-factor));
  }

  .hero-paragraph {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding-block-end: calc(4rem * var(--scale-factor));

    &:last-child {
      padding-block-end: 0;
    }
  }

  .map-section {
    background-color: #E6E6E6;
    padding-block-end: calc(9rem * var(--scale-factor));
    padding-block-start: calc(8rem * var(--scale-factor));
    padding-inline: 2rem;
  }

  .map-container {
    max-inline-size: calc(98rem * var(--scale-factor));
    margin-inline: auto;
    text-align: left;
  }

  .map-title {
    color: #FF7000;
    font-size: calc(4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    margin-block-end: calc(3rem * var(--scale-factor));
  }

  .map-paragraph {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding-block-end: calc(4rem * var(--scale-factor));

    &:last-of-type {
      padding-block-end: calc(6rem * var(--scale-factor));
    }
  }

  .map-image {
    inline-size: 100%;
    max-inline-size: calc(80rem * var(--scale-factor));
  }

  .info-section {
    padding-block: calc(12rem * var(--scale-factor));
    padding-inline: 2rem;
  }

  .info-container {
    max-inline-size: calc(98rem * var(--scale-factor));
    margin-inline: auto;
  }

  .info-title {
    color: #FF7000;
    font-size: calc(6rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    margin-block-end: calc(3rem * var(--scale-factor));
  }

  .info-paragraph {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding-block-end: calc(4rem * var(--scale-factor));

    &.orange {
      color: #FF7000;
      font-weight: 600;
    }
  }

  .info-list {
    margin-block-end: calc(3rem * var(--scale-factor));
    padding-inline-start: 2rem;
    list-style: disc;
  }

  .info-list-item {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding-block-end: calc(4rem * var(--scale-factor));
  }

  .hero-tip {
    align-items: center;
    display: flex;
    gap: 1rem;
    margin-block-end: calc(3rem * var(--scale-factor));
  }

  .tip-icon {
    font-size: 2rem;
  }

  .tip-text {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin: 0;
  }

  .navigation {
    &-list {
      align-items: center;
      display: flex;
      gap: calc(3rem * var(--scale-factor));
    }

    &-link {
      color: #000;
      font-size: 1.8rem;
      font-weight: 600;
      line-height: normal;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }
  }

  .btn {
    align-items: center;
    background-color: #fff;
    block-size: 3.2rem;
    border-radius: 0 1.5rem;
    display: flex;
    inline-size: 11.1rem;
  }

  .row {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .wrapper {
    max-inline-size: calc(128rem * var(--scale-factor));
    margin-inline: auto;
    padding-inline: 2rem;
  }

  .games-section {
    background-color: #2E2D2C;
    padding-block: calc(12rem * var(--scale-factor));
    padding-inline: 2rem;
  }

  .games-container {
    max-inline-size: calc(98rem * var(--scale-factor));
    margin-inline: auto;
  }

  .games-title {
    color: #FF7000;
    font-size: calc(6rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    margin-block-end: calc(4rem * var(--scale-factor));
    text-align: left;
  }

  .games-description {
    margin-block-end: calc(6rem * var(--scale-factor));
  }

  .games-paragraph {
    color: #FFF;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin-block-end: calc(3rem * var(--scale-factor));
    text-align: left;

    &.bold {
      font-weight: 600;
    }

    &:last-child {
      margin-block-end: 0;
    }
  }

  .game-card {
    align-items: center;
    border-radius: 0 calc(6rem * var(--scale-factor));
    box-shadow: 0 0.4rem 0.6rem rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: calc(44rem * var(--scale-factor));
    justify-content: center;
    padding: calc(3rem * var(--scale-factor));
    text-align: center;
    width: calc(44rem * var(--scale-factor));

    &:hover:not(.locked) {
      background-image: none !important;
    }

    &.locked {
      cursor: not-allowed;
      opacity: 0.8;
    }
  }

  // Game 1 - Orange
  .game1-card {
    background-image: url('/images/topic1.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    .game-name {
      color: #2E2D2C;
    }
    
    .locked-text {
      color: #FFF;
    }

    &:hover {
      background: #FF7000;
      
      .game-name {
        color: #2E2D2C;
      }

      .game1-button {
        background: #2E2D2C !important;
      }
    }
  }

  .game1-label {
    color: #FFF;
  }

  .game1-button {
    background: #FFF !important;
    color: #FF7000 !important;
    font-weight: 600 !important;
    inline-size: 12.4rem !important;
  }

  // Game 2 - Purple
  .game2-card {
    background-image: url('/images/topic2.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    .game-name {
      color: #2E2D2C;
    }
    
    .locked-text {
      color: #FFF;
    }

    &:hover {
      background: #8E75F8;
      
      .game-name {
        color: #2E2D2C;
      }

      .game2-button {
        background: #2E2D2C !important;
      }
    }
  }

  .game2-label {
    color: #FFF;
  }

  .game2-button {
    background: #FFF !important;
    color: #8E75F8 !important;
    font-weight: 600 !important;
    inline-size: 12.4rem !important;
  }

  // Game 3 - Pink
  .game3-card {
    background-image: url('/images/topic3.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    .game-name {
      color: #2E2D2C;
    }
    
    .locked-text {
      color: #FFF;
    }

    &:hover {
      background: #FF5BAF;
      
      .game-name {
        color: #2E2D2C;
      }

      .game3-button {
        background: #2E2D2C !important;
      }
    }
  }

  .game3-label {
    color: #FFF;
  }

  .game3-button {
    background: #FFF !important;
    color: #FF5BAF !important;
    font-weight: 600 !important;
    inline-size: 12.4rem !important;
  }

  // Game 4 - Blue
  .game4-card {
    background-image: url('/images/topic4.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    .game-name {
      color: #2E2D2C;
    }
    
    .locked-text {
      color: #2E2D2C;
    }

    &:hover {
      background: #FFD700;
      
      .game-name {
        color: #2E2D2C;
      }

      .game4-button {
        background: #2E2D2C !important;
      }
    }
  }

  .game4-label {
    color: #2E2D2C;
  }

  .game4-button {
    background: #FFF !important;
    color: #FFD700 !important;
    font-weight: 600 !important;
    inline-size: 12.4rem !important;
  }

  // Game 5 - Blue
  .game5-card {
    background-image: url('/images/topic5.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    .game-name {
      color: #2E2D2C;
    }
    
    .locked-text {
      color: #FFF;
    }

    &:hover {
      background: #00B2E7;
      
      .game-name {
        color: #2E2D2C;
      }

      .game5-button {
        background: #2E2D2C !important;
      }
    }
  }

  .game5-label {
    color: #FFF;
  }

  .game5-button {
    background: #FFF !important;
    color: #00B2E7 !important;
    font-weight: 600 !important;
    inline-size: 12.4rem !important;
  }

  // Game 6 - Green
  .game6-card {
    background-image: url('/images/topic6.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    
    .game-name {
      color: #2E2D2C;
    }
    
    .locked-text {
      color: #FFF;
    }

    &:hover {
      background: #00A865;
      
      .game-name {
        color: #2E2D2C;
      }

      .game6-button {
        background: #2E2D2C !important;
      }
    }
  }

  .game6-label {
    color: #FFF;
  }

  .game6-button {
    background: #FFF !important;
    color: #00A865 !important;
    font-weight: 600 !important;
    inline-size: 12.4rem !important;
  }

  .game-label {
    border-radius: 2rem;
    display: inline-block;
    font-size: 2rem;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    padding: 0.5rem 1rem;
    text-align: center;
  }

  .game-name {
    font-size: calc(4.5rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 109%;
    margin-block-end: calc(2.8rem * var(--scale-factor));
    padding-block-start: calc(3.3rem * var(--scale-factor));
  }

  .games-grid {
    display: flex;
    flex-direction: column;
    gap: calc(4rem * var(--scale-factor));
    margin: 0 auto;
    max-inline-size: calc(120rem * var(--scale-factor));
  }

  .games-row {
    display: grid;
    gap: calc(6rem * var(--scale-factor));
    grid-template-columns: repeat(3, 1fr);
    justify-content: center;
  }

  // .locked-state {
  //   text-align: center;
  // }

  .lock-icon {
    width: 2.2rem;
    height: 3rem;
  }

  .locked-text {
    color: #FFF;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    padding-block-start: 2rem;
    text-align: center;
  }

  .cta-button {
    align-items: center;
    background: #FF7000;
    border: none;
    border-radius: 0 1.7rem;
    color: #FFF;
    cursor: pointer;
    display: flex;
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    height: 4.4rem;
    inline-size: calc(19rem * var(--scale-factor));
    justify-content: center;
    line-height: normal;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease;

    &:hover {
      background: #e65a00;
    }

    &.locked {
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .hero-reward-section {
    padding-block: calc(12rem * var(--scale-factor));
    padding-inline: 2rem;
  }

  .hero-reward-container {
    max-inline-size: calc(98rem * var(--scale-factor));
    margin-inline: auto;
  }

  .hero-reward-title {
    color: #FF7000;
    font-size: calc(6rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    margin-block-end: calc(3rem * var(--scale-factor));
  }

  .hero-reward-paragraph {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    padding-block-end: calc(4rem * var(--scale-factor));

    &:last-child {
      padding-block-end: calc(6rem * var(--scale-factor));
    }
  }

  .rewards-grid {
    display: flex;
    flex-direction: column;
    gap: calc(4rem * var(--scale-factor));
  }

  .reward-row {
    align-items: center;
    display: flex;
    gap: calc(3.6rem * var(--scale-factor));
  }

  .reward-image-column {
    flex-shrink: 0;
    inline-size: 12rem;
  }

  .reward-image {
    inline-size: 100%;
    height: auto;
  }

  .reward-text-column {
    flex: 1;
  }

  .reward-title {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    margin-block-end: 1rem;
  }

  .reward-description {
    color: #000;
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }

  .brand-defender-section {
    padding-block-end: calc(10rem * var(--scale-factor));
    padding-block-start: 0;
  }

  .brand-defender-container {
    max-inline-size: calc(98rem * var(--scale-factor));
    margin-inline: auto;
    padding-inline: 2rem;
  }

  .brand-defender-hero-image {
    inline-size: 100%;
    height: auto;
  }

  .brand-defender-title {
    color: #FF7000;
    font-size: calc(4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    padding-block-start: calc(17.5rem * var(--scale-factor));
  }

  .brand-defender-content {
    align-items: center;
    display: flex;
    gap: calc(3.6rem * var(--scale-factor));
    padding-block-start: calc(3.5rem * var(--scale-factor));
  }

  .brand-defender-image-column {
    flex-shrink: 0;
  }

  .brand-defender-badge {
    inline-size: 100%;
    height: auto;
  }

  .brand-defender-text-column {
    flex: 1;
  }

  .brand-defender-paragraph {
    color: #000;
    font-size: calc(2.4rem * var(--scale-factor));
    font-style: normal;
    font-weight: 400;
    line-height: 150%;

    strong {
      font-weight: 600;
    }
  }

  .brand-defender-cta-title {
    color: #FF7000;
    font-size: calc(6rem * var(--scale-factor));
    font-style: normal;
    font-weight: 600;
    line-height: 125%;
    padding-block-start: calc(18.5rem * var(--scale-factor));
  }

  /* Mobile Media Query - Up to 932px */
  @media (max-width: 932px) {
    .logo-link {
      inline-size: 80%;
    }

    .hero-section {
      padding-inline: 2rem;
    }

    .map-section {
      padding-inline: 2rem;
    }

    .info-section {
      padding-inline: 2rem;
    }

    .games-section {
      padding-inline: 2rem;
    }

    .hero-reward-section {
      padding-inline: 2rem;
    }

    .brand-defender-container {
      padding-inline: 2rem;
    }

    .games-row {
      display: flex;
      flex-direction: column;
      gap: calc(3rem * var(--scale-factor));
    }

    .game-card {
      inline-size: 100%;
      max-inline-size: 100%;
      margin-inline: auto;
    }

    .games-grid {
      gap: calc(3rem * var(--scale-factor));
    }
  }
</style>
