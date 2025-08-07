<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game5Store } from '$lib/stores/game5Store';
    import { game5Availability, gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
    import { Game5Service } from '$lib/services/game5Service';
    import Question from '$lib/components/games/game5/Question.svelte';
    import GameInstructions from '$lib/components/GameInstructions.svelte';
    import { onDestroy } from 'svelte';
    
    let isLoading = true;
    let error: string | null = null;
	let showInstructions = true;
	let instructionsClosed = false;
	let instructionsClosedSidebar = false;
    let userAnswer = '';
    let feedbackMessage = '';
    let isCorrectAnswer = false;
    let attempts = 0;
    
    const gameService = Game5Service.getInstance();
    
    onMount(async () => {
        try {
            // Load game configs if not already loaded
            await gameAvailabilityStore.loadGameConfigs();
            
            // Check if game is available
            if (!$game5Availability.isAvailable) {
                goto('/games/info/5');
                return;
            }

			game5Store.initialize();
            
			// Check if there's a saved timer state - if so, skip instructions and go directly to game
			const savedTimer = localStorage.getItem('game5_timer');
			const savedStartTime = localStorage.getItem('game5_startTime');
			
			if (savedTimer && savedStartTime) {
				console.log('Game 5 Page: Resuming from saved timer state, skipping instructions');
				showInstructions = false;
				instructionsClosed = true;
				instructionsClosedSidebar = true;
				game5Store.start(); // This will now resume from saved state
			} else {
				console.log('Game 5 Page: No saved timer state, showing instructions');
			}
			
            isLoading = false;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load game content';
            isLoading = false;
        }
    });

    onDestroy(() => {
        game5Store.cleanup();
    });
    
	function startGame() {
		showInstructions = false;
		instructionsClosed = true;
		instructionsClosedSidebar = true;
		game5Store.start();
	}




    
    function formatTime(milliseconds: number): string {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function submitAnswer() {
        if (!userAnswer.trim()) return;
        
        attempts++;
        const isCorrect = gameService.validateAnswer(userAnswer.trim());
        isCorrectAnswer = isCorrect;
        

        
        if (isCorrect) {
            feedbackMessage = 'Correct! You found the answer!';
            game5Store.submitAnswer(userAnswer.trim());
            // Redirect to summary page instead of showing success screen
            goto('/games/game5/summary');
        } else {
            feedbackMessage = 'Wrong answer!\nPlease try again';
        }
        
        userAnswer = ''; // Clear input after submission
    }

    function replayGame() {
        userAnswer = '';
        feedbackMessage = '';
        isCorrectAnswer = false;
        attempts = 0;
        game5Store.initialize(); // Reset the store
        game5Store.start(); // Start a new game
    }

    function finishGame() {
        goto('/ranking');
    }

    function handleQuestionSubmit(event: CustomEvent<{ answer: string; isCorrect: boolean }>) {
        // Game completion is handled in the store
        console.log('Game 5 completed:', event.detail);
    }
</script>

<div class="game-container" class:playing={!showInstructions} class:sidebar-is-closed={instructionsClosedSidebar}>
        
	{#if showInstructions}
		<div class="game-panel">
			<GameInstructions 
				gameNumber={5}
				gameTitle="Brand Heroes"
				gameSubtitle="Only the Fastest Will Reach the Sky"
				infoRoute="/games/info/5"
				bind:instructionsClosed
				primaryColor="#00B2E7"
				backgroundColor="#2E2D2C"
				paragraphs={[
					"Caution!",
					"This is a time-sensitive challenge. Use the light signal to call Rocket Girl and start the game.",
					"If you manage to complete the game you'll earn 1 point, but you'll have to be very fast because the time you take will be used as a tiebreaker if there's a draw with other participants at the end of the campaign.",
					"In the next screen, read carefully all the steps before doing anything!",
					"Are you ready? 3, 2, 1..."
				]}
			>

			</GameInstructions>

			<div class="start-screen">
				<div class="start-screen-content">
					<button on:click={startGame} class="game5-initial-screen-button">
						<img width="1728" height="1039" src="/images/game5-initial-screen.png" alt="Game 5 Start Screen" class="game5-initial-screen-image">
					</button>
				</div>
			</div>
		</div>

	{:else if $game5Store.isLoading}
		<div class="loading">Loading questions...</div>

	{:else if $game5Store.error}
		<div class="error">{$game5Store.error}</div>

	{:else if !$game5Store.isComplete}
		<GameInstructions 
			gameNumber={5}
			gameTitle="Brand Heroes"
			gameSubtitle="Only the Fastest Will Reach the Sky"
			infoRoute="/games/info/5"
			bind:instructionsClosed
			primaryColor="#00B2E7"
			backgroundColor="#2E2D2C"
			paragraphs={[
				"Caution!",
				"This is a time-sensitive challenge. Use the light signal to call Rocket Girl and start the game.",
				"If you manage to complete the game you'll earn 5 points, but you'll have to be very fast because the time you take will be used as a tiebreaker if there's a draw with other participants at the end of the campaign.",
				"In the next screen, read carefully all the steps before doing anything!",
				"Are you ready? 3, 2, 1..."
			]}
		/>

		<div class="game-grid">
			<div class="game-hero-column">
				<img src="/images/heroe-5-1.png" alt="Game 5 Hero" class="game-hero-image">
				<!-- Mobile timer positioned under hero image -->
				<div class="mobile-timer">
					{$game5Store.timeSpent ? formatTime($game5Store.timeSpent) : '00:00'}
				</div>
			</div>
			
			<div class="game-content-column">
				<!-- Desktop timer -->
				<div class="desktop-timer">
					{$game5Store.timeSpent ? formatTime($game5Store.timeSpent) : '00:00'}
				</div>
				
				<div class="game-container-white">
					<h2 class="game-title">Follow the steps to find the answer</h2>
					<p class="game-description"><strong>Important:</strong> Read carefully all the steps before doing anything!</p>
					
					<ol class="steps-list">
						<li>Click <a href="https://olamagri.workvivo.com/" target="_blank" rel="noopener noreferrer">this link</a> to visit The Loop</li>
						<li>Find your way to the <span class="highlight">Brand Hub</span></li>
						<li>Click on the Brand Guidelines and open <span class="highlight">PDF #1</span></li>
						<li>Go to <span class="highlight">page 4</span></li>
						<li>Find the <span class="highlight">words in orange</span></li>
						<li><span class="highlight">Type them below</span> exactly as they appear</li>
					</ol>
					
					<div class="input-section">
						<div class="input-container">
							<input
								bind:value={userAnswer}
								class="answer-input"
								on:keydown={(e) => e.key === 'Enter' && submitAnswer()}
								placeholder="Answer"
								type="text"
							/>
							{#if feedbackMessage}
								<div class="result-message-desktop {isCorrectAnswer ? 'correct' : 'incorrect'}">
									{feedbackMessage}
								</div>
							{/if}
						</div>
						<button
							class="send-button"
							disabled={!userAnswer.trim()}
							on:click={submitAnswer}
							type="button"
						>
							Send
						</button>
						{#if feedbackMessage}
							<div class="result-message-mobile {isCorrectAnswer ? 'correct' : 'incorrect'}">
								{feedbackMessage}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.game-container {
		background-color: #00B2E7;
		background-image: url('/images/j5-start.png');
		background-position: center bottom;
		background-size: 90%;
		background-repeat: no-repeat;
		block-size: 100vh;
		overflow: hidden;
		position: relative;
	}

	
	.game-container.playing {
		background-image: url('/images/game5-summary.png');
	}

	.game-panel {
		position: relative;
	}

	/* Game 5 specific logo styling */
	:global(.instructions .logo path) {
		fill: #fff;
	}

	.game-grid {
		align-items: center;
		block-size: 100vh;
		display: grid;
		gap: calc(4rem * var(--scale-factor));
		grid-template-columns: calc(69.6rem * var(--scale-factor)) 1fr;
		justify-items: center;
	}

	.game-hero-column {
		align-items: center;
		display: flex;
		inline-size: calc(69.6rem * var(--scale-factor));
		justify-content: center;
	}

	.game-hero-image {
		block-size: auto;
		inline-size: 100%;
		max-inline-size: 100%;
	}

	.desktop-timer {
		align-items: center;
		background: #00B2E7;
		border-radius: 1rem;
		//block-size: 4rem;
		color: #FFF;
		display: flex;
		font-size: calc(12rem * var(--scale-factor));
		font-weight: 600;
		justify-content: flex-start;
		line-height: calc(12rem * var(--scale-factor));
	}

	.mobile-timer {
		display: none; /* Hidden by default on desktop */
	}

	.game-container-white {
		background: #FFF;
		border-radius: 0 calc(3.5rem * var(--scale-factor));
		margin-block-start: 0;
		padding: calc(5.5rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
	}

	.game-title {
		color: #00B2E7;
		font-size: calc(4.5rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		margin-block-start: 1.5rem;
	}

	.game-description {
		color: #2E2D2C;
		font-size: calc(2.2rem * var(--scale-factor));
		font-weight: 400;
		line-height: normal;
		margin-block-start: 1.5rem;

		strong {
			font-weight: 600;
		}
	}

	.steps-list {
		color: #2E2D2C;
		display: flex;
		flex-direction: column;
		font-size: calc(3rem * var(--scale-factor));
		font-weight: 600;
		gap: 0;
		line-height: calc(5.9rem * var(--scale-factor));
		list-style-position: inside;
		margin-block-start: 1.5rem;

		.highlight {
			color: #00B2E7;
		}

		a {
			color: #00B2E7;
			text-decoration: underline;
			text-decoration-color: #00B2E7;
			text-decoration-thickness: 0.2rem;

			&:hover {
				opacity: 0.8;
			}
		}
	}

	.input-section {
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-block-start: 2rem;
	}

	.input-container {
		align-items: center;
		display: flex;
		gap: calc(3rem * var(--scale-factor));
		inline-size: 100%;
	}

	.answer-input {
		background: #FFF;
		border: 0.2rem solid #999;
		border-radius: 0.5rem;
		color: #999;
		font-size: 2rem;
		font-weight: 400;
		inline-size: calc(43rem * var(--scale-factor));
		line-height: 125%;
		padding: 1.5rem;

		&::placeholder {
			color: #999;
			opacity: 1;
		}
	}

	.result-message-desktop {
		color: #2E2D2C;
		font-size: 2rem;
		font-weight: 600;
		line-height: normal;
		white-space: pre-line;

		&.correct {
			color: #28A745;
		}

		&.incorrect {
			color: #DC3545;
		}
	}

	.result-message-mobile {
		display: none; /* Hidden by default on desktop */
	}

	.send-button {
		align-items: center;
		background: #00B2E7;
		border: none;
		border-radius: 0 1.7rem;
		block-size: 4.4rem;
		color: #FFF;
		cursor: pointer;
		display: flex;
		font-size: 2rem;
		font-style: normal;
		font-weight: 400;
		inline-size: 10.7rem;
		justify-content: center;
		line-height: normal;
		text-align: center;
		transition: background-color 0.3s ease;

		&:hover {
			background: #0099CC;
		}

		&:disabled {
			background: #CCC;
			cursor: not-allowed;
		}
	}


	.game5-initial-screen-image {
		object-fit: cover;
		visibility: hidden;
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



	.sidebar-is-closed .start-screen {
		inline-size: 100%;
	}



	.loading, .error {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		color: #fff;
		font-size: calc(2.4rem * var(--scale-factor));
	}

	.error {
		color: #ff6b6b;
	}


	@media (max-width: 932px) {
		.game-grid {
			grid-template-columns: 21.6rem 1fr;
			grid-column-gap: 2rem;
			justify-items: unset;
			padding-inline: 1.5rem;
		}

		.game-hero-image {
			inline-size: 21.6rem;
		}

		.game-hero-column {
			flex-direction: column;
			inline-size: auto;
			max-inline-size: none;
		}
		
		.game-content-column {
			gap: 2rem;
		}

		
		.desktop-timer {
			display: none; 
		}

		.mobile-timer {
			color: #fff;
			display: block;
			font-size: 5rem;
			font-weight: 600;
			line-height: normal;
			padding-block-start: 1.5rem;
		}

		.game-container-white {
			block-size: auto;
			inline-size: 100%;
			padding: 1.2rem;
		}

		.game-container-white .game-title {
			font-size: 2.1rem;
			font-weight: 600;
			line-height: normal;
			margin-block-start: 0;
		}

		.game-container-white .game-description {
			font-size: 1.5rem;
			line-height: normal;
			margin-block-start: 0;
		}

		.game-container-white .steps-list {
			font-size: 1.6rem;
			line-height: normal;
			margin-block-start: .9rem;
		}

		.game-container-white .answer-input {
			block-size: 3.8rem;
			font-size: 1.6rem;
			inline-size: 100%;
			padding-block: 0;
		}

		.game-container-white .send-button {
			align-self: flex-start;
			block-size: 3.8rem;
			font-size: 2rem;
			font-weight: 600;
			inline-size: 10rem;
		}

		.game-container-white .result-message-desktop {
			display: none; /* Hide desktop message on mobile */
		}

		.game-container-white .result-message-mobile {
			display: block; /* Show mobile message */
			font-size: 1.5rem;
			margin-block-start: -1.5rem;
			white-space: normal;
			color: #2E2D2C;
			font-weight: 600;
			line-height: normal;

			&.correct {
				color: #28A745;
			}

			&.incorrect {
				color: #DC3545;
			}
		}

		.input-section {
			margin-block-start: 1.5rem;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
		}

		.input-container {
			inline-size: 100%;
			gap: 1.8rem;
			flex: 1;
			min-inline-size: 0;
		}

		.result-message-mobile {
			flex-basis: 100%;
			margin-block-start: 1rem;
			margin-inline-start: 0;
		}

		.game-container {
			background-size: contain;
		}

		.game-panel {
			background-size: calc(100% * var(--scale-factor)) auto;
		}
	
		.start-screen {
			inline-size: calc(100vw - (100vw - 66.41%));
			padding: 1rem;
			overflow-y: hidden;
		}

		.sidebar-is-closed .start-screen {
			inline-size: calc(100vw - (100vw - 66.41%));
		}

		.start-screen-content {
			transform-origin: center center;
		}

		.game5-initial-screen-button {
			background: none;
			border: none;
			padding: 0;
			cursor: pointer;
		}
	}
</style>



