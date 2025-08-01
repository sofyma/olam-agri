<script lang="ts">
  import GameInfoHeader from '$lib/components/GameInfoHeader.svelte';
  import PlaySection from '$lib/components/PlaySection.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<GameInfoHeader />

<main class="content">
  <div class="game5-info__indicator"><span class="game5-info__indicator-number">5</span></div>
  <div class="wrapper">
    <div class="content-wrapper">
      <h1 class="game5-info__main-title">The<br />Brand Hub</h1>
      <section class="game5-info__section">
        <p class="game5-info__section-paragraph game5-info__section-paragraph--bold">The Brand Hub is the place to go for all things brand-related.</p>
        <p class="game5-info__section-paragraph">Access it anytime via <a href="https://olamagri.workvivo.com/" target="_blank" class="game5-info__brand-hub-link">The Loop</a>.</p>
        <img class="game5-info__image" src="/images/content-5_1.png" alt="Brand Hub">
        <hr class="game5-info__divider" />
        <h2 class="game5-info__section-title">Inside you'll find</h2>
        <ul class="game5-info__list">
          <li><span class="game5-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Brand guidelines</li>
          <li><span class="game5-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Official logos and fonts</li>
          <li><span class="game5-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Templates for presentations, email signature, business cards, Teams backgrounds, email comms, etc.</li>
          <li><span class="game5-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Corporate collaterals like factsheet and presentation</li>
          <li><span class="game5-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Marketing collaterals like posters, ads, roller banners, etc.</li>
        </ul>
        <img class="game5-info__image" src="/images/content-5_2.png" alt="Brand Hub content">
        <hr class="game5-info__divider" />
        <h2 class="game5-info__section-title">No design skills? We've got you covered</h2>
        <p class="game5-info__section-paragraph">All templates are plug & play — ready to use, no need to start from scratch.</p>
        <p class="game5-info__section-paragraph game5-info__section-paragraph--bold">Fast. Consistent. On-brand.</p>
      </section>
      <PlaySection imageSrc="/images/content-play-5.png" gameLink="/games/game5" color="#00B2E7" />
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

.game5-info__indicator {
  align-items: center;
  background: #00B2E7;
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

.game5-info__indicator-number {
  font-size: calc(9rem * var(--scale-factor));
  line-height: 125%;
  position: relative;
  top: 0.5rem;
}

.game5-info__main-title {
  color: #00B2E7;
  font-size: calc(7.5rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  padding-block-start: calc(6rem * var(--scale-factor));
  text-align: center;
}

.game5-info__section {
  display: flex;
  flex-direction: column;
  padding-block-end: 0;
}

.game5-info__section-title {
  color: #00B2E7;
  font-size: calc(4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
}

.game5-info__section-title:first-of-type {
  padding-block-start: 0;
}

.game5-info__section-paragraph {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  margin-block: 0;
}

.game5-info__section-paragraph--bold {
  font-weight: 600;
}

.game5-info__section-paragraph:first-of-type {
  padding-block-start: calc(8rem * var(--scale-factor));
}

.game5-info__section-paragraph:nth-of-type(2) {
  padding-block-start: 2rem;
}

.game5-info__section-paragraph:nth-of-type(3) {
  padding-block-start: 2rem;
}

.game5-info__section-paragraph:nth-of-type(4) {
  padding-block-start: 2rem;
}

.game5-info__image {
  block-size: auto;
  display: block;
  inline-size: 100%;
}

.game5-info__image:first-of-type {
  margin-block-start: calc(5.1rem * var(--scale-factor));
}

.game5-info__image:last-of-type {
  margin-block-start: calc(6.1rem * var(--scale-factor));
}

.game5-info__bold-text {
  display: inline-flex;
  font-weight: 600;
  gap: 1.2rem;
}

.game5-info__divider {
  background: #999;
  block-size: 0.2rem;
  border: none;
  inline-size: 100%;
  margin-block: calc(8rem * var(--scale-factor));
}

.game5-info__list {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  padding-block-start: 2rem;
}

.game5-info__list li {
  align-items: center;
  color: #2E2D2C;
  display: flex;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  gap: 1.2rem;
  line-height: 125%;
}

.game5-info__list-icon {
  align-items: center;
  display: flex;
  justify-content: center;
}

.game5-info__brand-hub-link {
  color: #FF7000;
  text-decoration: underline;
}

:global(.play-section) {
  margin-block-start: calc(13rem * var(--scale-factor));
}

@media (max-width: 932px) {
  .content {
    margin-block-start: 0;
  }
  .game5-info__main-title {
    padding-block-start: 0;
  }
  .wrapper {
    padding-inline: 2rem;
  }
  .game5-info__indicator {
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
  .game5-info__indicator-number {
    font-size: calc(5.5rem * var(--scale-factor));
  }
  .game5-info__image {
    max-inline-size: 100%;
  }
}
</style> 