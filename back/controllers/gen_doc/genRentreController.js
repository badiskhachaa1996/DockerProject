const express = require("express");
const app = express();
const { GenRentre } = require("../../models/gen_doc/genRentre");

app.disable("x-powered-by");


// ajout de le rentre"
app.post("/add-rentre", (req, res) => {
    const rentre = new GenRentre({ ...req.body});
    rentre.save()  
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(500).send(error.message); });

});


// Mettre à jour le rentre
app.put("/update-rentre", (req, res) => {

    const rentre = new GenRentre({ ...req.body });
    GenRentre.findByIdAndUpdate(rentre._id, rentre, { new: true })
        .then((reponse) => { res.status(201).send(reponse); })
        .catch((error) => { res.status(400).send(error.message); });
});

// Supprimer le rentre
app.put("/delete-rentre", (req, res) => {
    const rentre = new GenRentre({ ...req.body });
    GenRentre.findOneAndRemove({ _id: rentre._id })
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});


// recuperation du rentre
app.get("/get-rentre/:id", (req, res) => {
    GenRentre.findOne({ _id: req.params.id })?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation de la liste de rentre
app.get("/get-rentres", (_, res) => {
    GenRentre.find()?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});

// recuperation de la liste des competence d'un profil
app.get("/get-rentre-by-formation/:id", (req, res) => {
    GenRentre.find({ formation_id: req.params.id })?.populate('formation_id')
        .then((rentres) => { res.status(200).send(rentres); })
        .catch((error) => { res.status(500).send(error.message) });
});



module.exports = app;