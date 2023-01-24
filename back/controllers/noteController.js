const express = require("express");
const { UpdateNote } = require("../models/IMS Monitoring/UpdateNote");
const app = express();
const jwt = require("jsonwebtoken");
app.disable("x-powered-by");
const { Note } = require('../models/note');
const { PVAnnuel } = require("../models/pvAnnuel");
const { get } = require("mongoose");


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
    if (req.params.semestre == "Annuel")
        req.params.semestre = /./i
    Note.find({ etudiant_id: req.params.id, semestre: req.params.semestre })
        .then((notesFromDb) => { res.status(200).send(notesFromDb); })
        .catch((error) => { res.status(400).send(error); });
});


//Recuperation de la liste des notes par semestre et par classe
app.get("/getAllByClasseBySemestreByExam/:semestre/:classe/:exam", (req, res, next) => {
    if (req.params.semestre == "Annuel")
        req.params.semestre = /./i
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
    if (req.params.semestre == "Annuel")
        req.params.semestre = /./i
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
    let sem = req.params.semestre
    if (sem == "Annuel")
        sem = /./i
    Note.find({ classe_id: req.params.classe_id, semestre: sem }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).populate({ path: "examen_id", populate: { path: "formateur_id", populate: { path: "user_id" } } }).populate({ path: "etudiant_id", populate: { path: "user_id" } }).populate({ path: "etudiant_id", populate: { path: "classe_id" } }).then(notes => {
        let cols = [] //{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }
        let data = [] //{ prenom: "M", nom: "H", date_naissance: "2", email: "m", notes: { "NomModule": 0}, moyenne: "15" }
        let listMatiereNOM = []
        let listNotesEtudiantsCoeff = {}
        let dicAppreciation = {}
        let listMoyenneEtudiants = {} // {etudiant_id:{matiere_id:number}}
        let listMoyenne = {} // {matiere_nom:[number]}
        let dicMatiere = {}
        let listEtudiantID = []
        let dicEtudiant = {}
        notes.forEach(n => {
            if (n.examen_id && n.examen_id.matiere_id) {
                if (!Array.isArray(n.examen_id.matiere_id))
                    n.examen_id.matiere_id = [n.examen_id.matiere_id]
                n.examen_id.matiere_id.forEach(mid => {
                    if (n.etudiant_id && n.etudiant_id.classe_id && mid.formation_id.includes(n.etudiant_id.classe_id.diplome_id)) {

                        if (n.examen_id != null && !listMatiereNOM.includes(mid.nom)) {
                            listMatiereNOM.push(mid.nom)
                            dicMatiere[mid.nom] = mid
                            cols.push({ module: mid.nom, formateur: n.examen_id.formateur_id.user_id.lastname.toUpperCase() + " " + n.examen_id.formateur_id.user_id.firstname, coeff: mid.coeff })
                        }
                    }
                })
            }
            notes.forEach(n => {
                if (n.etudiant_id && listEtudiantID.indexOf(n.etudiant_id._id) == -1 && n.etudiant_id.classe_id._id == req.params.classe_id) {
                    dicEtudiant[n.etudiant_id._id] = n.etudiant_id
                    listEtudiantID.push(n.etudiant_id._id)
                }
            })
        })
        listEtudiantID.forEach(e_id => {
            if (!listNotesEtudiantsCoeff[e_id])
                listNotesEtudiantsCoeff[e_id] = {}
            if (!dicAppreciation[e_id])
                dicAppreciation[e_id] = {}
            listMatiereNOM.forEach(m_nom => {
                if (!listNotesEtudiantsCoeff[e_id][m_nom])
                    listNotesEtudiantsCoeff[e_id][m_nom] = { 'Control Continu': [], 'Exam Finale': [], MoyCC: 1, Total: 0, Appreciation: [] }
                if (!dicAppreciation[e_id][m_nom])
                    dicAppreciation[e_id][m_nom] = []
                notes.forEach(note => {
                    if (note.examen_id && note.examen_id.matiere_id) {
                        if (!Array.isArray(note.examen_id.matiere_id))
                            note.examen_id.matiere_id = [note.examen_id.matiere_id]
                        note.examen_id.matiere_id.forEach(mid => {
                            /*if (mid.nom == m_nom && mid.nom.includes('Culture économique, juridique et managériale') == true && note.examen_id.niveau != 'Control Continu')
                                console.log(note._id, note.examen_id.niveau, note.note_val, note.etudiant_id.user_id.lastname, 1)*/
                            if (note.etudiant_id && note.etudiant_id.classe_id)// && mid.formation_id.includes(note.etudiant_id.classe_id.diplome_id)
                                if (note.etudiant_id._id.toString() == e_id.toString() && mid.nom == m_nom && !note.isAbsent) {
                                    if (note.examen_id.niveau == 'Control Continu') {
                                        if (note.appreciation && !dicAppreciation[e_id][m_nom].includes(note.appreciation))
                                            dicAppreciation[e_id][m_nom].push(note.appreciation)
                                        for (let i = 0; i < note.examen_id.coef; i++)
                                            listNotesEtudiantsCoeff[e_id][m_nom]['Control Continu'].push(parseFloat(note.note_val) * 20 / parseFloat(note.examen_id.note_max))
                                    }
                                    else {
                                        listNotesEtudiantsCoeff[e_id][m_nom]['Exam Finale'].push(parseFloat(note.note_val) * 20 / parseFloat(note.examen_id.note_max));
                                        if (note.appreciation && !dicAppreciation[e_id][m_nom].includes(note.appreciation))
                                            dicAppreciation[e_id][m_nom].push(note.appreciation)
                                    }
                                }
                            //else console.log(e_id, note._id, note.examen_id._id)
                        })
                        note.examen_id.matiere_id.forEach(mid => {
                            if (note.etudiant_id && note.etudiant_id.classe_id)//&& mid.formation_id.includes(note.etudiant_id.classe_id.diplome_id)
                                if (note.etudiant_id._id.toString() == e_id.toString() && mid.nom == m_nom && !note.isAbsent) {
                                    if (listNotesEtudiantsCoeff[e_id][m_nom]['Control Continu'].length != 0 && listNotesEtudiantsCoeff[e_id][m_nom]['Exam Finale'].length != 0) {
                                        listNotesEtudiantsCoeff[e_id][m_nom]['Total'] = (avg(listNotesEtudiantsCoeff[e_id][m_nom]['Control Continu']) * 2 + avg(listNotesEtudiantsCoeff[e_id][m_nom]['Exam Finale']) * 3) / 5
                                        if (mid.nom == m_nom && mid.nom.includes('Culture économique, juridique et managériale'))
                                            listNotesEtudiantsCoeff[e_id][m_nom]['Total'] = (avg(listNotesEtudiantsCoeff[e_id][m_nom]['Control Continu']) + avg(listNotesEtudiantsCoeff[e_id][m_nom]['Exam Finale'])) / 2
                                    }
                                    else if (listNotesEtudiantsCoeff[e_id][m_nom]['Control Continu'].length != 0 && listNotesEtudiantsCoeff[e_id][m_nom]['Exam Finale'].length == 0) {
                                        listNotesEtudiantsCoeff[e_id][m_nom]['Total'] = avg(listNotesEtudiantsCoeff[e_id][m_nom]['Control Continu'])
                                    }
                                    else if (listNotesEtudiantsCoeff[e_id][m_nom]['Control Continu'].length == 0 && listNotesEtudiantsCoeff[e_id][m_nom]['Exam Finale'].length != 0)
                                        listNotesEtudiantsCoeff[e_id][m_nom]['Total'] = avg(listNotesEtudiantsCoeff[e_id][m_nom]['Exam Finale'])
                                    else
                                        listNotesEtudiantsCoeff[e_id][m_nom]['Total'] = 0
                                }
                        })
                    }
                })
                notes.forEach(n => {
                    if (Array.isArray(dicAppreciation[e_id][m_nom]))
                        dicAppreciation[e_id][m_nom] = dicAppreciation[e_id][m_nom].join(', ')
                })
            })
        })
        listEtudiantID.forEach(e_id => {
            listMoyenneEtudiants[e_id] = {}
            listMatiereNOM.forEach(m_nom => {
                listMoyenneEtudiants[e_id][m_nom] = 0
                if (listNotesEtudiantsCoeff[e_id][m_nom]['Total'])
                    listMoyenneEtudiants[e_id][m_nom] = listNotesEtudiantsCoeff[e_id][m_nom]['Total']
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
                custom_id: dicEtudiant[e_id].custom_id,
                nom: dicEtudiant[e_id].user_id.lastname,
                prenom: dicEtudiant[e_id].user_id.firstname,
                date_naissance: formatDate(new Date(dicEtudiant[e_id]?.date_naissance)),
                date_inscrit: formatDate((dicEtudiant[e_id].user_id?.date_creation)),
                email: dicEtudiant[e_id].user_id.email,
                notes: listMoyenneEtudiants[e_id],
                moyenne: avgDic(listMoyenneEtudiants[e_id]),
                appreciation_module: dicAppreciation[e_id],
                appreciation: ""
            })
        })
        //listMoyenneEtudiants Vide TODO
        res.send({ data, cols: cols.sort(compare) })
    })
})
function padTo2Digits(num) { return num.toString().padStart(2, '0'); }
function formatDate(date) {
    date = new Date(date)
    if (date != 'Invalid Date' && date.getFullYear() != '1970')
        return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('/');
    else return ''
}
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
function compare(a, b) {
    let listModule = [/Culture Générale et Expression/i, /anglaise/i, /Mathématiques pour l’informatique/i, /^Culture économique, juridique et managériale$/i, /^Culture économique, juridique et managériale appliquée$/i, /Support et mise à disposition de services informatiques/i, /Administration des systèmes et des réseaux/i, /Conception et développement d'applications/i, /Cybersécurité des services informatique/i]
    let aInList = -1
    let bInList = -1
    listModule.forEach((val, index) => {
        let temp = new RegExp(val)
        if (temp.test(a.module))
            aInList = index
        if (temp.test(b.module))
            bInList = index
    })
    if (aInList == -1 && bInList == -1) {
        if (a.formateur < b.formateur) {
            return -1;
        }
        if (a.formateur > b.formateur) {
            return 1;
        }
        return 0;
    } else if (aInList != -1 && bInList != -1) {
        if (aInList < bInList) {
            return -1;
        }
        if (aInList > bInList) {
            return 1;
        }
        return 0;
    } else if (aInList != -1) {
        //SI B n'est pas dans la liste alors
        if (a.formateur < b.formateur) {
            return -1;
        }
        if (a.formateur > b.formateur) {
            return 1;
        }
        return 0;
    } else {
        //SI A n'est pas dans la liste alors
        if (a.formateur < b.formateur) {
            return -1;
        }
        if (a.formateur > b.formateur) {
            return 1;
        }
        return 0;
    }

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

app.get('/getLastPV/:semestre/:classe_id', (req, res) => {
    PVAnnuel.findOne({ semestre: req.params.semestre, classe_id: req.params.classe_id }, {}, { sort: { date_creation: -1 } }).then(pv => {
        res.send(pv)
    })
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;