<!-- Register.svelte -->
<script lang="ts">
  import { authStore } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Game1Logo from '../svgs/Game1Logo.svelte';
  import CustomSelect from './CustomSelect.svelte';
  import { getAvailableCountries, getRegionForCountry } from '$lib/utils/countryRegions';
  
  let email = '';
  let displayName = '';
  let country = '';
  let error = '';
  let emailError = '';
  let countries: string[] = [];
  
  onMount(async () => {
    countries = getAvailableCountries();
    
    // Get email from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      email = emailParam;
    }
  });

  $: {
    if ($authStore.isAuthenticated) {
      goto('/');
    }
  }

  // Email validation function
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle email input changes
  function handleEmailInput() {
    emailError = '';
    if (email && !validateEmail(email)) {
      emailError = 'Please enter a valid email address';
    }
  }

  async function handleSubmit() {
    error = '';
    emailError = '';
    
    if (!email) {
      error = 'Please enter your email address';
      return;
    }

    if (!validateEmail(email)) {
      emailError = 'Please enter a valid email address';
      return;
    }

    // Registration validation
    if (!displayName || !country) {
      error = 'Please fill in all required fields';
      return;
    }

    // Get region based on country
    const region = getRegionForCountry(country);
    if (!region) {
      error = 'Please select a valid country';
      return;
    }

    try {
      await authStore.register({
        displayName,
        emailAddress: email,
        country,
        region
      });
    } catch (e) {
      if (e instanceof Error) {
        error = e.message;
      } else {
        error = 'Registration failed. Please try again.';
      }
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

        <p class="paragraph-1 paragraph-1--1">Looks like you're not registered yet.</p>
        <p class="paragraph-1">No worries! Just fill in the details below to complete <br> your registration.</p>
        
        <form class="auth-form" on:submit|preventDefault={handleSubmit}>
          {#if error}
            <div class="error">{error}</div>
          {/if}
      
          <div class="form-group">
            <label class="auth-label" for="email">Corporate Email</label>
            <input
              class="auth-input"
              class:invalid={emailError}
              type="email"
              id="email"
              bind:value={email}
              on:input={handleEmailInput}
              required
            />
            {#if emailError}
              <div class="email-error">{emailError}</div>
            {/if}
          </div>
      
          <div class="form-group">
            <label class="auth-label" for="displayName">Full Name</label>
            <input
              class="auth-input"
              type="text"
              id="displayName"
              bind:value={displayName}
              required
            />
          </div>
      
          <div class="form-group">
            <label class="auth-label" for="country">Country</label>
            <CustomSelect 
              options={countries}
              placeholder="Choose one"
              bind:value={country}
            />
          </div>
      
          <button type="submit" class="auth-button">Send</button>
        </form>

        <p class="paragraph">
          Need help logging in? <br> Contact us at <a href="mailto:brand@olamagri.com" class="email-link">brand@olamagri.com</a>
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
      max-inline-size: 74rem;
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
    max-inline-size: calc(48rem * var(--scale-factor));
    margin-inline: auto;
    padding-block-start: calc(7rem * var(--scale-factor));
  }

  .auth-button {
    align-items: center;
    background-color: #FF7000;
    block-size: calc(4.4rem * var(--scale-factor));
    border-radius: 0 calc(1.7rem * var(--scale-factor));
    color: #fff;
    display: flex;
    font-size: calc(2rem * var(--scale-factor));
    font-weight: 600;
    inline-size: calc(10.7rem * var(--scale-factor));
    justify-content: center;
    margin-block-start: calc(5rem * var(--scale-factor));
    margin-inline: auto;
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

  .form-group {
    display: flex;
    flex-direction: column;
    gap: calc(0.5rem * var(--scale-factor));
    margin-block-start: calc(3rem * var(--scale-factor));

    &:first-child {
      margin-block-start: 0;
    }

    .auth-label {
      color: #2E2D2C;
      font-size: calc(1.4rem * var(--scale-factor));
      font-weight: 600;
    }

    .auth-input {
      background-color: #E6E6E6;
      block-size: calc(4rem * var(--scale-factor));
      border: 0;
      display: block;
      font-size: calc(1.4rem * var(--scale-factor));
      font-weight: 600;
      inline-size: 100%;
      padding-inline: calc(2rem * var(--scale-factor));

      &:focus {
        outline: 0;
      }

      &.invalid {
        background-color: rgba(255, 48, 0, 0.30);
      }
    }

    .email-error {
      color: #FF3000;
      font-size: calc(1.4rem * var(--scale-factor));
      font-style: normal;
      font-weight: 600;
      line-height: 125%;
      margin-top: calc(0.5rem * var(--scale-factor));
    }
  }

  .paragraph {
    color: #2E2D2C;
    font-size: calc(1.8rem * var(--scale-factor));
    font-weight: 600;
    line-height: normal;
    padding-block-start: calc(7rem * var(--scale-factor));
    text-align: center;

    &-1 {
      color: #2E2D2C;
      font-size: calc(2rem * var(--scale-factor));
      font-weight: 600;
      line-height: normal;
      text-align: center;
      padding-block-start: calc(2rem * var(--scale-factor));

      &--1 {
        padding-block-start: calc(15rem * var(--scale-factor));
      }
    }

    a {
      color: #FF7000;
    }

    .email-link {
      text-decoration: underline;
    }
  }

  .error {
    color: #dc3545;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 0.4rem;
    background-color: #f8d7da;
  }
</style> 