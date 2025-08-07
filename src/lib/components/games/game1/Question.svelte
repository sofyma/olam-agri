<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Question } from '$lib/types/game1';
    
    export let question: Question;
    export let showFeedback = false;
    export let isCorrect: boolean | null = null;
    export let questionType: 'brand' | 'place' = 'brand';
    export let currentQuestionNumber: number;
    export let totalQuestions: number;
    export let shouldAnimate = true;
    export let hideCounter = false;
    
    let selectedAnswer: string | null = null;
    let isSubmitting = false;
    let isEntering = false;
    let previousQuestionId: number | null = null;
    let questionContainerHeight = 0;
    let questionContainerRef: HTMLElement | undefined;
    
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
    $: if (question && !showFeedback) {
        selectedAnswer = null;
        isSubmitting = false;
        
        // Only trigger entering animation if this is a different question
        if (previousQuestionId && previousQuestionId !== question.id && shouldAnimate) {
            isEntering = true;
            setTimeout(() => {
                isEntering = false;
            }, 20); // Faster animation
        }
        
        previousQuestionId = question.id;
        
        // Measure the height of the question container with longer delay for proper rendering
        setTimeout(() => {
            if (questionContainerRef) {
                questionContainerHeight = questionContainerRef.offsetHeight;
                console.log('🔍 HEIGHT MEASURED:', {
                    height: questionContainerHeight,
                    questionId: question.id,
                    questionType: questionType
                });
            }
        }, 100); // Longer delay to ensure question is fully rendered
    }

    $: imageUrl = question?.image || '';
</script>

{#if !hideCounter}
	<span class="question-counter">{currentQuestionNumber} of {totalQuestions}</span>
{/if}

<div class="question-wrapper" style="--dynamic-height: {questionContainerHeight > 0 ? questionContainerHeight + 'px' : 'auto'};">
	<!-- Question is always in DOM, but hidden during feedback -->
	<div class="question-container" 
		 class:entering={isEntering && shouldAnimate} 
		 class:hidden={showFeedback}
		 bind:this={questionContainerRef}>
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
				class:place-image={questionType === 'place'}
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
	
	<!-- Feedback overlay -->
	{#if showFeedback}
		<div class="feedback-overlay" style="--dynamic-height: {questionContainerHeight}px;">
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
		</div>
	{/if}
</div>

<style lang="scss">
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

    .question-wrapper {
        position: relative;
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        height: auto; /* Default for mobile */
    }

    /* Desktop only - apply dynamic height */
    @media (min-width: 1024px) {
        .question-wrapper {
            height: var(--dynamic-height, auto);
        }
    }

    .question-container {
        background-color: #fff;
        border-radius: 0 calc(3.5rem * var(--scale-factor));  
        //block-size: calc(90rem * var(--scale-factor));    
        block-size: auto;
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        opacity: 1;
        padding-block: calc(4rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
        position: relative;
        transform: scale(1) translateY(0);
        transition: all 0.1s ease; // Faster transition
    }

    .question-container.hidden {
        opacity: 0;
        pointer-events: none;
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

        .place-image {
            inline-size: 100%;
            object-fit: cover;
            object-position: center top;
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
        padding-block: 1rem;
        padding-inline: 1.5rem;
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
        margin-block: 0;
        margin-inline: 0;
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
    
    .feedback-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background-color: #fff;
        border-radius: 0 calc(3.5rem * var(--scale-factor));
        height: auto; /* Default for mobile */
    }

    /* Desktop only - apply dynamic height to feedback overlay */
    @media (min-width: 1024px) {
        .feedback-overlay {
            height: var(--dynamic-height, auto);
        }
    }

    .feedback {
        align-items: center;
        background-color: #fff;
        border-radius: 0 calc(3.5rem * var(--scale-factor));
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        max-inline-size: calc(105.2rem * var(--scale-factor));
        margin-inline: auto;
        padding-block: calc(4rem * var(--scale-factor)) calc(5rem * var(--scale-factor));
        box-sizing: border-box;
        height: 100%;
        min-height: 100%;
    }

    /* Mobile Media Query - Up to 932px */
    @media (max-width: 932px) {
        .feedback {
            block-size: auto;
            min-block-size: 100%;
            border-radius: 0 1.5rem 1.5rem 1.5rem;
            padding-block: 2rem 2rem;
        }
    }
    
    .feedback-content {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        inline-size: 100%;
        min-block-size: 100%;
        box-sizing: border-box;
    }

    .feedback-content svg {
        block-size: calc(39.6rem * var(--scale-factor));
        inline-size: calc(39.6rem * var(--scale-factor));
    }

    /* Mobile Media Query - Up to 932px */
    @media (max-width: 932px) {
        .question-counter {
            display: none; /* Hide counter on mobile since it's now in the parent */
        }

        .question-header {
            display: none;
            padding-inline: 2rem;
            margin-block-end: 1rem;
        }

        .question-title {
            font-size: calc(3.5rem * var(--scale-factor));
        }

        .question-options {
            padding-block: 1.2rem;
        padding-inline: 1.2rem;
        }

        .option {
            padding-block: .5rem;
        padding-inline: 1rem;
        }

        .question-image {
            border-radius: 0 1.5rem 0 0;
            margin-block-end: 0;
            max-block-size: 15rem;
            margin-inline: auto;
        }

        .question-container {
            padding-block-start: 0;
            padding-block-end: 0;
            //block-size: calc(53rem * var(--scale-factor));
            block-size: auto;
        }

        .options {
            margin-block-end: 1rem;
        }

        .submit-button {
            font-weight: 600;
        }

        .feedback-content svg {
            block-size: calc(24.948rem * var(--scale-factor));
            inline-size: calc(24.948rem * var(--scale-factor));
        }
    }

    @media(max-width: 300px) {
        .question-image {
            max-block-size: 8rem;
        }
    }
</style> 