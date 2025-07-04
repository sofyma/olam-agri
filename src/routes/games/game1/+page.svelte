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
								<span class="text">game</span>
								<span class="number">1</span>
							</div>

							<h2 class="subtitle">The Superpower of Branding</h2>
						</div>


						<p class="paragraph">We often don’t realise how much brands shape our global culture. Do you think that’s an exaggeration? Let’s find out!</p>
						<p class="paragraph">First, Vision Queen will show you some brands without their names. Will you recognise them?</p>
						<p class="paragraph">Then, she’ll test you with images of iconic places around the world.</p>
						<p class="paragraph">Each brand you get right earns you 1 point. For each place you fail to recognise, you’ll lose 1 point.</p>
						<p class="paragraph">What do you know better?</p>
					</div>
				</div>

				<div class="start-screen">
					<div class="start-screen-content">
						<Game1Hero />

						<div class="vision-queen-container">
							<h3 class="vision-queen-title">Vision Queen</h3>
							<p class="vision-queen-copy">She sees what others miss. Clues, signs, secrets... nothing escapes her sharp vision.</p>
						</div>

						<button class="start" on:click={startGame}>
							<svg width="396" height="396" viewBox="0 0 396 396" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="198" cy="198" r="198" fill="white"/>
								<path d="M168.969 147.14V148.58C168.969 151.46 168.019 153.82 166.119 155.66C164.219 157.48 161.739 158.39 158.679 158.39C155.439 158.39 152.759 157.34 150.639 155.24C148.539 153.14 147.489 150.56 147.489 147.5C147.489 144.46 148.539 141.89 150.639 139.79C152.759 137.67 155.379 136.61 158.499 136.61C160.459 136.61 162.249 137.06 163.869 137.96C165.489 138.86 166.749 140.07 167.649 141.59L164.679 143.3C164.119 142.3 163.289 141.5 162.189 140.9C161.089 140.28 159.859 139.97 158.499 139.97C156.299 139.97 154.489 140.69 153.069 142.13C151.649 143.57 150.939 145.37 150.939 147.53C150.939 149.69 151.649 151.48 153.069 152.9C154.509 154.32 156.389 155.03 158.709 155.03C160.569 155.03 162.079 154.6 163.239 153.74C164.419 152.86 165.169 151.69 165.489 150.23H158.469V147.14H168.969ZM183.793 143H187.033V158H183.793V155.84C182.573 157.54 180.823 158.39 178.543 158.39C176.483 158.39 174.723 157.63 173.263 156.11C171.803 154.57 171.073 152.7 171.073 150.5C171.073 148.28 171.803 146.41 173.263 144.89C174.723 143.37 176.483 142.61 178.543 142.61C180.823 142.61 182.573 143.45 183.793 145.13V143ZM175.663 153.95C176.563 154.85 177.693 155.3 179.053 155.3C180.413 155.3 181.543 154.85 182.443 153.95C183.343 153.03 183.793 151.88 183.793 150.5C183.793 149.12 183.343 147.98 182.443 147.08C181.543 146.16 180.413 145.7 179.053 145.7C177.693 145.7 176.563 146.16 175.663 147.08C174.763 147.98 174.313 149.12 174.313 150.5C174.313 151.88 174.763 153.03 175.663 153.95ZM207.19 142.61C208.89 142.61 210.26 143.16 211.3 144.26C212.34 145.36 212.86 146.84 212.86 148.7V158H209.62V148.91C209.62 147.87 209.36 147.07 208.84 146.51C208.32 145.93 207.61 145.64 206.71 145.64C205.71 145.64 204.91 145.97 204.31 146.63C203.73 147.29 203.44 148.28 203.44 149.6V158H200.2V148.91C200.2 147.87 199.95 147.07 199.45 146.51C198.97 145.93 198.28 145.64 197.38 145.64C196.4 145.64 195.6 145.98 194.98 146.66C194.36 147.32 194.05 148.3 194.05 149.6V158H190.81V143H194.05V144.8C195.01 143.34 196.44 142.61 198.34 142.61C200.26 142.61 201.68 143.4 202.6 144.98C203.6 143.4 205.13 142.61 207.19 142.61ZM218.878 151.88C219.118 153.02 219.668 153.9 220.528 154.52C221.388 155.12 222.438 155.42 223.678 155.42C225.398 155.42 226.688 154.8 227.548 153.56L230.218 155.12C228.738 157.3 226.548 158.39 223.648 158.39C221.208 158.39 219.238 157.65 217.738 156.17C216.238 154.67 215.488 152.78 215.488 150.5C215.488 148.26 216.228 146.39 217.708 144.89C219.188 143.37 221.088 142.61 223.408 142.61C225.608 142.61 227.408 143.38 228.808 144.92C230.228 146.46 230.938 148.33 230.938 150.53C230.938 150.87 230.898 151.32 230.818 151.88H218.878ZM218.847 149.24H227.668C227.448 148.02 226.938 147.1 226.138 146.48C225.358 145.86 224.438 145.55 223.378 145.55C222.178 145.55 221.178 145.88 220.378 146.54C219.578 147.2 219.068 148.1 218.847 149.24ZM245.308 137H248.308V158H244.858V140.69L240.628 141.89L239.788 138.95L245.308 137Z" fill="#FF7000"/>
								<path d="M118.101 249.235C111.704 249.235 106.258 247.778 101.761 244.865C97.3276 241.952 94.2243 237.962 92.4509 232.895L101.856 227.385C104.516 234.858 110.026 238.595 118.386 238.595C122.503 238.595 125.574 237.803 127.601 236.22C129.691 234.573 130.736 232.452 130.736 229.855C130.736 227.132 129.628 225.073 127.411 223.68C125.194 222.223 121.268 220.64 115.631 218.93C112.464 217.98 109.899 217.093 107.936 216.27C105.973 215.447 103.883 214.307 101.666 212.85C99.5126 211.33 97.8976 209.462 96.8209 207.245C95.7443 205.028 95.2059 202.432 95.2059 199.455C95.2059 193.565 97.2959 188.91 101.476 185.49C105.656 182.007 110.691 180.265 116.581 180.265C121.901 180.265 126.556 181.563 130.546 184.16C134.536 186.757 137.608 190.335 139.761 194.895L130.546 200.215C127.759 194.008 123.104 190.905 116.581 190.905C113.414 190.905 110.881 191.665 108.981 193.185C107.081 194.642 106.131 196.637 106.131 199.17C106.131 201.64 107.081 203.603 108.981 205.06C110.944 206.453 114.459 207.942 119.526 209.525C122.059 210.348 123.896 210.982 125.036 211.425C126.239 211.805 127.886 212.438 129.976 213.325C132.129 214.212 133.744 215.098 134.821 215.985C135.898 216.872 137.038 217.98 138.241 219.31C139.508 220.64 140.394 222.16 140.901 223.87C141.408 225.58 141.661 227.512 141.661 229.665C141.661 235.682 139.476 240.463 135.106 244.01C130.799 247.493 125.131 249.235 118.101 249.235ZM175.522 210.38H163.742V233.18C163.742 235.143 164.185 236.568 165.072 237.455C165.958 238.278 167.257 238.753 168.967 238.88C170.74 238.943 172.925 238.912 175.522 238.785V248C167.668 248.95 162.032 248.285 158.612 246.005C155.192 243.662 153.482 239.387 153.482 233.18V210.38H144.742V200.5H153.482V190.24L163.742 187.2V200.5H175.522V210.38ZM220.499 200.5H230.759V248H220.499V241.16C216.636 246.543 211.094 249.235 203.874 249.235C197.351 249.235 191.777 246.828 187.154 242.015C182.531 237.138 180.219 231.217 180.219 224.25C180.219 217.22 182.531 211.298 187.154 206.485C191.777 201.672 197.351 199.265 203.874 199.265C211.094 199.265 216.636 201.925 220.499 207.245V200.5ZM194.754 235.175C197.604 238.025 201.182 239.45 205.489 239.45C209.796 239.45 213.374 238.025 216.224 235.175C219.074 232.262 220.499 228.62 220.499 224.25C220.499 219.88 219.074 216.27 216.224 213.42C213.374 210.507 209.796 209.05 205.489 209.05C201.182 209.05 197.604 210.507 194.754 213.42C191.904 216.27 190.479 219.88 190.479 224.25C190.479 228.62 191.904 232.262 194.754 235.175ZM252.978 208.48C255.575 202.59 260.451 199.645 267.608 199.645V210.76C263.681 210.507 260.261 211.457 257.348 213.61C254.435 215.7 252.978 219.183 252.978 224.06V248H242.718V200.5H252.978V208.48ZM302.9 210.38H291.12V233.18C291.12 235.143 291.563 236.568 292.45 237.455C293.336 238.278 294.635 238.753 296.345 238.88C298.118 238.943 300.303 238.912 302.9 238.785V248C295.046 248.95 289.41 248.285 285.99 246.005C282.57 243.662 280.86 239.387 280.86 233.18V210.38H272.12V200.5H280.86V190.24L291.12 187.2V200.5H302.9V210.38Z" fill="#FF7000"/>
							</svg>
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
					<div style="padding-block: calc(7rem * var(--scale-factor)); padding-inline: 0 calc(7rem * var(--scale-factor));">
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

	.start {
		inset-block-end: calc(12rem * var(--scale-factor));
		inset-inline-end: 0;
		position: absolute;

		svg {
			block-size: calc(39.6rem * var(--scale-factor));
			inline-size: calc(39.6rem * var(--scale-factor));
		}
	}

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

	.vision-queen-container {
		inset-block-end: calc(-11rem * var(--scale-factor));
		inset-inline-start: 0;
		max-inline-size: calc(26rem * var(--scale-factor));
		position: absolute !important;
	}

	.vision-queen-title {
		color: #000;
		font-size: calc(3rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.vision-queen-copy {
		color: #000;
		font-size: calc(1.8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}
</style> 