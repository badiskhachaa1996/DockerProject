const mongoose = require("mongoose");
const { Note } = require("../models/note");
const { Etudiant } = require('../models/etudiant')
const { Classe } = require('../models/classe')
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Note.find().then(notes=>{
                
        })
    })