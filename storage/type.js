var fs = require('fs');
var path = require('path')

var loc = "/home/pp/Coding/xjs/mean_stack/streamer/";
var files = fs.readdirSync(loc);
files.forEach((f)=>{
    var stat = fs.statSync(path.join(loc,f))
	if(stat.isFile())
		console.log(f+" is file");
	else
		console.log(f+" is a directory");
})
