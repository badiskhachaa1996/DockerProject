const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Conge } = require('./../models/Conge');
const multer = require('multer');
const fs = require('fs');
const { Ticket } = require('../models/ticket');
const { User } = require('../models/user');
const jwt = require("jsonwebtoken");
const { Sujet } = require('../models/sujet');
const nodemailer = require('nodemailer');
const { Etudiant } = require("../models/etudiant");

//creation d'un transporter smtperrFile
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});
function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// méthode de demande de congés
app.post("/post-conge", (req, res) => {
    const conge = new Conge({ ...req.body });
    let IDTicket = "IGTR" + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString()
    conge.customid_ticket = IDTicket
    //Enregistrement du congé dans la base de données
    conge.save()
        .then((response) => {
            Sujet.findOne({ label: req.body.type_conge }).populate('service_id').then(sujet => {
                if (sujet) {
                    let token = jwt.decode(req.header("token"))
                    User.findById(token.id).then(u => {
                        let ticket = new Ticket({
                            createur_id: token.id,
                            sujet_id: sujet._id,
                            date_ajout: new Date(),
                            customid: IDTicket,
                            resum: `${new Date(req.body.date_debut).toLocaleDateString('fr-FR')} - ${new Date(req.body.date_fin).toLocaleDateString('fr-FR')}; Nombre de jours: ${response.nombre_jours}`,
                            description: req.body.motif,
                            priorite: req.body.urgent
                        })
                        ticket.save((err, doc) => {
                            let d = new Date()
                            let month = (d.getUTCMonth() + 1).toString()
                            if (d.getUTCMonth() + 1 < 10)
                                month = "0" + month
                            let day = (d.getUTCDate()).toString()
                            if (d.getUTCDate() < 10)
                                day = "0" + day
                            let year = d.getUTCFullYear().toString().slice(-2);

                            let htmlemail = `
                            ID: ${doc.customid}<br>
                            Créé par : ${u.lastname} ${u.firstname}<br>
                            Crée le  : ${day}/${month}/${year}<br>
                            Service : ${sujet.service_id.label}<br>
                            Sujet : ${sujet.label}<br>
                            Résumé : ${doc.resum}<br>
                            Description : ${doc.description}<br>
                            `
                            let mailOptions = {
                                from: 'ims@intedgroup.com',
                                to: 'ims.support@intedgroup.com',
                                subject: 'Nouveau -' + sujet.service_id.label + " - " + sujet.label,
                                html: htmlemail,
                                priority: 'high',
                                attachments: [{
                                    filename: 'signature.png',
                                    path: 'assets/ims-intedgroup-logo.png',
                                    cid: 'red' //same cid value as in the html img src
                                }]
                            };


                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.error(error);
                                }
                            });
                        })
                    })

                } else
                    console.error('Impossible de créer un ticket pour la demande de congé de type' + req.body?.type_conge)

            })

            res.status(201).send(response);
        })
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

    Conge.find()?.populate('user_id').populate('valided_by').populate('commented_by')
        .then((response) => { res.status(200).send(response) })
        .catch((error) => { res.status(400).send(error) })
})


//mise à jour d'un object conge 
app.put("/put-conge", (req, res) => {
    const conge = new Conge({ ...req.body });

    Conge.findByIdAndUpdate(conge._id, { ...req.body })
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
    if (!fs.existsSync(`./storage/justificatif-conge/${req.params.id}/`))
        fs.mkdirSync(`./storage/justificatif-conge/${req.params.id}/`, { recursive: true });
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
        Conge.find({ user_id: userId, date_debut: { $lte: `${req.params.date}-31` }, date_fin: { $gte: `${req.params.date}-01` }, statut: "Validé" }).populate('user_id').populate('valided_by').populate('commented_by')
            .then((response) => { res.status(200).send(response); })
            .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des conges de l\'utilisateurs' }) });
    else
        Conge.find({ user_id: userId, statut: "Validé" }).populate('user_id').populate('valided_by').populate('commented_by')
            .then((response) => { res.status(200).send(response); })
            .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des conges de l\'utilisateurs' }) });
});

module.exports = app;