const { TeamCommercial } = require("../models/teamCommercial");
const express = require("express");
const app = express();
app.disable("x-powered-by");
const { User } = require("./../models/user");

//creation d'une nouvelle tCommercial
app.post("/create", (req, res, next) => {
    let tCommercial = new TeamCommercial({
        ...req.body
    });

    tCommercial.save()
        .then((tSaved) => { res.status(201).send(tSaved) })
        .catch((error) => { res.status(400).send(error) });

});

app.post('/updateTeam', (req, res) => {
    TeamCommercial.findByIdAndUpdate(req.body._id, { team_id: req.body.team_id }, { new: true }, (err, doc) => {
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



module.exports = app;