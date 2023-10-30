const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Annonce } = require('./../models/Annonce');
const { User } = require('./../models/user');
const { Matching } = require("./../models/matching");
const { Ticket } = require("../models/ticket");
const { Sujet } = require("../models/sujet");
const { Service } = require("../models/service");
//Création d'une annonce
app.post("/post-annonce", (req, res) => {
    const annonce = new Annonce({ ...req.body, date_creation: new Date() });

    annonce.save()
        .then((annonceSaved) => {
            Annonce.findById(annonceSaved._id).populate('user_id').populate('entreprise_id').then(annoncePopulated => {
                let ent_name = annoncePopulated?.entreprise_name
                if (!ent_name)
                    ent_name = annoncePopulated?.entreprise_id?.r_sociale
                User.findById(req.body.created_by).then(auteur => {
                    Service.findOne({ label: 'Commercial' }).then(s => {
                        if (s) Sujet.findOne({ service_id: s._id, label: 'iMatch' }).then(sujet => {
                            if (sujet && (!auteur || auteur.type == 'CEO Entreprise' || auteur.type == 'Entreprise' || auteur.type == 'Tuteur'))
                                createTicket(req.body?.created_by,
                                    `L'entreprise ${ent_name} a publié une nouvelle offre,${annonce?.custom_id}`, sujet, 'Offre publié')
                            else if (sujet && auteur && (auteur.type == 'Commercial' || auteur.role == 'Admin' ))
                                createTicket(req.body?.created_by,
                                    `${auteur?.firstname} ${auteur?.lastname} a publié une nouvelle offre,${annonce?.custom_id}`, sujet, 'Offre publié')
                        })
                    })
                })
            })
            res.status(201).send(annonceSaved);
        })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperation de la liste des annonces
app.get("/get-annonces", (_, res) => {
    Annonce.find()?.populate('entreprise_id')?.populate('profil')?.populate('competences').populate("user_id").sort({ _id: -1 })
        .then((annonces) => { res.status(200).send(annonces); })
        .catch((error) => { res.status(500).send(error.message); });
});
app.get("/get-annonces-by-entreprise-id/:entreprise_id", (req, res) => {
    Annonce.find({ entreprise_id: req.params.entreprise_id })?.populate('entreprise_id')?.populate('profil')?.populate('competences').populate("user_id").sort({ _id: -1 })
        .then((annonces) => { res.status(200).send(annonces); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récuperation d'une annonce via son identifiant
app.get("/get-annonce/:annonceId", (req, res) => {
    Annonce.findOne({ _id: req.params.annonceId })?.populate('entreprise_id')?.populate('profil')?.populate('competences').sort({ _id: -1 })
        .then((annonce) => { res.status(200).send(annonce); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récuperation des annonces via un user id
app.get("/get-annonces-by-user-id/:userId", (req, res) => {
    Annonce.find({ user_id: req.params.userId })?.populate('entreprise_id')?.populate('profil')?.populate('competences')
        .then((annonces) => { res.status(200).send(annonces); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Modification d'une annonce
app.put("/put-annonce", (req, res) => {

    Annonce.updateOne({ _id: req.body._id }, { ...req.body })
        .then((annonce) => { res.status(200).send(annonce) })
        .catch((error) => { res.status(500).send(error.message) })
});

app.delete('/delete/:id', (req, res) => {
    Annonce.findByIdAndRemove(req.params.id)
        .then((annonce) => {
            Matching.remove({ offre_id: req.params.id }).then(offres => {
                res.status(200).send({ annonce, offres })
            })

        })
        .catch((error) => { res.status(500).send(error.message) })
})

function createTicket(created_by, description, sujet, resum) {
    function entierAleatoire(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    Ticket.find({ sujet_id: sujet._id }).then(tkt => {
        var lengTicket = tkt.length + 1
        //Generation Custom ID
        let id = ""
        let d = new Date()
        let month = (d.getUTCMonth() + 1).toString()
        if (d.getUTCMonth() + 1 < 10)
            month = "0" + month
        let day = (d.getUTCDate()).toString()
        if (d.getUTCDate() < 10)
            day = "0" + day
        let year = d.getUTCFullYear().toString().slice(-2);
        while (lengTicket > 1000)
            lengTicket - 1000
        let nb = (lengTicket).toString()
        if (lengTicket < 10)
            nb = "00" + nb
        if (lengTicket < 100)
            nb = "0" + nb


        id = "IGTR" + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString()

        const newTicket = new Ticket({
            resum,
            createur_id: created_by,
            sujet_id: sujet._id,
            description,
            date_ajout: d,
            customid: id
        });
        newTicket.save((err, doc) => {
        });
    })
}

module.exports = app;