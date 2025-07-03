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
			<p class="paragraph">Thank you for participating, you've earned.</p>
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

        <small class="finish-small">Remember, you can try again, but for the competition only <br> your first attempt will count!</small>
    </div>
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

    .game6-shape-before-playing {
		inset-block-end: 20%;
		inset-inline-start: 50%;
		position: absolute;
		transform: translate(-50%, 20%);
		z-index: -1;
	}

	.game6-hero-before-playing {
        inset-block-start: -10rem;
        inset-inline-start: 55%;
        transform: translateX(-55%);
		position: absolute;
        z-index: 1;
	}

	.results {
		background-color: #fff;
		border-radius: 0 3rem;
		inline-size: 100%;
		margin-block-start: 3.5rem;
		padding: 24rem 5rem 5rem;
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
		color: #00A865;
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
		color: #00A865;
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