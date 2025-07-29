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
                Send
            </button>
        </div>
    {/if}

    {#if showFeedback}
        <div class="feedback">
            <div class="feedback-content">
                {#if isCorrect}
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
</div>

<style>
    .question-counter {
        color: #fff;
        display: block;
        font-size: 2rem;
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        padding-block-end: 1.5rem;
        padding-inline-end: calc(4rem * var(--scale-factor));
        text-align: end
    }

    .question-container {
        background-color: #fff;
        border-radius: 0 calc(3.5rem * var(--scale-factor));  
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
        margin-block-end: 2rem;
    }

    .question-title {
        color: #FF7000;
        font-size: calc(4.6rem * var(--scale-factor));
        font-weight: 600;
        margin-block-end: 0;
        padding-inline: 0;
        text-align: start;
    }
    
    .question-image {
        margin-block-end: 0;
        max-block-size: 30rem;
        margin-inline: auto;
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
        border-radius: 1.5rem;
        cursor: pointer;
        display: flex;
        font-size: calc(2.2rem * var(--scale-factor));
        gap: 1rem;
        padding: 1rem 1.5rem;
        transition: all 0.2s ease;
        user-select: none;

        &:focus,
        &:hover {
            background-color: #E6E6E6;
        }
    }
    
    .option-text {
        color: #2E2D2C;
        inset-block-start: .1rem;
        position: relative;
    }

    input[type="radio"] {
        accent-color: #2E2D2C;
        block-size: 2rem;
        cursor: pointer;
        inline-size: 2rem;
        margin: 0;
        appearance: none;
        border: 0.2rem solid #ccc;
        border-radius: 50%;
        background-color: white;
        position: relative;

        &:checked {
            background-color: #2E2D2C;
            border-color: #2E2D2C;
        }
    }
    
    .submit-button {
        border-radius: 0 1.7rem;
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

    /* Mobile Media Query - Up to 932px */
    @media (max-width: 932px) {
        .feedback {
            block-size: calc(53rem * var(--scale-factor));
            padding-block: 2rem 2rem;
        }
    }
    
    .feedback-content {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .feedback-content svg {
        block-size: calc(39.6rem * var(--scale-factor));
        inline-size: calc(39.6rem * var(--scale-factor));
    }

    /* Mobile Media Query - Up to 932px */
    @media (max-width: 932px) {
        .question-header {
            padding-inline: 2rem;
            margin-block-end: 1rem;
        }

        .question-title {
            font-size: calc(3.5rem * var(--scale-factor));
        }

        .question-options {
            padding-block-start: 1rem;
            padding-inline: 2rem;
        }

        .question-image {
            margin-block-end: 0;
            max-block-size: 30rem;
            margin-inline: auto;
        }

        .question-container {
            padding-block-start: 2rem;
            padding-block-end: 2rem;
            block-size: calc(53rem * var(--scale-factor));
        }

        .options {
            margin-block-end: 1rem;
        }

        .feedback-content svg {
            block-size: calc(24.948rem * var(--scale-factor));
            inline-size: calc(24.948rem * var(--scale-factor));
        }
    }
</style> 