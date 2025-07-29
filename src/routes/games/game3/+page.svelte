<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { game3Store } from '$lib/stores/game3Store';
    import { game3Availability, gameAvailabilityStore } from '$lib/stores/gameAvailabilityStore';
    import { Game3Service } from '$lib/services/game3Service';
    import Question from '$lib/components/games/game3/Question.svelte';
    import type { Question as QuestionType } from '$lib/types/game3';
    import { RankingService } from '$lib/services/rankingService';
    import { getAuth } from '$lib/stores/authStore';
    import GameInstructions from '$lib/components/GameInstructions.svelte';
    
    let currentQuestion: QuestionType | null;
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
    
    const gameService = Game3Service.getInstance();
    
        onMount(async () => {
        try {
            // Load game configs if not already loaded
            await gameAvailabilityStore.loadGameConfigs();
            
            // Check if game is available
            if (!$game3Availability.isAvailable) {
                goto('/games/info/3');
                return;
            }

			game3Store.initialize();
            await gameService.loadQuestions();
            isLoading = false;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load game content';
            isLoading = false;
        }
    });
    
    function startGame() {
        showInstructions = false;
        instructionsClosed = true;
        instructionsClosedSidebar = true;
        game3Store.start();
    }

    function closeInstructions() {
        instructionsClosed = true;
        instructionsClosedSidebar = true;
    }

    function openInstructions() {
        instructionsClosed = false;
        instructionsClosedSidebar = false;
    }

    $: if ($game3Store.isComplete) {
        console.log('Game 3 completed! Score:', $game3Store.score);
        // Save game result
        const auth = getAuth();
        if (auth.user && auth.user._id) {
            const rankingService = RankingService.getInstance();
            // Save Game 3 result
            rankingService.saveGame3Result(
                auth.user._id,
                3, // Game 3
                $game3Store.score,
                new Date().toISOString(),
                $game3Store.answers, // Pass the answers array
                $game3Store.checkpointsReached
            ).catch(error => {
                console.error('Error saving game result:', error);
            });
        }
        goto('/games/game3/summary');
    }

    $: currentQuestion = $game3Store.questions[$game3Store.currentQuestionIndex] || null;
    
    // Debug logging for current question
    $: if ($game3Store.showQuestionModal) {
        console.log('Current question debug:', {
            currentQuestionOrder: $game3Store.currentQuestionOrder,
            currentQuestion,
            availableQuestions: $game3Store.questions.map(q => ({ id: q.id, question: q.question })),
            showQuestionModal: $game3Store.showQuestionModal
        });
    }
    
    // Debug logging for question modal
    $: if ($game3Store.showQuestionModal) {
        console.log('Question modal should show:', {
            showQuestionModal: $game3Store.showQuestionModal,
            currentQuestion,
            currentQuestionIndex: $game3Store.currentQuestionIndex,
            questionsLength: $game3Store.questions.length,
            checkpointsReached: $game3Store.checkpointsReached
        });
    }

    function handleQuestionSubmit(event: CustomEvent<{ answer: string; isCorrect: boolean }>) {
        const { answer, isCorrect } = event.detail;
        
        showFeedback = true;
        feedbackState = {
            isCorrect,
            message: isCorrect ? 'Correct!' : 'Incorrect!'
        };

        setTimeout(() => {
            showFeedback = false;
            game3Store.answerQuestion(answer);
        }, 2000);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if ($game3Store.showQuestionModal) return;
        
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                event.preventDefault();
                game3Store.moveBallSmooth('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                event.preventDefault();
                game3Store.moveBallSmooth('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                event.preventDefault();
                game3Store.moveBallSmooth('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                event.preventDefault();
                game3Store.moveBallSmooth('right');
                break;
        }
    }

    function handleDirectionalPadClick(direction: 'up' | 'down' | 'left' | 'right') {
        if ($game3Store.showQuestionModal) return;
        game3Store.moveBallSmooth(direction);
    }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar}>
    {#if showInstructions}
        <div class="game-panel">
            <GameInstructions
                gameNumber={3}
                gameTitle="Brand Heroes"
                gameSubtitle="Brain Over Brawn"
                infoRoute="/games/info/3"
                bind:instructionsClosed
                primaryColor="#FF5BAF"
                backgroundColor="#2E2D2C"
                paragraphs={[
                    "Dr Genius may be tough, but his real power is his brain, he trains it every day!",
                    "Now he challenges you: use the arrow pad to escape the maze, solve hidden challenges, and score up to 11 points in total.",
                    "Let the wits be with you!"
                ]}
            />

            <div class="start-screen">
                <div class="start-screen-content">
                    <button on:click={startGame} class="image-button" aria-label="Start Game">
                        <img class="game-start-screen-image" src="/images/game3-start-screen-image.png" alt="Game 3 Start Screen">
                    </button>
                </div>
            </div>
        </div>

    {:else if $game3Store.isLoading}
        <div class="loading">Loading maze...</div>
    {:else if $game3Store.error}
        <div class="error">
            <h2>Game Setup Required</h2>
            <p>{$game3Store.error}</p>
            <p>Please add some Game 3 questions in your Sanity Studio to play this game.</p>
        </div>
    {:else}
        <GameInstructions
            gameNumber={3}
            gameTitle="Brand Heroes"
            gameSubtitle="The Maze of Confusion"
            infoRoute="/games/info/3"
            bind:instructionsClosed
            primaryColor="#FF5BAF"
            backgroundColor="#2E2D2C"
            paragraphs={[
                "Mr Confusion has created a maze to confuse us! Navigate through the maze to reach the finish line.",
                "Use the directional pad to move the ball. You'll encounter questions along the way.",
                "Each correct answer earns you 1 point. Wrong answers cost you 1 point.",
                "Can you find your way through the maze?"
            ]}
        />

        <div class="game-area">
            <div class="game-header">
                <img src="/images/game3-playing-screen.png" alt="Game 3 Playing Screen" class="game-header-image">

                <div class="directional-pad">
                    <button class="dir-btn up" on:click={() => handleDirectionalPadClick('up')}>
                        <img src="/images/up.png" alt="Up Arrow" class="arrow arrow-up" />
                    </button>
                    <div class="dir-row">
                        <button class="dir-btn left" on:click={() => handleDirectionalPadClick('left')}>
                            <img src="/images/up.png" alt="Left Arrow" class="arrow arrow-left" />
                        </button>
                        <button class="dir-btn right" on:click={() => handleDirectionalPadClick('right')}>
                            <img src="/images/up.png" alt="Right Arrow" class="arrow arrow-right" />
                        </button>
                    </div>
                    <button class="dir-btn down" on:click={() => handleDirectionalPadClick('down')}>
                        <img src="/images/up.png" alt="Down Arrow" class="arrow arrow-down" />
                    </button>
                </div>
            </div>

            
            <div class="maze-container">
                <!-- Maze SVG -->
                <svg width="1205" height="895" viewBox="0 0 1205 895" fill="none" xmlns="http://www.w3.org/2000/svg" class="maze-svg">
                    <!-- Walls -->
                    {#each $game3Store.walls as wall}
                        <line 
                            x1={wall.x1} 
                            y1={wall.y1} 
                            x2={wall.x2} 
                            y2={wall.y2} 
                            stroke="white" 
                            stroke-width="7.47" 
                            stroke-miterlimit="10" 
                            stroke-linecap="square"
                        />
                    {/each}
                    
                    <!-- Finish Line -->
                    <line 
                        x1="1141.28" 
                        y1="890.71" 
                        x2="1200.39" 
                        y2="890.71" 
                        stroke="white" 
                        stroke-width="7.47" 
                        stroke-miterlimit="10" 
                        stroke-linecap="square" 
                        class="finish"
                    />
                    
                    <!-- Checkpoints -->
                    {#each $game3Store.checkpoints as checkpoint}
                        {#if !checkpoint.isReached}
                            <g transform="translate({checkpoint.x}, {checkpoint.y})">
                                <rect x="0" y="0" width="40" height="40" rx="6" ry="6" fill="#2E2D2C"/>
                                <path d="M21.72 25.5998C21.72 25.9298 20.8 26.7898 20.01 26.7898C19.57 26.7898 19.2 26.4898 19.09 25.7098C19.09 25.5598 17.26 11.7498 17.26 7.6698C17.26 7.6698 17.26 6.47981 18.23 5.92981C21.01 4.66981 22.05 4.2998 22.83 4.2998C23.5 4.2998 24.13 4.73981 24.13 5.40981C24.13 8.48981 21.71 20.3698 21.71 25.5998H21.72ZM20.54 35.6998C18.64 35.6998 17.27 34.3298 17.27 32.5098C17.27 30.8398 18.65 29.3498 20.54 29.3498C22.29 29.3498 23.8 30.8398 23.8 32.5098C23.8 34.3298 22.28 35.6998 20.54 35.6998Z" fill="white"/>
                            </g>
                        {/if}
                    {/each}
                    
                    <!-- Ball -->
                    <circle 
                        cx={$game3Store.ballPosition.x} 
                        cy={$game3Store.ballPosition.y} 
                        r="15" 
                        fill="black"
                        class="ball"
                    />
                </svg>
            </div>

            <!-- Question Modal Overlay - moved outside maze-container to cover entire game-container -->
            {#if $game3Store.showQuestionModal && currentQuestion}
                <div class="question-overlay"></div>
                <div class="question-container-wrapper">
                    <Question
                        question={currentQuestion}
                        showFeedback={showFeedback}
                        isCorrect={feedbackState.isCorrect}
                        currentQuestionNumber={($game3Store.currentQuestionIndex % 5) + 1}
                        totalQuestions={5}
                        on:submit={handleQuestionSubmit}
                    />
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
        position: relative;
        
        :global(.shape) {
            inset-block-start: calc(-10rem * var(--scale-factor));
            inset-inline-start: 0;
            position: absolute;
        }
    }

    .game-header {
        padding: 2rem calc(7rem * var(--scale-factor));
        position: relative;
        z-index: 10;
        text-align: center;
    }

    .game-header-image {
        margin-inline: auto;
        width: calc(100% * var(--scale-factor));
        max-width: calc(80rem * var(--scale-factor));
    }

    .game-area {
        display: flex;
        justify-content: center;
        padding-block-start: calc(5rem * var(--scale-factor));
        position: relative;
    }

    .directional-pad {
        background-color: #fff;
        border-radius: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-block-start: calc(10rem * var(--scale-factor));
        padding: calc(3rem * var(--scale-factor));
    }

    .dir-row {
        display: flex;
        gap: calc(9rem * var(--scale-factor));
    }

    .dir-btn {
        width: 8rem;
        height: 8rem;
    }

    .maze-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        //margin-inline-start: -2rem;
        inset-block-start: -2rem;
        inset-inline-start: -4rem;
    }

    .maze-svg {
        background: transparent;
        width: calc(120.5rem * var(--scale-factor));
        //height: calc(89.5rem * var(--scale-factor));
        block-size: auto;
    }

    .ball {
        transition: cx 0.3s ease-out, cy 0.3s ease-out;
    }
    
    .game-panel {
        position: relative;
    }

    // .instructions {
    //     background-color: #2E2D2C;
    //     block-size: 100vh;
    //     border-radius: 0 calc(6rem * var(--scale-factor)) 0 0;
    //     inline-size: calc(100vw - 66.41%);
    //     inset-block-start: 0;
    //     inset-inline-start: 0;
    //     overflow-y: auto;
    //     padding: calc(5rem * var(--scale-factor)) calc(6rem * var(--scale-factor)) calc(9rem * var(--scale-factor));
    //     position: fixed;
    //     z-index: 9999;
    //     transition: transform 0.3s ease-in-out;
    //     scrollbar-width: none; /* Firefox */
    //     -ms-overflow-style: none; /* Internet Explorer 10+ */

    //     &::-webkit-scrollbar {
    //         display: none; /* Chrome, Safari, Opera */
    //     }

    //     &.closed {
    //         transform: translateX(calc(-100% + 5rem * var(--scale-factor)));
    //     }
    // }

    :global(.instructions .logo path) {
        fill: #fff;
    }

    // .close-button,
    // .play-button {
    //     background: none;
    //     border: none;
    //     color: white;
    //     cursor: pointer;
    //     position: absolute;
    //     z-index: 10000;
    //     padding: 1rem;

    //     &:hover {
    //         opacity: 0.8;
    //     }
    // }

    // .close-button {
    //     inset-block-start: 2rem;
    //     inset-inline-end: 2rem;

    //     svg {
    //         block-size: 2.4rem;
    //         inline-size: 2.3rem;
    //     }
    // }

    // .play-button {
    //     inset-block-start: 2rem;
    //     inset-inline-end: .5rem;

    //     svg {
    //         block-size: 3.3rem;
    //         inline-size: 2.7rem;
    //     }
    // }

    // .copy {
    //     background-color: #fff;
    //     margin-block-start: calc(6.5rem * var(--scale-factor));
    //     padding: 2rem 2rem calc(4rem * var(--scale-factor));
    //     position: relative;

    //     &-header {
    //         align-items: end;
    //         display: grid;
    //         justify-content: start;
    //         grid-template-columns: repeat(2, auto);
    //         grid-column-gap: calc(3rem * var(--scale-factor));
    //         margin-block-start: calc(-5rem * var(--scale-factor));
    //     }
    // }

    // .game-id {
    //     align-items: center;
    //     background-color: #FF5BAF;
    //     border-radius: 0 2rem 0 2rem;
    //     block-size: calc(17rem * var(--scale-factor));
    //     color: #fff;
    //     display: flex;
    //     flex-direction: column;
    //     inline-size: 11rem;
    //     padding: 1rem;
    //     text-align: center;

    //     .text {
    //         font-size: calc(2.8rem * var(--scale-factor));
    //         font-weight: 600;
    //         line-height: calc(2.8rem * var(--scale-factor));
    //     }

    //     .number {
    //         font-size: calc(13.7rem * var(--scale-factor));
    //         font-weight: 600;
    //         line-height: calc(13.7rem * var(--scale-factor));
    //     }
    // }

    // .title {
    //     color: #FF5BAF;
    //     font-size: calc(6rem * var(--scale-factor));
    //     font-style: normal;
    //     font-weight: 600;
    //     line-height: normal;
    //     padding-block-start: 2rem;
    // }

    // .subtitle {
    //     color: #FF5BAF;
    //     font-size: calc(3.7rem * var(--scale-factor));
    //     font-weight: 600;
    //     line-height: normal;
    // }

    // .paragraph {
    //     color: #2E2D2C;
    //     font-size: calc(2.2rem * var(--scale-factor));
    //     padding-block-start: 2rem;

    //     &:first-child {
    //         padding-block-start: calc(2.5rem * var(--scale-factor));
    //     }
    // }

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
        font-size: calc(3rem * var(--scale-factor));
        justify-content: center;
    }

    .image-button {
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        transform: scale(var(--scale-factor));
        transform-origin: center;
    }

    .game-start-screen-image {
        margin-block-start: 0;
        width: calc(65.6rem * var(--scale-factor));
        //height: calc(92.8rem * var(--scale-factor));
    }

    .arrow {
        display: block;
        margin: auto;
    }
    .arrow-up {
        transform: rotate(0deg);
    }
    .arrow-left {
        transform: rotate(-90deg);
    }
    .arrow-right {
        transform: rotate(90deg);
    }
    .arrow-down {
        transform: rotate(180deg);
    }

    .question-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 91, 175, 0.9);
        z-index: 1000;
    }

    .question-container-wrapper {
        position: absolute;
        top: 50%;
        right: 2rem;
        transform: translateY(-50%);
        z-index: 1001;
        width: 90%;
        max-width: calc(90rem * var(--scale-factor));
        padding: 0 2rem;
        transform: translateY(-50%) scale(var(--scale-factor));
        transform-origin: center;
    }

    @media (width >= 1920px) {
        .question-container-wrapper {
            top: 55%;
        }
    }

    .finish {
        stroke: transparent !important;
        stroke-width: 10 !important;
    }

    /* Content check section */
    // .content-check {
    //     padding-block-start: calc(2.7rem * var(--scale-factor));
    // }

    // .content-check-grid {
    //     display: grid;
    //     grid-template-columns: auto 1fr;
    //     gap: 2rem;
    //     align-items: center;
    // }

    // .content-check-btn {
    //     width: 14.6rem;
    //     height: 3.4rem;
    //     border-radius: 0 1.5rem;
    //     color: #fff;
    //     background-color: #FF5BAF;
    //     border: none;
    //     font-size: 1.4rem;
    //     font-weight: 600;
    //     cursor: pointer;
    //     transition: all 0.3s ease;

    //     &:hover {
    //         opacity: 0.8;
    //     }
    // }

    // 	.content-check-text {
	// 	color: #FFF;
	// 	font-size: 1.4rem;
	// 	font-style: normal;
	// 	font-weight: 400;
	// 	line-height: 2rem;
	// }

	/* Windows 125% specific styles */
	/*
	:global(.window125) .game-container {
		display: flex;
		align-items: flex-start;
	}

	:global(.window125) .instructions {
		position: static !important;
		inline-size: calc(100vw - 66.41%);
		block-size: 100vh;
		flex-shrink: 0;
	}

	:global(.window125) .start-screen {
		inline-size: calc(100vw - (100vw - 66.41%));
		margin-inline-start: auto;
		flex-shrink: 0;
	}

	:global(.window125) .game-panel {
		display: flex;
		align-items: flex-start;
		width: 100%;
	}

	:global(.window125) .sidebar-is-closed .start-screen {
		inline-size: 100%;
		margin-inline-start: 0;
	}

	:global(.window125) .game-grid {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	:global(.window125) .sidebar-is-closed .game-grid {
		display: grid;
		grid-template-columns: calc(55rem * var(--scale-factor)) 1fr;
	}
	*/

    /* Mobile Media Query - Up to 932px */
    @media (max-width: 932px) {
        /* 1. Fix left sidebar title and horizontal scroll */
        // .instructions {
        //     inline-size: calc(100vw - 66.41%);
        //     padding: calc(3rem * var(--scale-factor)) calc(4rem * var(--scale-factor)) calc(6rem * var(--scale-factor));
        //     overflow-x: hidden;
        //     scrollbar-width: none; /* Firefox */
        //     -ms-overflow-style: none; /* Internet Explorer 10+ */
        // }

        // .instructions::-webkit-scrollbar {
        //     display: none; /* Chrome, Safari, Opera */
        // }

        // .title {
        //     font-size: calc(4.5rem * var(--scale-factor));
        //     word-wrap: break-word;
        //     overflow-wrap: break-word;
        // }

        /* 2. Fix sidebar horizontal scroll */
        // .copy {
        //     margin-block-start: calc(4rem * var(--scale-factor));
        //     padding: 1.5rem;
        // }

        // .copy-header {
        //     grid-template-columns: repeat(2, auto);
        //     grid-column-gap: 2rem;
        //     margin-block-start: calc(-3rem * var(--scale-factor));
        // }

        /* 3. Keep content text size as requested */
        // .paragraph {
        //     font-size: calc(2.2rem * var(--scale-factor));
        // }

        /* 4. Adjust start screen for mobile */
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

        /* 5. Adjust game ID for mobile */
        // .game-id {
        //     block-size: 12rem;
        //     inline-size: 8rem;
        // }

        // .game-id .text {
        //     font-size: 2rem;
        //     line-height: 2rem;
        // }

        // .game-id .number {
        //     font-size: calc(9rem * var(--scale-factor));
        //     line-height: calc(9rem * var(--scale-factor));
        // }

        /* 6. Adjust subtitle for mobile */
        // .subtitle {
        //     font-size: calc(2.5rem * var(--scale-factor));
        //     word-wrap: break-word;
        //     overflow-wrap: break-word;
        // }

        /* 7. Adjust buttons for mobile */
        // .close-button {
        //     inset-block-start: 1rem;
        //     inset-inline-end: 2rem;
        // }

        // .play-button {
        //     inset-block-start: 2rem;
        //     inset-inline-end: -0.2rem;
        // }

        /* 8. Fix sidebar closed state for mobile */
        // .instructions.closed {
        //     transform: translateX(calc(-100% + 4rem * var(--scale-factor)));
        // }

        /* 9. Reset image button transform and adjust SVG for mobile */
        .image-button {
            transform: none;
            transform-origin: unset;
        }

        .game-start-screen-image {
            margin-block-start: 0;
            width: calc(28.8rem * var(--scale-factor));
            //height: calc(43.2rem * var(--scale-factor));
        }

        /* 10. Adjust question overlay for mobile */
        .question-container-wrapper {
            width: 95%;
            height: 40%;
            padding: 0 1rem;
            transform: translateY(-137%) scale(var(--scale-factor));
        }

        /* 11. Adjust maze SVG for mobile */
        .maze-svg {
            height: auto;
            width: calc(80rem * var(--scale-factor));
        }

        /* 12. Adjust directional pad for mobile */
        .directional-pad {
            margin-block-start: 0;
            padding: 2rem;
        }

        /* 13. Adjust directional buttons for mobile */
        .dir-btn {
            width: 6rem;
            height: 6rem;
        }

        /* 15. Hide game header image on mobile */
        .game-header-image {
            display: none;
        }

        		/* 16. Adjust game header padding for mobile */
		.game-header {
			padding-block-start: 0;
		}

		/* Content check section mobile adjustments */
		// .content-check {
		// 	padding-block-start: 2rem;
		// }

		// .content-check-grid {
		// 	gap: 1.5rem;
		// }

		// .content-check-btn {
		// 	width: 12rem;
		// 	height: 3rem;
		// 	font-size: 1.2rem;
		// }

		// .content-check-text {
		// 	font-size: 1.2rem;
		// 	line-height: 1.6rem;
		// }
	}
</style> 