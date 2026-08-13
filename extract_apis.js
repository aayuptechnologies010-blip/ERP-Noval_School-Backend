const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const indexFile = path.join(__dirname, 'index.js');

// 1. Read index.js to get route mappings
const indexContent = fs.readFileSync(indexFile, 'utf8');
const routeMappings = [];
const appUseRegex = /app\.use\(['"](\/api\/[^'"]+)['"],\s*require\(['"]\.\/routes\/([^'"]+)['"]\)/g;
let match;
while ((match = appUseRegex.exec(indexContent)) !== null) {
  routeMappings.push({
    basePath: match[1],
    filename: match[2] + '.js'
  });
}

const apiCollection = [];

// 2. Parse each route file
routeMappings.forEach(mapping => {
  const filePath = path.join(routesDir, mapping.filename);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract router.route('/path').get(...).post(...)
  const routeRegex = /router\.route\(['"]([^'"]+)['"]\)([\s\S]*?)(?=router\.route|module\.exports|router\.(?:get|post|put|delete))/g;
  let routeMatch;
  
  const extractedRoutes = [];
  
  while ((routeMatch = routeRegex.exec(content)) !== null) {
    let relativePath = routeMatch[1];
    if (relativePath === '/') relativePath = '';
    const methodsStr = routeMatch[2];
    
    const methodsRegex = /\.(get|post|put|delete|patch)\(/g;
    let methodMatch;
    while ((methodMatch = methodsRegex.exec(methodsStr)) !== null) {
      extractedRoutes.push({
        method: methodMatch[1].toUpperCase(),
        path: mapping.basePath + (relativePath.startsWith('/') ? relativePath : '/' + relativePath)
      });
    }
  }
  
  // Extract direct router.get('/path', ...)
  const directRouteRegex = /router\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/g;
  let directMatch;
  while ((directMatch = directRouteRegex.exec(content)) !== null) {
    const method = directMatch[1].toUpperCase();
    let relativePath = directMatch[2];
    if (relativePath === '/') relativePath = '';
    extractedRoutes.push({
      method: method,
      path: mapping.basePath + (relativePath.startsWith('/') ? relativePath : '/' + relativePath)
    });
  }

  // clean up paths
  extractedRoutes.forEach(r => {
    r.path = r.path.replace(/\/+/g, '/');
    if (r.path.endsWith('/')) r.path = r.path.slice(0, -1);
    apiCollection.push(r);
  });
});

// Remove duplicates if any
const uniqueCollection = [];
const seen = new Set();
apiCollection.forEach(api => {
  const key = `${api.method} ${api.path}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueCollection.push(api);
  }
});

// Group by base path for better readability
const groupedApis = {};
uniqueCollection.forEach(api => {
  const basePathMatch = api.path.match(/^(\/api\/[^\/]+)/);
  const group = basePathMatch ? basePathMatch[1] : 'other';
  if (!groupedApis[group]) groupedApis[group] = [];
  groupedApis[group].push(api);
});

fs.writeFileSync(path.join(__dirname, 'all_apis.json'), JSON.stringify(groupedApis, null, 2));
console.log('Saved APIs to all_apis.json');
