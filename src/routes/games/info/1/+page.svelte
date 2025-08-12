<script lang="ts">
  import GameInfoHeader from '$lib/components/GameInfoHeader.svelte';
  import PlaySection from '$lib/components/PlaySection.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<GameInfoHeader />

<main class="content">
  <div class="game1-info__indicator"><span class="game1-info__indicator-number">1</span></div>
  <div class="wrapper">
    <div class="content-wrapper">
      <h1 class="game1-info__main-title">The Importance<br />of Brand</h1>
      <section class="game1-info__section">
        <h2 class="game1-info__section-title">What's a brand?</h2>
        <p class="game1-info__section-paragraph">It's not just a logo or a name. It's everything people see, hear and feel about a company.</p>
        <img class="game1-info__image" src="/images/content-1_1.jpg" alt="What's a brand?" style="max-inline-size: calc(83.3rem * var(--scale-factor))">
        <p class="game1-info__section-paragraph game1-info__section-paragraph--bold">It's what makes people remember it, trust it… and choose it.</p>
        <hr class="game1-info__divider" />
        <h2 class="game1-info__section-title">Why is a brand important?</h2>
        <p class="game1-info__section-paragraph game1-info__section-paragraph--bold">A strong brand helps a company:</p>
        <ul class="game1-info__list">
          <li><span class="game1-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Be recognised</li>
          <li><span class="game1-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Build trust</li>
          <li><span class="game1-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Grow the business</li>
        </ul>
        <p class="game1-info__section-paragraph game1-info__section-paragraph--bold">That's why it's key to apply a brand correctly and consistently, both internally and externally</p>
        <img class="game1-info__image" src="/images/content-1_2.jpg" alt="Brand application" style="max-inline-size: calc(40.9rem * var(--scale-factor))">
      </section>
      <PlaySection imageSrc="/images/content-play-1.png" gameLink="/games/game1" color="#FF7000" />
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
    margin-inline: auto;
    max-inline-size: calc(128rem * var(--scale-factor));
    padding-block: calc(5rem * var(--scale-factor)) calc(13rem * var(--scale-factor));
  }

  .content-wrapper {
    inline-size: 100%;
    margin-inline: auto;
    max-inline-size: calc(98rem * var(--scale-factor));
  }
}

.game1-info__indicator {
  align-items: center;
  background: #FF7000;
  block-size: 10.5rem;
  border-radius: 0 calc(2.5rem * var(--scale-factor));
  color: #FFF;
  display: flex;
  flex-direction: column;
  font-size: calc(9rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  inline-size: 10.5rem;
  inset-block-start: calc(-5.25rem * var(--scale-factor));
  inset-inline-start: 50%;
  justify-content: center;
  line-height: 125%;
  position: absolute;
  text-align: center;
  transform: translateX(-50%);
  z-index: 10;
}

.game1-info__indicator-number {
  font-size: calc(9rem * var(--scale-factor));
  line-height: 125%;
  position: relative;
  top: 0.5rem;
}

.game1-info__main-title {
  color: #FF7000;
  font-size: calc(7.5rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  padding-block-start: 6rem;
  text-align: center;
}

.game1-info__section {
  padding-block-end: 0;
}

.game1-info__section-title {
  color: #FF7000;
  font-size: calc(4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
}

.game1-info__section-title:first-of-type {
  padding-block-start: calc(8rem * var(--scale-factor));
}

.game1-info__section-paragraph {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  margin-block: 0;
}

.game1-info__section-paragraph--bold {
  font-weight: 600;
}

.game1-info__section-paragraph:first-of-type {
  padding-block-start: 2rem;
}

.game1-info__section-paragraph:nth-of-type(3) {
  padding-block-start: 2rem;
}

.game1-info__section-paragraph:last-of-type {
  padding-block-start: 2rem;
}

.game1-info__image {
  block-size: auto;
  display: block;
  inline-size: 100%;
  object-fit: contain;
}

.game1-info__image:first-of-type {
  margin-block: calc(5.7rem * var(--scale-factor));
}

.game1-info__image:last-of-type {
  margin-block-start: calc(4.5rem * var(--scale-factor));
}

.game1-info__divider {
  background: #999;
  block-size: 0.2rem;
  border: none;
  inline-size: 100%;
  margin-block: calc(8rem * var(--scale-factor));
}

.game1-info__list {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  padding-block-start: 2rem;
}

.game1-info__list li {
  align-items: center;
  color: #2E2D2C;
  display: flex;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  gap: 1.2rem;
  line-height: 125%;
}

.game1-info__list-icon {
  align-items: center;
  display: flex;
  justify-content: center;
}

:global(.play-section) {
  margin-block-start: calc(13rem * var(--scale-factor));
}

@media (max-width: 932px) {

  .game1-info__section-paragraph:first-of-type {
    padding-block-start: 0;
  }

  .game1-info__section-paragraph:nth-of-type(3) {
    padding-block-start: 0;
  }

  .content {
    margin-block-start: 0;
  }
  .game1-info__main-title {
    padding-block-start: 0;
  }
  .wrapper {
    padding-inline: 2rem;
  }
  .game1-info__indicator {
    block-size: 7rem;
    font-size: calc(5.5rem * var(--scale-factor));
    font-weight: 600;
    inline-size: 7rem;
    inset-block-start: auto;
    inset-inline-start: auto;
    margin-block-start: calc(5rem * var(--scale-factor));
    margin-inline: auto;
    position: static;
    transform: none;
  }
  .game1-info__indicator-number {
    font-size: calc(5.5rem * var(--scale-factor));
  }
  .game1-info__image {
    max-inline-size: 100%;
  }
}
</style> 