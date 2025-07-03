<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game6Store } from '$lib/stores/game6Store';
    import { game6Availability, gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
    import { authStore } from '$lib/stores/authStore';
    import type { Question } from '$lib/types/game6';
	import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
    
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
        
        console.log('Game 6 availability check:', {
            isAvailable: $game6Availability.isAvailable,
            config: $game6Availability.config
        });
        
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
		showWelcome = true;
	}

	function startQuestions() {
		showWelcome = false;
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
			<div class="instructions" class:closed={instructionsClosed}>
				{#if !instructionsClosed}
					<button class="close-button" on:click={() => { instructionsClosed = true; instructionsClosedSidebar = true; }}>
						<svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<line x1="0.353553" y1="0.646447" x2="22.3536" y2="22.6464" stroke="white"/>
							<line x1="22.3536" y1="1.35355" x2="0.353554" y2="23.3536" stroke="white"/>
						</svg>
					</button>
				{:else}
					<button class="play-button" on:click={() => { instructionsClosed = false; instructionsClosedSidebar = false; }}>
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
							<span class="number">6</span>
						</div>

						<h2 class="subtitle">Only the Fastest Will Reach the Sky</h2>
					</div>

					<p class="paragraph">Mystic Man can see into your mind just by looking into your eyes.</p>
					<p class="paragraph">He reads your thoughts, senses your past, and predicts your next move.</p>
					<p class="paragraph">Dare to meet his gaze? Reach the end and earn 5 points.</p>
					<p class="paragraph">He already knows you’re about to hit Start.</p>
				</div>
			</div>

			<div class="start-screen">
				<img src="/images/game6-start-shape.png" alt="Start Game" class="start-screen-shape" />

				<div class="start-screen-content">
					<button on:click={startGame} class="image-button" aria-label="Start Game">
						<img src="/images/game6-start-screen.png" alt="Start Game" />
					</button>
				</div>

				<div class="explanation">
					<h2 class="explanation-title">Mystic Man</h2>
					<p class="explanation-copy">Reader of thoughts, keeper of secrets, master of what’s to come. Nothing escapes his mind.</p>
				</div>
			</div>
		</div>

    {:else if showWelcome}
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
	}

	.game6-shape-before-playing {
		inset-block-end: 20%;
		inset-inline-start: 50%;
		position: absolute;
		transform: translate(-50%, 20%);
		z-index: -1;
	}

	.game6-hero-before-playing {
		margin-block-start: -7rem;
		margin-inline-start: 7rem;
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
		max-width: 105.2rem;
	}

	.question-card {
		background-color: #fff;
		border-radius: 0 3rem;
		padding: 6rem 7rem 13rem;
		position: relative;
		width: 100%;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.question-header {
		margin-block-end: 4rem;
		text-align: center;
	}

	.question-title {
		color: #2E2D2C;
		font-size: 4rem;
		font-weight: 400;
		line-height: normal;
	}

	.options-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: 4rem;
	}

	.option-button {
		align-items: center;
		border: .1rem solid #00A865;
		border-radius: 2rem;
		cursor: pointer;
		display: flex;
		gap: 2rem;
		padding: 3rem 4rem;
		transition: all 0.3s ease;
		width: 100%;
	}

	.option-text {
		color: #2E2D2C;
		font-size: 2.4rem;
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
		margin-block-start: 6rem;
		margin-inline: auto;
		padding: 1.5rem 4rem;
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
		border-radius: 0 3rem;
		inline-size: 100%;
		max-inline-size: 105.2rem;
		padding: 6rem 7rem 13rem;
		text-align: center;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.welcome-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.welcome-text {
		color: #2E2D2C;
		font-size: 3.2rem;
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
		padding: .5rem 2rem;
		transition: background-color 0.3s ease;
		width: fit-content;

		&:hover {
			background-color: #008F56;
		}
	}

	.game-panel {
		position: relative;
	}

	.instructions {
		background-color: #2E2D2C;
		block-size: 100vh;
		border-radius: 0 6rem 0 0;
		inset-block-start: 0;
		inset-inline-start: 0;
		inline-size: calc(100vw - 66.41%);
		overflow-y: auto;
		padding: 5rem 6rem 9rem;
		position: fixed;
		transition: transform 0.3s ease-in-out;
		z-index: 9999;

		&.closed {
			transform: translateX(calc(-100% + 5rem));
		}
	}

	:global(.instructions .logo path) {
		fill: #fff;
	}

	.close-button,
	.play-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 1rem;
		position: absolute;
		z-index: 10000;

		&:hover {
			opacity: 0.8;
		}
	}

	.close-button {
		inset-block-start: 2rem;
		inset-inline-end: 2rem;

		svg {
			block-size: 2.4rem;
			inline-size: 2.3rem;
		}
	}

	.play-button {
		inset-block-start: 2rem;
		inset-inline-end: 0;

		svg {
			block-size: 3.3rem;
			inline-size: 2.7rem;
		}
	}

	.copy {
		background-color: #fff;
		margin-block-start: 6.5rem;
		padding: 2rem 2rem 4rem;
		position: relative;

		&-header {
			align-items: end;
			display: grid;
			grid-column-gap: 3rem;
			grid-template-columns: repeat(2, auto);
			justify-content: start;
			margin-block-start: -5rem;
		}
	}

	.game-id {
		align-items: center;
		background-color: #00A865;
		block-size: 17rem;
		border-radius: 0 2rem 0 2rem;
		color: #fff;
		display: flex;
		flex-direction: column;
		inline-size: 11rem;
		padding: 1rem;
		text-align: center;

		.text {
			font-size: 2.8rem;
			font-weight: 600;
			line-height: 2.8rem;
		}

		.number {
			font-size: 13.7rem;
			font-weight: 600;
			line-height: 13.7rem;
		}
	}

	.title {
		color: #00A865;
		font-size: 6rem;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		padding-block-start: 2rem;
	}

	.subtitle {
		color: #00A865;
		font-size: 3.7rem;
		font-weight: 600;
		line-height: normal;
	}

	.paragraph {
		color: #2E2D2C;
		font-size: 2.2rem;
		padding-block-start: 2rem;

		&:first-child {
			padding-block-start: 2.5rem;
		}
	}

	.start-screen {
		display: flex;
		inline-size: calc(100vw - (100vw - 66.41%));
		justify-content: flex-end;
		margin-inline-start: auto;
		padding-inline-end: 8.5rem;
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
			inset-inline-start: 10rem;
		}
	}

	.loading,
	.error {
		align-items: center;
		block-size: 100vh;
		color: #fff;
		display: flex;
		font-size: 3rem;
		justify-content: center;
	}

	.image-button {
		background: transparent;
		border: none;
		cursor: pointer;
		margin: 0;
		padding: 0;
	}

	.explanation {
		color: #000;
		font-weight: 600;
		line-height: normal;
		inline-size: 23.5rem;
		inset-block-end: 5rem;
		inset-inline-start: 5rem;
		margin-inline: auto;
		position: absolute;

		&-title {
			font-size: 3rem;
		}

		&-copy {
			font-size: 1.8rem;
		}
	}
</style> 