<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import Game1Shape from '$lib/components/svgs/Game1Shape.svelte';
	import { game1Store } from '$lib/stores/game1Store';
	import GameInstructions from '$lib/components/GameInstructions.svelte';

	let instructionsClosed = true;

	onMount(() => {
		if (!$game1Store.isComplete) {
			goto('/games/game1');
		}
	});

	function openInstructions() {
		instructionsClosed = false;
	}

	function closeInstructions() {
		instructionsClosed = true;
	}

	function handleReplay() {
		game1Store.reset();
		game1Store.initialize();
		goto('/games/game1');
	}

	function handleFinish() {
		goto('/ranking');
	}
</script>

<div class="finish-container">
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

	<img class="game1-small-hero-finish" src="/images/heroe-1-3.png" alt="Brand Heroes" />


	<div class="finish-content">
		<div class="finish-text">
			<p>As you've just seen, brands have a powerful hold on our minds. Even without their names, you recognised many.</p>
			<p>That’s the true power of branding: when it’s done well, it stays with us and triggers feelings in us.</p>
			<p>Great brands achieve this because:</p>
			<ul>
				<li>They have a clear, unique identity</li>
				<li>They’re shown consistently</li>
				<li>And they create emotional connections</li>
			</ul>

			<cite>
				Let's make Olam Agri a well-known and respected brand worldwide!
			</cite>
		</div>

		<div class="finish-buttons">
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
	.finish-container {
		background-color: #FF7000;
		display: flex;
		justify-content: center;
		min-block-size: var(--full-height, 100vh);
		overflow: hidden;
		position: relative;
		padding-block-start: calc(10rem * var(--scale-factor));
		padding-block-end: calc(7rem * var(--scale-factor));

		:global(.shape) {
			inset-block-start: calc(-16rem * var(--scale-factor));
			inset-inline-end: calc(-28rem * var(--scale-factor));
			position: absolute;
		}
	}



	.finish-content {
		margin-inline: auto;
		max-inline-size: calc(96.5rem * var(--scale-factor));
		position: relative;
		z-index: 1;
	}

	.finish-text {
		width: 80%;
	}

	.finish-text p,
	.finish-text li {
		color: #2E2D2C;
		font-size: calc(3.2rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.finish-text ul {
		list-style: disc;
		padding-inline-start: 30px;
	}

	.finish-text p {
		padding-block-start: calc(4rem * var(--scale-factor));

		&:first-child {
			padding-block-start: 0;
		}
	}

	.finish-text cite {
		background-color: #fff;
		border-radius: 0 calc(3rem * var(--scale-factor));
		color: #FF5700;
		display: block;
		font-size: calc(4rem * var(--scale-factor));
		font-weight: 600;
		font-style: normal;
		line-height: normal;
		margin-block-start: calc(5rem * var(--scale-factor));
		padding: calc(3rem * var(--scale-factor));
		width: fit-content;
		margin-inline: auto;
	};

	.finish-small {
		color: #FFF;
		display: inline-block;
		font-size: 2rem;
		font-weight: 600;
		line-height: normal;
		padding-block-start: calc(2.5rem * var(--scale-factor));
	}

	.finish-buttons {
		display: flex;
		font-weight: 600;
		gap: calc(3rem * var(--scale-factor));
		padding-block-start: calc(4rem * var(--scale-factor));
	}

	.game1-small-hero-finish {
		inset-block-start: calc(10rem * var(--scale-factor));
		inset-inline-end: calc(14.5rem * var(--scale-factor));
		position: absolute;
		max-inline-size: calc(103.5rem * var(--scale-factor));
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		/* Add scale system to shape SVG */
		:global(.shape) {
			transform: scale(0.6);
			transform-origin: top left;
		}

		/* Adjust finish content for mobile */
		.finish-content {
			max-inline-size: 100%;
			padding: 0 4rem;
		}

		.finish-container {
			align-items: center;
			background-image: url('/images/Game1HeroSmallFinish.png');
			background-position: top right;
			background-repeat: no-repeat;
			background-size: contain;
			min-block-size: auto;
			padding-block: .5rem;
		}

		.finish-text p,
		.finish-text li {
			font-size: calc(2.5rem * var(--scale-factor));
		}

		.finish-text ul {
			margin-block-start: .6rem;
		}

		.finish-text p {
			padding-block-start: .6rem;
		}

		.finish-text cite {
			font-size: calc(2.5rem * var(--scale-factor));
			margin-block-start: 1rem;
			padding: 1rem;
			margin-inline: 0;
		}

		.finish-small {
			font-size: 1.5rem;
			padding-block-start: 1.5rem;
		}

		.finish-buttons {
			padding-block-start: 1.5rem;
		}

		/* Adjust small hero summary for mobile */
		:global(.game1-small-hero-finish) {
			inset-block-start: calc(4rem * var(--scale-factor));
			inset-inline-start: calc(6rem * var(--scale-factor));
			transform: scale(0.7);
			display: none;
		}
	}
</style> 




