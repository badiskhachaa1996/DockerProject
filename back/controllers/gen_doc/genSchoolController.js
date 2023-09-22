const express = require("express");
const app = express();
const { GenSchool } = require("../../models/gen_doc/GenSchool");

app.disable("x-powered-by");


// ajout d'école"
app.post("/add-school", (req, res) => {
    const school = new GenSchool({ ...req.body});
    school.save()  
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(500).send(error.message); });

});


// Mettre à jour l'école
app.put("/update-school", (req, res) => {

    const school = new GenSchool({ ...req.body });
    GenSchool.findByIdAndUpdate(school._id, school, { new: true })
        .then((reponse) => { res.status(201).send(reponse); })
        .catch((error) => { res.status(400).send(error.message); });
});

// Supprimer l'école
app.put("/delete-school", (req, res) => {
    const school = new GenSchool({ ...req.body });
    GenSchool.findOneAndRemove({ _id: school._id })
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});


// recuperation de l'école
app.get("/get-school/:id", (req, res) => {
    GenSchool.findOne({ _id: req.params.id })?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation de la liste des écoles
app.get("/get-schools", (_, res) => {
    GenSchool.find()?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});


module.exports = app;