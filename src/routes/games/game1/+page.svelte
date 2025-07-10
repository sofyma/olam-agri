<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game1Store } from '$lib/stores/game1Store';
    import { game1Availability } from '$lib/stores/gameAvailabilityStore';
    import { Game1Service } from '$lib/services/game1Service';
    import Question from '$lib/components/games/game1/Question.svelte';
    import type { Question as QuestionType } from '$lib/types/game1';
	import Game1SmallHero from '$lib/components/svgs/Game1SmallHero.svelte';
	import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
	import Game1Shape from '$lib/components/svgs/Game1Shape.svelte';
	import Game1Hero from '$lib/components/svgs/Game1Hero.svelte';
	import Game1SmallHeroSummary from '$lib/components/svgs/Game1SmallHeroSummary.svelte';
    
    let currentQuestion: QuestionType;
    let showFeedback = false;
    let feedbackState = {
        isCorrect: false,
        message: ''
    };
    let isLoading = true;
    let error: string | null = null;
	let showInstructions = true;
	let instructionsClosed = false;
	let instructionsClosedSidebar = false;
    
    const gameService = Game1Service.getInstance();
    
    onMount(async () => {
        try {
            // Check if game is available
            if (!$game1Availability.isAvailable) {
                goto('/games/info/1');
                return;
            }

			game1Store.initialize();
            await gameService.loadQuestions();
            isLoading = false;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load game content';
            isLoading = false;
        }
    });
    
	function startGame() {
		showInstructions = false;
		instructionsClosed = true;
		instructionsClosedSidebar = true;
		game1Store.start();
	}

	function closeInstructions() {
		instructionsClosed = true;
		instructionsClosedSidebar = true;
	}

	function openInstructions() {
		instructionsClosed = false;
		instructionsClosedSidebar = false;
	}

	$: if ($game1Store.isComplete) {
		goto('/games/game1/summary');
	}

	function handleContinue() {
		game1Store.continueToPlaces();
	}

	$: currentQuestion = $game1Store.questions[$game1Store.currentQuestionIndex];
    
    function handleQuestionSubmit(event: CustomEvent<{ answer: string; isCorrect: boolean }>) {
        const { answer, isCorrect } = event.detail;
        
        showFeedback = true;
        feedbackState = {
            isCorrect,
            message: isCorrect ? 'Correct!' : 'Incorrect!'
        };

        setTimeout(() => {
            showFeedback = false;
            game1Store.answerQuestion(answer);
        }, 2000);
    }
</script>

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar}>
	<Game1Shape />
        
	{#if showInstructions}
		<div class="game-panel">
			<div class="instructions" class:closed={instructionsClosed}>
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

				<Game1Logo />

				<h1 class="title">Brand Heroes</h1>
					
				<div class="copy">
					<div class="copy-header">
						<div class="game-id">
							<span class="text">Game</span>
							<span class="number">1</span>
						</div>

						<h2 class="subtitle">The Superpower of Branding</h2>
					</div>

					<p class="paragraph">We often don't realise how much brands shape our global culture. Do you think that's an exaggeration? Let's find out!</p>
					<p class="paragraph">First, Vision Queen will show you some brands without their names. Will you recognise them?</p>
					<p class="paragraph">Then, she'll test you with images of iconic places around the world.</p>
					<p class="paragraph">Each brand you get right earns you 1 point. For each place you fail to recognise, you'll lose 1 point.</p>
					<p class="paragraph">What do you know better?</p>
				</div>

				<div class="content-check">
					<div class="content-check-grid">
						<button class="content-check-btn" on:click={() => goto('/games/info/1')}>
							Check content
						</button>
						<div class="content-check-text">
							Have you read the related content?<br>
							You'll do better in the game if you check it first!
						</div>
					</div>
				</div>
			</div>

			<div class="start-screen">
				<div class="start-screen-content">
					<button on:click={startGame} class="game1-initial-screen-button">
						<img src="/images/game1-initial-screen-image.png" alt="Game 1 Start Screen" class="game1-initial-screen-image">
					</button>
				</div>
			</div>
		</div>

	{:else if $game1Store.brandPhaseComplete}
		<Game1SmallHeroSummary />

		<div class="game-summary">
			<h2 class="title">Let's see how you did:</h2>

			<div class="results">
				<p class="paragraph">You've identified {$game1Store.brandScore} brands so, for now, you've earned</p>
				<p class="total-points">{$game1Store.brandScore} points</p>
			</div>

			<p class="paragraph" style="line-height: normal; padding-block-start: 4rem; text-align: center;">Let's see if you know the <br> real world so well!</p>

			<div class="cta">
				<button class="btn btn-cta2" on:click={handleContinue}>
					Continue
				</button>
			</div>
		</div>

	{:else if $game1Store.isLoading}
		<div class="loading">Loading questions...</div>

	{:else if $game1Store.error}
		<div class="error">{$game1Store.error}</div>

	{:else if !$game1Store.isComplete}
		<div class="instructions" class:closed={instructionsClosed}>
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

			<Game1Logo />

			<h1 class="title">Brand Heroes</h1>
				
			<div class="copy">
				<div class="copy-header">
					<div class="game-id">
						<span class="text">game</span>
						<span class="number">1</span>
					</div>

					<h2 class="subtitle">The Superpower of Branding</h2>
				</div>

				<p class="paragraph">We often don't realise how much brands shape our global culture. Do you think that's an exaggeration? Let's find out!</p>
				<p class="paragraph">First, Vision Queen will show you some brands without their names. Will you recognise them?</p>
				<p class="paragraph">Then, she'll test you with images of iconic places around the world.</p>
				<p class="paragraph">Each brand you get right earns you 1 point. For each place you fail to recognise, you'll lose 1 point.</p>
				<p class="paragraph">What do you know better?</p>
			</div>

			<div class="content-check">
				<div class="content-check-grid">
					<button class="content-check-btn" on:click={() => goto('/games/info/1')}>
						Check content
					</button>
					<div class="content-check-text">
						Have you read the related content?<br>
						You'll do better in the game if you check it first!
					</div>
				</div>
			</div>
		</div>

		<div class="game-grid">
			<div class="game-header">
				<Game1SmallHero />
				
				<h2 class="game-header-title">
					{$game1Store.currentSet === 'brands' ? 'Do You Recognise These Brands?' : 'Do You Recognise These Places?'}
				</h2>

				{#if $game1Store.currentSet === 'brands'}
					<p class="game-header-paragraph">You'll earn 1 point for each correct answer.</p>
				{:else}
					<p class="game-header-paragraph">For each wrong guess you will lose 1 point.</p>
				{/if}
			</div>

			{#if currentQuestion}
				<div class="question-wrapper">
					<Question
						question={currentQuestion}
						showFeedback={showFeedback}
						isCorrect={feedbackState.isCorrect}
						questionType={$game1Store.currentSet === 'brands' ? 'brand' : 'place'}
						currentQuestionNumber={$game1Store.currentSet === 'brands'
							? $game1Store.currentQuestionIndex + 1
							: $game1Store.currentQuestionIndex - 8}
						totalQuestions={9}
						on:submit={handleQuestionSubmit}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
    .game-container {
		background-color: #FF7000;
		position: relative;

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

	.game-header {
		padding: 0 calc(7rem * var(--scale-factor)) calc(7rem * var(--scale-factor));
		position: relative;
	}

	.game-header-title {
		color: #fff;
		font-size: calc(4.8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	
	.game-header-paragraph {
		color: #fff;
		font-size: calc(2.8rem * var(--scale-factor));
		line-height: normal;
		padding-block-start: calc(1rem * var(--scale-factor));
	}

	.game-panel {
		position: relative;
	}

	.game-grid {
		align-items: end;
		display: grid;
		grid-template-columns: calc(55rem * var(--scale-factor)) 1fr;
		position: relative;
	}

	.game-id {
		align-items: center;
		background-color: #FF7000;
		border-radius: 0 calc(2rem * var(--scale-factor)) 0 calc(2rem * var(--scale-factor));
		block-size: calc(17rem * var(--scale-factor));
		color: #fff;
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
			line-height: calc(13.7rem * var(--scale-factor))
		}
	}

	.title {
		color: #FF7000;
		font-size: calc(6rem * var(--scale-factor));
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		padding-block-start: calc(2rem * var(--scale-factor));
	}

	.subtitle {
		color: #FF7000;
		font-size: calc(3.7rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.paragraph {
		color: #2E2D2C;
		font-size: calc(2.2rem * var(--scale-factor));
		line-height: normal;
		padding-block-start: calc(2rem * var(--scale-factor));

		&:first-child {
			padding-block-start: calc(2.5rem * var(--scale-factor))
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
			grid-template-columns: repeat(2, auto);
			grid-column-gap: calc(3rem * var(--scale-factor));
			margin-block-start: calc(-5rem * var(--scale-factor));
		}
	}

	.instructions {
		background-color: #2E2D2C;
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

		&.closed {
			transform: translateX(calc(-100% + calc(5rem * var(--scale-factor))));
		}
	}
	
	.start-screen {
		align-items: center;
		block-size: 100vh;
		display: flex;
		justify-content: center;
		inline-size: calc(100vw - (100vw - 66.41%));
		//padding-inline-end: 6rem;
		margin-inline-start: auto;
		
		div {
			position: relative;
		}
	}

	.start-screen-content {
		transform: scale(var(--scale-factor));
		transform-origin: center center;
	}

	// .start {
	// 	inset-block-end: calc(12rem * var(--scale-factor));
	// 	inset-inline-end: 0;
	// 	position: absolute;

	// 	svg {
	// 		block-size: calc(39.6rem * var(--scale-factor));
	// 		inline-size: calc(39.6rem * var(--scale-factor));
	// 	}
	// }

	.game-summary {
		align-items: center;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-block-size: 100vh;
		position: relative;
		text-align: center;
		z-index: 1;

		.title {
			color: #fff;
			font-size: calc(7rem * var(--scale-factor));
			font-weight: 600;
		}

		.results {
			background-color: #fff;
			border-radius: calc(3.5rem * var(--scale-factor));
			inline-size: calc(90rem * var(--scale-factor));
			margin-block-start: calc(3.5rem * var(--scale-factor));
			padding: calc(5rem * var(--scale-factor));
		}

		.paragraph {
			color: #000;
			font-size: calc(4.5rem * var(--scale-factor));
		}

		.total-points {
			color: #FF7000;
			font-size: calc(8rem * var(--scale-factor));
			font-weight: 600;
			line-height: normal;
		}

		.cta {
			padding-block-start: calc(7rem * var(--scale-factor));
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

	.sidebar-is-closed .start-screen {
		inline-size: 100%;
	}

	// .vision-queen-container {
	// 	inset-block-end: calc(-11rem * var(--scale-factor));
	// 	inset-inline-start: 0;
	// 	max-inline-size: calc(26rem * var(--scale-factor));
	// 	position: absolute !important;
	// }

	// .vision-queen-title {
	// 	color: #000;
	// 	font-size: calc(3rem * var(--scale-factor));
	// 	font-weight: 600;
	// 	line-height: normal;
	// }

	// .vision-queen-copy {
	// 	color: #000;
	// 	font-size: calc(1.8rem * var(--scale-factor));
	// 	font-weight: 600;
	// 	line-height: normal;
	// }

	.question-wrapper {
		padding-block: calc(7rem * var(--scale-factor));
		padding-inline: 0 calc(7rem * var(--scale-factor));
	}

	/* Content check section */
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
		color: #fff;
		background-color: #FF7000;
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
		font-family: Gilroy-Regular;
		font-size: calc(1.4rem * var(--scale-factor));
		font-style: normal;
		font-weight: 400;
		line-height: calc(2rem * var(--scale-factor));
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		/* 1. Fix left sidebar title and horizontal scroll */
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

		/* 2. Fix sidebar horizontal scroll */
		.copy {
			margin-block-start: calc(4rem * var(--scale-factor));
			padding: calc(1.5rem * var(--scale-factor));
		}

		.copy-header {
			grid-template-columns: repeat(2, auto);
			grid-column-gap: calc(2rem * var(--scale-factor));
			margin-block-start: calc(-3rem * var(--scale-factor));
		}

		/* 3. Keep content text size as requested */
		.paragraph {
			font-size: calc(2.2rem * var(--scale-factor));
		}

		/* 4. Add scale system to shape SVG */
		:global(.shape) {
			transform: scale(0.6);
			transform-origin: top left;
		}

		/* 5. Fix game header SVG and shape scaling */
		.game-header {
			padding: 0 calc(4rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		}

		/* Fix game header SVG sizing */
		.game-header :global(svg) {
			max-width: 100%;
			width: 100%;
			height: calc(30rem * var(--scale-factor));
			inset-block-start: 0;
			inset-inline-start: 0;
		}

		.game-header-title {
			font-size: calc(3.5rem * var(--scale-factor));
		}

		.game-header-paragraph {
			font-size: calc(2.4rem * var(--scale-factor));
		}

		/* 6. Fix question container positioning and scaling */
		.game-grid {
			grid-template-columns: calc(55rem * var(--scale-factor)) 1fr;
			align-items: start;
			padding: calc(2rem * var(--scale-factor));
		}
		

		/* Question wrapper for mobile - reset padding */
		.question-wrapper {
			padding-block: 0;
		}

		/* 7. Adjust start screen for mobile */
		.start-screen {
			inline-size: calc(100vw - (100vw - 66.41%));
			padding: calc(1rem * var(--scale-factor));
		}

		/* Keep start screen width consistent when sidebar is closed */
		.sidebar-is-closed .start-screen {
			inline-size: calc(100vw - (100vw - 66.41%));
		}

		.start-screen-content {
			transform-origin: center center;
		}

		/* Remove vertical scrolling from start screen */
		.start-screen {
			overflow-y: hidden;
		}

		/* Adjust game summary for mobile */
		.game-summary {
			padding: calc(2rem * var(--scale-factor));
		}

		.game-summary .title {
			font-size: calc(5rem * var(--scale-factor));
		}

		.game-summary .results {
			inline-size: calc(80rem * var(--scale-factor));
			padding: calc(2rem * var(--scale-factor));

			.paragraph {
				padding-block-start: 0;
				margin-block-start: 0;
			}
		}

		.game-summary .paragraph {
			font-size: calc(3.5rem * var(--scale-factor));
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		.game-summary .total-points {
			font-size: calc(6rem * var(--scale-factor));
		}

		.game-summary .cta {
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		/* Adjust game ID for mobile */
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

		/* Adjust subtitle for mobile */
		.subtitle {
			font-size: calc(2.5rem * var(--scale-factor));
			word-wrap: break-word;
			overflow-wrap: break-word;
		}

		/* Content check section */
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
			color: #fff;
			background-color: #FF7000;
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
			font-family: Gilroy-Regular;
			font-size: calc(1.4rem * var(--scale-factor));
			font-style: normal;
			font-weight: 400;
			line-height: calc(2rem * var(--scale-factor));
		}

		/* Adjust vision queen container for mobile */
		// .vision-queen-container {
		// 	inset-block-end: calc(13rem * var(--scale-factor));
		// 	max-inline-size: 100%;
		// }

		// .vision-queen-title {
		// 	font-size: calc(2.5rem * var(--scale-factor));
		// }

		// .vision-queen-copy {
		// 	font-size: calc(2.2rem * var(--scale-factor));
		// }

		/* Adjust buttons for mobile */
		.close-button {
			inset-block-start: calc(1rem * var(--scale-factor));
			inset-inline-end: calc(2rem * var(--scale-factor));
		}

		.play-button {
			inset-block-start: calc(2rem * var(--scale-factor));
			inset-inline-end: calc(-0.2rem * var(--scale-factor));
		}

		/* Adjust start button for mobile */
		// .start {
		// 	inset-block-start: calc(22rem * var(--scale-factor));
		// 	inset-inline-end: calc(-2rem * var(--scale-factor));
		// }

		// .start svg {
		// 	block-size: calc(30rem * var(--scale-factor));
		// 	inline-size: calc(30rem * var(--scale-factor));
		// }

		/* Fix sidebar closed state for mobile */
		.instructions.closed {
			transform: translateX(calc(-100% + 4rem * var(--scale-factor)));
		}

		/* Adjust small hero summary for mobile */
		:global(.small-hero-summary) {
			inset-block-start: calc(4rem * var(--scale-factor));
			inset-inline-start: calc(6rem * var(--scale-factor));
			transform: scale(0.7);
			display: none;
		}

		.game1-initial-screen-button {
			background: none;
			border: none;
			padding: 0;
			cursor: pointer;
		}

		/* Content check section mobile adjustments */
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
	}
</style> 