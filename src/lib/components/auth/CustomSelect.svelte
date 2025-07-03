<!-- CustomSelect.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  
  export let options: string[] = [];
  export let placeholder: string = 'Choose one';
  export let value: string = '';
  
  const dispatch = createEventDispatcher();
  
  let isOpen = false;
  let selectedOption = value;
  
  $: if (value !== selectedOption) {
    selectedOption = value;
  }
  
  function toggleDropdown() {
    isOpen = !isOpen;
  }
  
  function selectOption(option: string) {
    selectedOption = option;
    value = option;
    isOpen = false;
    dispatch('change', { value: option });
  }
  
  function closeDropdown() {
    isOpen = false;
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      closeDropdown();
    }
  }
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClickOutside);
    }
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', handleClickOutside);
    }
  });
</script>

<div class="custom-select">
  <div 
    class="select-trigger" 
    on:click={toggleDropdown}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
      }
    }}
    tabindex="0"
    role="button"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
  >
    <span class="select-value">{selectedOption || placeholder}</span>
    <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
      <path d="M10 12L0.47372 0.75L19.5263 0.750002L10 12Z" fill="#fff"/>
    </svg>
  </div>
  
  {#if isOpen}
    <div class="select-dropdown">
      {#each options as option}
        <div 
          class="select-option" 
          class:selected={option === selectedOption}
          on:click={() => selectOption(option)}
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectOption(option);
            }
          }}
          tabindex="0"
          role="option"
          aria-selected={option === selectedOption}
        >
          {option}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .custom-select {
    position: relative;
    inline-size: 100%;
  }
  
  .select-trigger {
    background-color: #E6E6E6;
    block-size: 4rem;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.4rem;
    font-weight: 600;
    inline-size: 100%;
    padding-inline: 2rem;
    cursor: pointer;
    
    &:focus {
      outline: 0;
    }
  }
  
  .select-value {
    color: #2E2D2C;
    
    &:empty::before {
      content: attr(data-placeholder);
      color: #999;
    }
  }
  
  .select-arrow {
    transition: transform 0.2s ease;
  }
  
  .custom-select.open .select-arrow {
    transform: rotate(180deg);
  }
  
  .select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #E6E6E6;
    border-top: 1px solid #ccc;
    max-block-size: 200px;
    overflow-y: auto;
    z-index: 1000;
  }
  
  .select-option {
    block-size: 4rem;
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    font-weight: 600;
    padding-inline: 2rem;
    cursor: pointer;
    color: #2E2D2C;
    
    &:hover {
      background-color: #999;
      color: white;
    }
    
    &.selected {
      background-color: #FF7000;
      color: white;
    }
  }
</style> 