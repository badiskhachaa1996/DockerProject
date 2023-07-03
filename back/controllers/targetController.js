const express = require("express");
const { Target } = require("../models/target");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    let t = new Target({ ...req.body })
    t.save()
        .then((FFSaved) => {
            Target.findById(FFSaved._id).populate('equipe_id').populate({ path: 'member_id', populate: { path: 'user_id' } }).populate({ path: 'member_id', populate: { path: 'team_id' } })
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    Target.find().sort({ date_creation: -1 }).populate('equipe_id').populate({ path: 'member_id', populate: { path: 'user_id' } }).populate({ path: 'member_id', populate: { path: 'team_id' } })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.post("/getAllByMemberID", (req, res, next) => {
    let request = []
    if (req.body.team_id)
        request.push({ team_id: req.body.team_id })
    if (req.body.member_id)
        request.push({ team_id: req.body.member_id })
    Target.find({ $or: request }).sort({ date_creation: -1 }).populate('equipe_id').populate({ path: 'member_id', populate: { path: 'user_id' } }).populate({ path: 'member_id', populate: { path: 'team_id' } })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/update", (req, res) => {
    Target.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        Target.findById(req.body._id).populate('equipe_id').populate({ path: 'member_id', populate: { path: 'user_id' } }).populate({ path: 'member_id', populate: { path: 'team_id' } })
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    Target.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;