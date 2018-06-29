const fs = require('fs');
const path = require('path');

const print = function(data){console.log(data);}
const listFilesAndDirs = function(dir)
{
	let out = {
		files:[],
		directories:[]
	};
	let fad = fs.readdirSync(dir); /*fad=files and directory*/
	fad.forEach(
		function(fName)
		{
			let f = path.join(dir,fName);
			let stat = null;
			try
			{
				stat = fs.statSync(f);
			}catch(e)
			{
				return;
			}
			if(stat.isDirectory())
			{
				out.directories.push(fName);
			}
			else
			{
				out.files.push(fName);
			}
		});
	return out;
}
/*
INPUT:
	1)dir: absolute directory path for which the tree is to be made
	2)ignoreWords: an array of words; if contained in a directory, that directory will be ignored.
		e.g. node_modules, android project folders etc. might not be desired at the front end.
*/
const makeTree = function(dir,ignoreWords)
{
	Object.prototype.toString.call(ignoreWords)=='[object Array]' && ignoreWords.forEach((ignoreWord)=>
	{
		if(dir.indexOf(ignoreWord)!=-1)
			return {};
	});
	//print('root is:'+dir);
	let root = listFilesAndDirs(dir);
	root.directories && root.directories.forEach(function(directory)
	{
		root[directory] = makeTree(path.join(dir,directory),ignoreWords)
	})
	return root;
}
let currentDir = process.cwd();
try{
	let ignore = [
		'node_modules'
	];
	let outputTree = JSON.stringify(makeTree(currentDir),null,2);
	// fs.writeFile(path.join(currentDir,'tree.txt'),outputTree,function(err)
	// {
	// 	print(err);
	// })
	print(outputTree);
}
catch(e){
	//print(JSON.stringify(makeTree(currentDir),null,2));
	console.log('ERROR!: '+e);
}