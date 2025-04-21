<script lang="ts">
  import StatisticsList from '$lib/components/StatisticsList.svelte';

  export let data;
  const statistics = data.statistics;

  const PAGE_TITLE = "All Statistics | Stats Right";
  const PAGE_DESC = "Complete searchable collection of statistics and graphs related to the New Right";
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
  <meta name="description" content={PAGE_DESC} />
  <!-- Open Graph / Social Media -->
  <meta property="og:title" content={PAGE_TITLE} />
  <meta property="og:description" content={PAGE_DESC} />
  <meta property="og:type" content="article" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={PAGE_TITLE} />
  <meta name="twitter:description" content={PAGE_DESC} />
</svelte:head>

<div class="min-h-screen bg-rs-parchment font-rs">
  <main class="container mx-auto py-6 px-4">
    <div class="mb-8">
      <div class="rs-panel p-6 shadow-lg rounded-lg">
        <h1 class="text-2xl font-bold text-rs-brown mb-4 text-center">All Statistics</h1>
        <p class="text-center text-rs-text mb-4">
          A comprehensive collection of all statistics available
        </p>
        <div class="flex justify-center mb-4">
          <a href="/" class="inline-block bg-rs-gold hover:bg-rs-gold-dark text-rs-brown font-bold py-2 px-4 rounded">
            Back to Home
          </a>
        </div>
      </div>
    </div>
    
    <!-- Statistics display area -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-rs-brown">Complete Statistics Database</h2>
        <p class="text-rs-text text-sm">Showing all {statistics.length} statistics</p>
      </div>
      <div class="bg-rs-gold-light px-4 py-2 rounded-lg border-2 border-rs-gold flex items-center">
        <span class="text-rs-brown font-bold">{statistics.length}</span>
        <span class="text-rs-text text-sm ml-2">Total Statistics</span>
      </div>
    </div>
    
    <!-- Statistics list with real links for better SEO -->
    <StatisticsList statistics={statistics} />
  </main>
</div>

<style>
  /* Inherits global styles from the main application */
</style> 