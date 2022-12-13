
const express = require("express");
const fs = require("fs");
const { renduDevoir } = require("../models/renduDevoir");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { Devoir } = require('./../models/devoir');
app.post("/create", (req, res) => {
    delete req.body._id
    let devoir = new Devoir({ ...req.body });
    devoir.save()
        .then((data) => { res.status(201).send(data) })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error);
        });

});

app.get("/getAll", (req, res) => {
    Devoir.find().populate({ path: 'formateur_id', populate: { path: 'user_id' } }).populate('groupe_id').then(groupes => {
        renduDevoir.find().populate('etudiant_id').then(rD => {
            let rd = {}
            rD.forEach(d => {
                if (rd[d.devoir_id])
                    rd[d.devoir_id].push(d)
                else
                    rd[d.devoir_id] = [d]
            })
            groupes.forEach((g, index) => {
                if (rd[g._id]) {
                    let temp = groupes[index]
                    temp.rendu = rd[g._id]

                    groupes[index] = temp
                }
            })
            //console.log(rd,groupes)
            res.status(201).send(groupes)
        })

    }, err => { console.log(err); res.status(500).send(err) })
})

app.get("/getAllByFormateurID/:formateur_id", (req, res) => {
    Devoir.find({ formateur_id: req.params.formateur_id }).populate('groupe_id').then(groupes => {
        renduDevoir.find().populate('etudiant_id').then(rD => {
            let rd = {}
            rD.forEach(d => {
                if (rd[d.devoir_id])
                    rd[d.devoir_id].push(d)
                else
                    rd[d.devoir_id] = [d]
            })
            groupes.forEach((g, index) => {
                if (rd[g._id]) {
                    let temp = groupes[index]
                    temp.rendu = rd[g._id]

                    groupes[index] = temp
                }
            })
            //console.log(rd,groupes)
            res.status(201).send(groupes)
        })
    }, err => { console.log(err); res.status(500).send(err) })
})

app.get("/getAllByClasseID/:classe_id", (req, res) => {
    Devoir.find({ groupe_id: { $in: req.params.classe_id }, date_debut: { $lt: new Date() } }).populate({ path: 'formateur_id', populate: { path: 'user_id' } }).then(devoirs => {
        res.send(devoirs)
    }, err => { console.log(err); res.status(500).send(err) })
})
module.exports = app;