var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fs = require('fs');
var {argv} = require('process');
var crypto = require('crypto');
    algorithm = 'aes-192-ctr';
    password = 'd6F3Efeq';

var jade = require('jade');
var amdefine = require('amdefine');


var filePath = require('./config.js');
if(argv[2])
    filePath.path = argv[2];
console.log("The base directory is :"+filePath.path);

var PORT = argv[3]?argv[3]:3000;

console.log('Port for the server is :'+PORT);

//const getDirs = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
//const getFiles = source => readdirSync(source).map(name => join(source, name)).filter(isFile))

var app = express();

//add jade templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(filePath.path));

var encrypt = function (text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

var decrypt = function (text){
    try
    {
      var decipher = crypto.createDecipher(algorithm,password)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
    }
    catch(err){
        //console.log(err);
        return null;
    }
}


app.get('/',function(req,res){
        if(fs.existsSync(filePath.path))
        {
             var files = [];//getFiles(filePath.path);
             var directories =  [];//getDirs(filePath.path);
             var filesEncoded = [];
             var directoriesEncoded = [];
             var contains = fs.readdirSync(filePath.path);
             contains.forEach((file)=>{
                var stat = fs.statSync(path.join(filePath.path,file));
                if(stat.isFile())
                {
                    files.push(file);
                    filesEncoded.push(encrypt(file));
                }
                else
                {
                    directoriesEncoded.push(encrypt(file));
                    directories.push(file);
                }
             });
             console.log("Priting the files");

             for(var i=0;i<files.length;i++)
                console.log(files[i]);
             console.log("Priting the dirs");
             for(var i=0;i<directories.length;i++)
                console.log(directories[i]);
             res.render('listing.jade',{title:'File listing',files:files,dirs:directories,filesEncoded:filesEncoded,dirsEncoded:directoriesEncoded});
        }
        else{
            res.send('<h1>The config path '+filePath.path+' does not exist</h1>');
        }
    })

app.get('/get/:file',function(req,res){
    console.log('encrypted file name: '+req.params.file);
    //res.send('get/file request.');
    var file = decrypt(req.params.file);
    if(!file)
    {
        res.status(404).send('Error decrypting the file name');
    }
    console.log("decrypted file name :"+file);
    var f = path.join(filePath.path,file);
    console.log('file path is '+f);
    if(!fs.existsSync(f))
    {
        res.send('The file \"'+file+'\" doesn\'t exist on this server');
    }
    else
    {
        if(fs.statSync(f).isFile())
        {
            var extension = path.extname(f);  //gets the extension of the file name
            switch(extension) {
            case '.mp4':
            case '.webm':
                       res.render('video',{title:file,file:'http://localhost:3000/'+file});
                       break;
            default:
                       res.send('The video format '+extension+" for file \""+file+"\" isn't supported");
            }

        }
        else if(fs.stat(f).isDirectory())
        {
            var dir = decrypt(req.params.file);
            console.log('you accessed '+dir);
        }
        else
        {
            res.send('some error occured.');
        }

    }
})

app.get('/:dir',(req,res)=>{
    if(!req.params.dir)
    {
        res.send('Got a null/malformed directory');
    }
    var dir = decrypt(req.params.dir);
    if(!dir)
    {
        res.status(404).send('Error while decrypting the file name');
    }
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
               var stat = fs.statSync(path.join(filePath.path,dir,file));
               if(stat.isFile())
               {
                   files.push(file);
                   filesEncoded.push(encrypt(path.join(dir,file)));
               }
               else
               {
                   directoriesEncoded.push(encrypt(path.join(dir,file)));
                   directories.push(file);
               }
            });
            console.log("Priting the files");

            for(var i=0;i<files.length;i++)
               console.log(files[i]);
            console.log("Priting the dirs");
            for(var i=0;i<directories.length;i++)
               console.log(directories[i]);
            res.render('listing.jade',{title:'File listing',files:files,dirs:directories,filesEncoded:filesEncoded,dirsEncoded:directoriesEncoded});

        }
        else{

        }

    }
    else{
        res.header(404).send('The URL is invalid');
    }
})
app.get('/index',function(req,res){
    res.sendFile('./index.html');
})

app.listen(PORT,function(){
    console.log("started the server!");
})
