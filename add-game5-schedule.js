import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'pvjzqmr4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN // Make sure to set this environment variable
});

async function addGame5Schedule() {
  try {
    // Check if Game 5 schedule already exists
    const existingGame5 = await client.fetch(
      `*[_type == "gameSchedule" && gameId == "game5"][0]`
    );

    if (existingGame5) {
      console.log('Game 5 schedule already exists:', existingGame5._id);
      return;
    }

    // Create Game 5 schedule
    const game5Schedule = await client.create({
      _type: 'gameSchedule',
      gameId: 'game5',
      isActive: true,
      availableFrom: new Date().toISOString(), // Available immediately
      availableUntil: null // No end date set
    });

    console.log('Game 5 schedule created successfully:', game5Schedule._id);
    console.log('Game 5 is now available immediately');
  } catch (error) {
    console.error('Error creating Game 5 schedule:', error);
  }
}

// Run the function
addGame5Schedule(); 