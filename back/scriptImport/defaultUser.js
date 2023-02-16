const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Ecole } = require('../models/ecole')
mongoose
    .connect(`mongodb://localhost:27017/b`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        User.updateMany({ campus: null }, { campus: "62540996a32461f2eea4cca2" }, { new: true }, (err, re) => {
            console.log(err,re)
            process.exit()
        })
    })