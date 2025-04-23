import { writable } from 'svelte/store';
import type { Statistic } from './statisticsStore';

// Interface for our app state
export interface AppState {
  searchQuery: string;
  selectedTags: string[];
  scrollPosition: number;
  lastClickedStatisticId: number | null;
  randomStatistics: Statistic[];
}

// Initialize with default values
const defaultState: AppState = {
  searchQuery: '',
  selectedTags: [],
  scrollPosition: 0,
  lastClickedStatisticId: null,
  randomStatistics: []
};

// Create a persistent store (in-memory only)
function createAppStateStore() {
  const { subscribe, set, update } = writable<AppState>(defaultState);
  
  return {
    subscribe,
    
    // Set search query
    setSearchQuery: (query: string) => {
      update(state => ({
        ...state,
        searchQuery: query
      }));
    },
    
    // Set selected tags
    setSelectedTags: (tags: string[]) => {
      update(state => ({
        ...state,
        selectedTags: tags
      }));
    },
    
    // Add a tag
    addTag: (tag: string) => {
      update(state => {
        if (state.selectedTags.includes(tag)) {
          return state;
        }
        return {
          ...state,
          selectedTags: [...state.selectedTags, tag]
        };
      });
    },
    
    // Remove a tag
    removeTag: (tag: string) => {
      update(state => ({
        ...state, 
        selectedTags: state.selectedTags.filter(t => t !== tag) 
      }));
    },
    
    // Clear all tags
    clearTags: () => {
      update(state => ({
        ...state,
        selectedTags: []
      }));
    },
    
    // Save scroll position
    saveScrollPosition: (position: number) => {
      update(state => ({
        ...state,
        scrollPosition: position
      }));
    },
    
    // Track clicked statistic
    setLastClickedStatistic: (statisticId: number) => {
      update(state => ({
        ...state,
        lastClickedStatisticId: statisticId
      }));
    },
    
    // Store random statistics 
    setRandomStatistics: (statistics: Statistic[]) => {
      update(state => ({
        ...state,
        randomStatistics: statistics
      }));
    },
    
    // Reset the store
    reset: () => {
      set(defaultState);
    }
  };
}

export const appStateStore = createAppStateStore(); 