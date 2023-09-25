const express = require('express');
const app = express();
const { Stage } = require('./../models/Stage');
const { Entreprise } = require('./../models/entreprise');
const { User } = require('./../models/user');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require("fs");
app.disable("x-powered-by");

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});

// recuperation de la liste des stages
app.get("/get-stages", (req, res) => {
    Stage.find()
    ?.populate({path: 'student_id', populate: {path: 'user_id'}})
    ?.populate({path: 'student_id', populate: {path: 'campus', populate: {path: 'ecole_id'}}})
    ?.populate({path: 'student_id', populate: {path: 'classe_id', populate: {path: 'diplome_id'}}})
    ?.populate({path: 'enterprise_id', populate: {path: 'directeur_id'}})
    ?.populate({path: 'tutor_id', populate: {path: 'user_id'}})
    ?.populate('director_id')
    ?.populate('commercial_id')
    ?.populate('add_by')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(500).json({error: error, errorMsg: 'Impossible de récupérer la liste des stages'}) });
});

// recuperation du stage via son id
app.get("/get-stage/:id", (req, res) => {
    const stageId = req.params.id;
    Stage.findOne({_id: stageId})
    ?.populate({path: 'student_id', populate: {path: 'user_id'}})
    ?.populate({path: 'student_id', populate: {path: 'campus', populate: {path: 'ecole_id'}}})
    ?.populate({path: 'student_id', populate: {path: 'classe_id', populate: {path: 'diplome_id'}}})
    ?.populate({path: 'enterprise_id', populate: {path: 'directeur_id'}})
    ?.populate({path: 'tutor_id', populate: {path: 'user_id'}})
    ?.populate('director_id')
    ?.populate('commercial_id')
    ?.populate('add_by')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de récupérer le stage'}) });
});

// recuperation des stages d'un utilisateur via son id étudiant
app.get("/get-stage-by-student-id/:id", (req, res) => {
    const studentId = req.params.id;
    Stage.find({student_id: studentId})
    ?.populate({path: 'student_id', populate: {path: 'user_id'}})
    ?.populate({path: 'student_id', populate: {path: 'campus', populate: {path: 'ecole_id'}}})
    ?.populate({path: 'student_id', populate: {path: 'classe_id', populate: {path: 'diplome_id'}}})
    ?.populate({path: 'enterprise_id', populate: {path: 'directeur_id'}})
    ?.populate({path: 'tutor_id', populate: {path: 'user_id'}})
    ?.populate('director_id')
    ?.populate('commercial_id')
    ?.populate('add_by')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de récupérer les stages de cet étudiant'}) });
});

// recuperation des stages d'une entreprise via son id
app.get("/get-stage-by-enterprise-id/:id", (req, res) => {
    const enterpriseId = req.params.id;
    Stage.find({enterprise_id: enterpriseId})
    ?.populate({path: 'student_id', populate: {path: 'user_id'}})
    ?.populate({path: 'student_id', populate: {path: 'campus', populate: {path: 'ecole_id'}}})
    ?.populate({path: 'student_id', populate: {path: 'classe_id', populate: {path: 'diplome_id'}}})
    ?.populate({path: 'enterprise_id', populate: {path: 'directeur_id'}})
    ?.populate({path: 'tutor_id', populate: {path: 'user_id'}})
    ?.populate('director_id')
    ?.populate('commercial_id')
    ?.populate('add_by')
    .then((response) => { res.status(200).send(response); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de récupérer les stages de cette entreprise'}) });
});

// création d'un nouveau stage
app.post("/post-stage", (req, res) => {
    const stage = new Stage({...req.body});
    stage.save()
    .then((response) => {
        // requête de recuperation de l'entreprise via son id
        Entreprise.findOne()
        .then((enterprise) => {
            // requête de recuperation du directeur de l'entreprise
            User.findOne({_id: enterprise.directeur_id})
            .then((enterpriseDirector) => {
                // création du mail à envoyer
                const htmlMail = "<p>Bonjour, Un nouveau contrat de stage vient de vous être attribué.</p>" +
                                "<p>Merci de verifier le contrat sur <a href=\"https://ims.intedgroup.com\">votre espace IMS</a>.</p>" +
                                "<p>Cordialement.</p>";

                const mailOptions = 
                {
                    from: "ims@intedgroup.com",
                    to: enterpriseDirector.email,
                    subject: "Création d'un contrat de stage [IMS]",
                    html: htmlMail,
                }

                // envoi du mail
                transporter.sendMail(mailOptions, (error, info) => {
                    if(error){
                        res.status(400).json({errorMsg: "Impossible d'envoyer le mail de notification"});
                    }
                });

                res.status(200).json({stages: response, successMsg: "Stage ajouté avec succès"}); 
            })
            .catch((error) => { res.status(400).json({error: error, errorMsg: "Impossible de récupérer le directeur de l'entreprise liée au contrat"}); });
        })
        .catch((error) => { res.status(400).json({error: error, errorMsg: "Impossible de récupérer l'entreprise liée au contrat"}); });
    })
    .catch((error) => { console.error(error); res.status(400).json({error: error, errorMsg: "Impossible de créer un nouveau stage"}) });
});

// modification d'un stage
app.put("/put-stage", (req, res) => {
    Stage.updateOne({_id: req.body._id}, {...req.body})
    .then((response) => { res.status(200).json({stage: response, successMsg: 'Stage mis à jour'}); })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de mettre à jour le stage'}) });
});

// modification du status d'un stage
app.patch("/patch-status", (req, res) => {
    const idStage = req.body.idStage;
    const commercialEmail = req.body.commercialEmail;
    const status = req.body.status;

    Stage.updateOne({_id: idStage}, {status: status})
    .then((response) => {
        // création du mail à envoyer au commercial referent
        const htmlMail = "<p>Bonjour, le stage numéro <span style=\"color: red\">" + idStage +"</span> vient d'être modifié.</p>" +
                        "<p>Nouveau statut du stage: <span style=\"color: red\">" + status +"</span>.</p>" +
                        "<p>Pour retrouver le stage veuillez saisir le numéro du contrat dans le filtre sur <a href=\"https://ims.intedgroup.com/#/stages\">la page des stages</a>.</p>" +
                        "<p>Cordialement.</p>";

        const mailOptions = 
        {
            from: "ims@intedgroup.com",
            to: commercialEmail,
            subject: "Modification du status d'un contrat de stage [IMS]",
            html: htmlMail,
        }

        // envoi du mail
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                res.status(400).json({errorMsg: "Impossible d'envoyer le mail de notification"});
            }
        });

        // envoi de la réponse du serveur
        res.status(200).json({error: error, successMsg: 'Status du stage mis à jour'}); 
    })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de mettre à jour le status de cet stage'}); });
});

// mis à jour des missions d'un stagiaire
app.patch("/patch-mission-tasks", (req, res) => {
    const idStage = req.body.idStage;
    const commercialEmail = req.body.commercialEmail;
    const missions = req.body.missions;

    Stage.updateOne({_id: idStage}, {mission_tasks: missions})
    .then((response) => {
        // création du mail à envoyer au commercial referent
        const htmlMail = "<p>Bonjour, le stage numéro <span style=\"color: red\">" + idStage +"</span> vient d'être modifié.</p>" +
                        "<p>La mission du stagiaire a été mis à jour: <span style=\"color: red\">" + missions +"</span>.</p>" +
                        "<p>Pour retrouver le stage veuillez saisir le numéro du contrat dans le filtre sur <a href=\"https://ims.intedgroup.com/#/stages\">la page des stages</a>.</p>" +
                        "<p>Cordialement.</p>";

        const mailOptions = 
        {
            from: "ims@intedgroup.com",
            to: commercialEmail,
            subject: "Modification du status d'un contrat de stage [IMS]",
            html: htmlMail,
        }

        // envoi du mail
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                res.status(400).json({errorMsg: "Impossible d'envoyer le mail de notification"});
            }
        });

        // envoi de la réponse du serveur
        res.status(200).json({error: error, successMsg: 'Status du stage mis à jour'}); 
    })
    .catch((error) => { res.status(400).json({error: error, errorMsg: 'Impossible de mettre à jour le status de cet stage'}); });
});

/* partie upload de la convention de stage */
const uploadConventionStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const id = req.body.id;
        const destination = `storage/stages/${id}`;
        if(!fs.existsSync(destination))
        {
            fs.mkdirSync(destination, {recursive: true});
        }
        callBack(null, destination);
    },
    filename: (req, file, callBack) => {
        const filename = 'convention_stage';
        callBack(null, `${filename}.${file.mimetype.split('/')[1]}`);
    }
});

const uploadConvention = multer({storage: uploadConventionStorage})

app.post("/upload-convention", uploadConvention.single('file'), (req, res) => {
    const file = req.file;
    const id = req.body.id;

    if(!file)
    {
        res.status(400).send('Aucun fichier sélectionnée');
    } else {
        Stage.updateOne({_id: id}, {convention: `convention_stage.${file.mimetype.split('/')[1]}`})
        .then((response) => {res.status(201).json({successMsg: 'convention téléversé, contrat de stage mis à jour'});})
        .catch((error) => { res.status(400).send('Impossible de mettre à jour le contrat de stage'); });
    }
});

/* partie upload de l'avenant */
const uploadAvenantStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const id = req.body.id;
        const destination = `storage/stages/${id}`;
        if(!fs.existsSync(destination))
        {
            fs.mkdirSync(destination, {recursive: true});
        }
        callBack(null, destination);
    },
    filename: (req, file, callBack) => {
        const filename = 'avenant_stage';
        callBack(null, `${filename}.${file.mimetype.split('/')[1]}`);
    }
});

const uploadAvenant = multer({storage: uploadAvenantStorage});

app.post("/upload-avenant", uploadAvenant.single('file'), (req, res) => {
    const file = req.file;
    const id = req.body.id;

    if(!file)
    {
        res.status(400).send('Aucun fichier sélectionnée');
    } else {
        Stage.updateOne({_id: id}, {avenant: `avenant_stage.${file.mimetype.split('/')[1]}`})
        .then((response) => {res.status(201).json({successMsg: 'Avenant téléversé, contrat de stage mis à jour'});})
        .catch((error) => { res.status(400).send('Impossible de mettre à jour le contrat de stage'); });
    }
});

/* Partie upload de l'attestation */
const uploadAttestationStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const id = req.body.id;
        const destination = `storage/stages/${id}`;
        if(!fs.existsSync(destination))
        {
            fs.mkdirSync(destination, {recursive: true});
        }
        callBack(null, destination);
    },
    filename: (req, file, callBack) => {
        const filename = 'Attestation_de_stage';
        callBack(null, `${filename}.${file.mimetype.split('/')[1]}`);
    }
});

const uploadAttestation = multer({storage: uploadAttestationStorage});

app.post("/upload-attestation", uploadAttestation.single('file'), (req, res) => {
    const file = req.file;
    const id = req.body.id;

    if(!file)
    {
        res.status(400).send('Aucun fichier sélectionnée');
    } else {
        Stage.updateOne({_id: id}, {attestation: `Attestation_de_stage.${file.mimetype.split('/')[1]}`})
        .then((response) => {res.status(201).json({successMsg: 'Attestation téléversé, contrat de stage mis à jour'});})
        .catch((error) => { res.status(400).send('Impossible de mettre à jour le contrat de stage'); });
    } 
});

// download convention
app.get("/download-convention/:idStage", (req, res) => {
    Stage.findOne({_id: req.params.idStage})
    .then((response) => {
        res.download(
            `./storage/stages/${req.params.idStage}/${response.convention}`,
            function (err) {
                if (err) {
                    res.status(400).send(err);
                }
            }
        );
    })
    .catch((error) => {res.status(400).send(error);});
});

// download avenant
app.get("/download-avenant/:idStage", (req, res) => {
    Stage.findOne({_id: req.params.idStage})
    .then((response) => {
        res.download(
            `./storage/stages/${req.params.idStage}/${response.avenant}`,
            function (err) {
                if (err) {
                    res.status(400).send(err);
                }
            }
        );
    })
    .catch((error) => {res.status(400).send(error);});
});

// download attestation
app.get("/download-attestation/:idStage", (req, res) => {
    Stage.findOne({_id: req.params.idStage})
    .then((response) => {
        res.download(
            `./storage/stages/${req.params.idStage}/${response.attestation}`,
            function (err) {
                if (err) {
                    res.status(400).send(err);
                }
            }
        );
    })
    .catch((error) => {res.status(400).send(error);});
});

module.exports = app;