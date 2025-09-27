// --- Imports ---
const fs = require('fs');
const path = require('path');

// --- File Paths ---
const jsonPath = path.join(__dirname, 'data/users.json');
const pbPath = path.join(__dirname, 'data/users.pb');

// --- Get Sizes ---
const jsonSize = fs.statSync(jsonPath).size;
const pbSize = fs.statSync(pbPath).size;

console.log('📊 File Sizes:');
console.log('JSON:', (jsonSize / 1024).toFixed(2), 'KB');
console.log('Protobuf:', (pbSize / 1024).toFixed(2), 'KB');
console.log('Compression ratio:', (pbSize / jsonSize * 100).toFixed(2), '%');
