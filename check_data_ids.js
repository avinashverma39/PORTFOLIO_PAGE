const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const cvHtml = fs.readFileSync('cv.html', 'utf8');
const js = fs.readFileSync('index.js', 'utf8');
const animJs = fs.readFileSync('animations.js', 'utf8');
const css = fs.readFileSync('index.css', 'utf8');

console.log('=== Checking HTML Elements & IDs ===');

// Check all data-project-id in index.html vs projectsData in index.js
const projectIdsInHtml = [...html.matchAll(/data-project-id=["']([^"']+)["']/g)].map(m => m[1]);
const projectIdsInJs = [...js.matchAll(/id:\s*['"](project-[^'"]+)['"]/g)].map(m => m[1]);
console.log('Project IDs in HTML:', [...new Set(projectIdsInHtml)]);
console.log('Project IDs in JS:', [...new Set(projectIdsInJs)]);
const missingProjectIds = [...new Set(projectIdsInHtml)].filter(id => !projectIdsInJs.includes(id));
console.log('Missing Project IDs:', missingProjectIds);

// Check all data-achievement-id in index.html vs achievementsData in index.js
const achieveIdsInHtml = [...html.matchAll(/data-achievement-id=["']([^"']+)["']/g)].map(m => m[1]);
const achieveIdsInJs = [...js.matchAll(/id:\s*['"]((?:cert-|course-|award-|Summer-|Hack-|SIH-)[^'"]+)['"]/g)].map(m => m[1]);
console.log('Achievement IDs in HTML:', [...new Set(achieveIdsInHtml)]);
console.log('Achievement IDs in JS:', [...new Set(achieveIdsInJs)]);
const missingAchieveIds = [...new Set(achieveIdsInHtml)].filter(id => !achieveIdsInJs.includes(id));
console.log('Missing Achievement IDs:', missingAchieveIds);

// Check all data-resource-id in index.html vs resourcesData in index.js
const resIdsInHtml = [...html.matchAll(/data-resource-id=["']([^"']+)["']/g)].map(m => m[1]);
const resIdsInJs = [...js.matchAll(/id:\s*['"](res-[^'"]+)['"]/g)].map(m => m[1]);
console.log('Resource IDs in HTML:', [...new Set(resIdsInHtml)]);
console.log('Resource IDs in JS:', [...new Set(resIdsInJs)]);
const missingResIds = [...new Set(resIdsInHtml)].filter(id => !resIdsInJs.includes(id));
console.log('Missing Resource IDs:', missingResIds);
