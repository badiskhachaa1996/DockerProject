const mongoose = require("mongoose");
const { Note } = require("../models/note");
const { Etudiant } = require('../models/etudiant')
const { Classe } = require('../models/classe')
mongoose
    .connect(`mongodb://localhost:27017/backup`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Note.find().populate('etudiant_id').then(notes => {
            notes.forEach(n => {
                if (n.classe_id && n.etudiant_id)
                    if (n.classe_id != n.etudiant_id.classe_id)
                        Note.findByIdAndUpdate(n._id, { classe_id: n.etudiant_id.classe_id }, { new: true }, (err, doc) => { })
            })
        })
    })