const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Conge } = require('./../models/Conge');
const multer = require('multer');
const fs = require('fs');

// méthode de demande de congés
app.post("/post-conge", (req, res) => {
    const conge = new Conge({ ...req.body });
    //Enregistrement du congé dans la base de données
    conge.save()
        .then((response) => { res.status(201).send(response); })
        .catch((error) => { res.status(500).send("Impossible de prendre en compte votre demande de congés"); })
})


// recuperation de la liste des conges d'un utilisateur 
app.get("/get-conges-user-id/:user_id", (req, res) => {
    const { user_id } = req.params;

    Conge.find({ user_id: user_id })
        .then((response) => { res.status(200).send(response) })
        .catch((error) => { res.status(400).send(error) })
})


// recuperation de la liste des congés
app.get("/get-conges", (req, res) => {
    const { user_id } = req.params;

    Conge.find()?.populate('user_id')
        .then((response) => { res.status(200).send(response) })
        .catch((error) => { res.status(400).send(error) })
})


//mise à jour d'un object conge 
app.put("/put-conge", (req, res) => {
    const conge = new Conge({ ...req.body });

    Conge.updateOne({ _id: conge._id }, { ...req.body })
        .then((response) => { res.status(201).send(response) })
        .catch((error) => { res.status(400).send(error) })
})


//mise-a-jour du statut
app.patch("/answer", (req, res) => {
    const { answer } = req.body;
    const { id } = req.body;

    Conge.findOneAndUpdate({ _id: id }, { statut: answer })
        .then((response) => { res.status(201).send(response) })
        .catch((error) => { res.status(400).send(error) })

})


//suppression d'une demande de conge
app.delete("/delete-conge/:id", (req, res) => {
    const { id } = req.params;

    Conge.findOne({ _id: id })
        .then((response) => {
            if (response?.justificatif) {
                fs.unlink(`storage/justificatif-conge/${id}/justificatif.pdf`, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            Conge.deleteOne({ _id: id })
                .then((response) => { res.status(201).send(response) })
                .catch((error) => { console.error(error); res.status(400).send(error) })
        })
        .catch((error) => { console.error(error); res.status(500).send(error) })

});

// upload du justificatif
const uploadJustificatifStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const { id } = req.body;
        const destination = `storage/justificatif-conge/${id}`;

        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        callBack(null, destination);
    },
    filename: (req, file, callBack) => {
        let fileName = "justificatif";
        const fileSplited = file.originalname.split('.');
        const filetype = fileSplited[fileSplited.length - 1];

        callBack(null, `${fileName}.${filetype}`);
    }
});

const uploadJustificatif = multer({ storage: uploadJustificatifStorage });

app.post('/upload-justificatif', uploadJustificatif.single('file'), (req, res) => {
    const { file } = req;
    const id = req.body.id;

    let fileName = "justificatif";
    const fileSplited = file.originalname.split('.');
    const filetype = fileSplited[fileSplited.length - 1];

    if (!file) {
        return res.status(400).send("Aucun fichier sélectionnée");
    }

    Conge.findOneAndUpdate({ _id: id }, { justificatif: `${fileName}.${filetype}` })
        .then((response) => { res.status(201).send(response) })
        .catch((error) => { res.status(400).send("Impossible de mettre à jour votre demande de congé"); });
});

// méthode de téléchargement du justificatif
app.get("/download-justificatif/:id", (req, res) => {
    res.download(
        `./storage/justificatif-conge/${req.params.id}/justificatif.pdf`,
        function (err) {
            if (err) {
                res.status(400).send(err);
            }
        }
    );
});


// recuperation de la liste des présences d'un utilisateur
app.get("/getUserCongesByDate/:userId/:date", (req, res) => {
    const { userId } = req.params;
    if (req.params.date != 'null')
        Conge.find({ user_id: userId, date_debut: { $lte: `${req.params.date}-31` }, date_fin: { $gte: `${req.params.date}-01` }, statut: "Validé" }).populate('user_id')
            .then((response) => { res.status(200).send(response); })
            .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des conges de l\'utilisateurs' }) });
    else
        Conge.find({ user_id: userId, statut: "Validé" }).populate('user_id')
            .then((response) => { res.status(200).send(response); })
            .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des conges de l\'utilisateurs' }) });
});

module.exports = app;