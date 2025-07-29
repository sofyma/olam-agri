import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  console.log('Test API route called');
  return json({ 
    message: 'API routes are working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
};

export const POST: RequestHandler = async ({ request }) => {
  console.log('Test API POST route called');
  const data = await request.json();
  return json({ 
    message: 'POST API routes are working!',
    receivedData: data,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}; 