//Création d'un nouveau ticket TODO
pp.post("/create",(req, res) => {
    const ticket = new Ticket({
        titre:req.body.title,
        id_plats:req.body.plats,
        prix:req.body.prix
    });

    ticket.save((err, user) => {
        res.send({message: "Votre ticket a été crée!"});
    });
});


//Suppression d'un ticket
app.get("/deleteById/:id",(req, res) => {
    Ticket.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});

//Modification d'un ticket
app.post("/updateById/:id", (req, res) => {
    Ticket.findByIdAndUpdate(req.params.id,
        {
            sujet_id:req.body.sujet_id,
            agent_id:req.body.agent_id,
            statut :req.body.statut,
            date_affec_accep:req.body.date_affec_accep,
            temp_traitement:req.body.temp_traitement,
            temp_fin:req.body.temp_fin,
            isAffected:req.body.isAffected,
        }, {new: true}, (err, user) => {
            if (err) {
                res.send(err)
            }
            res.send(user)
        })
});

//Récuperer un ticket
app.get("/getById/:id", (req, res) => {
    Ticket.findOne({ _id: req.params.id }).then((dataTicket) => {
        res.status(200).send({ dataTicket });
    }).catch((error) => {
        res.status(404).send("erreur :" + error);
    })
});
//Récuperer tous les menus
app.get("/getAll",(req, res) => {
    Ticket.find()
        .then(result=>{
            console.log('result: ',result)
            res.send(result.length>0?result:'No Menus');
        })
        .catch(err=>{
            console.log(err);
        })
});
