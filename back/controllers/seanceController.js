//importation de express
const express = require('express');
const app = express();
const { Seance } = require("./../models/seance");
app.disable("x-powered-by");

//Creation d'une nouvelle 
app.post('/create', (req, res, next) => {

    let seanceData = req.body.newSeance;
    //Création d'une nouvelle 
    let seance = new Seance({
        classe_id: req.body.classe_id,
        matiere_id: req.body.matiere_id,
        libelle: req.body.libelle,
        date_debut: req.body.date_debut,
        date_fin: req.body.date_fin,
        formateur_id: req.body.formateur_id,
        infos: req.body.infos,
        isPresentiel: req.body.isPresentiel,
        salle_name: req.body.salle_name,
        isPlanified: req.body.isPlanified,
        campus_id: req.body.campus_id,
        nbseance: req.body.nbseance
    });

    Seance.find()
        .then(data => {
            let text = null
            let error = false
            data.forEach(temp => {
                if (temp.formateur_id == req.body.formateur_id) {
                    text = "Le formateur est déjà assigné à une séance :\n"
                } else if (temp.classe_id == req.body.classe_id) {
                    text = "La classe est déjà assigné à une séance :\n"
                } else {
                    text = null
                }
                if (text && !error) {
                    let s = temp.date_debut.getTime() // debut = temp.date_debut
                    let e = temp.date_fin.getTime() // fin = temp.date_fin
                    let cs = new Date(req.body.date_debut).getTime() //date to check = req.body.date_debut
                    let ce = new Date(req.body.date_fin).getTime() //date to check = req.body.date_fin

                    //Si une séance existante se trouve pendant la séance
                    if (cs < s && e < cs) {
                        error = true
                        res.status(400).send({ text: text + "Cette séance s'interpose avec une autre séance\nVérifier les deux dates", temp })
                        return false
                    } else if (cs > s && cs < e) {
                        //Si la date de debut de la nouvelle séance est entre une existante
                        error = true
                        res.status(400).send({ text: text + "Cette séance s'interpose avec une autre séance\nVérifier la date de début", temp })
                        return false
                    }
                    //Si la date de fin de la nouvelle séance est entre une existante
                    else if (ce > s && ce < e) {
                        error = true
                        res.status(400).send({ text: text + "Cette séance s'interpose avec une autre séance\nVérifier la date de fin", temp })
                        return false
                    }
                }
            })
            if (new Date(req.body.date_debut).getTime() > new Date(req.body.fin).getTime() && !error) {
                res.status(400).send("La date de début est supérieur à la date de fin")
            } else if (!error) {
                //Envoi vers la BD
                seance.save()
                    .then((saveSeance) => res.status(201).send(saveSeance))
                    .catch(error2 => res.status(400).send(error2));
            }
        })
});


//Modification d'une  via son id
app.post('/edit/:id', (req, res, next) => {
    //Trouve et met à jour une 
    Seance.findOneAndUpdate(
        { _id: req.params.id },
        {
            classe_id: req.body.classe_id,
            matiere_id: req.body.matiere_id,
            libelle: req.body.libelle,
            date_debut: req.body.date_debut,
            date_fin: req.body.date_fin,
            formateur_id: req.body.formateur_id,
            infos: req.body.infos,
            isPresentiel: req.body.isPresentiel,
            salle_name: req.body.salle_name,
            isPlanified: req.body.isPlanified,
            campus_id: req.body.campus_id,
            nbseance: req.body.nbseance
        }
    ).then((Seancefromdb) => res.status(201).send(Seancefromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation de toutes les s
app.get("/getAll", (req, res, next) => {
    Seance.find()
        .then((SeanceFromdb) => { res.status(200).send(SeanceFromdb); })
        .catch((error) => { req.status(500).send('Impossible de recupérer la liste des séances ' + error.message); });
});


//Recuperation d'une  selon son id
app.get('/getById/:id', (req, res, next) => {
    Seance.findOne({ _id: req.params.id })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error));
});


//Recuperation de toute les s selon l'id d'une classe
app.get('/getAllByClasseId/:id', (req, res, next) => {
    Seance.find({ classe_id: { $in: req.params.id } })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error), console.log('le pb est ici'));
});


//Recuperation de toute les s selon l'identifiant du formateur
app.get('/getAllbyFormateur/:id', (req, res, next) => {
    Seance.find({ formateur_id: req.params.id })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error));
});

app.get("/convertAllPlanified", (req, res) => {
    Seance.updateMany({ isPlanified: true }, { isPlanified: false })
        .then(
            (SeanceFromdb) => {
                res.status(200).send(SeanceFromdb)
            }
        )
        .catch(error => res.status(400).send(error));
})

//Recuperation de toutes les s
app.get('/getPlanified', (req, res, next) => {
    Seance.find({ isPlanified: true })
        .then((SeanceFromdb) => res.status(200).send(SeanceFromdb))
        .catch(error => res.status(400).send(error));
});

app.get('/getNb/:c_id/:f_id', (req, res) => {
    Seance.find({ classe_id: req.params.c_id, formateur_id: req.params }).then(
        data => res.status(200).send(data.length)
    ).catch(
        error => res.status(400).send(error)
    )
})


module.exports = app;