/**
 * Server-side load function for the all-statistics page
 * This loads data during prerendering, avoiding unnecessary client-side fetching
 */
export async function load() {
  try {
    // Import statistics-db directly on the server
    const statistics = await import('../../../static/statistics-db.json');
    
    // Create a lean version of the statistics with only essential fields
    // This prevents the entire database from being embedded in the HTML
    const leanStatistics = statistics.default.map(stat => ({
      id: stat.id,
      title: stat.title,
      description: stat.description,
      source: stat.source,
      tags: stat.tags
    }));
    
    return {
      // Return the lean version of statistics for the page
      statistics: leanStatistics,
    };
  } catch (e) {
    console.error('Error loading statistics:', e);
    return {
      statistics: []
    };
  }
}

export const prerender = true;
