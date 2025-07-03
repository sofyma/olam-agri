import { createClient } from '@sanity/client';

// Create Sanity client with proper configuration
const client = createClient({
  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production',
  apiVersion: '2024-06-26',
  useCdn: false,
  token: process.env.SANITY_TOKEN // Use environment variable
});

async function cleanupDuplicateUsers() {
  try {
    console.log('Starting cleanup of duplicate user documents...');
    
    // Get all game result documents
    const allResults = await client.fetch(`*[_type == "gameResult"] {
      _id,
      user->{_id, displayName, emailAddress},
      game1,
      game2,
      game3
    }`);
    
    console.log(`Found ${allResults.length} total game result documents`);
    
    // Group by user
    const userGroups = new Map();
    
    allResults.forEach(result => {
      const userId = result.user._id;
      if (!userGroups.has(userId)) {
        userGroups.set(userId, []);
      }
      userGroups.get(userId).push(result);
    });
    
    console.log(`Found ${userGroups.size} unique users`);
    
    // Process each user group
    for (const [userId, documents] of userGroups) {
      if (documents.length > 1) {
        console.log(`\nProcessing user: ${documents[0].user.displayName} (${documents.length} documents)`);
        
        // Find the main document (one with most game data)
        const mainDoc = documents.reduce((main, current) => {
          const mainGames = [main.game1, main.game2, main.game3].filter(Boolean).length;
          const currentGames = [current.game1, current.game2, current.game3].filter(Boolean).length;
          return currentGames > mainGames ? current : main;
        });
        
        console.log(`Main document: ${mainDoc._id}`);
        
        // Merge data from other documents into main document
        for (const doc of documents) {
          if (doc._id !== mainDoc._id) {
            console.log(`Merging document: ${doc._id}`);
            
            const updates = {};
            
            // Merge game1 data
            if (doc.game1 && !mainDoc.game1) {
              updates.game1 = doc.game1;
            }
            
            // Merge game2 data
            if (doc.game2 && !mainDoc.game2) {
              updates.game2 = doc.game2;
            }
            
            // Merge game3 data
            if (doc.game3 && !mainDoc.game3) {
              updates.game3 = doc.game3;
            }
            
            // Update main document if there are changes
            if (Object.keys(updates).length > 0) {
              await client.patch(mainDoc._id).set(updates).commit();
              console.log(`Updated main document with: ${Object.keys(updates).join(', ')}`);
            }
            
            // Delete the duplicate document
            await client.delete(doc._id);
            console.log(`Deleted duplicate document: ${doc._id}`);
          }
        }
      }
    }
    
    console.log('\nCleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupDuplicateUsers(); 