<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
    import { game2Store } from '$lib/stores/game2Store';
    import { game2Availability, gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
    import type { Statement } from '$lib/types/game2';
	import Explosion from '$lib/components/svgs/Explosion.svelte';
	import GameInstructions from '$lib/components/GameInstructions.svelte';
	import { urlFor } from '$lib/sanity';
    
	type Bubble = Statement & {
		index: number;
		path: number;
		animationDuration: number;
		state: 'moving' | 'blinking' | 'exploded';
		showFeedback?: boolean;
		isTimeout?: boolean;
	};

    let showInstructions = true;
	let instructionsClosed = false;
	let instructionsClosedSidebar = false;
	let isGamePlaying = false;
	
	let activeBubbles: Bubble[] = [];
	let spawnTimeout: NodeJS.Timeout;
	let animationTimeouts: Map<number, NodeJS.Timeout> = new Map();
	let explosionTimeouts: Map<number, NodeJS.Timeout> = new Map();
	const pathOrder = [1, 2, 4, 2, 3, 1, 3, 1, 2, 4];

    onMount(async () => {
        // Load game configs if not already loaded
        await gameAvailabilityStore.loadGameConfigs();
        
        // Check if game is available
        if (!$game2Availability.isAvailable) {
            goto('/games/info/2');
            return;
        }

        await game2Store.initialize();
    });

	onDestroy(() => {
		clearTimeout(spawnTimeout);
		// Clear all animation timeouts
		animationTimeouts.forEach(timeout => clearTimeout(timeout));
		animationTimeouts.clear();
		// Clear all explosion timeouts
		explosionTimeouts.forEach(timeout => clearTimeout(timeout));
		explosionTimeouts.clear();
		// Stop all store timers
		game2Store.stopAllTimers();
	});

	function cleanupTimers() {
		clearTimeout(spawnTimeout);
		animationTimeouts.forEach(timeout => clearTimeout(timeout));
		animationTimeouts.clear();
		explosionTimeouts.forEach(timeout => clearTimeout(timeout));
		explosionTimeouts.clear();
		game2Store.stopAllTimers();
	}
    
	function startGame() {
		// Clean up any existing timers before starting new game
		cleanupTimers();
		
		showInstructions = false;
		instructionsClosed = true;
		instructionsClosedSidebar = true;
		isGamePlaying = true;
		game2Store.start();
		activeBubbles = [];
		spawnBubble(0);
	}

	function spawnBubble(index: number) {
		if (index >= $game2Store.statements.length) return;

		const statement = $game2Store.statements[index];
		const path = pathOrder[index] || (index % 4) + 1;
		const animationDuration = 8000; // 8 seconds - slowed down from 5 seconds

		activeBubbles = [
			...activeBubbles,
			{
				...statement,
				index,
				path,
				animationDuration,
				state: 'moving' // moving, blinking, exploded
			}
		];

		const nextDelay = Math.max(2000, 3500 - (index * 150)); // Increased delays: 2-3.5 seconds instead of 1-2 seconds
		spawnTimeout = setTimeout(() => spawnBubble(index + 1), nextDelay);
	}

	function handleBubbleClick(bubbleIndex: number) {
		const bubble = activeBubbles.find(b => b.index === bubbleIndex);
		if (!bubble || bubble.state === 'exploded') return;
		
		game2Store.answerStatement(bubbleIndex, true);
		triggerExplosion(bubbleIndex);            
	}

	function handleAnimationEnd(bubbleIndex: number) {
		let bubble = activeBubbles.find(b => b.index === bubbleIndex);
		if (!bubble || bubble.state !== 'moving') return;

		// Update state to blinking
		bubble.state = 'blinking';
		activeBubbles = [...activeBubbles];

		// Clear any existing timeout for this bubble
		if (animationTimeouts.has(bubbleIndex)) {
			clearTimeout(animationTimeouts.get(bubbleIndex)!);
		}

		const timeout = setTimeout(() => {
			bubble = activeBubbles.find(b => b.index === bubbleIndex);
			// Check if it hasn't been clicked during the blink
			if (bubble && bubble.state === 'blinking') {
				game2Store.answerStatement(bubbleIndex, false);
				triggerExplosion(bubbleIndex, true); // Explode with transparency
			}
			// Clean up the timeout reference
			animationTimeouts.delete(bubbleIndex);
		}, 800); // 2 blinks, 400ms each

		// Store the timeout for cleanup
		animationTimeouts.set(bubbleIndex, timeout);
	}
	
	function triggerExplosion(bubbleIndex: number, isTimeout = false) {
		const bubble = activeBubbles.find(b => b.index === bubbleIndex);
		if (!bubble) return;

		// Get the updated statement from the store to ensure we have the correct 'isCorrect' status
		const updatedStatement = $game2Store.statements[bubbleIndex];
		if (updatedStatement) {
			bubble.isCorrect = updatedStatement.isCorrect;
		}

		bubble.state = 'exploded';
		bubble.showFeedback = true;
		bubble.isTimeout = isTimeout; // For transparent explosion
		activeBubbles = [...activeBubbles];

		// Clear any existing explosion timeout for this bubble
		if (explosionTimeouts.has(bubbleIndex)) {
			clearTimeout(explosionTimeouts.get(bubbleIndex)!);
		}

		// Remove after feedback animation. Increased to 1s to allow animations to play.
		const timeout = setTimeout(() => {
			activeBubbles = activeBubbles.filter(b => b.index !== bubbleIndex);
			// Clean up the timeout reference
			explosionTimeouts.delete(bubbleIndex);
		}, 1000);

		// Store the timeout for cleanup
		explosionTimeouts.set(bubbleIndex, timeout);
	}

	$: if ($game2Store.isComplete && activeBubbles.length === 0) {
		isGamePlaying = false;
		// Clean up any remaining timers when game completes
		cleanupTimers();
		
		// Redirect immediately to prevent any content flash
		goto('/games/game2/summary');
	}
</script>

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar} class:playing={isGamePlaying} class:game-started={!showInstructions}>
	
        
    {#if showInstructions}
			<div class="game-panel">
				<GameInstructions
					gameNumber={2}
					gameTitle="Brand Heroes"
					gameSubtitle="Under Attack!"
					infoRoute="/games/info/2"
					bind:instructionsClosed
					primaryColor="#8E75F8"
					backgroundColor="#2E2D2C"
					paragraphs={[
						"Our arch-enemy, Mr Confusion, is attacking us! He's really smart, he mixes lies with truths to confuse us.",
						"Stop the lies about our brand name and logo, but let the truths pass through.",
						"Each lie you stop earns you 1 point, but if you destroy a truth, you'll lose 1 point.",
						"Think fast! You've only 5 seconds to decide on each one."
					]}
				/>


				<div class="start-screen">
					<div class="start-screen-content">
						<button on:click={startGame} class="image-button" aria-label="Start Game">
							<img 
								src="/images/game2-start-screen.jpg" 
								alt="Game 2 Hero" 
								class="game-start-screen-image" 
							>
						</button>
					</div>
				</div>
		</div>

    {:else if $game2Store.isLoading}
        <div class="loading">Loading statements...</div>
    {:else if $game2Store.error}
        <div class="error">
            <h2>Game Setup Required</h2>
            <p>{$game2Store.error}</p>
            <p>Please add some Game 2 statements in your Sanity Studio to play this game.</p>
        </div>

		<GameInstructions
			gameNumber={2}
			gameTitle="Brand Heroes"
			gameSubtitle="Under Attack!"
			infoRoute="/games/info/2"
			bind:instructionsClosed
			primaryColor="#8E75F8"
			backgroundColor="#2E2D2C"
			paragraphs={[
				"Our arch-enemy, Mr Confusion, is attacking us! He's really smart, he mixes lies with truths to confuse us.",
				"Stop the lies about our brand name and logo, but let the truths pass through.",
				"Each lie you stop earns you 1 point, but if you destroy a truth, you'll lose 1 point.",
				"Think fast! You've only 5 seconds to decide on each one."
			]}
		/>

		<div class="game-area">
			<div class="game-header">
				<h2 class="game-header-title">Click on the lies to destroy them!</h2>
				<img src="/images/game2-playing-screen.png" alt="Game 2 Playing Screen" class="game-header-image">
			</div>

			<div class="bubbles-container">
				{#each activeBubbles as bubble (bubble.index)}
					<div 
						class="bubble-wrapper path-{bubble.path}"
						style="--duration: {bubble.animationDuration}ms;"
						on:animationend={() => handleAnimationEnd(bubble.index)}
					>
						<div
							class="bubble"
							class:blinking={bubble.state === 'blinking'}
							class:exploded={bubble.state === 'exploded'}
							style={bubble.state !== 'exploded' && bubble.image && bubble.image.asset ? `background-image: url('${urlFor(bubble.image).url()}'); background-position: center center; background-repeat: no-repeat; background-size: cover;` : ''}
							on:click={() => handleBubbleClick(bubble.index)}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleBubbleClick(bubble.index);
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Click to answer statement"
						>
							{#if bubble.state === 'exploded'}
								<div class="explosion-container" class:timeout={bubble.isTimeout}>
									<Explosion />
									{#if bubble.showFeedback}
										<div class="feedback-icon">
											{#if bubble.isCorrect}
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
									{/if}
								</div>
							{:else}
								<p class="statement-text" style="visibility: hidden;">{bubble.title}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
    {/if}
</div>

<style lang="scss">
	.game-container {
		background-image: url('/images/j2-start.png');
		background-position: top center;
		background-repeat: no-repeat;
		background-size: calc(100% * var(--scale-factor));
		block-size: var(--full-height, 100vh);
		position: relative;

		:global(.shape) {
			inset-block-start: calc(-10rem * var(--scale-factor));
			inset-inline-start: 0;
			position: absolute;
		}
	}

	/* Large screen media query for game 2 background */
	@media (min-width: 1920px) {
		.game-container {
			background-size: 70%;
		}
	}

	/* Hide background image when game starts (not just when playing) */
	.game-container.playing,
	.game-container.game-started {
		background-image: none;
	}

	.game-header {
		padding: calc(2rem * var(--scale-factor)) calc(7rem * var(--scale-factor));
		position: relative;
		text-align: center;
		z-index: 10;
	}

	.game-header-image {
		margin-block-start: calc(5rem * var(--scale-factor));
		margin-inline: auto;

		@media(max-width: 932px) {
			inline-size: 80%;
		}
	}

	.game-header-title {
		color: #fff;
		font-size: calc(4.8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.game-area {
		block-size: var(--full-height, 100vh);
		display: flex;
		justify-content: center;
		overflow: hidden;
		padding-block-start: calc(5rem * var(--scale-factor));
		position: relative;
	}

	.bubbles-container {
		block-size: 100%;
		height: 100%;
		inset-block-start: 0;
		inset-inline-start: 0;
		left: 0;
		pointer-events: none;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 20;
	}

	.bubble-wrapper {
		position: absolute;
		will-change: transform;
		
		&.path-1 { animation: path1 var(--duration) ease-out forwards; }
		&.path-2 { animation: path2 var(--duration) ease-out forwards; }
		&.path-3 { animation: path3 var(--duration) ease-out forwards; }
		&.path-4 { animation: path4 var(--duration) ease-out forwards; }
	}

	.bubble {
		align-items: center;
		background-color: rgb(84, 62, 238);
		block-size: calc(15rem * var(--scale-factor));
		border-radius: 50%;
		color: #fff;
		cursor: pointer;
		display: flex;
		height: calc(15rem * var(--scale-factor));
		inline-size: calc(15rem * var(--scale-factor));
		justify-content: center;
		padding: calc(2rem * var(--scale-factor));
		pointer-events: all;
		position: absolute;
		text-align: center;
		transform: translate(-50%, -50%);
		width: calc(15rem * var(--scale-factor));
		will-change: transform, opacity;

		&.blinking {
			animation: blink 0.4s 2;
		}

		&.exploded {
			animation: none;
			background: none !important;
			background-image: none !important;
			border: none;
			block-size: calc(30rem * var(--scale-factor));
			height: calc(30rem * var(--scale-factor));
			inline-size: calc(30rem * var(--scale-factor));
			pointer-events: none;
			width: calc(30rem * var(--scale-factor));
		}
	}

	.statement-text {
		color: #fff;
		font-size: calc(1.6rem * var(--scale-factor));
		font-weight: 600;
		line-height: 1.2;
	}

	.explosion-container {
		animation: pop 0.5s ease-out forwards;
		block-size: 100%;
		inline-size: 100%;
		position: relative;

		&.timeout {
			opacity: 0.2;
		}

		:global(svg) {
			block-size: 100%;
			inline-size: 100%;
		}
	}

	.feedback-icon {
		animation: feedbackPop 0.5s ease-out forwards;
		block-size: calc(5rem * var(--scale-factor));
		inline-size: calc(5rem * var(--scale-factor));
		inset-block-start: 50%;
		inset-inline-start: 50%;
		position: absolute;
		transform: translate(-50%, -50%);

		svg {
			block-size: 100%;
			inline-size: 100%;
		}
	}

	@keyframes pop {
		from { transform: scale(0); }
		to { transform: scale(1); }
	}
	@keyframes feedbackPop {
		0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
		50% { opacity: 1; }
		100% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
	}

	@keyframes path1 {
		from { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0.9; }
		to { top: 10%; left: 15%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.4; }
	}
	@keyframes path2 {
		from { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0.9; }
		to { top: 10%; left: 85%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.4; }
	}
	@keyframes path3 {
		from { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0.9; }
		to { top: 70%; left: 85%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.4; }
	}
	@keyframes path4 {
		from { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0.9; }
		to { top: 70%; left: 15%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.4; }
	}
	@keyframes blink {
		50% { opacity: 0.5; }
	}

	.game-panel {
		position: relative;
	}

	.instructions {
		background-color: #2E2D2C;
		block-size: var(--full-height, 100vh);
		border-radius: 0 calc(6rem * var(--scale-factor)) 0 0;
		inline-size: calc(100vw - 66.41%);
		inset-block-start: 0;
		inset-inline-start: 0;
		overflow-y: auto;
		padding: calc(5rem * var(--scale-factor)) calc(6rem * var(--scale-factor)) calc(9rem * var(--scale-factor));
		position: fixed;
		scrollbar-width: none; /* Firefox */
		transition: transform 0.3s ease-in-out;
		z-index: 9999;
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

	.close-button,
	.play-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		position: absolute;
		z-index: 10000;
		padding: calc(1rem * var(--scale-factor));

		&:hover {
			opacity: 0.8;
		}
	}

	.close-button {
		inset-block-start: calc(2rem * var(--scale-factor));
		inset-inline-end: calc(2rem * var(--scale-factor));

		svg {
			block-size: calc(2.4rem * var(--scale-factor));
			inline-size: calc(2.3rem * var(--scale-factor));
		}
	}

	.play-button {
		inset-block-start: calc(2rem * var(--scale-factor));
		inset-inline-end: .3rem;

		svg {
			block-size: calc(3.3rem * var(--scale-factor));
			inline-size: calc(2.7rem * var(--scale-factor));
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
			justify-content: start;
			grid-template-columns: repeat(2, auto);
			grid-column-gap: calc(3rem * var(--scale-factor));
			margin-block-start: calc(-5rem * var(--scale-factor));
		}
	}

	.title {
		color: #8E75F8;
		font-size: calc(6rem * var(--scale-factor));
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		padding-block-start: calc(2rem * var(--scale-factor));
	}

	.subtitle {
		color: #8E75F8;
		font-size: calc(3.7rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		max-width: calc(20rem * var(--scale-factor));
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.paragraph {
		color: #2E2D2C;
		font-size: calc(2.2rem * var(--scale-factor));
		padding-block-start: calc(2rem * var(--scale-factor));

		&:first-child {
			padding-block-start: calc(2.5rem * var(--scale-factor));
		}
	}

	.start-screen {
		display: flex;
		justify-content: center;
		align-items: self-end;
		block-size: var(--full-height, 100vh);
		inline-size: calc(100vw - (100vw - 66.41%));
		margin-inline-start: auto;

		&-content {
			position: relative;
			transform: scale(var(--scale-factor));
			transform-origin: center center;
		}
	}

	.sidebar-is-closed .start-screen {
		inline-size: 100%;
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

	.image-button {
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
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
		background-color: #8E75F8;
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

	.game-start-screen-image {
		visibility: hidden;
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

		/* 2. Game container background size for mobile */
		.game-container {
			background-image: url('/images/j2-start-mobile.png');
			background-position: top right;
			background-repeat: no-repeat;
			background-size: contain;
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

		/* 4. Fix game header for mobile */
		.game-header {
			padding: calc(1rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		}

		.game-header-title {
			font-size: calc(3.5rem * var(--scale-factor));
		}

		/* 5. Fix game area for mobile */
		.game-area {
			padding-block-start: calc(2rem * var(--scale-factor));
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

		/* 7. Adjust game ID for mobile */
		.game-id {
			block-size: calc(12rem * var(--scale-factor));
			inline-size: calc(8rem * var(--scale-factor));
		}

		/* 8. Adjust subtitle for mobile */
		.subtitle {
			font-size: calc(2.5rem * var(--scale-factor));
			max-width: calc(15rem * var(--scale-factor));
			word-wrap: break-word;
			overflow-wrap: break-word;
		}

		/* 9. Adjust buttons for mobile */
		.close-button {
			inset-block-start: calc(1rem * var(--scale-factor));
			inset-inline-end: calc(2rem * var(--scale-factor));
		}

		.play-button {
			inset-block-start: calc(2rem * var(--scale-factor));
			inset-inline-end: calc(-0.2rem * var(--scale-factor));
		}

		/* 10. Fix sidebar closed state for mobile */
		.instructions.closed {
			transform: translateX(calc(-100% + 4rem * var(--scale-factor)));
		}

		/* 11. Adjust bubbles for mobile */
		.bubble {
			width: calc(12rem * var(--scale-factor));
			height: calc(12rem * var(--scale-factor));
			padding: calc(1.5rem * var(--scale-factor));

			&.exploded {
				width: calc(25rem * var(--scale-factor));
				height: calc(25rem * var(--scale-factor));
			}
		}



		.statement-text {
			font-size: calc(1.4rem * var(--scale-factor));
		}

		.feedback-icon {
			width: calc(4rem * var(--scale-factor));
			height: calc(4rem * var(--scale-factor));
		}

		/* Content check section mobile adjustments */
		.content-check {
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		.content-check-grid {
			gap: calc(1.5rem * var(--scale-factor));
			grid-template-columns: 1fr;
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