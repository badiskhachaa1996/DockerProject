const app = require('../controllers/prospectController');
const { User } = require('./../models/user');
const { Prospect } = require('../models/prospect');
const nodemailer = require('nodemailer');
const fs = require("fs");


// initialiser transporteur de nodeMailer
let transporterEstya = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'admission@estya.com',
        pass: 'ADMIelite19',
    },
});
let transporterEH = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'contact@eduhorizons.com',
        pass: 'CeHs2022$',
    },
});

let transporterEspic = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'admission@espic.com',
        pass: 'ESPIC@@2022ims',
    },
});

let transporterAdg = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'admission@adgeducation.com',
        pass: 'ADG@@2022ims',
    },
});
// Liste des emails prospects avec statut dossier Documents Manquants
Email_docManquant = [];
// Liste des emails prospects avec statut dossier Accepté
Email_DosAccepte = [];

function smail() {
    // récupérer la liste de toutes les preinscriptions dans BD 
    Prospect.find({ archived: [false, null] })//.populate('user_id')
        .then((prospectsFromDb) => {
            prospectsFromDb.forEach(function (element, index) {
                let nb = 0
                try {
                    let fileList = fs.readdirSync('./storage/prospect/' + element._id + "/")
                    fileList.forEach(file => {
                        if (!fs.lstatSync('./storage/prospect/' + element._id + "/" + file).isDirectory()) {
                            nb += 1
                        }
                        else {
                            let files = fs.readdirSync('./storage/prospect/' + element._id + "/" + file)
                            files.forEach(f => {
                                nb += 1
                            });
                        }
                    });
                } catch (e) {
                    if (e.code != "ENOENT") {
                        console.error(e)
                    }
                }
                prospectsFromDb[index]["nbDoc"] = nb
            });

            Email_docManquant = [];

            // récupérer Liste des emails prospects avec statut dossier Documents Manquants
            prospectsFromDb.forEach(pros => {
                if (pros.statut_dossier == "Documents manquants") {
                    User.findOne({ _id: pros?.user_id }).then((userFromDb) => {
                        Email_docManquant.push(userFromDb)
                    }).catch((error) => { console.log(error.message); })
                }
            })

            // récupérer Liste des emails prospects avec statut dossier Accepte
            prospectsFromDb.forEach(pros => {
                if (pros.statut_dossier == "Accepté") {
                    User.findOne({ _id: pros?.user_id }).then((userFromDb) => {
                        Email_DosAccepte.push(userFromDb)
                    }).catch((error) => { console.log(error.message); })
                }
            })
        })
        .catch((error) => { console.log(error.message); });




    // Boucler l'envoi du mail sur la liste Email_docManquant 
    for (let ObjPros of Email_docManquant) {

        //MAIL pour prospect ESTYA
        if (ObjPros.type_form == 'estya') {

            let htmlmail = "<p>email auto</p>"

            let mailOptions = {
                from: "admission@estya.com",
                to: ObjPros.email,
                subject: '',
                html: htmlmail,

            };

            transporterEstya.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);

                }
            });
        }
        //MAIL pour prospect ADG
        else if (ObjPros.type_form == 'espic') {

            //mail ADG 
        }

        //MAIL pour prospect ESPIC
        else if (ObjPros.type_form == 'espic') {

            //mail EduHorizons 
        }
        else if (ObjPros.type_form == 'eduhorizons') {

            //mail EduHorizons 
        }


    }

    // Boucler l'envoi des mail sur la liste  Email_DosAccepte
    for (let ObjPros of Email_DosAccepte) {

        //MAIL pour prospect ESTYA
        if (ObjPros.type_form == 'estya') {

            let htmlmail = "<p>email auto</p>"

            let mailOptions = {
                from: "admission@estya.com",
                to: ObjPros.email,
                subject: '',
                html: htmlmail,

            };

            transporterEstya.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);

                }
            });
        }
        //MAIL pour prospect ADG
        else if (ObjPros.type_form == 'espic') {

            //mail ADG 
        }

        //MAIL pour prospect ESPIC
        else if (ObjPros.type_form == 'espic') {

            //mail EduHorizons 
        }
        else if (ObjPros.type_form == 'eduhorizons') {

            //mail EduHorizons 
        }


    }
}



module.exports = { smail };