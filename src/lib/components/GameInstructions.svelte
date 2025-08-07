<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
	import Game5Logo from '$lib/components/svgs/Game5Logo.svelte';
	import Game2Hero from '$lib/components/svgs/Game2Hero.svelte';
	import Game3SummaryHero from '$lib/components/svgs/Game3SummaryHero.svelte';

	export let gameNumber: number;
	export let gameTitle: string;
	export let gameSubtitle: string;
	export let primaryColor: string = '#FF7000'; // Default orange
	export let backgroundColor: string = '#2E2D2C'; // Default dark gray
	export let logoColor: string = '#fff'; // Default white
	export let gameIdTextColor: string = '#fff'; // Default white
	export let contentCheckBtnTextColor: string = '#fff'; // Default white

	export let infoRoute: string;
	export let instructionsClosed: boolean = true;
	export let paragraphs: string[] = [];

	const dispatch = createEventDispatcher();

	function openInstructions() {
		instructionsClosed = false;
		dispatch('open');
	}

	function closeInstructions() {
		instructionsClosed = true;
		dispatch('close');
	}

	function handleInfoClick() {
		goto(infoRoute);
	}

	$: logoComponent = Game1Logo; // Always use Game1Logo for all games

	$: LogoComponent = logoComponent;
</script>

<div class="instructions" class:closed={instructionsClosed} style="--primary-color: {primaryColor}; --bg-color: {backgroundColor}; --logo-color: {logoColor}; --game-id-text-color: {gameIdTextColor}; --content-check-btn-text-color: {contentCheckBtnTextColor};">
	{#if !instructionsClosed}
		<button class="close-button" on:click={closeInstructions}>
			<svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<line x1="0.353553" y1="0.646447" x2="22.3536" y2="22.6464" stroke="white"/>
				<line x1="22.3536" y1="1.35355" x2="0.353554" y2="23.3536" stroke="white"/>
			</svg>
		</button>
	{:else}
		<button class="play-button" on:click={openInstructions}>
			<svg width="27" height="33" viewBox="0 0 27 33" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M27 16.5L0.749998 32.5215L0.75 0.47853L27 16.5Z" fill="white"/>
			</svg>
		</button>
	{/if}

	<!-- Fixed header section -->
	<div class="instructions-header">
		<svelte:component this={LogoComponent} />
		<h1 class="title">{gameTitle}</h1>
	</div>
		
	<!-- Scrollable content section -->
	<div class="instructions-content">
		<div class="copy">
			<div class="copy-header">
				<div class="game-id">
					<span class="text">Game</span>
					<span class="number">{gameNumber}</span>
				</div>

				<h2 class="subtitle">{@html gameSubtitle}</h2>
			</div>

			<div class="game-instruction-copy">
				{#each paragraphs as paragraph}
					<p>{paragraph}</p>
				{/each}
			</div>
		</div>

		<div class="content-check">
			<div class="content-check-grid">
				<button class="content-check-btn" on:click={handleInfoClick}>
					Check content
				</button>
				<div class="content-check-text">
					Have you read the related content?<br>
					You'll do better in the game if you check it first!
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.instructions {
		background-color: var(--bg-color, #2E2D2C);
		block-size: var(--full-height, 100vh);
		border-radius: 0 calc(6rem * var(--scale-factor)) 0 0;
		inline-size: calc(100vw - 66.41%);
		inset-block-start: 0;
		inset-inline-start: 0;
		position: fixed;
		z-index: 9999;
		transition: transform 0.3s ease-in-out;
		display: flex;
		flex-direction: column;

		&.closed {
			transform: translateX(calc(-100% + calc(5rem * var(--scale-factor))));
		}
	}

	.instructions-header {
		flex-shrink: 0;
		padding: calc(5rem * var(--scale-factor)) calc(6rem * var(--scale-factor)) 0;
	}

	.instructions-content {
		flex: 1;
		overflow-y: auto;
		padding: 0 calc(6rem * var(--scale-factor)) calc(9rem * var(--scale-factor));
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		inset-block-start: calc(4rem * var(--scale-factor));
		inset-inline-end: calc(4rem * var(--scale-factor));
		padding: 1rem;
		position: absolute;
		z-index: 10000;

		svg {
			block-size: 2.4rem;
			inline-size: 2.3rem;
		}

		&:hover {
			opacity: 0.8;
		}
	}

	.play-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		inset-block-start: calc(3rem * var(--scale-factor));
		inset-inline-end: .6rem;
		position: absolute;
		z-index: 10000;

		@media(min-width: 1920px) {
			inset-inline-end: 1.2rem;
		}

		svg {
			block-size: 3.3rem;
			inline-size: 2.7rem;

			@media(max-width: 932px) {
				block-size: 2.3rem;
				inline-size: 1.7rem;
			}
		}

		&:hover {
			opacity: 0.8;
		}
	}

	.title {
		color: var(--primary-color, #FF7000);
		font-size: calc(6rem * var(--scale-factor));
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		padding-block-start: 2rem;
	}

	.subtitle {
		color: var(--primary-color, #FF7000);
		font-size: calc(3.7rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.game-instruction-copy {
		p {
			color: #2E2D2C;
			font-size: calc(2.2rem * var(--scale-factor));
			padding-block-start: 2rem;

			&:first-child {
				padding-block-start: calc(2.5rem * var(--scale-factor));
			}
		}
	}

	.copy {
		background-color: #fff;
		margin-block-start: calc(6.5rem * var(--scale-factor));
		padding: 2rem 2rem calc(4rem * var(--scale-factor));
		position: relative;

		&-header {
			align-items: end;
			display: grid;
			justify-content: start;
			grid-template-columns: repeat(2, auto);
			grid-column-gap: calc(3rem * var(--scale-factor));
			margin-block-start: calc(-5rem * var(--scale-factor));
		}
	}

	.game-id {
		align-items: center;
		background-color: var(--primary-color, #FF7000);
		border-radius: 0 2rem 0 2rem;
		block-size: calc(17rem * var(--scale-factor));
		color: var(--game-id-text-color, #fff);
		display: flex;
		flex-direction: column;
		inline-size: 11rem;
		padding: 1rem;
		text-align: center;

		.text {
			font-size: calc(2.8rem * var(--scale-factor));
			font-weight: 600;
			line-height: calc(2.8rem * var(--scale-factor));
		}

		.number {
			font-size: calc(13.7rem * var(--scale-factor));
			font-weight: 600;
			line-height: calc(13.7rem * var(--scale-factor));
		}
	}

	.content-check {
		padding-block-start: calc(2.7rem * var(--scale-factor));
	}

	.content-check-grid {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2rem;
		align-items: center;
	}

	.content-check-btn {
		width: 14.6rem;
		height: 3.4rem;
		border-radius: 0 1.5rem;
		color: var(--content-check-btn-text-color, #fff);
		background-color: var(--primary-color, #FF7000);
		border: none;
		font-size: 1.4rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;

		&:hover {
			opacity: 0.8;
		}
	}

	.content-check-text {
		color: #FFF;
		font-size: 1.4rem;
		font-style: normal;
		font-weight: 400;
		line-height: 2rem;
	}

	@media (max-width: 932px) {
		.instructions {
			inline-size: calc(100vw - 66.41%);
			overflow-x: hidden;
		}

		.instructions-header {
			padding: calc(3rem * var(--scale-factor)) calc(4rem * var(--scale-factor)) 0;
		}

		.instructions-content {
			padding: 0 calc(4rem * var(--scale-factor)) calc(6rem * var(--scale-factor));
		}

		.title {
			font-size: calc(4.5rem * var(--scale-factor));
			word-wrap: break-word;
			overflow-wrap: break-word;
			padding-block-start: 0;
		}

		.copy {
			margin-block-start: calc(4rem * var(--scale-factor));
			padding: 1.5rem;
		}

		.copy-header {
			grid-template-columns: repeat(2, auto);
			grid-column-gap: 1rem;
			margin-block-start: -3rem;
		}

		.game-id {
			//block-size: 12rem;
			block-size: auto;
			inline-size: 5rem;
		}

		.game-id .text {
			font-size: 1.2rem;
			line-height: normal
		}

		.game-id .number {
			font-size: calc(9rem * var(--scale-factor));
			line-height: calc(9rem * var(--scale-factor));
		}

		.game-instruction-copy {
			p {
				padding-block-start: 1rem;
			}
		}

		.subtitle {
			font-size: calc(2.4rem * var(--scale-factor));
			word-wrap: break-word;
			overflow-wrap: break-word;
		}

		.content-check {
			padding-block-start: 2rem;
		}

		.content-check-grid {
			gap: 1.5rem;
			grid-template-columns: 1fr;
		}

		.content-check-btn {
			width: 12rem;
			height: 3rem;
			font-size: 1.2rem;
		}

		.content-check-text {
			font-size: 1.2rem;
			line-height: 1.6rem;
		}

		.close-button {
			inset-block-start: 1rem;
			inset-inline-end: 2rem;
		}

		.play-button {
			inset-block-start: 2rem;
			inset-inline-end: .5rem;
		}

		.instructions.closed {
			transform: translateX(calc(-100% + 4rem * var(--scale-factor)));
		}
	}
</style> 