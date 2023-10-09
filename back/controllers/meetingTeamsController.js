const express = require("express");
const { MeetingTeams } = require("../models/meetingTeams");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", (req, res) => {
    delete req.body._id
    let f = new MeetingTeams({ ...req.body })
    f.save()
        .then((FFSaved) => { res.status(201).send(FFSaved) })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/getAll", (req, res, next) => {
    MeetingTeams.find().populate('winner_id').populate('user_id').populate('cv_id').sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAllByEmail/:email", (req, res, next) => {
    MeetingTeams.find({ company_email: req.params.email }).populate('winner_id').populate('user_id').populate('cv_id').populate('offre_id').sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAllByUserID/:user_id", (req, res, next) => {
    MeetingTeams.find({ user_id: req.params.user_id }).populate('winner_id').populate('user_id').populate('cv_id').populate('offre_id').sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});
app.get("/getAllByOffreID/:offre_id", (req, res, next) => {
    MeetingTeams.find({ offre_id: req.params.offre_id }).populate('winner_id').populate('user_id').populate('cv_id').populate('offre_id').sort({ date_creation: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});
app.put("/update", (req, res) => {
    MeetingTeams.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete('/delete/:id', (req, res) => {
    MeetingTeams.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;