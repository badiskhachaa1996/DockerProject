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
// 50 13 * * 1-5 node /home/ubuntu/ems3/back/scriptCron/notificationAbsence.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-notifAbsence.log 2>&1
// 20 09 * * 1-5 node /home/ubuntu/ems3/back/scriptCron/notificationAbsence.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-notifAbsence.log 2>&1
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
//
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
            let formateurIds = {}
            let listIds = []
            seances.forEach(s => {
                if (s.matiere_id && !s.matiere_id.hors_bulletin) {
                    listIds = s.classe_id.concat(listIds)
                    seanceIds.push(s._id)
                    if (s.formateur_id) {
                        formateurIds[s.formateur_id._id] = s.formateur_id.email
                    }
                }
            })
            Presence.find({ seance_id: { $in: seanceIds } }).then(presences => {
                let userIds = []
                presences.forEach(s => {
                    userIds.push(s.user_id)
                    if (formateurIds[s.user_id] !== undefined)
                        delete formateurIds[s.user_id]
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
                    <p style="font-size:20px; color:black">Votre séance a commencé depuis 20min et nous avons remarqué que vous n'avez pas signé sur la plateforme <a href='https://ims.intedgroup.com'>IMS</a>.</p>
                    <p style="font-size:20px; color:black">Il vous reste 10 minutes pour aller signer votre présence, au delà vous serez noté Absent.</p>
                    <p style="font-size:20px; color:black">Si vous arrivez en retard, vous pouvez demander l’accès en cours au formateur en justifiant la raison de votre retard, et en vous excusant.</p>
                    <p>   </p>
                    <p style="font-size:20px; color:red">Ce mail étant envoyé par un robot, merci d'adresser vos demandes à <a href='mailto:m.hue@intedgroup.com'>m.hue@intedgroup.com</a></p>
                    <p>   </p>
                    <p style="font-size:20px;">Cordialement,</p>
                    
                    <footer> <img src="cid:red"/></footer>
                    `
                    var values = Object.keys(formateurIds).map(function (key) {
                        return formateurIds[key];
                    });
                    emailList = emailList.concat(values)
                    let attachments = [{
                        filename: 'signature_mh.png',
                        path: '/home/ubuntu/ems3/back/assets/signature_mh.png',
                        cid: 'red' //same cid value as in the html img src
                    }]
                    let mailOptions = {
                        from: 'ims@intedgroup.com',
                        bcc: emailList,
                        subject: '[IMS] - Notification Demande de signature',
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