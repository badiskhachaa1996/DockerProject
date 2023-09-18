const express = require("express");
const app = express();
const { GenFormation } = require("../../models/gen_doc/genFormation");

app.disable("x-powered-by");


// ajout de la formation"
app.post("/add-formation", (req, res) => {
    const formation = new GenFormation({ ...req.body});
    formation.save()  
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(500).send(error.message); });

});


// Mettre à jour la formation
app.put("/update-formation", (req, res) => {

    const formation = new GenFormation({ ...req.body });
    GenFormation.findByIdAndUpdate(formation._id, formation, { new: true })
        .then((reponse) => { res.status(201).send(reponse); })
        .catch((error) => { res.status(400).send(error.message); });
});

// Supprimer la formation
app.put("/delete-formation", (req, res) => {
    const formation = new GenFormation({ ...req.body });
    GenFormation.findOneAndRemove({ _id: formation._id })
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});


// recuperation de la Formation
app.get("/get-formation/:id", (req, res) => {
    GenFormation.findOne({ _id: req.params.id })?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation de la liste de formation
app.get("/get-formations", (_, res) => {
    GenFormation.find()?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});



module.exports = app;