let fs = require('fs');
let path = require('path');

let loc = './storage/type.js';
var stat = fs.statSync(loc);

//console.log(stat);
fs.readdirSync('./storage').forEach((file)=>{
    console.log(fs.statSync(loc).ino);
})

