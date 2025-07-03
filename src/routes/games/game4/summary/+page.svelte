<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { game4Store } from '$lib/stores/game4Store';
	import Game4SummaryHeroLeft from '$lib/components/svgs/Game4SummaryHeroLeft.svelte';
	import Game4SummaryHeroRight from '$lib/components/svgs/Game4SummaryHeroRight.svelte';

	onMount(() => {
		console.log('Summary page loaded, checking store state:', {
			isComplete: $game4Store.isComplete,
			currentIndex: $game4Store.currentStatementIndex,
			totalStatements: $game4Store.statements.length,
			score: $game4Store.score
		});
		
		// Add a small delay to ensure store state is properly loaded
		setTimeout(() => {
			console.log('After delay - isComplete:', $game4Store.isComplete);
			if (!$game4Store.isComplete) {
				console.log('Redirecting back to game because isComplete is false');
				goto('/games/game4');
			}
		}, 200);
	});

	function handleReplay() {
		game4Store.reset();
		game4Store.initialize();
		goto('/games/game4');
	}

	function handleFinish() {
		goto('/ranking');
	}
</script>

<div class="game-container">
	<img src="/images/game4-shape-incorrect.png" alt="" class="game4-shape game4-shape-incorrect">

    <div class="game-summary">
		<h2 class="title">This is your final score:</h2>

		<div class="results">
			<p class="paragraph">You made {$game4Store.incorrectSwipes} wrong choices.</p>
			<p class="paragraph">This means that you earn:</p>
			<p class="total-points">{$game4Store.score} points</p>

			<Game4SummaryHeroLeft />
			<Game4SummaryHeroRight />
		</div>

        <div class="cta">
            <button class="btn" on:click={handleReplay}>
                Replay
            </button>
            <button class="btn" on:click={handleFinish}>
                Finish
            </button>
        </div>

        <small class="finish-small">Remember, you can try again, but for the competition only <br> your first attempt will count!</small>
    </div>

	<img src="/images/game4-shape-correct.png" alt="" class="game4-shape game4-shape-correct">
</div>

<style lang="scss">
	.game-container {
		block-size: 100vh;
		display: grid;
		place-content: center;
	}

	.game-summary {
		max-inline-size: 90rem;
		position: relative;
		z-index: 1;
	}

	.game4-shape {
		inset-block-start: 50%;
		position: absolute;
		transform: translateY(-50%);
		z-index: -1;

		&-incorrect {
			inset-inline-start: 0;
		}

		&-correct {
			inset-inline-end: 0;
		}
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
		color: #FFC400;
		font-size: 8rem;
		font-weight: 600;
		line-height: normal;
		padding-block-start: 1rem;
	}

	.cta {
		display: flex;
		gap: 3rem;
		justify-content: center;
		padding-block-start: 5rem;
	}

	.btn {
		background-color: #fff;
		border-radius: 0 1.7rem;
		color: #2E2D2C;
		font-weight: 600;
		margin-inline: 0;
	}

	.finish-small {
		color: #fff;
		display: block;
		font-size: 2rem;
		font-weight: 600;
		line-height: normal;
		margin-block-start: 3rem;
		text-align: center;
	}
</style> 