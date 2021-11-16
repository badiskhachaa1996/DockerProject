const express = require("express");
const app = express();
const { Diplome } = require("./../models/diplome");


app.post("/creatediplome", (req, res) => {
    //Ajout d'un diplôme
    let data = req.body;
    let diplome = new Diplome ({
        titre : data.titre,
        titre_long: data.titre_long,
        description : data.description,
        type_diplome : data.type_diplome,
        type_etude : data.type_etude,
        domaine : data.domaine,
        niveau : data.niveau,
        certificateur : data.certificateur,
        code_RNCP : data.code_RNCP,
        duree : data.duree,
        nb_heure : data.nb_heure,
        date_debut : data.date_debut,
        date_fin : data.date_fin,
        rythme : data.rythme,
        frais : data.frais,
        frais_en_ligne : data.frais_en_ligne,
    });
    diplome.save().then((diplomeFromDB) => {
        res.status(200).send(diplomeFromDB);
    }).catch((error) => {
        res.status(404).send(error);
    })
});

app.post("/editById/ :id", (req, res) => {
    //Modifier un diplome
    Diplome.findByIdAndUpdate(req.params.id,
        {
            titre : req.body.titre,
            titre_long : req.body.titre_long,
            descriptions : req.body.descriptions,
            type_diplome : req.body.type_diplome,
            type_etude : req.body.type_etude,
            domaine : req.body.domaine,
            niveau : req.body.niveau,
            certificateur : req.body.certificateur,
            code_RNCP : req.body.code_RNCP,
            duree : req.body.duree,
            nb_heure : req.body.nb_heure,
            date_debut : req.body.date_debut,
            date_fin : req.body.date_fin,
            rythme : req.body.rythme,
            frais : req.body.frais,
            frais_en_ligne : req.body.frais_en_ligne,

        }, {new: true}, (err, diplome) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(diplome)
            }
        });
});

app.get("/getAll", (req, res) => {
    //Récupérer tous les diplomes
    Diplome.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
    .catch(error => {
        console.error(error);
    })
});

app.get("/getAll/:id", (req, res) => {
    //Récupérer un diplome via un id
    Diplome.find({_id: req.params.id}).then((datadiplome) => {
        res.status(200).send( datadiplome );
    }).catch((error) => {
        res.status(404).send(error);
    })
});

app.get("/getAllByCampus/:id", (req, res) => {
    //Récupérer un diplome via un campus
    Diplome.find({campus_id: req.params.id}).then((datadiplome) => {
        res.status(200).send( datadiplome );
    }).catch((error) =>{
        res.status(404).send(error);
    })

});

module.exports = app;