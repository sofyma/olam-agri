<!-- Terms.svelte -->
<script lang="ts">
  import Game1Logo from './svgs/Game1Logo.svelte';
</script>

<div class="container">
  <header class="header">
    <div class="wrapper">
      <div class="row">
        <div class="column">
          <a href="/" class="logo-link">
            <Game1Logo />
          </a>
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
    </div>

    <img class="header-heroes" src="/images/oa-site-small-header-heroes.png" alt="Brand Heroes">
  </header>
  
  <main class="content">
    <div class="wrapper">
      <div class="terms-container">
        <h2 class="terms-title">Terms</h2>
        
        <div class="terms-content">
          <h3 class="terms-subtitle">Terms and Conditions</h3>
          
          <p class="terms-paragraph">
            Welcome to the Brand Heroes competition. By participating in this competition, you agree to be bound by these terms and conditions. The competition is open to all eligible participants who register through the official platform.
          </p>
          
          <p class="terms-paragraph">
            Participants must provide accurate and truthful information during registration. Any false or misleading information may result in disqualification from the competition. All personal data collected will be handled in accordance with our privacy policy and applicable data protection laws.
          </p>
          
          <p class="terms-paragraph">
            The competition organizers reserve the right to modify these terms at any time and to disqualify participants who violate these terms. Winners will be selected based on the competition criteria and announced through the official platform. All decisions made by the organizers are final and binding.
          </p>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <img class="footer-logo" src="/images/site-footer.jpg" alt="Brand Heroes">
  </footer>
</div>

<style lang="scss">
  .header {
    background-image: url('/images/oa-site-small-header-background.jpg');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    block-size: calc(53.5rem * var(--scale-factor));
    padding-block-start: calc(7rem * var(--scale-factor));
    position: relative;

    @media(max-width: 932px) {
      block-size: 53.5rem;
    }

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
    }

    :global(.logo path) {
      fill: #FFF;
    }

    .logo-link {
      text-decoration: none;
      display: inline-block;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }
    }

    .wrapper {
      max-inline-size: calc(142rem * var(--scale-factor));
      margin-inline: auto;
      position: relative;
      z-index: 10;
    }

    @media (max-width: 1024px) {
      .wrapper {
        padding-inline: 2rem;
      }
    }

    .row {
      align-items: center;
      display: flex;
      justify-content: space-between;
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

  .footer {
    &-logo {
      inline-size: 100%;
    }
  }          

  .content {
    margin-block-start: calc(-15rem * var(--scale-factor));
    position: relative;
    z-index: 1;

    .wrapper {
      background-color: #FFF;
      max-inline-size: calc(128rem * var(--scale-factor));
      margin-inline: auto;
      padding-block: calc(5rem * var(--scale-factor)) calc(15rem * var(--scale-factor));
    }
  }

  .terms-title {
    color: #FF7000;
    font-size: calc(7.5rem * var(--scale-factor));
    font-weight: 400;
    line-height: 125%;
    text-align: center;
  }

  .terms-content {
    max-inline-size: calc(80rem * var(--scale-factor));
    margin-inline: auto;
    padding-block-start: calc(5rem * var(--scale-factor));
    padding-inline: 2rem;
  }

  .terms-subtitle {
    color: #2E2D2C;
    font-size: calc(3rem * var(--scale-factor));
    font-weight: 600;
    line-height: 125%;
    margin-block-end: calc(3rem * var(--scale-factor));
  }

  .terms-paragraph {
    color: #2E2D2C;
    font-size: 1.8rem;
    font-weight: 400;
    line-height: 1.6;
    margin-block-end: 2rem;
  }
</style> 