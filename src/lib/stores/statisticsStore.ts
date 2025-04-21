import { writable, derived } from 'svelte/store';
import type { Readable } from 'svelte/store';

// Simple browser detection to avoid import errors
const isBrowser = typeof window !== 'undefined';

export interface Statistic {
  id: number;
  imageUrl: string;
  title?: string;
  description?: string;
  
  source?: string;
  sourceUrl?: string;

  tags: {
    visible: string[];
    hidden: string[];
  };

  links?: {
    type: "download" | "related";
    label: string;
    url: string;
  }[];

  additional?: Record<string, any>;
}

interface StatisticsState {
  allStatistics: Statistic[];
  selectedTags: string[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  allStatistics: [],
  selectedTags: [],
  searchQuery: '',
  isLoading: false,
  error: null
};

function createStatisticsStore() {
  const { subscribe, set, update } = writable<StatisticsState>(initialState);

  return {
    subscribe,
    
    // Initialize store with data (accepts preloaded data to avoid fetching)
    initializeStore: async (preloadedData?: Statistic[]) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        // Use preloaded data if available
        if (preloadedData) {
          update(state => ({
            ...state,
            allStatistics: preloadedData,
            isLoading: false
          }));
          return;
        }
        
		/*
        // In case we need to fetch data (should rarely happen with proper preloading)
        if (isBrowser) {
          const cachedData = sessionStorage.getItem('statistics-data');
          if (cachedData) {
            update(state => ({
              ...state,
              allStatistics: JSON.parse(cachedData),
              isLoading: false
            }));
            return;
          }
        }
		*/
        
        // Fetch only if no preloaded or cached data available
        const response = await fetch('/statistics-db.json', {
			cache: "force-cache"
		});
        if (!response.ok) {
          throw new Error('Failed to fetch statistics data');
        }
        
        const data: Statistic[] = await response.json();
        
		/*
        // Cache the data for future use
        if (isBrowser) {
          try {
            sessionStorage.setItem('statistics-data', JSON.stringify(data));
          } catch (e) {
            console.warn('Failed to cache statistics data:', e);
          }
        }
		  */
        
        update(state => ({
          ...state,
          allStatistics: data,
          isLoading: false
        }));
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }));
      }
    },
    
    // Set search query
    setSearchQuery: (query: string) => {
      update(state => ({ ...state, searchQuery: query }));
    },
    
    // Add a tag to filter
    addTag: (tag: string) => {
      update(state => {
        if (state.selectedTags.includes(tag)) {
          return state;
        }
        return { ...state, selectedTags: [...state.selectedTags, tag] };
      });
    },
    
    // Remove a tag from filter
    removeTag: (tag: string) => {
      update(state => ({
        ...state,
        selectedTags: state.selectedTags.filter(t => t !== tag)
      }));
    },
    
    // Clear all tags
    clearTags: () => {
      update(state => ({ ...state, selectedTags: [] }));
    },
    
    // Reset all filters
    resetFilters: () => {
      update(state => ({
        ...state,
        selectedTags: [],
        searchQuery: ''
      }));
    },
    
    // Get random statistics
    getRandomStatistics: (count: number) => {
      return update(state => {
        const shuffled = [...state.allStatistics].sort(() => 0.5 - Math.random());
        const randomStats = shuffled.slice(0, count);
        return {
          ...state,
          allStatistics: randomStats
        };
      });
    }
  };
}

// Create the main store
export const statisticsStore = createStatisticsStore();

// Derived store for filtered statistics
export const filteredStatistics: Readable<Statistic[]> = derived(
  statisticsStore,
  ($store) => {
    
    // Start with all statistics
    let filtered = $store.allStatistics;
    
    // Filter by selected tags
    if ($store.selectedTags.length > 0) {
      filtered = filtered.filter(stat => {
        const allTags = [...(stat.tags?.visible || []), ...(stat.tags?.hidden || [])];
        return $store.selectedTags.some(tag => allTags.includes(tag));
      });
    }
    
    // Filter by search query
    if ($store.searchQuery && $store.searchQuery.trim() !== '') {
      const query = $store.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(stat => {
        // Check title and description
        const titleMatch = stat.title ? stat.title.toLowerCase().includes(query) : false;
        const descMatch = stat.description ? stat.description.toLowerCase().includes(query) : false;
        
        // Check tags
        const allTags = [...(stat.tags?.visible || []), ...(stat.tags?.hidden || [])];
        const tagsMatch = allTags.some(tag => 
          tag.toLowerCase().includes(query)
        );
          
        return titleMatch || descMatch || tagsMatch;
      });
    }
    
    return filtered;
  }
);

// Derived store for all unique tags
export const allTags: Readable<string[]> = derived(
  statisticsStore,
  ($store) => {
    const tagSet = new Set<string>();
    
    $store.allStatistics.forEach(stat => {
		(stat.tags?.visible || []).forEach(tag => tagSet.add(tag));
		(stat.tags?.hidden || []).forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  }
);

// Derived store for visible tags only
export const visibleTags: Readable<string[]> = derived(
  statisticsStore,
  ($store) => {
    const tagSet = new Set<string>();
    
    $store.allStatistics.forEach(stat => {
		(stat.tags?.visible || []).forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet).sort();
  }
); 