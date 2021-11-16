const express = require("express");
const app = express();
const { Presence } = require("./../models/presence");

//Récuperer une présence
app.post("/getById/:id", (req, res) => {
    Presence.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

//Récuperer tous les présences
app.get("/getAll", (req, res) => {
    Presence.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer tous les presence d'un user
app.get("/getAllByUser/:id", (req, res) => {
    Presence.find({ user_id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

//Récupérer tous les presence d'une séance
app.get("/getAllBySeance/:id", (req, res) => {
    Presence.find({ seance_id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

//Mets un étudiant en présent
app.get("/isPresent/:id", (req, res) => {
    Presence.findOneAndUpdate(req.params.id,
        {
            isPresent: true
        }, { new: true }, (err, campus) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(campus)
            }

        });
});

//Création d'un nouveau message 
app.post("/create", (req, res) => {

    //Sauvegarde du message
    const presence = new Presence({
        seance_id: req.body.seance_id,
        user_id: req.body.user_id,
        isPresent: req.body.isPresent,
        signature: (req.body.signature)?true:false,
        justificatif: false,
        date_signature : Date.now()
    });

    presence.save((err, data) => {
        res.send(data);
        //Sauvegarde de la signature si il y en a une
        if(err){
            res.status(500).send(err)
        }
        if (req.body.signature && req.body.signature != null && req.body.signature != '') {
            fs.mkdir("./storage/signature/",
                { recursive: true }, (err3) => {
                    if (err3) {
                        console.error(err3);
                    }
                });
            fs.writeFile("storage/signature/" + data._id+".png", req.body.signature, 'base64', function (err2) {
                if (err2) {
                    console.error(err2);
                }
            });
        }
    }).catch((error) => {
        res.status(400).send(error);
    });
});

//Mets un étudiant en présent
app.post("/addSignature/:id", (req, res) => {
    Presence.findOneAndUpdate(req.params.id,
        {
            signature: true,
            isPresent:true,
            date_signature : Date.now()
        }, { new: true }, (err, data) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(data)
                if (req.body.signature && req.body.signature != null && req.body.signature != '') {
                    fs.mkdir("./storage/signature/",
                        { recursive: true }, (err3) => {
                            if (err3) {
                                console.error(err3);
                            }
                        });
                    fs.writeFile("storage/signature/" + data._id+".png", req.body.signature, 'base64', function (err2) {
                        if (err2) {
                            console.error(err2);
                        }
                    });
                }
            }

        });
});

//Mets un étudiant en présent
app.post("/addJustificatif/:id", (req, res) => {
    Presence.findOneAndUpdate(req.params.id,
        {
            justificatif: true
        }, { new: true }, (err, data) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(data)
                if (req.body.justificatif && req.body.justificatif != null && req.body.justificatif != '') {
                    fs.mkdir("./storage/justificatif/",
                        { recursive: true }, (err3) => {
                            if (err3) {
                                console.error(err3);
                            }
                        });
                    fs.writeFile("storage/justificatif/" + data._id+".png", req.body.justificatif, 'base64', function (err2) {
                        if (err2) {
                            console.error(err2);
                        }
                    });
                }
            }

        });
});

app.get("/getSignature/:id", (req, res) => {
    Presence.findOne({ _id: req.params.id }).then((data) => {
        let file = fs.readFileSync("storage/signature/" +  data._id+".png", { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(200).send({file,date_signature : data.date_signature})
    }).catch((error) => {
        res.status(404).send(error);
    })
});

app.get("/getJustificatif/:id", (req, res) => {
    Presence.findOne({ _id: req.params.id }).then((data) => {
        let file = fs.readFileSync("storage/justificatif/" +  data._id+".png", { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(200).send(file)
    }).catch((error) => {
        res.status(404).send(error);
    })
})

module.exports = app;
