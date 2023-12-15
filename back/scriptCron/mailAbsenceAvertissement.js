const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Presence } = require('../models/presence')
const { Seance } = require('../models/seance')
const { Formateur } = require('../models/formateur')
const { Classe } = require('../models/classe')
const { Matiere } = require('../models/matiere')
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
let date = new Date()

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
//25 12 * * 1-5 node /home/ubuntu/ems3/back/scriptCron/mailAbsenceAvertissement.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-AbsenceAvertissement.log 2>&1
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        setTimeout(() => {
            process.exit()

        }, 300000)
        console.log('Start DB')
        let emailList = []
        Seance.find({ date_debut: { $lt: date }, date_fin: { $gt: date }, isOptionnel: false }).populate('matiere_id').populate('formateur_id').then(seances => {
            let seanceIds = []
            let listIds = []
            seances.forEach(s => {
                if (s.matiere_id && !s.matiere_id.hors_bulletin) {
                    listIds = s.classe_id.concat(listIds)
                    seanceIds.push(s._id)
                }
            })
            Presence.find({ seance_id: { $in: seanceIds }, isPresent: true }).then(presences => {
                let userIds = []
                presences.forEach(s => {
                    userIds.push(s.user_id)
                })
                Etudiant.find({ classe_id: { $in: listIds }, user_id: { $nin: userIds }, valided_by_support: true }).populate('user_id').then(etudiants => {
                    etudiants.forEach(etu => {
                        if (etu.user_id)
                            if (etu.user_id.email)
                                emailList.push(etu.user_id.email)
                            else if (etu.user_id.email_perso)
                                emailList.push(etu.user_id.email_perso)
                    })
                    let htmlmail = `
                    <p style="font-size:20px; color:black">Bonjour,</p>
                    <p>   </p>
                    <p style="font-size:20px; color:black">Nous constatons votre absence aujourd'hui dans les séances de cours. Pouvez-vous svp joindre un justificatif d'absence sur la séance manqué via IMS ou nous l'envoyer à l'adresse email suivante: <a href='mailto:igpinformatique@studinfo.com'>igpinformatique@studinfo.com</a>.</p>
                    <p style="font-size:20px; color:black">Nous vous rappelons qu'à partir de 3 absences non justifiées, nous ne pourrons pas vous inscrire à l'examen final.</p>
                    <p>   </p>
                    <p style="font-size:20px; color:red">Ce mail étant envoyé par un robot, merci d'adresser vos demandes à <a href='mailto:igpinformatique@studinfo.com'>igpinformatique@studinfo.com</a></p>
                    <p>   </p>
                    <p style="font-size:20px;">Très Cordialement,</p>
                    
                    <footer> <img src="cid:red"/></footer>
                    `
                    emailList = emailList.concat(values)
                    let attachments = [{
                        filename: 'signature.png',
                        path: '/home/ubuntu/ems3/back/assets/ims-intedgroup-logo.png',
                        cid: 'red' //same cid value as in the html img src
                    }]
                    let mailOptions = {
                        from: 'ims@intedgroup.com',
                        bcc: emailList,
                        subject: '[IMS] - Notification Absence',
                        html: htmlmail,
                        attachments
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.error(error);
                        }
                        console.log("SEND TO " + mailOptions.bcc.length.toString() + ".", mailOptions.bcc)
                        process.exit()
                    });
                    //Envoyer le mail
                })
            })
        })
    })