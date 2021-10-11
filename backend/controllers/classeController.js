const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Classe } = require("./../models/classe");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

//Création d'un nouveau classe 
app.post("/create", (req, res) => {
    haveAccess('Admin', jwt.decode(req.headers.token).id,req.headers, function(rep){
        //Sauvegarde du classe
        const classe = new Classe({
            nom: req.body.nom,
            nom_court: req.body.nom_court
        });

        classe.save((err, doc) => {
            res.send(doc);
        });
    })
});


//Suppression d'un classe
app.get("/deleteById/:id", (req, res) => {
    Classe.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});

//Modification d'un classe
app.post("/updateById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            nom: req.body?.nom,
            nom_court: req.body?.nom_court
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer un classe par ID

app.get("/getById/:id", (req, res) => {
    Classe.findOne({ _id: req.params.id }).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

//Récuperer tous les classes
app.get("/getAll", (req, res) => {
    haveAccess('Admin', jwt.decode(req.headers.token).id,req.headers, function(rep){
    Classe.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })
    })
});
app.get("/hideById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: false
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

app.get("/showById/:id", (req, res) => {
    Classe.findByIdAndUpdate(req.params.id,
        {
            active: true
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer tous les classes active
app.get("/seeAll", (req, res) => {
    Classe.find({ active: true })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
        })
});

function haveAccess(lvl, user_id,headers, callback) {
    User.findOne({_id:user_id},(err,user)=>{
        if(user && (headers.origin=="https://ticket.estya.com" || headers.origin=="http://localhost:4200")){
            console.log(user)
            if (lvl == "Admin") {
                console.log(user.role == "Admin")
                callback(user.role == "Admin")
            } else if (lvl == "Responsable") {
                callback(user.role == "Responsable" || user.role == "Admin")
            } else if (lvl == "Agent") {
                callback(user.role == "Agent" || user.role == "Responsable" || user.role == "Admin")
            } else {
                callback(lvl == user_id)
            }
        }else{
            callback(false)
        }
    })
}

module.exports = app;