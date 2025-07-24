<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { game5Store } from '$lib/stores/game5Store';
	import Game5Logo from '$lib/components/svgs/Game5Logo.svelte';

	onMount(() => {
		console.log('Game 5 Summary page loaded, checking store state:', {
			isComplete: $game5Store.isComplete,
			timeSpent: $game5Store.timeSpent,
			attempts: $game5Store.attempts
		});
		
		// Add a small delay to ensure store state is properly loaded
		setTimeout(() => {
			console.log('After delay - isComplete:', $game5Store.isComplete);
			if (!$game5Store.isComplete) {
				console.log('Redirecting back to game because isComplete is false');
				goto('/games/game5');
			}
		}, 200);
	});

	function formatTime(milliseconds: number): string {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	function handleReplay() {
		game5Store.reset();
		game5Store.initialize();
		goto('/games/game5');
	}

	function handleFinish() {
		goto('/ranking');
	}

	$: formattedTime = formatTime($game5Store.timeSpent);
</script>

<div class="game-container">
	<div class="game5-logo-left">
		<Game5Logo />
	</div>

    <div class="game-summary">
		<h2 class="title">Correct</h2>

		<div class="results">
			<p class="paragraph">You've earned 5 points.</p>
			<p class="paragraph">Your registered time has been:</p>
			<p class="total-time">{formattedTime}</p>
		</div>

        <div class="cta">
            <button class="btn" on:click={handleReplay}>
                Replay
            </button>
            <button class="btn" on:click={handleFinish}>
                Finish
            </button>
        </div>

        <small class="finish-small">Remember, you can try again, but for the<br> competition only your first attempt will count!</small>
    </div>

	<div class="game5-logo-right">
		<Game5Logo />
	</div>
</div>

<style lang="scss">
	:root {
		--scale-factor: 1;
	}

	@media (max-width: 1439px) {
		:root {
			--scale-factor: 0.85;
		}
	}

	@media (max-width: 1279px) {
		:root {
			--scale-factor: 0.75;
		}
	}

	@media (max-width: 1023px) {
		:root {
			--scale-factor: 0.65;
		}
	}

	@media (max-width: 767px) {
		:root {
			--scale-factor: 0.55;
		}

		.game-container {
			background-size: calc(100% * var(--scale-factor)) auto;
		}
	}

	.game-container {
		background-color: #00B2E7;
		background-image: url('/images/game5-summary.png');
		background-position: center bottom;
		background-size: 100% auto;
		background-repeat: no-repeat;
		block-size: 100vh;
		display: grid;
		place-content: center;
		position: relative;
	}

	.game-summary {
		max-inline-size: calc(90rem * var(--scale-factor));
		position: relative;
		z-index: 1;
	}

	.game5-logo-left {
		inset-block-start: 50%;
		inset-inline-start: 0;
		position: absolute;
		transform: translateY(-50%);
		z-index: -1;
	}

	.game5-logo-right {
		inset-block-start: 50%;
		inset-inline-end: 0;
		position: absolute;
		transform: translateY(-50%);
		z-index: -1;
	}

	.title {
		color: #fff;
		font-size: calc(7rem * var(--scale-factor));
		font-weight: 600;
		text-align: center;
	}

	.results {
		background-color: #fff;
		border-radius: 0 calc(3rem * var(--scale-factor));
		inline-size: 100%;
		margin-block-start: calc(3.5rem * var(--scale-factor));
		padding: calc(5rem * var(--scale-factor));
		text-align: center;
		position: relative;
	}

	.paragraph {
		color: #000;
		font-size: calc(4.5rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
	}

	.total-time {
		color: #00B2E7;
		font-size: calc(8rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		padding-block-start: calc(1rem * var(--scale-factor));
	}

	.cta {
		display: flex;
		gap: calc(3rem * var(--scale-factor));
		justify-content: center;
		padding-block-start: calc(5rem * var(--scale-factor));
	}

	.btn {
		background-color: #fff;
		border-radius: 0 calc(1.7rem * var(--scale-factor));
		color: #00B2E7;
		font-weight: 600;
		margin-inline: 0;
		padding: calc(1.5rem * var(--scale-factor)) calc(4rem * var(--scale-factor));
		font-size: calc(2rem * var(--scale-factor));
		border: none;
		cursor: pointer;
		transition: background-color 0.3s ease;

		&:hover {
			background-color: #f0f0f0;
		}
	}

	.finish-small {
		color: #fff;
		display: block;
		font-size: calc(2rem * var(--scale-factor));
		font-weight: 600;
		line-height: normal;
		margin-block-start: calc(3rem * var(--scale-factor));
		text-align: center;
	}

	/* Mobile Media Query - Up to 932px */
	@media (max-width: 932px) {
		/* Adjust game summary for mobile */
		.game-summary {
			padding: calc(2rem * var(--scale-factor));
		}

		.game-summary .title {
			font-size: calc(5rem * var(--scale-factor));
		}

		.game-summary .results {
			inline-size: calc(80rem * var(--scale-factor));
			padding: calc(2rem * var(--scale-factor));

			.paragraph {
				padding-block-start: 0;
				margin-block-start: 0;
			}
		}

		.game-summary .paragraph {
			font-size: calc(3.5rem * var(--scale-factor));
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		.game-summary .total-time {
			font-size: calc(6rem * var(--scale-factor));
		}

		.game-summary .cta {
			padding-block-start: calc(2rem * var(--scale-factor));
		}

		/* Adjust finish small text for mobile */
		.finish-small {
			font-size: calc(1.5rem * var(--scale-factor));
			margin-block-start: calc(2rem * var(--scale-factor));
		}

		/* Adjust Game5Logo components for mobile */
		:global(.game5-logo-left),
		:global(.game5-logo-right) {
			transform: scale(0.7);
			transform-origin: center center;
		}
	}
</style> 