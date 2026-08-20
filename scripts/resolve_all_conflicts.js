const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.scss')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('frontend-ionic/src');

let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('<<<<<<< HEAD')) {
        console.log('Resolving conflicts in', file);
        // Replace <<<<<<< HEAD ... ======= with nothing
        content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n?/g, '');
        // Replace >>>>>>> [hash] with nothing
        content = content.replace(/>>>>>>> .*\r?\n?/g, '');
        fs.writeFileSync(file, content, 'utf8');
        count++;
    }
});
console.log('Resolved conflicts in', count, 'files');
