var router = require('express').Router();
const fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var filePath = require('../config.js');
const API = require('./api2.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

//route for getting list of files in the directory(encoded) sent using post request
router.post('/get_files_list',(req,res)=>{
    console.log(JSON.stringify(req.body,null,2));
    var dir = req.body.dirEnc;
    API.getFileLists(dir,function(err,data){
        if(err)
        {
            res.json({success:false,data:err});
        }
        else
        {
            res.json({success:true,data:data});
        }
    })
});

//route for getting file's url with encoded file name sent using post request
router.post('/get_file_url',(req,res)=>{
    console.log(JSON.stringify(req.body,null,2));
    var fileEnc = req.body.fileEnc;
    API.getFileUrl(fileEnc,(err,data)=>{
        if(err)
        {
            res.json({success:false,data:err});
        }
        else
        {
            res.json({success:true,data:data});
        }
    })
});

router.post('/search',(req,res)=>{
    var pattern = req.body.pattern;
    console.log('searching for: '+pattern);
    API.searchFiles(pattern,(err,data)=>{
        if(err)
        {
            res.json({success:false,message:err});
        }
        else{
            res.json({success:true,data:data});
        }
    })
})

// router.get('/files',(req,res)=>{
//     if(fs.existsSync(filePath.path))
//     {
//          var files = [];//getFiles(filePath.path);
//          var directories =  [];//getDirs(filePath.path);
//          var filesEncoded = [];
//          var directoriesEncoded = [];
//          var contains = fs.readdirSync(filePath.path);
//          contains.forEach((file)=>{
//             var stat = fs.statSync(path.join(filePath.path,file));
//             if(stat.isFile())
//             {
//                 files.push(file);
//             }
//             else
//             {
//                 //directoriesEncoded.push(encrypt(file));
//                 directories.push(file);
//             }
//          });
//          //console.log("Priting the files");

//          //for(var i=0;i<files.length;i++)
//             //console.log(files[i]);
//          //console.log("Priting the dirs");
//          //for(var i=0;i<directories.length;i++)
//          //   console.log(directories[i]);
//          var data = {
//                     success:true,
//                     title:'File listing',
//                     files:files,
//                     dirs:directories,
//                     };
//         console.log(data);
//          res.json(data);
//     }
//     else{
//         res.json({success:false});
//     }
// });

// router.get('/:file',(req,res)=>{
//     var file = req.params.file;
//     var f = path.join(filePath.path,file);
//     console.log('requested file path is '+f);
//     if(!fs.existsSync(f))
//     {
//         res.json({success:false,message:'The file \"'+file+'\" doesn\'t exist on this server'});
//     }
//     else
//     {
//         if(fs.statSync(f).isFile())
//         {
//             var extension = path.extname(f);  //gets the extension of the file name
//             switch(extension) {
//             case '.mp4':
//             case '.webm':
//                        res.json({success:true,url:'/'+file});
//                        break;
//             default:
//                        res.json({
//                                 success:false,
//                                 message:'The format '+extension+" for file \""+file+"\" isn't supported"
//                             });
//             }

//         }
//         else if(fs.stat(f).isDirectory())
//         {
//             var dir = decrypt(req.params.file);
//             console.log('you accessed '+dir);
//         }
//         else
//         {
//             res.send('some error occured.');
//         }

//     }
// });

module.exports = router;
