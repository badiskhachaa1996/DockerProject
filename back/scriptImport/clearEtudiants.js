const mongoose = require("mongoose");
const { Etudiant } = require("../models/etudiant");
const { User } = require("../models/user");
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Etudiant.find().then(data => {
            data.forEach(e => {
                User.findByIdAndRemove(e.user_id).then(u => {
                    Etudiant.findByIdAndRemove(e._id)
                })
            })
        })
    })