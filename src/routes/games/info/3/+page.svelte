<script lang="ts">
  import GameInfoHeader from '$lib/components/GameInfoHeader.svelte';
  import PlaySection from '$lib/components/PlaySection.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<GameInfoHeader />

<main class="content">
  <div class="game3-info__indicator"><span class="game3-info__indicator-number">3</span></div>
  <div class="wrapper">
    <div class="content-wrapper">
      <h1 class="game3-info__main-title">Colours &<br />Typography</h1>
      <section class="game3-info__section">
        <p class="game3-info__section-paragraph">Our colours and typography are key to how we express who we are.</p>
        <h2 class="game3-info__section-title">Our Colours</h2>
        <p class="game3-info__section-paragraph"><span class="game3-info__bold-text">We lead with orange,</span> it reflects our spirit. It's bold, warm and vibrant.<br />Alongside this, we have a bright, eye-catching colour palette that makes us stand out from the rest!</p>
        <img class="game3-info__image" src="/images/content-3_1.png" alt="Our Colours">
        <p class="game3-info__section-paragraph game3-info__section-paragraph--bold">Find our colour codes in our brand guidelines</p>
        <img class="game3-info__image game3-info__image--second" src="/images/content-3_2.png" alt="Brand guidelines">
        <hr class="game3-info__divider" />
        <h2 class="game3-info__section-title">Our Typography</h2>
        <p class="game3-info__section-paragraph"><span class="game3-info__bold-text">We use Gilroy font.</span> Clean, modern and highly legible.</p>
        <p class="game3-info__section-paragraph">We have two variations:</p>
        <ul class="game3-info__list">
          <li><span class="game3-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span><span class="game3-info__bold-text">Gilroy SemiBold →</span> for headlines, subheadings, call to action, quotes, emphasis, etc.</li>
          <li><span class="game3-info__list-icon"> <svg width="1.8rem" height="1.6rem" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.870117 8.02218L6.76012 13.6945L16.3301 1.49805" stroke="#2E2D2C" stroke-width="2.5" stroke-miterlimit="10"/></svg> </span><span class="game3-info__bold-text">Gilroy Regular →</span> for body copy, bullet points, intros, footers, disclaimers, etc.</li>
        </ul>
        <p class="game3-info__section-paragraph game3-info__section-paragraph--bold">Please download them only from the <a href="https://olamagri.workvivo.com/" target="_blank" class="game3-info__brand-hub-link">Brand Hub</a>.</p>
        <img class="game3-info__image" src="/images/content-3_3_1.png" alt="Typography guidelines">
      </section>
      <PlaySection imageSrc="/images/content-play-3.png" gameLink="/games/game3" color="#FF3DA6" />
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

.game3-info__indicator {
  align-items: center;
  background: #FF3DA6;
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

.game3-info__indicator-number {
  font-size: calc(9rem * var(--scale-factor));
  line-height: 125%;
  position: relative;
  top: 0.5rem;
}

.game3-info__main-title {
  color: #FF3DA6;
  font-size: calc(7.5rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  padding-block-start: calc(6rem * var(--scale-factor));
  text-align: center;
}

.game3-info__section {
  display: flex;
  flex-direction: column;
  padding-block-end: 0;
}

.game3-info__section-title {
  color: #FF3DA6;
  font-size: calc(4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 600;
  line-height: 125%;
}

.game3-info__section-title:first-of-type {
  padding-block-start: calc(5.2rem * var(--scale-factor));
}

.game3-info__section-paragraph {
  color: #2E2D2C;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  margin-block: 0;
}

.game3-info__section-paragraph--bold {
  font-weight: 600;
}

.game3-info__section-paragraph:first-of-type {
  padding-block-start: calc(8rem * var(--scale-factor));
}

.game3-info__section-paragraph:nth-of-type(2) {
  padding-block-start: 2rem;
}

.game3-info__section-paragraph:nth-of-type(3) {
  padding-block-start: 0;
}

.game3-info__section-paragraph:nth-of-type(4) {
  padding-block-start: 2rem;
}

.game3-info__section-paragraph:nth-of-type(5) {
  padding-block-start: 2rem;
}

.game3-info__section-paragraph:last-of-type {
  padding-block-start: 2rem;
}

.game3-info__image {
  block-size: auto;
  display: block;
  inline-size: 100%;
}

.game3-info__image:first-of-type {
  margin-block: calc(5.7rem * var(--scale-factor));
}

.game3-info__image:last-of-type {
  margin-block-start: calc(4.5rem * var(--scale-factor));
}

.game3-info__image--second {
  margin-block-start: calc(9.1rem * var(--scale-factor));
}

.game3-info__section-paragraph:nth-of-type(6) {
  padding-block-start: 2rem;
}

.game3-info__section-paragraph:nth-of-type(7) {
  padding-block-start: 2rem;
}

.game3-info__bold-text {
  display: inline-flex;
  font-weight: 600;
  gap: 1.2rem;
}

.game3-info__divider {
  background: #999;
  block-size: 0.2rem;
  border: none;
  inline-size: 100%;
  margin-block: calc(8rem * var(--scale-factor));
}

.game3-info__list {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
  padding-block-start: 2rem;
}

.game3-info__list li {
  align-items: center;
  color: #2E2D2C;
  display: flex;
  font-size: calc(2.4rem * var(--scale-factor));
  font-style: normal;
  font-weight: 400;
  gap: 1.2rem;
  line-height: 125%;
}

.game3-info__list-icon {
  align-items: center;
  display: flex;
  justify-content: center;
}

.game3-info__brand-hub-link {
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
  .game3-info__main-title {
    padding-block-start: 0;
  }
  .wrapper {
    padding-inline: 2rem;
  }
  .game3-info__indicator {
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
  .game3-info__indicator-number {
    font-size: calc(5.5rem * var(--scale-factor));
  }
  .game3-info__image {
    max-inline-size: 100%;
  }
}
</style> 