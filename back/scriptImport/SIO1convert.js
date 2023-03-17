const mongoose = require("mongoose");
var XLSX = require('xlsx')

const { Classe } = require('../models/classe')
const { Note } = require('../models/note')
const { Diplome } = require('../models/diplome')
const { User } = require('../models/user.js')
const { Examen } = require('../models/examen.js')
const { Matiere } = require('../models/matiere.js')
const { Etudiant } = require('../models/etudiant')
let ID_SIO_1_SISR = "640ee95d3eef9e225d77c108" //"640ee95d3eef9e225d77c108"
let ID_SIO_1_SLAM = "640ee9653eef9e225d77c10d" //"640ee9653eef9e225d77c10d"
let ID_SIO = '63724ef84d06a260126a2c24'
let DIPLOME_SISR = "62554835e50c8b3e0129ca81"
let DIPLOME_SLAM = "63186c292d02e620044f8e4a"
let DIPLOME_SIO = "63724ecd4d06a260126a2c01"

mongoose
    .connect(`mongodb://localhost:27017/1403`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Start")
        Classe.findById(ID_SIO, {}, {}, (err, oldSIO) => {
            Classe.findById(ID_SIO_1_SISR, {}, {}, (err, sisr) => {
                if (err)
                    console.error(err)
                Classe.findById(ID_SIO_1_SLAM, {}, {}, (err2, slam) => {
                    if (err2)
                        console.error(err2)
                    Matiere.find({$in:{}})
                })
            })
        })


    })