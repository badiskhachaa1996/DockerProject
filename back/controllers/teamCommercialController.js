const { TeamCommercial } = require("../models/teamCommercial");
const express = require("express");
const app = express();
app.disable("x-powered-by");
const { User } = require("./../models/user");
const jwt = require("jsonwebtoken");
//creation d'une nouvelle tCommercial
app.post("/create", (req, res, next) => {
    let tCommercial = new TeamCommercial({
        ...req.body
    });

    tCommercial.save()
        .then((tSaved) => {
            tSaved.populate('owner_id').populate('team_id').populate('createur_id')
            res.status(201).send(tSaved)
        })
        .catch((error) => { res.status(400).send(error) });

});

app.post('/updateTeam', (req, res) => {
    TeamCommercial.findByIdAndUpdate(req.body._id, { team_id: req.body.team_id }, { new: true }).populate('owner_id').populate('team_id').populate('createur_id')
        .exec((err, doc) => {
            if (err) {
                console.error(err)
                res.status(500).send(err)
            } else
                res.status(201).send(doc)
        })
})

app.get("/getAll", (req, res, next) => {
    TeamCommercial.find().populate('owner_id').populate('team_id').populate('createur_id')
        .then((TuteurFromdb) => { res.status(200).send(TuteurFromdb) })
        .catch((error) => { res.status(500).send(error) })
});

app.get('/getMyTeam', (req, res) => {
    let token = jwt.decode(req.header("token"))
    TeamCommercial.findOne({ $or: [{ owner_id: token.id }, { team_id: { $in: [token.id] } }] }).populate('owner_id').populate('team_id').populate('createur_id')
        .then(team => { res.status(200).send(team) })
        .catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
})

app.get('/getAllCommercial', (req, res) => {
    TeamCommercial.find().populate('team_id').populate('owner_id')
        .then(team => {
            let r = []
            team.forEach(arr => {
                r.push(arr.owner_id)
                r = r.concat(arr.team_id)
            })
            res.status(200).send(r)
        })
        .catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
})

app.get('/getByID/:team_id', (req, res) => {
    TeamCommercial.findById(req.params.team_id).populate('team_id').populate('owner_id')
        .then(team => {
            res.status(200).send(team)
        })
        .catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
})

app.get('/getAllCommercialByTeamID/:team_id', (req, res) => {
    TeamCommercial.findById(req.params.team_id).populate('team_id').populate('owner_id')
        .then(team => {
            let r = []
            r.push(team.owner_id)
            r = r.concat(team.team_id)
            res.status(200).send(r)
        })
        .catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
})


module.exports = app;