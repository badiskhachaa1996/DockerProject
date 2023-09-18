const express = require("express");
const app = express();
const { GenCampus } = require("../../models/gen_doc/genCampus");

app.disable("x-powered-by");


// ajout de le campus"
app.post("/add-campus", (req, res) => {
    const campus = new GenCampus({ ...req.body });
    campus.save()
        .then((response) => { res.status(201).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});


// Mettre à jour le campus
app.put("/update-campus", (req, res) => {

    const campus = new GenCampus({ ...req.body });
    GenCampus.findByIdAndUpdate(campus._id, campus, { new: true })
        .then((reponse) => { res.status(201).send(reponse); })
        .catch((error) => { res.status(400).send(error.message); });
});

// Supprimer le campus
app.put("/delete-campus", (req, res) => {
    const campus = new GenCampus({ ...req.body });
    GenCampus.findOneAndRemove({ _id: campus._id })
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});


// recuperation du campus
app.get("/get-campus/:id", (req, res) => {
    GenCampus.findOne({ _id: req.params.id })?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation de la liste de campus
app.get("/get-campuss", (_, res) => {
    GenCampus.find()?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});


module.exports = app;