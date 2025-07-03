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
	<Game2Shape />

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

		:global(.shape) {	
			inset-block-start: -10rem;
			inset-inline-start: -20rem;
			position: absolute;

			@media(width > 1600px) {
				inset-block-start: 0;
			}
		}
	}

	.game-summary {
		max-inline-size: 90rem;
		position: relative;
		z-index: 1;
	}

	.title {
		color: #fff;
		font-size: 7rem;
		font-weight: 600;
		text-align: center;
	}

	.results {
		background-color: #fff;
		border-radius: 0 3rem;
		inline-size: 100%;
		margin-block-start: 3.5rem;
		padding: 5rem;
		text-align: center;
		position: relative;
	}

	.paragraph {
		color: #000;
		font-size: 4.5rem;
		font-weight: 600;
		line-height: normal;
	}

	.total-points {
		color: #8E75F8;
		font-size: 8rem;
		font-weight: 600;
		line-height: normal;
	}

	.cta {
		display: flex;
		gap: 3rem;
		justify-content: center;
		padding-block-start: 7rem;
	}

	.btn {
		color: #8E75F8;
		margin-inline: 0;
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