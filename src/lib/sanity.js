import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'pvjzqmr4', 
  dataset: 'production', // or your dataset name
  apiVersion: '2024-03-13', // Using today's date
  useCdn: false, // Set to false to ensure fresh data
  // token: import.meta.env.VITE_SANITY_TOKEN, // Removed for read-only client
  withCredentials: true // This enables CORS
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  if (!source) {
    return builder.image('image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg');
  }

  if (source.url) {
    return builder.image(source._id || 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg');
  }

  return builder.image(source);
}
