var spsave = require("spsave").spsave;
const mongoose = require("mongoose");
var fs = require('fs');
const { User } = require('../models/user.js')
const { Prospect } = require('../models/prospect')
const { Etudiant } = require('../models/etudiant')

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
let userDic = {}
let userList = []
let fileList = fs.readdirSync('../storage')
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        User.find().then(dataU => {
            Prospect.find().populate("user_id").then(dataP => {
                Etudiant.find().populate("user_id").then(dataE => {
                    dataP.forEach(p => {
                        if (p.user_id) {
                            userDic[p.user_id._id] = "[" + p?.customid + "] " + p.user_id.lastname + " " + p.user_id.firstname
                            userList.push(p.user_id._id)
                        }
                    })
                    dataE.forEach(e => {
                        if (e.user_id) {
                            userDic[e.user_id._id] = "[" + e?.customid + "] " + e.user_id.lastname + " " + e.user_id.firstname
                            userList.push(e.user_id._id)
                        }

                    })
                    dataU.forEach(u => {
                        if (userList.includes(u._id) == false)
                            userDic[u._id] = u.lastname + " " + u.firstname
                    })

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
        fileOptions.folder = fileOptions.folder.replace(file, userDic[file])
        fileOptions.fileName = fileOptions.fileName.replace(file, userDic[file])
    })
    spsave({
        siteUrl: "https://elitechgroupe.sharepoint.com/sites/Ims_storage"
    },
        credentialOptions,
        fileOptions
    )
        .then(successHandler => {
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