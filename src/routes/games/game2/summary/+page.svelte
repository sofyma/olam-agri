<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { game2Store } from '$lib/stores/game2Store';
    import Game2Shape from '$lib/components/svgs/Game2Shape.svelte';
	import Game2SummaryHero from '$lib/components/svgs/Game2SummaryHero.svelte';

	onMount(() => {
		if (!$game2Store.isComplete) {
			goto('/games/game2');
		}
	});

	function handleReplay() {
		game2Store.reset();
		game2Store.initialize();
		goto('/games/game2');
	}

	function handleFinish() {
		goto('/ranking');
	}
</script>

<div class="game-container">
	<img src="/images/game2-summary-shape.png" alt="Shape" class="shape">

    <div class="game-summary">
		<h2 class="title">This is your final score:</h2>

		<div class="results">
			<p class="paragraph">Congratulations, you destroyed {$game2Store.destroyedLies} lies. However, you also destroyed {$game2Store.destroyedTruths} truths. This gives you a total of:</p>
			<p class="total-points">{$game2Store.score} points</p>

			<Game2SummaryHero />
		</div>

        <div class="cta">
            <button class="btn btn-cta2" on:click={handleReplay}>
                Replay
            </button>
            <button class="btn btn-cta2" on:click={handleFinish}>
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

		.shape {
			inset-block-start: 0;
			inset-inline-start: 50%;
			position: absolute;
			transform: translateX(-50%);
		}
	}

	.game-summary {
		max-inline-size: calc(90rem * var(--scale-factor));
		position: relative;
		z-index: 1;
	}

	.title {
		color: #fff;
		font-size: calc(7rem * var(--scale-factor));
		font-weight: 600;
		text-align: center;
	}

	.results {
		background-color: #fff;
		border-radius: 0 calc(3rem * var(--scale-factor));
		inline-size: 100%;
		margin-block-start: calc(3.5rem * var(--scale-factor));
		padding: calc(5rem * var(--scale-factor));
		text-align: center;
		position: relative;
	}

	.paragraph {
		color: #000;
		font-size: calc(4.5rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.total-points {
		color: #8E75F8;
		font-size: calc(8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.cta {
		display: flex;
		gap: calc(3rem * var(--scale-factor));
		justify-content: center;
		padding-block-start: calc(7rem * var(--scale-factor));
	}

	.btn {
		color: #8E75F8;
		margin-inline: 0;
		border-radius: 0 calc(1.7rem * var(--scale-factor));
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
		/* Add scale system to shape SVG */
		.shape {
			transform: scale(0.6);
			transform-origin: top center;
		}

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

		/* Adjust Game2SummaryHero for mobile */
		:global(.game2-summary-hero) {
			transform: scale(0.7);
			transform-origin: center center;
		}
	}
</style> 