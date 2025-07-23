<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game5Store } from '$lib/stores/game5Store';
    import { game5Availability } from '$lib/stores/gameAvailabilityStore';
    import { Game5Service } from '$lib/services/game5Service';
    import Question from '$lib/components/games/game5/Question.svelte';
    import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
    import { onDestroy } from 'svelte';
    
    let isLoading = true;
    let error: string | null = null;
	let showInstructions = true;
	let instructionsClosed = false;
	let instructionsClosedSidebar = false;
    let userAnswer = '';
    let feedbackMessage = '';
    let isCorrectAnswer = false;
    let showSuccessScreen = false;
    let attempts = 0;
    
    const gameService = Game5Service.getInstance();
    const CORRECT_ANSWER = "We're Olam Agri";
    
    onMount(async () => {
        try {
            // Check if game is available
            if (!$game5Availability.isAvailable) {
                goto('/games/info/5');
                return;
            }

			game5Store.initialize();
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

	function closeInstructions() {
		instructionsClosed = true;
		instructionsClosedSidebar = true;
	}

	function openInstructions() {
		instructionsClosed = false;
		instructionsClosedSidebar = false;
	}

	$: if ($game5Store.isComplete) {
		showSuccessScreen = true;
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
        const isCorrect = userAnswer.trim() === CORRECT_ANSWER;
        isCorrectAnswer = isCorrect;
        
        if (isCorrect) {
            feedbackMessage = 'Correct! You found the answer!';
            game5Store.submitAnswer(userAnswer.trim());
            showSuccessScreen = true;
        } else {
            feedbackMessage = 'Wrong answer!\nPlease try again';
            // Clear feedback after 3 seconds
            setTimeout(() => {
                feedbackMessage = '';
            }, 3000);
        }
        
        userAnswer = ''; // Clear input after submission
    }

    function replayGame() {
        showSuccessScreen = false;
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

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar}>
        
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
							<span class="number">5</span>
						</div>

						<h2 class="subtitle">Only the Fastest Will Reach the Sky</h2>
					</div>

					<p class="paragraph">Caution!</p>
					<p class="paragraph">This is a time-sensitive challenge. Use the light signal to call Rocket Girl and start the game.</p>
					<p class="paragraph">If you manage to complete the game you'll earn 1 point, but you'll have to be very fast because the time you take will be used as a tiebreaker if there's a draw with other participants at the end of the campaign.</p>
					<p class="paragraph">In the next screen, read carefully all the steps before doing anything!</p>
					<p class="paragraph">Are you ready? 3, 2, 1...</p>
				</div>

				<div class="content-check">
					<div class="content-check-grid">
						<button class="content-check-btn" on:click={() => goto('/games/info/5')}>
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
						<span class="number">5</span>
					</div>

					<h2 class="subtitle">Only the Fastest Will Reach the Sky</h2>
				</div>

				<p class="paragraph">Caution!</p>
				<p class="paragraph">This is a time-sensitive challenge. Use the light signal to call Rocket Girl and start the game.</p>
				<p class="paragraph">If you manage to complete the game you'll earn 5 points, but you'll have to be very fast because the time you take will be used as a tiebreaker if there's a draw with other participants at the end of the campaign.</p>
				<p class="paragraph">In the next screen, read carefully all the steps before doing anything!</p>
				<p class="paragraph">Are you ready? 3, 2, 1...</p>
			</div>

			<div class="content-check">
				<div class="content-check-grid">
					<button class="content-check-btn" on:click={() => goto('/games/info/5')}>
						Check content
					</button>
					<div class="content-check-text">
						Have you read the related content?<br>
						You'll do better in the game if you check it first!
					</div>
				</div>
			</div>
		</div>

		{#if showSuccessScreen}
			<div class="success-screen">
				<div class="success-container">
					<h2 class="success-title">Congratulations!</h2>
					<p class="success-message">You found the answer in {$game5Store.timeSpent ? formatTime($game5Store.timeSpent) : '00:00'}!</p>
					<div class="success-score">
						<span class="score-label">Score:</span>
						<span class="score-value">5 points</span>
					</div>
					<div class="success-buttons">
						<button class="replay-button" on:click={replayGame}>
							Replay
						</button>
						<button class="finish-button" on:click={finishGame}>
							Finish
						</button>
					</div>
				</div>
			</div>
		{:else}
			<div class="game-grid">
				<div class="game-hero-column">
					<img src="/images/heroe-5-1.png" alt="Game 5 Hero" class="game-hero-image">
				</div>
				
				<div class="game-content-column">
					<div class="timer">
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
									disabled={showSuccessScreen}
									on:keydown={(e) => e.key === 'Enter' && !showSuccessScreen && submitAnswer()}
									placeholder="Answer"
									type="text"
								/>
								{#if feedbackMessage}
									<div class="result-message {isCorrectAnswer ? 'correct' : 'incorrect'}">
										{feedbackMessage}
									</div>
								{/if}
							</div>
							<button
								class="send-button"
								disabled={showSuccessScreen || !userAnswer.trim()}
								on:click={submitAnswer}
								type="button"
							>
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
    .game-container {
		background-color: #00B2E7;
		position: relative;
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
		align-items: center;
		block-size: 100vh;
		display: grid;
		gap: calc(4rem * var(--scale-factor));
		grid-template-columns: calc(69.6rem * var(--scale-factor)) 1fr;
		justify-content: center;
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

	.game-content-column {
		display: flex;
		flex-direction: column;
		gap: calc(3rem * var(--scale-factor));
		inline-size: calc(87rem * var(--scale-factor));
	}

	.timer {
		align-items: center;
		background: #00B2E7;
		border-radius: calc(1rem * var(--scale-factor));
		block-size: calc(4rem * var(--scale-factor));
		color: #FFF;
		display: flex;
		font-size: calc(12rem * var(--scale-factor));
		font-weight: 600;
		justify-content: flex-start;
		line-height: normal;
	}

	.game-container-white {
		background: #FFF;
		border-radius: 0 calc(3.5rem * var(--scale-factor));
		block-size: calc(73.7rem * var(--scale-factor));
		display: flex;
		flex-direction: column;
		gap: 0;
		inline-size: calc(87rem * var(--scale-factor));
		margin-block-start: calc(3rem * var(--scale-factor));
		padding: calc(5.5rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
	}

	.game-title {
		color: #00B2E7;
		font-size: calc(4.5rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		margin-block-start: calc(1.5rem * var(--scale-factor));
	}

	.game-description {
		color: #2E2D2C;
		font-size: calc(2.2rem * var(--scale-factor));
		font-weight: 400;
		line-height: normal;
		margin-block-start: calc(1.5rem * var(--scale-factor));

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
		margin-block-start: calc(1.5rem * var(--scale-factor));

		.highlight {
			color: #00B2E7;
		}

		a {
			color: #00B2E7;
			text-decoration: underline;
			text-decoration-color: #00B2E7;
			text-decoration-thickness: calc(0.2rem * var(--scale-factor));

			&:hover {
				opacity: 0.8;
			}
		}
	}

	.input-section {
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		gap: calc(2rem * var(--scale-factor));
		margin-block-start: calc(2rem * var(--scale-factor));
	}

	.input-container {
		align-items: center;
		display: flex;
		gap: calc(3rem * var(--scale-factor));
		inline-size: 100%;
	}

	.answer-input {
		background: #FFF;
		border: calc(0.2rem * var(--scale-factor)) solid #999;
		border-radius: calc(0.5rem * var(--scale-factor));
		color: #999;
		font-size: calc(2rem * var(--scale-factor));
		font-weight: 400;
		inline-size: calc(43rem * var(--scale-factor));
		line-height: 125%;
		padding: calc(1.5rem * var(--scale-factor));

		&::placeholder {
			color: #999;
			opacity: 1;
		}
	}

	.result-message {
		color: #2E2D2C;
		font-size: calc(2rem * var(--scale-factor));
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

	.send-button {
		align-items: center;
		background: #00B2E7;
		border: none;
		border-radius: 0 calc(3.5rem * var(--scale-factor));
		block-size: calc(4.4rem * var(--scale-factor));
		color: #FFF;
		cursor: pointer;
		display: flex;
		font-family: Gilroy-SemiBold;
		font-size: calc(2rem * var(--scale-factor));
		font-style: normal;
		font-weight: 400;
		inline-size: calc(10.7rem * var(--scale-factor));
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

	.feedback-message {
		color: #FF3000;
		font-size: calc(2.2rem * var(--scale-factor));
		font-weight: 400;
		line-height: normal;
		text-align: center;

		&.correct {
			color: #00A865;
		}
	}

	.game-id {
		align-items: center;
		background-color: #00B2E7;
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
		color: #00B2E7;
		font-size: calc(6rem * var(--scale-factor));
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		padding-block-start: calc(2rem * var(--scale-factor));
	}

	.subtitle {
		color: #00B2E7;
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

	.game5-initial-screen-image {
		object-fit: cover;
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
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */

		&::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Opera */
		}

		&.closed {
			transform: translateX(calc(-100% + calc(5rem * var(--scale-factor))));
		}
	}

	:global(.instructions .logo path) {
		fill: #fff;
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
		background-color: #00B2E7;
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

	.success-screen {
		align-items: center;
		block-size: 100vh;
		display: flex;
		justify-content: center;
		position: relative;
	}

	.success-container {
		align-items: center;
		background: #FFF;
		border-radius: calc(3.5rem * var(--scale-factor));
		display: flex;
		flex-direction: column;
		gap: calc(3rem * var(--scale-factor));
		inline-size: calc(60rem * var(--scale-factor));
		padding: calc(5rem * var(--scale-factor));
		text-align: center;
	}

	.success-title {
		color: #00B2E7;
		font-size: calc(4.5rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.success-message {
		color: #2E2D2C;
		font-size: calc(2.2rem * var(--scale-factor));
		font-weight: 400;
		line-height: normal;
	}

	.success-score {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: calc(1rem * var(--scale-factor));
	}

	.score-label {
		color: #2E2D2C;
		font-size: calc(2rem * var(--scale-factor));
		font-weight: 400;
	}

	.score-value {
		color: #00B2E7;
		font-size: calc(3.5rem * var(--scale-factor));
		font-weight: 600;
	}

	.success-buttons {
		display: flex;
		gap: calc(2rem * var(--scale-factor));
		margin-block-start: calc(2rem * var(--scale-factor));
	}

	.replay-button, .finish-button {
		background-color: #00B2E7;
		border: none;
		border-radius: 0 calc(1.7rem * var(--scale-factor));
		color: #fff;
		cursor: pointer;
		font-size: calc(2rem * var(--scale-factor));
		font-weight: 600;
		padding: calc(1.5rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		transition: background-color 0.3s ease;

		&:hover {
			background-color: #0088B3;
		}
	}

	.finish-button {
		background-color: #2E2D2C;

		&:hover {
			background-color: #1a1a1a;
		}
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

		/* 4. Fix game header SVG and shape scaling */
		.game-header {
			padding: 0 calc(4rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		}

		.game-header-title {
			font-size: calc(3.5rem * var(--scale-factor));
		}

		.game-header-paragraph {
			font-size: calc(2.4rem * var(--scale-factor));
		}

		/* 5. Fix question container positioning and scaling */
		.game-grid {
			grid-template-columns: 1fr;
			align-items: start;
			padding: calc(2rem * var(--scale-factor));
		}

		.game-hero-column {
			order: 2;
		}

		.game-hero-image {
			max-inline-size: calc(30rem * var(--scale-factor));
		}

		.game-content-column {
			order: 1;
			gap: calc(2rem * var(--scale-factor));
		}

		.timer {
			font-size: calc(8rem * var(--scale-factor));
			margin-inline-start: calc(1rem * var(--scale-factor));
		}

		.game-container-white {
			block-size: auto;
			inline-size: 100%;
			padding: calc(3rem * var(--scale-factor)) calc(2rem * var(--scale-factor));
		}

		.game-title {
			font-size: calc(3rem * var(--scale-factor));
			margin-block-start: calc(1rem * var(--scale-factor));
		}

		.game-description {
			font-size: calc(1.8rem * var(--scale-factor));
			margin-block-start: calc(1rem * var(--scale-factor));
		}

		.steps-list {
			font-size: calc(2.2rem * var(--scale-factor));
			line-height: calc(3rem * var(--scale-factor));
			margin-block-start: calc(1rem * var(--scale-factor));

			.highlight {
				/* No underline for highlights */
			}

			a {
				text-decoration-thickness: calc(0.1rem * var(--scale-factor));
			}
		}

		.input-section {
			align-items: flex-start;
			margin-block-start: calc(1.5rem * var(--scale-factor));
		}

		.answer-input {
			font-size: calc(1.6rem * var(--scale-factor));
			inline-size: 100%;
		}

		.send-button {
			font-size: calc(1.8rem * var(--scale-factor));
			inline-size: calc(12rem * var(--scale-factor));
			padding: calc(1rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
		}

		.feedback-message {
			font-size: calc(1.8rem * var(--scale-factor));
		}
		

		/* Question wrapper for mobile - reset padding */
		.question-wrapper {
			padding-block: 0;
		}

		/* 6. Adjust start screen for mobile */
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

		/* Adjust buttons for mobile */
		.close-button {
			inset-block-start: calc(1rem * var(--scale-factor));
			inset-inline-end: calc(2rem * var(--scale-factor));
		}

		.play-button {
			inset-block-start: calc(2rem * var(--scale-factor));
			inset-inline-end: calc(-0.2rem * var(--scale-factor));
		}

		/* Fix sidebar closed state for mobile */
		.instructions.closed {
			transform: translateX(calc(-100% + 4rem * var(--scale-factor)));
		}

		.game5-initial-screen-button {
			background: none;
			border: none;
			padding: 0;
			cursor: pointer;
		}

		.success-container {
			inline-size: 90%;
			padding: calc(3rem * var(--scale-factor));
		}

		.success-title {
			font-size: calc(3rem * var(--scale-factor));
		}

		.success-message {
			font-size: calc(1.8rem * var(--scale-factor));
		}

		.score-label {
			font-size: calc(1.6rem * var(--scale-factor));
		}

		.score-value {
			font-size: calc(2.5rem * var(--scale-factor));
		}

		.success-buttons {
			flex-direction: column;
			gap: calc(1rem * var(--scale-factor));
		}

		.replay-button, .finish-button {
			font-size: calc(1.8rem * var(--scale-factor));
			padding: calc(1rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
		}
	}
</style>



