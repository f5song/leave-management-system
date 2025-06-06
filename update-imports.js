const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Map of old paths to new paths
const pathMappings = {
  '../../src/database/': '@database/',
  '../../src/common/': '@common/',
  '../../features/': '@features/',
  '../features/': '@features/',
  '../../../common/': '@common/',
  '../../../database/': '@database/',
  '../../../../database/': '@database/',
};

function updateFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  let updatedContent = content;

  Object.entries(pathMappings).forEach(([oldPath, newPath]) => {
    updatedContent = updatedContent.replace(new RegExp(`from\s*['"]${oldPath}`, 'g'), `from '${newPath}`);
  });

  if (updatedContent !== content) {
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`Updated imports in: ${path.relative(__dirname, file)}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      updateFile(fullPath);
    }
  });
}

// Start processing from src directory
processDirectory(srcDir);
console.log('Import path update complete!');
