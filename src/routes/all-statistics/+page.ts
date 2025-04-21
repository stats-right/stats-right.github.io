// This enables prerendering for the all-statistics page
export const prerender = true;

// Import the Statistic type directly from the store
import type { Statistic } from '../../lib/stores/statisticsStore';

// Define the shape of the data coming from the server
export interface PageData {
  statistics: Statistic[];
} 