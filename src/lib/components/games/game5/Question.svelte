<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { game5Store } from '$lib/stores/game5Store';
    import { Game5Service } from '$lib/services/game5Service';
    import { onMount, onDestroy } from 'svelte';

    const dispatch = createEventDispatcher();
    
    let answer = '';
    let showError = false;
    let errorMessage = '';
    let gameService = Game5Service.getInstance();

    onMount(() => {
        game5Store.initialize();
    });

    onDestroy(() => {
        game5Store.cleanup();
    });

    function handleSubmit() {
        if (!answer.trim()) {
            showError = true;
            errorMessage = 'Please enter an answer';
            return;
        }

        showError = false;
        errorMessage = '';
        
        const isCorrect = gameService.validateAnswer(answer);
        
        if (isCorrect) {
            game5Store.submitAnswer(answer);
            dispatch('submit', { answer, isCorrect: true });
        } else {
            game5Store.submitAnswer(answer);
            showError = true;
            errorMessage = 'Incorrect, try again';
            answer = '';
        }
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    $: formattedTime = gameService.formatTime($game5Store.timeSpent);
</script>

<div class="question-container">
    <div class="timer-section">
        <div class="timer">
            <span class="timer-label">Time:</span>
            <span class="timer-value">{formattedTime}</span>
        </div>
        <div class="attempts">
            <span class="attempts-label">Attempts:</span>
            <span class="attempts-value">{$game5Store.attempts}</span>
        </div>
    </div>

    <div class="instructions-section">
        <h2 class="instructions-title">Find the Answer</h2>
        <p class="instructions-text">
            Find the words in orange on page 4 of PDF #1 of the Brand Guidelines.
        </p>
        <p class="instructions-text">
            Type the exact answer as it appears in the document.
        </p>
    </div>

    <div class="input-section">
        <div class="input-container">
            <input
                type="text"
                bind:value={answer}
                on:keypress={handleKeyPress}
                placeholder="Type your answer here..."
                class="answer-input"
                disabled={$game5Store.isComplete}
            />
            <button 
                on:click={handleSubmit}
                class="submit-button"
                disabled={$game5Store.isComplete || !answer.trim()}
            >
                SEND
            </button>
        </div>
        
        {#if showError}
            <div class="error-message">
                {errorMessage}
            </div>
        {/if}
    </div>

    <div class="help-section">
        <p class="help-text">
            Need help? Click this link to visit 
            <a href="https://olamagri.workvivo.com/" target="_blank" class="help-link">The Loop</a>
        </p>
    </div>
</div>

<style lang="scss">
    .question-container {
        display: flex;
        flex-direction: column;
        gap: calc(3rem * var(--scale-factor));
        padding: calc(2rem * var(--scale-factor));
        max-width: calc(60rem * var(--scale-factor));
        margin: 0 auto;
    }

    .timer-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.1);
        padding: calc(1.5rem * var(--scale-factor));
        border-radius: calc(1rem * var(--scale-factor));
    }

    .timer, .attempts {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(0.5rem * var(--scale-factor));
    }

    .timer-label, .attempts-label {
        color: #fff;
        font-size: calc(1.4rem * var(--scale-factor));
        font-weight: 600;
    }

    .timer-value, .attempts-value {
        color: #fff;
        font-size: calc(2.4rem * var(--scale-factor));
        font-weight: 700;
        font-family: monospace;
    }

    .instructions-section {
        text-align: center;
        background-color: rgba(255, 255, 255, 0.1);
        padding: calc(2rem * var(--scale-factor));
        border-radius: calc(1rem * var(--scale-factor));
    }

    .instructions-title {
        color: #fff;
        font-size: calc(3.2rem * var(--scale-factor));
        font-weight: 600;
        margin-bottom: calc(1.5rem * var(--scale-factor));
    }

    .instructions-text {
        color: #fff;
        font-size: calc(2rem * var(--scale-factor));
        line-height: 1.4;
        margin-bottom: calc(1rem * var(--scale-factor));
    }

    .input-section {
        display: flex;
        flex-direction: column;
        gap: calc(1.5rem * var(--scale-factor));
    }

    .input-container {
        display: flex;
        gap: calc(1rem * var(--scale-factor));
    }

    .answer-input {
        flex: 1;
        padding: calc(1.5rem * var(--scale-factor));
        border: none;
        border-radius: calc(1rem * var(--scale-factor));
        font-size: calc(2rem * var(--scale-factor));
        background-color: #fff;
        color: #2E2D2C;
        
        &:focus {
            outline: none;
            box-shadow: 0 0 0 calc(0.2rem * var(--scale-factor)) #00B2E7;
        }
        
        &:disabled {
            background-color: #f5f5f5;
            color: #999;
        }
    }

    .submit-button {
        padding: calc(1.5rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
        background-color: #00B2E7;
        color: #fff;
        border: none;
        border-radius: calc(1rem * var(--scale-factor));
        font-size: calc(1.8rem * var(--scale-factor));
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
            background-color: #0099cc;
        }
        
        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    }

    .error-message {
        color: #ff6b6b;
        font-size: calc(1.8rem * var(--scale-factor));
        text-align: center;
        padding: calc(1rem * var(--scale-factor));
        background-color: rgba(255, 107, 107, 0.1);
        border-radius: calc(0.5rem * var(--scale-factor));
        border: calc(0.1rem * var(--scale-factor)) solid #ff6b6b;
    }

    .help-section {
        text-align: center;
        padding: calc(1.5rem * var(--scale-factor));
    }

    .help-text {
        color: #fff;
        font-size: calc(1.6rem * var(--scale-factor));
    }

    .help-link {
        color: #00B2E7;
        text-decoration: underline;
        font-weight: 600;
        
        &:hover {
            color: #0099cc;
        }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .question-container {
            padding: calc(1rem * var(--scale-factor));
            gap: calc(2rem * var(--scale-factor));
        }

        .timer-section {
            flex-direction: column;
            gap: calc(1rem * var(--scale-factor));
        }

        .input-container {
            flex-direction: column;
        }

        .submit-button {
            width: 100%;
        }
    }
</style> 