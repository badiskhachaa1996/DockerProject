const express = require("express");
const { Note } = require("../models/note");
const app = express();
app.disable("x-powered-by");
const { Examen } = require('./../models/examen');


//Récupère la liste des examens
app.get("/getAll", (req, res, next) => {
    Examen.find()
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récupère la liste des examens
app.get("/getAllPopulate", (req, res, next) => {
    Examen.find().populate('classe_id').populate('matiere_id').populate({ path: 'formateur_id', populate: { path: "user_id" } })
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});

//Récupère la liste des evaluations
app.get("/getAllEvaluation", (req, res, next) => {
    Examen.find()//WIP
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Recupère un examen via son identifiant
app.get("/getById/:id", (req, res, next) => {
    Examen.findOne({ _id: req.params.id })
        .then((examenFromDb) => { res.status(200).send(examenFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});

app.get('/getAllByFormateurID/:id', (req, res, next) => {
    console.log(req.params.id)
    Examen.find({ formateur_id: req.params.id }).populate('classe_id').populate('matiere_id').populate({ path: 'formateur_id', populate: { path: "user_id" } })
        .then((examenFromDb) => { res.status(200).send(examenFromDb); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperer des examens via un id de classe
app.get("/getAllByClasseId/:id", (req, res, next) => {
    Examen.find({ classe_id: req.params.id })
        .then((examensFromDb) => { res.status(200).send(examensFromDb); })
        .catch((error) => { res.status(400).send(error.message); })
});


//Création d'un nouvell examen
app.post("/create", (req, res, next) => {

    //creation du nouvel objet examen
    let data = req.body;
    console.log(data)

    let examen = new Examen(
        {
            ...data
        });
    /* let note = new Note({
         note_val: "0",
         semestre: examen.semestre,
         etudiant_id: 'NULL',
         examen_id: examen._id,
         appreciation:"TEST NULL",
         classe_id:"NULL",
         matiere_id:examen.matiere_id[0],
         isAbsent:false,
         date_creation: new Date()
     })*/
    examen.save()
        .then((examenSaved) => { res.status(200).send(examenSaved); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Mise à jour d'un examen via son identifiant
app.put("/updateById/:id", (req, res, next) => {

    Examen.findOneAndUpdate({ _id: req.params.id },
        {
            classe_id: req.body.classe_id,
            matiere_id: req.body.matiere_id,
            formateur_id: req.body.formateur_id,
            date: req.body.date,
            type: req.body.type,
            note_max: req.body.note_max,
            coef: req.body.coef,
            libelle: req.body.libelle,
        })
        .then((examenUpdated) => { res.status(200).send(examenUpdated); })
        .catch((error) => { res.status(400).send(error.message); });

});

app.get('/getModules/:classe_id', (req, res) => {
    Examen.find({ classe_id: { $in: req.params.classe_id } }).populate({ path: 'matiere_id', populate: { path: "formation_id" } }).then(seances => {
        let modules = []
        seances.forEach(s => {
            if (!modules.includes(s.matiere_id))
                modules.push(s.matiere_id)
        })
        res.status(201).send(modules)
    })
})

app.get('/getModulesByGroupeID/:classe_id', (req, res) => {
    Examen.find({ classe_id: { $in: req.params.classe_id } }).populate({ path: 'matiere_id', populate: { path: "formation_id" } }).then(seances => {
        let modules = []
        seances.forEach(s => {
            if (!modules.includes(s.matiere_id))
                modules.push(s.matiere_id)
        })
        res.status(201).send(modules)
    })
})


app.get('/getFormateurByModuleID/:module_id', (req, res) => {
    Examen.find({ matiere_id: { $in: req.params.module_id } }).populate({ path: 'formateur_id', populate: { path: "user_id" } }).then(seances => {
        let formateurs = []
        seances.forEach(s => {
            if (!formateurs.includes(s.formateur_id))
                formateurs.push(s.formateur_id)
        })
        res.status(201).send(formateurs)
    })
})

app.get('/getAppreciation/:semestre/:classe_id/:formateur_id', (req, res) => {
    Examen.find({ classe_id: { $in: req.params.classe_id }, formateur_id: req.params.formateur_id, semestre: req.params.semestre }).populate("matiere_id").populate({ path: 'formateur_id', populate: { path: "user_id" } }).then(seances => {
        let cols = { module: [], eval: {} } // {module:['Module1'],eval:{'Module1':['Eval1']}}
        let data = {}// {'etudiant_email':{'Eval1':{'appreciation':'dab','note':10}}}
        let examens = []

        seances.forEach(s => {
            examens.push(s._id)
            s.matiere_id.forEach(mid=>{
                if (mid && cols.module.includes(mid.nom) == false) {
                    cols.module.push(mid.nom)
                    if (!cols.eval[mid.nom])
                        cols.eval[mid.nom] = [s.libelle]
                    else
                        cols.eval[mid.nom].push(s.libelle)
                }
            })

        })
        console.log(examens)
        Note.find({ examen_id: { $in: examens } }).populate({ path: "examen_id", populate: { path: "matiere_id" } }).populate({ path: "examen_id", populate: { path: "formateur_id", populate: { path: "user_id" } } }).populate({ path: "etudiant_id", populate: { path: "user_id" } }).populate({ path: "etudiant_id", populate: { path: "classe_id" } }).then(notes => {
            notes.forEach(n => {
                if (n.etudiant_id && n.etudiant_id.user_id && n.examen_id) {
                    if (data[n.etudiant_id.user_id.email])
                        data[n.etudiant_id.user_id.email][n.examen_id.libelle] = { 'appreciation': n.appreciation, 'note': n.note_val }
                    else{
                        data[n.etudiant_id.user_id.email] = {}
                        data[n.etudiant_id.user_id.email][n.examen_id.libelle] = { 'appreciation': n.appreciation, 'note': n.note_val }
                    }
                }


            })
            res.status(201).send({ cols, data })
        })

    })
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;