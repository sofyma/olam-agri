<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { game3Store } from '$lib/stores/game3Store';
    import GameInstructions from '$lib/components/GameInstructions.svelte';

    let instructionsClosed = true;
    
    let finalScore = 0;
    let checkpointsReached = 0;
    
    onMount(() => {
        finalScore = $game3Store.score;
        checkpointsReached = $game3Store.checkpointsReached;
    });
    
    function replayGame() {
        game3Store.reset();
        goto('/games/game3');
    }
    
    function finishGame() {
        goto('/');
    }
</script>

<div class="finish-container" class:sidebar-is-closed={instructionsClosed}>
    <GameInstructions
        gameNumber={3}
        gameTitle="Brand Heroes"
        gameSubtitle="Brain Over Brawn"
        infoRoute="/games/info/3"
        bind:instructionsClosed
        primaryColor="#FF5BAF"
        backgroundColor="#2E2D2C"
        paragraphs={[
            "Dr Genius may be tough, but his real power is his brain, he trains it every day!",
            "Now he challenges you: use the arrow pad to escape the maze, solve hidden challenges, and score up to 11 points in total.",
            "Let the wits be with you!"
        ]}
    />

    <div class="finish-content">
        <div class="game-id">
            <span class="text">game</span>
            <span class="number">3</span>
        </div>

        <h1 class="title">Maze Adventure Complete!</h1>
        
        <div class="results">
            <div class="score-section">
                <h2 class="subtitle">Your Final Score</h2>
                <div class="final-score">{finalScore} {finalScore === 1 ? 'point' : 'points'}</div>
                <p class="score-description">out of 11 possible points</p>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-label">Checkpoints Reached:</span>
                    <span class="stat-value">{checkpointsReached}/2</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Exit Reached:</span>
                    <span class="stat-value">Yes</span>
                </div>
            </div>
        </div>

        <div class="cta-buttons">
            <button class="btn btn-cta3" on:click={replayGame}>
                Replay Game
            </button>
            <button class="btn btn-cta2" on:click={finishGame}>
                Finish
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    .finish-container {
        background-color: #2E2D2C;
        min-height: var(--full-height, 100vh);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .finish-content {
        background-color: #fff;
        border-radius: 3.7rem;
        max-width: 80rem;
        padding: 4rem;
        text-align: center;
    }

    .game-id {
        align-items: center;
        background-color: #FF7000;
        border-radius: 0 2rem 0 2rem;
        block-size: 17rem;
        color: #fff;
        display: flex;
        flex-direction: column;
        inline-size: 11rem;
        margin: 0 auto 2rem;
        padding: 1rem;
        text-align: center;

        .text {
            font-size: 2.8rem;
            font-weight: 600;
            line-height: 2.8rem;
        }

        .number {
            font-size: 13.7rem;
            font-weight: 600;
            line-height: 13.7rem;
        }
    }

    .title {
        color: #FF7000;
        font-size: 6rem;
        font-weight: 600;
        margin-bottom: 3rem;
    }

    .results {
        margin-bottom: 4rem;
    }

    .score-section {
        margin-bottom: 3rem;
    }

    .subtitle {
        color: #2E2D2C;
        font-size: 3.7rem;
        font-weight: 600;
        margin-bottom: 2rem;
    }

    .final-score {
        color: #FF7000;
        font-size: 8rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .score-description {
        color: #666;
        font-size: 2.2rem;
        margin-bottom: 2rem;
    }

    .stats {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        max-width: 40rem;
        margin: 0 auto;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #f5f5f5;
        border-radius: 1rem;
    }

    .stat-label {
        color: #2E2D2C;
        font-size: 2.2rem;
        font-weight: 500;
    }

    .stat-value {
        color: #FF7000;
        font-size: 2.2rem;
        font-weight: 600;
    }

    .cta-buttons {
        display: flex;
        gap: 2rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn {
        border: none;
        border-radius: 1.5rem;
        cursor: pointer;
        font-size: 2.2rem;
        font-weight: 600;
        padding: 1.5rem 3rem;
        text-decoration: none;
        transition: all 0.2s ease;

        &:hover {
            transform: translateY(-0.2rem);
        }
    }

    .btn-cta2 {
        background-color: #FF7000;
        color: white;

        &:hover {
            background-color: #e66500;
        }
    }

    .btn-cta3 {
        background-color: #2E2D2C;
        color: white;

        &:hover {
            background-color: #1a1a1a;
        }
    }
</style> 