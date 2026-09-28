const fs = require('fs');
const content = fs.readFileSync('client/lib/espo-main.js', 'utf8');
const searchStr = 'views/user/record/edit';
const idx = content.indexOf(searchStr);
if (idx !== -1) {
    console.log(content.substring(idx - 50, idx + 4000));
} else {
    console.log('Not found');
}
