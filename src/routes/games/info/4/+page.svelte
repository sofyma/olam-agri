<script lang="ts">
  import GameInfoHeader from '$lib/components/GameInfoHeader.svelte';
  import PlaySection from '$lib/components/PlaySection.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<GameInfoHeader />

<main class="content">
  <div class="game4-info__indicator"><span class="game4-info__indicator-number">4</span></div>
  <div class="wrapper">
    <div class="content-wrapper">
      <h1 class="game4-info__main-title">The Brand<br />in Use</h1>
      <section class="game4-info__section">
        <p class="game4-info__section-paragraph">Everything we create reflects who we are.</p>
        <p class="game4-info__section-paragraph">That's why it's essential to stay aligned, using the right elements in the right way, both internally and externally.</p>
        <h2 class="game4-info__section-title">How we sound matters</h2>
        <p class="game4-info__section-paragraph">Make it easy for our audience to take in valuable information.</p>
        <img class="game4-info__image" src="/images/content-4_1.jpg" alt="How we sound matters">
        <hr class="game4-info__divider" />
        <h2 class="game4-info__section-title">Use the official templates</h2>
        <p class="game4-info__section-paragraph">Always start from the available ones:</p>
        <ul class="game4-info__list">
          <li><span class="game4-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Presentations</li>
          <li><span class="game4-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Stationery</li>
          <li><span class="game4-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span>Marketing collaterals…</li>
        </ul>
        <img class="game4-info__image" src="/images/content-4_2.jpg" alt="Official templates">
        <hr class="game4-info__divider" />
        <h2 class="game4-info__section-title">When designing, simple rules to keep in mind</h2>
        <img class="game4-info__image" src="/images/content-4_3.jpg" alt="Design rules">
        <hr class="game4-info__divider" />
        <h2 class="game4-info__section-title">Enhance designs with brand-aligned visual elements</h2>
        
        <div class="game4-info__visual-elements">
          <div class="game4-info__element-row">
            <div class="game4-info__element-text">
              <p class="game4-info__element-title">Curved Device</p>
              <p class="game4-info__element-description">Use with images of people, products, and places, as well as applying only colour.</p>
            </div>
            <div class="game4-info__element-image">
              <img src="/images/content-4_4.jpg" alt="Curved Device">
            </div>
          </div>
          
          <div class="game4-info__element-row">
            <div class="game4-info__element-image">
              <img src="/images/content-4_5.jpg" alt="Leaf Device">
            </div>
            <div class="game4-info__element-text">
              <p class="game4-info__element-title">Leaf Device</p>
              <p class="game4-info__element-description">Use as well with images of people, products, and places, or with colour only, when the Curved Device is restrictive or has already been applied.</p>
            </div>
          </div>
          
          <div class="game4-info__element-row">
            <div class="game4-info__element-text">
              <p class="game4-info__element-title">Full Bleed Imagery</p>
              <p class="game4-info__element-description">Use when devices feel limiting or for bold impact with the image.</p>
            </div>
            <div class="game4-info__element-image">
              <img src="/images/content-4_6.jpg" alt="Full Bleed Imagery">
            </div>
          </div>
        </div>
        
        <p class="game4-info__section-paragraph game4-info__section-paragraph--bold">Follow the Brand Guidelines to apply these visual elements and download them only from the <a href="https://olamagri.workvivo.com/" target="_blank" class="game4-info__brand-hub-link">Brand Hub</a>.</p>
      </section>
      <PlaySection imageSrc="/images/content-play-4.png" gameLink="/games/game4" color="#FFB800" />
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

.game4-info__indicator {
  align-items: center;
  background: #FFB800;
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

.game4-info__indicator-number {
  font-size: calc(9rem * var(--scale-factor));
  line-height: 125%;
  position: relative;
  top: 0.5rem;
}

.game4-info__main-title {
  color: #FFB800;
  font-size: calc(7.5rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  padding-block-start: 6rem;
  text-align: center;
}

.game4-info__section {
  display: flex;
  flex-direction: column;
  padding-block-end: 0;
}

.game4-info__section-title {
  color: #FFB800;
  font-size: calc(4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
}

.game4-info__section-title:first-of-type {
  padding-block-start: calc(5.2rem * var(--scale-factor));
}

.game4-info__section-paragraph {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  margin-block: 0;
}

.game4-info__section-paragraph--bold {
  font-weight: 600;
}

.game4-info__section-paragraph:first-of-type {
  padding-block-start: calc(8rem * var(--scale-factor));
}

.game4-info__section-paragraph:nth-of-type(2) {
  padding-block-start: 2rem;
}

.game4-info__section-paragraph:nth-of-type(3) {
  padding-block-start: 2rem;
}

.game4-info__section-paragraph:nth-of-type(4) {
  padding-block-start: 2rem;
}

.game4-info__image {
  block-size: auto;
  display: block;
  inline-size: 100%;
}

.game4-info__image:first-of-type {
  margin-block-start: calc(6.6rem * var(--scale-factor));
}

.game4-info__image:last-of-type {
  margin-block-start: calc(6.1rem * var(--scale-factor));
}

.game4-info__image:nth-of-type(2) {
  margin-block-start: calc(6.1rem * var(--scale-factor));
}

.game4-info__bold-text {
  display: inline-flex;
  font-weight: 600;
  gap: 1.2rem;
}

.game4-info__divider {
  background: #999;
  block-size: 0.2rem;
  border: none;
  inline-size: 100%;
  margin-block: calc(8rem * var(--scale-factor));
}

.game4-info__list {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  padding-block-start: 2rem;
}

.game4-info__list li {
  align-items: center;
  color: #2E2D2C;
  display: flex;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  gap: 1.2rem;
  line-height: 125%;
}

.game4-info__list-icon {
  align-items: center;
  display: flex;
  justify-content: center;
}

.game4-info__brand-hub-link {
  color: #FF7000;
  text-decoration: underline;
}

.game4-info__visual-elements {
  display: flex;
  flex-direction: column;
  gap: calc(6rem * var(--scale-factor));
  margin-block-end: calc(5rem * var(--scale-factor));
  margin-block-start: calc(8rem * var(--scale-factor));
}

.game4-info__element-row {
  align-items: center;
  display: grid;
  gap: calc(3.6rem * var(--scale-factor));
  grid-template-columns: 1fr 1fr;
}

.game4-info__element-row--reversed {
  direction: rtl;
  
  > * {
    direction: ltr;
  }
}

.game4-info__element-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game4-info__element-title {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
  margin: 0;
}

.game4-info__element-description {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  margin: 0;
}

.game4-info__element-image img {
  block-size: auto;
  display: block;
  inline-size: 100%;
}

/* Game 4 info specific - PlaySection top margin */
:global(.play-section) {
  margin-block-start: calc(13rem * var(--scale-factor));
}

@media (max-width: 932px) {
  .content {
    margin-block-start: 0;
  }
  .game4-info__main-title {
    padding-block-start: 0;
  }
  .wrapper {
    padding-inline: 2rem;
  }
  .game4-info__indicator {
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
  .game4-info__indicator-number {
    font-size: calc(5.5rem * var(--scale-factor));
  }
  .game4-info__image {
    max-inline-size: 100%;
  }
  .game4-info__element-row {
    gap: 2rem;
    grid-template-columns: 1fr;
  }
  .game4-info__element-row--reversed {
    direction: ltr;
  }
}
</style> 