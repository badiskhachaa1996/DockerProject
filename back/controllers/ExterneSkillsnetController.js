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
    if (argProd.includes("dev")) {
        origin = ["https://141.94.71.25", "https://dev-ims.intedgroup.com"];
    } else if (argProd.includes("qa")) {
        origin = ["https://152.228.219.55", "https://qa-ims.intedgroup.com"];
    } else if (argProd.includes("prod2")) {
        origin = ["https://51.68.215.184", "https://prod2-ims.intedgroup.com"];
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
                        <p style="font-size:20px; color:black">Bonjour,</p><br>
                        <p>   </p>
                        <p style="font-size:20px; color:black">
                        Nous sommes ravis de vous informer que votre compte iMatch a été créé avec succès. <br>
                        Vous pouvez désormais vous connecter pour suivre vos candidatures et postuler à d'autres offres sur <a href='https://ims.intedgroup.com/#/imatch/offres'></a><br>
                        Voici vos informations de connexion : adresse e-mail : ${userCreated.email_perso} Mot de passe : ${passwordClear} !<br>
                        Grâce à notre portail, vous pouvez générer gratuitement un CV et postuler directement aux offres disponibles de plus, un conseiller sera à votre disposition pour vous aider à trouver l'opportunité qui vous convient. <br>
                        Pour plus d'informations, veuillez contacter <a href="mailto:ims.support@intedgroup.com">ims.support@intedgroup.com</a><br>
                        Nous vous souhaitons bonne chance dans vos démarches.<br>
                        </p>
                        <p>   </p>
                        <p style="font-size:20px;">Cordialement,</p><br>
                        
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
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });
                        res.send(newDoc)
                    })
                })
            })
        } else {
            ExterneSkillsnet.findOne({ user_id: userFind._id }).populate('user_id').populate('created_by').then(newDoc => {
                if (newDoc)
                    res.send(newDoc)
                else
                    res.send({ user_id: userFind })
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
