const { Etudiant } = require('../models/etudiant')
const { User } = require("../models/user");
const mongoose = require("mongoose");
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Etudiant.find({ classe_id: null }).populate('user_id').then(dataE => {
            dataE.forEach(e => {
                User.findByIdAndUpdate(e.user_id._id, { civilite: null })
            })
        })
    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });