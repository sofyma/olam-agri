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
  console.log('Register user API called');
  console.log('Environment variables:', {
    SANITY_TOKEN: process.env.SANITY_TOKEN ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV
  });
  
  try {
    const data = await request.json();
    console.log('Received data:', data);
    
    // TODO: Add validation logic here
    if (!data || !data.displayName || !data.emailAddress) {
      console.log('Invalid data received');
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
    console.log('User created successfully:', result);
    return json({ success: true, result });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return json({ error: error.message }, { status: 500 });
  }
}; 