
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Campus } = require('../models/campus')
const { Diplome } = require('../models/diplome')
const { Etudiant } = require('../models/etudiant')
const { Classe }= require('../models/classe')
const fs = require("fs");
let users = []
mongoose
    .connect(`mongodb://localhost:27017/parisTest`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Diplome.find().then(d => {
            let l = ""
            d.forEach(diplo => {
                l += diplo.titre + "\n"
            })
            fs.writeFile('filiere.txt', content, { flag: 'w+' }, err => {
                console.error(err)
            });
        })
        Classe.find().then(d => {
            let l = ""
            d.forEach(diplo => {
                l += diplo.abbrv + "\n"
            })
            fs.writeFile('classe.txt', content, { flag: 'w+' }, err => {
                console.error(err)
            });
        })
        Campus.find().then(d => {
            let l = ""
            d.forEach(diplo => {
                l += diplo.libelle + "\n"
            })
            fs.writeFile('campus.txt', content, { flag: 'w+' }, err => {
                console.error(err)
            });
        })
    })