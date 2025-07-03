<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { game1Store } from '$lib/stores/game1Store';
    import Game1Shape from '$lib/components/svgs/Game1Shape.svelte';
    import Game1SmallHeroSummary from '$lib/components/svgs/Game1SmallHeroSummary.svelte';

	$: totalScore = $game1Store.brandScore + $game1Store.placeScore;
	$: missedPlaces = Math.abs($game1Store.placeScore);

	onMount(() => {
		if (!$game1Store.isComplete) {
			goto('/games/game1');
		}
	});
</script>

<div class="game-container">
	<Game1Shape />
	<Game1SmallHeroSummary />

    <div class="game-summary">
		<h2 class="title">This is your final score:</h2>

		<div class="results">
			<p class="paragraph">You missed {missedPlaces} places, so your score is now reduced to:</p>
			<p class="total-points">{totalScore} points</p>
		</div>

        <div class="cta">
            <button class="btn btn-cta2" on:click={() => goto('/games/game1/finish')}>
                Continue
            </button>
        </div>
    </div>
</div>

<style lang="scss">
	.game-container {
		block-size: 100vh;
		display: grid;
		place-content: center;

		:global(.shape) {	
			inset-block-start: 0;
			inset-inline-start: 0;
			position: absolute;
		}

		:global(.small-hero-summary) {
			inset-block-start: 8rem;
   			inset-inline-start: 11.5rem;
			position: absolute;
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
		border-radius: 3.5rem;
		inline-size: 100%;
		margin-block-start: 3.5rem;
		padding: 5rem;
		text-align: center;
	}

	.paragraph {
		color: #000;
		font-size: 4.5rem;
	}

	.total-points {
		color: #FF7000;
		font-size: 8rem;
		font-weight: 600;
		line-height: normal;
	}

	.cta {
		padding-block-start: 7rem;
	}

	.btn {
		margin-inline: auto;
	}
</style> 