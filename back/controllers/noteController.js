const express = require("express");
const { UpdateNote } = require("../models/IMS Monitoring/UpdateNote");
const app = express();
const jwt = require("jsonwebtoken");
app.disable("x-powered-by");
const { Note } = require('../models/note');
const { PVAnnuel } = require("../models/pvAnnuel");


//Recuperation de la liste des notes
app.get("/getAll", (req, res, next) => {
    Note.find()
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de la liste des notes
app.get("/getAllPopulate", (req, res, next) => {
    Note.find().populate({ path: 'classe_id', populate: { path: 'diplome_id', populate: { path: 'campus_id' } } }).populate({ path: 'etudiant_id', populate: { path: 'user_id' } }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).populate({ path: "examen_id", populate: { path: "formateur_id", populate: { path: "user_id" } } })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de la liste des notes via id d'un étudiant
app.get("/getAllByEtudiantId/:id", (req, res, next) => {
    Note.find({ etudiant_id: req.params.id })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error); });
});



//Recuperation de la liste des notes via un id et un semestre
app.get("/getAllByIdBySemestre/:id/:semestre", (req, res, next) => {
    Note.find({ etudiant_id: req.params.id, semestre: req.params.semestre })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error); });
});


//Recuperation de la liste des notes par semestre et par classe
app.get("/getAllByClasseBySemestreByExam/:semestre/:classe/:exam", (req, res, next) => {
    Note.find({ semestre: req.params.semestre, classe_id: req.params.classe, examen_id: req.params.exam })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error); });
});


//Recupère une note via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Note.findOne({ _id: req.params.id })
        .then((noteFromDb) => { res.status(200).send(noteFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Récupère la liste des notes via un id classe
app.get("/getAllByClasse/:id", (req, res, next) => {
    Note.find({ classe_id: req.params.id })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Permet de verifier si un etudiant à deja une note pour le meme semestre et pour la meme matiere
app.get("/verifNoteByIdBySemestreByExam/:id/:semestre/:exam", (req, res, next) => {
    Note.findOne({ etudiant_id: req.params.id, semestre: req.params.semestre, examen_id: req.params.exam })
        .then((noteFromDb) => {
            if (noteFromDb) {
                res.status(201).json({ error: "L'étudiant possède déjà une note" });
            }
            else {
                res.status(200).json({ success: "L'étudiant ne possède pas de note" });
            }

        })
        .catch((error) => { res.status(500).send("Veuillez contacter un administrateur"); });
});


//Création d'une nouvelle note
app.post("/create", (req, res, next) => {

    //Création du nouvel objet Note
    let data = req.body;
    delete data._id
    data.date_creation = new Date()
    console.log(data)
    let note = new Note(
        {
            ...data
        }
    );

    note.save()
        .then((noteSaved) => { res.status(200).send(noteSaved); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperation d'une liste de note par semestre et par classe
app.get("/getAllByExamenID/:examen_id", (req, res, next) => {
    Note.find({ examen_id: req.params.examen_id }).populate({ path: 'classe_id', populate: { path: 'diplome_id', populate: { path: 'campus_id' } } }).populate({ path: 'etudiant_id', populate: { path: 'user_id' } }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).populate({ path: "examen_id", populate: { path: "formateur_id", populate: { path: "user_id" } } })
        .then((noteFromDb) => { res.status(200).send(noteFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Mise à jour d'une note via son identifiant
app.put("/updateById/:id", (req, res, next) => {

    Note.findOneAndUpdate({ _id: req.params.id },
        {
            note_val: req.body.note_val,
            semestre: req.body.semestre,
            etudiant_id: req.body.etudiant_id,
            examen_id: req.body.examen_id,
            appreciation: req.body.appreciation,
            classe_id: req.body.classe_id,
            matiere_id: req.body.matiere_id,
        })
        .then((noteUpdated) => {
            let nUpdated = new UpdateNote({
                note_id: req.params.id,
                user_id: jwt.decode(req.header("token")).id,
                old_note: noteUpdated.note_val,
                new_note: req.body.note_val,
                date_creation: new Date
            })
            nUpdated.save()
            res.status(200).send(noteUpdated);
        })
        .catch((error) => { res.status(400).send(error.message); });
});

app.put("/updateV2/:id", (req, res) => {
    Note.updateOne({ _id: req.params.id }, { ...req.body })
        .then((response) => {
            let nUpdated = new UpdateNote({
                note_id: req.params.id,
                user_id: jwt.decode(req.header("token")).id,
                old_note: response.note_val,
                new_note: req.body.note_val,
                date_creation: new Date
            })
            nUpdated.save()
            res.status(201).send(response);
        })
        .catch((error) => { res.status(500).send(error.message); })
})

app.get("/getPVAnnuel/:semestre/:classe_id", (req, res) => {
    Note.find({ classe_id: { $in: req.params.classe_id }, semestre: req.params.semestre }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).populate({ path: "examen_id", populate: { path: "formateur_id", populate: { path: "user_id" } } }).populate({ path: "etudiant_id", populate: { path: "user_id" } }).populate({ path: "etudiant_id", populate: { path: "classe_id" } }).then(notes => {
        let cols = [] //{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }
        let data = [] //{ prenom: "M", nom: "H", date_naissance: "2", email: "m", notes: { "NomModule": 0}, moyenne: "15" }
        let listMatiereNOM = []
        let listNotesEtudiantsCoeff = {}
        let listMoyenneEtudiants = {} // {etudiant_id:{matiere_id:number}}
        let listMoyenne = {} // {matiere_nom:[number]}
        let dicMatiere = {}
        let listEtudiantID = []
        let dicEtudiant = {}
        notes.forEach(n => {
            if (n.examen_id && n.examen_id.matiere_id)
                n.examen_id.matiere_id.forEach(mid => {
                    //console.log(n.etudiant_id,mid.formation_id)
                    if (n.etudiant_id && n.etudiant_id.classe_id && mid.formation_id.includes(n.etudiant_id.classe_id.diplome_id)) {

                        if (n.examen_id != null && !listMatiereNOM.includes(mid.nom)) {
                            listMatiereNOM.push(mid.nom)
                            dicMatiere[mid.nom] = mid
                            cols.push({ module: mid.nom, formateur: n.examen_id.formateur_id.user_id.lastname + " " + n.examen_id.formateur_id.user_id.firstname, coeff: mid.coeff })
                        }
                    }
                })
            notes.forEach(n => {
                if (n.etudiant_id && listEtudiantID.indexOf(n.etudiant_id._id) == -1) {
                    dicEtudiant[n.etudiant_id._id] = n.etudiant_id
                    listEtudiantID.push(n.etudiant_id._id)
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
                                if (note.etudiant_id._id.toString() == e_id.toString() && note.examen_id.matiere_id[0].nom == m_nom && note.isAbsent == false)
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
        console.log(listNotesEtudiantsCoeff)
        listEtudiantID.forEach(e_id => {
            listMoyenneEtudiants[e_id] = {}
            listMatiereNOM.forEach(m_nom => {
                listMoyenneEtudiants[e_id][m_nom] = 0
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

        listEtudiantID.forEach(e_id => {
            data.push({
                nom: dicEtudiant[e_id].user_id.lastname,
                prenom: dicEtudiant[e_id].user_id.firstname,
                date_naissance: new Date(dicEtudiant[e_id]?.date_naissance).toLocaleDateString(),
                date_inscrit: new Date(dicEtudiant[e_id].user_id?.date_creation).toLocaleDateString(),
                email: dicEtudiant[e_id].user_id.email,
                notes: listMoyenneEtudiants[e_id],
                moyenne: avgDic(listMoyenneEtudiants[e_id]),
                appreciation: ""
            })
        })
        //listMoyenneEtudiants Vide TODO
        res.send({ data, cols })
    })
})
function avg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}
function avgDic(myDic) {
    var i = 0, summ = 0, ArrayDic = Object.keys(myDic), ArrayLen = ArrayDic.length;
    while (i < ArrayLen) {
        summ = summ + myDic[ArrayDic[i++]];
    }
    return summ / ArrayLen;
}
//Sauvegarde d'un PV
app.post("/savePV/:semestre/:classe_id", (req, res, next) => {
    let pv = new PVAnnuel({
        date_creation: new Date(),
        pv_annuel_cols: req.body.cols,
        pv_annuel_data: req.body.data,
        semestre: req.params.semestre,
        classe_id: req.params.classe_id
    })
    pv.save().then(newPv => {
        res.send(newPv)
    })
});
//Chargement d'un PV
app.get("/loadPV/:semestre/:classe_id", (req, res) => {
    PVAnnuel.find({ semestre: req.params.semestre, classe_id: req.params.classe_id }).then(pv => {
        res.send(pv)
    })
})
app.delete("/deletePV/:id", (req, res) => {
    PVAnnuel.findByIdAndRemove(req.params.id, {}, (err, doc) => {
        if (!err)
            res.send(doc)
        else
            res.send(err)
    })
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;