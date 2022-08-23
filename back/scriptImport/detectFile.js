const mongoose = require("mongoose");
const { Prospect } = require("../models/prospect");
const fs = require("fs");

mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Prospect.find().then(data => {
            data.forEach(p => {
                let nb = false
                try {
                    let fileList = fs.readdirSync('../storage/prospect/' + p._id + "/")
                    fileList.forEach(file => {
                        console.log(file)
                        if (!fs.lstatSync('../storage/prospect/' + p._id + "/" + file).isDirectory()) {
                            nb = true
                        }
                        else {
                            let files = fs.readdirSync('../storage/prospect/' + p._id + "/" + file)
                            files.forEach(f => {
                                nb = true
                            });
                        }
                    });
                } catch (e) {
                    if (e.code != "ENOENT") {
                        console.error(e)
                    }
                }
                Prospect.findByIdAndUpdate(p._id, { haveDoc: nb }, { new: true },((err,newProspect)=>{
                    if (err) {
                        console.log(err)
                    }
                }))

            })
        })
    })