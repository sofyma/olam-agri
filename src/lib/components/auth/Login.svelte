<!-- Login.svelte -->
<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import Game1Logo from '../svgs/Game1Logo.svelte';
  
  let email = '';
  let error = '';

  $: {
    if ($authStore.isAuthenticated) {
      goto('/');
    }
  }

  async function handleSubmit() {
    error = '';
    
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    const exists = await authStore.checkEmail(email);
    if (exists) {
      const success = await authStore.login(email);
      if (!success) {
        error = 'Login failed. Please try again.';
      }
    } else {
      // Redirect to register page with email as parameter
      goto(`/register?email=${encodeURIComponent(email)}`);
    }
  }
</script>

<div class="container">
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
    </div>

    <img class="header-heroes" src="/images/oa-site-small-header-heroes.png" alt="Brand Heroes">
  </header>
  
  <main class="content">
    <div class="wrapper">
      <div class="auth-container">
        <h2 class="auth-title">Superheroes, welcome</h2>
        
        <form class="auth-form" on:submit|preventDefault={handleSubmit}>
          {#if error}
            <div class="error">{error}</div>
          {/if}
      
          <div class="form-group form-group--email">
            <label class="auth-label" for="email">Enter your corporate email</label>
            <input
              class="auth-input"
              type="email"
              id="email"
              bind:value={email}
              required
            />
          </div>
      
          <button type="submit" class="auth-button">Login</button>
        </form>

        <p class="paragraph">
          Need help logging in? <br> Contact us at <a href="mailto:brand@olamagri.com">brand@olamagri.com</a>
        </p>
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

    &-heroes {
      position: absolute;
      inset-block-end: 0;
      inset-inline-start: 50%;
      transform: translateX(-50%);
    }

    &-title {
      color: #FFF;
      font-size: calc(8rem * var(--scale-factor));
      font-weight: 600;
      line-height: normal;
      padding-block-start: calc(1.5rem * var(--scale-factor));
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
    }

    @media (max-width: 1024px) {
      .wrapper {
        padding-inline: calc(2rem * var(--scale-factor));
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
        font-size: calc(1.8rem * var(--scale-factor));
        font-weight: 600;
        line-height: normal;
      }
    }

    .btn {
      align-items: center;
      background-color: #fff;
      block-size: calc(3.2rem * var(--scale-factor));
      border-radius: 0 calc(1.5rem * var(--scale-factor));
      display: flex;
      inline-size: calc(11.1rem * var(--scale-factor));
    }
  }

  .footer {
    &-logo {
      inline-size: 100%;
    }
  }          

  .auth-form {
    text-align: center;
  }

  .auth-button {
    background-color: #FF7000;
    block-size: calc(4.4rem * var(--scale-factor));
    border-radius: 0 calc(1.7rem * var(--scale-factor));
    color: #fff;
    font-size: calc(2rem * var(--scale-factor));
    font-weight: 600;
    inline-size: calc(10.7rem * var(--scale-factor));
    margin-block-start: calc(5rem * var(--scale-factor));
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

  .auth-title {
    color: #FF7000;
    font-size: calc(7.5rem * var(--scale-factor));
    font-weight: 400;
    line-height: 125%;
    text-align: center;
  }

  .form-group--email {
    display: flex;
    flex-direction: column;
    gap: calc(3rem * var(--scale-factor));
    padding-block-start: calc(15rem * var(--scale-factor));

    .auth-label {
      color: #2E2D2C;
      font-size: calc(4rem * var(--scale-factor));
      font-weight: 600;
      line-height: 125%;
    }

    .auth-input {
      background-color: #E6E6E6;
      block-size: calc(6rem * var(--scale-factor));
      border: 0;
      display: block;
      font-size: calc(2rem * var(--scale-factor));
      font-weight: 600;
      inline-size: 100%;
      max-inline-size: calc(48rem * var(--scale-factor));
      margin-inline: auto;
      padding-inline: calc(2rem * var(--scale-factor));

      &:focus {
        outline: 0;
      }
    }
  }

  .paragraph {
    color: #2E2D2C;
    font-size: calc(1.8rem * var(--scale-factor));
    font-weight: 600;
    line-height: normal;
    padding-block-start: calc(7rem * var(--scale-factor));
    text-align: center;

    a {
      color: #FF7000;
    }
  }

  .error {
    color: #dc3545;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #f8d7da;
  }
</style> 