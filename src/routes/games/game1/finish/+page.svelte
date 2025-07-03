<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import Game1Shape from '$lib/components/svgs/Game1Shape.svelte';
	import { game1Store } from '$lib/stores/game1Store';

	onMount(() => {
		if (!$game1Store.isComplete) {
			goto('/games/game1');
		}
	});

	function handleReplay() {
		game1Store.reset();
		game1Store.initialize();
		goto('/games/game1');
	}

	function handleFinish() {
		goto('/ranking');
	}
</script>

<div class="finish-container">
	<Game1Shape />

	<img class="game1-small-hero-finish" width="1056" height="625" src="/images/Game1HeroSmallFinish.png" alt="" />


	<div class="finish-content">
		<div class="finish-text">
			<p>As you've just experienced, brands have an incredible power over our minds. Without seeing their names, you were still able to recognise many of them and they even trigger a feeling when you think about them.</p>
			<p>That's the true power of branding: When done well, it sticks with us. It becomes part of how we see the world.</p>
			<p>Great brands manage to do this because:</p>
			<ul>
				<li>- They express a clear and unique identity</li>
				<li>- They are consistently presented</li>
				<li>- And they connect with people on an emotional level</li>
			</ul>

			<cite>
				Let's make Olam Agri a well-known and respected brand worldwide!
			</cite>
		</div>

		<div class="finish-buttons">
			<button class="btn btn-cta2" on:click={handleReplay}>
				Replay
			</button>

			<button class="btn btn-cta2" on:click={handleFinish}>
				Finish
			</button>
		</div>

		<small class="finish-small">Remember, you can try again, but for the competition only <br> your first attempt will count!</small>
	</div>
</div>

<style lang="scss">
	.finish-container {
		align-items: center;
		background-color: #FF7000;
		display: flex;
		justify-content: center;
		min-block-size: 100vh;
		overflow: hidden;
		position: relative;

		:global(.shape) {
			inset-block-start: -16rem;
			inset-inline-end: -28rem;
			position: absolute;
		}
	}

	.finish-content {
		margin-inline: auto;
		max-inline-size: 96.5rem;
		position: relative;
		z-index: 1;
	}

	.finish-text p,
	.finish-text li {
		color: #000;
		font-size: 3.2rem;
		font-weight: 600;
		line-height: normal;
	}

	.finish-text ul {
		margin-block-start: 4rem;
	}

	.finish-text p {
		padding-block-start: 4rem;

		&:first-child {
			padding-block-start: 0;
		}
	}

	.finish-text cite {
		background-color: #fff;
		border-radius: 3.5rem;
		color: #FF7000;
		display: inline-block;
		font-size: 4rem;
		font-weight: 600;
		font-style: normal;
		line-height: normal;
		margin-block-start: 5rem;
		padding: 3rem;
	};

	.finish-small {
		color: #FFF;
		display: inline-block;
		font-size: 2rem;
		font-weight: 600;
		line-height: normal;
		padding-block-start: 2.5rem;
	}

	.finish-buttons {
		display: flex;
		gap: 3rem;
		padding-block-start: 4rem;
	}

	.game1-small-hero-finish {
		inset-block-start: 19rem;
		inset-inline-end: 14.5rem;
		position: absolute;
	}
</style> 




