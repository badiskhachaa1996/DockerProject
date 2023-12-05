const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');
const { TeamsCRM } = require("../models/teamsCRM");
const { MemberCRM } = require("../models/memberCRM");
const { User } = require("../models/user");

app.post("/TI/create", (req, res) => {
    delete req.body._id
    let f = new TeamsCRM({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})



app.get("/TI/getByID/:id", (req, res) => {
    TeamsCRM.findById(req.params.id)
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})


app.get("/TI/getAll", (req, res, next) => {
    TeamsCRM.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/TI/update", (req, res) => {
    TeamsCRM.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})




app.post("/MI/create", (req, res) => {
    delete req.body._id
    let f = new MemberCRM({ ...req.body })
    f.save()
        .then((FFSaved) => {
            MemberCRM.findById(FFSaved._id).populate('user_id').populate('team_id')
                .then((formFromDb) => {
                    //User.findByIdAndUpdate(req.body.user_id,{type:""})
                    res.status(200).send(formFromDb);
                })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
app.put("/MI/update", (req, res) => {
    MemberCRM.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        MemberCRM.findById(req.body._id).populate('user_id').populate('team_id')
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/MI/getAll", (req, res, next) => {
    MemberCRM.find().populate('user_id').populate('team_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/MI/getByUSERID/:id", (req, res) => {
    MemberCRM.findOne({ user_id: req.params.id }).populate('user_id').populate('team_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/MI/getByTeamID/:id", (req, res) => {
    MemberCRM.find({ team_id: req.params.id }).populate('user_id').populate('team_id')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete("/MI/delete/:user_id", (req, res) => {
    MemberCRM.findOneAndRemove({ user_id: req.params.user_id })
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
            /*User.findByIdAndUpdate(req.params.user_id, { type: null }).then(doc => {
                res.status(200).send(formFromDb);
            }).catch((error) => { console.error(error); res.status(500).send(error); });*/
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
app.delete("/TI/delete/:id", (req, res) => {
    TeamsCRM.findByIdAndDelete(req.params.id)
        .then((formFromDb) => {
            MemberCRM.deleteMany({ team_id: req.params.id }).then(d => {
                //Doit enlever le type de tous les users comme dans MI/delete
                res.status(200).send(formFromDb);
            })
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
module.exports = app;