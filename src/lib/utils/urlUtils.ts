/**
 * Generates a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string | undefined): string {
  if (!title) return 'statistic';
  
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .trim()                   // Trim leading/trailing spaces
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generates a full URL for a statistic
 * @param id - The ID of the statistic
 * @param title - The title of the statistic
 * @returns A URL path for the statistic
 */
export function getStatisticUrl(id: number | string, title?: string): string {
  const slug = generateSlug(title);
  return `/statistics/${id}/${slug}`;
} 