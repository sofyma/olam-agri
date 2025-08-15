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
    let isGamePlaying = false;
    
    const gameService = Game3Service.getInstance();
    
        onMount(() => {
        // Load game configs and initialize game
        gameAvailabilityStore.loadGameConfigs().then(async () => {
            // Check if game is available
            if (!$game3Availability.isAvailable) {
                goto('/games/info/3');
                return;
            }

            game3Store.initialize();
            await gameService.loadQuestions();
            isLoading = false;
        }).catch((err) => {
            error = err instanceof Error ? err.message : 'Failed to load game content';
            isLoading = false;
        });

        // Cleanup function to stop continuous movement
        return () => {
            stopContinuousMovement();
            // Additional cleanup for mobile touch events
            if (continuousMovementInterval) {
                clearInterval(continuousMovementInterval);
                continuousMovementInterval = null;
            }
        };
    });
    
    function startGame() {
        showInstructions = false;
        instructionsClosed = true;
        instructionsClosedSidebar = true;
        isGamePlaying = true;
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
    
    // Only update currentQuestion when the index actually changes, not on every store update
    let stableCurrentQuestion = currentQuestion;
    $: if ($game3Store.currentQuestionIndex !== undefined) {
        stableCurrentQuestion = $game3Store.questions[$game3Store.currentQuestionIndex] || null;
    }
    
    // Debug logging for current question
    $: if ($game3Store.showQuestionModal) {
        console.log('Current question debug:', {
            currentQuestionOrder: $game3Store.currentQuestionOrder,
            stableCurrentQuestion,
            availableQuestions: $game3Store.questions.map(q => ({ id: q.id, question: q.question })),
            showQuestionModal: $game3Store.showQuestionModal
        });
    }
    
    // Debug logging for question modal
    $: if ($game3Store.showQuestionModal) {
        console.log('Question modal should show:', {
            showQuestionModal: $game3Store.showQuestionModal,
            stableCurrentQuestion,
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

        // Show feedback for a longer duration before moving to next question
        setTimeout(() => {
            showFeedback = false; // Hide feedback
            
            // Only update the store and move to next question after feedback is hidden
            setTimeout(() => {
                        game3Store.answerQuestion(answer);
            }, 100); // Small delay to ensure smooth transition
        }, 1500); // Show feedback for 1.5 seconds
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

    let continuousMovementInterval: NodeJS.Timeout | null = null;
    let currentDirection: 'up' | 'down' | 'left' | 'right' | null = null;
    let isTouchActive = false; // Track if touch is currently active

    function handleDirectionalPadClick(direction: 'up' | 'down' | 'left' | 'right') {
        if ($game3Store.showQuestionModal) return;
        game3Store.moveBallSmooth(direction);
    }

    function startContinuousMovement(direction: 'up' | 'down' | 'left' | 'right') {
        if ($game3Store.showQuestionModal) return;
        
        // Stop any existing movement
        stopContinuousMovement();
        
        currentDirection = direction;
        
        // Start continuous movement with better mobile handling
        continuousMovementInterval = setInterval(() => {
            if (currentDirection && !$game3Store.showQuestionModal) {
                game3Store.moveBallSmooth(currentDirection);
            } else {
                // Safety check - stop if conditions are not met
                stopContinuousMovement();
            }
        }, 200); // Slightly slower for better mobile control
    }

    function stopContinuousMovement() {
        if (continuousMovementInterval) {
            clearInterval(continuousMovementInterval);
            continuousMovementInterval = null;
        }
        currentDirection = null;
        isTouchActive = false; // Reset touch flag
    }

    // Mobile-specific touch event handlers to prevent conflicts
    function handleTouchStart(event: TouchEvent, direction: 'up' | 'down' | 'left' | 'right') {
        if ($game3Store.showQuestionModal || isTouchActive) return;
        
        // Prevent default to avoid conflicts with click events
        event.preventDefault();
        
        // Mark touch as active
        isTouchActive = true;
        
        // Start continuous movement for mobile
        startContinuousMovement(direction);
    }

    function handleTouchEnd(event: TouchEvent) {
        if ($game3Store.showQuestionModal) return;
        
        // Prevent default to avoid conflicts
        event.preventDefault();
        
        // Mark touch as inactive
        isTouchActive = false;
        
        // Stop continuous movement
        stopContinuousMovement();
    }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="game-container" class:sidebar-is-closed={instructionsClosedSidebar} class:playing={isGamePlaying}>
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
                <button on:click={startGame} class="image-button" aria-label="Start Game">
                    <img class="game-start-screen-image" src="/images/game3-start-screen-image.png" alt="Game 3 Start Screen" style="visibility: hidden;">
                </button>
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
                    <button 
                        class="dir-btn up" 
                        on:click={() => handleDirectionalPadClick('up')}
                        on:mousedown={() => startContinuousMovement('up')}
                        on:mouseup={stopContinuousMovement}
                        on:mouseleave={stopContinuousMovement}
                        on:touchstart={(e) => handleTouchStart(e, 'up')}
                        on:touchend={(e) => handleTouchEnd(e)}
                        on:touchcancel={(e) => handleTouchEnd(e)}
                    >
                        <img src="/images/up.png" alt="Up Arrow" class="arrow arrow-up" />
                    </button>
                    <div class="dir-row">
                        <button 
                            class="dir-btn left" 
                            on:click={() => handleDirectionalPadClick('left')}
                            on:mousedown={() => startContinuousMovement('left')}
                            on:mouseup={stopContinuousMovement}
                            on:mouseleave={stopContinuousMovement}
                            on:touchstart={(e) => handleTouchStart(e, 'left')}
                            on:touchend={(e) => handleTouchEnd(e)}
                            on:touchcancel={(e) => handleTouchEnd(e)}
                        >
                            <img src="/images/up.png" alt="Left Arrow" class="arrow arrow-left" />
                        </button>
                        <button 
                            class="dir-btn right" 
                            on:click={() => handleDirectionalPadClick('right')}
                            on:mousedown={() => startContinuousMovement('right')}
                            on:mouseup={stopContinuousMovement}
                            on:mouseleave={stopContinuousMovement}
                            on:touchstart={(e) => handleTouchStart(e, 'right')}
                            on:touchend={(e) => handleTouchEnd(e)}
                            on:touchcancel={(e) => handleTouchEnd(e)}
                        >
                            <img src="/images/up.png" alt="Right Arrow" class="arrow arrow-right" />
                        </button>
                    </div>
                    <button 
                        class="dir-btn down" 
                        on:click={() => handleDirectionalPadClick('down')}
                        on:mousedown={() => startContinuousMovement('down')}
                        on:mouseup={stopContinuousMovement}
                        on:mouseleave={stopContinuousMovement}
                        on:touchstart={(e) => handleTouchStart(e, 'down')}
                        on:touchend={(e) => handleTouchEnd(e)}
                        on:touchcancel={(e) => handleTouchEnd(e)}
                    >
                        <img src="/images/up.png" alt="Down Arrow" class="arrow arrow-down" />
                    </button>
                </div>
                
                <div class="keyboard-instruction">
                    You can also use your keyboard arrows!
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
            {#if $game3Store.showQuestionModal && stableCurrentQuestion}
                <div class="question-overlay"></div>
                <div class="question-container-wrapper">
                    <Question
                        question={stableCurrentQuestion}
                        nextQuestion={$game3Store.questions[($game3Store.currentQuestionIndex + 1) % $game3Store.questions.length]}
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
        background-image: url('/images/j3-intro-all.jpg');
        background-position: center right;
        background-repeat: no-repeat;
        background-size: contain;
        block-size: var(--full-height, 100vh);
        overflow: hidden;
        position: relative;

        @media(min-width: 1920px) {
            background-size: 80%;
        }
        
        :global(.shape) {
            inset-block-start: calc(-10rem * var(--scale-factor));
            inset-inline-start: 0;
            position: absolute;
        }
    }

    /* Hide background image when game is playing */
    .game-container.playing {
        background-image: none;
    }

    .game-header {
        padding: 2rem calc(7rem * var(--scale-factor));
        position: relative;
        text-align: center;
        z-index: 10;
    }

    .game-header-image {
        inline-size: calc(100% * var(--scale-factor));
        margin-inline: auto;
        max-inline-size: calc(36.5rem * var(--scale-factor));
    }

    .game-area {
        align-items: center;
        block-size: var(--full-height, 100vh);
        display: flex;
        justify-content: center;
        padding-block-start: 0;
        position: relative;
    }

    .start-screen {
        block-size: var(--full-height, 100vh);
    }

    .directional-pad {
        align-items: center;
        background-color: #fff;
        border-radius: 2rem;
        display: flex;
        flex-direction: column;
        margin-block-start: calc(10rem * var(--scale-factor));
        padding: calc(3rem * var(--scale-factor));
    }

    .keyboard-instruction {
        color: #FFF;
        text-align: center;
        font-size: 1.6rem;
        font-style: normal;
        font-weight: 600;
        line-height: 2rem;
        padding-block-start: 1rem;

        @media(max-width: 932px) {
            display: none;
        }
    }

    .dir-row {
        display: flex;
        gap: calc(9rem * var(--scale-factor));
    }

    .dir-btn {
        block-size: 8rem;
        inline-size: 8rem;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        touch-action: manipulation;
        user-select: none;
        /* Prevent touch event conflicts on mobile */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .dir-btn img {
        -webkit-touch-callout: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -khtml-user-drag: none;
        -khtml-user-select: none;
        -moz-user-drag: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-drag: none;
        pointer-events: none;
        user-select: none;
    }

    .maze-container {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        inset-block-start: 0;
        inset-inline-start: 0;
        position: relative;
    }

    .maze-svg {
        background: transparent;
        block-size: auto;
        inline-size: calc(120.5rem * var(--scale-factor));
    }

    .ball {
        transition: cx 0.3s ease-out, cy 0.3s ease-out;
    }
    
    .game-panel {
        block-size: var(--full-height, 100vh);
        position: relative;
    }

    :global(.instructions .logo path) {
        fill: #fff;
    }


    // .start-screen {
    //     display: flex;
    //     inline-size: calc(100vw - (100vw - 66.41%));
    //     justify-content: center;
    //     margin-inline-start: auto;

    //     &-content {
    //         position: relative;
    //     }
    // }

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
        block-size: var(--full-height, 100vh);
        border: none;
        cursor: pointer;
        inline-size: 100%;
        margin: 0;
        padding: 0;
        // transform: scale(var(--scale-factor));
        // transform-origin: center;
    }

    .game-start-screen-image {
        inline-size: calc(65.6rem * var(--scale-factor));
        margin-block-start: 0;
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
        background-color: rgba(255, 91, 175, 0.9);
        block-size: var(--full-height, 100vh);
        inset-block-start: 0;
        inset-inline-start: 0;
        inline-size: 100vw;
        position: fixed;
        z-index: 1000;
    }

    .question-container-wrapper {
        inline-size: 100%;
        max-inline-size: calc(105.2rem * var(--scale-factor));
        padding: 0 2rem;
        position: relative;
        // transform: scale(var(--scale-factor));
        // transform-origin: center;
        z-index: 2000;
    }

    .finish {
        stroke: transparent !important;
        stroke-width: 10 !important;
    }

   
    @media (max-width: 932px) {
        .game-container {
            background-image: url('/images/j3-start-mobile.png');
            background-position: center right;
            background-repeat: no-repeat;
            background-size: contain;
        }

        .game-area {
            display: grid;
            grid-template-columns: 14.5rem 1fr;
            grid-column-gap: 3rem;
            padding-inline: 6rem 3.5rem;
        }

       
        // .start-screen {
        //     inline-size: calc(100vw - (100vw - 66.41%));
        //     padding: 1rem;
        // }

        
        .sidebar-is-closed .start-screen {
            inline-size: calc(100vw - (100vw - 66.41%));
        }

        // .start-screen-content {
        //     transform-origin: center center;
        // }

       
        // .start-screen {
        //     overflow-y: hidden;
        // }

      
        // .image-button {
        //     transform: none;
        //     transform-origin: unset;
        // }

        .game-start-screen-image {
            inline-size: calc(28.8rem * var(--scale-factor));
            margin-block-start: 0;
        }

       
        .question-container-wrapper {
            block-size: 100%;
            inline-size: 100%;
            inset-block-start: 0;
            inset-inline-start: 0;
            max-inline-size: 100%;
            padding-block: .8rem;
            padding-inline: 3.5rem 1.5rem;
            position: absolute;
            transform: none;
            transform-origin: unset;
        }

        
        .maze-svg {
            block-size: auto;
            inline-size: calc(70rem * var(--scale-factor));
        }

       
        .directional-pad {
            block-size: 14.5rem;
            display: flex;
            inline-size: 14.5rem;
            justify-content: center;
            margin-block-start: 0;
            padding: 0;
        }

        .dir-row {
            gap: 4rem;
        }

        
        .dir-btn {
            block-size: 4rem;
            inline-size: 4rem;
            /* Enhanced mobile touch handling */
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            /* Prevent accidental touches */
            min-height: 44px; /* iOS recommended minimum touch target */
        }

        .game-header-image {
            inline-size: 100%;
            max-inline-size: 14rem;
        }

        .game-header {
            padding: 0;
        }
    }
</style> 