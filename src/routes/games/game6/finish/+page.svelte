<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { game6Store } from '$lib/stores/game6Store';

	onMount(() => {
		console.log('Game 6 finish page loaded, checking store state:', {
			isComplete: $game6Store.isComplete,
			score: $game6Store.score
		});
		
		// Add a small delay to ensure store state is properly loaded
		setTimeout(() => {
			console.log('After delay - isComplete:', $game6Store.isComplete);
			if (!$game6Store.isComplete) {
				console.log('Redirecting back to game because isComplete is false');
				goto('/games/game6');
			}
		}, 200);
	});

	function handleReplay() {
		game6Store.reset();
		game6Store.initialize();
		goto('/games/game6');
	}

	function handleFinish() {
		goto('/ranking');
	}
</script>

<div class="game-container">
    <img src="/images/game6-shape-before-playing.png" alt="" class="game6-shape-before-playing">

    <div class="game-summary">
        <img src="/images/game6-hero-before-playing.png" alt="" class="game6-hero-before-playing">

		<div class="results">
			<p class="paragraph">Thank you for participating, you've earned</p>
			<p class="total-points">{$game6Store.score} points</p>
		</div>

        <div class="cta">
            <button class="btn" on:click={handleReplay}>
                Replay
            </button>
            <button class="btn" on:click={handleFinish}>
                Finish
            </button>
        </div>

        <small class="finish-small">Remember, you can try again, but for the<br> competition only your first attempt will count!</small>
    </div>
</div>

<style lang="scss">
	.game-container {
		block-size: 100vh;
		display: grid;
		place-content: center;
		padding-block-start: calc(10rem * var(--scale-factor));
	}

	.game-summary {
		max-inline-size: calc(90rem * var(--scale-factor));
		position: relative;
		z-index: 1;
	}

    .game6-shape-before-playing {
		inset-block-end: 20%;
		inset-inline-start: 50%;
		position: absolute;
		transform: translate(-50%, 20%);
		z-index: -1;
	}

	.game6-hero-before-playing {
        inset-block-start: calc(-15rem * var(--scale-factor));
        inset-inline-start: 55%;
        transform: translateX(-55%);
		position: absolute;
        z-index: 1;
	}

	.results {
		background-color: #fff;
		border-radius: 0 calc(3rem * var(--scale-factor));
		inline-size: 100%;
		margin-block-start: calc(3.5rem * var(--scale-factor));
		padding: calc(24rem * var(--scale-factor)) calc(5rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
		text-align: center;
		position: relative;
	}

	@media (min-width: 1440px) and (max-width: 1599px) {
		.results {
			padding: calc(30rem * var(--scale-factor)) calc(5rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
		}
	}

	.paragraph {
		color: #000;
		font-size: calc(4.5rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.total-points {
		color: #00A865;
		font-size: calc(8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		padding-block-start: calc(1rem * var(--scale-factor));
	}

	.cta {
		display: flex;
		gap: calc(3rem * var(--scale-factor));
		justify-content: center;
		padding-block-start: calc(5rem * var(--scale-factor));
	}

	.btn {
		background-color: #fff;
		border-radius: 0 calc(1.7rem * var(--scale-factor));
		color: #00A865;
		font-weight: 600;
		margin-inline: 0;
	}

	.finish-small {
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

		/* Hide game6 hero on mobile */
		.game6-hero-before-playing {
			display: none;
		}
	}
</style> 