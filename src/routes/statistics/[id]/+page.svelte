<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { statisticsStore } from '$lib/stores/statisticsStore';
  import { goto } from '$app/navigation';
  import type { Statistic } from '$lib/stores/statisticsStore';
  import StatisticDetail from '$lib/components/StatisticDetail.svelte';
  import { getStatisticUrl } from '$lib/utils/urlUtils';
  
  export let data;
  let currentStatistic: Statistic | undefined = data?.statistic;
  let isLoading = false;
  
  // If data is not available, fetch it client-side
  onMount(async () => {
    if (!currentStatistic) {
      isLoading = true;
      
      // Initialize the store if needed
      if ($statisticsStore.allStatistics.length === 0) {
        await statisticsStore.initializeStore();
      }
      
      // Find the statistic by ID
      currentStatistic = $statisticsStore.allStatistics.find(s => s.id.toString() === $page.params.id);
      isLoading = false;
      
      // If statistic not found, redirect to home
      if (!currentStatistic && !isLoading) {
        goto('/');
      }
    }
    
    // If we have the statistic, create a SEO-friendly URL
    if (currentStatistic) {
      // Redirect to the SEO-friendly URL
      const currentPath = window.location.pathname;
      if (currentPath === `/statistics/${currentStatistic.id}`) {
        goto(getStatisticUrl(currentStatistic.id, currentStatistic.title), { replaceState: true });
      }
    }
  });
</script>

<svelte:head>
  {#if currentStatistic}
    <title>{currentStatistic.title || 'Statistics Detail'}</title>
    <meta name="description" content={currentStatistic.description || 'Detailed view of statistics'} />
    <!-- Open Graph / Social Media -->
    <meta property="og:title" content={currentStatistic.title || 'Statistics Detail'} />
    <meta property="og:description" content={currentStatistic.description || 'Detailed view of statistics'} />
    <meta property="og:image" content={currentStatistic.imageUrl} />
    <meta property="og:type" content="article" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={currentStatistic.title || 'Statistics Detail'} />
    <meta name="twitter:description" content={currentStatistic.description || 'Detailed view of statistics'} />
    <meta name="twitter:image" content={currentStatistic.imageUrl} />
  {/if}
</svelte:head>

{#if isLoading}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
  </div>
{:else if currentStatistic}
  <!-- Full page version - displayed at the actual URL -->
  <div class="min-h-screen bg-gray-100">
    
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="pb-4 mb-6">
        <a href="/" class="flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to search
        </a>
      </div>
      
      <StatisticDetail 
        statistic={currentStatistic} 
        isOpen={true}
        standalone={true} 
      />
    </main>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center p-6 bg-white rounded-lg shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-semibold mb-2">Statistic Not Found</h2>
      <p class="text-gray-600 mb-4">The statistic you're looking for doesn't exist or has been removed.</p>
      <a href="/" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Return
      </a>
    </div>
  </div>
{/if} 