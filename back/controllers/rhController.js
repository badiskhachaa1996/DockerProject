const express = require('express');
const app = express();
app.disable("x-powered-by");
const { User } = require("./../models/user");
const { Collaborateur } = require('../models/Collaborateur');
const multer = require('multer');
const fs = require('fs');

/** partie collaborateur */
// recuperation de la liste des agents
app.get('/get-agents', (req, res) => {
    User.find({ $or: [{ role: 'Agent' }, { role: 'Admin' }, { role: 'Responsable' }, { role: 'user', type: null }] })
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error); });
});

// création d'un nouveau collaborateur
app.post('/post-collaborateur', (req, res) => {
    const collaborateur = new Collaborateur({ ...req.body });

    collaborateur.save()
        .then((response) => { res.status(201).send(response) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

// mettre à jour les informations personnelles du collaborateur
app.patch('/update-agent-personal-data', (req, res) => {
    User.findOneAndUpdate({ _id: req.body._id }, { ...req.body })
        .then((response) => { res.status(201).send(response) })
        .catch((error) => { res.status(400).send(error) });
});

// mettre à jour les informations du collaborateur
app.patch('/update-agent-data', (req, res) => {
    Collaborateur.findOneAndUpdate({ _id: req.body._id }, { ...req.body })
        .then((response) => { res.status(201).send(response) })
        .catch((error) => { res.status(400).send(error) });
});

// récupérer la liste des collaborateurs
app.get('/get-collaborateurs', (req, res) => {
    Collaborateur.find().populate({ path: 'user_id', populate: { path: 'service_id' } })?.populate('code_commercial')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error); });
});

// récupérer la liste d'un collaborateur via son id
app.get('/get-collaborateur/:id', (req, res) => {
    const { id } = req.params;
    Collaborateur.findOne({ _id: id }).populate('user_id')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error); });
});

// récupérer la liste d'un collaborateur via son user_id
app.get('/get-collaborateur-by-user-id/:id', (req, res) => {
    const { id } = req.params;
    Collaborateur.findOne({ user_id: id }).populate('user_id')?.populate('code_commercial')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).send(error); });
});

// ajout d'un document au collaborateur
const uploadCollaborateurDocumentStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const id = req.body.id;
        const destination = `storage/collaborateurs/${id}`;
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        callBack(null, destination);
    },
    filename: (req, file, callBack) => {
        const filename = req.body.title.replaceAll(' ', '_').replaceAll("'", '_').toLowerCase();
        callBack(null, `${filename}.${file.mimetype.split('/')[1]}`);
    }
});

const uploadCollaborateurDocument = multer({ storage: uploadCollaborateurDocumentStorage });

app.patch("/upload-collaborateur-document", uploadCollaborateurDocument.single('file'), (req, res) => {
    const file = req.file;
    const { id, title, note } = req.body;

    // création du filename
    const filename = `${title.replaceAll(' ', '_').replaceAll("'", '_').toLowerCase()}.${file.mimetype.split('/')[1]}`;

    if (!file) {
        res.status(400).send('Aucun fichier sélectionné');
    } else {
        // recuperation du collaborateur
        Collaborateur.findOne({ _id: id })
            .then((collaborateur) => {
                // mis à jour du collaborateur
                collaborateur.documents.push({ title: title, note: note, filename: filename });
                // envoi des données en bd
                Collaborateur.updateOne({ _id: id }, { ...collaborateur })
                    .then(() => { res.status(201).send('Collaborateur mis à jour avec succès') })
                    .catch((error) => { res.status(400).send('Impossible de mettre à jour les informations du collaborateur') });
            })
            .catch((error) => { res.status(500).send('Impossible de trouver le collaborateur') });
    }
});

//Todo: upload d'un document du collaborateur

// suppression du collaborateur via son user id
app.delete('/delete-collaborateur/:id', (req, res) => {
    const { id } = req.params;

    Collaborateur.findByIdAndRemove(id)
        .then((c) => {
            User.findByIdAndRemove(c.user_id).then((u) => {
                res.status(200).send('Collaborateur supprimé correctement')
            })
        })
        .catch((error) => { res.status(500).send("Impossible de supprimer le collaborateur"); })
});

// ajout de compétence
app.patch('/add-collaborateur-skills', (req, res) => {
    const { id } = req.body;

    Collaborateur.findOne({ _id: id })
        .then((collaborateur) => {
            if (collaborateur.competences.length > 0) {
                collaborateur.competences.push(...req.body.skills);
            } else {
                collaborateur.competences = req.body.skills;
            }

            // envoi des données en bd
            Collaborateur.findOneAndUpdate({ _id: id }, { ...collaborateur })
                .then((response) => { res.status(201).send(response) })
                .catch((error) => { console.error(error); res.status(400).send('Impossible de mettre à jour les informations du collaborateur') });
        })
        .catch((error) => { res.status(400).send("Impossible d'ajouter de nouvelles compétences") });
});

/** end partie collaborateur */

module.exports = app;