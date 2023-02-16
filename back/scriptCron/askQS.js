
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Prospect } = require('../models/prospect')
const { Formateur } = require('../models/formateur')
const mongoose = require("mongoose");
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
//30 16 20 */3 * node askQS.js >/dev/null 2>&1
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        Etudiant.find().populate('user_id').then(etudiants=>{
            let emailList=[]
            etudiants.forEach(etudiant=>{
                if(etudiant.user_id && etudiant.user_id.email)
                    emailList.push(etudiant.user_id.email)
            })
            let htmlmail = `
            <p style="font-size:20px; color:black">Bonjour,</p>
            <p>   </p>
            <p style="font-size:20px; color:black">Nous aimerons entendre votre avis sur votre formation au sein de l'école.</p>
            <p style="font-size:20px; color:black">Merci de remplir le formulaire disponible à ce lien : <a href="https://ims.intedgroup.com/#/questionnaire-satisfaction">https://ims.intedgroup.com/#/questionnaire-satisfaction</a>,</p>
            <p style="font-size:20px; color:black">Ce questionnaire est entièrement anonyme.</p>
            <p>   </p>
            <p style="font-size:20px;">Merci beaucoup de votre aide.</p>
            `
            let mailOptions = {
                from: 'ims@intedgroup.com',
                bcc: emailList,
                subject: '[IMS] - Questionnaire de satisfaction',
                html: htmlmail
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
                console.log("SEND TO " + mailOptions.bcc.length.toString() + ".", mailOptions.bcc)
                process.exit()
            });
        })
    })