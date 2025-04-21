<script lang="ts">
  import { getMostCommonTags, getRelatedTags } from '../utils/filterUtils';
  import TagChip from './TagChip.svelte';
  import type { Statistic } from '../stores/statisticsStore';
  
  // Props
  let { 
    allStatistics = [],
    selectedTags = [],
    onTagSelect = (tag: string) => {},
    onTagRemove = (tag: string) => {},
    onClearAllTags = () => {}
  } = $props();
  
  // Derived values
  let mostCommonTags = $derived(getMostCommonTags(allStatistics, 15, true));
  let relatedTags = $derived(selectedTags.length > 0 
    ? getRelatedTags(allStatistics, selectedTags, 5)
    : []);
  let hasSelectedTags = $derived(selectedTags.length > 0);
</script>

<div class="filter-panel">
  <div class="mb-4">
    <h3 class="text-lg font-bold text-rs-brown-dark mb-2">Filters</h3>
    
    {#if hasSelectedTags}
      <div class="selected-tags mb-3">
        <div class="flex flex-wrap gap-1 mb-2">
          {#each selectedTags as tag}
            <TagChip {tag} removable onRemove={onTagRemove} />
          {/each}
        </div>
        
        <button 
          type="button" 
          class="rs-button text-sm" 
          on:click={() => onClearAllTags()}
        >
          Clear all filters
        </button>
      </div>
    {/if}
  </div>
  
  <!-- Popular tags -->
  <div class="mb-5 filter-section p-3 rounded-md bg-rs-parchment-dark border-2 border-rs-brown">
    <h4 class="text-sm font-bold text-rs-brown mb-2">Popular Tags</h4>
    <div class="flex flex-wrap gap-1">
      {#each mostCommonTags as { tag, count }}
        <button
          type="button"
          class="tag-button text-xs px-2 py-1 rounded-full flex items-center"
          class:selected={selectedTags.includes(tag)}
          disabled={selectedTags.includes(tag)}
          on:click={() => onTagSelect(tag)}
        >
          {tag}
          <span class="ml-1 text-rs-brown-dark text-xs">({count})</span>
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Related tags (only shown when tags are selected) -->
  {#if selectedTags.length > 0 && relatedTags.length > 0}
    <div class="filter-section p-3 rounded-md bg-rs-parchment-dark border-2 border-rs-brown">
      <h4 class="text-sm font-bold text-rs-brown mb-2">Related Tags</h4>
      <div class="flex flex-wrap gap-1">
        {#each relatedTags as tag}
          <button
            type="button"
            class="tag-button text-xs px-2 py-1 rounded-full"
            class:selected={selectedTags.includes(tag)}
            disabled={selectedTags.includes(tag)}
            on:click={() => onTagSelect(tag)}
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .tag-button {
    background-image: linear-gradient(to bottom, #e6ddbf, #d9cca1);
    border: 1px solid #78501b;
    color: #3c2e13;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .tag-button:hover:not(:disabled) {
    background-image: linear-gradient(to bottom, #d9cca1, #c0b38a);
  }
  
  .tag-button.selected {
    background-image: linear-gradient(to bottom, #c9a83a, #a98c30);
    color: #3c2e13;
    border-color: #593c15;
    cursor: default;
  }
  
  .filter-section {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style> 