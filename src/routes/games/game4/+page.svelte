<script lang="ts">
    import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import { game4Store } from '$lib/stores/game4Store';
    import { game4Availability } from '$lib/stores/gameAvailabilityStore';
    import { authStore } from '$lib/stores/authStore';
    import type { Statement } from '$lib/types/game4';
	import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
    
    let showInstructions = true;
	let instructionsClosed = false;
	let instructionsClosedSidebar = false;
	let showResult = false;
	let resultTimeout: NodeJS.Timeout;
	let displayIndex = 0; // Track the displayed statement index

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
        // Check if game is available
        if (!$game4Availability.isAvailable) {
            goto('/games/info/4');
            return;
        }

        await game4Store.initialize();
    });
    
	function startGame() {
		showInstructions = false;
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
		
		// Show result for 1.5 seconds then continue
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
		}, 1500);
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

				<h1 class="title">True or False</h1>
					
				<div class="copy">
					<div class="copy-header">
						<div class="game-id">
							<span class="text">Game</span>
							<span class="number">4</span>
						</div>

						<h2 class="subtitle">Swipe to Decide!</h2>
					</div>

					<p class="paragraph">All heroes face the battle between good and evil, with great power comes great responsibility!</p>
					<p class="paragraph">Now it’s your turn: decide if each statement about layouts, templates, tone of voice, and brand design is right or wrong.</p>
					<p class="paragraph">You'll start with 5 points, but lose 1 for every wrong decision.</p>
					<p class="paragraph">Ready for the challenge? Hit Start!</p>
				</div>
			</div>

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
		<div class="game-area">
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
 
						<div style="text-align: end;">Swipe or click if it’s <span>incorrect</span></div>
					</button>
					
					<div class="card-container">
						<div class="counter">
							{displayIndex + 1} / {$game4Store.statements.length}
						</div>
						
						<div 
							class="statement-card" 
							role="button"
							tabindex="0"
							on:keydown={(e) => {
								if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
									e.preventDefault();
									handleSwipe('left');
								} else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
									e.preventDefault();
									handleSwipe('right');
								}
							}}
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

						<div style="text-align: start;">Swipe or click if it’s <span>correct</span></div>
					</button>

					<img src="/images/game4-shape-correct.png" alt="" class="game4-shape game4-shape-correct">
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
	}

	.game-content {
		align-items: center;
		display: flex;
		gap: 3rem;
		justify-content: center;
		width: 100%;
	}

	.card-container {
		align-items: flex-end;
		display: flex;
		flex: 0 1 auto;
		flex-direction: column;
		position: relative;
		width: 105.2rem;
	}

	.counter {
		color: #fff;
		font-size: 2.2rem;
		font-weight: 600;
		margin-inline-end: 5rem;
		padding-block-end: 0.5rem;
		z-index: 10;
	}

	.statement-card {
		background-color: #fff;
		border-radius: 0 3.5rem;
		cursor: grab;
		margin-inline: auto;
		min-block-size: 90vh;
		opacity: 1;
		padding-block: 6rem 7rem;
		position: relative;
		transform: scale(1) translateY(0);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		width: 100%;

		&:active {
			cursor: grabbing;
		}
	}

	.statement-header {
		margin-block-end: 3rem;
		padding-inline: 6.5rem;
	}

	.statement-title {
		color: #FFC400;
		font-size: 4.6rem;
		font-weight: 600;
		margin-block-end: 0;
		padding-inline: 0;
		text-align: center;
	}

	.statement-image {
		inline-size: 100%;
		margin-block-end: 4rem;
		max-block-size: 46rem;
		object-fit: cover;
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
			height: 47px;
			width: 39px;
		}

		div {
			color: #2E2D2C;
			font-size: 2.4rem;	
			line-height: normal;
			padding-block-start: 4rem;

			span {
				font-size: 4rem;
				font-weight: 600;
				display: block;
			}
		}
	}

	.result-panel {
		align-items: center;
		background-color: #fff;
		border-radius: 3.7rem;
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
		width: 100%;
	}

	.result-content svg {
		block-size: 39.6rem;
		inline-size: 39.6rem;
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
		background-color: #FFC400;
		block-size: 17rem;
		border-radius: 0 2rem 0 2rem;
		color: #2E2D2C;
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
		color: #FFC400;
		font-size: 6rem;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		padding-block-start: 2rem;
	}

	.subtitle {
		color: #FFC400;
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
		inline-size: 29.5rem;
		margin-inline: auto;
		text-align: center;

		&-title {
			font-size: 3rem;
		}

		&-copy {
			font-size: 1.8rem;
		}
	}
</style> 