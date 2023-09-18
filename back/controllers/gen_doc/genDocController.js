const express = require("express");
const app = express();
const { GenDoc } = require("../../models/gen_doc/genDoc");

app.disable("x-powered-by");


// ajout de le doc"
app.post("/add-doc", (req, res) => {
    const doc = new GenDoc({ ...req.body});
    doc.save()  
    .then((response) => { res.status(201).send(response); })
    .catch((error) => { res.status(500).send(error.message); });

});


// Mettre à jour le doc
app.put("/update-doc", (req, res) => {

    const doc = new GenDoc({ ...req.body });
    GenDoc.findByIdAndUpdate(doc._id, doc, { new: true })
        .then((reponse) => { res.status(201).send(reponse); })
        .catch((error) => { res.status(400).send(error.message); });
});

// Supprimer le doc
app.put("/delete-doc", (req, res) => {
    const doc = new GenDoc({ ...req.body });
    GenDoc.findOneAndRemove({ _id: doc._id })
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});


// recuperation du doc
app.get("/get-doc/:id", (req, res) => {
    GenDoc.findOne({ _id: req.params.id }).populate('school').then((response) => { 
        res.status(200).send(response); 
    })
        .catch((error) => { res.status(400).send(error.message); });
});


// recuperation de la liste de doc
app.get("/get-docs", (_, res) => {
    GenDoc.find()?.then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).send(error.message); });
});


module.exports = app;