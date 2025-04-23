<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import StatisticsGrid from '$lib/components/StatisticsGrid.svelte';
  import SearchBar from '$lib/components/SearchBar.svelte';
  import StatisticDetail from '$lib/components/StatisticDetail.svelte';
  import { 
    statisticsStore, 
    filteredStatistics, 
    allTags,
    visibleTags,
    type Statistic
  } from '$lib/stores/statisticsStore';
  import { appStateStore } from '$lib/stores/appStateStore';
  import { getRandomStatistics } from '$lib/utils/filterUtils';
  import { getStatisticUrl } from '$lib/utils/urlUtils';
    
  let searchQuery = $state('');
  let selectedTags = $state<string[]>([]);
  let isLoading = $state(true);
  let selectedStatistic = $state<Statistic | null>(null);
  
  // Number of random statistics to show on the home page
  const RANDOM_STATS_COUNT = 120;
  
  // Track if we've already generated random statistics for this session
  let randomStatsGenerated = false;
  // Store the current random statistics in memory
  let currentRandomStats: Statistic[] = $state([]);
  
  onMount(async () => {
    // Initialize the store with pre-loaded data from the server
    await statisticsStore.initializeStore();
    
    // Restore state from appStateStore (in-memory only)
    if ($appStateStore) {
      // Restore search query and tags
      searchQuery = $appStateStore.searchQuery;
      selectedTags = [...$appStateStore.selectedTags];
      
      // Apply filters from restored state
      if (searchQuery) {
        statisticsStore.setSearchQuery(searchQuery);
      }
      
      if (selectedTags.length > 0) {
        selectedTags.forEach(tag => statisticsStore.addTag(tag));
      }
      
      // Load saved random statistics if available
      if ($appStateStore.randomStatistics && $appStateStore.randomStatistics.length > 0) {
        currentRandomStats = [...$appStateStore.randomStatistics];
        randomStatsGenerated = true;
      }
    }
    
    isLoading = false;
    
    // Check for statistic ID in the URL
    const url = new URL(window.location.href);
    const statisticId = url.searchParams.get('statistic');
    
    if (statisticId && !isNaN(Number(statisticId))) {
      // Find the statistic by ID
      const stat = $statisticsStore.allStatistics.find(s => s.id.toString() === statisticId);
      if (stat) {
        selectedStatistic = stat;
      }
    }
    
    // Restore scroll position with a small delay to ensure content is loaded
    if (browser && $appStateStore.scrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: $appStateStore.scrollPosition,
          behavior: 'auto'
        });
        
        // If there's a last clicked statistic, scroll to it if visible
        if ($appStateStore.lastClickedStatisticId !== null) {
          const statElement = document.querySelector(`[data-statistic-id="${$appStateStore.lastClickedStatisticId}"]`);
          if (statElement) {
            statElement.scrollIntoView({ behavior: 'auto', block: 'center' });
          }
        }
      }, 100);
    }
  });
  
  // Handle search action
  function handleSearch(query: string) {
    searchQuery = query;
    statisticsStore.setSearchQuery(query);
    
    // Sync with app state store
    appStateStore.setSearchQuery(query);
  }
  
  // Handle tag selection
  function handleTagSelect(tag: string) {
    if (!selectedTags.includes(tag)) {
      selectedTags = [...selectedTags, tag];
      statisticsStore.addTag(tag);
      
      // Sync with app state store
      appStateStore.addTag(tag);
    }
  }
  
  // Handle tag removal
  function handleTagRemove(tag: string) {
    selectedTags = selectedTags.filter(t => t !== tag);
    statisticsStore.removeTag(tag);
    
    // Sync with app state store
    appStateStore.removeTag(tag);
  }
  
  // Clear all selected tags
  function clearAllTags() {
    selectedTags = [];
    statisticsStore.clearTags();
    
    // Sync with app state store
    appStateStore.clearTags();
  }
  
  // Handle statistic selection
  function handleStatisticSelect(statistic: Statistic) {
    // Navigate to the SEO-friendly URL
    goto(getStatisticUrl(statistic.id, statistic.title));
  }
  
  // Handle statistic detail close
  function handleStatisticClose() {
    selectedStatistic = null;
  }
  
  // Get the filtered or random statistics
  let displayedStatistics = $derived((() => {
    const filtered = $filteredStatistics;
    
    // If no filters are applied, show random statistics
    if (filtered.length === $statisticsStore.allStatistics.length && 
        !searchQuery && 
        selectedTags.length === 0) {
      
      // If we already have random statistics, use them
      if (currentRandomStats.length > 0 && randomStatsGenerated) {
        return currentRandomStats;
      }
      
      // Generate new random statistics - but not in the derived expression
      if (!randomStatsGenerated) {
        // Using setTimeout to avoid state mutation in derived
        setTimeout(() => {
          // Generate random stats outside of the derived expression
          const randomStats = getRandomStatistics(filtered, RANDOM_STATS_COUNT);
          currentRandomStats = randomStats;
          randomStatsGenerated = true;
          
          // Save to app state
          appStateStore.setRandomStatistics(randomStats);
        }, 0);
        
        // Return filtered (unsorted) for the first render, will be updated immediately
        return filtered.slice(0, RANDOM_STATS_COUNT);
      }
      
      return currentRandomStats;
    }
    
    // Otherwise show the filtered results
    return filtered;
  })());

  const PAGE_TITLE = "Stats Right: Statistics of the New Right";
  const PAGE_DESC = "A searchable collection of statistics and graphs related to the New Right";

  const popularTags = [
	"economy",
	"immigration",
	"left-right",
	"gender",
	"race",
	"dating",
	"mental-illness",
	"lgbtq",
	"taxes",
	"dei",
	"free-speech",
	"crime",
	"usa"
  ];
</script>

<svelte:head>
  <title>{PAGE_TITLE}{selectedStatistic ? ` | ${selectedStatistic.title}` : ''}</title>

  <meta name="description" content={selectedStatistic?.description || PAGE_DESC} />
    <!-- Open Graph / Social Media -->
    <meta property="og:title" content={selectedStatistic?.title || PAGE_TITLE} />
    <meta property="og:description" content={selectedStatistic?.description || PAGE_DESC} />
    <meta property="og:image" content={selectedStatistic?.imageUrl} />
    <meta property="og:type" content="article" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={selectedStatistic?.title || PAGE_TITLE} />
    <meta name="twitter:description" content={selectedStatistic?.description || PAGE_DESC} />
    <meta name="twitter:image" content={selectedStatistic?.imageUrl} />
</svelte:head>

<div class="min-h-screen bg-rs-parchment font-rs">
  <main class="container mx-auto py-6 px-4">
    <!-- Search and popular tags section -->
    <div class="mb-8">
      <div class="rs-panel p-6 shadow-lg rounded-lg">
        <div class="mb-4">
          <h1 class="text-2xl font-bold text-rs-brown mb-4 text-center">{PAGE_TITLE}</h1>
          <SearchBar
            {searchQuery}
            allTags={$allTags}
            allStatistics={$statisticsStore.allStatistics}
            onSearch={handleSearch}
            onTagSelect={handleTagSelect}
            placeholder="Search statistics"
          />
        </div>
        
        <!-- Popular tags -->
        <div class="mt-4">
          <div class="flex flex-wrap gap-2 justify-center">
            {#each popularTags as tag}
              <button 
                class="tag-chip"
                class:selected={selectedTags.includes(tag)}
                on:click={() => handleTagSelect(tag)}
              >
                {tag}
              </button>
            {/each}
            
            {#if selectedTags.length > 0}
              <button 
                class="clear-tags-btn ml-2"
                on:click={clearAllTags}
              >
                Clear filters
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Selected tags display -->
    {#if selectedTags.length > 0}
      <div class="mb-6 flex flex-wrap gap-2">
        {#each selectedTags as tag}
          <button 
            class="tag-chip selected flex items-center" 
            on:click={() => handleTagRemove(tag)}
          >
            {tag}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
        {/each}
      </div>
    {/if}
    
    <!-- Search results info -->
    {#if searchQuery || selectedTags.length > 0}
      <div class="bg-rs-gold-light bg-opacity-30 p-3 rounded-lg mb-6 border-2 border-rs-gold">
        <p class="text-sm text-rs-text font-medium">
          {#if searchQuery && selectedTags.length > 0}
            Showing results for "{searchQuery}" with tags: {selectedTags.join(', ')}
          {:else if searchQuery}
            Showing results for "{searchQuery}"
          {:else}
            Showing results for tags: {selectedTags.join(', ')}
          {/if}
          ({displayedStatistics.length} found)
        </p>
		<div class="flex items-center">
			<span class="text-rs-brown font-bold">{$statisticsStore.allStatistics.length}</span>
			<span class="text-rs-text text-sm ml-2">Total Statistics</span>
		  </div>
      </div>
    {:else if !isLoading}
	<div class="mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-rs-brown">Random Statistics</h2>
          <p class="text-rs-text text-sm">A randomized set of statistics. Refresh for new statistics</p>
        </div>
        <div class="bg-rs-gold-light px-4 py-2 rounded-lg border-2 border-rs-gold flex items-center">
          <span class="text-rs-brown font-bold">{$statisticsStore.allStatistics.length}</span>
          <span class="text-rs-text text-sm ml-2">Total Statistics</span>
        </div>
      </div>
    {/if}
    
    <!-- Statistics display area -->
    {#if isLoading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-rs-gold"></div>
      </div>
    {:else}
      <!-- Statistics grid with larger cards -->
      <StatisticsGrid 
        statistics={displayedStatistics} 
        searchQuery={searchQuery} 
        columns={3} 
        gap={6}
        on:statisticClick={(e) => handleStatisticSelect(e.detail)}
      />
    {/if}
  </main>
  
  <!-- Statistic detail overlay -->
  {#if selectedStatistic}
    <StatisticDetail 
      statistic={selectedStatistic} 
      isOpen={true}
      on:close={handleStatisticClose}
    />
  {/if}
</div>

<!-- Site explainer footer -->
<footer class="bg-rs-brown border-t-2 border-rs-gold mt-12 py-8">
  <div class="container mx-auto px-4">
    <div class="rs-panel p-6 shadow-lg rounded-lg bg-rs-parchment">
      <h2 class="text-xl font-bold text-rs-brown mb-3">About {PAGE_TITLE}</h2>
      <p class="text-rs-text mb-3">
        This website features a searchable database of statistics relevant to New Right perspectives, 
        organized with tags for easy filtering. Users can search by keywords or browse through thematic tags 
        to discover statistics that challenge common narratives.
      </p>
      <p class="text-rs-text mb-3">
        Each statistic is presented with its source, detailed context, and visualizations where applicable. 
        The platform makes these otherwise scattered or buried statistics accessible in one centralized location, 
        allowing researchers, political activists, and curious individuals to find evidence-based information typically 
        absent from popular discourse, enabling more diverse opinions and making it possible to understand the standings of the New Right, which fosters discourse.
      </p>
      <div class="flex mt-6">
        <a href="/all-statistics" class="inline-block text-rs-brown font-bold py-2 px-6 rounded-lg border-2 border-rs-gold-dark transition-colors duration-200">
          View All Statistics
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
  :global(.tag-chip) {
    background-image: linear-gradient(to bottom, #e6ddbf, #d9cca1);
    border: 2px solid #78501b;
    border-radius: 12px;
    color: #3c2e13;
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  :global(.tag-chip:hover) {
    background-image: linear-gradient(to bottom, #d9cca1, #c0b38a);
    transform: translateY(-1px);
  }
  
  :global(.tag-chip.selected) {
    background-image: linear-gradient(to bottom, #c9a83a, #a98c30);
    color: #3c2e13;
    border-color: #593c15;
  }
  
  .clear-tags-btn {
    background-color: #f8f5eb;
    border: 2px solid #78501b;
    border-radius: 12px;
    color: #593c15;
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .clear-tags-btn:hover {
    background-color: #e9e2cc;
  }
</style>
