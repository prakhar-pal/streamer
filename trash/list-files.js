var fs = require('fs');
function listFilesAndDirs(baseDir,callback){ 
	/*list files/dirs in the baseDir*/
	fs.readdir(baseDir,function(err,files){
		if(err){
			callback(err);
		}
		callback(null,files);
	})
}
function listFiles(baseDir,callback){
	var outFiles = []; /*return this variable as output*/
	listFilesAndDirs(baseDir,(err,files)=>{
		if(err)
		{
			callback(err);
		}
		else
		{
			files.forEach((file)=>
			{
				var f = path.join(baseDir,file);
				fs.stat(f,(err,stats)=>
				{
					if(stats.isDirectory()){

					}
					else
					{
						outFiles.push(f);
					}
				})
			})
		}
	})
}