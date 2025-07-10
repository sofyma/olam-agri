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

        <small class="finish-small">Remember, you can try again, but for the<br> competition only your first attempt will count!</small>      
    </div>
</div>

<style lang="scss">
    :root {
        --scale-factor: 1;
    }

    @media (width <= 1440px) {
        :root {
            --scale-factor: 0.85;
        }
    }

    @media (width <= 1200px) {
        :root {
            --scale-factor: 0.75;
        }
    }

    @media (width <= 1024px) {
        :root {
            --scale-factor: 0.65;
        }
    }

    @media (width >= 1920px) {
        :root {
            --scale-factor: 1;
        }
    }

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
            font-size: calc(7rem * var(--scale-factor));
            font-weight: 600;
        }

        .results {
            background-color: #fff;
            border-radius: 0px 30px;
            inline-size: calc(90rem * var(--scale-factor));
            margin-block-start: calc(3.5rem * var(--scale-factor));
            padding: calc(5rem * var(--scale-factor));
            position: relative;
        }

        .paragraph {
            color: #000;
            font-size: calc(4.5rem * var(--scale-factor));
            font-weight: 600;
            line-height: normal;
        }

        .total-points {
            color: #FF5BAF;
            font-size: calc(8rem * var(--scale-factor));
            font-weight: 700;
            margin-block-start: calc(2rem * var(--scale-factor));
        }

        .cta {
            margin-block-start: calc(4rem * var(--scale-factor));
            display: flex;
            gap: calc(2rem * var(--scale-factor));
            justify-content: center;
        }

        .btn {
            background-color: #fff;
            border: none;
            color: #FF5BAF;
            cursor: pointer;
            font-size: calc(2.2rem * var(--scale-factor));
            font-weight: 600;
            padding: calc(1.5rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
            text-decoration: none;
            transition: all 0.2s ease;
        }
    }

    .finish-small {
		block-size: calc(2rem * var(--scale-factor));
		color: #fff;
		display: block;
		font-size: calc(2rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		margin-block-start: calc(3rem * var(--scale-factor));
		text-align: center;
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		/* Adjust game summary for mobile */
		.game-summary {
			padding: calc(2rem * var(--scale-factor));
		}

		.game-summary .title {
			font-size: calc(5rem * var(--scale-factor));
		}

		.game-summary .results {
			inline-size: calc(80rem * var(--scale-factor));
			padding: calc(2rem * var(--scale-factor));

			.paragraph {
				padding-block-start: 0;
				margin-block-start: 0;
			}
		}

		.game-summary .paragraph {
			font-size: calc(3.5rem * var(--scale-factor));
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		.game-summary .total-points {
			font-size: calc(6rem * var(--scale-factor));
		}

		.game-summary .cta {
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		/* Adjust finish small text for mobile */
		.finish-small {
			font-size: calc(1.5rem * var(--scale-factor));
			margin-block-start: calc(2rem * var(--scale-factor));
		}

		/* Adjust Game3SummaryHero for mobile */
		:global(.game3-summary-hero) {
			transform: scale(0.7);
			transform-origin: center center;
		}
	}
</style> 