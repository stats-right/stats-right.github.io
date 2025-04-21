import type { Statistic } from '../stores/statisticsStore.ts';

/**
 * Calculate similarity score between search query and a text
 * using a combination of exact match, fuzzy matching, and word position
 */
export function calculateSimilarityScore(query: string, text: string): number {
  if (!query || !text) return 0;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Exact match has highest score
  if (textLower.includes(queryLower)) {
    // Higher score if it's at the beginning
    if (textLower.startsWith(queryLower)) {
      return 1.0;
    }
    return 0.8;
  }
  
  // Word matching
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 1);
  if (queryWords.length === 0) return 0;
  
  let matchedWords = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) {
      matchedWords++;
    }
  }
  
  const wordMatchScore = matchedWords / queryWords.length;
  
  // Partial word matching (for typos, etc.)
  let partialMatchScore = 0;
  for (const word of queryWords) {
    // Skip very short words for partial matching
    if (word.length < 4) continue;
    
    // Check for partial matches (beginning of words)
    const textWords = textLower.split(/\s+/);
    for (const textWord of textWords) {
      if (textWord.startsWith(word.substring(0, Math.min(3, word.length)))) {
        partialMatchScore += 0.5;
        break;
      }
    }
  }
  
  partialMatchScore = Math.min(partialMatchScore / Math.max(1, queryWords.length), 0.5);
  
  // Combine scores, word match is more important
  return Math.min(0.7 * wordMatchScore + 0.3 * partialMatchScore, 0.7);
}

/**
 * Search function that ranks results by relevance
 */
export function searchStatistics(
  statistics: Statistic[],
  query: string,
  selectedTags: string[] = []
): Statistic[] {
  if (!query && selectedTags.length === 0) {
    return statistics;
  }
  
  const results = statistics.map(stat => {
    // Start with base score
    let score = 0;
    
    // If we have a query, calculate text match scores
    if (query) {
      // Title is most important
      const titleScore = stat.title ? 
        calculateSimilarityScore(query, stat.title) * 0.5 : 0;
      
      // Description is next
      const descScore = stat.description ? 
        calculateSimilarityScore(query, stat.description) * 0.3 : 0;
      
      // Tags come next
      const allTags = [...(stat.tags?.visible || []), ...(stat.tags?.hidden || [])].join(' ');
      const tagScore = calculateSimilarityScore(query, allTags) * 0.2;
      
      // Source is least important but still contributes
      const sourceScore = stat.source ? 
        calculateSimilarityScore(query, stat.source) * 0.1 : 0;
      
      // Combine all text scores
      score = titleScore + descScore + tagScore + sourceScore;
    }
    
    // If we have selected tags, boost score for tag matches
    if (selectedTags.length > 0) {
      const allStatTags = [...(stat.tags?.visible || []), ...(stat.tags?.hidden || [])];
      const matchedTags = selectedTags.filter(tag => allStatTags.includes(tag));
      
      // Tag match score - ratio of matched tags to selected tags
      const tagMatchScore = matchedTags.length / selectedTags.length;
      
      // Boost the score based on tag matches
      // If we have no query, tag matches are everything
      if (!query) {
        score = tagMatchScore;
      } else {
        // With a query, we combine scores with more weight on tag matches
        score = (score * 0.4) + (tagMatchScore * 0.6);
      }
    }
    
    return { stat, score };
  })
  .filter(item => {
    // Filter out completely irrelevant results
    if (selectedTags.length > 0) {
      const allStatTags = [...(item.stat.tags?.visible || []), ...(item.stat.tags?.hidden || [])];
      const hasMatchingTag = selectedTags.some(tag => allStatTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    
    // Keep items with some relevance score if there's a query
    return !query || item.score > 0;
  })
  .sort((a, b) => b.score - a.score); // Sort by score descending
  
  // Return just the statistics, now sorted by relevance
  return results.map(item => item.stat);
}

/**
 * Get suggested search terms based on partial input
 */
export function getSuggestedSearchTerms(
  allTags: string[],
  allStatistics: Statistic[],
  partialInput: string,
  maxSuggestions: number = 5
): string[] {
  if (!partialInput || partialInput.length < 2) return [];
  
  const input = partialInput.toLowerCase();
  const suggestions: Set<string> = new Set();
  
  // First priority: tags that start with the input
  allTags
    .filter(tag => tag.toLowerCase().startsWith(input))
    .slice(0, maxSuggestions)
    .forEach(tag => suggestions.add(tag));
  
  return Array.from(suggestions);
}

/**
 * Highlight search query matches in text
 */
export function highlightMatches(text: string, query: string): string {
  if (!query || !text) return text;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  // For exact phrase match
  if (textLower.includes(queryLower)) {
    const index = textLower.indexOf(queryLower);
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    
    return `${before}<mark>${match}</mark>${after}`;
  }
  
  // For word matches
  const queryWords = queryLower
    .split(/\s+/)
    .filter(word => word.length > 2)
    .sort((a, b) => b.length - a.length); // Process longer words first
  
  if (queryWords.length === 0) return text;
  
  let result = text;
  
  for (const word of queryWords) {
    // Create regex that matches whole word or start of word
    // Use a regex that looks for word boundaries or start of word
    const regex = new RegExp(`(^|\\W)(${word})`, 'gi');
    result = result.replace(regex, '$1<mark>$2</mark>');
  }
  
  return result;
} 