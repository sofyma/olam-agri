<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { game4Store } from '$lib/stores/game4Store';
	import Game4SummaryHeroLeft from '$lib/components/svgs/Game4SummaryHeroLeft.svelte';
	import Game4SummaryHeroRight from '$lib/components/svgs/Game4SummaryHeroRight.svelte';
	import GameInstructions from '$lib/components/GameInstructions.svelte';

	let instructionsClosed = true; // Default to closed

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

<div class="game-container" class:sidebar-is-closed={instructionsClosed}>
	<GameInstructions 
		gameNumber={4}
		gameTitle="Brand Heroes"
		gameSubtitle="Choose<br>a Side"
		infoRoute="/games/info/4"
		bind:instructionsClosed
		primaryColor="#FFC400"
		backgroundColor="#2E2D2C"
		logoColor="#fff"
		gameIdTextColor="#2E2D2C"
		contentCheckBtnTextColor="#2E2D2C"
		paragraphs={[
			"All heroes face the battle between good and evil, with great power comes great responsibility!",
			"Now it's your turn: decide if each statement about layouts, templates, tone of voice, and brand design is right or wrong.",
			"You'll start with 5 points, but lose 1 for every wrong decision.",
			"Ready for the challenge? Hit Start!"
		]}
	/>

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

        <small class="finish-small">Remember, you can try again, but for the<br> competition only your first attempt will count!</small>
    </div>

	<img src="/images/game4-shape-correct.png" alt="" class="game4-shape game4-shape-correct">
</div>

<style lang="scss">
	:root {
		--scale-factor: 1;
	}

	@media (max-width: 1439px) {
		:root {
			--scale-factor: 0.85;
		}
	}

	@media (max-width: 1279px) {
		:root {
			--scale-factor: 0.75;
		}
	}

	@media (max-width: 1023px) {
		:root {
			--scale-factor: 0.65;
		}
	}

	@media (max-width: 767px) {
		:root {
			--scale-factor: 0.55;
		}
	}

	.game-container {
		block-size: 100vh;
		display: grid;
		place-content: center;
	}

	/* Game 4 specific logo styling */
	:global(.instructions .logo path) {
		fill: #fff;
	}

	.game-summary {
		max-inline-size: calc(90rem * var(--scale-factor));
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
		color: #FFC400;
		font-size: calc(8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		padding-block-start: 1rem;
	}

	.cta {
		display: flex;
		gap: calc(3rem * var(--scale-factor));
		justify-content: center;
		padding-block-start: calc(5rem * var(--scale-factor));
	}

	.btn {
		background-color: #fff;
		border-radius: 0 1.7rem;
		color: #2E2D2C;
		font-weight: 600;
		margin-inline: 0;
	}

	.finish-small {
		color: #000;
		display: block;
		font-size: 2rem;
		font-weight: 600;
		line-height: normal;
		margin-block-start: calc(3rem * var(--scale-factor));
		text-align: center;
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		/* Adjust game summary for mobile */
		.game-summary {
			padding: 2rem;
		}

		.game-summary .title {
			font-size: calc(5rem * var(--scale-factor));
		}

		.game-summary .results {
			inline-size: calc(80rem * var(--scale-factor));
			padding: 2rem;

			.paragraph {
				padding-block-start: 0;
				margin-block-start: 0;
			}
		}

		.game-summary .paragraph {
			font-size: calc(3.5rem * var(--scale-factor));
			padding-block-start: 2rem;
		}

		.game-summary .total-points {
			font-size: calc(6rem * var(--scale-factor));
		}

		.game-summary .cta {
			padding-block-start: 2rem;
		}

		/* Adjust finish small text for mobile */
		.finish-small {
			font-size: 1.5rem;
			margin-block-start: 2rem;
		}

		/* Adjust Game4SummaryHero components for mobile */
		:global(.game4-summary-hero-left),
		:global(.game4-summary-hero-right) {
			transform: scale(0.7);
			transform-origin: center center;
		}
	}
</style> 