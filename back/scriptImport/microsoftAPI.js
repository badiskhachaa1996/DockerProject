var spsave = require("spsave").spsave;
var spauth = require('node-sp-auth');
var fs = require('fs');

//get auth options
var credentialOptions = {
    username: "test.admin@estya.com",
    password: "EstyaFR2022"
}

var fileOptions = {
    folder: "Shared Documents/Test",
    fileName: "test.txt",
    fileContent: "JE SUIS UN TEST",
}
spauth.getAuth("https://elitechgroupe.sharepoint.com/sites/Ims_storage", credentialOptions)
    .then(options => {

        //perform request with any http-enabled library (request-promise in a sample below):
        let headers = options.headers;
        headers['Accept'] = 'application/json;odata=verbose';
        let fileList = fs.readdirSync('../storage')
        // storage/profile/id/image.png
        fileList.forEach(file => {
            if (fs.lstatSync('../storage/' + file).isDirectory()) {
                let fileList2 = fs.readdirSync('../storage/' + file)
                fileList2.forEach(file2 => {
                    if (fs.lstatSync('./storage/' + file + "/" + file2).isDirectory()) {
                        let fileList3 = fs.readdirSync('../storage/' + file + "/" + file2)
                        fileList3.forEach(file3 => {
                            if (fs.lstatSync('./storage/' + file + "/" + file2 + "/" + file3).isDirectory()) {

                            }   
                        });
                    }
                });
            }
        });
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

