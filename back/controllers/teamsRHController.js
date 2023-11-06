const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
const { TeamsRH } = require("../models/teamsRH");
const { MemberRH } = require("../models/memberRH");

app.post("/TR/create", (req, res) => {
    delete req.body._id
    let f = new TeamsRH({ ...req.body })
    f.save()
        .then((FFSaved) => {
            TeamsRH.findById(FFSaved._id).then(r => {
                res.status(201).send(r)
            })

        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})



app.get("/TR/getByID/:id", (req, res) => {
    TeamsRH.findById(req.params.id)
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})


app.get("/TR/getAll", (req, res, next) => {
    TeamsRH.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/TR/update", (req, res) => {
    TeamsRH.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        TeamsRH.findById(req.body._id).then(r => {
            res.status(201).send(r)
        })
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})




app.post("/MR/create", (req, res) => {
    delete req.body._id
    let f = new MemberRH({ ...req.body })
    f.save()
        .then((FFSaved) => {
            MemberRH.findById(FFSaved._id).populate('user_id').populate({ path: 'team_id' })
                .then((formFromDb) => {
                    //User.findByIdAndUpdate(req.body.user_id,{type:""})
                    res.status(200).send(formFromDb);
                })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
app.put("/MR/update", (req, res) => {
    MemberRH.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        MemberRH.findById(req.body._id).populate('user_id').populate({ path: 'team_id' })
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/MR/getAll", (req, res, next) => {
    MemberRH.find().populate('user_id').populate({ path: 'team_id' })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/MR/getAllByTeamID/:id", (req, res) => {
    MemberRH.find({ team_id: req.params.id }).populate('user_id').populate({ path: 'team_id' })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/MR/getByUSERID/:id", (req, res) => {
    MemberRH.find({ user_id: req.params.id }).populate('user_id').populate({ path: 'team_id' })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete("/MR/delete/:_id", (req, res) => {
    MemberRH.findByIdAndDelete(req.params._id)
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
            /*User.findByIdAndUpdate(req.params.user_id, { type: null }).then(doc => {
                res.status(200).send(formFromDb);
            }).catch((error) => { console.error(error); res.status(500).send(error); });*/
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
app.delete("/TR/delete/:id", (req, res) => {
    TeamsRH.findByIdAndDelete(req.params.id)
        .then((formFromDb) => {
            TeamsRH.deleteMany({ team_id: req.params.id }).then(d => {
                //Doit enlever le type de tous les users comme dans MI/delete
                res.status(200).send(formFromDb);
            })
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
module.exports = app;