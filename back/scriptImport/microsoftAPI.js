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
let nbUplaod = 0
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
                            userDic[e.user_id._id] = "[" + e?.custom_id + "] " + e.user_id.lastname + " " + e.user_id.firstname
                            userList.push(e.user_id._id)
                        }

                    })
                    dataU.forEach(u => {
                        if (userList.includes(u._id) == false)
                            userDic[u._id] = u.lastname + " " + u.firstname
                    })
                    // storage/prospect/id/filetype/image.png
                    fileList.forEach(file => {
                        let timeOut = 0
                        if (nbUplaod == 500) {
                            console.log("WILL BE SLEEPING")
                            nbUplaod = 0
                            timeOut = 1000 * 60
                        }
                        if (fs.lstatSync('../storage/' + file).isDirectory()) {
                            let fileList2 = fs.readdirSync('../storage/' + file)
                            fileList2.forEach(file2 => {
                                let timeOut = 0
                                if (nbUplaod == 500) {
                                    console.log("WILL BE SLEEPING")
                                    nbUplaod = 0
                                    timeOut = 1000 * 60
                                }
                                if (fs.lstatSync('../storage/' + file + "/" + file2).isDirectory()) {
                                    let fileList3 = fs.readdirSync('../storage/' + file + "/" + file2)
                                    fileList3.forEach(file3 => {
                                        let timeOut = 0
                                        if (nbUplaod == 500) {
                                            console.log("WILL BE SLEEPING")
                                            nbUplaod = 0
                                            timeOut = 1000 * 60
                                        }
                                        if (fs.lstatSync('../storage/' + file + "/" + file2 + "/" + file3).isDirectory()) {
                                            let fileList4 = fs.readdirSync('../storage/' + file + "/" + file2 + "/" + file3)
                                            fileList4.forEach(file4 => {
                                                let timeOut = 0
                                                if (nbUplaod == 500) {
                                                    console.log("WILL BE SLEEPING")
                                                    nbUplaod = 0
                                                    timeOut = 1000 * 60
                                                }
                                                if (fs.lstatSync('../storage/' + file + "/" + file2 + "/" + file3 + "/" + file4).isDirectory()) {
                                                    console.log('../storage/' + file + "/" + file2 + "/" + file3 + "/" + file4 + "/")
                                                } else {
                                                    let fileContent = fs.readFileSync('../storage/' + file + "/" + file2 + "/" + file3 + "/" + file4)
                                                    setTimeout(function () {
                                                        sendFile({
                                                            folder: "Shared Documents/" + file + "/" + file2 + "/" + file3,
                                                            fileName: file4,
                                                            fileContent
                                                        }, [file, file2, file3])
                                                    }, timeOut)
                                                }
                                            });
                                        } else {
                                            let fileContent = fs.readFileSync('../storage/' + file + "/" + file2 + "/" + file3)
                                            setTimeout(function () {
                                                sendFile({
                                                    folder: "Shared Documents/" + file + "/" + file2,
                                                    fileName: file3,
                                                    fileContent
                                                }, [file, file2])
                                            }, timeOut)
                                        }
                                    });
                                } else {
                                    let fileContent = fs.readFileSync('../storage/' + file + "/" + file2)
                                    setTimeout(function () {
                                        sendFile({
                                            folder: "Shared Documents/" + file,
                                            fileName: file2,
                                            fileContent
                                        }, [file])
                                    }, timeOut)
                                }
                            });
                        } else {
                            console.log('../storage/' + file)
                        }
                    });
                    console.log("Will Finishing soon")
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
        if (userDic[file]) {
            fileOptions.folder = fileOptions.folder.replace(file, userDic[file])
            fileOptions.fileName = fileOptions.fileName.replace(file, userDic[file])
        }
    })
    nbUplaod++
    spsave({
        siteUrl: "https://elitechgroupe.sharepoint.com/sites/Ims_storage"
    },
        credentialOptions,
        fileOptions
    )
        .then(successHandler => {
            //console.log(successHandler)
            console.log(fileOptions.folder + "/" + fileOptions.fileName)
        })
        .catch(errorHandler => {
            console.error(errorHandler, fileOptions)
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