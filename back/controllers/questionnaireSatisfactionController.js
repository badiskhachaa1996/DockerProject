const express = require('express');
const { QFF } = require('../models/questionnaireFinFormation');
const { QF } = require('../models/questionnaireFormateur');
const { QS } = require('../models/questionnaireSatisfaction');
const app = express();
app.disabled("x-powered-by");
app.post('/create', (req, res, next) => {
    let r = new QS({ ...req.body })
    r.date_creation = new Date()
    r.save().then(data => {
        res.send(data)
    })
})

app.post('/createQFF', (req, res, next) => {
    let r = new QFF({ ...req.body })
    r.date_creation = new Date()
    r.save().then(data => {
        res.send(data)
    })
})

app.post('/QF/create', (req, res, next) => {
    let r = new QF({ ...req.body })
    r.date_creation = new Date()
    r.save().then(data => {
        res.send(data)
    })
})

app.get('/QF/getAll', (req, res, next) => {
    QF.find().populate('user_id').then(data => {
        res.send(data)
    })
})

app.delete('/QF/delete/:id', (req, res, next) => {
    QF.findByIdAndRemove(req.params.id, {}, (err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            res.status(500).send(err)
        }
    })
})

app.get('/getAll', (req, res, next) => {
    QS.find().then(data => {
        res.send(data)
    })
})

app.delete('/delete/:id', (req, res, next) => {
    QS.findByIdAndRemove(req.params.id, {}, (err, doc) => {
        if (!err) {
            res.send(doc)
        } else {
            res.status(500).send(err)
        }
    })
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;