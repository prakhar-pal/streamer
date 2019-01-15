const path = require('path');
const utils = require('./utils/utils');
const constants = require('../constants');
const { encrypt, decrypt } = require('./encryption');
const makeTree = require('./directory_trees'); //function to get a tree structure from a directory and words to ignore.
const ignoreWords = ['node', '.git', '.cache', 'android'];

module.exports = function (fullFilePath) {
        if (utils.ifShowLogs())
                console.log('Htting new API')
        let treeStructure = makeTree(fullFilePath, ignoreWords);
        let getFileLists = (currentDirEnc, callback) => {
                console.log(`tree structure is ${JSON.stringify(treeStructure,null,2)}`);
                let currentDir = decrypt(currentDirEnc);
                console.log('Directory requested is ', currentDir);
                let outputList = treeStructure;
                let twigPath = currentDir && currentDir.split("/");
                console.log('Twigpath ', twigPath);
                if (Array.isArray(twigPath)) {
                        for (let i = 0; i < twigPath.length; i++) {
                                if (!outputList)
                                        break;
                                else if (twigPath[i] === ".") break;
                                else {
                                        outputList = outputList[twigPath[i]];
                                }
                        }
                        console.log(`outputList ${JSON.stringify(outputList,null,2)}`);
                        if (typeof outputList !== "object") {
                                callback(new Error("NOT FOUND!"));
                                return;
                        }
                        let files = outputList.files && outputList.files
                                .filter(file => {
                                        let fileExtenstion = path.extname(file);
                                        return constants.ACCEPTABLE_MEDIA_EXTENSIONS.indexOf(fileExtenstion) > -1;
                                })
                                .map((file) => {
                                        return { name: file, nameEncoded: encrypt(path.join(currentDir, file)), file: true }
                                });
                        let dirs = outputList.directories && outputList.directories
                                        .map((dir) => {
                                        return { name: dir, nameEncoded: encrypt(path.join(currentDir, dir)), file: false }
                        });
                        var data = {
                                title: 'File listing',
                                files: files,
                                directories: dirs
                        };
                        console.log('data:', JSON.stringify(data, null, 2));
                        callback(null, data);
                } else {
                        /**Either dir doesn't exist or twigPath is malformed/unacceptable form and hence return an error */
                        callback(new Error("Either directory doesn't exist or some other error occured"));
                }
        }
        let getFileUrl = (currentFileEnc, callback) => {
                let currentFile = decrypt(currentFileEnc);
                if(!currentFile){
                        callback(new Error("Unable to decrypt file name"));
                        return;
                }else
                        callback(null,{url:currentFile,extension:path.extname(currentFile)});
                console.log(`file is ${currentFile}`);
        }
        let searchFiles = () => {
                callback(new Error("Testing"));
        }
        let operations = {
                getFileLists,
                getFileUrl,
                searchFiles
        }
        return operations;
}