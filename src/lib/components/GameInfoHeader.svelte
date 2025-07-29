<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import Game1Logo from '$lib/components/svgs/Game1Logo.svelte';
</script>

<header class="header">
  <div class="wrapper">
    <div class="row">
      <div class="column">
        {#if $authStore.isAuthenticated}
          <a href="/" class="logo-link">
            <Game1Logo />
          </a>
        {:else}
          <Game1Logo />
        {/if}
      </div>
      <div class="column">
        <nav class="navigation">
          <ul class="navigation-list">
            <li class="navigation-item">
              <a class="navigation-link" href="/terms">Terms</a>
            </li>
            <li class="navigation-item">
              <a class="navigation-link btn" href="/ranking">Ranking</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <h1 class="header-title">Brand Heroes</h1>
    <img class="header-heroes" src="/images/oa-site-small-header-heroes.png" alt="Brand Heroes">
  </div>
</header>

<style lang="scss">
.header {
  background-image: url('/images/oa-site-small-header-background.jpg');
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
  block-size: calc(53.5rem * var(--scale-factor));
  padding-block-start: calc(7rem * var(--scale-factor));
  position: relative;

  &-heroes {
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    max-inline-size: 74rem;
  }

  &-title {
    color: #FFF;
    font-size: calc(8rem * var(--scale-factor));
    font-weight: 600;
    line-height: normal;
    padding-block-start: 1.5rem;
    position: relative;
    z-index: 10;
  }

  :global(.logo path) {
    fill: #FFF;
  }

  .logo-link {
    text-decoration: none;
    display: inline-block;
    transition: opacity 0.2s ease;
    &:hover { opacity: 0.8; }
  }

  .wrapper {
    max-inline-size: calc(142rem * var(--scale-factor));
    margin-inline: auto;
  }

  .row {
    align-items: center;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 10;
  }

  .navigation {
    &-list {
      align-items: center;
      display: flex;
      gap: calc(3rem * var(--scale-factor));
    }
    &-link {
      color: #000;
      font-size: 1.8rem;
      font-weight: 600;
      line-height: normal;
    }
  }
  .btn {
    align-items: center;
    background-color: #fff;
    block-size: 3.2rem;
    border-radius: 0 1.5rem;
    display: flex;
    inline-size: 11.1rem;
  }
}

@media (max-width: 932px) {
  .logo-link {
    inline-size: 80%;
  }
  
  .wrapper {
    padding-inline: 2rem;
  }
}
</style> 