var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
const constants = require('./constants');
const fs = require('fs');
const cors = require('cors');
var {argv} = require('process');
require('jade');
require('amdefine');


var filePath = require('./config.js');
var vidAPI = require('./api/router-videos');
const utils = require('./api/utils/utils');
if(argv[2])
    filePath.path = argv[2];
console.log("The base directory is :"+filePath.path);

var PORT = argv[3]?argv[3]:3000;
if(utils.ifShowLogs())
    console.log('Port for the server is :'+PORT);

var app = express();
app.use(cors());
app.use(logger('tiny'));
app.use('/api',vidAPI);
/**
 * add jade templating engine 
 * */
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

/** render jade templates for particular URL schemes */
app.get('/get/:file',function(req,res){
    var file = decrypt(req.params.file);
    if(!file){
        res.status(404).send('Error decrypting the file name');
        return;
    }
    utils.ifShowLogs() && console.log("decrypted file name :"+file);
    var f = path.join(filePath.path,file);
    utils.ifShowLogs() && console.log('requested file path is '+f);
    
    if(!fs.existsSync(f)){
        res.status(404).send('The file \"'+file+'\" doesn\'t exist on this server');
    }
    else{
        if(fs.statSync(f).isFile()){
            var extension = path.extname(f);
            if(constants.includes(extension)) {
                res.redirect('/'+file);
            }else{
                res.status(404).send('The video format '+extension+" for file \""+file+"\" isn't supported");
            }
        }
        else if(fs.stat(f).isDirectory()){
            var dir = decrypt(req.params.file);
            res.status(404).send("You tried accessing "+dir);
        }
        else{
            res.status(404).send('some error occured.');
        }
    }
});

app.get('/:dir',(req,res)=>{
    if(!req.params.dir){
        res.status(404).send('Got a null/malformed directory');
    }
    var dir = decrypt(req.params.dir);
    if(!dir){
        res.status(404).send('Error while decrypting the file name');
    }
    utils.ifShowLogs() && console.log('requested directory: '+dir);
    var d = path.join(filePath.path,dir);
    if(fs.existsSync(d)){
        if(fs.statSync(d).isDirectory()){
            var files = [];
            var directories =  [];
            var filesEncoded = [];
            var directoriesEncoded = [];
            var contains = fs.readdirSync(d);
            contains.forEach((file)=>{
               var stat = fs.statSync(path.join(filePath.path,dir,file));
               if(stat.isFile()){
                   files.push(file);
                   filesEncoded.push(encrypt(path.join(dir,file)));
               }
               else{
                   directoriesEncoded.push(encrypt(path.join(dir,file)));
                   directories.push(file);
               }
            });
            utils.ifShowLogs() && console.log("Priting the files");
            res.render('listing.jade',{title:'File listing',files:files,dirs:directories,filesEncoded:filesEncoded,dirsEncoded:directoriesEncoded});
        }
        else{
            /**@TODO ? left out from the previous commit */
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
