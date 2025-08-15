<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game1Store } from '$lib/stores/game1Store';
    import { game1Availability, gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
    import { Game1Service } from '$lib/services/game1Service';
    import Question from '$lib/components/games/game1/Question.svelte';
    import type { Question as QuestionType } from '$lib/types/game1';
	import Game1SmallHero from '$lib/components/svgs/Game1SmallHero.svelte';
	import Game1Shape from '$lib/components/svgs/Game1Shape.svelte';
	import Game1Hero from '$lib/components/svgs/Game1Hero.svelte';
	import Game1SmallHeroSummary from '$lib/components/svgs/Game1SmallHeroSummary.svelte';
	import GameInstructions from '$lib/components/GameInstructions.svelte';
    
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
	let isGamePlaying = false;

    
    const gameService = Game1Service.getInstance();
    
    onMount(async () => {
        try {
            // Load game configs if not already loaded
            await gameAvailabilityStore.loadGameConfigs();
            
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
		isGamePlaying = true;
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

	// Simple reactive statement
	$: if ($game1Store.questions.length > 0) {
		console.log('🔍 REACTIVE STATEMENT TRIGGERED:', {
			showFeedback,
			storeIndex: $game1Store.currentQuestionIndex,
			questionId: $game1Store.questions[$game1Store.currentQuestionIndex]?.id
		});
		
		// Only update currentQuestion if feedback is not showing
		if (!showFeedback) {
			currentQuestion = $game1Store.questions[$game1Store.currentQuestionIndex];
			console.log('🔍 QUESTION UPDATED:', {
				storeIndex: $game1Store.currentQuestionIndex,
				questionId: currentQuestion?.id,
				options: currentQuestion?.options,
				totalQuestions: $game1Store.questions.length
			});
		} else {
			console.log('🔍 SKIPPING QUESTION UPDATE - feedback is showing');
		}
	}
    
    function handleQuestionSubmit(event: CustomEvent<{ answer: string; isCorrect: boolean }>) {
        const { answer, isCorrect } = event.detail;
        
        console.log('🔍 QUESTION SUBMIT DEBUG:', {
            answer,
            isCorrect,
            currentStoreIndex: $game1Store.currentQuestionIndex,
            showFeedback: false
        });
        
        showFeedback = true;
        feedbackState = {
            isCorrect,
            message: isCorrect ? 'Correct!' : 'Incorrect!'
        };



        console.log('🔍 FEEDBACK SHOWN:', {
            showFeedback: true,
            currentStoreIndex: $game1Store.currentQuestionIndex
        });

        // Show feedback for 1 second, then update the store and hide feedback
        setTimeout(() => {
            game1Store.answerQuestion(answer);
            
            // Hide feedback after store update
            setTimeout(() => {
                showFeedback = false;
            }, 800);
        }, 1000);
    }
</script>

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar} class:playing={isGamePlaying}>
	<!-- <Game1Shape /> -->
        
	{#if showInstructions}
		<div class="game-panel">
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

			<div class="start-screen">
				<div class="start-screen-content">
					<button on:click={startGame} class="game1-initial-screen-button">
						<img src="/images/game1-initial-screen-image.png" alt="Game 1 Start Screen" class="game1-initial-screen-image" style="visibility: hidden;">
					</button>
				</div>
			</div>
		</div>

	{:else if $game1Store.brandPhaseComplete}
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
			<h2 class="title">Let's see how you did:</h2>

			<div class="results">
				<p class="paragraph">You've identified {$game1Store.brandScore} brands so, for now, you've earned</p>
				<p class="total-points">{$game1Store.brandScore} {$game1Store.brandScore === 1 ? 'point' : 'points'}</p>
			</div>

			<p class="paragraph paragraph-summary" style="line-height: normal; padding-block-start: 4rem; text-align: center; color: #2E2D2C;">Let's see if you know the <br> real world so well!</p>

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

		<div class="game-grid">
			<div class="game-header">
				<img class="game-header-svg" src="/images/j1-playing-mascot.png" alt="Brand Heroes" />
				
				<h2 class="game-header-title">
					{$game1Store.currentSet === 'brands' ? 'Do You Recognise These Brands?' : 'Do You Recognise These Places?'}
				</h2>

				{#if $game1Store.currentSet === 'brands'}
					<p class="game-header-paragraph">You'll earn 1 point for each correct answer.</p>
				{:else}
					<p class="game-header-paragraph">For each wrong guess you will lose 1 point.</p>
				{/if}
				
				<!-- Desktop question counter -->
				<span class="desktop-question-counter">{($game1Store.currentSet === 'brands'
					? $game1Store.currentQuestionIndex + 1
					: $game1Store.currentQuestionIndex - 8)} of 9</span>
				
				<!-- Mobile question counter -->
				<span class="mobile-question-counter">{($game1Store.currentSet === 'brands'
					? $game1Store.currentQuestionIndex + 1
					: $game1Store.currentQuestionIndex - 8)} of 9</span>
			</div>

			{#if currentQuestion}
				<div class="question-wrapper" style="block-size: 85dvh;">
					<Question
						question={currentQuestion}
						nextQuestion={$game1Store.questions[$game1Store.currentQuestionIndex + 1]}
						showFeedback={showFeedback}
						isCorrect={feedbackState.isCorrect}
						questionType={$game1Store.currentSet === 'brands' ? 'brand' : 'place'}
						currentQuestionNumber={$game1Store.currentSet === 'brands'
							? $game1Store.currentQuestionIndex + 1
							: $game1Store.currentQuestionIndex - 8}
						totalQuestions={9}
						on:submit={handleQuestionSubmit}
		
						hideCounter={true}
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
    .game-container {
		background-color: #FF7000;
		background-image: url('/images/j1-intro-all.jpg');
		background-position: top right;
		background-repeat: no-repeat;
		background-size: contain;
		overflow: hidden;
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
			max-inline-size: calc(103.5rem * var(--scale-factor));
		}

		&.playing {
			background-image: none;
		}
    }

	.game-header {
		padding: 0 calc(7rem * var(--scale-factor));
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
		padding-block-start: 1rem;
	}

	.desktop-question-counter {
		color: #fff;
		display: block;
		font-size: calc(4.2rem * var(--scale-factor));
		padding-block-start: 1.5rem;
		font-weight: 600;
	}

	.mobile-question-counter {
		display: none; /* Hidden by default on desktop */
	}

	.game-panel {
		position: relative;
	}

	.game-grid {
		align-items: center;
		block-size: var(--full-height, 100vh);
		display: grid;
		grid-template-columns: calc(55rem * var(--scale-factor)) 1fr;
		position: relative;
	}

	.question-wrapper {
		padding-block: 0;
		padding-inline: 0;
	}

	.game-summary {
		align-items: center;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-block-size: var(--full-height, 100vh);
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
			border-radius: 0 30px;
			inline-size: calc(90rem * var(--scale-factor));
			margin-block-start: calc(3.5rem * var(--scale-factor));
			padding: calc(5rem * var(--scale-factor));
		}

		.paragraph {
			color: #000;
			font-size: calc(4.5rem * var(--scale-factor));
			font-weight: 600;
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
	}

	
	.start-screen {
		align-items: center;
		block-size: var(--full-height, 100vh);
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

	
	@media (max-width: 932px) {
		.game-container {
			background-image: url('/images/j1-start-mobile.png');
			background-position: top right;
			background-repeat: no-repeat;
			background-size: contain;
		}

		.game-header-svg {
			display: none;
		}

		.game-container.playing {
			background-image: url('/images/j1-playing-screen-mobile.png');
			background-position: top left;
			background-size: cover;
		}

		.game1-initial-screen-image {
			visibility: hidden;
		}
		
		:global(.shape) {
			transform: scale(0.6);
			transform-origin: top left;
			display: none;
		}

		
		.game-header {
			display: flex;
			flex-direction: column;
			margin-top: auto;
			padding: 0 calc(4rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		}

		.game-header :global(svg) {
			max-width: 100%;
			width: 100%;
			height: calc(30rem * var(--scale-factor));
			inset-block-start: 0;
			inset-inline-start: 0;
			display: none;	
		}

		.game-header-title {
			font-size: 2.8rem;
			line-height: 3.2rem;
		}

		.game-header-paragraph {
			font-size: 1.6rem;
			padding-block-start: .5rem;
		}

		.desktop-question-counter {
			display: none; /* Hide desktop counter on mobile */
		}

		.mobile-question-counter {
			display: block;
			color: #fff;
			font-size: 2.2rem;
			font-weight: 600;
			margin-block-start: 1.8rem;
			text-align: start;
		}

		.game-grid {
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 4rem;
			align-items: center;
			padding: 2rem;
		}

		.question-wrapper {
			padding-block: 0;
		}

		.start-screen {
			inline-size: calc(100vw - (100vw - 66.41%));
			padding: 1rem;
		}

		.sidebar-is-closed .start-screen {
			inline-size: calc(100vw - (100vw - 66.41%));
		}

		.start-screen-content {
			transform-origin: center center;
		}

		.start-screen {
			overflow-y: hidden;
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

		/* Adjust game summary for mobile */
		.game-summary {
			padding: 2rem;
		}

		.game-summary .title {
			font-size: 3.2rem;
			line-height: normal;
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
		}

		.game-summary .paragraph-summary {
			color: #fff !important;
			font-size: 1.6rem;
			font-weight: 600;
			line-height: normal;
			padding-block-start: 1.5rem !important;

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
	}

</style> 