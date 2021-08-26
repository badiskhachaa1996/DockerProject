const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
const { Sujet } = require("./../models/sujet");


app.post("/addsujet", (req, res) => {
    let data = req.body;
    let sujet = new Sujet({
        label: data.label,
        service_id: data.service_id
    })
    sujet.save().then((sujetFromDb) => {
        res.status(200).send({ message: "Sujet : "+sujetFromDb.sujet_id + "registration done sujet :"+sujetFromDb.label });
    }).catch((error) => {
        res.status(400).send(error);
    })
});




app.get("/getAll",(req,res)=>{
    Sujet.find()
    .then(result=>{
        //console.log('result: ',result)
        res.send(result.length>0?result:'Pas de Sujet');
    })
    .catch(err=>{   
        console.log(err);
    })
    
})


app.get("/getById/:id", (req, res) => {
    Sujet.findOne({ _id: req.params.id }).then((dataSujet) => {
        res.status(200).send({ dataSujet });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

app.post("/updateById/:id", (req, res) => {
    Sujet.findByIdAndUpdate(req.params.id,
        {
            label:req.body.label,
         
        }, {new: true}, (err, sujet) => {
            if (err) {
                res.send(err)
            }
            res.send(Sujet)
        })
});






app.get("/deleteById/:id",(req, res) => {
    Sujet.findByIdAndRemove(req.params.id, (err, sujet) => {
        if (err) {
            res.send(err)
        }
        res.send(sujet)
    })
});
module.exports = app;
