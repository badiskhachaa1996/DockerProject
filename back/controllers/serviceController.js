const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Service } = require("./../models/service");
app.disable("x-powered-by");

app.post("/addService", (req, res) => {
    //Crée un nouveau service
    let data = req.body;
    let service = new Service({
        label: data.label,
        active: data.active,
    })
    service.save().then((servFromDb) => {
        res.status(200).send(servFromDb);
    }).catch((error) => {
        res.status(400).send(error);
    })
});


app.get("/getAll", (req, res) => {
    //Récupérer tous les services
    Service.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.error(err);
        })

})


app.get("/getById/:id", (req, res) => {
    //Récupérer un service par id
    Service.findOne({ _id: req.params.id }).then((dataService) => {
        res.status(200).send({ dataService });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
app.get("/getByLabel/:label", (req, res) => {
    //Récupérer un service par id
    console.log( req.params.label )
    Service.findOne({
        label: { $regex: req.params.label }
    }).then((dataService) => {
        console.log(dataService)
        res.status(200).send({ dataService });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

app.post("/updateById/:id", (req, res) => {
    //Mettre à jour un service par id
    Service.findByIdAndUpdate(req.params.id,
        {
            label: req.body.label,

        }, { new: true }, (err, service) => {
            if (err) {
                res.send(err)
            }
            res.send(service)
        })
});

app.get("/deleteById/:id", (req, res) => {
    //Supprimer un service par ID
    Service.findByIdAndRemove(req.params.id, (err, service) => {
        if (err) {
            res.send(err)
        }
        res.send(service)
    })
});

app.get("/getDic", (req, res) => {
    //Récupérer un dictionnaire de tous les services: dic[service_id]=service
    let dic = {};
    Service.find()
        .then(result => {
            result.forEach(serv => {
                dic[serv._id] = serv;
            });
            res.status(200).send(dic)
        })
        .catch(err => {
            console.error(err);
        })

})
app.get("/hideById/:id", (req, res) => {
    Service.findByIdAndUpdate(req.params.id,
        {
            active: false
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(user)
            }
        })
});

app.get("/showById/:id", (req, res) => {
    Service.findByIdAndUpdate(req.params.id,
        {
            active: true
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
            else {
                res.send(user)
            }
        })
});

module.exports = app;
