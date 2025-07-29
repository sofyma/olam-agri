<script lang="ts">
  import GameInfoHeader from '$lib/components/GameInfoHeader.svelte';
  import PlaySection from '$lib/components/PlaySection.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<GameInfoHeader />

<main class="content">
  <div class="game6-info__indicator"><span class="game6-info__indicator-number">6</span></div>
  <div class="wrapper">
    <div class="content-wrapper">
      <h1 class="game6-info__main-title">The Brand<br />in Use</h1>
      <p class="game6-info__paragraph">Congratulations! You’ve completed all the learning topics.</p>
      <p class="game6-info__paragraph">Complete the last game so you can earn the last points you need to become a Brand Hero!</p>
      <PlaySection imageSrc="/images/content-play-6.png" gameLink="/games/game6" color="#00C853" />
    </div>
  </div>
</main>
<Footer />

<style lang="scss">
.content {
  margin-block-start: calc(-15rem * var(--scale-factor));
  position: relative;
  z-index: 1;

  .wrapper {
    background-color: #FFF;
    max-inline-size: calc(128rem * var(--scale-factor));
    margin-inline: auto;
    padding-block: calc(5rem * var(--scale-factor)) calc(13rem * var(--scale-factor));
  }

  .content-wrapper {
    inline-size: 100%;
    margin-inline: auto;
    max-inline-size: calc(98rem * var(--scale-factor));
  }
}

.game6-info__indicator {
  inline-size: 10.5rem;
  block-size: 10.5rem;
  border-radius: 0 calc(2.5rem * var(--scale-factor));
  background: #00C853;
  color: #FFF;
  text-align: center;
  font-size: calc(9rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset-block-start: calc(-5.25rem * var(--scale-factor));
  inset-inline-start: 50%;
  transform: translateX(-50%);
  z-index: 10;
  flex-direction: column;
}

.game6-info__indicator-number {
  font-size: calc(9rem * var(--scale-factor));
  line-height: 125%;
  position: relative;
  top: 0.5rem;
}

.game6-info__main-title {
  color: #00C853;
  text-align: center;
  font-size: calc(7.5rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  padding-block-start: calc(6rem * var(--scale-factor));
}

.game6-info__paragraph {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
}

.game6-info__paragraph:first-of-type {
  padding-block-start: calc(8rem * var(--scale-factor));
}

.game6-info__paragraph:last-of-type {
  padding-block-start: 2rem;
}

:global(.play-section) {
  margin-block-start: calc(13rem * var(--scale-factor));
}

@media (max-width: 932px) {
  .content {
    margin-block-start: 0;
  }
  .game6-info__main-title {
    padding-block-start: 0;
  }
  .wrapper {
    padding-inline: 2rem;
  }
  .game6-info__indicator {
    inline-size: 7rem;
    block-size: 7rem;
    font-size: calc(5.5rem * var(--scale-factor));
    font-weight: 600;
    position: static;
    transform: none;
    inset-block-start: auto;
    inset-inline-start: auto;
    margin-inline: auto;
    margin-block-start: calc(5rem * var(--scale-factor));
  }
  .game6-info__indicator-number {
    font-size: calc(5.5rem * var(--scale-factor));
  }
}
</style> 