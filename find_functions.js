const fs = require('fs');

const indexJs = fs.readFileSync('index.js', 'utf8');
const animJs = fs.readFileSync('animations.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Find all IIFEs in index.js and animations.js
const iifeRegex = /\(\s*(?:async\s*)?function\s*([a-zA-Z0-9_$]*)\s*\(/g;
let match;
console.log('--- IIFEs in index.js ---');
while ((match = iifeRegex.exec(indexJs)) !== null) {
  console.log(match[1] || 'anonymous', 'at pos', match.index);
}

// Find all functions in index.js
const funcRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
console.log('\n--- Named functions in index.js ---');
while ((match = funcRegex.exec(indexJs)) !== null) {
  console.log(match[1]);
}
