<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Question } from '$lib/types/game1';
    
    export let question: Question;
    export let showFeedback = false;
    export let isCorrect: boolean | null = null;
    export let questionType: 'brand' | 'place' = 'brand';
    export let currentQuestionNumber: number;
    export let totalQuestions: number;
    
    let selectedAnswer: string | null = null;
    let isSubmitting = false;
    let isEntering = false;
    
    const dispatch = createEventDispatcher<{
        submit: { answer: string; isCorrect: boolean };
    }>();
    
    const handleSubmit = () => {
        if (!selectedAnswer || isSubmitting) return;
        
        isSubmitting = true;
        const isAnswerCorrect = selectedAnswer === question.correctAnswer;
        
        dispatch('submit', {
            answer: selectedAnswer,
            isCorrect: isAnswerCorrect
        });
    }

    const handleOptionClick = (option: string) => {
        if (!isSubmitting) {
            selectedAnswer = option;
        }
    };

    const handleKeyDown = (event: KeyboardEvent, option: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleOptionClick(option);
        }
    };

    // Reset state when question changes
    $: if (question) {
        selectedAnswer = null;
        isSubmitting = false;
        isEntering = true;
        // Reset entering animation state
        setTimeout(() => {
            isEntering = false;
        }, 50);
    }

    $: imageUrl = question?.image || '';
</script>

<span class="question-counter">{currentQuestionNumber} of {totalQuestions}</span>
<div class="question-container" class:entering={!showFeedback && isEntering}>
    {#if !showFeedback}
        <div class="question-header">
            
            <h2 class="question-title">
                {questionType === 'brand' ? 'Guess the Brand!' : 'Guess the Place!'}
            </h2>
        </div>
        
        {#if imageUrl}
            <img 
                src={imageUrl}
                alt={question.imageAlt || `Question image`} 
                class="question-image" 
            />
        {/if}
        
        <div class="question-options">
            <div class="options">
                {#each question.options as option}
                    <div 
                        class="option"
                        class:selected={selectedAnswer === option}
                        on:click={() => handleOptionClick(option)}
                        on:keydown={(event) => handleKeyDown(event, option)}
                        tabindex="0"
                        role="radio"
                        aria-checked={selectedAnswer === option}
                    >
                        <input
                            type="radio"
                            name="answer"
                            value={option}
                            checked={selectedAnswer === option}
                            on:change={() => handleOptionClick(option)}
                        />
                        <span class="option-text">{option}</span>
                    </div>
                {/each}
            </div>
            
            <button
                class="submit-button btn btn-cta3"
                on:click={handleSubmit}
                disabled={!selectedAnswer || isSubmitting}
            >
                Submit
            </button>
        </div>
    {/if}

    {#if showFeedback}
        <div class="feedback">
            <div class="feedback-content">
                {#if isCorrect}
                    <svg width="396" height="396" viewBox="0 0 396 396" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M254.576 0.240967H141.424C63.5938 0.240967 0.5 63.3348 0.5 141.165V254.317C0.5 332.147 63.5938 395.241 141.424 395.241H254.576C332.406 395.241 395.5 332.147 395.5 254.317V141.165C395.5 63.3348 332.406 0.240967 254.576 0.240967Z" fill="#00A865"/>
                        <path d="M104.675 208.195L159.922 263.442L291.322 132.042" stroke="white" stroke-width="62.174" stroke-miterlimit="10" stroke-linecap="round"/>
                    </svg>
                    {#if questionType === 'brand'}
                        <span class="points">+1 Point</span>
                    {/if}
                {:else}
                    <svg width="396" height="396" viewBox="0 0 396 396" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M254.576 0.23999H141.424C63.5938 0.23999 0.5 63.3338 0.5 141.164V254.316C0.5 332.146 63.5938 395.24 141.424 395.24H254.576C332.406 395.24 395.5 332.146 395.5 254.316V141.164C395.5 63.3338 332.406 0.23999 254.576 0.23999Z" fill="#FF3000"/>
                        <path d="M137.509 258.232L258.492 137.249" stroke="white" stroke-width="62.174" stroke-miterlimit="10" stroke-linecap="round"/>
                        <path d="M137.509 137.249L258.492 258.232" stroke="white" stroke-width="62.174" stroke-miterlimit="10" stroke-linecap="round"/>
                    </svg>
                    {#if questionType === 'place'}
                        <span class="points">-1 Point</span>
                    {/if}
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .question-counter {
        color: #fff;
        display: block;
        font-size: calc(2rem * var(--scale-factor));
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        padding-block-end: calc(1.5rem * var(--scale-factor));
        padding-inline-end: calc(4rem * var(--scale-factor));
        text-align: end
    }

    .question-container {
        background-color: #fff;
        border-radius: calc(3.7rem * var(--scale-factor));  
        block-size: calc(90rem * var(--scale-factor));    
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        opacity: 1;
        padding-block: calc(4rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
        position: relative;
        transform: scale(1) translateY(0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .question-container.entering {
        opacity: 0;
        transform: scale(0.95) translateY(1rem);
    }

    .question-header {
        padding-inline: calc(6.5rem * var(--scale-factor));
        margin-block-end: calc(2rem * var(--scale-factor));
    }

    .question-title {
        color: #2E2D2C;
        font-size: calc(4.6rem * var(--scale-factor));
        font-weight: 600;
        margin-block-end: 0;
        padding-inline: 0;
        text-align: start;
    }
    
    .question-image {
        inline-size: 100%;
        margin-block-end: calc(3rem * var(--scale-factor));
        max-block-size: calc(40rem * var(--scale-factor));
        object-fit: cover;
    }
    
    .question-options {
        padding-block-start: calc(3rem * var(--scale-factor));
        padding-inline: calc(9rem * var(--scale-factor));
    }

    .options {
        display: inline-flex;   
        flex-direction: column;
        margin-block-end: 2rem;
    }
    
    .option {
        align-items: center;
        border-radius: calc(1.5rem * var(--scale-factor));
        cursor: pointer;
        display: flex;
        font-size: calc(2.2rem * var(--scale-factor));
        gap: calc(1rem * var(--scale-factor));
        padding: calc(1rem * var(--scale-factor)) calc(1.5rem * var(--scale-factor));
        transition: all 0.2s ease;
        user-select: none;

        &:focus,
        &:hover {
            background-color: #E6E6E6;
        }
    }
    
    .option-text {
        color: #2E2D2C;
        inset-block-start: calc(.3rem * var(--scale-factor));
        position: relative;
    }

    input[type="radio"] {
        accent-color: currentColor;
        block-size: calc(20px * var(--scale-factor));
        cursor: pointer;
        inline-size: calc(20px * var(--scale-factor));
        margin: 0;
    }
    
    .submit-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    
    .feedback {
        align-items: center;
        background-color: #fff;
        border-radius: calc(3.7rem * var(--scale-factor));
        display: flex;
        flex-direction: column;
        inset: 0;
        justify-content: center;
        position: absolute;
        block-size: calc(90rem * var(--scale-factor));
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        padding-block: calc(4rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
        box-sizing: border-box;
    }
    
    .feedback-content {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: calc(2rem * var(--scale-factor));
        justify-content: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .feedback-content svg {
        block-size: calc(39.6rem * var(--scale-factor));
        inline-size: calc(39.6rem * var(--scale-factor));
    }

    .points {
        color: #2E2D2C;
        font-size: calc(9.1rem * var(--scale-factor));
        font-weight: 600;
        padding-block-start: calc(3.5rem * var(--scale-factor));
    }
</style> 