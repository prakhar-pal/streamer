/**
 * Author: Prakhar Pal(https://github.com/lawki)
 * Created On: 26-09-2018
 */
const fs = require('fs');
const path = require('path');

/*
	This function prints messages for fact checking. Use this in place of console.log() to make those messages 
	easily toggable.
*/
const print = function(data){
	// console.log(data);
}
const listFilesAndDirs = function(dir)
{
	print('inside listFilesAndDirs():');
	let out = {
		files:[],
		directories:[]
	};
	let fad = fs.readdirSync(dir); /*fad=files and directory*/
	fad.forEach(function(fName){
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
		e.g. node_modules, android project folders etc. might not be desired as output.
*/
const makeTree = function(dir,ignoreWords)
{
	if(!Array.isArray(ignoreWords)){
		throw new Error("ignoreWords is not an array.");
		return;
	}
	print("inside makeTree()");
	let areIgnoreWordsPresent = false;
	let _this = this;
	let cDir = path.basename(dir); //Get current working directory. E.g. for /home/user/Downloads it is 'Downloads'
	print("current directory is :"+dir);
	print("Words to ignore are:"+ignoreWords);
	for(var i=0;i<ignoreWords.length;i++)
	{
		let word = ignoreWords[i];
		if(cDir.includes(word))
		{
			print("found pattern for "+word+" in dir "+cDir);
			_this.areIgnoreWordsPresent = true;
			return {};
		}
	}
	if(areIgnoreWordsPresent){
		console.log(`ERROR for ${dir}`);
		return ;
	}
	//print('listing files for:'+dir)
	let root = listFilesAndDirs(dir);
	root.directories && root.directories.forEach(function(directory)
	{
		root[directory] = makeTree(path.join(dir,directory),ignoreWords)
	})
	return root;
}
/*
TEST CODE.
executed only when called as main module.
NOT executed only when called with require.

*/
if(require.main==module){
	let currentDir = process.cwd();
	try{
		let ignore = [
			'node',
			'.cache',
			'.git'
		];
		//ignore = {};
		print(`root directory is ${currentDir}`);
		let outputTree = JSON.stringify(makeTree(currentDir,ignore),null,2);
		// fs.writeFile(path.join(currentDir,'tree.txt'),outputTree,function(err)
		// {
		// 	print(err);
		// })
		console.log(outputTree);
	}
	catch(e){
		//print(JSON.stringify(makeTree(currentDir),null,2));
		console.log('ERROR!: '+e);
	}
}

module.exports = makeTree;