<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { game2Availability } from '$lib/stores/gameAvailabilityStore';
  import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';

  let timeUntilAvailable: number | null = null;

  onMount(async () => {
    // Check if game is available
    if (!$game2Availability.isAvailable) {
      // Calculate time until available
      const availableFrom = $game2Availability.config?.availableFrom;
      if (availableFrom) {
        const now = new Date();
        const availableDate = new Date(availableFrom);
        timeUntilAvailable = availableDate.getTime() - now.getTime();
      }
    }
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

  function handlePlayClick() {
    if ($game2Availability.isAvailable) {
      goto('/games/game2');
    }
  }
</script>

<div class="game-info-container">
  <header class="info-header">
    <div class="header-container">
      <div class="logo-container">
        <Game1Logo />
      </div>
      <a href="/" class="back-link">← Back to Home</a>
    </div>
  </header>

  <div class="info-content">
    <div class="game-badge">Unit 2</div>
    
    <h1 class="game-title">Under Attack!</h1>
    
    <div class="game-description">
      <p>
        Our arch-enemy, Mr Confusion, is attacking us! He's really smart, he mixes lies with truths to confuse us. Stop the lies about our brand name and logo, but let the truths pass through.
      </p>
      
      <h3>What you'll learn:</h3>
      <ul>
        <li>Critical thinking and analysis</li>
        <li>Brand truth verification</li>
        <li>Quick decision making</li>
        <li>Brand protection awareness</li>
      </ul>
      
      <h3>How to play:</h3>
      <p>
        Statements will appear on screen and you have only 5 seconds to decide! Click on the lies to destroy them and earn points. 
        But be careful - if you destroy a truth by mistake, you'll lose points. Each lie you stop earns you 1 point, 
        but destroying a truth costs you 1 point. Think fast and protect our brand!
      </p>
      
      <div class="game-stats">
        <div class="stat">
          <span class="stat-number">10</span>
          <span class="stat-label">Statements</span>
        </div>
        <div class="stat">
          <span class="stat-number">5</span>
          <span class="stat-label">Seconds per statement</span>
        </div>
        <div class="stat">
          <span class="stat-number">1</span>
          <span class="stat-label">Point per correct answer</span>
        </div>
      </div>
    </div>
    
    <div class="cta-section">
      {#if $game2Availability.isAvailable}
        <button class="play-button" on:click={handlePlayClick}>
          let's play
        </button>
      {:else}
        <div class="locked-state">
          <div class="lock-icon">🔒</div>
          <h3 class="locked-title">Game Not Available Yet</h3>
          <p class="locked-text">
            {#if timeUntilAvailable && timeUntilAvailable > 0}
              This game will be available in {formatTimeUntil(timeUntilAvailable)}
            {:else}
              This game is coming soon. Check back later!
            {/if}
          </p>
          <a href="/" class="back-home-button">Back to Home</a>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .game-info-container {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    min-block-size: 100vh;
  }

  .info-header {
    align-items: center;
    background: white;
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    padding: 1.5rem 2rem;
  }

  .header-container {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-inline-size: 120rem;
    width: 100%;
  }

  .logo-container :global(.logo) {
    block-size: 4rem;
    width: auto;
  }

  :global(.logo path) {
    fill: #fff;
  }

  .back-link {
    color: #666;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #FF7000;
  }

  .info-content {
    margin: 0 auto;
    max-inline-size: 120rem;
    padding: 4rem 2rem;
    width: 100%;
  }

  .game-badge {
    background: #FF7000;
    border-radius: 2rem;
    color: white;
    display: inline-block;
    font-size: 0.9rem;
    font-weight: 600;
    margin-block-end: 1rem;
    padding: 0.5rem 1rem;
  }

  .game-title {
    color: #333;
    font-size: 4.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-block-end: 2rem;
  }

  .game-description {
    background: white;
    border-radius: 1.2rem;
    box-shadow: 0 0.4rem 0.6rem rgba(0, 0, 0, 0.1);
    margin-block-end: 3rem;
    padding: 3rem;
  }

  .game-description p {
    color: #555;
    font-size: 1.4rem;
    line-height: 1.7;
    margin-block-end: 1.5rem;
  }

  .game-description h3 {
    color: #333;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
  }

  .game-description ul {
    margin: 1rem 0 2rem 2rem;
  }

  .game-description li {
    color: #555;
    font-size: 1.3rem;
    line-height: 1.6;
    margin-block-end: 0.5rem;
  }

  .game-stats {
    background: #f8f9fa;
    border-radius: 0.8rem;
    display: flex;
    justify-content: space-around;
    margin: 3rem 0;
    padding: 2rem;
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    color: #FF7000;
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .stat-label {
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .cta-section {
    text-align: center;
  }

  .play-button {
    background: #FF7000;
    border: none;
    border-radius: 0.8rem;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 1.5rem 3rem;
    text-transform: lowercase;
    transition: background-color 0.2s;
  }

  .play-button:hover {
    background: #E65A00;
  }

  .locked-state {
    background: white;
    border-radius: 1.2rem;
    box-shadow: 0 0.4rem 0.6rem rgba(0, 0, 0, 0.1);
    padding: 4rem 3rem;
    text-align: center;
  }

  .lock-icon {
    font-size: 4rem;
    margin-block-end: 2rem;
    opacity: 0.7;
  }

  .locked-title {
    color: #333;
    font-size: 2rem;
    font-weight: 600;
    margin-block-end: 1rem;
  }

  .locked-text {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-block-end: 2rem;
  }

  .back-home-button {
    background: #666;
    border: none;
    border-radius: 0.8rem;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    padding: 1rem 2rem;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  .back-home-button:hover {
    background: #555;
  }

  @media (max-width: 76.8rem) {
    .info-header {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .info-content {
      padding: 2rem 1rem;
    }

    .game-title {
      font-size: 3rem;
    }

    .game-description {
      padding: 2rem 1.5rem;
    }

    .game-stats {
      flex-direction: column;
      gap: 1.5rem;
    }

    .locked-state {
      padding: 3rem 2rem;
    }

    .locked-title {
      font-size: 1.5rem;
    }
  }
</style> 