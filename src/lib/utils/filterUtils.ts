import type { Statistic } from '../stores/statisticsStore.ts';

/**
 * Filter statistics by tags
 */
export function filterByTags(
  statistics: Statistic[], 
  tags: string[],
  matchAll: boolean = false
): Statistic[] {
  if (!tags.length) return statistics;
  
  return statistics.filter(stat => {
    const allStatTags = [...(stat.tags?.visible || []), ...(stat.tags?.hidden || [])];
    
    if (matchAll) {
      // Must match all provided tags
      return tags.every(tag => allStatTags.includes(tag));
    } else {
      // Match any of the provided tags
      return tags.some(tag => allStatTags.includes(tag));
    }
  });
}

/**
 * Get the most common tags from a collection of statistics
 */
export function getMostCommonTags(
  statistics: Statistic[],
  limit: number = 10,
  visibleOnly: boolean = true
): {tag: string, count: number}[] {
  const tagCounts: Record<string, number> = {};
  
  statistics.forEach(stat => {
    const tagsToCount = visibleOnly ? (stat.tags?.visible || []) : [...(stat.tags?.visible || []), ...(stat.tags?.hidden || [])];
    
    tagsToCount.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get related tags based on co-occurrence with specified tags
 */
export function getRelatedTags(
  statistics: Statistic[],
  selectedTags: string[],
  limit: number = 5
): string[] {
  if (!selectedTags.length) return [];
  
  // Get statistics that match the selected tags
  const filteredStats = filterByTags(statistics, selectedTags);
  
  // Count all tags in the filtered statistics
  const tagCounts: Record<string, number> = {};
  
  filteredStats.forEach(stat => {
    [...(stat.tags?.visible || []), ...(stat.tags?.hidden || [])]
      .filter(tag => !selectedTags.includes(tag)) // Exclude already selected tags
      .forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
  });
  
  // Sort by count and return top N
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

/**
 * Sort statistics by different criteria
 */
export function sortStatistics(
  statistics: Statistic[],
  sortBy: 'title' = 'title',
  sortDirection: 'asc' | 'desc' = 'desc'
): Statistic[] {
  const result = [...statistics];
  
  switch(sortBy) {
    case 'title':
      result.sort((a, b) => {
        const titleA = a.title?.toLowerCase() || '';
        const titleB = b.title?.toLowerCase() || '';
        return sortDirection === 'asc' 
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      });
      break;
  }
  
  return result;
}

/**
 * Pick random statistics from a collection
 */
export function getRandomStatistics(
  statistics: Statistic[],
  count: number
): Statistic[] {
  if (!statistics.length || count <= 0) return [];
  
  if (statistics.length <= count) return [...statistics];
  
  // Simple random selection
  const shuffled = [...statistics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 