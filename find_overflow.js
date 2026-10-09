const fs = require('fs');
const css = fs.readFileSync('index.css', 'utf8');

// Find fixed widths >= 500px that might cause horizontal overflow on mobile screens
const largeWidths = [...css.matchAll(/([^{}]+)\{[^}]*width:\s*([5-9][0-9]{2}|[1-9][0-9]{3})px[^}]*\}/g)].map(m => ({
  selector: m[1].trim().split('\n').pop(),
  width: m[2] + 'px'
}));

console.log('Selectors with fixed width >= 500px:');
console.log(largeWidths);
