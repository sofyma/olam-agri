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
	let selectedAnswer: 'A' | 'B' | null = null;

    // Reactive statement to handle navigation when game is complete
    $: if ($game6Store.isComplete && $game6Store.isPlaying) {
        console.log('Game complete detected, saving result and navigating to finish...');
        
        // Save the game result if user is authenticated
        if ($authStore.user) {
            game6Store.saveResult($authStore.user._id).catch(error => {
                console.error('Failed to save game result:', error);
            });
        }
        
        // Add a small delay to ensure all state updates are processed
        setTimeout(() => {
            goto('/games/game6/finish');
        }, 500);
    }

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

	function startQuestions() {
		showWelcome = false;
		instructionsClosed = true;
		instructionsClosedSidebar = true;
		game6Store.start();
	}

	function selectAnswer(option: 'A' | 'B') {
		selectedAnswer = option;
	}

	function submitAnswer() {
		if (selectedAnswer && $game6Store.isPlaying) {
			game6Store.answerQuestion(selectedAnswer);
			selectedAnswer = null;
		}
	}
</script>

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar}>
	
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

				<div class="explanation">
					<h2 class="explanation-title">Mystic Man</h2>
					<p class="explanation-copy">Reader of thoughts, keeper of secrets, master of what's to come. Nothing escapes his mind.</p>
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

				<img src="/images/game6-hero-before-playing.png" alt="" class="game6-hero-before-playing">
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
    {:else}
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

			{#if $game6Store.isPlaying && $game6Store.questions[$game6Store.currentQuestionIndex]}
				<div class="game-content">
					<div class="question-container">
						<div class="question-card">
							<div class="question-header">
								<h2 class="question-title">{$game6Store.questions[$game6Store.currentQuestionIndex].question}</h2>
							</div>
							
							<div class="options-container">
								<button 
									class="option-button option-a" 
									class:selected={selectedAnswer === 'A'}
									on:click={() => selectAnswer('A')}
									on:keydown={(e) => {
										if (e.key === 'a' || e.key === 'A' || e.key === '1') {
											e.preventDefault();
											selectAnswer('A');
										}
									}}
								>
									
									<span class="option-text">{$game6Store.questions[$game6Store.currentQuestionIndex].optionA}</span>
								</button>
								
								<button 
									class="option-button option-b" 
									class:selected={selectedAnswer === 'B'}
									on:click={() => selectAnswer('B')}
									on:keydown={(e) => {
										if (e.key === 'b' || e.key === 'B' || e.key === '2') {
											e.preventDefault();
											selectAnswer('B');
										}
									}}
								>
									
									<span class="option-text">{$game6Store.questions[$game6Store.currentQuestionIndex].optionB}</span>
								</button>
							</div>
							
							<button 
								class="send-button" 
								disabled={!selectedAnswer}
								on:click={submitAnswer}
							>
								Send
							</button>
						</div>

						<img src="/images/game6-hero-before-playing.png" alt="" class="game6-hero-before-playing">
					</div>
				</div>
			{/if}
		</div>
    {/if}
</div>

<style lang="scss">

	.game-container {
		block-size: 100vh;
		position: relative;

		@media(min-width: 1920px) {
			block-size: auto;
		}
	}

	.game-panel {
		block-size: 100vh;
	}

	.game-area {
		align-items: center;
		block-size: 100vh;
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
		
		margin-block-start: calc(-7rem * var(--scale-factor));
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
		padding: calc(6rem * var(--scale-factor)) calc(7rem * var(--scale-factor)) calc(13rem * var(--scale-factor));
		position: relative;
		width: 100%;
		box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
	}

	/* Windows 125% specific styles */
	:global(.window125) .question-card {
		padding-block-end: calc(8rem * var(--scale-factor));
	}

	.question-header {
		margin-block-end: calc(4rem * var(--scale-factor));
		text-align: center;
	}

	.question-title {
		color: #2E2D2C;
		font-size: calc(4rem * var(--scale-factor));
		font-weight: 400;
		line-height: normal;
	}

	.options-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: calc(4rem * var(--scale-factor));
	}

	.option-button {
		align-items: center;
		border: 0.1rem solid #00A865;
		border-radius: 2rem;
		cursor: pointer;
		display: flex;
		gap: 2rem;
		padding: calc(3rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		transition: all 0.3s ease;
		width: 100%;
	}

	.option-text {
		color: #2E2D2C;
		font-size: calc(2.4rem * var(--scale-factor));
		font-weight: 500;
		line-height: 1.4;
	}

	.option-button.selected {
		background-color: #00A865;
		border-color: #00A865;
		color: #2E2D2C;

		.option-text {
			color: #2E2D2C;
		}
	}

	.send-button {
		background-color: #00A865;
		border: none;
		border-radius: 0 1.7rem;
		color: #fff;
		cursor: pointer;
		display: block;
		font-size: 2rem;
		font-weight: 600;
		margin-block-start: calc(6rem * var(--scale-factor));
		margin-inline: auto;
		padding: 1.5rem calc(4rem * var(--scale-factor));
		transition: background-color 0.3s ease;

		&:hover:not(:disabled) {
			background-color: #008F56;
		}

		&:disabled {
			background-color: #ccc;
			cursor: not-allowed;
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

	.game-panel {
		position: relative;
	}

	/* Game 6 specific logo styling */
	:global(.instructions .logo path) {
		fill: #fff;
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
			position: absolute;
		}

		&-content {
			align-items: center;
			block-size: 100vh;
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

		.explanation {
			inset-inline-start: calc(10rem * var(--scale-factor));
		}
	}

	.loading,
	.error {
		align-items: center;
		block-size: 100vh;
		color: #fff;
		display: flex;
		font-size: calc(3rem * var(--scale-factor));
		justify-content: center;
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

	.explanation {
		color: #000;
		font-weight: 600;
		line-height: normal;
		inline-size: calc(23.5rem * var(--scale-factor));
		inset-block-end: calc(5rem * var(--scale-factor));
		inset-inline-start: calc(5rem * var(--scale-factor));
		margin-inline: auto;
		position: absolute;

		&-title {
			font-size: calc(3rem * var(--scale-factor));
		}

		&-copy {
			font-size: 1.8rem;
		}
	}



	/* Windows 125% specific styles */
	/*
	:global(.window125) .game-container {
		display: flex;
		align-items: flex-start;
	}

	:global(.window125) .instructions {
		position: static !important;
		inline-size: calc(100vw - 66.41%);
		block-size: 100vh;
		flex-shrink: 0;
	}

	:global(.window125) .start-screen {
		inline-size: calc(100vw - (100vw - 66.41%));
		margin-inline-start: auto;
		flex-shrink: 0;
	}

	:global(.window125) .game-panel {
		display: flex;
		align-items: flex-start;
		width: 100%;
	}

	:global(.window125) .sidebar-is-closed .start-screen {
		inline-size: 100%;
		margin-inline-start: 0;
	}

	:global(.window125) .game-grid {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	:global(.window125) .sidebar-is-closed .game-grid {
		display: grid;
		grid-template-columns: calc(55rem * var(--scale-factor)) 1fr;
	}
	*/

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		/* 1. Fix left sidebar title and horizontal scroll */
		// .instructions {
		// 	inline-size: calc(100vw - 66.41%);
		// 	padding: calc(3rem * var(--scale-factor)) calc(4rem * var(--scale-factor)) calc(6rem * var(--scale-factor));
		// 	overflow-x: hidden;
		// 	scrollbar-width: none; /* Firefox */
		// 	-ms-overflow-style: none; /* Internet Explorer 10+ */
		// }

		// .instructions::-webkit-scrollbar {
		// 	display: none; /* Chrome, Safari, Opera */
		// }

		// .title {
		// 	font-size: calc(4.5rem * var(--scale-factor));
		// 	word-wrap: break-word;
		// 	overflow-wrap: break-word;
		// }

		// /* 2. Fix sidebar horizontal scroll */
		// .copy {
		// 	margin-block-start: calc(4rem * var(--scale-factor));
		// 	padding: 1.5rem;
		// }

		// .copy-header {
		// 	grid-template-columns: repeat(2, auto);
		// 	grid-column-gap: 2rem;
		// 	margin-block-start: calc(-3rem * var(--scale-factor));
		// }

		// /* 3. Keep content text size as requested */
		// .paragraph {
		// 	font-size: calc(2.2rem * var(--scale-factor));
		// }

		/* 4. Add scale system to shape SVG */
		:global(.shape) {
			transform: scale(0.6);
			transform-origin: top left;
		}

		/* 5. Fix game header SVG and shape scaling */
		// .game-header {
		// 	padding: 0 calc(4rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		// }

		// /* Fix game header SVG sizing */
		// .game-header :global(svg) {
		// 	max-width: 100%;
		// 	width: 100%;
		// 	height: calc(30rem * var(--scale-factor));
		// 	inset-block-start: 0;
		// 	inset-inline-start: 0;
		// }

		// .game-header-title {
		// 	font-size: calc(3.5rem * var(--scale-factor));
		// }

		// .game-header-paragraph {
		// 	font-size: calc(2.4rem * var(--scale-factor));
		// }

		// /* 6. Fix question container positioning and scaling */
		// .game-grid {
		// 	grid-template-columns: calc(55rem * var(--scale-factor)) 1fr;
		// 	align-items: start;
		// 	padding: 2rem;
		// }
		

		/* Question wrapper for mobile - reset padding */
		// .question-wrapper {
		// 	padding-block: 0;
		// }

		/* 7. Adjust start screen for mobile */
		.start-screen {
			inline-size: calc(100vw - (100vw - 66.41%));
			padding: 1rem;
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
		// .game-summary {
		// 	padding: 2rem;
		// }

		// .game-summary .title {
		// 	font-size: calc(5rem * var(--scale-factor));
		// }

		// .game-summary .results {
		// 	inline-size: calc(80rem * var(--scale-factor));
		// 	padding: 2rem;

		// 	.paragraph {
		// 		padding-block-start: 0;
		// 		margin-block-start: 0;
		// 	}
		// }

		// .game-summary .paragraph {
		// 	font-size: calc(3.5rem * var(--scale-factor));
		// 	padding-block-start: 2rem;
		// }

		// .game-summary .total-points {
		// 	font-size: calc(6rem * var(--scale-factor));
		// }

		// .game-summary .cta {
		// 	padding-block-start: 2rem;
		// }

		// /* Adjust game ID for mobile */
		// .game-id {
		// 	block-size: 12rem;
		// 	inline-size: 8rem;
		// }

		// .game-id .text {
		// 	font-size: 2rem;
		// 	line-height: 2rem;
		// }

		// .game-id .number {
		// 	font-size: calc(9rem * var(--scale-factor));
		// 	line-height: calc(9rem * var(--scale-factor));
		// }

		/* Adjust subtitle for mobile */
		// .subtitle {
		// 	font-size: calc(2.5rem * var(--scale-factor));
		// 	word-wrap: break-word;
		// 	overflow-wrap: break-word;
		// }

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
		// .close-button {
		// 	inset-block-start: 1rem;
		// 	inset-inline-end: 2rem;
		// }

		// .play-button {
		// 	inset-block-start: 2rem;
		// 	inset-inline-end: -0.2rem;
		// }

		/* Adjust start button for mobile */
		// .start {
		// 	inset-block-start: calc(22rem * var(--scale-factor));
		// 	inset-inline-end: -2rem;
		// }

		// .start svg {
		// 	block-size: calc(30rem * var(--scale-factor));
		// 	inline-size: calc(30rem * var(--scale-factor));
		// }

		/* Fix sidebar closed state for mobile */
		// .instructions.closed {
		// 	transform: translateX(calc(-100% + 4rem * var(--scale-factor)));
		// }

		/* Adjust small hero summary for mobile */
		:global(.small-hero-summary) {
			inset-block-start: calc(4rem * var(--scale-factor));
			inset-inline-start: calc(6rem * var(--scale-factor));
			transform: scale(0.7);
			display: none;
		}

		// .game1-initial-screen-button {
		// 	background: none;
		// 	border: none;
		// 	padding: 0;
		// 	cursor: pointer;
		// }

		/* Adjust image button position for mobile */
		.image-button {
			position: relative;
			inset-inline-start: 6rem;
		}

		/* Adjust start screen content for mobile */
		.start-screen-content {
			overflow: hidden;
		}

		/* Adjust image button max-width for mobile */
		.image-button img {
			max-width: calc(60rem * var(--scale-factor));
		}

		/* Adjust subtitle position for mobile */
		// .subtitle {
		// 	position: relative;
		// 	inset-block-start: 1rem;
		// }

		/* Hide game6 hero before playing on mobile */
		.game6-hero-before-playing {
			display: none;
		}

		/* Content check section mobile adjustments */
		// .content-check {
		// 	padding-block-start: 2rem;
		// }

		// .content-check-grid {
		// 	gap: 1.5rem;
		// }

		// .content-check-btn {
		// 	width: 12rem;
		// 	height: 3rem;
		// 	font-size: 1.2rem;
		// }

		// .content-check-text {
		// 	font-size: 1.2rem;
		// 	line-height: 1.6rem;
		// }
	}
</style> 