const path = require('path');
const fs = require('fs');
const walk = require('walk');
var {encrypt,decrypt} = require('./encryption.js');
var filePath = require('../config.js');
module.exports = {
	getFileLists:function(currentDir,callback){
        console.log('checking existence for '+currentDir+' directory');
        if(!currentDir)
        {
            callback(new Error('Got a null/malformed directory'),null);
            return;
        }
        var dir = decrypt(currentDir);
        if(!dir || dir==null)
        {
           callback(new Error('Error while decrypting the file name'),null);
           return ;
       }
       console.log('requested directory: '+dir);
       var d = path.join(filePath.path,dir);
       if(fs.existsSync(d))
       {
           if(fs.statSync(d).isDirectory())
           {
                var files = [];//getFiles(filePath.path);
                var directories =  [];//getDirs(filePath.path);
                var filesEncoded = [];
                var directoriesEncoded = [];
                var contains = fs.readdirSync(d);
                contains.forEach((file)=>{
                    var fullPath = path.join(filePath.path,dir,file);
                    var stat = fs.statSync(fullPath);

                    //only send files that are playable in the browser. choose files using their extensions(.mp4,.webm etc)
                    var extension = path.extname(fullPath)
                    if(stat.isFile())
                    {    
                        switch(extension)
                        {
                           case '.mp4':
                           case '.webm':
                           case '.png':
                           case '.jpg':
                           case '.jpeg':
                           case '.bmp':
                           case '.gif':
                           case '.ogg':
                           case '.mkv':
                           files.push({name:file,nameEncoded:encrypt(path.join(dir,file)),file:true});
                           //filesEncoded.push();
                           break;
                           default: break;
                       }
                   }
                   else
                   {
                      //directoriesEncoded.push(encrypt(path.join(dir,file)));
                      directories.push({name:file,nameEncoded:encrypt(path.join(dir,file)),file:false});
                  }
              });
                var data = {
                    title:'File listing',
                    files:files,
                    directories:directories,
                    filesEncoded:filesEncoded,
                    dirsEncoded:directoriesEncoded
                };
                callback(null,data);
            }
        }
        else
        {
            callback(new Error('The directory\" '+d+' \" doesn\'t exist'),null);
        }
    },
    getFileUrl:function(fileEnc,callback){ //receives encrypted file name

        var file = decrypt(fileEnc);
        if(!file)
        {
            callback(new Error('Error decrypting the file name'),null);
        }
        console.log("decrypted file name :"+file);
        var f = path.join(filePath.path,file);
        console.log('requested file path is '+f);
        if(!fs.existsSync(f))
        {
            callback(new Error('The file \"'+file+'\" doesn\'t exist on this server'),null);
        }
        else
        {
            if(fs.statSync(f).isFile())
            {
                var extension = path.extname(f);  //gets the extension of the file name
                switch(extension) 
                {
                    case '.mp4':
                    case '.webm':
                    case '.png':
                    case '.jpg':
                    case '.jpeg':
                    case '.bmp':
                    case '.gif':
                    case '.ogg':
                    case '.mkv':
                        callback(null,{url:'/'+file,extension:extension});  //found the file, sending the url
                        break;
                    default:
                        callback(new Error('The video format '+extension+" for file \""+file+"\" isn't supported"),null);
                }

            }
            else if(fs.stat(f).isDirectory())
            {
                var dir = decrypt(req.params.file);
                console.log('you accessed '+dir);
                callback(new Error('You are trying to access a directory.'),null);
            }
            else
            {
                callback(new Error('Some error occured.'),null);
            }

        }
    },
    searchFiles:function(pattern,callback){
        var files   = []; 
        var outFiles = [];
        //save data as list of objects. Objects being the file name (absolute path) and encoded file name(relative path)
        //e.g. i) abc.png, ii) encode(/images/abc.png)
        // Walker options
        var walker  = walk.walk(filePath.path, { followLinks: true });

        walker.on('file', function(root, stat, next) {
            // Add this file to the list of files
            files.push(root + '/' + stat.name);
            next();
        });

        walker.on('end', function() {
           files.forEach((file)=>{
                var basePath = filePath.path;
                var extension = path.extname(file);
                var fileName = file.replace(basePath,'');
                if(fileName.indexOf(pattern)!=-1){
                    switch(extension) 
                    {
                        case '.mp4':
                        case '.webm':
                        case '.png':
                        case '.jpg':
                        case '.jpeg':
                        case '.bmp':
                        case '.gif':
                        case '.ogg':
                        case '.mkv':
                            var words = fileName.split('/');
                            var name = words[words.length-1];
                            outFiles.push({
                                name:name,
                                nameEncoded:encrypt(fileName),
                                file:true
                            });
                            break;
                    }
                }
                
           }) 
           callback(null,outFiles);
        });
    }

}