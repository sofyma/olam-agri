<script lang="ts">
  export let imageSrc: string;
  export let gameLink: string;
  export let color: string = '#FF7000';
</script>

<section class="play-section">
  <div class="play-wrapper">
    <h2 class="play-title" style="color: {color}">It's time to Play!</h2>
    <p class="play-paragraph">Play the game related to this topic to prove you are a true Brand Hero!</p>
    <a href={gameLink} class="play-image-link">
      <img class="play-image" src={imageSrc} alt="Play Game">
    </a>
  </div>
</section>

<style lang="scss">
  .play-section {
    background: #2E2D2C;
    block-size: 100%;
    inline-size: 100%;
    padding-block: calc(10rem * var(--scale-factor));
    padding-inline: calc(2rem * var(--scale-factor));
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }

  .play-wrapper {
    inline-size: 100%;
    margin-inline: auto;
    max-inline-size: calc(98rem * var(--scale-factor));
  }

  .play-title {
    font-size: calc(6rem * var(--scale-factor));
    font-weight: 600;
    line-height: 125%;
  }

  .play-paragraph {
    color: #FFF;
    font-size: calc(2.4rem * var(--scale-factor));
    font-weight: 400;
    line-height: 150%;
    padding-block-start: calc(2rem * var(--scale-factor));
  }

  .play-image {
    block-size: auto;
    inline-size: 100%;
    max-inline-size: 100%;
    margin-block-start: calc(5rem * var(--scale-factor));
  }

  .play-image-link {
    display: block;
    text-decoration: none;
  }
</style> 