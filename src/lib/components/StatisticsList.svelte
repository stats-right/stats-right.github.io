<script lang="ts">
	import { stopImmediatePropagation } from 'svelte/legacy';
  import type { Statistic } from '../stores/statisticsStore';
  import { getStatisticUrl } from '../utils/urlUtils';
  
  let { 
    statistics = [] as Statistic[]
  } = $props();
</script>

<div class="statistics-list space-y-6">
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
    <ul>
      {#each statistics as statistic (statistic.id)}
        <li class="statistic-item bg-white border-2 border-rs-gold-light rounded-lg shadow-md p-5 mb-4 hover:shadow-lg transition-shadow duration-200">
          <a href={getStatisticUrl(statistic.id, statistic.title)} class="block">
            <h3 class="text-xl font-bold text-rs-brown mb-2">{statistic.title || ("Statistic #" + statistic.id)}</h3>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-3">
              {#each (statistic.tags?.visible || []) as tag}
                <span class="statistic-tag">{tag}</span>
              {/each}
            </div>
            
            <!-- Description -->
			{#if statistic.description}
            <p class="text-rs-text mb-3">{statistic.description}</p>
			{/if}
            
			{#if statistic.source}
            <!-- Source information -->
            <div class="text-sm text-rs-text-light border-t border-rs-gold-light pt-2">
              <p><strong>Source:</strong> {statistic.source}</p>
            </div>
			{/if}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .statistics-list {
    margin-bottom: 2rem;
  }
  
  .statistic-item {
    animation: fadeIn 0.4s ease-out forwards;
    opacity: 1;
  }
  
  .statistic-tag {
    background-image: linear-gradient(to bottom, #e6ddbf, #d9cca1);
    border: 1px solid #78501b;
    border-radius: 8px;
    color: #3c2e13;
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    font-weight: 600;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style> 