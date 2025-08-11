<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Question } from '$lib/types/game3';
    
    export let question: Question;
    export let showFeedback = false;
    export let isCorrect: boolean | null = null;
    export let currentQuestionNumber: number;
    export let totalQuestions: number;
    export let showQuestion = true;
    
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

    // Ensure no animation when question is not being displayed
    $: if (!question) {
        isEntering = false;
    }

    $: imageUrl = question?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRkY1QkFGIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TWF6ZSBDaGFsbGVuZ2U8L3RleHQ+Cjwvc3ZnPgo=';
</script>

<span class="question-counter">{currentQuestionNumber} of {totalQuestions}</span>
<div class="question-container" class:entering={!showFeedback && isEntering}>
   
    <div style:visibility={showQuestion ? 'visible' : 'hidden'}>
        <div class="question-header">
            <h2 class="question-title">{question.question}</h2>
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
    </div>
    
    <div class="feedback" style:display={showFeedback ? 'flex' : 'none'}>
        <div class="feedback-content">
            {#if isCorrect}
                <svg width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M420 210C420 94.0202 325.98 0 210 0C94.0202 0 0 94.0202 0 210C0 325.98 94.0202 420 210 420C325.98 420 420 325.98 420 210Z" fill="#00A865"/>
                    <path d="M110.77 221.12L169.51 279.86L309.23 140.14" stroke="white" stroke-width="50" stroke-miterlimit="10" stroke-linecap="round"/>
                </svg>
            {:else}
                <svg width="396" height="396" viewBox="0 0 396 396" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M396 198C396 88.6592 307.341 0 198 0C88.6592 0 0 88.6592 0 198C0 307.341 88.6592 396 198 396C307.341 396 396 307.341 396 198Z" fill="#FF3000"/>
                    <path d="M137.509 258.232L258.492 137.249" stroke="white" stroke-width="62.174" stroke-miterlimit="10" stroke-linecap="round"/>
                    <path d="M137.509 137.249L258.492 258.232" stroke="white" stroke-width="62.174" stroke-miterlimit="10" stroke-linecap="round"/>
                </svg>
            {/if}
        </div>
    </div>
    
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
        block-size: auto;
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        opacity: 1;
        padding-block: calc(4rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
        position: relative;
        transform: scale(1) translateY(0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-sizing: border-box;
    }
    
    .question-container.entering {
        opacity: 0;
        transform: scale(0.95) translateY(1rem);
    }

    .question-header {
        padding-inline: calc(6.5rem * var(--scale-factor));
        margin-block-end: 0;
    }

    .question-title {
        block-size: calc(20rem * var(--scale-factor));
        color: #FF5BAF;
        font-size: calc(4.6rem * var(--scale-factor));
        font-weight: 600;
        line-height: normal;
        margin-block-end: 0;
        padding-inline: 0;
        text-align: start;
    }
    
    .question-image {
        inline-size: 100%;
        margin-block-end: 0;
        max-block-size: calc(30rem * var(--scale-factor));
        object-fit: cover;
    }
    
    .question-options {
        padding-block-start: calc(4rem * var(--scale-factor));
        padding-inline: calc(4rem * var(--scale-factor));
    }

    .options {
        display: inline-flex;   
        flex-direction: column;
        margin-block-end: calc(3rem * var(--scale-factor));
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
        white-space: nowrap;
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
        inline-size: 100%;
        block-size: 100%;
    }
    
    .feedback-content {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
    }

    .feedback-content svg {
        block-size: calc(39.6rem * var(--scale-factor));
        inline-size: calc(39.6rem * var(--scale-factor));
    }

    /* Mobile Media Query - Up to 932px */
    @media (max-width: 932px) {
        .question-container {
            block-size: 100%;
            max-inline-size: 100%;
            padding-block: 1.5rem .6rem;
            padding-inline: 2rem;
        }

        .question-header {
            margin-block-end: .5rem;
        }

        .question-header,
        .question-options {
            padding: 0;
        }

       .question-title {
            block-size: auto;
            font-size: 2.1rem;
            font-weight: 600;
            line-height: 2.5rem;
       }

        .question-counter {
            display: none;
        }
        
        .question-image {
            max-block-size: 9.5rem;
            margin-block-end: 0;
            inline-size: auto;
        }

        .options {
            margin-block-end: 0;
        }

        .option {
            font-size: 1.6rem;
            padding: .5rem 1rem;
        }

        .option-text {
            white-space: normal;
        }
        
        // .feedback {
        //     height: 50rem;
        // }

        .submit-button {
            font-size: 2rem;
            font-weight: 600;
            inset-block-end: .6rem;
            inset-inline-end: .6rem;
            position: absolute;
        }
    }
</style> 