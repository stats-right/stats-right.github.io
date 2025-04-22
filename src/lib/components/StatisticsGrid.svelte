<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import StatisticCard from './StatisticCard.svelte';
  import type { Statistic } from '../stores/statisticsStore';
  
  let { 
    statistics = [],
    searchQuery = '',
    columns = 3,
    gap = 4
  } = $props();
  
  // Create event dispatcher
  const dispatch = createEventDispatcher<{
    statisticClick: Statistic
  }>();
  
  function handleStatisticClick(statistic: Statistic) {
    dispatch('statisticClick', statistic);
  }
  
  // Responsive columns - using gallery-style layout
  let gridClasses = $derived(`grid-cols-1 sm:grid-cols-3 lg:grid-cols-${Math.min(columns, 3)} xl:grid-cols-${columns}`);
  let gapClass = $derived(`gap-${gap}`);
</script>

{#if statistics.length === 0}
	<div class="flex items-center justify-center py-16 text-gray-500">
		<div class="text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mx-auto h-12 w-12"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1"
					d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
			<h3 class="mt-2 text-lg font-medium">No statistics found</h3>
			<p class="mt-1 text-sm">Try adjusting your search or filter criteria.</p>
		</div>
	</div>
{:else}
	<div class="statistics-gallery grid {gridClasses} {gapClass}">
		{#each statistics as statistic, i (statistic.id)}
			<div 
        class="statistic-item transition-all duration-300 ease-in-out cursor-pointer p-2"
        on:click={() => handleStatisticClick(statistic)}
        on:keydown={(e) => e.key === 'Enter' && handleStatisticClick(statistic)}
        tabindex="0"
        role="button"
        aria-label="View statistic details"
        style="--index: {i+1};"
      >
				<StatisticCard {statistic} {searchQuery} />
			</div>
		{/each}
	</div>
{/if}

<style>
  .statistics-gallery {
    margin-bottom: 2rem;
  }
  
  .statistic-item {
    height: 100%;
  }
  
  .statistic-item:hover {
    z-index: 10;
  }
  
  /* Add a nice staggered reveal animation for statistics in the grid */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  :global(.statistics-gallery .statistic-item) {
    animation: fadeIn 0.4s ease-out forwards;
    animation-delay: calc(var(--index, 0) * 0.05s);
    opacity: 0;
  }
</style>
