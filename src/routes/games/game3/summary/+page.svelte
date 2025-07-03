<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { game3Store } from '$lib/stores/game3Store';
    import Game3SummaryHero from '$lib/components/svgs/Game3SummaryHero.svelte';
    
    let finalScore = 0;
    let checkpointsReached = 0;
    let correctAnswersCount = 0;
    
    onMount(() => {
        finalScore = $game3Store.score;
        checkpointsReached = $game3Store.checkpointsReached;
        correctAnswersCount = $game3Store.correctAnswersCount;
    });
    
    function finishGame() {
        goto('/ranking');
    }
    
    function replayGame() {
        game3Store.reset();
        goto('/games/game3');
    }
</script>

<div class="game-container">
    <div class="game-summary">
        <h2 class="title">Well done!</h2>

        <div class="results">
            <p class="paragraph">You escaped the maze and answered {correctAnswersCount} questions correctly. This gives you a total of:</p>
            <p class="total-points">{finalScore} points</p>
            <Game3SummaryHero />      
        </div>

        <div class="cta">
            <button class="btn btn-cta2" on:click={replayGame}>
                Replay
            </button>
            <button class="btn btn-cta2" on:click={finishGame}>
                Finish
            </button>
        </div>

        <small class="finish-small">Remember, you can try again, but for the competition only <br> your first attempt will count!</small>      
    </div>
</div>

<style lang="scss">
    .game-container {
        background-color: #FF5BAF;
        position: relative;
        min-height: 100vh;
    }

    .game-summary {
        align-items: center;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-block-size: 100vh;
        position: relative;
        text-align: center;
        z-index: 1;

        .title {
            color: #fff;
            font-size: 7rem;
            font-weight: 600;
        }

        .results {
            background-color: #fff;
            border-radius: 3.5rem;
            inline-size: 90rem;
            margin-block-start: 3.5rem;
            padding: 5rem;
            position: relative;
        }

        .paragraph {
            color: #000;
            font-size: 4.5rem;
            font-weight: 600;
            line-height: normal;
        }

        .total-points {
            color: #FF5BAF;
            font-size: 8rem;
            font-weight: 700;
            margin-block-start: 2rem;
        }

        .cta {
            margin-block-start: 4rem;
            display: flex;
            gap: 2rem;
            justify-content: center;
        }

        .btn {
            background-color: #fff;
            border: none;
            border-radius: 1.5rem;
            color: #FF5BAF;
            cursor: pointer;
            font-size: 2.2rem;
            font-weight: 600;
            padding: 1.5rem 3rem;
            text-decoration: none;
            transition: all 0.2s ease;
        }
    }

    .finish-small {
		block-size: 2rem;
		color: #fff;
		display: block;
		font-size: 2rem;
		margin-block-start: 3rem;
		text-align: center;
	}
</style> 