<script lang="ts">
  import { highlightMatches } from '../utils/searchUtils';
  import TagChip from './TagChip.svelte';
  import type { Statistic } from '../stores/statisticsStore';
  
  // Props
  let { statistic, searchQuery = '', showDetails = false } = $props();
  
  // State
  let isExpanded = $state(showDetails);
  
  // Computed
  let titleText = $derived(statistic.title || "");
  let title = $derived(searchQuery ? 
    highlightMatches(titleText, searchQuery) : 
    titleText);
    
  let description = $derived(searchQuery ? 
    highlightMatches(statistic.description, searchQuery) : 
    statistic.description);

  let hasTags = $derived((statistic.tags?.visible || []).length > 0);
  let showFooter = $derived(hasTags || description || statistic.source);
</script>

<div class="statistic-card rs-panel flex flex-col h-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2">
  <div class="relative h-full">
    <div class="overflow-hidden h-full">
      <img 
        src={statistic.imageUrl} 
        alt={statistic.title}
        class="w-full md:h-96 h-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
	{#if title}
    <div class="absolute bottom-0 left-0 w-full bg-rs-gradient p-4">
      <h3 class="text-rs-text text-xl font-bold line-clamp-2">
        <!-- Using {@html} to render highlighted matches with <mark> tags -->
        {@html title}
      </h3>
    </div>
	{/if}
  </div>
  
  {#if showFooter}
  <div class="p-5 flex-1 flex flex-col">
	{#if hasTags}
    <div class="tags-container mb-3 flex flex-wrap gap-1.5">
      {#each (statistic.tags?.visible || []) as tag}
        <TagChip {tag} highlighted={searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase())} />
      {/each}
    </div>
	{/if}
    
	{#if description}
    <div class="description mb-4 text-rs-text text-sm leading-relaxed overflow-hidden"
         class:line-clamp-3={!isExpanded}>
      <!-- Using {@html} to render highlighted matches with <mark> tags -->
      {@html description}
    </div>
	{/if}
    
    <!-- Add a subtle divider and date/source information -->
	{#if statistic.source}
    <div class="mt-auto pt-3 border-t border-rs-gold-light flex justify-between text-xs text-rs-text-light">
        <span class="italic">Source: {statistic.source}</span>
    </div>
    {/if}
  </div>
  {/if}
</div>

<style>
  /* Additional styling for highlighted text */
  :global(.statistic-card mark) {
    background-color: rgba(245, 168, 0, 0.4);
    padding: 0 2px;
    border-radius: 2px;
  }
  
  .statistic-card {
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    background-image: linear-gradient(to bottom, #f8f5eb, #f0ece0);
    min-height: 300px; /* Base minimum height */
  }
  
  .statistic-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  .description {
    font-size: 0.95rem;
  }
  
  /* Mobile-specific height adjustments */
  @media screen and (max-width: 768px) {
    .statistic-card {
      min-height: 450px;
    }
  }
  
  /* Small mobile devices */
  @media screen and (max-width: 480px) {
    .statistic-card {
      min-height: 500px;
    }
  }
</style> 