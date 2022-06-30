const express = require('express');
const app = express();
app.disable("x-powered-by");
const { Prestataire } = require('./../models/prestataire');

//Recupère la liste des prestataires
app.get("/getAll", (req, res, next) => {
    Prestataire.find()
        .then((prestatairesFromDB) => { res.status(200).send(prestatairesFromDB); })
        .catch((error) => { req.status(500).send('Impossible de recupérer la liste des prestataire ' + error.message); });
});

//création d'un nouveau prestataire
app.post("/create", (req, res, next) => {

    let prestataire = new Prestataire(
        {
            r_sociale: req.body.r_sociale,
            nda: req.body.nda,
            vip: req.body.vip,
            type_ent: req.body.type_ent,
            type_soc: req.body.type_soc,
            siret: req.body.siret,
            code_ape_naf: req.body.code_ape_naf,
            num_tva: req.body.num_tva,
            nom_contact: req.body.nom_contact,
            prenom_contact: req.body.prenom_contact,
            fc_contact: req.body.fc_contact,
            email_contact: req.body.email_contact,
            phone_contact: req.body.phone_contact,
            nom_contact_2nd: req.body.nom_contact_2nd,
            prenom_contact_2nd: req.body.prenom_contact_2nd,
            fc_contact_2nd: req.body.fc_contact_2nd,
            email_contact_2nd: req.body.email_contact_2nd,
            phone_contact_2nd: req.body.phone_contact_2nd,
            pays_adresse: req.body.pays_adresse,
            ville_adresse: req.body.ville_adresse,
            rue_adresse: req.body.rue_adresse,
            numero_adresse: req.body.numero_adresse,
            postal_adresse: req.body.postal_adresse,
            email: req.body.email,
            phone: req.body.phone,
            website: req.body.website,
        });

        prestataire.save()
            .then((prestataireSaved) => { res.status(201).send(prestataireSaved); })
            .catch((error) => { res.status(400).send('Impossible d\'ajouter ce prestataire'); });

});

//Récupère un prestataire via un id
app.get("/getById/:id", (req, res, next) => {
    Prestataire.findOne({ _id: req.params.id })
        .then((prestataireFromDb) => { res.status(200).send(prestataireFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recupérer ce prestataire ' + error); });
});

//Modification d'un prestataire
app.put("/update", (req, res, next) => {

    Prestataire.findOneAndUpdate({ _id:req.body._id },
        {
            r_sociale: req.body.r_sociale,
            nda: req.body.nda,
            vip: req.body.vip,
            type_ent: req.body.type_ent,
            type_soc: req.body.type_soc,
            siret: req.body.siret,
            code_ape_naf: req.body.code_ape_naf,
            num_tva: req.body.num_tva,
            nom_contact: req.body.nom_contact,
            prenom_contact: req.body.prenom_contact,
            fc_contact: req.body.fc_contact,
            email_contact: req.body.email_contact,
            phone_contact: req.body.phone_contact,
            nom_contact_2nd: req.body.nom_contact_2nd,
            prenom_contact_2nd: req.body.prenom_contact_2nd,
            fc_contact_2nd: req.body.fc_contact_2nd,
            email_contact_2nd: req.body.email_contact_2nd,
            phone_contact_2nd: req.body.phone_contact_2nd,
            pays_adresse: req.body.pays_adresse,
            ville_adresse: req.body.ville_adresse,
            rue_adresse: req.body.rue_adresse,
            numero_adresse: req.body.numero_adresse,
            postal_adresse: req.body.postal_adresse,
            email: req.body.email,
            phone: req.body.phone,
            website: req.body.website,
        })
        .then((prestataireUpdated) => { res.status(201).send(prestataireUpdated); })
        .catch((error) => { res.status(400).send('Impossible de modifier ce prestataire'); });

});

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;