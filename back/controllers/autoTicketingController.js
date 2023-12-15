const express = require("express");
const { AutoTicket } = require("../models/AutomatisationTicketing");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new AutoTicket({ ...req.body })
    f.save()
        .then((FFSaved) => {
            FFSaved.populate('sujet_id').populate('created_by').populate('assigned_to').execPopulate().then(r => {
                res.status(200).send(r);
            })
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    AutoTicket.find().sort({ created_date: -1 }).populate('sujet_id').populate('created_by').populate('assigned_to')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    AutoTicket.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        doc.populate('sujet_id').populate('created_by').populate('assigned_to').execPopulate().then(r => {
            res.status(200).send(r);
        })
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    AutoTicket.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})
module.exports = app;