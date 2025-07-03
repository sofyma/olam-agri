import { execSync } from 'child_process';

console.log('Starting duplicate cleanup process...');

try {
  // First, let's see what documents we have
  console.log('\n1. Checking all game result documents...');
  const allDocs = execSync('npx sanity documents query "*[_type == \'gameResult\'] {_id, user->{_id, displayName}, game1, game2, game3}"', { encoding: 'utf8' });
  const documents = JSON.parse(allDocs);
  console.log(`Found ${documents.length} documents`);
  
  // Group documents by user
  const userGroups = new Map();
  
  documents.forEach(doc => {
    const userId = doc.user._id;
    if (!userGroups.has(userId)) {
      userGroups.set(userId, []);
    }
    userGroups.get(userId).push(doc);
  });
  
  console.log(`\n2. Found ${userGroups.size} unique users`);
  
  // Process duplicates
  let processedCount = 0;
  for (const [userId, docs] of userGroups) {
    if (docs.length > 1) {
      console.log(`\nProcessing user: ${docs[0].user.displayName} (${docs.length} documents)`);
      
      // Find the document with the most game data
      const mainDoc = docs.reduce((main, current) => {
        const mainGames = [main.game1, main.game2, main.game3].filter(Boolean).length;
        const currentGames = [current.game1, current.game2, current.game3].filter(Boolean).length;
        return currentGames > mainGames ? current : main;
      });
      
      console.log(`Main document: ${mainDoc._id}`);
      
      // Delete other documents
      for (const doc of docs) {
        if (doc._id !== mainDoc._id) {
          console.log(`Deleting duplicate: ${doc._id}`);
          try {
            execSync(`npx sanity documents delete ${doc._id}`, { stdio: 'inherit' });
            processedCount++;
          } catch (deleteError) {
            console.log(`Failed to delete ${doc._id}: ${deleteError.message}`);
          }
        }
      }
    }
  }
  
  console.log(`\nCleanup completed! Processed ${processedCount} duplicate documents.`);
  
} catch (error) {
  console.error('Error during cleanup:', error.message);
} 