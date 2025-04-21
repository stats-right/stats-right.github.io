import { generateSlug } from '../../../../lib/utils/urlUtils.ts';

/**
 * Provides all possible values for the [id] and [...slug] parameters for prerendering
 */
export async function entries() {
  // Read the statistics database to get all possible IDs and generate slugs
  const statistics = await import('../../../../../static/statistics-db.json');
  
  // Return an array of objects, each with 'id' and 'slug' properties
  return statistics.default.map(stat => ({
    id: stat.id.toString(),
    slug: generateSlug(stat.title)
  }));
}

/**
 * Server-side load function that provides data without client-side fetching
 */
export async function load({ params }) {
  try {
    // Import the data directly on the server during prerendering
    const statistics = await import('../../../../../static/statistics-db.json');
    const statistic = statistics.default.find(s => s.id.toString() === params.id);
    
    if (!statistic) {
      throw new Error('Statistic not found');
    }
    
    // Return the statistic data
    return {
      statistic
    };
  } catch (e) {
    console.error('Error loading statistic:', e);
    throw new Error('Error loading statistic data');
  }
} 