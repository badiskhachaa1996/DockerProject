const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Ecole } = require('../models/ecole')
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Etudiant.updateMany({ isAlternant: true }, { ecole_id: mongoose.Types.ObjectId('63b5422e63052257f2dc0bdd') }).exec()
        Etudiant.updateMany({ ecole_id: null }, { ecole_id: '6253f5fd322d2ce51dadafbe' }).exec()
    })