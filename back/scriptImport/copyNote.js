const mongoose = require("mongoose");
const { Note } = require("../models/note");
var ObjectID = require('mongodb').ObjectID;
mongoose
    .connect(`mongodb://localhost:27017/3005`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        Note.find({ examen_id: new ObjectID("6474bd8044e14520f9dd5f38"), classe_id: new ObjectID("63724fe64d06a260126a2c32") }).then(data => {
            console.log(data)
            data.forEach((val, idx) => {
                delete data[idx]._id
                data[idx].semestre = "Semestre 1"
                data[idx].examen_id = new ObjectID("64770c40c1e5516cee4bf2be")
                data[idx].matiere_id = new ObjectID("63170da02d02e620044f87b4")
                data[idx].date_creation = new Date()
                if (data[idx].semestre)
                    new Note({ ...data[idx] }).save().then(r => {
                        console.log(r.etudiant_id)
                    })
            })
        })
    })