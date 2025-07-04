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

        <small class="finish-small">Remember, you can try again, but for the competition only <br> your first attempt will count!</small>
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
	}

	.finish-small {
		block-size: calc(2rem * var(--scale-factor));
		color: #fff;
		display: block;
		font-size: calc(2rem * var(--scale-factor));
		margin-block-start: calc(3rem * var(--scale-factor));
		text-align: center;
	}
</style> 