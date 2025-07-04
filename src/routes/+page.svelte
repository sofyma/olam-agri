<!-- +page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/authStore';
  import { gameAvailabilityStore, game1Availability, game2Availability, game3Availability, game4Availability, game6Availability } from '$lib/stores/gameAvailabilityStore';
  import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';

  let timeUntilGame1: number | null = null;
  let timeUntilGame2: number | null = null;
  let timeUntilGame3: number | null = null;
  let timeUntilGame4: number | null = null;
  let timeUntilGame6: number | null = null;

  onMount(() => {
    gameAvailabilityStore.loadGameConfigs();
    
    // Set up interval to refresh availability every minute
    const interval = setInterval(() => {
      gameAvailabilityStore.refreshAvailability();
      timeUntilGame1 = gameAvailabilityStore.getTimeUntilAvailable('game1');
      timeUntilGame2 = gameAvailabilityStore.getTimeUntilAvailable('game2');
      timeUntilGame3 = gameAvailabilityStore.getTimeUntilAvailable('game3');
      timeUntilGame4 = gameAvailabilityStore.getTimeUntilAvailable('game4');
      timeUntilGame6 = gameAvailabilityStore.getTimeUntilAvailable('game6');
    }, 60000);

    // Initial check
    timeUntilGame1 = gameAvailabilityStore.getTimeUntilAvailable('game1');
    timeUntilGame2 = gameAvailabilityStore.getTimeUntilAvailable('game2');
    timeUntilGame3 = gameAvailabilityStore.getTimeUntilAvailable('game3');
    timeUntilGame4 = gameAvailabilityStore.getTimeUntilAvailable('game4');
    timeUntilGame6 = gameAvailabilityStore.getTimeUntilAvailable('game6');

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
</script>

<div class="container">
  <header class="header">
    <div class="wrapper">
      <div class="row">
        <div class="column">
          <Game1Logo />
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

      <h1 class="header-title">Brand Heroes</h1>
    </div>

    <img class="header-heroes" src="/images/oa-site-small-header-heroes.png" alt="Brand Heroes">
  </header>
  
  <main class="content">
    <div class="wrapper">
      <div class="home-container">
        <h2 class="home-title">¿Are you ready to be a hero?</h2>
        
        <div class="games-grid">
          <!-- First Row -->
          <div class="games-row">
            <!-- Game 1 Card -->
            <div class="game-card game1-card" class:locked={!$game1Availability.isAvailable}>
              <div class="game-label game1-label">Unit 1</div>
              <h3 class="game-name">The Superpower of Branding</h3>
              
              {#if $game1Availability.isAvailable}
                <a href="/games/info/1" class="cta-button game1-button">let's do it</a>
              {:else}
                <div class="locked-state">
                  <div class="lock-icon">🔒</div>
                  <p class="locked-text">
                    {#if timeUntilGame1}
                      Available in {formatTimeUntil(timeUntilGame1)}
                    {:else}
                      Coming Soon
                    {/if}
                  </p>
                </div>
              {/if}
            </div>
            
            <!-- Game 2 Card -->
            <div class="game-card game2-card" class:locked={!$game2Availability.isAvailable}>
              <div class="game-label game2-label">Unit 2</div>
              <h3 class="game-name">Under Attack!</h3>
              
              {#if $game2Availability.isAvailable}
                <a href="/games/info/2" class="cta-button game2-button">let's do it</a>
              {:else}
                <div class="locked-state">
                  <div class="lock-icon">🔒</div>
                  <p class="locked-text">
                    {#if timeUntilGame2}
                      Available in {formatTimeUntil(timeUntilGame2)}
                    {:else}
                      Coming Soon
                    {/if}
                  </p>
                </div>
              {/if}
            </div>

            <!-- Game 3 Card -->
            <div class="game-card game3-card" class:locked={!$game3Availability.isAvailable}>
              <div class="game-label game3-label">Unit 3</div>
              <h3 class="game-name">Brain Over Brawn</h3>
              
              {#if $game3Availability.isAvailable}
                <a href="/games/info/3" class="cta-button game3-button">let's do it</a>
              {:else}
                <div class="locked-state">
                  <div class="lock-icon">🔒</div>
                  <p class="locked-text">
                    {#if timeUntilGame3}
                      Available in {formatTimeUntil(timeUntilGame3)}
                    {:else}
                      Coming Soon
                    {/if}
                  </p>
                </div>
              {/if}
            </div>
          </div>

          <!-- Second Row -->
          <div class="games-row">
            <!-- Game 4 Card -->
            <div class="game-card game4-card" class:locked={!$game4Availability.isAvailable}>
              <div class="game-label game4-label">Unit 4</div>
              <h3 class="game-name">Choose a Side</h3>
              
              {#if $game4Availability.isAvailable}
                <a href="/games/info/4" class="cta-button game4-button">let's do it</a>
              {:else}
                <div class="locked-state">
                  <div class="lock-icon">🔒</div>
                  <p class="locked-text">
                    {#if timeUntilGame4}
                      Available in {formatTimeUntil(timeUntilGame4)}
                    {:else}
                      Coming Soon
                    {/if}
                  </p>
                </div>
              {/if}
            </div>

            <!-- Game 6 Card -->
            <div class="game-card game6-card" class:locked={!$game6Availability.isAvailable}>
              <div class="game-label game6-label">Unit 6</div>
              <h3 class="game-name">Only the Fastest Will Reach the Sky</h3>
              
              {#if $game6Availability.isAvailable}
                <a href="/games/info/6" class="cta-button game6-button">let's do it</a>
              {:else}
                <div class="locked-state">
                  <div class="lock-icon">🔒</div>
                  <p class="locked-text">
                    {#if timeUntilGame6}
                      Available in {formatTimeUntil(timeUntilGame6)}
                    {:else}
                      Coming Soon
                    {/if}
                  </p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <img class="footer-logo" src="/images/site-footer.jpg" alt="Brand Heroes">
  </footer>
</div>

<style lang="scss">
  .content {
    margin-block-start: calc(-15rem * var(--scale-factor));
    position: relative;
    z-index: 1;

    .wrapper {
      background-color: #FFF;
      max-inline-size: calc(128rem * var(--scale-factor));
      margin-inline: auto;
      padding-block: calc(5rem * var(--scale-factor)) calc(15rem * var(--scale-factor));
    }
  }

  .footer {
    &-logo {
      inline-size: 100%;
    }
  }

  // Game 1 - Orange
  .game1-card {
    background: #FF7000;
    
    .game-name {
      color: white;
    }
    
    .locked-text {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .game1-label {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .game1-button {
    background: white;
    color: #FF7000;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  // Game 2 - Purple
  .game2-card {
    background: #8E75F8;
    
    .game-name {
      color: white;
    }
    
    .locked-text {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .game2-label {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .game2-button {
    background: white;
    color: #8E75F8;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  // Game 3 - Pink
  .game3-card {
    background: #FF5BAF;
    
    .game-name {
      color: white;
    }
    
    .locked-text {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .game3-label {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .game3-button {
    background: white;
    color: #FF5BAF;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  // Game 4 - Yellow
  .game4-card {
    background: #FFC400;
    
    .game-name {
      color: #2E2D2C;
    }
    
    .locked-text {
      color: rgba(46, 45, 44, 0.8);
    }
  }

  .game4-label {
    background: rgba(46, 45, 44, 0.2);
    color: #2E2D2C;
  }

  .game4-button {
    background: #2E2D2C;
    color: #FFC400;

    &:hover {
      background: #1a1a1a;
    }
  }

  // Game 6 - Green
  .game6-card {
    background: #00A865;
    
    .game-name {
      color: white;
    }
    
    .locked-text {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .game6-label {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .game6-button {
    background: white;
    color: #00A865;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  .game-card {
    border-radius: calc(1.2rem * var(--scale-factor));
    box-shadow: 0 calc(0.4rem * var(--scale-factor)) calc(0.6rem * var(--scale-factor)) rgba(0, 0, 0, 0.1);
    padding: calc(3rem * var(--scale-factor)) calc(2rem * var(--scale-factor));
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover:not(.locked) {
      box-shadow: 0 calc(0.8rem * var(--scale-factor)) calc(1.2rem * var(--scale-factor)) rgba(0, 0, 0, 0.15);
      transform: translateY(calc(-0.4rem * var(--scale-factor)));
    }

    &.locked {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .game-label {
    border-radius: calc(2rem * var(--scale-factor));
    display: inline-block;
    font-size: calc(1.1rem * var(--scale-factor));
    font-weight: 600;
    margin-block-end: calc(1.5rem * var(--scale-factor));
    padding: calc(0.5rem * var(--scale-factor)) calc(1rem * var(--scale-factor));
  }

  .game-name {
    font-size: calc(2.2rem * var(--scale-factor));
    font-weight: 600;
    margin-block-end: calc(2rem * var(--scale-factor));
  }

  .games-grid {
    display: flex;
    flex-direction: column;
    gap: calc(3rem * var(--scale-factor));
    margin: 0 auto;
    max-inline-size: calc(120rem * var(--scale-factor));
  }

  .games-row {
    display: grid;
    gap: calc(3rem * var(--scale-factor));
    grid-template-columns: repeat(auto-fit, minmax(calc(30rem * var(--scale-factor)), 1fr));
  }

  .header {
    background-image: url('/images/oa-site-small-header-background.jpg');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    block-size: calc(53.5rem * var(--scale-factor));
    padding-block-start: calc(7rem * var(--scale-factor));
    position: relative;

    &-heroes {
      position: absolute;
      inset-block-end: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);
    }

    &-title {
      color: #FFF;
      font-size: calc(8rem * var(--scale-factor));
      font-weight: 600;
      line-height: normal;
      padding-block-start: calc(1.5rem * var(--scale-factor));
    }

    :global(.logo path) {
      fill: #FFF;
    }

    .wrapper {
      max-inline-size: calc(142rem * var(--scale-factor));
      margin-inline: auto;
    }

    @media (min-width: 768px) and (max-width: 1024px) {
      .wrapper {
        padding-inline: calc(2rem * var(--scale-factor));
      }
    }

    .row {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .navigation {
      &-list {
        align-items: center;
        display: flex;
        gap: calc(3rem * var(--scale-factor));
      }

      &-link {
        color: #000;
        font-size: calc(1.8rem * var(--scale-factor));
        font-weight: 600;
        line-height: normal;
      }
    }

    .btn {
      align-items: center;
      background-color: #fff;
      block-size: calc(3.2rem * var(--scale-factor));
      border-radius: 0 calc(1.5rem * var(--scale-factor));
      display: flex;
      inline-size: calc(11.1rem * var(--scale-factor));
    }
  }

  .home-container {
    max-inline-size: calc(100rem * var(--scale-factor));
    margin-inline: auto;
    text-align: center;
  }

  .home-title {
    color: #FF7000;
    font-size: calc(7.5rem * var(--scale-factor));
    font-weight: 400;
    line-height: 125%;
    margin-block-end: calc(12rem * var(--scale-factor));
    text-align: center;
  }

  .lock-icon {
    font-size: calc(3rem * var(--scale-factor));
    opacity: 0.7;
  }

  .locked-state {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: calc(1rem * var(--scale-factor));
  }

  .locked-text {
    font-size: calc(1.1rem * var(--scale-factor));
    font-weight: 500;
  }

  .cta-button {
    border-radius: calc(0.8rem * var(--scale-factor));
    display: inline-block;
    font-size: calc(1.3rem * var(--scale-factor));
    font-weight: 600;
    padding: calc(1rem * var(--scale-factor)) calc(2rem * var(--scale-factor));
    text-decoration: none;
    transition: background-color 0.2s;
  }
</style>
