const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { Classe } = require("./../models/classe");
const { Diplome } = require("./../models/diplome");
const { Seance } = require('./../models/seance')
//Création d'une nouveau classe 
app.post("/create", (req, res) => {
    //Sauvegarde d'une classe
    delete req.body._id
    let classe = new Classe(
        {
            ...req.body
        });

    classe.save()
        .then((classeSaved) => { res.status(201).send(classeSaved) })
        .catch((error) => { res.status(400).send('Création de classe impossible ' + error); });
});


//Modification d'une classe
app.post("/updateById", (req, res) => {
    Classe.findOneAndUpdate({ _id: req.body._id },
        {
            ...req.body
        })
        .then((classeUpdated) => { res.status(201).send(classeUpdated); })
        .catch((error) => { res.status(400).send('Modification impossible' + error) });
});

//Récuperer une classe par ID
app.get("/getById/:id", (req, res) => {
    Classe.findOne({ _id: req.params.id })
        .then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            res.status(400).send("Impossible de recuperer cette classe: " + error);
        })
});

//Récuperer une classe par ID
app.get("/getPopulate/:id", (req, res) => {
    Classe.findOne({ _id: req.params.id }).populate('diplome_id')
        .then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            res.status(400).send("Impossible de recuperer cette classe: " + error);
        })
});

//Récuperer tous les classes
app.get("/getAll", (req, res) => {
    Classe.find()
        .then((classes) => { res.status(200).send(classes); })
        .catch((err) => { res.status(500).send('Impossible de recuperer la liste des classes'); })
});

//Récuperer tous les classes
app.get("/getAllPopulate", (req, res) => {
    Classe.find().populate('diplome_id')
        .then((classes) => { res.status(200).send(classes); })
        .catch((err) => { res.status(500).send('Impossible de recuperer la liste des classes'); })
});


app.get("/hideById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: false
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(user)
            }

        })
});

app.get("/showById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: true
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(user)
            }

        })
});

//Récuperer tous les classes active
app.get("/seeAll", (req, res) => {
    Classe.find({ active: true })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })
});

//Récupérer une classe via une école
app.get("/getAllByEcoleID/:id", (req, res) => {
    Ecole.findById({ ecole_id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

//Récupérer getAll by diplome
app.get('/getALLByDiplomeABBRV/:abbrv', (req, res) => {
    Diplome.findOne({ titre: req.params.abbrv }).then(diplome => {
        console.log(diplome)
        Classe.find({ diplome_id: diplome._id }).then(classes => {
            console.log(classes)
            res.status(200).send(classes)
        })
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
})
module.exports = app;