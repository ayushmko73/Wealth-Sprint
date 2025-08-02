#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build process...');

// Change to client directory
process.chdir('client');

console.log('📦 Installing client dependencies...');
try {
  execSync('npm ci', { stdio: 'inherit' });
} catch (error) {
  console.log('📦 Installing with npm install (fallback)...');
  execSync('npm install', { stdio: 'inherit' });
}

console.log('🏗️ Building client application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('✅ Vercel build completed successfully!');

// Verify build output
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  const files = fs.readdirSync(distPath);
  console.log(`📁 Build output contains ${files.length} files/folders:`);
  files.forEach(file => console.log(`   - ${file}`));
} else {
  console.error('❌ Build output directory not found!');
  process.exit(1);
}