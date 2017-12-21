var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fs = require('fs');
var crypto = require('crypto');
    algorithm = 'aes-192-ctr';
    password = 'd6F3Efeq';


var filePath = require('./config.js');
console.log(filePath.path+" is the shown directory.");

const getDirs = source => readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
//const getFiles = source => readdirSync(source).map(name => join(source, name)).filter(isFile))

var app = express();

//add jade templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(filePath.path,'')));

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

app.get('/index',(req,res)=>{
    res.sendFile(__dirname+'/storage/movie.html');
});

app.get('*',(req,res)=>{
    console.log(req.headers);
    res.send('the url didn\'t match.');
})


app.get('/',function(req,res){
        if(fs.existsSync(filePath.path))
        {
             var allFiles = [];//getFiles(filePath.path);
             var directories =  [];//getDirs(filePath.path);
             var contains = fs.readdirSync(filePath.path);
             contains.forEach((file)=>{
                var stat = fs.statSync(path.join(filePath.path,file));
                if(stat.isFile())
                    allFiles.push(encrypt(file));
                else
                    directories.push(encrypt(file));
             })
             console.log("Priting the files");

             for(var i=0;i<allFiles.length;i++)
                console.log(allFiles[i]);
             console.log("Priting the dirs");
             for(var i=0;i<directories.length;i++)
                console.log(directories[i]);

             //console.log("files :\n"+allFiles);
             //console.log("dirs: \n"+directories);
             res.render('listing.jade',{files:allFiles,dirs:directories});
        }
        else{
            res.send('<h1>The config path '+filePath.path+' does not exist</h1>');
        }
    })

app.get('/get/:file',function(req,res){
    console.log('encrypted file name: '+req.params.file);
    //res.send('get/file request.');
    var file = decrypt(req.params.file);
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
                       res.render('video',{file:file});
                       break;
            default:
                       res.send('The video format '+extension+" for file \""+file+"\" isn't supported");
            }

        }
        else if(fs.stat(f).isDirectory())
        {
            res.send('this is a directory');
        }
        else
        {
            res.send('some error occured.');
        }

    }
})
app.get('/index',function(req,res){
    res.sendFile('./index.html');
})

app.listen(3000,function(){
    console.log("started the server!");
})
