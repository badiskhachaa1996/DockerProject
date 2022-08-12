var spsave = require("spsave").spsave;
var spauth = require('node-sp-auth');

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
        spsave({
            siteUrl: "https://elitechgroupe.sharepoint.com/sites/Ims_storage"
        },
            credentialOptions,
            fileOptions
        )
            .then(successHandler=>{
                console.log(successHandler)
            })
            .catch(errorHandler=>{
                console.error(errorHandler)
            });
    });

