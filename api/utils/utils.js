const constants = require('../../constants');
const env = process.env;
function isDev(){
    return env.DEV == constants.DEV;
}
function ifShowLogs(){
    return env.LOGS == constants.SHOW_LOGS;
}
module.exports = {
    isDev, 
    ifShowLogs
}