import 'dotenv/config';
import { json, type RequestHandler } from '@sveltejs/kit';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'pvjzqmr4',
  dataset: 'production',
  apiVersion: '2024-03-13',
  useCdn: false,
  token: process.env.SANITY_TOKEN // Server-side only
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    // TODO: Add validation logic here
    if (!data || !data.displayName || !data.emailAddress) {
      return json({ error: 'Invalid user data' }, { status: 400 });
    }
    const userDoc = {
      _type: 'user',
      displayName: data.displayName,
      emailAddress: data.emailAddress,
      country: data.country,
      region: data.region
    };
    const result = await client.create(userDoc);
    return json({ success: true, result });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
}; 