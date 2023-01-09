const express = require('express');
const { QS } = require('../models/questionnaireSatisfaction');
const app = express();
app.disabled("x-powered-by");
app.post('/create', (req,res,next)=>{
    let r = new QS({...req.body})
    r.save().then(data=>{
        res.send(data)
    })
})

//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;