<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
    import { game2Store } from '$lib/stores/game2Store';
    import { game2Availability } from '$lib/stores/gameAvailabilityStore';
    import type { Statement } from '$lib/types/game2';
	import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
	import Explosion from '$lib/components/svgs/Explosion.svelte';
    
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
	
	let activeBubbles: Bubble[] = [];
	let spawnTimeout: NodeJS.Timeout;
	const pathOrder = [1, 2, 4, 2, 3, 1, 3, 1, 2, 4];

    onMount(async () => {
        // Check if game is available
        if (!$game2Availability.isAvailable) {
            goto('/games/info/2');
            return;
        }

        await game2Store.initialize();
    });

	onDestroy(() => {
		clearTimeout(spawnTimeout);
	});
    
	function startGame() {
		showInstructions = false;
		game2Store.start();
		activeBubbles = [];
		spawnBubble(0);
	}

	function spawnBubble(index: number) {
		if (index >= $game2Store.statements.length) return;

		const statement = $game2Store.statements[index];
		const path = pathOrder[index] || (index % 4) + 1;
		const animationDuration = 5000; // 5 seconds for demo

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

		const nextDelay = Math.max(1000, 2000 - (index * 100));
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

		setTimeout(() => {
			bubble = activeBubbles.find(b => b.index === bubbleIndex);
			// Check if it hasn't been clicked during the blink
			if (bubble && bubble.state === 'blinking') {
				game2Store.answerStatement(bubbleIndex, false);
				triggerExplosion(bubbleIndex, true); // Explode with transparency
			}
		}, 800); // 2 blinks, 400ms each
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

		// Remove after feedback animation. Increased to 1s to allow animations to play.
		setTimeout(() => {
			activeBubbles = activeBubbles.filter(b => b.index !== bubbleIndex);
		}, 1000);
	}

	$: if ($game2Store.isComplete && activeBubbles.length === 0) {
		goto('/games/game2/summary');
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
								<span class="number">2</span>
							</div>

							<h2 class="subtitle">Under Attack!</h2>
						</div>

						<p class="paragraph">Our arch-enemy, Mr Confusion, is attacking us! He's really smart, he mixes lies with truths to confuse us.</p>
						<p class="paragraph">Stop the lies about our brand name and logo, but let the truths pass through.</p>
						<p class="paragraph">Each lie you stop earns you 1 point, but if you destroy a truth, you'll lose 1 point.</p>
						<p class="paragraph">Think fast! You've only 5 seconds to decide on each one.</p>
					</div>
				</div>


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
    {:else}
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
										<span class="feedback-icon">
											{bubble.isCorrect ? '✅' : '❌'}
										</span>
									{/if}
								</div>
							{:else}
								<p class="statement-text">{bubble.text}</p>
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
		position: relative;
		:global(.shape) {
			inset-block-start: -10rem;
			inset-inline-start: 0;
			position: absolute;
		}
	}

	.game-header {
		padding: 2rem 7rem;
		position: relative;
		z-index: 10;
		text-align: center;
	}

	.game-header-image {
		margin-inline: auto;
		margin-block-start: 5rem;
	}

	.game-header-title {
		color: #fff;
		font-size: 4.8rem;
		font-weight: 600;
		line-height: normal;
	}

	.game-area {
		block-size: 100vh;
		display: flex;
		justify-content: center;
		padding-block-start: 5rem;
		position: relative;
		overflow: hidden;
	}

	.bubbles-container {
		position: absolute;
		top: 0; left: 0;
		width: 100%; height: 100%;
		pointer-events: none;
		z-index: 20;
	}

	.bubble-wrapper {
		position: absolute;
		will-change: transform;
		
		&.path-1 { animation: path1 var(--duration) linear forwards; }
		&.path-2 { animation: path2 var(--duration) linear forwards; }
		&.path-3 { animation: path3 var(--duration) linear forwards; }
		&.path-4 { animation: path4 var(--duration) linear forwards; }
	}

	.bubble {
		position: absolute;
		background-color: rgb(84, 62, 238);
		border-radius: 50%;
		color: #fff;
		width: 15rem;
		height: 15rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		cursor: pointer;
		pointer-events: all;
		will-change: transform, opacity;
		transform: translate(-50%, -50%);

		&.blinking {
			animation: blink 0.4s 2;
		}

		&.exploded {
			animation: none;
			background: none;
			border: none;
			pointer-events: none;
			width: 30rem;
			height: 30rem;
		}
	}

	.statement-text {
		color: #fff;
		font-size: 1.6rem;
		font-weight: 600;
		line-height: 1.2;
	}
	
	.explosion-container {
		position: relative;
		width: 100%;
		height: 100%;
		animation: pop 0.5s ease-out forwards;

		&.timeout {
			opacity: 0.2;
		}

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}

	.feedback-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 5rem;
		animation: feedbackPop 0.5s ease-out forwards;
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
		to { top: 10%; left: 15%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.2; }
	}
	@keyframes path2 {
		from { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0.9; }
		to { top: 10%; left: 85%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.2; }
	}
	@keyframes path3 {
		from { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0.9; }
		to { top: 70%; left: 85%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.2; }
	}
	@keyframes path4 {
		from { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(0); opacity: 0.9; }
		to { top: 70%; left: 15%; transform: translate(-50%, -50%) scale(2.5); opacity: 0.2; }
	}
	@keyframes blink {
		50% { opacity: 0.5; }
	}
	
	.game-panel {
		position: relative;
	}

	.instructions {
		background-color: #2E2D2C;
		block-size: 100vh;
		border-radius: 0 6rem 0 0;
		inline-size: calc(100vw - 66.41%);
		inset-block-start: 0;
		inset-inline-start: 0;
		overflow-y: auto;
		padding: 5rem 6rem 9rem;
		position: fixed;
		z-index: 9999;
		transition: transform 0.3s ease-in-out;

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
		position: absolute;
		z-index: 10000;
		padding: 1rem;

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
			justify-content: start;
			grid-template-columns: repeat(2, auto);
			grid-column-gap: 3rem;
			margin-block-start: -5rem;
		}
	}

	.game-id {
		align-items: center;
		background-color: #8E75F8;
		border-radius: 0 2rem 0 2rem;
		block-size: 17rem;
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
		color: #8E75F8;
		font-size: 6rem;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		padding-block-start: 2rem;
	}

	.subtitle {
		color: #8E75F8;
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
		justify-content: center;
		inline-size: calc(100vw - (100vw - 66.41%));
		margin-inline-start: auto;

		&-content {
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
		padding: 0;
		margin: 0;
		cursor: pointer;
	}
</style> 