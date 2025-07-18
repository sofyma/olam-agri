<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<div class="info-container">
    <div class="info-content">
        <div class="header">
            <h1 class="title">Game 5: Only the Fastest Will Reach the Sky</h1>
            <div class="game-id">
                <span class="text">Game</span>
                <span class="number">5</span>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <h2 class="section-title">About This Challenge</h2>
                <p class="paragraph">
                    This is a time-sensitive challenge that tests your knowledge of the Brand Hub and your ability to find specific information quickly.
                </p>
                <p class="paragraph">
                    You'll need to locate the Brand Guidelines document in the Brand Hub and find specific words on page 4 of PDF #1.
                </p>
            </div>

            <div class="section">
                <h2 class="section-title">How to Play</h2>
                <ol class="instructions-list">
                    <li>Click the START button to begin the timer</li>
                    <li>Visit the Brand Hub using the provided link</li>
                    <li>Find the Brand Guidelines document</li>
                    <li>Look for the words in orange on page 4 of PDF #1</li>
                    <li>Type the exact answer as it appears in the document</li>
                    <li>Submit your answer and see if you're correct</li>
                </ol>
            </div>

            <div class="section">
                <h2 class="section-title">Scoring</h2>
                <ul class="scoring-list">
                    <li><strong>Correct Answer:</strong> 5 points</li>
                    <li><strong>Incorrect Answer:</strong> 0 points (but you can try again)</li>
                    <li><strong>Time:</strong> Used as a tiebreaker for the overall competition</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Important Notes</h2>
                <ul class="notes-list">
                    <li>The timer starts immediately when you click START</li>
                    <li>You have unlimited attempts to get the correct answer</li>
                    <li>The timer only stops when you submit the correct answer</li>
                    <li>Your time is saved every 5 seconds, so you won't lose progress if you accidentally close the window</li>
                    <li>Only your first successful attempt is recorded for the ranking</li>
                </ul>
            </div>

            <div class="section">
                <h2 class="section-title">Access the Brand Hub</h2>
                <p class="paragraph">
                    Click the link below to visit The Loop and access the Brand Hub:
                </p>
                <div class="link-container">
                    <a href="https://olamagri.workvivo.com/" target="_blank" class="brand-hub-link">
                        Visit The Loop - Brand Hub
                    </a>
                </div>
            </div>
        </div>

        <div class="actions">
            <button class="btn btn-cta2" on:click={() => goto('/games/game5')}>
                Start Game
            </button>
            <button class="btn btn-cta1" on:click={() => goto('/ranking')}>
                View Ranking
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    .info-container {
        background-color: #00B2E7;
        min-height: 100vh;
        padding: calc(2rem * var(--scale-factor));
    }

    .info-content {
        background-color: #fff;
        border-radius: calc(2rem * var(--scale-factor));
        padding: calc(4rem * var(--scale-factor));
        max-width: calc(80rem * var(--scale-factor));
        margin: 0 auto;
        box-shadow: 0 calc(1rem * var(--scale-factor)) calc(3rem * var(--scale-factor)) rgba(0, 0, 0, 0.2);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: calc(4rem * var(--scale-factor));
        gap: calc(2rem * var(--scale-factor));
    }

    .title {
        color: #00B2E7;
        font-size: calc(4rem * var(--scale-factor));
        font-weight: 700;
        line-height: 1.2;
        flex: 1;
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
        flex-shrink: 0;

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

    .content {
        margin-bottom: calc(4rem * var(--scale-factor));
    }

    .section {
        margin-bottom: calc(3rem * var(--scale-factor));
        
        &:last-child {
            margin-bottom: 0;
        }
    }

    .section-title {
        color: #00B2E7;
        font-size: calc(2.8rem * var(--scale-factor));
        font-weight: 600;
        margin-bottom: calc(1.5rem * var(--scale-factor));
    }

    .paragraph {
        color: #2E2D2C;
        font-size: calc(2rem * var(--scale-factor));
        line-height: 1.6;
        margin-bottom: calc(1.5rem * var(--scale-factor));
    }

    .instructions-list, .scoring-list, .notes-list {
        color: #2E2D2C;
        font-size: calc(2rem * var(--scale-factor));
        line-height: 1.6;
        padding-left: calc(2rem * var(--scale-factor));
    }

    .instructions-list li, .scoring-list li, .notes-list li {
        margin-bottom: calc(1rem * var(--scale-factor));
    }

    .link-container {
        text-align: center;
        margin-top: calc(2rem * var(--scale-factor));
    }

    .brand-hub-link {
        display: inline-block;
        background-color: #00B2E7;
        color: #fff;
        padding: calc(1.5rem * var(--scale-factor)) calc(3rem * var(--scale-factor));
        border-radius: calc(1rem * var(--scale-factor));
        text-decoration: none;
        font-size: calc(2rem * var(--scale-factor));
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover {
            background-color: #0099cc;
            transform: translateY(calc(-0.2rem * var(--scale-factor)));
        }
    }

    .actions {
        display: flex;
        gap: calc(2rem * var(--scale-factor));
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn {
        align-items: center;
        block-size: calc(3.5rem * var(--scale-factor));
        border: none;
        border-radius: 0rem 1.5rem;
        cursor: pointer;
        display: flex;
        font-size: calc(1.6rem * var(--scale-factor));
        inline-size: calc(12rem * var(--scale-factor));
        justify-content: center;
        transition: all 0.3s ease;
        font-weight: 600;
    }

    .btn-cta1 {
        background-color: #00B2E7;
        color: #fff;
        
        &:hover {
            background-color: #0099cc;
        }
    }

    .btn-cta2 {
        background-color: #fff;
        color: #00B2E7;
        border: calc(0.2rem * var(--scale-factor)) solid #00B2E7;
        
        &:hover {
            background-color: #00B2E7;
            color: #fff;
        }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .info-container {
            padding: calc(1rem * var(--scale-factor));
        }

        .info-content {
            padding: calc(2rem * var(--scale-factor));
        }

        .header {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .title {
            font-size: calc(3rem * var(--scale-factor));
            margin-bottom: calc(2rem * var(--scale-factor));
        }

        .game-id {
            block-size: calc(12rem * var(--scale-factor));
            inline-size: calc(8rem * var(--scale-factor));
        }

        .game-id .text {
            font-size: calc(2rem * var(--scale-factor));
            line-height: calc(2rem * var(--scale-factor));
        }

        .game-id .number {
            font-size: calc(9rem * var(--scale-factor));
            line-height: calc(9rem * var(--scale-factor));
        }

        .section-title {
            font-size: calc(2.4rem * var(--scale-factor));
        }

        .paragraph, .instructions-list, .scoring-list, .notes-list {
            font-size: calc(1.8rem * var(--scale-factor));
        }

        .brand-hub-link {
            font-size: calc(1.8rem * var(--scale-factor));
            padding: calc(1.2rem * var(--scale-factor)) calc(2rem * var(--scale-factor));
        }

        .actions {
            flex-direction: column;
            align-items: center;
        }

        .btn {
            width: 100%;
            max-width: calc(20rem * var(--scale-factor));
        }
    }
</style> 