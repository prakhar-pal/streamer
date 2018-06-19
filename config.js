const pathModule = require('path');
module.exports = {
	path:"/home/pp/Downloads/",
	/* to move back to parent folder in server side*/
	setParent:function(){
		this.path = pathModule.join(this.path,'..');
	}
}
