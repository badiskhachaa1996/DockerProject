const express = require("express");
const app = express();
app.disable("x-powered-by");
const { ExterneSkillsnet } = require("./../models/ExterneSkillsnet");
const { User } = require("./../models/user");
const bcrypt = require("bcryptjs");

const nodemailer = require('nodemailer');
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

let origin = "http://localhost:4200"
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = "https://141.94.71.25"
    } else (
        origin = "https://ims.intedgroup.com"
    )
}

app.post('/create/:id', (req, res) => {
    User.findOne({ email_perso: req.body.email_perso }).then(userFind => {
        if (!userFind) {
            let newUser = new User({
                ...req.body
            })

            let passwordClear = "INTED@" + req.body.lastname + new Date().getSeconds().toString()
            newUser.password = bcrypt.hashSync(passwordClear, 8)
            newUser.type = "Externe-InProgress"
            //newUser.verifedEmail = true
            let created_by = req.params?.id

            newUser.save().then(userCreated => {
                if (created_by == null || created_by == "null")
                    created_by = userCreated._id
                let newObj = new ExterneSkillsnet({
                    user_id: userCreated._id,
                    created_by,
                    created_at: new Date()
                })
                newObj.save().then(doc => {
                    ExterneSkillsnet.findById(doc._id).populate('user_id').populate('created_by').then(newDoc => {
                        let htmlmail = `
                        <p style="font-size:20px; color:black">Bonjour,</p>
                        <p>   </p>
                        <p style="font-size:20px; color:black">Votre compte SkillsNet a été crée sur la plateforme <a href='${origin[0]}/#/formulaire-externe'>IMS</a>.</p>
                        <p style="font-size:20px; color:black">Merci de compléter votre profil sur <a href='${origin}/#/formulaire-externe'>cette page</a></p>
                        <p style="font-size:20px; color:black">Vos identifiants sont votre adresse email et votre mot de passe est : <strong>${passwordClear}</strong></p>
                        <p>   </p>
                        <p style="font-size:20px;">Cordialement,</p>
                        
                        <footer> <img src="cid:red"/></footer>
                        `
                        let attachments = [{
                            filename: 'nop.png',
                            path: 'assets/ims-intedgroup-logo.png',
                            cid: 'red' //same cid value as in the html img src
                        }]
                        let mailOptions = {
                            from: 'ims@intedgroup.com',
                            to: newUser.email_perso,
                            subject: '[IMS] Création de compte',
                            html: htmlmail,
                            attachments: attachments
                        };
                        /*transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });*/
                        res.send(newDoc)
                    })
                })
            })
        } else {
            ExterneSkillsnet.findOne({ user_id: userFind._id }).populate('user_id').populate('created_by').then(newDoc => {
                if (newDoc)
                    res.send(newDoc)
                else
                    res.send({user_id:userFind})
            })
        }
    })


})

app.put('/update/:id', (req, res) => {
    ExterneSkillsnet.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).populate('user_id').populate('created_by').then(doc => {
        res.send(doc)
    })
})

app.get('/getByID/:id', (req, res) => {
    ExterneSkillsnet.findById(req.params.id).populate('user_id').populate('created_by').then(doc => {
        res.send(doc)
    })
})

app.get('/getAll', (req, res) => {
    ExterneSkillsnet.find().populate('user_id').populate('created_by').then(docs => {
        res.send(docs)
    })
})
module.exports = app;
