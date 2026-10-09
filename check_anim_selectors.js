const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const animJs = fs.readFileSync('animations.js', 'utf8');

// Find all selectors passed to gsap.to, gsap.fromTo, anime, querySelector, querySelectorAll
const gsapMatches = [...animJs.matchAll(/gsap\.(?:to|fromTo|set)\(['"]([^'"]+)['"]/g)].map(m => m[1]);
const animeTargets = [...animJs.matchAll(/targets:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const qsMatches = [...animJs.matchAll(/querySelector(?:All)?\(['"]([^'"]+)['"]/g)].map(m => m[1]);
const triggerMatches = [...animJs.matchAll(/trigger:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const allSelectors = [...new Set([...gsapMatches, ...animeTargets, ...qsMatches, ...triggerMatches])];

console.log('Total unique selectors in animations.js:', allSelectors.length);

const results = [];
for (const sel of allSelectors) {
  // Check if sel is a simple class or id or combined
  const parts = sel.split(/[\s,>+~:]+/).filter(Boolean);
  const missingParts = [];
  for (const p of parts) {
    if (p.startsWith('.')) {
      const cls = p.slice(1);
      if (!html.includes(`class="`) || !new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"`).test(html)) {
        missingParts.push(p);
      }
    } else if (p.startsWith('#')) {
      const id = p.slice(1);
      if (!html.includes(`id="${id}"`)) {
        missingParts.push(p);
      }
    }
  }
  if (missingParts.length > 0) {
    results.push({ selector: sel, missing: missingParts });
  }
}

console.log('Selectors with missing elements in index.html:');
console.log(JSON.stringify(results, null, 2));
