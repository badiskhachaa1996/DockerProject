const express = require("express");
const app = express();
app.disable("x-powered-by");
const { ExterneSkillsnet } = require("./../models/ExterneSkillsnet");

app.post('/create', (req, res) => {
    let newObj = new ExterneSkillsnet({
        ...req.body
    })
    newObj.save().then(doc => {
        ExterneSkillsnet.findById(doc._id).populate('user_id').then(newDoc => {
            res.send(newDoc)
        })
    })
})

app.put('/update/:id', (req, res) => {
    ExterneSkillsnet.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('user_id').then(doc => {
        res.send(doc)
    })
})

app.get('/getByID/:id', (req, res) => {
    ExterneSkillsnet.findById(req.params.id).populate('user_id').then(doc => {
        res.send(doc)
    })
})

app.get('/getAll', (req, res) => {
    ExterneSkillsnet.find().populate('user_id').then(docs => {
        res.send(docs)
    })
})
module.exports = app;
