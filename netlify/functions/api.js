const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'pvjzqmr4',
  dataset: 'production',
  apiVersion: '2024-03-13',
  useCdn: false,
  token: process.env.SANITY_TOKEN
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  
  console.log('API Function Debug:', {
    originalPath: event.path,
    cleanedPath: path,
    httpMethod: event.httpMethod,
    body: event.body ? JSON.parse(event.body) : null
  });

  try {
    if ((path === '/register-user' || path === '/api/register-user') && event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      console.log('Register user API called');
      console.log('Environment variables:', {
        SANITY_TOKEN: process.env.SANITY_TOKEN ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV
      });
      
      if (!data || !data.displayName || !data.emailAddress) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid user data' })
        };
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

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, result })
      };
    }

    if ((path === '/submit-result' || path === '/api/submit-result') && event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      if (!data || !data._type) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid data' })
        };
      }

      const result = await client.create(data);

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, result })
      };
    }

    if ((path === '/test' || path === '/api/test') && event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'API routes are working!',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        })
      };
    }

    return {
      statusCode: 404,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
}; 