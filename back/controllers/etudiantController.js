const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const { Etudiant } = require("./../models/etudiant");
const { Classe } = require("./../models/classe");
const { Examen } = require("./../models/examen");
const { Seance } = require("./../models/seance")
const { Note } = require("./../models/note");
const { Matiere } = require("./../models/matiere");
const { User } = require('./../models/user');
const { CAlternance } = require('./../models/contrat_alternance');
const { RachatBulletin } = require('./../models/RachatBulletin');
const { HistoCFA } = require('./../models/IMS Monitoring/historisationCFA')
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
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
    if (argProd.includes("dev")) {
        origin = ["https://141.94.71.25", "https://dev-ims.intedgroup.com"];
    } else if (argProd.includes("qa")) {
        origin = ["https://152.228.219.55", "https://qa-ims.intedgroup.com"];
    } else if (argProd.includes("prod2")) {
        origin = ["https://51.68.215.184", "https://prod2-ims.intedgroup.com"];
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
            type: etudiant.isAlternant ? "Alternant" : "Initial",
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
                        console.log("Le user n'existe pas - enregistrement en cours",)
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
    Etudiant.findByIdAndUpdate(req.body._id, { classe_id: etudiantData.groupe, date_inscription: new Date() }, { new: true }, function (err, data) {
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
    Etudiant.find({ classe_id: { $ne: null }, isActive: { $ne: false } }).populate('classe_id').populate("user_id").populate('campus').populate('filiere').populate('ecole_id')
        .then((etudiantsFromDb) => {
            res.status(200).send(etudiantsFromDb);
        })
        .catch((error) => { res.status(500).send('Impossible de recuperer la liste des étudiant'); })
});

app.get("/getAllAlternants", (req, res, next) => {
    AlternantTosign = []
    Etudiant.find({ isAlternant: true, isActive: { $ne: false } }).populate('user_id')
        .then(alternantsFromDb => {

           /* let i = alternantsFromDb.length
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
            });*/
            res.status(200).send(alternantsFromDb);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Impossible de recuperer la liste des étudiant');
        })
});


//Récupérer la liste de tous les étudiants via un Id de classe
app.get("/getAllByClasseId/:id", (req, res, next) => {
    Etudiant.find({ classe_id: req.params.id, isActive: { $ne: false } }).populate('user_id')
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
    Etudiant.findOne({ "user_id": req.params.user_id }).populate('user_id').populate('classe_id')
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
        if (et.ecole_id != req.body.ecole_id) {
            let cfaUpdate = new HistoCFA({
                user_id: et.user_id,
                old_cfa: req.body.ecole_id,
                new_cfa: null,
                date_debut: new Date(),
                date_fin: null
            })
            HistoCFA.findOneAndUpdate({ user_id: et.user_id, date_fin: null, new_cfa: null }, { date_fin: new Date(), new_cfa: req.body.ecole_id }, { new: true }, (err, doc) => {
                cfaUpdate.save()
            })
        }
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

app.get("/getBulletinV3/:etudiant_id/:semestre", (req, res, next) => {
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
            if (req.params.semestre == "Annuel")
                req.params.semestre = /./i
            Note.find({ etudiant_id: { $in: listEtudiantID }, semestre: req.params.semestre }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).populate({ path: "etudiant_id", populate: { path: "classe_id" } }).then(notes => {
                let listMatiereNOM = []
                let listNotesEtudiantsCoeff = {}
                let listMoyenneEtudiants = {} // {etudiant_id:{matiere_id:number}}
                let listMoyenne = {} // {matiere_nom:[number]}
                let dicMatiere = {}
                let listMoyChoose = {}
                notes.forEach(n => {
                    if (n.examen_id && n.examen_id.matiere_id)
                        n.examen_id.matiere_id.forEach(mid => {
                            if (n.etudiant_id && n.etudiant_id.classe_id && mid.formation_id.includes(n.etudiant_id.classe_id.diplome_id)) {
                                if (n.examen_id != null && !listMatiereNOM.includes(mid.abbrv)) {
                                    listMatiereNOM.push(mid.abbrv)
                                    dicMatiere[mid.abbrv] = mid
                                }
                            }
                        })
                })
                listEtudiantID.forEach(e_id => {
                    listNotesEtudiantsCoeff[e_id] = {}
                    listMatiereNOM.forEach(m_nom => {
                        listNotesEtudiantsCoeff[e_id][m_nom] = []
                        notes.forEach(note => {
                            if (note.examen_id && note.examen_id.matiere_id)
                                note.examen_id.matiere_id.forEach(mid => {
                                    if (note.etudiant_id && note.etudiant_id.classe_id && mid.formation_id.includes(note.etudiant_id.classe_id.diplome_id) && !note.isAbsent)
                                        if (note.etudiant_id._id.toString() == e_id.toString() && note.examen_id.matiere_id.abbrv == m_nom && note.isAbsent == false)
                                            if (note.examen_id.niveau == 'Projet Professionel' || note.examen_id.niveau == 'BTS Blanc')
                                                for (let i = 0; i < 3; i++)
                                                    listNotesEtudiantsCoeff[e_id][m_nom].push(parseFloat(note.note_val) * 20 / parseFloat(note.examen_id.note_max))
                                            else
                                                for (let i = 0; i < (note.examen_id.coef * 2); i++)
                                                    listNotesEtudiantsCoeff[e_id][m_nom].push((parseFloat(note.note_val) * 20 / parseFloat(note.examen_id.note_max)))

                                })
                        })
                    })
                })
                listEtudiantID.forEach(e_id => {
                    listMoyenneEtudiants[e_id] = {}
                    listMatiereNOM.forEach(m_nom => {
                        listMoyenneEtudiants[e_id][m_nom] = 0.00000000001
                        if (listNotesEtudiantsCoeff[e_id][m_nom] != [] && listNotesEtudiantsCoeff[e_id][m_nom].length != 0)
                            listMoyenneEtudiants[e_id][m_nom] = avg(listNotesEtudiantsCoeff[e_id][m_nom])
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
    Etudiant.find({ classe_id: { $ne: null }, isActive: { $ne: false } }).populate('classe_id').populate('user_id').populate('campus').populate('filiere').populate('ecole_id').then(result => {
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
const { Evaluation } = require("../models/evaluation");


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
                        console.error(err);
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
    console.log('Test')
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        console.log(file)
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
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(req.body.payement), 'd8a0707da72cadb').toString();
    Etudiant.findByIdAndUpdate(req.params.id, { payment_reinscrit: ciphertext }, { new: true }, function (err, data) {
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
    let l = req.params.statut_dossier.split(',')
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
    Etudiant.findByIdAndUpdate(req.params.etudiant_id, { statut_dossier: l, date_dernier_modif_dossier: new Date() }, { new: true }, (err, doc) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.status(201).send(doc)
        }
    })
})

app.get('/assignEmail/:etudiant_id/:email_ims/:user_id', (req, res) => {
    User.findOne({ email: req.params.email_ims }).then(dataU => {
        if (!dataU || dataU._id == req.params.user_id)
            Etudiant.findByIdAndUpdate(req.params.etudiant_id, { valided_by_support: true, date_valided_by_support: new Date() }, { new: true }, function (err, data) {
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
        let dab = new Etudiant({ ...et })
        dab.isActive = false
        let me = new MonitoringEtudiant(
            {
                agent_id: token.id,
                etudiant_id: req.params.etudiant_id,
                date: new Date(),
                etudiant_before: et,
                etudiant_after: dab,
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

app.post('/getMatiereByMatiereListAndEtudiantID/:etudiant_id', (req, res) => {
    Etudiant.findById(req.params.etudiant_id).populate('classe_id').then(etudiant => {
        Matiere.findOne({ formation_id: etudiant.classe_id.diplome_id, _id: { $in: req.body.matiere_id } }).then(r => {
            res.send(r)
        })
    })
})

app.get('/getAllByFormateur/:formateur_id', (req, res) => {
    Seance.find({ formateur_id: req.params.formateur_id }).then(seances => {
        let lClasse = []
        seances.forEach(s => {
            s.classe_id.forEach(cid => {
                if (lClasse.includes(cid) == false)
                    lClasse.push(cid)
            })
        })
        Etudiant.find({ classe_id: { $in: lClasse } }).populate('user_id').populate('campus').populate('ecole_id').populate('filiere').populate('classe_id').then(etudiants => {
            res.send(etudiants)
        })
    })
})

module.exports = app;