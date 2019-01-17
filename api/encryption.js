const utils = require('./utils/utils');
var crypto = require('crypto');
    algorithm = 'aes-256-cbc';
    password = 'd6F3Efeq';
var encrypt = function (text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  let showLogs = utils.ifShowLogs();
  console.log('showLogs? ',showLogs);
  utils.ifShowLogs() && console.log(`encrypt():: input=${text}, output=${crypted}`);
  return crypted;
}

var decrypt = function (text){
    try
    {
      utils.ifShowLogs() && console.log('trying to decrypt ',text);
      var decipher = crypto.createDecipher(algorithm,password)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
    }
    catch(err){
        return null;
    }
}
if(require.main==module){
  console.log(`${process.argv[1]} is being run as module.`);
  /**
   * @Test 
   * whether encryption works
   */
  let payload = process.argv[2] || "lorem ipsum idt";
  let encryptedPayload, decryptedPayload;
  try{
      encryptedPayload = encrypt(payload);
  }catch(err){
      console.log("Encryption failed: ",err);
      return;
  }
  /**
   * @Test 
   * whether decryption works
   */
  try{
      decryptedPayload = decrypt(encryptedPayload);
  }catch(err){
      console.log("Decryption failed: ",err);
      return;
  }
  if(payload !== decryptedPayload){
    console.log("Whole module failed.");
  }else{
    console.log(`Original data = ${payload}, 
               encrypted payload = ${encryptedPayload},
               decrypted payload = ${decryptedPayload}`);
    console.log("SUCCESS!!");
  }

}

module.exports = {
  encrypt:encrypt,
  decrypt:decrypt,
}