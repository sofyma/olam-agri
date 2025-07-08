<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { game3Availability } from '$lib/stores/gameAvailabilityStore';
  import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
  import { authStore } from '$lib/stores/authStore';

    let timeUntilAvailable: number | null = null;

    onMount(async () => {
        // Check if game is available
        if (!$game3Availability.isAvailable) {
            // Calculate time until available
            const availableFrom = $game3Availability.config?.availableFrom;
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
        if ($game3Availability.isAvailable) {
            goto('/games/game3');
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
        
                
                <h2 class="info-title">Brain Over Brawn</h2>
                
                <div class="info-description">
                    <p>
                        Navigate through a challenging maze while answering questions about our brand! Use your brain power to find the correct path and prove that intelligence always wins over brute force.
                    </p>
                    
                    <h3>What you'll learn:</h3>
                    <ul>
                        <li>Strategic thinking and planning</li>
                        <li>Brand knowledge application</li>
                        <li>Problem-solving skills</li>
                        <li>Decision-making under pressure</li>
                    </ul>
                    
                    <h3>How to play:</h3>
                    <p>
                        You'll navigate through a maze using the directional pad. At each intersection, you'll be asked a question about our brand. 
                        Answer correctly to continue your journey, or face a penalty. The goal is to reach the exit with the highest score possible. 
                        Think strategically and use your brand knowledge wisely!
                    </p>
                    
                    <div class="game-stats">
                        <div class="stat">
                            <span class="stat-number">15</span>
                            <span class="stat-label">Questions</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">1</span>
                            <span class="stat-label">Point per correct answer</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">10</span>
                            <span class="stat-label">Minutes</span>
                        </div>
                    </div>
                </div>
                
                <div class="cta-section">
                    {#if $game3Availability.isAvailable}
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
    </main>

    <footer class="footer">
        <img class="footer-logo" src="/images/site-footer.jpg" alt="Brand Heroes">
    </footer>
</div>

<style lang="scss">
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
        color: #FF7000;
        font-size: calc(7.5rem * var(--scale-factor));
        font-weight: 400;
        line-height: 125%;
        margin-block-end: calc(8rem * var(--scale-factor));
        text-align: center;
    }

    .game-badge {
        background: #FF7000;
        border-radius: calc(2rem * var(--scale-factor));
        color: white;
        display: inline-block;
        font-size: calc(1.1rem * var(--scale-factor));
        font-weight: 600;
        margin-block-end: calc(2rem * var(--scale-factor));
        padding: calc(0.5rem * var(--scale-factor)) calc(1rem * var(--scale-factor));
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

    .game-stats {
        background: #f8f9fa;
        border-radius: calc(0.8rem * var(--scale-factor));
        display: flex;
        justify-content: space-around;
        margin: calc(4rem * var(--scale-factor)) 0;
        padding: calc(3rem * var(--scale-factor));
    }

    .stat {
        text-align: center;
    }

    .stat-number {
        color: #FF7000;
        display: block;
        font-size: calc(3rem * var(--scale-factor));
        font-weight: 700;
    }

    .stat-label {
        color: #666;
        font-size: calc(1.2rem * var(--scale-factor));
        font-weight: 500;
    }

    .cta-section {
        text-align: center;
    }

    .play-button {
        background: #FF7000;
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
        background: #E65A00;
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