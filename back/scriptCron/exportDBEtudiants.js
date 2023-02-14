
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Prospect } = require('../models/prospect')
const { Formateur } = require('../models/formateur')
const { Tuteur } = require('../models/Tuteur')
const mongoose = require("mongoose");
var readlineSync = require('readline-sync');
var willBeDeleted = []
var emailUpdated = []
var emailIMSUpdated = []
let dicUser = {}
console.log(mongoose.version)
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        Etudiant.find().populate('user_id').then(etudiants => {
            
        })
    })