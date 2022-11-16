const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const { Etudiant } = require("./../models/etudiant");
const { Classe } = require("./../models/classe");
const { Examen } = require("./../models/examen");
const { Note } = require("./../models/note");
const { User } = require('./../models/user');
const { CAlternance } = require('./../models/contrat_alternance');
const { RachatBulletin } = require('./../models/RachatBulletin');
const jwt = require("jsonwebtoken");
app.disable("x-powered-by");
const sign_espic = `
<style type="text/css">
    .tg {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .tg td {
        font-family: Arial, sans-serif;
        font-size: 14px;
        overflow: hidden;
        padding: 0 15px;
        word-break: normal;
    }

    .tg th {
        border-color: black;
        border-style: solid;
        border-width: 1px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: normal;
        overflow: hidden;
        padding: 10px 15px;
        word-break: normal;
    }

    .tg .tg-129j {
        color: #23234c;
        font-size: x-large;
        font-weight: bold;
        text-align: left;
        vertical-align: top
    }

    .tg .tg-uu30 {
        font-size: medium;
        text-align: left;
        vertical-align: top
    }

    .tg .tg-wp8o {
        border-right: 1px #e0222e solid;
        text-align: center;
        vertical-align: top
    }

    .tg .tg-o3cm {
        color: #e0222e;
        font-size: large;
        font-weight: bold;
        text-align: left;
        vertical-align: top
    }

    .tg .tg-73oq {
        text-align: left;
        vertical-align: top
    }
</style>
<table class="tg" style="table-layout: fixed; width: 560px">
    <colgroup>
        <col style="width: 240px">
        <col style="width: 320px">
    </colgroup>
    <tbody>
        <tr>
            <td class="tg-wp8o" rowspan="6"><br><img
                    src="https://www.espic.com/wp-content/uploads/2022/08/cropped-cropped-cropped-espic-logo.png"
                    alt="Image" width="169" height="auto"></td>
            <td class="tg-129j"><span style="text-transform: capitalize;">Service</span> <span
                    style="text-transform: uppercase;">Pédagogique</span></td>
        </tr>
        <tr>
            <td class="tg-o3cm"></td>
        </tr>
        <tr>
            <td class="tg-uu30">+33 01 88 88 06 75</td>
        </tr>
        <tr>
            <td class="tg-uu30"><a href="mailto:pedagogie@espic.com" target="_blank"
                    rel="noopener noreferrer">pedagogie@espic.com</a></td>
        </tr>
        <tr>
            <td class="tg-73oq">6 allée Hendrik Lorentz, 77420</td>
            <td class="tg-uu30"><a href="https://www.espic.com/" target="_blank"
                    rel="noopener noreferrer">www.espic.com/</a></td>
        </tr>
    </tbody>
</table>
`
const path = require('path');
var mime = require('mime-types')
const fs = require("fs")

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

let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://t.dev.estya.com"]
    } else (
        origin = ["https://ims.estya.com"]
    )
}



//création d'un nouvel étudiant
app.post("/create", (req, res, next) => {
    //creation du nouvel étudiant
    let etudiantData = req.body.newEtudiant;
    delete etudiantData._id
    let etudiant = new Etudiant(
        {
            ...etudiantData
        });
    console.log(etudiant)
    //Creation du nouveau user
    let userData = req.body.newUser;
    let user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            indicatif: userData.indicatif,
            phone: userData.phone,
            email: userData.email,
            email_perso: userData.email_perso,
            //password: bcrypt.hashSync(userData.password, 8),
            role: userData.role,
            service_id: userData.service_id,
            type: "Initial",

            pays_adresse: userData.pays_adresse,
            ville_adresse: userData.ville_adresse,
            rue_adresse: userData.rue_adresse,
            numero_adresse: userData.numero_adresse,
            postal_adresse: userData.postal_adresse,
            date_creation: new Date()

        });

    //Verification de l'existence de l'Utilisateur
    User.findOne({ email_perso: userData.email_perso })
        .then((userFromDb) => {
            if (userFromDb) {
                Etudiant.findOne({ user_id: userFromDb._id })
                    .then((etudiantFromDb) => {
                        if (etudiantFromDb) {
                            res.status(400).json({ error: 'Cet étudiant existe déja' });
                        } else {
                            etudiant.user_id = userFromDb._id;
                            console.log("L'étudiant n'existe pas - enregistrement en cours")
                            etudiant.save()
                                .then((etudiantSaved) => { res.status(201).json({ success: "Etudiant ajouté dans la BD!", data: etudiantSaved }) })
                                .catch((error) => { res.status(400).json({ error: "Impossible d'ajouter cet étudiant " + error.message }) });
                        }
                    })
                    .catch((error) => { res.status(400).json({ error: "Impossible de verifier l'existence de l'étudiant" }) });
            }
            else {
                user.save((error2, userCreated) => {
                    if (error2) {
                        console.error(error2);
                        res.status(400).send({ error: 'Impossible de créer un nouvel user ' + error2.message })
                    } else {
                        etudiant.user_id = userCreated._id;
                        console.log("Le user n'existe pas - enregistrement en cours")
                        etudiant.save((error, etudiantCreated) => {
                            if (error) {
                                console.error(error);
                                res.status(400).send({ error: 'Impossible de créer un nouvel etudiant ' + error.message })
                            } else {
                                res.status(201).json({ success: 'Etudiant crée', data: etudiantCreated })
                            }
                        })
                    }
                })
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });
});




app.post("/assignToGroupe", (req, res, next) => {
    //creation du nouvel étudiant
    let etudiantData = req.body;

    Etudiant.findById(req.body._id).then(et => {
        let token = jwt.decode(req.header("token"))
        let me = new MonitoringEtudiant(
            {
                agent_id: token.id,
                etudiant_id: req.body._id,
                date: new Date(),
                etudiant_before: et,
                etudiant_after: { ...req.body },
                remarque: "Assigner à un groupe scolaire"
            }
        )
        me.save()
    })
    Etudiant.findByIdAndUpdate(req.body._id, { statut_dossier: etudiantData.statut_dossier, classe_id: etudiantData.groupe }, { new: true }, function (err, data) {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.status(201).send(data)
        }
    })
});


//Récupérer la liste de tous les étudiants
app.get("/getAll", (req, res, next) => {
    Etudiant.find({ classe_id: { $ne: null }, isActive: { $ne: false } })
        .then((etudiantsFromDb) => {
            res.status(200).send(etudiantsFromDb);
        })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});


//Récupérer la liste de tous les étudiants
app.get("/getAllEtudiantPopulate", (req, res, next) => {
    Etudiant.find({ classe_id: { $ne: null }, isActive: { $ne: false } }).populate('classe_id').populate("user_id").populate('campus').populate('filiere')
        .then((etudiantsFromDb) => {
            res.status(200).send(etudiantsFromDb);
        })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});

app.get("/getAllAlternants", (req, res, next) => {
    AlternantTosign = []
    Etudiant.find({ isAlternant: true, isActive: { $ne: false } }).populate('user_id')
        .then(alternantsFromDb => {

            let i = alternantsFromDb.length
            alternantsFromDb.forEach(alternatInscrit => {

                CAlternance.find({ alternant_id: alternatInscrit._id }).then(contratdata => {

                    if (contratdata.length !== 0) {

                    }
                    else {

                        AlternantTosign.push(alternatInscrit)

                    }

                    i--;
                    if (i < 1) {


                        res.status(200).send(AlternantTosign);

                    }
                })
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Impossible de recuperer la liste des étudiant');
        })
});


//Récupérer la liste de tous les étudiants via un Id de classe
app.get("/getAllByClasseId/:id", (req, res, next) => {
    Etudiant.find({ classe_id: req.params.id, isActive: { $ne: false } })
        .then((etudiantsFromDb) => { res.status(200).send(etudiantsFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});

//Récupérer la liste de tous les étudiants en attente d'assignation de groupe
app.get("/getAllWait", (req, res, next) => {
    Etudiant.find({ classe_id: null, valided_by_admin: true, isActive: { $ne: false } }).populate('filiere').populate('user_id')
        .then((etudiantsFromDb) => { res.status(200).send(etudiantsFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});

//Récupérer la liste de tous les étudiants en de validation par l'administration
app.get("/getAllWaitForVerif", (req, res, next) => {
    Etudiant.find({ valided_by_admin: { $ne: true }, isActive: { $ne: false } }).populate('filiere').populate('user_id')
        .then((etudiantsFromDb) => { res.status(200).send(etudiantsFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});

//Récupérer la liste de tous les étudiants en de validation par l'administration
app.get("/getAllWaitForCreateAccount", (req, res, next) => {
    Etudiant.find({ valided_by_admin: true, valided_by_support: { $ne: true }, isActive: { $ne: false } }).populate('filiere').populate('user_id').populate('classe_id').populate('campus')
        .then((etudiantsFromDb) => { res.status(200).send(etudiantsFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});


//Recupere un étudiant via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Etudiant.findOne({ _id: req.params.id })
        .then((etudiantFromDb) => { res.status(200).send(etudiantFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer cet étudiant ' + error.message); })
});

//Recupere un étudiant via son user_id
app.get("/getByUserid/:user_id", (req, res, next) => {
    Etudiant.findOne({ user_id: req.params.user_id })
        .then((etudiantFromDb) => { res.status(200).send(etudiantFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer cet étudiant ' + error.message); })
});

//Recupere un étudiant via son user_id
app.get("/getPopulateByUserid/:user_id", (req, res, next) => {
    Etudiant.findOne({ "user_id": req.params.user_id }).populate('user_id')
        .then((etudiantFromDb) => { res.status(200).send(etudiantFromDb); })
        .catch((error) => { res.status(500).send('Impossible de recuperer cet étudiant ' + error.message); })
});


//Mettre à jour un étudiant via son identifiant
app.post("/update", (req, res, next) => {
    Etudiant.findById(req.body._id).then(et => {
        let token = jwt.decode(req.header("token"))
        let me = new MonitoringEtudiant(
            {
                agent_id: token.id,
                etudiant_id: req.body._id,
                date: new Date(),
                etudiant_before: et,
                etudiant_after: { ...req.body },
                remarque: "Update"
            }
        )
        me.save()
    })
    Etudiant.findOneAndUpdate({ _id: req.body._id },
        {
            ...req.body
        }, { new: true }, (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send(err)
            } else {
                res.status(201).send(user)
            }
        })
});

// ajouter le droit d'acces au document ajouter 
app.post("/setFileRight/:idetudiant", (req, res, next) => {

    let filename = req.body[1]

    Etudiant.findOne({ _id: req.params.idetudiant })
        .then((etudiantFromDb) => {
            let filearrayT;
            filearrayT = (etudiantFromDb.fileRight) ? etudiantFromDb.fileRight : { 'filename': true };
            filearrayT[filename] = req.body[2]

            Etudiant.findOneAndUpdate({ _id: req.params.idetudiant },
                {
                    fileRight: filearrayT,
                }, { new: true }, (err, etudiant) => {
                    if (err) {
                        console.log(err);
                        res.send(err)
                    } else {

                        res.send(etudiant)
                    }
                })
        })

});

app.post('/sendEDT/:id', (req, res, next) => {
    let mailList = []
    Etudiant.find({ classe_id: req.params.id }).then(etudiantList => {
        etudiantList.forEach(etudiant => {
            User.findById(etudiant.user_id).then(user => {
                //Envoie de mail à user.email
                mailList.push(user.email)
            })
        })
        let url = '<a href="' + origin[0] + '/calendrier/classe/' + req.params.id + '">Voir mon emploi du temps</a>'
        let htmlmail = ("<div style='white-space: pre-wrap;'>" + req.body.mailcustom.replace('<lien>', url).replace('<lien edt>', url) + "</div><footer> <img src='red'/></footer>").replace(/\n/g, '<br>').replace('<signature espic><br>', '')
        let attachments = [{
            filename: 'signature_peda_espic.png',
            path: 'assets/signature_peda_espic.png',
            cid: 'red' //same cid value as in the html img src
        }]
        if (htmlmail.indexOf('<signature adg>') != -1) {
            attachments = []
            htmlmail = htmlmail.replace('<signature adg><br>', '')
        } else if (htmlmail.indexOf('<signature eduhorizons>') != -1) {
            attachments = []
            htmlmail = htmlmail.replace('<signature eduhorizons><br>', '')
        } else if (htmlmail.indexOf('<signature estya>') != -1) {
            attachments = [{
                filename: 'signature_peda_estya.png',
                path: 'assets/signature_peda_estya.png',
                cid: 'red' //same cid value as in the html img src
            }]
            htmlmail = htmlmail.replace('<signature estya><br>', '')
        }
        let mailOptions = {
            from: 'ims@intedgroup.com',
            to: mailList,
            subject: req.body.objet,
            html: htmlmail,
            attachments
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
            console.log("SEND TO", mailList)
        });
        res.status(201).send(mailList)

    })
});
/*
1- Récupérer toutes les notes de la classe du semestre
2- Récupérer toutes les examens de chaque matière 
3- Faire la moyenne de chaque étudiant pour chaque matière
4- Récupérer la moyenne basse et haute (min() et max()) de chaque matière
5- Récupérer la moyenne de l'étudiant de chaque matière
*/
app.get("/getBulletin/:etudiant_id/:semestre", (req, res, next) => {
    Etudiant.findById(req.params.etudiant_id).then(etudiant => {
        Classe.findById(etudiant.classe_id).then(classe => {
            Etudiant.find({ classe_id: etudiant.classe_id }).then(listEtudiant => {
                var listNotes = []
                var dicMatiere = {}
                var listMatiere = []
                var dicExamen = {}
                var listeNotesEleves = {}//id_eleve:[id_matiere:[note]]
                var dicMoy = {}
                var dicMoyMatiere = {}
                var MoyenneEtudiant = {} //[id_matiere:moyenne]
                let my = 0
                Examen.find({ classe_id: etudiant.classe_id }).then(listExamen => {
                    let dicNotes = {}
                    Note.find({ semestre: req.params.semestre }).then(n => {
                        n.forEach(note => {
                            if (dicNotes[note.examen_id] && dicNotes[note.examen_id].length != 0) {
                                dicNotes[note.examen_id].push(note)
                            } else {
                                dicNotes[note.examen_id] = [note]
                            }
                        })
                        listExamen.forEach(examen => {
                            dicExamen[examen._id] = examen
                            //1- Récupérer toutes les notes de la classe du semestre
                            listNotes = listNotes.concat(dicNotes[examen._id])
                            if (!listMatiere.includes(examen.matiere)) {
                                listMatiere.push(examen.matiere)
                            }
                            //2- Récupérer toutes les examens de chaque matière 
                            if (dicMatiere[examen.matiere] && dicMatiere[examen.matiere].length != 0) {
                                dicMatiere[examen.matiere].push(examen._id)
                            } else {
                                dicMatiere[examen.matiere] = [examen._id]
                            }
                        })
                        //3- Faire la moyenne de chaque étudiant pour chaque matière
                        let listEtuEx = []
                        let listMatierev2 = []
                        listNotes.forEach(note => {
                            if (listeNotesEleves[note.etudiant_id]) {
                                if (listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id] && listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id].length != 0) {
                                    listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id].push(parseInt(note.note_val) / parseInt(dicExamen[note.examen_id].note_max))
                                } else {
                                    listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id] = [parseInt(note.note_val) / parseInt(dicExamen[note.examen_id].note_max)]
                                }
                            } else {
                                listeNotesEleves[note.etudiant_id] = {}
                                listeNotesEleves[note.etudiant_id][dicExamen[note.examen_id].matiere_id] = [parseInt(note.note_val) / parseInt(dicExamen[note.examen_id].note_max)]
                            }
                            if (!listEtuEx.includes({ "etudiant": note.etudiant_id, "matiere": dicExamen[note.examen_id].matiere_id })) {
                                listEtuEx.push({ "etudiant": note.etudiant_id, "matiere": dicExamen[note.examen_id].matiere_id })
                            }
                        })
                        //4- Récupérer la moyenne basse et haute (min() et max()) de chaque matière
                        listEtuEx.forEach(etuEx => {
                            if (!dicMoy[etuEx.etudiant] || dicMoy[etuEx.etudiant].length != 0) {
                                dicMoy[etuEx.etudiant] = {}
                                dicMoy[etuEx.etudiant][etuEx.matiere] = avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])
                            } else {
                                dicMoy[etuEx.etudiant][etuEx.matiere] = avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])
                            }
                            if (etuEx.etudiant == req.params.etudiant_id) {
                                //5- Récupérer la moyenne de l'étudiant de chaque matière
                                MoyenneEtudiant[etuEx.matiere] = avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])
                                my += MoyenneEtudiant[etuEx.matiere]
                                if (!listMatierev2.includes(etuEx.matiere)) {
                                    listMatierev2.push(etuEx.matiere)
                                }
                            }
                            if (!dicMoyMatiere[etuEx.matiere] || dicMoyMatiere[etuEx.matiere].length != 0) {
                                dicMoyMatiere[etuEx.matiere] = [avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere])]
                            } else {
                                dicMoyMatiere[etuEx.matiere].push(avg(listeNotesEleves[etuEx.etudiant][etuEx.matiere]))
                            }

                        })
                        console.log(MoyenneEtudiant, MoyenneEtudiant.length)
                        my = my / MoyenneEtudiant.length
                        //                      Moyenne Classe, Moyenne Etudiant, 
                        res.status(200).send({ dicMoyMatiere, MoyenneEtudiant, listeNotesEleves, listMatiere: listMatierev2, moyenneGeneral: my })
                    })
                })
            })
        })
    })
})

app.get("/getBulletinV3/:etudiant_id/:semestre", (req, res, next) => {
    //TODO Mettre les moy sur 20 et calculer les coeffs des examens
    // MATIERE, COEF, MOY ETU, MOY CLASSE, MIN CLASSE, Max Classe, Appreciation
    // MOY TT ETU
    // { matiere_name: "Template", coef: 2, moy_etu: 10.00, moy_classe: 10.00, min_classe: 0.00, max_classe: 20.00, appreciation: "J'adore ce test",matiere_id: matiere_id._id }
    let r = []
    let moy_tt = 0.00000000001
    let haveDispensed = false
    Etudiant.findById(req.params.etudiant_id).then(chosenOne => {
        Etudiant.find({ classe_id: chosenOne.classe_id }).then(etudiants => {
            let listEtudiantID = []
            etudiants.forEach(etu => {
                listEtudiantID.push(etu._id)
            })
            Note.find({ etudiant_id: { $in: listEtudiantID }, semestre: req.params.semestre }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).then(notes => {
                let listExamenID = []
                let listMatiereNOM = []
                let listNotesEtudiants = {} // {etudiant_id:{matiere_id:[number]}}
                let listMoyenneEtudiants = {} // {etudiant_id:{matiere_id:number}}
                let listMoyenne = {} // {matiere_nom:[number]}
                let dicMatiere = {}
                let listMoyChoose = {}
                notes.forEach(n => {
                    if (n.examen_id != null && !listExamenID.includes(n.examen_id._id)) {
                        listExamenID.push(n.examen_id._id)
                    }
                    if (n.examen_id != null && n.examen_id.matiere_id != null && !listMatiereNOM.includes(n.examen_id.matiere_id.nom)) {
                        listMatiereNOM.push(n.examen_id.matiere_id.nom)
                        dicMatiere[n.examen_id.matiere_id.nom] = n.examen_id.matiere_id
                    }

                })
                listEtudiantID.forEach(e_id => {
                    listNotesEtudiants[e_id] = {}
                    listMatiereNOM.forEach(m_nom => {
                        listNotesEtudiants[e_id][m_nom] = []
                        notes.forEach(note => {
                            if (note.etudiant_id.toString() == e_id.toString() && note.examen_id.matiere_id.nom == m_nom) {
                                listNotesEtudiants[e_id][m_nom].push(parseFloat(note.note_val))
                            }
                        })
                    })
                })
                listEtudiantID.forEach(e_id => {
                    listMoyenneEtudiants[e_id] = {}
                    listMatiereNOM.forEach(m_nom => {
                        listMoyenneEtudiants[e_id][m_nom] = 0.00000000001
                        if (listNotesEtudiants[e_id][m_nom] != [] && listNotesEtudiants[e_id][m_nom].length != 0) {
                            listMoyenneEtudiants[e_id][m_nom] = avg(listNotesEtudiants[e_id][m_nom])
                        }
                    })
                })
                listMatiereNOM.forEach(m_nom => {
                    listMoyenne[m_nom] = []
                    listEtudiantID.forEach(e_id => {
                        listMoyenne[m_nom].push(listMoyenneEtudiants[e_id][m_nom])
                    })
                })
                let dicRB = {}
                RachatBulletin.find({ user_id: chosenOne.user_id, semestre: req.params.semestre }).then(rbs => {
                    rbs.forEach(rb => {
                        dicRB[rb.matiere_id] = rb
                    })
                    let sumMoy = 0
                    listMatiereNOM.forEach(m_nom => {
                        let old_note = null
                        let isDispensed = false
                        if (dicRB[dicMatiere[m_nom]._id]) {
                            old_note = listMoyenneEtudiants[req.params.etudiant_id][m_nom]
                            isDispensed = dicRB[dicMatiere[m_nom]._id].isDispensed
                            //TODO listMoyenneEtudiants ne prends pas en compte les absences
                            listMoyenneEtudiants[req.params.etudiant_id][m_nom] = +(dicRB[dicMatiere[m_nom]._id].fixed_moy.toString())
                        }
                        r.push({ matiere_name: m_nom, coef: dicMatiere[m_nom].coeff, ects: dicMatiere[m_nom].credit_ects, moy_etu: listMoyenneEtudiants[req.params.etudiant_id][m_nom], moy_classe: avg(listMoyenne[m_nom]), min_classe: min(listMoyenne[m_nom]), max_classe: max(listMoyenne[m_nom]), matiere_id: dicMatiere[m_nom]._id, old_note, isDispensed })
                        if (!isDispensed) {
                            moy_tt += listMoyenneEtudiants[req.params.etudiant_id][m_nom] * dicMatiere[m_nom].coeff
                            sumMoy += dicMatiere[m_nom].coeff
                        } else {
                            haveDispensed = true
                        }

                        listMoyChoose[dicMatiere[m_nom]._id] = listMoyenneEtudiants[req.params.etudiant_id][m_nom]
                    })
                    if (sumMoy != 0) {
                        moy_tt = moy_tt / sumMoy
                    }
                    res.status(201).send({ data: r, moyenneEtudiant: moy_tt, listMoyEtu: listMoyChoose, haveDispensed })
                })
            })
        })
    })
})

app.get("/getAllByCode/:code", (req, res) => {
    Etudiant.find({ classe_id: { $ne: null }, isActive: { $ne: false } }).populate('classe_id').populate('user_id').populate('campus').populate('filiere').then(result => {
        let p = []
        result.forEach(d => {
            if (d.code_partenaire == req.params.code) {
                p.push(d)
            }
        })
        res.send(p)
    })
});

function avg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}

function min(myArray) {
    var i = 0, min = myArray[0], ArrayLen = myArray.length;
    while (i < ArrayLen) {
        if (myArray[i] < min) {
            min = myArray[i]
        }
        i++
    }
    return min;
}

function max(myArray) {
    var i = 0, min = myArray[0], ArrayLen = myArray.length;
    while (i < ArrayLen) {
        if (myArray[i] > min) {
            min = myArray[i]
        }
        i++
    }
    return min;
}

const multer = require('multer');
const { Prospect } = require("../models/prospect");
const { Message } = require("../models/message");
const { MonitoringEtudiant } = require("../models/monitoring");


app.get("/getFiles/:id", (req, res) => {
    let filesTosend = [];
    fs.readdir('./storage/etudiant/' + req.params.id + "/", (err, files) => {

        if (!err) {
            files.forEach(file => {
                filesTosend.push(file)
            });
        }
        res.status(200).send(filesTosend);
    }, (error) => (console.error(error)))
})

app.get("/downloadFile/:id/:filename", (req, res) => {
    let pathFile = "storage/etudiant/" + req.params.id + "/" + req.params.filename
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


app.get("/deleteFile/:id/:filename", (req, res) => {
    let pathFile = "storage/etudiant/" + req.params.id + "/" + req.params.filename
    try {
        fs.unlinkSync(pathFile)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }

    Etudiant.findOne({ _id: req.params.id })
        .then((etudiantFromDb) => {
            let filearrayT = etudiantFromDb.fileRight;

            delete filearrayT[req.params.filename]

            Etudiant.findById(req.params.id).then(et => {
                let token = jwt.decode(req.header("token"))
                let me = new MonitoringEtudiant(
                    {
                        agent_id: token.id,
                        etudiant_id: req.params.id,
                        date: new Date(),
                        etudiant_before: et,
                        etudiant_after: { ...req.body },
                        remarque: "Suppresion de fichier"
                    }
                )
                me.save()
            })

            Etudiant.findOneAndUpdate({ _id: req.params.id },
                {
                    fileRight: filearrayT,
                }, { new: true }, (err, etudiant) => {
                    if (err) {
                        console.log(err);
                        res.send(err)
                    }
                    else {
                        res.status(200).send()
                    }
                })
        })
        .catch((error) => { res.status(400).json({ error }) });




});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/etudiant/' + req.body.id + '/')) {
            fs.mkdirSync('storage/etudiant/' + req.body.id + '/', { recursive: true })
        }
        callBack(null, 'storage/etudiant/' + req.body.id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } })

app.post('/uploadFile/:id', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {

        res.status(201).json({ dossier: "dossier mise à jour" });
    }

}, (error) => { res.status(500).send(error); })

app.post('/getAllByMultipleClasseID', (req, res) => {
    Etudiant.find({ classe_id: { $in: req.body.classe_id }, isActive: { $ne: false } }).populate("user_id").populate("classe_id").then(result => {
        res.send(result)
    })
});

app.post('/getAllByMultipleClasseIDWithoutPresence', (req, res) => {
    let p_id = []
    let r = []
    req.body.presence.forEach(p => {
        p_id.push(p.user_id._id)
    })
    Etudiant.find({ classe_id: { $in: req.body.classe_id }, isActive: { $ne: false } }).populate("user_id").populate("classe_id").then(result => {
        result.forEach(p => {
            if (p.user_id && customIncludes(p_id, p.user_id._id) == false)
                r.push(p)
        })
        res.send(r)
    })
});

function customIncludes(list, id) {
    let r = false
    list.forEach(ele => {
        if (ele == id)
            r = true
    })
    return r
}

app.post('/addNewPayment/:id', (req, res) => {
    Etudiant.findById(req.params.id).then(et => {
        let token = jwt.decode(req.header("token"))
        let me = new MonitoringEtudiant(
            {
                agent_id: token.id,
                etudiant_id: req.params.id,
                date: new Date(),
                etudiant_before: et,
                etudiant_after: { ...req.body },
                remarque: "Ajout Payement"
            }
        )
        me.save()
    })
    Etudiant.findByIdAndUpdate(req.params.id, { payment_reinscrit: req.body.payement }, function (err, data) {
        if (err) {
            console.error(err)
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.post('/validateProspect/:user_id', (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, {
        type: "Initial"
    }, { new: true }, (err, updatedUser) => {
        if (err) {
            console.error(err)
        } else {
            delete req.body._id
            let etu = new Etudiant({
                ...req.body
            })
            etu.save((errEtu, newEtu) => {
                if (errEtu) {
                    console.error(errEtu)
                } else {
                    Prospect.findOneAndUpdate({ user_id: req.params.user_id }, { archived: true }, { new: true }, (err, newP) => {
                        res.send(newP)
                        fs.rename("../storage/prospect/" + newP._id, "../storage/etudiant/" + newEtu._id, (err) => {
                            if (err)
                                console.error(err)
                        })
                    })
                }
            })
        }
    })
})

app.get('/updateDossier/:etudiant_id/:statut_dossier', (req, res) => {
    Etudiant.findById(req.params.etudiant_id).then(et => {
        let token = jwt.decode(req.header("token"))
        let me = new MonitoringEtudiant(
            {
                agent_id: token.id,
                etudiant_id: req.params.etudiant_id,
                date: new Date(),
                etudiant_before: et,
                etudiant_after: { ...req.body },
                remarque: "Update Dossier"
            }
        )
        me.save()
    })
    Etudiant.findByIdAndUpdate(req.params.etudiant_id, { statut_dossier: req.params.statut_dossier, date_dernier_modif_dossier: new Date() }, { new: true }, (err, doc) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.status(201).send(doc)
        }
    })
})

app.get('/assignEmail/:etudiant_id/:email_ims', (req, res) => {
    User.findOne({ email: req.params.email_ims }).then(dataU => {
        if (!dataU)
            Etudiant.findByIdAndUpdate(req.params.etudiant_id, { valided_by_support: true }, { new: true }, function (err, data) {
                if (err) {
                    console.error(err)
                    res.status(400).send(err)
                }
                else
                    User.findByIdAndUpdate(data.user_id, { email: req.params.email_ims }, { new: true }, function (err2, dataU) {
                        if (err2) {
                            console.error(err2)
                            res.status(400).send(err2)
                        } else {
                            res.status(201).send({ dataEtu: data, dataUser: dataU })
                        }
                    })
            })
        else
            res.status(500).send(dataU)
    })

})

app.get('/downloadBulletin/:id', (req, res) => {
    Etudiant.findByIdAndUpdate(req.params.id, { date_telechargement_bulletin: new Date() }, { new: true }, (err, doc) => {
        if (!err) {
            res.status(200).send(doc)
        } else {
            console.error(err)
            res.status(500).send(err)
        }

    })
})

app.get('/disable/:id', (req, res) => {
    /*Etudiant.findByIdAndRemove(req.params.id, { new: true }, (err, doc) => {
        if (!err) {
            res.status(200).send(doc)
        } else {
            console.error(err)
            res.status(500).send(err)
        }

    })
    User.findByIdAndRemove(req.params.user_id)
    Presence.remove({ user_id: req.params.user_id })
    Appreciation.remove({ etudiant_id: req.params.id })
    CAlternance.remove({ alternant_id: req.params.id })
    Dashboard.remove({ user_id: req.params.user_id })
    Message.remove({ user_id: req.params.user_id })
    RachatBulletin.remove({ user_id: req.params.user_id })
    Ticket.remove({ createur_id: req.params.user_id })*/

    Etudiant.findById(req.params.etudiant_id).then(et => {
        let token = jwt.decode(req.header("token"))
        let me = new MonitoringEtudiant(
            {
                agent_id: token.id,
                etudiant_id: req.params.etudiant_id,
                date: new Date(),
                etudiant_before: et,
                etudiant_after: { ...req.body },
                remarque: "Désactiver"
            }
        )
        me.save()
    })

    Etudiant.findByIdAndUpdate(req.params.id, { isActive: false }).then(etudiant => {
        res.send(etudiant)
    }, err => {
        console.err(err)
        res.send(err)
    })
})
module.exports = app;