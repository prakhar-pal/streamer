var router = require('express').Router();
var bodyParser = require('body-parser');

const filePath = require('../config.js');
const utils = require('./utils/utils');
let api;
const MODE = require('../constants');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));
let process = require('process');
let mode = process.env.MODE;
utils.ifShowLogs() && console.log(`mode of operation is ${mode}`);
if(mode==MODE.FAST_MODE){
    api = require('./api.js')(filePath.path);
}else{
    api = require('./api2.js');
}
const API = api;
/** 
 * route for getting list of files in the directory(encoded) sent using post request 
 */
router.post('/get_files_list',(req,res)=>{
    console.log('POST: /get_files_list: ',JSON.stringify(req.body,null,2));
    var dir = req.body.dirEnc;    
    API.getFileLists(dir,function(err,data){
        if(err)
            res.json({success:false,data:err});
        else
            res.json({success:true,data:data});
    })
});

/**
 * route for getting file's url with encoded file name sent using post request
 * */
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
    if(mode==MODE.FAST_MODE){

    }else{
        API.searchFiles(pattern,(err,data)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else{
                res.json({success:true,data:data});
            }
        });
    }
});

module.exports = router;
