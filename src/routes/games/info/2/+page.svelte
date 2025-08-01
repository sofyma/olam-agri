<script lang="ts">
  import GameInfoHeader from '$lib/components/GameInfoHeader.svelte';
  import PlaySection from '$lib/components/PlaySection.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<GameInfoHeader />

<main class="content">
  <div class="game2-info__indicator"><span class="game2-info__indicator-number">2</span></div>
  <div class="wrapper">
    <div class="content-wrapper">
      <h1 class="game2-info__main-title">Our Brand Name<br />& Logo</h1>
      <section class="game2-info__section">
        <h2 class="game2-info__section-title">Our name and logo are the face of our brand</h2>
        <p class="game2-info__section-paragraph">Let's use them right</p>
        <img class="game2-info__image--first" src="/images/content-2_1.png" alt="Our name and logo are the face of our brand">
        <hr class="game2-info__divider" />
        <h2 class="game2-info__section-title">Our Name</h2>
        <p class="game2-info__section-paragraph game2-info__section-paragraph--bold">We are Olam Agri.</p>
        <p class="game2-info__section-paragraph"><span class="game2-info__bold-text">Not "Olam" →</span> Olam Agri is a distinct entity. Following the completion of transaction to become majority owned by SALIC, we will no longer be part of Olam Group. It's critical to ensure we enforce our identity and only use Olam Agri branded materials. We shouldn't use any materials with 'Olam'.</p>
        <p class="game2-info__section-paragraph"><span class="game2-info__bold-text">Not "Olam Global Agri" or "OGA" →</span> Those are legally entity names and its abbreviation. Use the legally entity name only at legal documents.</p>
        <img class="game2-info__logo-guidelines-image" src="/images/content-2_2.png" alt="Our Name">
        <hr class="game2-info__divider" />
        <h2 class="game2-info__section-title">Our Logo</h2>
        <p class="game2-info__section-paragraph"><span class="game2-info__bold-text">It's our most prized asset.</span> Use it correctly:</p>
        <div class="game2-info__logo-section-row">
          <div class="game2-info__logo-section-column">
            <p class="game2-info__section-paragraph game2-info__section-paragraph--bold">1. Apply the right version</p>
            <ul class="game2-info__list">
              <li><span class="game2-info__bold-text"><svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> Primary</span> → for white or light backgrounds.</li>
              <li><span class="game2-info__bold-text"><svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> Alternative</span> → for dark grey if no other colour applied or if orange accent.</li>
              <li><span class="game2-info__bold-text"><svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> White-out</span> → for primary colours, images or dark grey (unless there's orange accent)</li>
            </ul>
            <p class="game2-info__section-paragraph game2-info__section-paragraph--bold">Use only the versions from the <a href="https://olamagri.workvivo.com/" target="_blank" class="game2-info__brand-hub-link">Brand Hub</a> - no edits, no distortions.</p>
          </div>
          <div class="game2-info__logo-section-column">
            <img class="game2-info__logo-section-image" src="/images/content-2_3.png" alt="Apply the right version">
          </div>
        </div>
        <div class="game2-info__logo-section-row">
          <div class="game2-info__logo-section-column">
            <img class="game2-info__logo-section-image" src="/images/content-2_4.png" alt="Never use just the symbol alone">
          </div>
          <div class="game2-info__logo-section-column">
            <p class="game2-info__section-paragraph game2-info__section-paragraph--bold">2. Never use just the symbol alone</p>
            <p class="game2-info__section-paragraph">Always use the full logo from the Brand Hub.</p>
          </div>
        </div>
        <div class="game2-info__logo-section-row">
          <div class="game2-info__logo-section-column">
            <p class="game2-info__section-paragraph game2-info__section-paragraph--bold">3. Give it space</p>
            <p class="game2-info__section-paragraph">Leave clear space around it, at least the height of the "O" in the logo.</p>
          </div>
          <div class="game2-info__logo-section-column">
            <img class="game2-info__logo-section-image" src="/images/content-2_5.png" alt="Give it space">
          </div>
        </div>
        <div class="game2-info__logo-section-row">
          <div class="game2-info__logo-section-column">
            <img class="game2-info__logo-section-image" src="/images/content-2_6.png" alt="Place it top left">
          </div>
          <div class="game2-info__logo-section-column">
            <p class="game2-info__section-paragraph game2-info__section-paragraph--bold">4. Place it top left</p>
          </div>
        </div>
      </section>
      <PlaySection imageSrc="/images/content-play-2.png" gameLink="/games/game2" color="#8E75F8" />
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

.game2-info__indicator {
  align-items: center;
  background: #8E75F8;
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

.game2-info__indicator-number {
  font-size: calc(9rem * var(--scale-factor));
  line-height: 125%;
  position: relative;
  top: 0.5rem;
}

.game2-info__main-title {
  color: #8E75F8;
  font-size: calc(7.5rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  padding-block-start: calc(6rem * var(--scale-factor));
  text-align: center;
}

.game2-info__section {
  padding-block-end: 0;
}

.game2-info__section-title {
  color: #8E75F8;
  font-size: calc(4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
}

.game2-info__section-title:first-of-type {
  padding-block-start: calc(8rem * var(--scale-factor));
}

.game2-info__section-title:nth-of-type(2) {
  padding-block-end: calc(3rem * var(--scale-factor));
}

.game2-info__section-paragraph {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-weight: 400;
  line-height: 125%;
  margin-block: 0;
}

.game2-info__section-paragraph--bold {
  font-weight: 600;
}

.game2-info__section-paragraph:first-of-type {
  padding-block-start: 2rem;
}

.game2-info__section-paragraph:nth-of-type(3) {
  padding-block-start: 2rem;
}

.game2-info__section-paragraph:nth-of-type(4) {
  padding-block-start: 2rem;
}

.game2-info__section-paragraph:last-of-type {
  padding-block-start: 2rem;
}

.game2-info__bold-text {
  display: inline-flex;
  font-weight: 600;
  gap: 1.2rem;
}

.game2-info__logo-guidelines-image {
  display: block;
  margin-block-start: calc(6.3rem * var(--scale-factor));
}

.game2-info__logo-section-row {
  align-items: center;
  display: grid;
  gap: calc(3.6rem * var(--scale-factor));
  grid-template-columns: repeat(2, 1fr);
  margin-block: calc(4rem * var(--scale-factor));
}

.game2-info__logo-section-row:last-of-type {
  margin-block-end: 0;
}

.game2-info__logo-section-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.game2-info__logo-section-image {
  block-size: auto;
  display: block;
  margin-inline: auto;
}

.game2-info__brand-hub-link {
  color: #FF7000;
  text-decoration: underline;
}

:global(.play-section) {
  margin-block-start: calc(13rem * var(--scale-factor));
}

.game2-info__image--first {
  display: block;
  margin-block-start: calc(5rem * var(--scale-factor));
}

.game2-info__divider {
  background: #999;
  block-size: 0.2rem;
  border: none;
  inline-size: 100%;
  margin-block: calc(8rem * var(--scale-factor));
}

.game2-info__list {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-block-start: 2rem;
}

.game2-info__list li {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  margin-block-end: 1.5rem;
}

@media (max-width: 932px) {
  .content {
    margin-block-start: 0;
  }
  .game2-info__main-title {
    padding-block-start: 0;
  }
  .wrapper {
    padding-inline: 2rem;
  }
  .game2-info__indicator {
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
  .game2-info__indicator-number {
    font-size: calc(5.5rem * var(--scale-factor));
  }
}
</style> 