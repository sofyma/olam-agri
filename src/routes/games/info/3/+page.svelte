<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { game3Availability } from '$lib/stores/gameAvailabilityStore';
    import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';

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
        <div class="game-badge">Unit 3</div>
        
        <h1 class="game-title">Brain Over Brawn</h1>
        
        <div class="game-description">
            <p>
                Navigate through a challenging maze while testing your brand knowledge! Guide your character through the labyrinth, 
                answer questions at checkpoints, and reach the exit to become a true Brand Hero.
            </p>
            
            <h3>What you'll learn:</h3>
            <ul>
                <li>Brand color recognition and usage</li>
                <li>Design system understanding</li>
                <li>Accessibility and contrast principles</li>
                <li>Brand guideline compliance</li>
            </ul>
            
            <h3>How to play:</h3>
            <p>
                Use the arrow keys to navigate through the maze. You'll encounter two checkpoints where you'll need to answer 
                brand-related questions. Each correct answer earns you points, and reaching the exit gives you bonus points. 
                Avoid hitting the walls and find the optimal path to maximize your score!
            </p>
            
            <div class="game-stats">
                <div class="stat">
                    <span class="stat-number">2</span>
                    <span class="stat-label">Checkpoints</span>
                </div>
                <div class="stat">
                    <span class="stat-number">10</span>
                    <span class="stat-label">Questions total</span>
                </div>
                <div class="stat">
                    <span class="stat-number">∞</span>
                    <span class="stat-label">Time limit</span>
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

<style lang="scss">
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
        margin-block: 2rem 1rem;
    }

    .game-description ul {
        color: #555;
        font-size: 1.3rem;
        line-height: 1.7;
        margin-block-end: 1.5rem;
        padding-inline-start: 2rem;
    }

    .game-description li {
        margin-block-end: 0.5rem;
    }

    .game-stats {
        display: grid;
        gap: 2rem;
        grid-template-columns: repeat(3, 1fr);
        margin-block-start: 3rem;
        padding-block-start: 2rem;
        border-block-start: 1px solid #eee;
    }

    .stat {
        text-align: center;
    }

    .stat-number {
        color: #FF7000;
        display: block;
        font-size: 2.5rem;
        font-weight: 700;
        margin-block-end: 0.5rem;
    }

    .stat-label {
        color: #666;
        font-size: 1rem;
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
        padding: 1.2rem 3rem;
        transition: background-color 0.2s;
    }

    .play-button:hover {
        background: #E65A00;
    }

    .locked-state {
        background: white;
        border-radius: 1.2rem;
        box-shadow: 0 0.4rem 0.6rem rgba(0, 0, 0, 0.1);
        padding: 3rem;
        text-align: center;
    }

    .lock-icon {
        font-size: 4rem;
        margin-block-end: 1rem;
        opacity: 0.7;
    }

    .locked-title {
        color: #333;
        font-size: 1.5rem;
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
        border-radius: 0.8rem;
        color: white;
        display: inline-block;
        font-size: 1rem;
        font-weight: 500;
        padding: 0.8rem 2rem;
        text-decoration: none;
        transition: background-color 0.2s;
    }

    .back-home-button:hover {
        background: #555;
    }

    /* Responsive design */
    @media (max-width: 76.8rem) {
        .info-content {
            padding: 2rem 1rem;
        }

        .game-title {
            font-size: 3rem;
        }

        .game-description {
            padding: 2rem;
        }

        .game-stats {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .header-container {
            flex-direction: column;
            gap: 1rem;
        }
    }
</style> 