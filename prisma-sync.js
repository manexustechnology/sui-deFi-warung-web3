
/**
 * This script is for syncing Prisma schema with an existing database
 * Run with: node prisma-sync.js
 */
const { execSync } = require('child_process');

console.log('Syncing Prisma schema with database...');

try {
  // Pull the current database schema into Prisma
  execSync('npx prisma db pull', { stdio: 'inherit' });
  
  // Generate Prisma client based on the schema
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Prisma sync completed successfully!');
} catch (error) {
  console.error('Error during Prisma sync:', error.message);
  process.exit(1);
}
