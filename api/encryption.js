var crypto = require('crypto');
    algorithm = 'aes-192-ctr';
    password = 'd6F3Efeq';
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
module.exports = {
  encrypt:encrypt,
  decrypt:decrypt,
}