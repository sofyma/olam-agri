<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { game5Store } from '$lib/stores/game5Store';
    import { game5Availability } from '$lib/stores/gameAvailabilityStore';
    import Question from '$lib/components/games/game5/Question.svelte';
    import { onDestroy } from 'svelte';
    
    let showInstructions = true;
    let instructionsClosed = false;
    let instructionsClosedSidebar = false;
    
    onMount(async () => {
        try {
            // Check if game is available
            if (!$game5Availability.isAvailable) {
                goto('/games/info/5');
                return;
            }

            game5Store.initialize();
        } catch (err) {
            console.error('Error initializing game 5:', err);
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
        goto('/games/game5/summary');
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

                <div class="game-logo">
                    <h1 class="logo-text">GAME 5</h1>
                </div>

                <h1 class="title">Only the Fastest Will Reach the Sky</h1>
                    
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
                        <div class="rocket-girl-container">
                            <div class="rocket-girl">
                                <div class="rocket-body"></div>
                                <div class="rocket-window"></div>
                                <div class="rocket-flame"></div>
                            </div>
                            <div class="start-text">START</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>

    {:else if $game5Store.isLoading}
        <div class="loading">Loading game...</div>

    {:else if $game5Store.error}
        <div class="error">{$game5Store.error}</div>

    {:else}
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

            <div class="game-logo">
                <h1 class="logo-text">GAME 5</h1>
            </div>

            <h1 class="title">Only the Fastest Will Reach the Sky</h1>
                
            <div class="copy">
                <div class="copy-header">
                    <div class="game-id">
                        <span class="text">game</span>
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

        <div class="game-grid">
            <div class="game-header">
                <h2 class="game-header-title">Find the Answer in the Brand Hub</h2>
                <p class="game-header-paragraph">Type the exact answer as it appears in the document.</p>
            </div>

            <div class="question-wrapper">
                <Question on:submit={handleQuestionSubmit} />
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .game-container {
        background-color: #00B2E7;
        position: relative;
        min-height: 100vh;
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
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

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
        margin-inline-start: auto;
        
        div {
            position: relative;
        }
    }

    .start-screen-content {
        transform: scale(var(--scale-factor));
        transform-origin: center center;
    }

    .game5-initial-screen-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }

    .rocket-girl-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(2rem * var(--scale-factor));
    }

    .rocket-girl {
        position: relative;
        width: calc(20rem * var(--scale-factor));
        height: calc(30rem * var(--scale-factor));
    }

    .rocket-body {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: calc(8rem * var(--scale-factor));
        height: calc(20rem * var(--scale-factor));
        background: linear-gradient(45deg, #fff, #f0f0f0);
        border-radius: calc(4rem * var(--scale-factor)) calc(4rem * var(--scale-factor)) 0 0;
        border: calc(0.3rem * var(--scale-factor)) solid #00B2E7;
    }

    .rocket-window {
        position: absolute;
        top: calc(3rem * var(--scale-factor));
        left: 50%;
        transform: translateX(-50%);
        width: calc(3rem * var(--scale-factor));
        height: calc(3rem * var(--scale-factor));
        background: #00B2E7;
        border-radius: 50%;
        border: calc(0.2rem * var(--scale-factor)) solid #fff;
    }

    .rocket-flame {
        position: absolute;
        bottom: calc(-2rem * var(--scale-factor));
        left: 50%;
        transform: translateX(-50%);
        width: calc(6rem * var(--scale-factor));
        height: calc(4rem * var(--scale-factor));
        background: linear-gradient(to top, #ff6b35, #ff8c42, #ffa726);
        border-radius: 0 0 calc(3rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
        animation: flame 0.5s ease-in-out infinite alternate;
    }

    @keyframes flame {
        0% { transform: translateX(-50%) scaleY(1); }
        100% { transform: translateX(-50%) scaleY(1.2); }
    }

    .start-text {
        color: #fff;
        font-size: calc(3rem * var(--scale-factor));
        font-weight: 700;
        text-shadow: calc(0.2rem * var(--scale-factor)) calc(0.2rem * var(--scale-factor)) calc(0.4rem * var(--scale-factor)) rgba(0, 0, 0, 0.5);
    }

    .game-logo {
        text-align: center;
        margin-bottom: calc(2rem * var(--scale-factor));
    }

    .logo-text {
        color: #00B2E7;
        font-size: calc(4rem * var(--scale-factor));
        font-weight: 700;
        background: #fff;
        padding: calc(1rem * var(--scale-factor)) calc(2rem * var(--scale-factor));
        border-radius: calc(1rem * var(--scale-factor));
        display: inline-block;
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

    /* Mobile responsive */
    @media (max-width: 768px) {
        .game-container {
            display: flex;
            flex-direction: column;
        }

        .instructions {
            inline-size: 100%;
            position: relative;
            block-size: auto;
            border-radius: 0;
        }

        .start-screen {
            inline-size: 100%;
            margin-inline-start: 0;
        }

        .game-grid {
            grid-template-columns: 1fr;
            gap: calc(2rem * var(--scale-factor));
        }

        .game-header {
            padding: calc(2rem * var(--scale-factor));
        }

        .question-wrapper {
            padding: calc(2rem * var(--scale-factor));
        }

        .rocket-girl {
            width: calc(15rem * var(--scale-factor));
            height: calc(22rem * var(--scale-factor));
        }

        .rocket-body {
            width: calc(6rem * var(--scale-factor));
            height: calc(15rem * var(--scale-factor));
        }

        .start-text {
            font-size: calc(2.5rem * var(--scale-factor));
        }
    }
</style> 