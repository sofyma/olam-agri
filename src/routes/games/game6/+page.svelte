<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game6Store } from '$lib/stores/game6Store';
    import { game6Availability, gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
    import { authStore } from '$lib/stores/authStore';
    import type { Question } from '$lib/types/game6';
	import GameInstructions from '$lib/components/GameInstructions.svelte';
    
    	let showInstructions = true;
	let instructionsClosed = false;
	let instructionsClosedSidebar = false;
	let showWelcome = false;
	let selectedAnswer: string | null = null;
	let currentQuestion: any = null;



    onMount(async () => {
        // Load game configs first to ensure availability is up to date
        await gameAvailabilityStore.loadGameConfigs();
        
        // Check if game is available
        if (!$game6Availability.isAvailable) {
            console.log('Game 6 not available, redirecting to info page');
            goto('/games/info/6');
            return;
        }

        console.log('Game 6 is available, initializing game');
        await game6Store.initialize();
    });
    
	function startGame() {
		showInstructions = false;
		instructionsClosed = true;
		instructionsClosedSidebar = true;
		showWelcome = true;
	}

	async function startQuestions() {
		showWelcome = false;
		instructionsClosed = true;
		instructionsClosedSidebar = true;
		await game6Store.start();
		
		// Get the start question
		await loadStartQuestion();
	}

	async function loadStartQuestion() {
		try {
			// Fetch the start question from Sanity
			const startQuestion = await game6Store.getStartQuestion();
			
			if (startQuestion) {
				currentQuestion = startQuestion;
				selectedAnswer = null;
			} else {
				// Handle case where no start question exists
				console.warn('No start question found in Sanity');
				goto('/games/info/6');
			}
		} catch (error) {
			console.error('Failed to load start question:', error);
			// Handle error gracefully
			goto('/games/info/6');
		}
	}

	function selectAnswer(answerText: string) {
		selectedAnswer = answerText;
	}

	async function submitAnswer() {
		if (!selectedAnswer || !currentQuestion) return;

		// Find the selected answer object
		const selectedAnswerObj = currentQuestion.answers.find((a: any) => a.answerText === selectedAnswer);
		
		if (!selectedAnswerObj) return;

		// Check if this answer ends the game
		if (selectedAnswerObj.isEndGame) {
			// Mark the game as complete
			game6Store.markComplete();
			
			// Save the game result if user is authenticated
			if ($authStore.user) {
				await game6Store.saveResult($authStore.user._id).catch(error => {
					console.error('Failed to save game result:', error);
				});
			}
			
			// Redirect directly to finish route
			goto('/games/game6/finish');
			return;
		}

		// Load the next question
		if (selectedAnswerObj.nextQuestion && selectedAnswerObj.nextQuestion._ref) {
			try {
				const nextQuestion = await game6Store.getQuestion(selectedAnswerObj.nextQuestion._ref);
				if (nextQuestion) {
					currentQuestion = nextQuestion;
					selectedAnswer = null;
				} else {
					// Handle case where next question doesn't exist
					console.warn('Next question not found, ending game');
					game6Store.markComplete();
					goto('/games/game6/finish');
				}
			} catch (error) {
				console.error('Failed to load next question:', error);
				// Handle error gracefully
				game6Store.markComplete();
				goto('/games/game6/finish');
			}
		} else {
			// Handle case where nextQuestion is not properly set
			console.warn('No next question reference found, ending game');
			game6Store.markComplete();
			goto('/games/game6/finish');
		}
	}

	function handleKeyDown(event: KeyboardEvent, answerText: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectAnswer(answerText);
		}
	}
</script>

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar} class:playing={!showInstructions}>
	
    	{#if showInstructions}
		<div class="game-panel">
			<GameInstructions 
				gameNumber={6}
				gameTitle="Brand Heroes"
				gameSubtitle="The Mind <br> Reader"
				infoRoute="/games/info/6"
				bind:instructionsClosed
				primaryColor="#00A865"
				backgroundColor="#2E2D2C"
				paragraphs={[
					"Mystic Man can see into your mind just by looking into your eyes.",
					"He reads your thoughts, senses your past, and predicts your next move.",
					"Dare to meet his gaze? Reach the end and earn 10 points.",
					"He already knows you're about to hit Start."
				]}
			/>

			<div class="start-screen">
				<img src="/images/game6-start-shape.png" alt="Start Game" class="start-screen-shape" />

				<div class="start-screen-content">
					<button on:click={startGame} class="image-button" aria-label="Start Game">
						<img src="/images/game6-start-screen.png" alt="Start Game" />
					</button>
				</div>
			</div>
		</div>

    {:else if showWelcome}
		<GameInstructions 
			gameNumber={6}
			gameTitle="Brand Heroes"
			gameSubtitle="The Final Challenge"
			infoRoute="/games/info/6"
			bind:instructionsClosed
			primaryColor="#00A865"
			backgroundColor="#2E2D2C"
			paragraphs={[
				"Test your knowledge with multiple choice questions about branding and design!",
				"Each correct answer earns you 1 point. Wrong answers cost you 1 point.",
				"Can you prove you're a brand hero?"
			]}
		/>

        <div class="game-area">
			<img src="/images/game6-shape-before-playing.png" alt="" class="game6-shape-before-playing">

            <div class="welcome-container">
                <div class="welcome-card">
                    <div class="welcome-content">
                        <p class="welcome-text">Hello, welcome to my Mystic Chamber.</p>
                        <p class="welcome-text">In this chamber there are no right or wrong answers.</p>
                        <p class="welcome-text">The way to learn more about yourself is to look me in the eyes, stay calm and be true to who you really are.</p>
                        
                        <button class="lets-go-button" on:click={startQuestions}>
                            Let's go!
                        </button>
                    </div>
                </div>

				<img src="/images/game6-hero-before-playing.png" alt="" class="game6-hero-before-playing game6-hero-before-playing-mobile">
            </div>
        </div>
    {:else if $game6Store.isLoading}
        <div class="loading">Loading questions...</div>
    {:else if $game6Store.error}
        <div class="error">
            <h2>Game Setup Required</h2>
            <p>{$game6Store.error}</p>
            <p>Please add some Game 6 questions in your Sanity Studio to play this game.</p>
        </div>

    {:else if currentQuestion}
		<GameInstructions 
			gameNumber={6}
			gameTitle="Brand Heroes"
			gameSubtitle="The Final Challenge"
			infoRoute="/games/info/6"
			bind:instructionsClosed
			primaryColor="#00A865"
			backgroundColor="#2E2D2C"
			paragraphs={[
				"Test your knowledge with multiple choice questions about branding and design!",
				"Each correct answer earns you 1 point. Wrong answers cost you 1 point.",
				"Can you prove you're a brand hero?"
			]}
		/>

		<div class="game-area">
			<img src="/images/game6-shape-before-playing.png" alt="" class="game6-shape-before-playing">

			<div class="game-content">
				<div class="question-container">
					<div class="question-card">
						<div class="question-header">
							<h2 class="question-title">{currentQuestion.questionText}</h2>
						</div>
						
						<div class="question-options">
							<div class="options">
								{#each currentQuestion.answers as answer}
									<div 
										class="option"
										class:selected={selectedAnswer === answer.answerText}
										on:click={() => selectAnswer(answer.answerText)}
										on:keydown={(event) => handleKeyDown(event, answer.answerText)}
										tabindex="0"
										role="radio"
										aria-checked={selectedAnswer === answer.answerText}
									>
										<input
											type="radio"
											name="answer"
											value={answer.answerText}
											checked={selectedAnswer === answer.answerText}
											on:change={() => selectAnswer(answer.answerText)}
										/>
										<span class="option-text">{answer.answerText}</span>
									</div>
								{/each}
							</div>
							
							<button
								class="submit-button"
								on:click={submitAnswer}
								disabled={!selectedAnswer}
							>
								Send
							</button>
						</div>
					</div>

					<img src="/images/game6-hero-before-playing.png" alt="" class="game6-hero-before-playing game6-hero-before-playing-mobile">
				</div>
			</div>
		</div>
    {/if}
</div>

<style lang="scss">
	.game-container {
		block-size: var(--full-height, 100vh);
		overflow: hidden;
		position: relative;

		@media(min-width: 1920px) {
			block-size: auto;
		}
	}

	.game-panel {
		block-size: var(--full-height, 100vh);
	}

	.game-area {
		align-items: center;
		block-size: var(--full-height, 100vh);
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem;
		position: relative;

		@media(min-width: 1920px) {
			block-size: auto;
			padding-block-start: 5rem;
		}
	}

	.game6-shape-before-playing {
		inset-block-end: 20%;
		inset-inline-start: 50%;
		position: absolute;
		transform: translate(-50%, 20%);
		z-index: -1;
	}

	.game6-hero-before-playing {
		margin-block-start: calc(-5rem * var(--scale-factor));
		margin-inline-start: calc(7rem * var(--scale-factor));
		max-inline-size: calc(39.5rem * var(--scale-factor));
		position: relative;
	}

	.game-content {
		align-items: center;
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.question-container {
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: calc(105.2rem * var(--scale-factor));
	}

	.question-card {
		background-color: #fff;
		border-radius: 0 calc(3rem * var(--scale-factor));
		padding: calc(3rem * var(--scale-factor)) calc(7rem * var(--scale-factor)) calc(7rem * var(--scale-factor));
		position: relative;
		width: 100%;
		box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
	}

	.question-header {
		margin-block-end: calc(2rem * var(--scale-factor));
		text-align: center;
	}

	.question-title {
		color: #2E2D2C;
		font-size: calc(4rem * var(--scale-factor));
		font-weight: 400;
		line-height: normal;
	}

	.question-options {
		display: flex;
		flex-direction: column;
		gap: calc(2rem * var(--scale-factor));
		align-items: center;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: calc(1.5rem * var(--scale-factor));
		inline-size: 100%;
		max-inline-size: calc(70rem * var(--scale-factor));

		@media(max-width: 932px) {
			gap: 0;
		}
	}

	.option {
		align-items: start;
		border-radius: 1.5rem;
		cursor: pointer;
		display: grid;
		grid-template-columns: 2rem 1fr;
		font-size: calc(2.2rem * var(--scale-factor));
		grid-column-gap: 1rem;
		padding-block: 1rem;
		padding-inline: 1.5rem;
		transition: all 0.2s ease;
		user-select: none;

		&:focus,
		&:hover {
			background-color: #E6E6E6;
		}

		@media(max-width: 932px) {
			padding-block: .5rem;

			.option-text {
				grid-column: 2;
			}
		}
	}

	.option-text {
		color: #2E2D2C;
		inset-block-start: .1rem;
		position: relative;
	}

	input[type="radio"] {
		accent-color: #2E2D2C;
		block-size: 2rem;
		cursor: pointer;
		inline-size: 2rem;
		margin-block: 0;
		margin-inline: 0;
		appearance: none;
		border: 0.2rem solid #ccc;
		border-radius: 50%;
		background-color: white;
		position: relative;
		inset-block-start: .3rem;

		@media(max-width: 932px) {
			inset-block-start: .2rem;
		}

		&:checked {
			background-color: #2E2D2C;
			border-color: #2E2D2C;
		}
	}

	.submit-button {
		background-color: rgb(0, 168, 101);
		color: rgb(255, 255, 255);
		cursor: pointer;
		display: block;
		font-size: 2rem;
		font-weight: 600;
		margin-block-start: calc(1rem * var(--scale-factor));
		border-width: initial;
		border-style: none;
		border-color: initial;
		border-image: initial;
		border-radius: 0px 1.7rem;
		margin-inline: auto;
		padding: 1.5rem calc(4rem * var(--scale-factor));
		transition: background-color 0.3s;
	}



	.lets-go-button {
		background-color: #00A865;
		border: none;
		border-radius: calc(2.5rem * var(--scale-factor));
		color: white;
		cursor: pointer;
		font-size: calc(1.8rem * var(--scale-factor));
		font-weight: 600;
		padding: calc(1.5rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		transition: background-color 0.2s ease;

		&:hover {
			background-color: #008f56;
		}
	}

	.welcome-container {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
	}

	.welcome-card {
		background-color: #fff;
		border-radius: 0 calc(3rem * var(--scale-factor));
		inline-size: 100%;
		max-inline-size: calc(105.2rem * var(--scale-factor));
		padding: calc(6rem * var(--scale-factor)) calc(7rem * var(--scale-factor)) calc(13rem * var(--scale-factor));
		text-align: center;
		box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
	}

	.welcome-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.welcome-text {
		color: #2E2D2C;
		font-size: calc(3.2rem * var(--scale-factor));
		line-height: normal;
	}

	.lets-go-button {
		background-color: #00A865;
		border: none;
		border-radius: 0 1.7rem;
		color: #fff;
		cursor: pointer;
		font-size: 2rem;
		font-weight: 600;
		margin-block-start: 2rem;
		margin-inline: auto;
		padding: 0.5rem 2rem;
		transition: background-color 0.3s ease;
		width: fit-content;

		&:hover {
			background-color: #008F56;
		}
	}

	.start-screen {
		display: flex;
		inline-size: calc(100vw - (100vw - 66.41%));
		justify-content: flex-end;
		margin-inline-start: auto;
		padding-inline-end: calc(8.5rem * var(--scale-factor));
		position: relative;

		&-shape {
			inset-block-start: 0;
			inset-inline-end: 0;
			max-inline-size: 80rem;
			position: absolute;
		}

		&-content {
			align-items: center;
			block-size: var(--full-height, 100vh);
			display: flex;
			justify-content: center;
			position: relative;
		}
	}

	.sidebar-is-closed .start-screen {
		inline-size: 100%;
		justify-content: center;
		padding-inline-end: 0;

		.start-screen-shape {
			inset-inline-end: 50%;
			transform: translateX(50%);
		}
	}

	.loading,
	.error {
		align-items: center;
		block-size: var(--full-height, 100vh);
		color: #fff;
		display: flex;
		font-size: calc(3rem * var(--scale-factor));
		justify-content: center;
	}

	/* Game 6 specific logo styling */
	:global(.instructions .logo path) {
		fill: #fff;
	}

	.image-button {
		background: transparent;
		border: none;
		cursor: pointer;
		margin: 0;
		padding: 0;

		img {
			width: calc(100% * var(--scale-factor));
			max-width: calc(80rem * var(--scale-factor));
			height: auto;
			margin-inline: auto;
		}
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		.game-container {
			background-image: url('/images/j6-start-mobile.png');
			background-position: center right;
			background-repeat: no-repeat;
			background-size: contain;
		}

		.game-container.playing {
			background-image: none;
		}

		.game-area {
			align-items: flex-end;
			padding-block: 0;
			padding-inline: 1rem;
		}

		.welcome-container {
			inline-size: 70%;
			position: relative;
		}

		.question-container {
			inline-size: 70%;
			max-inline-size: 100%;
			position: relative;
		}

		.welcome-card {
			max-inline-size: 100%;
			padding: 3rem 2.5rem;
			text-align: start;
		}

		.question-card {
			max-inline-size: 100%;
			padding: 2rem 2.5rem;
			text-align: start;
		}

		.question-header {
			margin-block-end: 1rem;
		}

		.question-title {
			font-size: 1.8rem;
			font-weight: 600;
			line-height: normal;
		}

		.game-content {
			justify-content: flex-end;
		}

		.welcome-content {
			display: block;
		}

		.welcome-text {
			font-size: 1.8rem;
			font-weight: 600;
			line-height: normal;
			padding-block-start: 1rem;

			&:first-child {
				padding-block-start: 0;
			}
		}

		.lets-go-button {
			font-size: 1.6rem;
			font-weight: 600;
		}
		
		:global(.shape) {
			transform: scale(0.6);
			transform-origin: top left;
		}

		.start-screen {
			display: block;
			inline-size: 100%;
			padding: 0;
		}

		.start-screen-shape {
			display: none;
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

		:global(.small-hero-summary) {
			inset-block-start: calc(4rem * var(--scale-factor));
			inset-inline-start: calc(6rem * var(--scale-factor));
			transform: scale(0.7);
			display: none;
		}

		.image-button {
			position: relative;
			inset-inline-start: 6rem;

			img {
				visibility: hidden;
			}
		}

		.start-screen-content {
			overflow: hidden;
		}

		.image-button img {
			max-width: calc(60rem * var(--scale-factor));
		}

		.game6-shape-before-playing {
			inset-block-start: 0;
			inset-inline-start: 50%;
			position: absolute;
			transform: translate(-50%, 0);
			z-index: -1;
		}

		.game6-hero-before-playing-mobile {
			display: block;
			inset-block-start: 50%;
			inset-inline-start: -20rem;
			max-inline-size: 25.5rem;
			margin: 0;
			position: absolute;
			transform: translateY(-50%);
			z-index: -1;
		}

		.option {
			padding-inline: .8rem;

			&.selected {
				.option-text {
					color: #2E2D2C;
				}
			}
		}

		.option-text {
			font-size: 1.6rem;
			font-weight: 600;
			line-height: 2.2rem;
		}

		.submit-button {
			block-size: 3.8rem;
			inline-size: 11rem;
			font-size: 2rem;
			font-weight: 600;
			margin-block-start: 0;
			padding: 0;
		}
	}
</style> 