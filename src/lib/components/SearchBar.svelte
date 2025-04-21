<script lang="ts">
  import { getSuggestedSearchTerms } from '../utils/searchUtils';
  import type { Statistic } from '../stores/statisticsStore';
  
  // Props
  let { 
    searchQuery = '', 
    allTags = [],
    allStatistics = [],
    onSearch = (query: string) => {},
    onTagSelect = (tag: string) => {},
    placeholder = 'Search for statistics...'
  } = $props();
  
  // State
  let inputElement: HTMLInputElement;
  let suggestions: string[] = [];
  let showSuggestions = $state(false);
  let highlightedIndex = $state(-1);
  let inputValue = $state(searchQuery);
  
  // Methods
  function handleInput() {
    if (inputValue.length >= 2) {
      suggestions = getSuggestedSearchTerms(allTags, allStatistics, inputValue);
      showSuggestions = suggestions.length > 0;
    } else {
      suggestions = [];
      showSuggestions = false;
    }
    highlightedIndex = -1;
    
    // Enable real-time search as you type
    onSearch(inputValue);
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (!showSuggestions) return;
    
    // Arrow down
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, suggestions.length - 1);
    }
    // Arrow up
    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, -1);
    }
    // Enter
    else if (event.key === 'Enter') {
      if (highlightedIndex >= 0) {
        selectSuggestion(suggestions[highlightedIndex]);
      } else {
        submitSearch();
      }
    }
    // Escape
    else if (event.key === 'Escape') {
      showSuggestions = false;
    }
  }
  
  function handleFocus() {
    if (inputValue.length >= 2) {
      suggestions = getSuggestedSearchTerms(allTags, allStatistics, inputValue);
      showSuggestions = suggestions.length > 0;
    }
  }
  
  function handleBlur(event: FocusEvent) {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      showSuggestions = false;
    }, 150);
  }
  
  function selectSuggestion(suggestion: string) {
    inputValue = suggestion;
    showSuggestions = false;
    onTagSelect(suggestion);
    inputElement.focus();
  }
  
  function submitSearch() {
    showSuggestions = false;
    onSearch(inputValue);
  }
  
  function clearSearch() {
    inputValue = '';
    onSearch('');
    inputElement.focus();
  }
  
  // Update inputValue when searchQuery prop changes
  $effect(() => {
    inputValue = searchQuery;
  });
</script>

<div class="search-container relative">
  <!-- Search input -->
  <div class="relative">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
      <svg class="h-6 w-6 text-rs-brown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
    </div>
    
    <input
      type="text"
      bind:this={inputElement}
      bind:value={inputValue}
      on:input={handleInput}
      on:keydown={handleKeyDown}
      on:focus={handleFocus}
      on:blur={handleBlur}
      class="search-input block w-full bg-rs-parchment-light border-3 border-rs-brown rounded-lg pl-14 pr-24 focus:border-rs-gold focus:ring-2 focus:ring-rs-gold-light text-xl text-rs-text font-rs font-medium py-5"
      {placeholder}
    />
    
    <div class="absolute inset-y-0 right-0 flex py-1.5 pr-2 items-center">
      {#if inputValue}
        <button
          type="button"
          class="inline-flex items-center rounded-full p-2 text-rs-brown hover:text-rs-brown-dark hover:bg-rs-parchment-dark mr-1"
          on:click={clearSearch}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">Clear search</span>
        </button>
      {/if}
    </div>
  </div>
  
  <!-- Suggestions dropdown -->
  {#if showSuggestions && suggestions.length > 0}
    <div class="suggestions absolute z-10 mt-2 w-full bg-rs-parchment-light border-3 border-rs-brown rounded-lg shadow-xl">
      <ul class="max-h-60 overflow-auto rounded-md py-2 text-rs-text text-base divide-y divide-rs-brown/10">
        {#each suggestions as suggestion, i}
          <li
            class="relative cursor-pointer select-none py-3 pl-4 pr-9 text-rs-text hover:bg-rs-parchment-dark flex items-center"
            class:bg-rs-parchment-dark={i === highlightedIndex}
            on:click={() => selectSuggestion(suggestion)}
            on:mouseenter={() => highlightedIndex = i}
          >
            {#if allTags.includes(suggestion)}
              <span class="inline-block h-3 w-3 rounded-full bg-rs-gold mr-3 flex-shrink-0"></span>
              <span class="font-medium">{suggestion}</span>
            {:else}
              <span class="inline-block h-3 w-3 rounded-sm bg-rs-brown-light mr-3 flex-shrink-0"></span>
              <span>{suggestion}</span>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .search-input {
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    box-shadow: 0 0 0 3px rgba(201, 168, 58, 0.25), inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .search-button {
    transition: all 0.3s ease;
    background-image: linear-gradient(to bottom, #c9a83a, #a98c30);
    border-color: #593c15;
  }
  
  .search-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  
  .suggestions {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: var(--rs-parchment-light, #f8f5eb);
  }
  
  /* Add smooth transition for suggestions */
  .suggestions {
    animation: slideDown 0.2s ease-out;
    transform-origin: top center;
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: scaleY(0.95); }
    to { opacity: 1; transform: scaleY(1); }
  }
</style> 