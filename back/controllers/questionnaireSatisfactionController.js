const express = require('express');
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

app.get('/getAll', (req, res, next) => {
    QS.find().then(data => {
        res.send(data)
    })
})

app.delete('/delete/:id', (req, res, next) => {
    QS.findByIdAndRemove(req.params.id, {}, (err, doc => {
        if (!err) {
            res.send(doc)
        } else {
            res.status(500).send(err)
        }
    }))
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;