const express = require("express");
const app = express(); //à travers ça je peux faire la creation des Sujets
const { Sujet } = require("./../models/sujet");
//const { Service } = require("./../models/service");


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
        res.send({message:"Pas de Sujets"});
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
            res.send(sujet)
        })
});

/*app.get("/createDefault",(req,res)=>{
    let service = new Service({
        label:"Pedagogique"
    })
    service.save().then((serviceData)=>{
        let sujet = new Sujet({
            label: "Récupérer mes notes",
            service_id:serviceData._id
        })
        sujet.save()
        sujet = new Sujet({
            label: "Récupérer mon emploi du temps",
            service_id:serviceData._id
        })
        sujet.save()
    })

    service = new Service({
        label:"Financier"
    })
    service.save().then((serviceData)=>{
        sujet = new Sujet({
            label: "Récupérer ma fiche de paie",
            service_id:serviceData._id
        })
        sujet.save()
        sujet = new Sujet({
            label: "Récupérer l'avancement de mon payement",
            service_id:serviceData._id
        })
        sujet.save().then(()=>{
            res.status(200).send("Default loaded")
        })
    })

})*/




app.get("/deleteById/:id",(req, res) => {
    Sujet.findByIdAndRemove(req.params.id, (err, sujet) => {
        if (err) {
            res.send(err)
        }
        res.send(sujet)
    })
});
module.exports = app;
