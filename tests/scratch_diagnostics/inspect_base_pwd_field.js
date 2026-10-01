const fs = require('fs');
const content = fs.readFileSync('client/lib/espo-main.js', 'utf8');
const searchStr = 'define("views/fields/password"';
const idx = content.indexOf(searchStr);
if (idx !== -1) {
    console.log(content.substring(idx, idx + 2500));
} else {
    console.log('Not found');
}
