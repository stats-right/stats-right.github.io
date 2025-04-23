<script lang="ts">
  import type { Statistic } from '$lib/stores/statisticsStore';
  import StatisticDetail from '$lib/components/StatisticDetail.svelte';
  
  export let data;
  let currentStatistic: Statistic | undefined = data.statistic as Statistic | undefined;
  let isLoading = false;
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
  <div class="fixed inset-0 bg-rs-brown bg-opacity-50 flex items-center justify-center z-50">
    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-rs-parchment"></div>
  </div>
{:else if currentStatistic}
  <!-- Full page version - displayed at the actual URL -->
  <div class="min-h-screen bg-rs-parchment font-rs">   
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="pb-4 mb-6">
        <a href="/" class="group flex items-center px-3 py-2 rounded-md border-2 border-rs-gold-light bg-rs-parchment-light hover:bg-rs-gold-light transition-colors w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-rs-gold-dark group-hover:text-rs-brown transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="text-rs-gold-dark group-hover:text-rs-brown font-medium transition-colors">Back to search</span>
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
  <div class="min-h-screen flex items-center justify-center bg-rs-parchment">
    <div class="text-center p-6 bg-rs-parchment-light rounded-lg shadow-md border-2 border-rs-brown-light">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-rs-brown mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-semibold mb-2 text-rs-brown">Statistic Not Found</h2>
      <p class="text-rs-text mb-4">The statistic you're looking for doesn't exist or has been removed.</p>
      <a href="/" class="inline-block bg-rs-gold text-rs-brown px-4 py-2 rounded-md hover:bg-rs-gold-dark transition-colors">
        Return
      </a>
    </div>
  </div>
{/if} 