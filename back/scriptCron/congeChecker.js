
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Classe } = require('../models/classe')
const { Formateur } = require('../models/formateur')
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const { Conge } = require("../models/Conge");
let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});
//0 9 * * * node /home/ubuntu/ems3/back/scriptCron/congeChecker.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-congeChecker.log 2>&1
mongoose
    .connect(`mongodb://127.0.01:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('MONGODB CONNECTED')
        Conge.find({ statut: "Validé", date_debut: { $lte: new Date() }, date_fin: { $gte: new Date() } }).then(conges => {
            conges.forEach(c => {
                User.findByIdAndUpdate(c.user_id, { statut: 'En congé' })
                    .then((response) => {
                    })
                    .catch((error) => { console.error(error); });
            })
        })
    })