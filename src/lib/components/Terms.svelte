<!-- Terms.svelte -->
<script lang="ts">
  import Game1Logo from './svgs/Game1Logo.svelte';
</script>

<div class="container">
  <header class="header">
    <div class="wrapper">
      <div class="row">
        <div class="column">
          <Game1Logo />
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
    block-size: 53.5rem;
    padding-block-start: 7rem;
    position: relative;

    &-heroes {
      position: absolute;
      inset-block-end: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);
    }

    &-title {
      color: #FFF;
      font-size: 8rem;
      font-weight: 600;
      line-height: normal;
      padding-block-start: 1.5rem;
    }

    :global(.logo path) {
      fill: #FFF;
    }

    .wrapper {
      max-inline-size: 142rem;
      margin-inline: auto;
    }

    @media (min-width: 768px) and (max-width: 1024px) {
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
        gap: 3rem;
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
    margin-block-start: -15rem;
    position: relative;
    z-index: 1;

    .wrapper {
      background-color: #FFF;
      max-inline-size: 128rem;
      margin-inline: auto;
      padding-block: 5rem 15rem;
    }
  }

  .terms-title {
    color: #FF7000;
    font-size: 7.5rem;
    font-weight: 400;
    line-height: 125%;
    text-align: center;
  }

  .terms-content {
    max-inline-size: 80rem;
    margin-inline: auto;
    padding-block-start: 5rem;
  }

  .terms-subtitle {
    color: #2E2D2C;
    font-size: 3rem;
    font-weight: 600;
    line-height: 125%;
    margin-block-end: 3rem;
  }

  .terms-paragraph {
    color: #2E2D2C;
    font-size: 1.8rem;
    font-weight: 400;
    line-height: 1.6;
    margin-block-end: 2rem;
  }
</style> 