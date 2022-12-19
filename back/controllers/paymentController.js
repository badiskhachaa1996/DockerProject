const express = require("express");
const app = express();
const { IndividualAccount } = require("./../models/lemon/IndividualAccount");
const { User } = require('./../models/user');


//Ajout d'un nouveau compte bancaire
app.post("/postIndividualAccount", (req, res, next) => {
    
    const account = new IndividualAccount({ ...req.body });
    account.accountId = account._id.toString().substr(account._id.toString().length-15);

    const user = new User({
        firstname: account.firstName,
        lastname: account.lastName,
        email: account.email,
        civilite: account.title,
    });

    User.findOne({ email: req.body.email})
        .then((userFromDb) => {
            if(userFromDb)
            {
                console.log(user);
                account.user_id = userFromDb._id;
                account.save()
                       .then((accountSaved) => {
                            res.status(201).send(accountSaved);
                       })
                       .catch((error) => { 
                        console.log(error);
                        res.status(400).send('Impossible de créer un nouveau compte bancaire'); })
            }
            else
            {
                user.save()
                    .then((userSaved) => {
                        account.user_id = userSaved._id;
                        console.log(account)
                        account.save()
                               .then((accountSaved) => {
                                    res.status(201).send(accountSaved);
                                })
                               .catch((error) => { res.status(400).send('Impossible de créer un nouveau compte'); })
                    })
                    .catch((error) => { res.status(400).send('Impossible de créer un nouveau user'); })
            }
        })
        .catch((err) => { req.status(500).send("Impossible de verifier l'existence de l'utilisateur"); });
});


module.exports = app;