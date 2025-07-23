<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { game5Availability } from '$lib/stores/gameAvailabilityStore';
  import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
  import { authStore } from '$lib/stores/authStore';

  let timeUntilAvailable: number | null = null;

  onMount(async () => {
    if (!$game5Availability.isAvailable) {
      const availableFrom = $game5Availability.config?.availableFrom;
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
    if ($game5Availability.isAvailable) {
      goto('/games/game5');
    }
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
      <h1 class="header-title">Brand Heroes</h1>
    </div>
    <img class="header-heroes" src="/images/oa-site-small-header-heroes.png" alt="Brand Heroes">
  </header>

  <main class="content">
    <div class="wrapper">
      <div class="info-container">
        <h2 class="info-title">Only the Fastest Will Reach the Sky</h2>
        <div class="info-description">
          <p>
            This is a time-sensitive challenge that tests your knowledge of the Brand Hub and your ability to find specific information quickly.
          </p>
          <p>
            You'll need to locate the Brand Guidelines document in the Brand Hub and find specific words on page 4 of PDF #1.
          </p>
          <h3>How to play:</h3>
          <ul>
            <li>Click the START button to begin the timer</li>
            <li>Visit the Brand Hub using the provided link</li>
            <li>Find the Brand Guidelines document</li>
            <li>Look for the words in orange on page 4 of PDF #1</li>
            <li>Type the exact answer as it appears in the document</li>
            <li>Submit your answer and see if you're correct</li>
          </ul>
          <h3>Scoring:</h3>
          <ul>
            <li><strong>Correct Answer:</strong> 5 points</li>
            <li><strong>Incorrect Answer:</strong> 0 points (but you can try again)</li>
            <li><strong>Time:</strong> Used as a tiebreaker for the overall competition</li>
          </ul>
          <h3>Important Notes:</h3>
          <ul>
            <li>The timer starts immediately when you click START</li>
            <li>You have unlimited attempts to get the correct answer</li>
            <li>The timer only stops when you submit the correct answer</li>
            <li>Your time is saved every 5 seconds, so you won't lose progress if you accidentally close the window</li>
            <li>Only your first successful attempt is recorded for the ranking</li>
          </ul>
          <h3>Access the Brand Hub:</h3>
          <p>
            Click the link below to visit The Loop and access the Brand Hub:
          </p>
          <div class="link-container">
            <a href="https://olamagri.workvivo.com/" target="_blank" class="brand-hub-link">
              Visit The Loop - Brand Hub
            </a>
          </div>
        </div>
        <div class="cta-section">
          {#if $game5Availability.isAvailable}
            <button class="play-button" on:click={handlePlayClick}>
              let's play
            </button>
          {:else}
            <div class="locked-state">
              <div class="lock-icon"> 512</div>
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
  </main>

  <footer class="footer">
    <img class="footer-logo" src="/images/site-footer.jpg" alt="Brand Heroes">
  </footer>
</div>

<style lang="scss">
  /* Copy the style structure from Game 1 info page for consistency */
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
    }
    @media (max-width: 1024px) {
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
  .footer {
    &-logo {
      inline-size: 100%;
    }
  }
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
  .info-container {
    max-inline-size: calc(100rem * var(--scale-factor));
    margin-inline: auto;
    text-align: center;
  }
  .info-title {
    color: #00B2E7;
    font-size: calc(7.5rem * var(--scale-factor));
    font-weight: 400;
    line-height: 125%;
    margin-block-end: calc(8rem * var(--scale-factor));
    text-align: center;
  }
  .info-description {
    background: white;
    border-radius: calc(1.2rem * var(--scale-factor));
    box-shadow: 0 calc(0.4rem * var(--scale-factor)) calc(0.6rem * var(--scale-factor)) rgba(0, 0, 0, 0.1);
    margin-block-end: calc(5rem * var(--scale-factor));
    padding: calc(4rem * var(--scale-factor));
    text-align: left;
  }
  .info-description p {
    color: #555;
    font-size: calc(1.8rem * var(--scale-factor));
    line-height: 1.7;
    margin-block-end: calc(2rem * var(--scale-factor));
  }
  .info-description h3 {
    color: #333;
    font-size: calc(2.2rem * var(--scale-factor));
    font-weight: 600;
    margin: calc(3rem * var(--scale-factor)) 0 calc(1.5rem * var(--scale-factor)) 0;
  }
  .info-description ul {
    margin: calc(1.5rem * var(--scale-factor)) 0 calc(3rem * var(--scale-factor)) calc(2rem * var(--scale-factor));
  }
  .info-description li {
    color: #555;
    font-size: calc(1.6rem * var(--scale-factor));
    line-height: 1.6;
    margin-block-end: calc(0.8rem * var(--scale-factor));
  }
  .cta-section {
    text-align: center;
  }
  .play-button {
    background: #00B2E7;
    border: none;
    border-radius: calc(0.8rem * var(--scale-factor));
    color: white;
    cursor: pointer;
    font-size: calc(1.8rem * var(--scale-factor));
    font-weight: 600;
    padding: calc(2rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
    text-transform: lowercase;
    transition: background-color 0.2s;
  }
  .play-button:hover {
    background: #0099cc;
  }
  .locked-state {
    background: white;
    border-radius: calc(1.2rem * var(--scale-factor));
    box-shadow: 0 calc(0.4rem * var(--scale-factor)) calc(0.6rem * var(--scale-factor)) rgba(0, 0, 0, 0.1);
    padding: calc(5rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
    text-align: center;
  }
  .lock-icon {
    font-size: calc(5rem * var(--scale-factor));
    margin-block-end: calc(3rem * var(--scale-factor));
    opacity: 0.7;
  }
  .locked-title {
    color: #333;
    font-size: calc(2.5rem * var(--scale-factor));
    font-weight: 600;
    margin-block-end: calc(1.5rem * var(--scale-factor));
  }
  .locked-text {
    color: #666;
    font-size: calc(1.4rem * var(--scale-factor));
    line-height: 1.6;
    margin-block-end: calc(3rem * var(--scale-factor));
  }
  .back-home-button {
    background: #666;
    border: none;
    border-radius: calc(0.8rem * var(--scale-factor));
    color: white;
    cursor: pointer;
    font-size: calc(1.4rem * var(--scale-factor));
    font-weight: 600;
    padding: calc(1.5rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
    text-decoration: none;
    transition: background-color 0.2s;
  }
  .back-home-button:hover {
    background: #555;
  }
</style> 