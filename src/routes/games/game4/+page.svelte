<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game4Store } from '$lib/stores/game4Store';
    import { game4Availability, gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
    import { authStore } from '$lib/stores/authStore';
    import type { Statement } from '$lib/types/game4';

    import GameInstructions from '$lib/components/GameInstructions.svelte';
    
    let showInstructions = true;
	let instructionsClosed = false;
	let instructionsClosedSidebar = false;
	let isGamePlaying = false;
	let showResult = false;
	let resultTimeout: NodeJS.Timeout;
	let displayIndex = 0; // Track the displayed statement index
	
	// Touch/swipe variables
	let touchStartX = 0;
	let touchStartY = 0;
	let touchEndX = 0;
	let touchEndY = 0;
	let isMouseDown = false;
	let isDragging = false;

    // Reactive statement to handle navigation when game is complete
    $: if ($game4Store.isComplete && $game4Store.isPlaying) {
        console.log('Game complete detected, saving result and navigating to summary...');
        
        // Save the game result if user is authenticated
        if ($authStore.user) {
            game4Store.saveResult($authStore.user._id).catch(error => {
                console.error('Failed to save game result:', error);
            });
        }
        
        // Add a small delay to ensure all state updates are processed
        setTimeout(() => {
            goto('/games/game4/summary');
        }, 500);
    }

    onMount(async () => {
        // Load game configs if not already loaded
        await gameAvailabilityStore.loadGameConfigs();
        
        // Check if game is available
        if (!$game4Availability.isAvailable) {
            goto('/games/info/4');
            return;
        }

        await game4Store.initialize();
    });
    
	function startGame() {
		showInstructions = false;
		instructionsClosed = true;
		instructionsClosedSidebar = true;
		isGamePlaying = true;
		game4Store.start();
		displayIndex = 0;
	}

	function handleSwipe(direction: 'left' | 'right') {
		if (showResult || !$game4Store.isPlaying) return;
		
		// Clear any existing timeout
		if (resultTimeout) {
			clearTimeout(resultTimeout);
		}
		
		// Process the swipe
		game4Store.swipeStatement(direction);
		
		// Show result feedback
		showResult = true;
		
		// Check if this was the last statement (before the swipe updates the index)
		const currentIndex = $game4Store.currentStatementIndex;
		const totalStatements = $game4Store.statements.length;
		const isLastStatement = currentIndex + 1 >= totalStatements;
		
		console.log('Swipe info:', {
			direction,
			currentIndex,
			totalStatements,
			isLastStatement,
			displayIndex
		});
		
		// Show result for 1 second then continue
		resultTimeout = setTimeout(() => {
			showResult = false;
			
			// Update the display index after feedback disappears
			displayIndex = $game4Store.currentStatementIndex;
			
			console.log('After feedback:', {
				displayIndex,
				isLastStatement,
				willNavigate: isLastStatement
			});
			
			// Navigation is now handled by the reactive statement above
		}, 1000);
	}

	function handleTouchStart(event: TouchEvent) {
		if (showResult || !$game4Store.isPlaying) return;
		
		const touch = event.touches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
	}

	function handleTouchMove(event: TouchEvent) {
		if (showResult || !$game4Store.isPlaying) return;
		
		// Prevent default to avoid scrolling
		event.preventDefault();
		
		const touch = event.touches[0];
		touchEndX = touch.clientX;
		touchEndY = touch.clientY;
	}

	function handleTouchEnd(event: TouchEvent) {
		if (showResult || !$game4Store.isPlaying) return;
		
		const touch = event.changedTouches[0];
		touchEndX = touch.clientX;
		touchEndY = touch.clientY;
		
		handleSwipeGesture();
	}

	function handleSwipeGesture() {
		const minSwipeDistance = 50; // Minimum distance for a swipe
		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;
		
		// Check if it's a horizontal swipe (more horizontal than vertical)
		if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
			if (deltaX > 0) {
				// Swipe right - correct
				handleSwipe('right');
			} else {
				// Swipe left - incorrect
				handleSwipe('left');
			}
		}
	}

	function handleMouseDown(event: MouseEvent) {
		if (showResult || !$game4Store.isPlaying) return;
		
		isMouseDown = true;
		touchStartX = event.clientX;
		touchStartY = event.clientY;
	}

	function handleMouseMove(event: MouseEvent) {
		if (showResult || !$game4Store.isPlaying || !isMouseDown) return;
		
		touchEndX = event.clientX;
		touchEndY = event.clientY;
		
		// Check if we're actually dragging (moved more than 5px)
		const deltaX = Math.abs(touchEndX - touchStartX);
		const deltaY = Math.abs(touchEndY - touchStartY);
		if (deltaX > 5 || deltaY > 5) {
			isDragging = true;
		}
	}

	function handleMouseUp(event: MouseEvent) {
		if (showResult || !$game4Store.isPlaying || !isMouseDown) return;
		
		isMouseDown = false;
		isDragging = false;
		touchEndX = event.clientX;
		touchEndY = event.clientY;
		
		handleSwipeGesture();
	}
</script>

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar} class:playing={isGamePlaying}>
	
    {#if showInstructions}
		<div class="game-panel">
			<GameInstructions 
				gameNumber={4}
				gameTitle="Brand Heroes"
				gameSubtitle="Choose<br>a Side"
				infoRoute="/games/info/4"
				bind:instructionsClosed
				primaryColor="#FFC400"
				backgroundColor="#2E2D2C"
				logoColor="#fff"
				gameIdTextColor="#2E2D2C"
				contentCheckBtnTextColor="#2E2D2C"
				paragraphs={[
					"All heroes face the battle between good and evil, with great power comes great responsibility!",
					"Now it's your turn: decide if each statement about layouts, templates, tone of voice, and brand design is right or wrong.",
					"You'll start with 5 points, but lose 1 for every wrong decision.",
					"Ready for the challenge? Hit Start!"
				]}
			>

			</GameInstructions>

			<div class="start-screen">
				<img src="/images/game4-start-screen-shape.png" alt="Start Game" class="start-screen-shape" />

				<div class="start-screen-content">
					<button on:click={startGame} class="image-button" aria-label="Start Game">
						<img src="/images/game4-start-screen.png" alt="Start Game" />

						<div class="explanation">
							<h2 class="explanation-title">Mr Evil and Mr Good</h2>
							<p class="explanation-copy">Two sides of the same mind. One guides you with wisdom, the other tempts you into mistakes.</p>
						</div>
					</button>
				</div>
			</div>
		</div>

    {:else if $game4Store.isLoading}
        <div class="loading">Loading statements...</div>
    {:else if $game4Store.error}
        <div class="error">
            <h2>Game Setup Required</h2>
            <p>{$game4Store.error}</p>
            <p>Please add some Game 4 statements in your Sanity Studio to play this game.</p>
        </div>
    {:else}
		<GameInstructions 
			gameNumber={4}
			gameTitle="Brand Heroes"
			gameSubtitle="The Layout<br>Challenge"
			infoRoute="/games/info/4"
			bind:instructionsClosed
			primaryColor="#FFC400"
			backgroundColor="#2E2D2C"
			logoColor="#fff"
			gameIdTextColor="#2E2D2C"
			contentCheckBtnTextColor="#2E2D2C"
			paragraphs={[
				"Test your knowledge of good layout design! Swipe left for incorrect layouts and right for correct ones.",
				"Each correct answer earns you 1 point. Wrong answers cost you 1 point.",
				"Can you spot the good layouts from the bad ones?"
			]}
		/>

		<div class="game-area" 
			role="button"
			aria-label="Game swipe area"
			tabindex="0"
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:touchend={handleTouchEnd}
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
		>
			{#if $game4Store.isPlaying && $game4Store.statements[displayIndex]}
				<div class="game-content">

					<img src="/images/game4-shape-incorrect.png" alt="" class="game4-shape game4-shape-incorrect">
					

									
					<button 
						class="swipe-button swipe-button-incorrect" 
						on:click={() => handleSwipe('left')}
						on:keydown={(e) => {
							if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
								e.preventDefault();
								handleSwipe('left');
							}
						}}
					>
						<img class="game4-hero-incorrect" src="/images/game4-hero-incorrect.png" alt="">
						
						<svg width="39" height="47" viewBox="0 0 39 47" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M0 23.02L38.54 0V46.04L0 23.02Z" fill="white"/>
						</svg>
 
						<div style="text-align: end;">Swipe or click if it's <span>incorrect</span></div>
					</button>
					
					<div class="card-container">
						<div class="counter">
							{displayIndex + 1} / {$game4Store.statements.length}
						</div>
						
						<div 
							class="statement-card" 
							class:dragging={isDragging}
							role="button"
							tabindex="0"
							aria-label="Swipe left for incorrect, right for correct"
							on:keydown={(e) => {
								if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
									e.preventDefault();
									handleSwipe('left');
								} else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
									e.preventDefault();
									handleSwipe('right');
								}
							}}
							on:touchstart={handleTouchStart}
							on:touchmove={handleTouchMove}
							on:touchend={handleTouchEnd}
							on:mousedown={handleMouseDown}
							on:mousemove={handleMouseMove}
							on:mouseup={handleMouseUp}
						>
							{#if showResult}
								<div class="result-panel">
									<div class="result-content">
										{#if $game4Store.statements[displayIndex]?.isCorrect}
											<svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M420 210C420 94.0202 325.98 0 210 0C94.0202 0 0 94.0202 0 210C0 325.98 94.0202 420 210 420C325.98 420 420 325.98 420 210Z" fill="#00A865"/>
											<path d="M110.77 221.12L169.51 279.86L309.23 140.14" stroke="white" stroke-width="50" stroke-miterlimit="10" stroke-linecap="round"/>
											</svg>
										{:else}
											<svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M420 210C420 94.0202 325.98 0 210 0C94.0202 0 0 94.0202 0 210C0 325.98 94.0202 420 210 420C325.98 420 420 325.98 420 210Z" fill="#FF3000"/>
											<path d="M145.68 274.32L274.32 145.68" stroke="white" stroke-width="50" stroke-miterlimit="10" stroke-linecap="round"/>
											<path d="M145.68 145.68L274.32 274.32" stroke="white" stroke-width="50" stroke-miterlimit="10" stroke-linecap="round"/>
											</svg>
										{/if}
									</div>
								</div>
							{/if}
							
							<div class="statement-header">
								<h2 class="statement-title">This layout is..</h2>
							</div>
							
							<img 
								src={$game4Store.statements[displayIndex].image} 
								alt=""
								class="statement-image"
								draggable="false"
								on:dragstart={(e) => e.preventDefault()}
								on:error={() => {
									// Fallback to placeholder if image fails to load
									$game4Store.statements[displayIndex].image = 'https://via.placeholder.com/600x400/FFC400/FFFFFF?text=Statement+Image';
								}}
							/>
						</div>
					</div>
					
					<button 
						class="swipe-button swipe-button-correct" 
						on:click={() => handleSwipe('right')}
						on:keydown={(e) => {
							if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
								e.preventDefault();
								handleSwipe('right');
							}
						}}
					>
						<img class="game4-hero-correct" src="/images/game4-hero-correct.png" alt="">
					
						<svg width="39" height="47" viewBox="0 0 39 47" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M0 23.02L38.54 0V46.04L0 23.02Z" fill="white"/>
						</svg>

						<div style="text-align: start;">Swipe or click if it's <span>correct</span></div>
					</button>

					<img src="/images/game4-shape-correct.png" alt="" class="game4-shape game4-shape-correct">
				</div>
			{/if}
		</div>
    {/if}
</div>

<style lang="scss">
	:root {
		--scale-factor: 1;
	}

	@media (width <= 1440px) {
		:root {
			--scale-factor: 0.85;
		}
	}

	@media (width <= 1200px) {
		:root {
			--scale-factor: 0.75;
		}
	}

	@media (width <= 1024px) {
		:root {
			--scale-factor: 0.65;
		}
	}

	@media (width >= 1920px) {
		:root {
			--scale-factor: 1;
		}
	}

	.game-container {
		background-image: url('/images/j4-start.png');
		background-position: center right;
		background-repeat: no-repeat;
		background-size: calc(100% * var(--scale-factor));
		block-size: 100vh;
		position: relative;

		@media(min-width: 1920px) {
			background-size: 80%;
		}
	}

	/* Hide background image when game is playing */
	.game-container.playing {
		background-image: none;
	}

	.game-panel {
		block-size: 100vh;
	}

	.game4-shape {
		inset-block-start: 50%;
		position: absolute;
		transform: translateY(-50%);
		z-index: -1;

		&-incorrect {
			inset-inline-start: 0;
		}

		&-correct {
			inset-inline-end: 0;
		}
	}

	.game-area {
		align-items: center;
		block-size: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 2rem;
		position: relative;
		touch-action: pan-y; /* Allow vertical scrolling but handle horizontal swipes */
		user-select: none; /* Prevent text selection during swipes */
	}

	.game-content {
		align-items: center;
		display: flex;
		gap: calc(3rem * var(--scale-factor));
		justify-content: center;
		inline-size: 100%;
	}

	.card-container {
		align-items: flex-end;
		display: flex;
		flex: 0 1 auto;
		flex-direction: column;
		inline-size: calc(105.2rem * var(--scale-factor));
		position: relative;
	}

	.counter {
		color: #fff;
		font-size: calc(2.2rem * var(--scale-factor));
		font-weight: 600;
		margin-inline-end: calc(5rem * var(--scale-factor));
		padding-block-end: 0.5rem;
		z-index: 10;
	}

	.statement-card {
		background-color: #fff;
		border-radius: 0 calc(3.5rem * var(--scale-factor));
		cursor: grab;
		margin-inline: auto;
		min-block-size: 90vh;
		opacity: 1;
		padding-block: calc(6rem * var(--scale-factor)) calc(7rem * var(--scale-factor));
		position: relative;
		transform: scale(1) translateY(0);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		width: 100%;
		touch-action: pan-y; /* Allow vertical scrolling but handle horizontal swipes */
		user-select: none; /* Prevent text selection during swipes */

		&:active {
			cursor: grabbing;
		}

		&:hover {
			cursor: grab;
		}

		&.dragging {
			cursor: grabbing;
			transform: scale(0.98) translateY(0);
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
		}
	}

	.statement-header {
		margin-block-end: calc(3rem * var(--scale-factor));
		padding-inline: calc(6.5rem * var(--scale-factor));
	}

	.statement-title {
		color: #FFC400;
		font-size: calc(4.6rem * var(--scale-factor));
		font-weight: 600;
		margin-block-end: 0;
		padding-inline: 0;
		text-align: center;
	}

	.statement-image {
		inline-size: 100%;
		margin-block-end: calc(4rem * var(--scale-factor));
		max-block-size: calc(60rem * var(--scale-factor));
		object-fit: cover;
		user-select: none;
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		//user-drag: none;
		pointer-events: none; /* This prevents image dragging but still allows parent events */
	}

	.swipe-button {
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;

		&-incorrect {
			svg,
			img {
				margin-inline-start: auto;
			}
		}

		&-correct {
			svg,
			img {
				margin-inline-end: auto;
			}
		}

		svg {
			height: 4.7rem;
			width: 3.9rem;
		}

		div {
			color: #2E2D2C;
			font-size: calc(2.4rem * var(--scale-factor));	
			line-height: normal;
			padding-block-start: calc(4rem * var(--scale-factor));

			span {
				font-size: calc(4rem * var(--scale-factor));
				font-weight: 600;
				display: block;
			}
		}
	}

	.result-panel {
		align-items: center;
		background-color: #fff;
		border-radius: calc(3.7rem * var(--scale-factor));
		display: flex;
		inset: 0;
		justify-content: center;
		position: absolute;
		z-index: 1000;
	}

	.result-content {
		align-items: center;
		display: flex;
		justify-content: center;
		inline-size: 100%;
	}

	.result-content svg {
		block-size: calc(39.6rem * var(--scale-factor));
		inline-size: calc(39.6rem * var(--scale-factor));
	}

	.game-panel {
		position: relative;
	}

	/* Game 4 specific logo styling */
	:global(.instructions .logo path) {
		fill: #fff;
	}



	.start-screen {
		display: flex;
		inline-size: calc(100vw - (100vw - 66.41%));
		justify-content: center;
		margin-inline-start: auto;
		position: relative;

		&-shape {
			inset-block-end: 0;
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
			//max-width: calc(80rem * var(--scale-factor));
			block-size: auto;
			inline-size: calc(100% * var(--scale-factor));
			margin-inline: auto;
			visibility: hidden;
		}
	}

	.explanation {
		color: #000;
		font-weight: 600;
		line-height: normal;
		inline-size: calc(29.5rem * var(--scale-factor));
		margin-inline: auto;
		text-align: center;
		display: none;

		&-title {
			font-size: calc(3rem * var(--scale-factor));
		}

		&-copy {
			font-size: 1.8rem;
		}
	}

	.start-screen-shape {
		display: none;
	}


	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {

		/* 4. Add scale system to shape SVG */
		:global(.shape) {
			transform: scale(0.6);
			transform-origin: top left;
		}

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

		/* Adjust small hero summary for mobile */
		:global(.small-hero-summary) {
			inset-block-start: calc(4rem * var(--scale-factor));
			inset-inline-start: calc(6rem * var(--scale-factor));
			transform: scale(0.7);
			display: none;
		}


		/* Adjust swipe button font size for mobile */
		.swipe-button div {
			font-size: 2rem;
		}

		.swipe-button div span {
			font-size: calc(3.5rem * var(--scale-factor));
		}

		/* Adjust statement card padding for mobile */
		.statement-card {
			padding-block: calc(3rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
			min-block-size: 0;
		}

		/* Adjust statement image margin for mobile */
		.statement-image {
			margin-block-end: 0;
			max-block-size: calc(26rem * var(--scale-factor));
		}

		/* Adjust statement header margin for mobile */
		.statement-header {
			margin-block-end: calc(3rem * var(--scale-factor));
		}

		/* Adjust feedback icons size for mobile */
		.result-content svg {
			block-size: calc(30rem * var(--scale-factor));
			inline-size: calc(30rem * var(--scale-factor));
		}
	}
</style> 