import { execSync } from 'child_process';

console.log('Adding game configuration documents...');

try {
  // Create Game 1 config
  console.log('\n1. Creating Game 1 configuration...');
  const game1Config = {
    _type: 'gameSchedule',
    gameId: 'game1',
    isActive: true,
    availableFrom: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    availableUntil: new Date('2024-12-31T23:59:59.999Z').toISOString()
  };
  
  execSync(`npx sanity documents create --json '${JSON.stringify(game1Config)}'`, { stdio: 'inherit' });
  
  // Create Game 2 config
  console.log('\n2. Creating Game 2 configuration...');
  const game2Config = {
    _type: 'gameSchedule',
    gameId: 'game2',
    isActive: true,
    availableFrom: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    availableUntil: new Date('2024-12-31T23:59:59.999Z').toISOString()
  };
  
  execSync(`npx sanity documents create --json '${JSON.stringify(game2Config)}'`, { stdio: 'inherit' });
  
  // Create Game 3 config
  console.log('\n3. Creating Game 3 configuration...');
  const game3Config = {
    _type: 'gameSchedule',
    gameId: 'game3',
    isActive: true,
    availableFrom: new Date('2024-01-01T00:00:00.000Z').toISOString(),
    availableUntil: new Date('2024-12-31T23:59:59.999Z').toISOString()
  };
  
  execSync(`npx sanity documents create --json '${JSON.stringify(game3Config)}'`, { stdio: 'inherit' });
  
  console.log('\n✅ All game configurations created successfully!');
  console.log('Games are now active from January 1, 2024 to December 31, 2024');
  
} catch (error) {
  console.error('Error creating game configurations:', error.message);
} 