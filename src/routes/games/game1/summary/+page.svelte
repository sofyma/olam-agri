<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { game1Store } from '$lib/stores/game1Store';
	import Game1Shape from '$lib/components/svgs/Game1Shape.svelte';
    import GameInstructions from '$lib/components/GameInstructions.svelte';

	let instructionsClosed = true;

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
	
			<GameInstructions
			gameNumber={1}
			gameTitle="Brand Heroes"
			gameSubtitle="The Super Power of Branding"
			infoRoute="/games/info/1"
			bind:instructionsClosed
			paragraphs={[
				"We often don't realise how much brands shape our global culture. Do you think that's an exaggeration? Let's find out!",
				"First, Vision Queen will show you some brands without their names. Will you recognise them?",
				"Then, she'll test you with images of iconic places around the world.",
				"Each brand you get right earns you 1 point. For each place you fail to recognise, you'll lose 1 point.",
				"What do you know better?"
			]}
		/>

	<img class="small-hero-summary" src="/images/heroe-1-2b.png" alt="Brand Heroes" />

	<div class="game-summary">
		<h2 class="title">This is your final score:</h2>

		<div class="results">
			<p class="paragraph">You missed {missedPlaces} places, so your<br>score is:</p>
			<p class="total-points">{totalScore} {totalScore === 1 ? 'point' : 'points'}</p>
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
		block-size: var(--full-height, 100vh);
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
			max-inline-size: calc(103.5rem * var(--scale-factor));
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
		border-radius: 0 30px;
		inline-size: 100%;
		margin-block-start: calc(3.5rem * var(--scale-factor));
		padding: calc(5rem * var(--scale-factor));
		text-align: center;
	}

	.paragraph {
		color: #000;
		font-size: calc(4.5rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.total-points {
		color: #FF7000;
		font-size: calc(8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.cta {
		font-weight: 600;
		padding-block-start: calc(7rem * var(--scale-factor));
	}

	.btn {
		margin-inline: auto;
		border-radius: 0 1.5rem;
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		/* Add scale system to shape SVG */
		:global(.shape) {
			transform: scale(0.6);
			transform-origin: top left;
		}

		.game-container {
			background-image: url('/images/j1-playing-screen-mobile.png');
			background-position: top left;
			background-size: cover;
		}

		/* Adjust game summary for mobile */
		.game-summary {
			padding: 2rem;
		}

		.game-summary .title {
			font-size: 3.2rem;
			line-height: normal
		}

		.game-summary .results {
			inline-size: 40.3rem;
			margin-block-start: 1rem;
			padding: 2rem 1rem 2.5rem;

			.paragraph {
				padding-block-start: 0;
				margin-block-start: 0;
			}
		}

		.game-summary .paragraph {
			font-size: 1.8rem;
			line-height: normal;
			padding-block-start: 2rem;

			br {
				display: none;
			}
		}

		.game-summary .total-points {
			font-size: 2.7rem;
			padding-block-start: 1.5rem;
		}

		.game-summary .cta {
			font-weight: 600;
			padding-block-start: 1.5rem;
		}

		/* Adjust small hero summary for mobile */
		:global(.small-hero-summary) {
			inset-block-start: calc(4rem * var(--scale-factor));
			inset-inline-start: calc(6rem * var(--scale-factor));
			transform: scale(0.7);
			display: none;
		}
	}

</style> 