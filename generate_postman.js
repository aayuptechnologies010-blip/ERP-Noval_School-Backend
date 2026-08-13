const fs = require('fs');
const path = require('path');

const allApisFile = path.join(__dirname, 'all_apis.json');
const allApis = JSON.parse(fs.readFileSync(allApisFile, 'utf8'));

const collection = {
  info: {
    name: "ERP School_Soft API",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: []
};

// Common dummy bodies based on route hints
function getDummyBody(routePath, method) {
  if (method === 'GET' || method === 'DELETE') return null;
  
  let rawBody = "{\n  \n}";
  
  if (routePath.includes('login')) {
    rawBody = "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"password123\"\n}";
  } else if (routePath.includes('admin/register')) {
    rawBody = "{\n  \"name\": \"Admin Name\",\n  \"email\": \"admin@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"admin\"\n}";
  } else if (routePath.includes('sms')) {
    rawBody = "{\n  \"subject\": \"Test Subject\",\n  \"message\": \"Test message\",\n  \"sendTo\": \"Student\"\n}";
  } else if (routePath.includes('credentials')) {
    rawBody = "{\n  \"sendVia\": \"SMS\",\n  \"sendToType\": \"Student\",\n  \"recipients\": [\"ID_HERE\"]\n}";
  } else if (routePath.includes('circulars') || routePath.includes('notices')) {
    rawBody = "{\n  \"title\": \"Sample Title\",\n  \"description\": \"Sample description\",\n  \"sendTo\": \"All User\"\n}";
  } else if (routePath.includes('students')) {
    rawBody = "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"admissionNo\": \"AD123\"\n}";
  }
  
  return {
    mode: "raw",
    raw: rawBody,
    options: {
      raw: {
        language: "json"
      }
    }
  };
}

for (const group in allApis) {
  const folder = {
    name: group.replace('/api/', '').toUpperCase(),
    item: []
  };
  
  allApis[group].forEach(api => {
    // Determine path variables (e.g. /api/roles/:id)
    const urlParts = api.path.split('/');
    const pathVars = [];
    const postmanUrlPath = urlParts.map(part => {
      if (part.startsWith(':')) {
        const varName = part.substring(1);
        pathVars.push({
          key: varName,
          value: "REPLACE_ME"
        });
        return ":" + varName;
      }
      return part;
    });

    const request = {
      method: api.method,
      header: [
        {
          key: "Authorization",
          value: "Bearer {{token}}",
          type: "text"
        },
        {
          key: "Content-Type",
          value: "application/json",
          type: "text"
        }
      ],
      url: {
        raw: `{{base_url}}${api.path}`,
        host: [
          "{{base_url}}"
        ],
        path: postmanUrlPath.filter(p => p !== ""),
        variable: pathVars
      }
    };
    
    const body = getDummyBody(api.path, api.method);
    if (body) {
      request.body = body;
    }
    
    folder.item.push({
      name: `${api.method} ${api.path}`,
      request: request,
      response: []
    });
  });
  
  collection.item.push(folder);
}

// Add collection variables (base_url, token)
collection.variable = [
  {
    key: "base_url",
    value: "http://localhost:5000",
    type: "string"
  },
  {
    key: "token",
    value: "YOUR_JWT_TOKEN_HERE",
    type: "string"
  }
];

fs.writeFileSync(path.join(__dirname, 'ERP_Postman_Collection.json'), JSON.stringify(collection, null, 2));
console.log('Postman collection saved.');
