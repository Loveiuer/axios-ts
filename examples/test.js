const fs = require('fs')
const path = require('path')

console.log(fs.readdirSync(__dirname));
const fullDir = path.join(__dirname, 'simple')
const entry = path.join(fullDir, 'app.ts')
console.log(fs.statSync(fullDir).isDirectory() && fs.existsSync(entry));