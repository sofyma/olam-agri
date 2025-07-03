<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { game1Availability } from '$lib/stores/gameAvailabilityStore';
  import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';

  let timeUntilAvailable: number | null = null;

  onMount(async () => {
    // Check if game is available
    if (!$game1Availability.isAvailable) {
      // Calculate time until available
      const availableFrom = $game1Availability.config?.availableFrom;
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
    if ($game1Availability.isAvailable) {
      goto('/games/game1');
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
    <div class="game-badge">Unit 1</div>
    
    <h1 class="game-title">The Superpower of Branding</h1>
    
    <div class="game-description">
      <p>
        Test your knowledge of brands and iconic locations in this exciting two-part challenge! Discover the power of branding and how it connects us to memorable places around the world.
      </p>
      
      <h3>What you'll learn:</h3>
      <ul>
        <li>Brand recognition and recall</li>
        <li>Iconic location identification</li>
        <li>Visual memory and association</li>
        <li>Global brand awareness</li>
      </ul>
      
      <h3>How to play:</h3>
      <p>
        The game consists of two exciting rounds. In the first round, you'll test your brand knowledge. 
        In the second round, you'll identify famous locations. Each correct answer earns you points, 
        and your final score determines your ranking among other Brand Heroes!
      </p>
      
      <div class="game-stats">
        <div class="stat">
          <span class="stat-number">2</span>
          <span class="stat-label">Rounds</span>
        </div>
        <div class="stat">
          <span class="stat-number">10</span>
          <span class="stat-label">Questions per round</span>
        </div>
        <div class="stat">
          <span class="stat-number">5</span>
          <span class="stat-label">Minutes</span>
        </div>
      </div>
    </div>
    
    <div class="cta-section">
      {#if $game1Availability.isAvailable}
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