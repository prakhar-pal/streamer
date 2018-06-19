var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const sendSeekable = require('send-seekable');
var {argv} = require('process');
require('jade');
require('amdefine');


var filePath = require('./config.js');
var vidAPI = require('./api/router-videos');
const {encrypt, decrypt} = require('./api/encryption.js');
if(argv[2])
    filePath.path = argv[2];
console.log("The base directory is :"+filePath.path);

var PORT = argv[3]?argv[3]:3000;

//console.log('Port for the server is :'+PORT);

//const getDirs = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
//const getFiles = source => readdirSync(source).map(name => join(source, name)).filter(isFile))

var app = express();
app.use(cors());
app.use(function(req,res,next){
    //url = req.url;
    //console.log('requested url: '+url);
    // if(url.search('.flv')!=-1){
    //     res.contentType('video/x-flv');
    // }
    next();
})
app.use('/api',vidAPI);
// app.use(sendSeekable);

//add jade templating engine
app.get('/flv',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','flv-test.html'));
})
app.get('/mkv',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','mkv.html'));
})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(filePath.path));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/angular_ui'));
app.use('/static',express.static(filePath.path));

/* serve the UI*/
app.get('/',function(req,res){
        res.sendFile('index.html');
});

app.get('/get/:file',function(req,res){
    //console.log('encrypted file name: '+req.params.file);
    //res.send('get/file request.');
    //console.log(JSON.stringify(req.headers));
    var file = decrypt(req.params.file);
    if(!file)
    {
        res.status(404).send('Error decrypting the file name');
    }
    console.log("decrypted file name :"+file);
    var f = path.join(filePath.path,file);
    console.log('requested file path is '+f);
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
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.bmp':
            case '.gif':
                        //const buf  = new Buffer('Weave a circle round him thrice');
                       //res.render('video',{title:file,file:'http://localhost:3000/'+file});
                       res.redirect('/'+file);
                       //res.send(buf);
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
    console.log("started the server on "+PORT);
})
