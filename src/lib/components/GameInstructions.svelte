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

	<svelte:component this={LogoComponent} />

	<h1 class="title">{gameTitle}</h1>
		
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

<style lang="scss">
	.instructions {
		background-color: var(--bg-color, #2E2D2C);
		block-size: 100vh;
		border-radius: 0 calc(6rem * var(--scale-factor)) 0 0;
		inline-size: calc(100vw - 66.41%);
		inset-block-start: 0;
		inset-inline-start: 0;
		overflow-y: auto;
		padding: calc(5rem * var(--scale-factor)) calc(6rem * var(--scale-factor)) calc(9rem * var(--scale-factor));
		position: fixed;
		z-index: 9999;
		transition: transform 0.3s ease-in-out;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */

		&::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Opera */
		}

		&.closed {
			transform: translateX(calc(-100% + calc(5rem * var(--scale-factor))));
		}
	}

	.close-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		inset-block-start: calc(4rem * var(--scale-factor));
		inset-inline-end: calc(4rem * var(--scale-factor));
		padding: calc(1rem * var(--scale-factor));
		position: absolute;
		z-index: 10000;

		svg {
			block-size: calc(2.4rem * var(--scale-factor));
			inline-size: calc(2.3rem * var(--scale-factor));
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
		inset-inline-end: calc(.5rem * var(--scale-factor));
		padding: calc(1rem * var(--scale-factor));
		position: absolute;
		z-index: 10000;

		svg {
			block-size: calc(3.3rem * var(--scale-factor));
			inline-size: calc(2.7rem * var(--scale-factor));
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
		padding-block-start: calc(2rem * var(--scale-factor));
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
			padding-block-start: calc(2rem * var(--scale-factor));

			&:first-child {
				padding-block-start: calc(2.5rem * var(--scale-factor));
			}
		}
	}

	.copy {
		background-color: #fff;
		margin-block-start: calc(6.5rem * var(--scale-factor));
		padding: calc(2rem * var(--scale-factor)) calc(2rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
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
		border-radius: 0 calc(2rem * var(--scale-factor)) 0 calc(2rem * var(--scale-factor));
		block-size: calc(17rem * var(--scale-factor));
		color: var(--game-id-text-color, #fff);
		display: flex;
		flex-direction: column;
		inline-size: calc(11rem * var(--scale-factor));
		padding: calc(1rem * var(--scale-factor));
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
		gap: calc(2rem * var(--scale-factor));
		align-items: center;
	}

	.content-check-btn {
		width: calc(14.6rem * var(--scale-factor));
		height: calc(3.4rem * var(--scale-factor));
		border-radius: 0 calc(1.5rem * var(--scale-factor));
		color: var(--content-check-btn-text-color, #fff);
		background-color: var(--primary-color, #FF7000);
		border: none;
		font-size: calc(1.4rem * var(--scale-factor));
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;

		&:hover {
			opacity: 0.8;
		}
	}

	.content-check-text {
		color: #FFF;
		font-size: calc(1.4rem * var(--scale-factor));
		font-style: normal;
		font-weight: 400;
		line-height: calc(2rem * var(--scale-factor));
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		.instructions {
			inline-size: calc(100vw - 66.41%);
			padding: calc(3rem * var(--scale-factor)) calc(4rem * var(--scale-factor)) calc(6rem * var(--scale-factor));
			overflow-x: hidden;
			scrollbar-width: none; /* Firefox */
			-ms-overflow-style: none; /* Internet Explorer 10+ */
		}

		.instructions::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Opera */
		}

		.title {
			font-size: calc(4.5rem * var(--scale-factor));
			word-wrap: break-word;
			overflow-wrap: break-word;
		}

		.copy {
			margin-block-start: calc(4rem * var(--scale-factor));
			padding: calc(1.5rem * var(--scale-factor));
		}

		.copy-header {
			grid-template-columns: repeat(2, auto);
			grid-column-gap: calc(2rem * var(--scale-factor));
			margin-block-start: calc(-3rem * var(--scale-factor));
		}

		.game-id {
			block-size: calc(12rem * var(--scale-factor));
			inline-size: calc(8rem * var(--scale-factor));
		}

		.game-id .text {
			font-size: calc(2rem * var(--scale-factor));
			line-height: calc(2rem * var(--scale-factor));
		}

		.game-id .number {
			font-size: calc(9rem * var(--scale-factor));
			line-height: calc(9rem * var(--scale-factor));
		}

		.subtitle {
			font-size: calc(2.5rem * var(--scale-factor));
			word-wrap: break-word;
			overflow-wrap: break-word;
		}

		.content-check {
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		.content-check-grid {
			gap: calc(1.5rem * var(--scale-factor));
		}

		.content-check-btn {
			width: calc(12rem * var(--scale-factor));
			height: calc(3rem * var(--scale-factor));
			font-size: calc(1.2rem * var(--scale-factor));
		}

		.content-check-text {
			font-size: calc(1.2rem * var(--scale-factor));
			line-height: calc(1.6rem * var(--scale-factor));
		}

		.close-button {
			inset-block-start: calc(1rem * var(--scale-factor));
			inset-inline-end: calc(2rem * var(--scale-factor));
		}

		.play-button {
			inset-block-start: calc(2rem * var(--scale-factor));
			inset-inline-end: calc(-0.2rem * var(--scale-factor));
		}

		.instructions.closed {
			transform: translateX(calc(-100% + 4rem * var(--scale-factor)));
		}
	}
</style> 