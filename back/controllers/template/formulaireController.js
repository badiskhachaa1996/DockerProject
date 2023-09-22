/*
    Crée le Model de ton Objet dans le dossier ../../models
    Copie tout le Fichier car c'est les requêtes de base
    Si tu crées des nouvelles routes Fait attention au type de la requête avec le POST (app.post) et GET(app.get)
    N'oublie pas la dernière ligne qui sert à exporter les routes dans le index.js
*/


const express = require("express");
const { TemplateFormulaire } = require("../../models/template/formulaire");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new TemplateFormulaire({ ...req.body })
    f.save()
        .then((TFsaved) => { res.status(201).send(TFsaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getByID/:id", (req, res, next) => {
    TemplateFormulaire.findById(req.params.id)
        .then((data) => { res.status(200).send(data); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAll", (req, res, next) => {
    TemplateFormulaire.find().sort({ texte: -1 })
        .then((arrayData) => { res.status(200).send(arrayData); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

/*
    Le populate va faire en sorte de récupérer l'objet qui est associé à l'id de les champs 'ecole', 'formation' et 'formation2' 
    et de le mettre dans l'attribut
    https://mongoosejs.com/docs/populate.html
*/

app.get("/getAllPopulate", (req, res, next) => {
    TemplateFormulaire.find().populate('ecole').populate('formation').populate('formation2').sort({ texte: -1 })
        .then((arrayData) => { res.status(200).send(arrayData); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    TemplateFormulaire.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    TemplateFormulaire.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;