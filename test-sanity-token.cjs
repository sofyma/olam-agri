const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'pvjzqmr4',
  dataset: 'production',
  apiVersion: '2024-03-13',
  useCdn: false,
  token: process.env.SANITY_TOKEN
});

client.create({
  _type: 'testDoc',
  test: 'hello'
}).then(res => {
  console.log('Success:', res);
}).catch(err => {
  console.error('Error:', err.message);
}); 