const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Mission } = require('./../models/Mission');
const { CV } = require('./../models/cv');
var ObjectId = require('mongoose').Types.ObjectId;

//Création d'une mission
app.post("/post-mission", (req, res) => {
    const mission = new Mission({ ...req.body });

    mission.save()
        .then((missionSaved) => { res.status(201).send(missionSaved); })
        .catch((error) => { res.status(400).send(error.message); });
});


//Recuperation de la liste des missions
app.get("/get-missions", (_, res) => {
    Mission.find()
        .then((missions) => { res.status(200).send(missions); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Récuperation d'une mission via on identifiant
app.get("/get-mission", (req, res) => {
    Mission.findById(req.params.missionId)
        .then((mission) => { res.status(200).send(mission); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Recuperation de la liste des mission d'un utilisateur
app.get("/get-missions-by-user-id/:user_id", (req, res) => {
    Mission.find({ user_id: req.params.user_id })
        .then((missions) => { res.status(200).send(missions); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Recuperation de la liste des mission d'une entreprise
app.get("/get-missions-by-entreprise-id/:entreprise_id", (req, res) => {
    Mission.find({ entreprise_id: req.params.entreprise_id })
        .then((missions) => { res.status(200).send(missions); })
        .catch((error) => { res.status(500).send(error.message); });
});


//Modification d'une mission
app.put("/put-mission", (req, res) => {

    Mission.updateOne({ _id: req.body._id }, { ...req.body })
        .then((mission) => { res.status(200).send(mission) })
        .catch((error) => { res.status(500).send(error.message) })
});


//Recupération d'une liste de mission qui corresponds à un CV
app.get('/getMissionFromCV/:user_id', (req, res) => {
    if (ObjectId.isValid(req.params.user_id))
        CV.findOne({ user_id: req.params.user_id }).then(cv => {
            var skills = []
            var r = []
            cv.connaissances.forEach(element => {
                skills.push(element.skill)
            });
            cv.experiences.forEach(element => {
                skills.push(element.skill)
            });
            Mission.find({ competences: { $in: skills } }).then(missions => {
                missions.forEach(m => {
                    let score_max = m.competences.length
                    let score = 0
                    let competences = stringArrayToLower(m.competences)
                    skills.forEach(s => {
                        if (competences.includes(s.toLowerCase()))
                            score++;
                    })
                    r.push({ mission: m, score: (score * 100) / score_max })
                })
                res.status(201).send(r)
            })

        })
    else
        res.status(400).send("Ceci n'est pas un ID mongo")
})

function stringArrayToLower(arr) {
    let r = []
    arr.forEach(ele => {
        r.push(ele.toLowerCase())
    })
    return r
}

module.exports = app;