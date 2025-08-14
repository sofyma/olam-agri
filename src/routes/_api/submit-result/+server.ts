// import { json } from '@sveltejs/kit';
// import { createClient } from '@sanity/client';
// import { SANITY_TOKEN } from '$env/static/private';

// const client = createClient({
//   projectId: 'pvjzqmr4',
//   dataset: 'production',
//   apiVersion: '2024-03-13',
//   useCdn: false,
//   token: SANITY_TOKEN
// });

// export async function POST({ request }) {
  
//     const data = await request.json();

//     if (!data || !data._type) {
//     return json({
//         error: 'Invalid data'
//      },
//     {
//         status: 400
//     });
//     }

//     const result = await client.create(data);

//     return json( {
//         success: true, 
//         result
//     });
// }
