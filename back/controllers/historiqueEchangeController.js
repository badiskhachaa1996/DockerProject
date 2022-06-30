const express = require("express");
const app = express();
app.disable("x-powered-by");
const { historiqueEchange } = require("./../models/historiqueEchange");
app.get("/getAll", (req, res) => {
    //Récupérer toutes les inscription
    historiqueEchange.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
        .catch((error) => {
            console.error(error);
        })
});

app.get("/getAllByAgentID/:id", (req, res) => {
    //Récupérer toutes les inscription
    historiqueEchange.find({agent_id:req.params.id}).then(result => {
        res.send(result.length > 0 ? result : [])
    })
        .catch((error) => {
            console.error(error);
        })
});

app.get("/getById/:id", (req, res) => {
    //Récupérer toutes les inscription
    historiqueEchange.findById(req.params.id).then(result => {
        res.send(result)
    })
        .catch((error) => {
            console.error(error);
        })
});



app.post("/create", (req, res) => {
    delete req.body._id
    let h = new historiqueEchange({ ...req.body })
    h.save().then(historiqueSaved => {
        res.status(200).send(historiqueSaved)
    }, error => {
        res.status(400).send(error)
    })
});
module.exports = app;