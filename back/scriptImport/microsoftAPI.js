var spsave = require("spsave").spsave;
var fs = require('fs');
const { exit } = require("process");
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
                                sendFile({
                                    folder: "Shared Documents/" + file + "/" + file2 + "/" + file3,
                                    fileName: file4,
                                    fileContent: fs.readFileSync('../storage/' + file + "/" + file2 + "/" + file3 + "/" + file4)
                                }, [file, file2, file3])
                            }
                        });
                    } else {
                        sendFile({
                            folder: "Shared Documents/" + file + "/" + file2,
                            fileName: file3,
                            fileContent: fs.readFileSync('../storage/' + file + "/" + file2 + "/" + file3)
                        }, [file, file2])
                    }
                });
            } else {
                sendFile({
                    folder: "Shared Documents/" + file,
                    fileName: file2,
                    fileContent: fs.readFileSync('../storage/' + file + "/" + file2)
                }, [file])
            }
        });
    } else {
        console.log('../storage/' + file)
    }
});
exit
function sendFile(fileOptions, filePath) {
    var credentialOptions = {
        username: "test.admin@estya.com",
        password: "EstyaFR2022"
    }
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