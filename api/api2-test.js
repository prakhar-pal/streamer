var api = require('./api2');

/*
//e1ceb29b is ecnrypted directory name
api.getFileLists('e1ceb29b',function(err,data){
	if(err){
		console.log('Error happened: '+err);
	}
	else
	{
		console.log(JSON.stringify(data,null,2));
	}
});
*/
//e1ceb29b737c48fa2c62144f5d4b7f09da1446 encrypted file name
// api.getFileUrl('e0cfba85317b14',function(err,data){
// 	if(err)
// 	{
// 		console.log('Error happened: '+err);
// 	}
// 	else
// 	{
// 		console.log(JSON.stringify(data,null,2));
// 	}
// })

//test search function
api.searchFiles('porn',(err,data)=>{
	console.log("found following files:\n"+JSON.stringify(data,null,2));
})