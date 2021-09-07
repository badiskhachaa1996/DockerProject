const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { Service } = require("./../models/Service");


app.post("/addService", (req, res) => {
    let data = req.body;
    let service = new Service({
        label: data.label
    })
    service.save().then((servFromDb) => {
        res.status(200).send(servFromDb);
    }).catch((error) => {
        res.status(400).send(error);
    })
});


app.get("/getAll",(req,res)=>{
    Service.find()
    .then(result=>{
        res.send(result.length>0?result:[]);
    })
    .catch(err=>{   
        console.log(err);
    })
    
})


app.get("/getById/:id", (req, res) => {
    Service.findOne({ _id: req.params.id }).then((dataService) => {
        res.status(200).send({ dataService });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});

app.post("/updateById/:id", (req, res) => {
    Service.findByIdAndUpdate(req.params.id,
        {
            label:req.body.label,
         
        }, {new: true}, (err, service) => {
            if (err) {
                res.send(err)
            }
            res.send(service)
        })
});
app.post("/updateFirst/:id", (req, res) => {
    Service.findByIdAndUpdate(req.params.id,
        {
            service_id: req.body.service_id
        }, { new: true }, (err, user) => {
            if (err) {
                res.send(err)
            }
        })
    Message.findByIdAndUpdate(req.body.id_message, {
    }, { new: true }, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});



app.get("/deleteById/:id",(req, res) => {
    Service.findByIdAndRemove(req.params.id, (err, service) => {
        if (err) {
            res.send(err)
        }
        res.send(service)
    })
});

app.get("/getDic",(req,res)=>{
    let dic = {};
    Service.find()
    .then(result=>{
        result.forEach(serv => {
            dic[serv._id]=serv;
        });
        res.status(200).send(dic)
    })
    .catch(err=>{   
        console.log(err);
    })
    
})

module.exports = app;
