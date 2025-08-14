import { json } from '@sveltejs/kit';
import { createClient } from '@sanity/client';
import { SANITY_TOKEN } from '$env/static/private';

const client = createClient({
  projectId: 'pvjzqmr4',
  dataset: 'production',
  apiVersion: '2024-03-13',
  useCdn: false,
  token: SANITY_TOKEN
});

/** @type {import('./$types').RequestHandler} */

export async function POST({ request }) {
  
    const data = await request.json();

    if (!data || !data.displayName || !data.emailAddress) {
    return json({
        error: 'Invalid user data'
     },
    {
        status: 400
    });
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

    return json( {
        success: true, 
        result
    });
}