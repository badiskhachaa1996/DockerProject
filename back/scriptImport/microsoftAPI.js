var spsave = require("spsave").spsave;
const mongoose = require("mongoose");
var fs = require('fs');
const { User } = require('../models/user.js')

/*get auth options
var credentialOptions = {
    username: "test.admin@estya.com",
    password: "EstyaFR2022"
}

var fileOptions = {
    folder: "Shared Documents/Test",
    fileName: "test.txt",
    fileContent: "JE SUIS UN TEST",
}*/
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        User.find().then(data => {
            let userDic = {}
            data.forEach(u => {
                userDic[u._id] = u.lastname + " " + u.firstname
            })
            let fileList = fs.readdirSync('../storage')
            // storage/prospect/id/filetype/image.png
            fileList.forEach(file => {
                if (fs.lstatSync('../storage/' + file).isDirectory()) {
                    let fileList2 = fs.readdirSync('../storage/' + file)
                    fileList2.forEach(file2 => {
                        if (fs.lstatSync('../storage/' + file + "/" + file2).isDirectory()) {
                            let fileList3 = fs.readdirSync('../storage/' + file + "/" + file2)
                            fileList3.forEach(file3 => {
                                if (fs.lstatSync('../storage/' + file + "/" + file2 + "/" + file3).isDirectory()) {
                                    let fileList4 = fs.readdirSync('../storage/' + file + "/" + file2 + "/" + file3)
                                    fileList4.forEach(file4 => {
                                        if (fs.lstatSync('../storage/' + file + "/" + file2 + "/" + file3 + "/" + file4).isDirectory()) {
                                            console.log('../storage/' + file + "/" + file2 + "/" + file3 + "/" + file4 + "/")
                                        } else {
                                            let fileContent = fs.readFileSync('../storage/' + file + "/" + file2 + "/" + file3 + "/" + file4)
                                            sendFile({
                                                folder: "Shared Documents/" + file + "/" + file2 + "/" + file3,
                                                fileName: file4,
                                                fileContent
                                            }, [file, file2, file3])
                                        }
                                    });
                                } else {
                                    let fileContent = fs.readFileSync('../storage/' + file + "/" + file2 + "/" + file3)
                                    sendFile({
                                        folder: "Shared Documents/" + file + "/" + file2,
                                        fileName: file3,
                                        fileContent
                                    }, [file, file2])
                                }
                            });
                        } else {
                            let fileContent = fs.readFileSync('../storage/' + file + "/" + file2)
                            sendFile({
                                folder: "Shared Documents/" + file,
                                fileName: file2,
                                fileContent
                            }, [file])
                        }
                    });
                } else {
                    console.log('../storage/' + file)
                }
            });
        })
    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });
function sendFile(fileOptions, filePath) {
    var credentialOptions = {
        username: "test.admin@estya.com",
        password: "EstyaFR2022"
    }
    filePath.forEach(file => {
        if (userDic[file]) {
            fileOptions.folder = fileOptions.folder.replace(file, userDic[file])
        }
    })
    spsave({
        siteUrl: "https://elitechgroupe.sharepoint.com/sites/Ims_storage"
    },
        credentialOptions,
        fileOptions
    )
        .then(successHandler => {
            console.log(fileOptions.fileName + " a été envoyé avec succès")
            //console.log(successHandler)
            if (fileList[fileList.length - 1] == filePath[0]) {
                console.log("Finish")
            }
        })
        .catch(errorHandler => {
            console.error(errorHandler)
            if (fileList[fileList.length - 1] == filePath[0]) {
                console.log("Finish")
            }
        });
}
/*
spauth.getAuth("https://elitechgroupe.sharepoint.com/sites/Ims_storage", credentialOptions)
    .then(options => {

        //perform request with any http-enabled library (request-promise in a sample below):
        let headers = options.headers;
        headers['Accept'] = 'application/json;odata=verbose';

        spsave({
            siteUrl: "https://elitechgroupe.sharepoint.com/sites/Ims_storage"
        },
            credentialOptions,
            fileOptions
        )
            .then(successHandler => {
                console.log(successHandler)
            })
            .catch(errorHandler => {
                console.error(errorHandler)
            });
    });

*/