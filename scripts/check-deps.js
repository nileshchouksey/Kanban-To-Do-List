#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

function checkDependencies(dir, name) {
  const nodeModules = path.join(dir, 'node_modules');
  const packageJson = path.join(dir, 'package.json');
  
  if (!fs.existsSync(packageJson)) {
    console.log(`⚠️  ${name}: No package.json found`);
    return false;
  }
  
  if (!fs.existsSync(nodeModules)) {
    console.log(`❌ ${name}: node_modules not found`);
    return false;
  }
  
  console.log(`✅ ${name}: Dependencies installed`);
  return true;
}

console.log('Checking dependencies...\n');

const rootOk = checkDependencies(rootDir, 'Root');
const serverOk = checkDependencies(serverDir, 'Server');
const clientOk = checkDependencies(clientDir, 'Client');

if (!rootOk || !serverOk || !clientOk) {
  console.log('\n⚠️  Some dependencies are missing. Run: npm run install:all');
  process.exit(1);
}

console.log('\n✅ All dependencies are installed!');
process.exit(0);

