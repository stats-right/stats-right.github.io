// This enables prerendering for the main page
export const prerender = true;

// Import the Statistic type directly from the store
import type { Statistic } from '../lib/stores/statisticsStore.ts';

// Define the shape of the data coming from the server
export interface PageData {
  statistics: Statistic[];
} 