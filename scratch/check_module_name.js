const fs = require('fs');
const content = fs.readFileSync('client/lib/espo-main.js', 'utf8');
const searchStr = 'views/fields/password';
let idx = 0;
while ((idx = content.indexOf(searchStr, idx)) !== -1) {
    console.log('Index:', idx);
    console.log(content.substring(idx - 50, idx + 200));
    idx += searchStr.length;
}
