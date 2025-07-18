<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { game5Store } from '$lib/stores/game5Store';
    import { Game5Service } from '$lib/services/game5Service';
    import { onDestroy } from 'svelte';

    let gameService = Game5Service.getInstance();
    let formattedTime = '';
    let score = 0;

    onMount(() => {
        const state = $game5Store;
        if (state.isComplete && state.timeSpent > 0) {
            formattedTime = gameService.formatTime(state.timeSpent);
            score = gameService.getPoints();
        } else {
            // If somehow we're here without completion, redirect to game
            goto('/games/game5');
        }
    });

    onDestroy(() => {
        game5Store.cleanup();
    });

    function handleReplay() {
        game5Store.reset();
        goto('/games/game5');
    }

    function handleFinish() {
        game5Store.cleanup();
        goto('/ranking');
    }
</script>

<div class="summary-container">
    <div class="summary-content">
        <div class="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="35" fill="#00B2E7" stroke="#fff" stroke-width="4"/>
                <path d="M25 40L35 50L55 30" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <h1 class="title">Correct!</h1>
        
        <div class="results">
            <p class="score-text">You've earned 5 points.</p>
            <p class="time-text">Your registered time has been:</p>
            <div class="time-display">{formattedTime}</div>
        </div>

        <div class="actions">
            <button class="btn btn-cta2" on:click={handleReplay}>
                Replay
            </button>
            <button class="btn btn-cta1" on:click={handleFinish}>
                Finish
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    .summary-container {
        background-color: #00B2E7;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(2rem * var(--scale-factor));
    }

    .summary-content {
        background-color: #fff;
        border-radius: calc(2rem * var(--scale-factor));
        padding: calc(4rem * var(--scale-factor));
        text-align: center;
        max-width: calc(60rem * var(--scale-factor));
        width: 100%;
        box-shadow: 0 calc(1rem * var(--scale-factor)) calc(3rem * var(--scale-factor)) rgba(0, 0, 0, 0.2);
    }

    .success-icon {
        margin-bottom: calc(2rem * var(--scale-factor));
        
        svg {
            width: calc(8rem * var(--scale-factor));
            height: calc(8rem * var(--scale-factor));
        }
    }

    .title {
        color: #00B2E7;
        font-size: calc(4rem * var(--scale-factor));
        font-weight: 700;
        margin-bottom: calc(3rem * var(--scale-factor));
    }

    .results {
        background-color: #f8f9fa;
        border-radius: calc(1.5rem * var(--scale-factor));
        padding: calc(3rem * var(--scale-factor));
        margin-bottom: calc(3rem * var(--scale-factor));
        text-align: center;
    }

    .score-text {
        color: #2E2D2C;
        font-size: calc(2.4rem * var(--scale-factor));
        font-weight: 600;
        margin-bottom: calc(2rem * var(--scale-factor));
    }

    .time-text {
        color: #2E2D2C;
        font-size: calc(2rem * var(--scale-factor));
        margin-bottom: calc(1rem * var(--scale-factor));
    }

    .time-display {
        color: #00B2E7;
        font-size: calc(4rem * var(--scale-factor));
        font-weight: 700;
        font-family: monospace;
        background-color: #fff;
        padding: calc(1rem * var(--scale-factor)) calc(2rem * var(--scale-factor));
        border-radius: calc(1rem * var(--scale-factor));
        display: inline-block;
        border: calc(0.2rem * var(--scale-factor)) solid #00B2E7;
    }

    .actions {
        display: flex;
        gap: calc(2rem * var(--scale-factor));
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn {
        align-items: center;
        block-size: calc(3.5rem * var(--scale-factor));
        border: none;
        border-radius: 0rem 1.5rem;
        cursor: pointer;
        display: flex;
        font-size: calc(1.6rem * var(--scale-factor));
        inline-size: calc(12rem * var(--scale-factor));
        justify-content: center;
        transition: all 0.3s ease;
        font-weight: 600;
    }

    .btn-cta1 {
        background-color: #00B2E7;
        color: #fff;
        
        &:hover {
            background-color: #0099cc;
        }
    }

    .btn-cta2 {
        background-color: #fff;
        color: #00B2E7;
        border: calc(0.2rem * var(--scale-factor)) solid #00B2E7;
        
        &:hover {
            background-color: #00B2E7;
            color: #fff;
        }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .summary-container {
            padding: calc(1rem * var(--scale-factor));
        }

        .summary-content {
            padding: calc(2rem * var(--scale-factor));
        }

        .title {
            font-size: calc(3rem * var(--scale-factor));
        }

        .results {
            padding: calc(2rem * var(--scale-factor));
        }

        .score-text {
            font-size: calc(2rem * var(--scale-factor));
        }

        .time-text {
            font-size: calc(1.8rem * var(--scale-factor));
        }

        .time-display {
            font-size: calc(3rem * var(--scale-factor));
        }

        .actions {
            flex-direction: column;
            align-items: center;
        }

        .btn {
            width: 100%;
            max-width: calc(20rem * var(--scale-factor));
        }
    }
</style> 