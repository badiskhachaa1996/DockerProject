
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Classe } = require('../models/classe')
const { Formateur } = require('../models/formateur')
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const { Conge } = require("../models/Conge");
const { EventCalendarRH } = require("../models/eventCalendarRH");
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
let r = 0
//0 9 * * * node /home/ubuntu/ems3/back/scriptCron/congeChecker.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-congeChecker.log 2>&1
mongoose
    .connect(`mongodb://127.0.0.1:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        setTimeout(() => {
            process.exit()

        }, 300000)
        console.log('MONGODB CONNECTED')
        Conge.find({ statut: "Validé", date_debut: { $lte: new Date() }, date_fin: { $gte: new Date() } }).then(conges => {
            conges.forEach(c => {
                User.findByIdAndUpdate(c.user_id, { statut: 'En congé' })
                    .then((response) => {
                        if (c._id == conges[conges.length - 1]._id)
                            r += 1
                        if (r == 2)
                            process.exit()

                    })
                    .catch((error) => { console.error(error); });
            })
            if (conges.length == 0)
                r += 1
        })
        let date1 = new Date()
        date1.setHours(0, 0, 0)
        let date2 = new Date()
        date2.setHours(23, 59, 59)
        EventCalendarRH.find({ personal: { $ne: null }, date: { $lte: date2 }, date: { $gte: date1 } }).then(events => {
            events.forEach(p => {
                User.findByIdAndUpdate(p.personal, { statut: 'Ecole' })
                    .then((response) => {
                        if (p._id == events[events.length - 1]._id)
                            r += 1
                        if (r == 2)
                            process.exit()

                    })
                    .catch((error) => { console.error(error); });
            })
            if (events.length == 0)
                r += 1
        })

    })