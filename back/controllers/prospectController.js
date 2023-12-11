const express = require('express');
const app = express();
app.disabled("x-powered-by");
const { Prospect } = require('../models/prospect');
const { User } = require('./../models/user');
const { Ticket } = require('../models/ticket');
const { Sujet } = require('../models/sujet');
const { Partenaire } = require("../models/partenaire")
const fs = require("fs");
const path = require('path');
var mime = require('mime-types')
const jwt = require("jsonwebtoken");
const { Notification } = require("./../models/notification");
const { Service } = require("./../models/service");
const multer = require('multer');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const { Etudiant } = require('../models/etudiant');
const { ProspectIntuns } = require('../models/ProspectIntuns');
const { ProspectAlternable } = require('../models/ProspectAlternable');
const { CommercialPartenaire } = require('../models/CommercialPartenaire');
const { Vente } = require('../models/vente');
const { AlternantsPartenaire } = require('../models/alternantsPartenaire');
const { FormationAdmission } = require('../models/formationAdmission');
const { DocumentInternational } = require('../models/documentInternational');
const { HistoriqueLead } = require('../models/HistoriqueLead');
//creation d'un transporter smtperrFile
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
// initialiser transporteur de nodeMailer
let transporterEstya = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'contact@estya.com',
        pass: 'ESTYAfr@2022*',
    },
});
let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes("dev")) {
        origin = ["https://141.94.71.25", "https://dev-ims.intedgroup.com"];
    } else if (argProd.includes("qa")) {
        origin = ["https://152.228.219.55", "https://qa-ims.intedgroup.com"];
    } else if (argProd.includes("prod2")) {
        origin = ["https://51.68.215.184", "https://prod2-ims.intedgroup.com"];
    } else (
        origin = ["https://ticket.estya.com", "https://estya.com", "https://adgeducations.com"]
    )
}
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

let transporterINTED = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'ims@intedgroup.com',
        pass: 'InTeDGROUP@@0908',
    },
});

//Creation d'un nouveau prospect
app.post("/create", (req, res, next) => {

    //Recuperation de nos datas depuis la requete
    prospectData = req.body.newProspect;
    userData = req.body.newUser;

    //Suppression du _id venant du frontend
    delete prospectData._id;
    prospectData['decision_admission'] = "En attente de traitement"
    //Création du nouvel objet prospect et du nouvel objet user
    const prospect = new Prospect({
        ...prospectData,

    });

    let r = userData.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
    const user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            indicatif: userData.indicatif,
            email: userData.email_perso,
            email_perso: userData.email_perso,
            password: bcrypt.hashSync(r, 8),
            role: userData.role,
            service_id: null,
            type: "Prospect",
            entreprise: userData.entreprise,
            pays_adresse: userData.pays_adresse,
            ville_adresse: userData.ville_adresse,
            rue_adresse: userData.rue_adresse,
            numero_adresse: userData.numero_adresse,
            postal_adresse: userData.postal_adresse,
            nationnalite: userData.nationnalite,
            verifedEmail: false,
        });



    //Vérification de l'existence de l'utilisateur via l'email perso
    User.findOne({ email_perso: userData.email_perso })
        .then((userFromDb) => {
            if (userFromDb) {
                Prospect.findOne({ user_id: userFromDb._id })
                    .then((prospectFromDb) => {
                        if (prospectFromDb) {
                            res.status(201).json({ error: 'Ce lead existe déjà !', prospect: prospectFromDb });
                        } else {
                            prospect.user_id = userFromDb._id;
                            const etudiantId = userFromDb._id;
                            const sujetid = "65156ff28c5d6b6e4ce982cb";
                            const ticket = new Ticket({
                                etudiant_id: etudiantId,
                                sujet_id: sujetid,
                                // Utilisez l'ID de l'utilisateur du prospect ici
                                // Autres champs du ticket
                            });
                            //ticket.save()
                            //.then((suc) => {res.status(201).json({ 
                            //  success: 'ticket ajouté dans la BD'})})
                            //.catch((er) => { res.status(400).json({ err:"impossible de cree le ticket" }) });
                            prospect.date_creation = new Date()
                            prospect.save()
                                .then((prospectSaved) => {

                                    let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "126c43168ab170ee503b686cd857032d", { expiresIn: "7d" })
                                    res.status(201).json({ success: 'Lead ajouté dans la BD', dataUser: userFromDb, token, prospect });
                                })
                                .catch((error) => { res.status(400).json({ error: 'Impossible d\ajouter ce lead' }) });
                        }

                    })
                    .catch((error) => { res.status(400).json({ error: "Impossible de verifier l'existence du lead" }); });
            }
            else {
                user.save()
                    .then((userCreated) => {

                        prospect.user_id = userCreated._id;
                        const etudiantId = userCreated._id;
                        const ticket = new Ticket({
                            etudiant_id: etudiantId,

                            // Utilisez l'ID de l'utilisateur du prospect ici
                            // Autres champs du ticket
                        });
                        //ticket.save()
                        prospect.date_creation = new Date()
                        let token = jwt.sign({ id: userCreated._id, role: userCreated.role, service_id: userCreated.service_id }, "126c43168ab170ee503b686cd857032d", { expiresIn: "7d" })
                        prospect.save()
                            .then((prospectSaved) => {

                                /*      if (prospectSaved.type_form == "eduhorizons") {
                                          let htmlmail =
                                              "<p>Bonjour,</p><p>Votre demande d'inscription sur notre plateforme a été enregistré avec succès. Merci d'activer votre compte en cliquant sur le lien ci dessous afin de vous connecter avec votre mail et votre mot de passe : <strong> " +
                                              r + "</strong></p>" +
                                              "<p> Afin d'entamer l'étude de votre dossier, veuillez suivre les étapes suivantes : </p>" +
                                              "<ul><li><p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                                              " <a href=\"" + origin[0] + "/#/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                              "</li><li>S'authentifier avec vos coordonnées sur le portail. </li>" +
                                              " <li>Déposer votre dossier de candidature </li>" +
                                              " <li>Suivre l'état d'avancement sur le portail</li>" +
                                              " </ul>" +
                                              "<p>Si vous avez des difficultés à charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:contact@eduhorizons.com\">contact@eduhorizons.com</a></p>" +
                                              "<p>Ainsi, pour d'autres demandes d'informations, vous pouvez nous contacter sur notre WhatsApp : +33 188880659 </p>" +
                                              "<p>Notre call center vous contactera prochainement sur votre numéro de téléphone. </p>" +
                                              "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                                              " <p>Cordialement.</p>" +
                                              "<p><img src ='cid:SignatureEmailEH' alt=\" \" width='520' height='227' /></p>";
      
      
                                          let mailOptions = {
                                              from: "contact@eduhorizons.com",
                                              to: userCreated.email_perso,
                                              subject: 'Confirmation de préinscription',
                                              html: htmlmail,
                                              attachments: [{
                                                  filename: 'SignatureEmailEH.png',
                                                  path: 'assets/SignatureEmailEH.png',
                                                  cid: 'SignatureEmailEH' //same cid value as in the html img src
                                              }]
                                          };
                                          transporterEH.sendMail(mailOptions, function (error, info) {
                                              if (error) {
                                                  console.error(error);
      
                                              }
      
      
      
                                          });
      
                                      }
                                      else if (prospectSaved.type_form == "espic") {
      
                                          let htmlmail =
                                              "<p>Bonjour,</p><p>Votre demande d'inscription sur notre plateforme a été enregistré avec succès. Merci d'activer votre compte en cliquant sur le lien ci-dessous afin de vous connecter avec votre mail et votre mot de passe : <strong> " +
                                              r + "</strong></p>" +
                                              "<p> Afin d'entamer l'étude de votre dossier, veuillez suivre les étapes suivantes :</p>" +
                                              "<ul><li>" +
                                              "<p><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                                              " <a href=\"" + origin[0] + "/#/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                              "</li><li>S'authentifier avec vos coordonnées sur le portail. </li>" +
                                              " <li>Déposer votre dossier de candidature </li>" +
                                              " <li>Suivre l'état d'avancement sur le portail</li>" +
                                              " </ul>" +
                                              "<p>Si vous avez des difficultés à charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:admission@espic.com\">admission@espic.com</a></p>" +
                                              "<p>Ainsi, pour d'autres demandes d'informations, vous pouvez nous contacter sur notre WhatsApp : +33 188880659 </p>" +
                                              "<p>Notre call center vous contactera prochainement sur votre numéro de téléphone. </p>" +
                                              "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                                              " <p>Cordialement.</p>" +
                                          "<p><img src =''alt=\" \" width='620' height='227' /></p>"
                                          let mailOptions = {
                                              from: "admission@espic.com",
                                              to: userCreated.email_perso,
                                              subject: 'Confirmation de préinscription',
                                              html: htmlmail
                                          };
                                          transporterEspic.sendMail(mailOptions, function (error, info) {
                                              if (error) {
                                                  console.error(error);
      
                                              }
      
      
      
                                          });
      
                                      }
                                      else if (prospectSaved.type_form == "adg") {
      
      
      
                                          let htmlmail = "<div> <p>Bonjour, </p> </div>   <div>" +
                                              "<p> Bienvenue au service des inscriptions de l'ADG.</p ></div >" +
                                              "<div><p>Votre demande d'inscription sur notre plateforme a été; enregistré avec succès." +
                                              "  Merci d'activer votre compte en cliquant sur le lien ci-dessous afin de vous connecter avec votre mail et votre mot de passe : <strong> " +
                                              r + "</strong></p></div>" +
                                              "<p><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                                              " <a href=\"" + origin[0] + "/#/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                                              "<div><p>Ci-après les critères d'admission et les documents nécessaires à nous communiquer afin d'entamer l'étude de votre candidature : </p>" +
                                              "</div><div><p> <br /> </p></div><div><ol start='1'><li>   <p>Critères d'admission :</p></li> </ol> </div><div>" +
                                              "<p> <br /> </p></div> <div><ul><li><p>Niveau linguistique : Eligible de faire le cursus en français. </p>" +
                                              "</li><li> <p>Parcours académique : Cursus antérieur correspondant à la formation choisie. </p></li><li>" +
                                              "<p>Rupture d'étude : les années précédentes sont justifiées. </p> </li></ul></div><div><p> <br /> </p></div>" +
                                              "<div><ol start='2'><li><p>Documents demander doivent &ecirc;tre traduit en français et envoyé en format PDF : <br /> </p></li>" +
                                              "</ol></div><div><ul><li><p>Pièce d'identité (passeport pour les non-résidents) (obligatoire).</p></li><li>" +
                                              "<p>Dernier dipl&ocirc;me obtenu (obligatoire).</p></li><li><p>Relevés de notes des deux dernières années (obligatoire).</p></li><li>" +
                                              "<p>Test de français : TCF B2 valide (moins de 2 ans), DELF B2 ou DALF (C1 ou C2) : obligatoire pour les étudiants non Francophones Obligatoire).</p>" +
                                              "</li><li><p>CV (obligatoire).</p></li><li><p>Lettre de motivation dans laquelle vous expliquer votre choix de formation et de campus pour lequel vous voulez candidater [Paris ou Montpellier] (obligatoire).</p>" +
                                              "</li><li><p>Attestations de travail (Si vous avez une expérience professionnelle).</p></li><li><p>Attestation de niveau en anglais (optionnel).</p>" +
                                              "</li><li><p>Certifications professionnelles (optionnel). </p></li></ul></div><div> </div><div>" +
                                              "<p>Notre call center vous contactera prochainement sur votre numéro de téléphone. </p>" +
                                              "<p>Si vous avez des difficultés à charger vos documents, vous pouvez les envoyer directement sur l'adresse mail <a href=\"mailto:admission@adgeducation.com\">admission@adgeducation.com</a> </p>" +
                                              "</div><div> </div><div><p>En vous souhaitant bonne chance pour le reste de votre démarche consulaire, nous restons à votre disposition pour toute information complémentaire.</p></div>" +
                                              "<div><p>  </p></div><div><p>Cordialement, </p></div><div> </div><div> </div>"
      
      
      
                                          let mailOptions = {
                                              from: "admission@adgeducation.com",
                                              to: userCreated.email_perso,
                                              subject: 'Confirmation de préinscription',
                                              html: htmlmail
                                          };
                                          transporterAdg.sendMail(mailOptions, function (error, info) {
                                              if (error) {
                                                  console.error(error);
      
                                              }
      
      
                                          });
                                      } else if (prospectSaved.type_form == "inteducation") {
      
                                          FormationAdmission.findOne({ nom: prospectSaved.formation }).then(formation => {
                                              let htmlmail = "<div> <p>Bonjour, </p> </div>   <div>" +
                                                  "<p> Bienvenue au service des inscriptions de l'ADG.</p ></div >" +
                                                  "<div><p>Nous sommes ravis de recevoir votre candidature à notre établissement.   " +
                                                  "  Votre demande d'inscription sur notre plateforme a été enregistrée avec succès, merci de vous connecter avec votre mail et le mot de passe suivant :  <strong> " +
                                                  r + "</strong> sur le lien : <a href=\"" + origin[0] + "/#/validation-email/" + userCreated.email_perso + "\">J\'active mon compte IMS</a></p></div>" +
                                                  "<div><p>Si vous rencontrez des difficultés à joindre vos documents ou en avez omis certains, vous pouvez, dans ce cas, les envoyer directement sur l'adresse électronique : orientation@intedgroup.com .   </p>" +
                                                  `<p>
                                              Les document nécessaire pour la formation ${prospectSaved.formation} sont :  
                                              ${formation.criteres}
                                              Pour vous faciliter l’utilisation de notre plateforme, vous pouvez suivre les étapes ci-après :    
                                              Vérifiez que vos informations personnelles ont été correctement saisies au niveau de la rubrique « Informations Personnelles »    
                                              Assurez-vous d’avoir choisi :  le programme d’étude le plus en adéquation avec votre parcours académique.   
                                              Nous portons à votre attention que vous pouvez consulter le statut de votre candidature sur la plateforme également.   
                                              Nous demeurons à votre disposition pour tout complément d'information.   
                                              Bien cordialement.   
                                              </p><br></div>
                                              ------------------------------------------------------------------------------------- 
                                              <div>
                                              <p>Hello, </p> 
                                              </div>
                                              <div>
                                              <p>We are delighted to receive your application to our institution. </p>
                                              </div>
                                              <div>
                                              <p>
                                              Your registration request on our platform has been successfully recorded. Please log in with your email and the following password: ${r} on the link: <a href="${origin[0]}/#/validation-email/${userCreated.email_perso}">Activate my IMS account</a>
      If you encounter any difficulties in uploading your documents or have omitted some, you can send them directly to the email address: orientation@intedgroup.com. The documents required for the ${prospectSaved.formation} are: ${formation.criteres} 
      
      To facilitate your use of our platform, you can follow the steps below:  
      
      • Verify that your personal information has been correctly entered in the "Personal Information" section.  
      
      • Ensure that you have chosen the study program that best aligns with your academic background. 
      
      Please note that you can also check the status of your application on the platform. 
      
      We remain at your disposal for any further information. 
      
       
      
      Best regards. 
      </p>
      </div>
                                              `
                                              let mailOptions = {
                                                  from: "ims@intedgroup.com",
                                                  to: userCreated.email_perso,
                                                  subject: 'Confirmation de préinscription',
                                                  html: htmlmail
                                              };
                                              transporterINTED.sendMail(mailOptions, function (error, info) {
                                                  if (error) {
                                                      console.error(error);
      
                                                  }
                                              });
                                          })
      
      
                                      } else if (prospectSaved.type_form == "estya") {
                                          let temp = fs.readFileSync('assets/EmailAdmissionEstyaPart2.html', { encoding: "utf-8", flag: "r" })
                                          temp = temp.replace('eMailduProSpect', userCreated.email_perso)
                                          temp = temp.replace('oRiGin', origin[0])
      
                                          temp = temp.replace("\"oRiGin/", '"' + origin[0] + "/")
      
                                          let htmlmail = fs.readFileSync('assets/EmailAdmissionEstyaPart1.html', { encoding: "utf-8", flag: "r" }) + r + temp
      
                                          let mailOptions = {
                                              from: "contact@estya.com",
                                              to: userCreated.email_perso,
                                              subject: 'Inscription enregistrée - ESTYA UNIVERSITY',
                                              html: htmlmail,
                                              attachments: [{
                                                  filename: 'Image1.png',
                                                  path: 'assets/Image1.png',
                                                  cid: 'Image1' //same cid value as in the html img src
                                              }]
                                          };
      
                                          transporterEstya.sendMail(mailOptions, function (error, info) {
                                              if (error) {
                                                  console.error(error);
                                              }
                                          });
      
                                      }
                                      else {
                                              let temp = fs.readFileSync('assets/EmailAdmissionEstyaPart2.html', { encoding: "utf-8", flag: "r" })
                                              temp = temp.replace('eMailduProSpect', userCreated.email_perso)
                                              temp = temp.replace('oRiGin', origin[0])
      
                                              temp = temp.replace("\"oRiGin/", '"' + origin[0] + "/")
      
                                              let htmlmail = fs.readFileSync('assets/EmailAdmissionEstyaPart1.html', { encoding: "utf-8", flag: "r" }) + r + temp
      
                                              let mailOptions = {
                                                  from: "ims@intedgroup.com",
                                                  to: userCreated.email_perso,
                                                  subject: 'Inscription enregistrée',
                                                  html: htmlmail,
                                                  attachments: [{
                                                      filename: 'Image1.png',
                                                      path: 'assets/Image1.png',
                                                      cid: 'Image1' //same cid value as in the html img src
                                                  }]
                                              };
      
                                              transporterINTED.sendMail(mailOptions, function (error, info) {
                                                  if (error) {
                                                      console.error(error);
                                                  }
                                              });
      
                                          }
                                      */
                                let htmlmail = `
                                <p>Bonjour,&nbsp;</p>
                                <p>Nous sommes ravis de recevoir votre candidature à notre établissement.&nbsp;</p>
                                <p>Votre demande d'inscription sur notre plateforme a été enregistrée avec succès, merci de vous connecter avec
                                    <strong>votre mail</strong> et le <strong>mot de passe</strong> suivant : <strong>${r}</strong> sur ce lien  :
                                    <a href="https://ims.intedgroup.com/#/login"><u>https://ims.intedgroup.com/#/login</u></a></p>
                                <p>Si vous rencontrez des difficultés à joindre vos documents ou en avez omis certains, ou bien se connecter à votre
                                    compte, veuillez nous contacter sur ims.support@intedgroup.com. </p>
                                <p>&nbsp;</p>
                                <p>Nous portons à votre attention que vous pouvez consulter le statut de votre candidature sur la plateforme
                                    également.&nbsp;</p>
                                <p>&nbsp;</p>
                                <p>Nous demeurons à votre disposition pour tout complément d'information.&nbsp;</p>
                                <p>Bien cordialement.</p>
                                <footer> <img style="max-width: 300px;max-height: 200px;" src="cid:signature"/></footer>
                                `
                                let mailOptions = {
                                    from: "ims@intedgroup.com",
                                    to: userCreated.email_perso,
                                    subject: 'Validation de votre compte étudiant',
                                    html: htmlmail,
                                    attachments: [{
                                        filename: 'signature.png',
                                        path: 'assets/ims-intedgroup-logo.png',
                                        cid: 'signature' //same cid value as in the html img src
                                    }]
                                };
                                transporterINTED.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.error(error);

                                    }
                                });
                                res.status(201).json({ success: 'Lead crée', dataUser: userCreated, token: token, prospect });
                            })

                    })
                    .catch((error) => {
                        console.error(error)
                        // res.status(400).send({ message: 'Impossible de créer un nouvel utilisateur2 !', error })
                    });
            }
        })
        .catch((error) => {
            console.error(error)
            //res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur3 ', error }) 
        });


    Service.findOne({ label: "Service Admission" }).then(servAdmission => {
        if (servAdmission) {
            let serviceadmission_id = servAdmission._id

            const notif = new Notification({
                etat: false,
                type: "nouvelle demande admission",
                date_ajout: Date.now(),
                service_id: serviceadmission_id,
            });
            notif.save().then((notifCreated) => {
                console.log("Votre notif a été crée!");
                console.log(notifCreated);

            }).catch((error) => { console.error(error) });
        }
    }).catch((error) => {
        console.error(error)
        res.status(404).send(error);
    })
});
//Création d'un nouveau ticket
app.post("/createticket", (req, res) => {
    console.log("heeeeeeeeeeeeeeeeeeeeeeeeee");
    Ticket.find({ sujet_id: req.body.sujet_id }).then(tkt => {
        var lengTicket = tkt.length + 1
        Sujet.findById(req.body.sujet_id).populate('service_id').then(sujet => {
            User.findById(req.body.createur_id).then(u => {
                //Generation Custom ID
                let id = ""
                let d = new Date()
                let month = (d.getUTCMonth() + 1).toString()
                if (d.getUTCMonth() + 1 < 10)
                    month = "0" + month
                let day = (d.getUTCDate()).toString()
                if (d.getUTCDate() < 10)
                    day = "0" + day
                let year = d.getUTCFullYear().toString().slice(-2);
                while (lengTicket > 1000)
                    lengTicket - 1000
                let nb = (lengTicket).toString()
                if (lengTicket < 10)
                    nb = "00" + nb
                if (lengTicket < 100)
                    nb = "0" + nb


                id = "IGTP" + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString() + entierAleatoire(0, 9).toString()

                const ticket = new Ticket({
                    ...req.body,
                    createur_id: req.body.createur_id,
                    sujet_id: req.body.sujet_id,
                    description: req.body.description,
                    date_ajout: d,
                    customid: id,
                    etudiant_id: req.body.etudiant_id,
                    priorite: req.body.priorite,
                    documents: req.body.documents,
                    module: req.body.module,
                });

                let htmlemail = `
                <p>Bonjour,</p><br>

<p>Nous confirmons la création de votre ticket ${id}, Le sujet de ce ticket est "${sujet.label}". Il a été créé le ${day}/${month}/${year} , dès que le ticket sera traité, vous aurez une notification par email et sur votre compte IMS</p><br>

<p>Cordialement,</p>
                `
                let mailOptions = {
                    from: 'ims@intedgroup.com',
                    to: u.email,
                    subject: '[IMS - Ticketing] - Création d\'un ticket ',
                    html: htmlemail
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error(error);
                    }
                });

                ticket.save((err, doc) => {
                    if (err) {
                        console.error(err);
                        res.status(404).send(err)
                    }
                    else
                        res.send({ message: "Votre ticket a été crée!", doc });
                    User.find({ roles_list: { $elemMatch: { module: 'Ticketing', role: 'Super-Admin' } } }).then(users => {
                        //console.log(users)
                        let emailList = []
                        users.forEach(u => {
                            emailList.push(u.email)
                        })
                        let htmlemail = `
                        <p>Bonjour,</p><br>

                        <p>Nous souhaitons vous informer qu'un nouveau ticket a été créé pour le service ${sujet.service_id.label}. Le sujet de ce ticket est " ${sujet.label}". Il a été créé le ${day}/${month}/${year} par ${u.lastname} ${u.firstname}.</p><br>
                        
                        <p>Cordialement,</p>
                        `
                        let mailOptions = {
                            from: 'ims@intedgroup.com',
                            to: emailList,
                            subject: '[IMS - Ticketing] - Création d\'un ticket ',
                            html: htmlemail
                        };


                        /*transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });*/
                    })
                    Sujet.findById(req.body.sujet_id).populate('service_id').then(sujet => {
                        let htmlemail = `
                        <p>Bonjour,</p><br>

                        <p>Nous souhaitons vous informer qu'un nouveau ticket a été créé pour le service ${sujet.service_id.label}. Le sujet de ce ticket est " ${sujet.label}". Il a été créé le ${day}/${month}/${year} par ${u.lastname} ${u.firstname}.</p><br>
                        
                        <p>Cordialement,</p>
                        `
                        let mailOptions = {
                            from: 'ims@intedgroup.com',
                            to: 'ims.support@intedgroup.com',
                            subject: '[IMS - Ticketing] - Nouveau Ticket de ' + sujet.service_id.label,
                            html: htmlemail,
                            priority: 'high',
                            attachments: [{
                                filename: 'signature.png',
                                path: 'assets/ims-intedgroup-logo.png',
                                cid: 'red' //same cid value as in the html img src
                            }]
                        };


                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });
                    })
                });
            })
        })
    })
});
function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
app.get('/getAllEtudiant', (req, res, next) => {
    let u = []
    Etudiant.find({ user_id: { $ne: null } }).then(data => {
        data.forEach(etu => {
            u.push(etu.user_id)
        })
        Prospect.find({ user_id: { $in: u } }).then(dataP => {
            res.send(dataP)
        })
    })

})

//Recuperation de la liste des prospect pour le tableau Gestions préinscriptions
app.get("/getAll", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null } }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de la liste des prospect pour le tableau Gestions préinscriptions
app.get("/getAllLocal", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, lead_type: 'Local' }).populate("user_id").populate('decision.membre').populate('agent_id').populate('evaluations.evaluation_id').sort({ date_creation: -1 })
        .then((prospectsFromDb) => {
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
});
app.get("/getAllInt", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, lead_type: 'International' }).populate("user_id").populate('decision.membre').populate('agent_id').populate('evaluations.evaluation_id').sort({ date_creation: -1 })
        .then((prospectsFromDb) => {
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllInsDef", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, phase_candidature: 'Inscription définitive' }).populate("user_id").populate('agent_id').sort({ date_creation: -1 })
        .then((prospectsFromDb) => {
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
});


//Recuperation de la liste des prospect pour le tableau Sourcing
app.get("/getAllSourcing", (req, res, next) => {
    Prospect.find({ archived: [false, null], user_id: { $ne: null }, type_form: { $ne: null } }).populate("user_id").populate('agent_id').skip(4000)
        .then((prospectsFromDb) => {
            /*let dic = {}
            prospectsFromDb.forEach(val => {
                if (dic[val.type_form])
                    dic[val.type_form].push(val)
                else
                    dic[val.type_form] = [val]
            })*/
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/get100Sourcing", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, type_form: { $ne: null } }).limit(4000).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            let dic = {}
            prospectsFromDb.forEach(val => {
                if (dic[val.type_form])
                    dic[val.type_form].push(val)
                else
                    dic[val.type_form] = [val]
            })
            res.status(201).send(dic)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de la liste des prospect pour le tableau Prospects du Partenaire
app.get("/getAllByCommercialUserID/:id", (req, res, next) => {
    CommercialPartenaire.findOne({ user_id: req.params.id }).populate('partenaire_id').then(commercial => {
        if (commercial && commercial.statut == 'Admin')
            if (commercial.partenaire_id)
                Prospect.find({ archived: [false, null], user_id: { $ne: null }, code_commercial: { $regex: "^" + commercial.partenaire_id.code_partenaire } }).populate("user_id").populate('agent_id')
                    .then((prospectsFromDb) => {
                        res.status(201).send(prospectsFromDb)
                    })
                    .catch((error) => { res.status(500).send(error.message); });
            else {
                let code = commercial.code_commercial_partenaire.substring(0, -3)
                Prospect.find({ archived: [false, null], user_id: { $ne: null }, code_commercial: { $regex: "^" + code } }).populate("user_id").populate('agent_id')
                    .then((prospectsFromDb) => {
                        res.status(201).send(prospectsFromDb)
                    })
                    .catch((error) => { res.status(500).send(error.message); });
            }
        else if (commercial)
            Prospect.find({ archived: [false, null], user_id: { $ne: null }, code_commercial: commercial.code_commercial_partenaire }).populate("user_id").populate('agent_id')
                .then((prospectsFromDb) => {
                    res.status(201).send(prospectsFromDb)
                })
                .catch((error) => { res.status(500).send(error.message); });
        else
            res.status(500).send("Commercial non trouvé")

    })
    /*Prospect.find({ archived: [false, null], user_id: { $ne: null } }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });*/
});
function getModalite(listPayement) {
    let str = listPayement[0].type
    listPayement.forEach((paiement, index) => {
        if (index != 0 && paiement.type)
            str = str + "," + paiement.type
    })
    return str
}
//Recuperation de la liste des prospect pour le tableau Paiement
app.get("/getAllPaiement", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, "payement.0": { $exists: true } }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            let dic = {}
            prospectsFromDb.forEach(val => {
                val['modalite'] = getModalite(val.payement)
                if (dic[val.type_form])
                    dic[val.type_form].push(val)
                else
                    dic[val.type_form] = [val]
            })
            res.status(201).send(dic)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de la liste des prospect pour le tableau Orientation
app.get("/getAllOrientation", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, $or: [{ team_sourcing_id: { $ne: null } }, { agent_sourcing_id: { $ne: null } }] }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            let dic = {}
            prospectsFromDb.forEach(val => {
                if (dic[val.type_form])
                    dic[val.type_form].push(val)
                else
                    dic[val.type_form] = [val]
            })
            res.status(201).send(dic)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de la liste des prospect pour le tableau Admission
app.get("/getAllAdmission", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, $or: [{ decision_orientation: "Validé" }, { decision_orientation: "Changement de campus" }, { decision_orientation: "Changement de formation" }, { decision_orientation: "Changement de destination" }] }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            let dic = {}
            prospectsFromDb.forEach(val => {
                if (dic[val.type_form])
                    dic[val.type_form].push(val)
                else
                    dic[val.type_form] = [val]
            })
            res.status(201).send(dic)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

//Recuperation de la liste des prospect pour le tableau Sourcing
app.get("/getAllConsulaire", (req, res, next) => {

    Prospect.find({ archived: [false, null], user_id: { $ne: null }, $or: [{ statut_payement: "Oui" }] }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            res.status(201).send(prospectsFromDb)
        })
        .catch((error) => { res.status(500).send(error.message); });
});

app.get("/getAllByStatut/:statut", (req, res, next) => {
    //statut = "En attente de traitement"
    if (req.params.statut == "En attente de traitement")
        Prospect.find({ archived: [false, null], user_id: { $ne: null }, statut_dossier: 'En attente de traitement' }).populate("user_id").populate('agent_id')
            .then((prospectsFromDb) => {
                res.status(201).send(prospectsFromDb)
            })
            .catch((error) => { res.status(500).send(error.message); });
    else
        Prospect.find({ archived: [false, null], user_id: { $ne: null }, statut_dossier: { $ne: 'En attente de traitement' } }).populate("user_id").populate('agent_id')
            .then((prospectsFromDb) => {
                res.status(201).send(prospectsFromDb)
            })
            .catch((error) => { res.status(500).send(error.message); });
});


//Recuperation de la liste des prospects via une école
app.get("/getAllBySchool/:school", (req, res, next) => {
    Prospect.find({ school: req.params.school })
        .then((prospectsFromDb) => { res.status(200).send(prospectsFromDb) })
        .catch((error) => { res.status(500).send(error.message) });
});

//Recuperation d'un prospect via user_id
app.get("/getByUserId/:user_id", (req, res, next) => {
    Prospect.findOne({ user_id: req.params.user_id }).populate('evaluations.evaluation_id').then(prospectFromDb => {
        res.status(200).send(prospectFromDb);
    }).catch((error) => {
        console.error(error)
        res.status(404).send(error);
    })
});

//Recuperation d'un token via user_id
app.get("/getTokenByUserId/:user_id", (req, res, next) => {
    Prospect.findOne({ user_id: req.params.user_id }).populate("user_id").then(prospectFromDb => {
        if (prospectFromDb) {
            prospectFromDb = jwt.sign({ prospectFromDb }, '126c43168ab170ee503b686cd857032d', { expiresIn: "7d" })
            res.status(201).send({ token: prospectFromDb });
        } else {
            res.status(200).send(null);
        }

    }).catch((error) => {
        console.error(error)
        res.status(500).send(error);
    })
});

//Mise à jour d'un prospect + user
app.put("/update", (req, res, next) => {
    prospectData = req.body.prospect;
    userData = req.body.user;
    Prospect.findByIdAndUpdate(prospectData._id,
        {
            ...prospectData
        })
        .then((prospectUpdated) => {
            User.findByIdAndUpdate(userData._id,
                {
                    ...userData
                })
                .then((userUpdated) => {
                    Prospect.findById(prospectUpdated._id).populate("user_id").populate('agent_id')
                        .then((prospectsFromDb) => {
                            let detail = "Mise à jour des informations"
                            if (req.body.detail)
                                detail = req.body.detail
                            let token = jwt.decode(req.header("token"))
                            //prospectUpdated.user_id = userUpdated
                            //prospectsFromDb.user_id = userData
                            let hl = new HistoriqueLead({
                                lead_before: prospectUpdated,
                                lead_after: prospectsFromDb,
                                user_before: userUpdated,
                                user_after: userData,
                                lead_id: prospectsFromDb._id,
                                user_id: token.id,
                                detail,
                                date_creation: new Date()
                            })
                            hl.save().then(h => { console.log(h) })
                            res.status(201).send(prospectsFromDb)
                        })
                        .catch((error) => { console.error(error); res.status(500).send(error.message); });
                })
                .catch((error) => { console.error(error); res.status(400).send(error); });
        })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error.message);
        })
});

app


//Mise à jour d'un prospect seulement
app.put("/updateV2", (req, res, next) => {
    Prospect.findByIdAndUpdate(req.body._id,
        {
            ...req.body
        }, { new: true })
        .then((prospectUpdated) => {
            Prospect.findById(prospectUpdated._id).populate("user_id")?.populate('agent_id').populate('decision.membre').populate('evaluations.evaluation_id')
                .then((prospectsFromDb) => {
                    let detail = "Mise à jour des informations"
                    if (req.body.detail)
                        detail = req.body.detail
                    let token = jwt.decode(req.header("token"))
                    console.log(token, req.header("token"))
                    let hl = new HistoriqueLead({
                        lead_before: prospectUpdated,
                        lead_after: prospectsFromDb,
                        lead_id: prospectsFromDb._id,
                        user_id: token.id,
                        detail,
                        date_creation: new Date()
                    })
                    hl.save().then(h => { console.log(h) })
                    if (req.body.user_id)
                        User.findByIdAndUpdate(req.body.user_id._id, { ...req.body.user_id }).then(userEdited => {
                            prospectsFromDb.user_id = userEdited
                            res.status(201).send(prospectsFromDb)
                        })
                    else
                        res.status(201).send(prospectsFromDb)
                })
                .catch((error) => { res.status(500).send(error); });
        })
        .catch((error) => { res.status(400).send(error); })
});
app.post("/updateStatut/:id", (req, res, next) => {
    let d = new Date()
    Prospect.findByIdAndUpdate(req.params.id, {
        statut_dossier: req.body.statut_dossier,
        tcf: req.body.tcf,
        date_traitement: d,
        agent_id: req.body.agent_id,
        decision_admission: req.body.decision_admission,
        phase_complementaire: req.body.phase_complementaire,
        statut_payement: req.body.statut_payement,
        customid: req.body.customid,
        traited_by: req.body.traited_by,
        validated_cf: req.body.validated_cf,
        avancement_visa: req.body.avancement_visa,
        etat_traitement: req.body.etat_traitement,
        dossier_traited_by: req.body.dossier_traited_by,
        document_manquant: req.body.document_manquant,
        document_present: req.body.document_present,
        remarque: req.body.remarque
    }, { new: true }).populate('user_id').populate('agent_id').exec(function (err, results) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(results)
        }
    });
})

//


app.get("/ValidateEmail/:email", (req, res) => {
    User.findOneAndUpdate({ email: req.params.email },
        {
            verifedEmail: true,
        }, { new: true }, (err, user) => {
            if (err) {
                console.error(err);
                res.send(err)
            } else {
                res.status(200).send(user)
            }
        })
})




app.get("/getFilesInscri/:id", (req, res) => {
    // recupére*

    let filesTosend = [];
    fs.readdir('./storage/prospect/' + req.params.id + "/", (err, files) => {

        if (!err) {
            files.forEach(file => {
                if (!fs.lstatSync('./storage/prospect/' + req.params.id + "/" + file).isDirectory()) {
                    filesTosend.push(file)
                }
                else {
                    let files = fs.readdirSync('./storage/prospect/' + req.params.id + "/" + file)
                    if (!err) {
                        files.forEach(f => {
                            filesTosend.push(file + "/" + f)
                        });
                    }
                }
            });
        }
        res.status(200).send(filesTosend);
    }, (error) => (console.error(error)))
})

app.get("/downloadFile/:id/:directory/:filename", (req, res) => {
    let pathFile = "storage/prospect/" + req.params.id + "/" + req.params.directory + "/" + req.params.filename
    console.log(pathFile)
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});

app.get("/downloadFileAdmin/:id/:path", (req, res) => {
    let pathFile = "storage/prospect/admin/" + req.params.id + "/" + req.params.path
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


app.get("/deleteFile/:id/:directory/:filename", (req, res) => {
    let pathFile = "storage/prospect/" + req.params.id + "/" + req.params.directory + "/" + req.params.filename
    try {
        fs.unlinkSync(pathFile)
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }
    res.status(200).send()

});

const storagepaiement = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/prospect/paiement/' + req.body.id + "/")) {
            fs.mkdirSync('storage/prospect/paiement/' + req.body.id + "/", { recursive: true })
        }
        callBack(null, 'storage/prospect/paiement/' + req.body.id + "/")
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

app.post('/uploadFilePaiement/:id', multer({ storage: storagepaiement, limits: { fileSize: 20000000 } }).single('file'), (req, res, next) => {

    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        res.status(200).send('')
    }

}, (error) => { res.status(500).send(error); })

app.get("/downloadFilePaiement/:id/:filename", (req, res) => {
    let pathFile = "storage/prospect/paiement/" + req.params.id + "/" + req.params.filename
    let file = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: mime.contentType(path.extname(pathFile)) })

});


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/prospect/' + req.body.id + '/' + req.body.document + '/')) {
            fs.mkdirSync('storage/prospect/' + req.body.id + '/' + req.body.document + '/', { recursive: true })
        }
        callBack(null, 'storage/prospect/' + req.body.id + '/' + req.body.document + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } })

app.post('/uploadFile/:id', upload.single('file'), (req, res, next) => {

    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        Prospect.findByIdAndUpdate(req.body.id, { haveDoc: true }, { new: true }, ((err, newProspect) => {
            if (err) {
                console.log(err)
            }
        }))
        res.status(201).json({ dossier: "dossier mise à jour" });
    }

}, (error) => { res.status(500).send(error); })

const storageAdmin = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/prospect/admin/' + req.body.id + '/')) {
            fs.mkdirSync('storage/prospect/admin/' + req.body.id + '/', { recursive: true })
        }
        callBack(null, 'storage/prospect/admin/' + req.body.id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const uploadAdmin = multer({ storage: storageAdmin, limits: { fileSize: 20000000 } })

app.post('/uploadAdminFile/:id', uploadAdmin.single('file'), (req, res, next) => {

    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        Prospect.findById(req.body.id, ((err, newProspect) => {
            newProspect.documents_administrative.push({ date: new Date(req.body.date), note: req.body.note.toString(), traited_by: req.body.traited_by.toString(), path: req.body.path.toString(), nom: req.body.nom.toString(), type: req.body.type.toString(), custom_id: req.body.custom_id.toString() })
            Prospect.findByIdAndUpdate(req.body.id, { documents_administrative: newProspect.documents_administrative }, { new: true }, (err, doc) => {
                if (err)
                    console.error(err)
                res.status(201).json({ dossier: "dossier mise à jour", documents_administrative: newProspect.documents_administrative });
            })
        }))

    }

}, (error) => { res.status(500).send(error); })

app.get("/getAllByCodeAdmin/:id_partenaire", (req, res, next) => {
    Partenaire.findOne({ _id: req.params.id_partenaire })
        .then((partenaireFromDB) => {
            if (partenaireFromDB) {
                Prospect.find({ code_commercial: { $regex: "^" + partenaireFromDB.code_partenaire }, user_id: { $ne: null } }).populate("user_id").populate('agent_id').then(prospects => {
                    res.status(200).send(prospects)
                })
            } else {
                res.status(400).send("Code incorrect, Aucun partenaire trouvé");
            }
        })
        .catch((error) => { res.status(500).send(error); });
})

app.get("/getAllByCodeCommercial/:code_partenaire", (req, res, next) => {
    Prospect.find({ code_commercial: req.params.code_partenaire, user_id: { $ne: null } }).populate("user_id").populate('agent_id')
        .then(prospects => {
            res.send(prospects)
        }).catch((error) => { res.status(500).send(error); });
})

app.get('/getAllWait', (req, res, next) => {
    Prospect.find({ decision_admission: ["Payée", "A signé les documents"], archived: [false, null], user_id: { $ne: null } }).populate('user_id').populate('agent_id').then(prospects => {
        res.send(prospects)
    }).catch((error) => { res.status(500).send(error); });
})

app.post('/updatePayement/:id', (req, res) => {
    Prospect.findByIdAndUpdate(req.params.id, { payement: req.body.payement }, { new: true }, function (err, data) {
        if (err) {
            console.error(err)
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/getPopulateByUserid/:user_id', (req, res) => {
    Prospect.findOne({ user_id: req.params.user_id }).populate('user_id').then(data => {
        res.status(200).send(data)
    }, (error) => {
        console.error(error)
        res.status(400).send(error)
    })
})

app.get('/etatTraitement/:id/:etat', (req, res) => {
    Prospect.findByIdAndUpdate(req.params.id, { etat_traitement: req.params.etat }).then(data => {
        res.status(200).send(data)
    }).catch((error) => { res.status(500).send(error); });
})


//Requête de récupération du nombre de nouvelle inscrits, du nombre total d'inscrit et du nombre d'étudiant en attente
app.get("/getInfoDashboardAdmission", (req, res, next) => {
    Prospect.find({ etat_traitement: 'Nouvelle' })
        .then((nouvelle_inscrit) => {
            Prospect.find({ etat_traitement: 'Retour Etudiant' })
                .then((retour_etudiant) => {
                    Prospect.find({ archived: [false, null] })
                        .then((all_etudiant) => { res.status(200).send({ nb_all_etudiant: all_etudiant.length, nb_nouvelle_inscrit: nouvelle_inscrit.length, nb_retour_etudiant: retour_etudiant.length }); })
                })
                .catch((error) => { res.status(500).send(error); })
        })
        .catch((error) => { res.status(500).send(error); })
});

app.get('/createProspectWhileEtudiant/:user_id', (req, res) => {
    let p = Prospect({
        user_id: req.params.user_id,
        archived: true,
        etat_traitement: "Fini",
        date_creation: new Date()
    })
    p.save().then(data => {
        res.status(201).send(data)
    })
})

app.get('/updateDossier/:id/:statut_dossier', (req, res) => {
    Prospect.findByIdAndUpdate(req.params.id, { statut_dossier: req.params.statut_dossier }, { new: true }, function (err, data) {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/delete/:p_id/:user_id', (req, res) => {
    Prospect.findByIdAndRemove(req.params.p_id, {}, function (err, data2) {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        } else {
            //Supprimer ces fichiers
            let pathFile = "storage/prospect/" + req.params.p_id
            try {
                fs.rmSync(pathFile, { recursive: true });
            } catch (err) {
                console.error(err)
            }
            User.findByIdAndRemove(req.params.user_id, {}, function (err, data) {
                if (err) {
                    console.error(err)
                    res.status(400).send(err)
                } else {
                    res.status(201).send({ user: data, prospect: data2 })
                }
            })
        }
    })
})

app.post("/updateVisa", (req, res) => {
    let b = req.body.statut == 'true'
    Prospect.updateOne({ _id: req.body.p_id }, { avancement_visa: b }).then(doc => {
        console.log(doc)
        res.status(201).send(doc)
    }).catch((error) => { res.status(500).send(error); });
})

app.get("/getByAllAlternance", (req, res, next) => {
    Prospect.find({ rythme_formation: 'Alternance' }).populate("user_id").populate('agent_id')
        .then((prospect) => { res.status(200).send(prospect); })
        .catch((error) => { res.status(500).send(error); })
});
app.post('/createIntuns', (req, res) => {
    let f_intuns = new ProspectIntuns({
        ...req.body
    })
    ProspectIntuns.findOne({ email: f_intuns.email, nom: f_intuns.nom, prenom: f_intuns.prenom, parcours: f_intuns.parcours }).then(r => {
        if (r == null)
            f_intuns.save()
                .then((userUpdated) => { res.status(200).send(userUpdated) })
                .catch((error) => { res.status(400).send(error); });
        else
            res.status(409).send({ message: 'Vous avez déjà rempli un formulaire chez nous!' });
    })
})

app.get('/getAllProspectsIntuns', (req, res) => {
    ProspectIntuns.find().then(data => {
        res.status(200).send(data)
    }).catch((error) => { res.status(500).send(error); });
});


//* Partie dédié aux prospects alternables
// recuperation de la liste des prospects alternables
app.get("/get-prospects-alt", (req, res) => {
    ProspectAlternable.find()?.populate('user_id')?.populate({ path: 'commercial_id', populate: { path: 'user_id' } })
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).json({ error: error, errMsg: "Impossible de récuperer la liste des prospects alternables, veuillez contacter un administrateur" }); })
});

// recuperation de la liste des prospects alternables d'un commercial
app.get("/get-prospects-alt-by-com-id/:id", (req, res) => {
    ProspectAlternable.find({ commercial_id: req.params.id })?.populate('user_id')?.populate({ path: 'commercial_id', populate: { path: 'user_id' } })
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).json({ error: error, errMsg: "Impossible de récuperer la liste des prospects alternables, veuillez contacter un administrateur" }); })
});

// recuperation d'un prospect alternable via son id
app.get("/get-prospect-alt/:id", (req, res) => {
    ProspectAlternable.find({ _id: req.params.id })?.populate('user_id')?.populate({ path: 'commercial_id', populate: { path: 'user_id' } })
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).json({ error: error, errMsg: "Impossible de récuperer le prospect alternable, veuillez contacter un administrateur" }); })
});

// creation d'un prospect alternable
app.post("/post-prospect-alt", (req, res) => {
    let user = new User({ ...req.body.user });
    let prospect = new ProspectAlternable({ ...req.body.prospect });

    // création d'un mot de passe
    let password = user.firstname.substring(0, 3) + "@" + (Math.random() + 1).toString(16).substring(7).replace(' ', '');
    user.password = bcrypt.hashSync(password, 8),

        // ajout du nouveau prospect
        user.save()
            .then((userSaved) => {
                // modification du user_id de l'objet prospect
                prospect.user_id = userSaved._id;
                // création de l'objet prospect alternable
                prospect.save()
                    .then((prospectSaved) => {
                        // création du mail à envoyer
                        let htmlMail =
                            "<p>Bonjour,</p><p>Votre demande d'inscription sur notre plateforme a été enregistré avec succès. Merci d'activer votre compte en cliquant sur le lien ci dessous afin de vous connecter avec votre mail et votre mot de passe : <strong> " +
                            user.password + "</strong></p>" +
                            "<p> Afin d'entamer l'étude de votre dossier, veuillez suivre les étapes suivantes : </p>" +
                            "<ul><li><p ><span style=\"color: rgb(36, 36, 36);font-weight: bolder;\"> Activer votre compte et valider votre email en cliquant sur" +
                            " <a href=\"" + origin[0] + "/#/validation-email/" + userSaved.email_perso + "\">J\'active mon compte IMS</a></span></p> " +
                            "</li><li>S'authentifier avec vos coordonnées sur le portail en utilisant votre adresse email et le mot de passe suivant" + userSaved.password + ".</li>" +
                            " <li>Suivre l'état d'avancement sur le portail</li>" +
                            " </ul>" +
                            "<p> <br/>Nous restons à votre disposition pour tout complément d'information <a href=\"mailto:contact@intedgroup.com\">contact@intedgroup.com</a>.</p>" +
                            " <p>Cordialement.</p>";

                        let mailOptions = {
                            from: "ims@intedgroup.com",
                            to: userSaved.email_perso,
                            subject: 'Votre acces [IMS] ',
                            html: htmlMail,
                            // attachments: [{
                            //     filename: 'Image1.png',
                            //     path: 'assets/Image1.png',
                            //     cid: 'Image1' //same cid value as in the html img src
                            // }]
                        };

                        transporterINTED.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.error(error);
                            }
                        });

                        res.status(201).json({ successMsg: "Votre demande d'admission à bien été pris en compte" });
                    })
                    .catch((error) => { console.error(error); res.status(400).json({ error: error, errMsg: 'Impossible de créer votre compte, veuillez contacter votre commecial référent' }); })
            })
            .catch((error) => { console.error(error); res.status(400).json({ error: error, errMsg: 'Impossible de prendre en compte votre inscription, votre adresse mail existe peut être déja, veuillez contacter votre commecial référent si le problème persiste' }); })
});

// méthode d'envoi du mail de génération du formulaire admission
app.post("/send-creation-link", (req, res) => {
    let idCommercial = req.body.idCommercial;
    let email = req.body.email;

    // création du mail à envoyer
    let htmlMail = "<p>Bonjour,</p>" +
        "<p>Voici le lien pour efectuer votre demande d'admission sur notre espace IMS, merci de cliquer sur le lien suivant: <a href=\"https://ims.intedgroup.com/#/formulaire-admission-alternance/" + idCommercial + "\">Formulaire de demande d'admission</a></p>" +
        "<p>Cordialement.</p>";

    let mailOptions =
    {
        from: "ims@intedgroup.com",
        to: email,
        subject: "Lien d'admission [IMS]",
        html: htmlMail,
        // attachments: [{
        //     filename: 'Image1.png',
        //     path: 'assets/Image1.png',
        //     cid: 'Image1' //same cid value as in the html img src
        // }]
    };


    // envoi du mail
    transporterINTED.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        }
    });

    res.status(200).json({ successMsg: 'Email envoyé' });
});

app.get('/getAllAffected/:agent_id/:team_id', (req, res) => {
    Prospect.find({ $or: [{ agent_sourcing_id: req.params.agent_id }, { team_sourcing_id: req.params.team_id }] }).populate("user_id").populate('agent_id')
        .then((prospectsFromDb) => {
            let dic = {}
            prospectsFromDb.forEach(val => {
                if (dic[val.type_form])
                    dic[val.type_form].push(val)
                else
                    dic[val.type_form] = [val]
            })
            res.status(201).send(dic)
        })
        .catch((error) => { res.status(500).send(error.message); });
})

app.post('/getDataForDashboardInternational', (req, res) => {
    let data = req.body //{  source,rentree_scolaire, formation,url_form,date_1,date_2,campus, pays, phase_candidature}
    let filter = {}
    if (!data.source || data.source.length == 0) delete data.source
    else filter['source'] = { $in: data.source }
    if (!data.rentree_scolaire || data.rentree_scolaire.length == 0) delete data.rentree_scolaire
    else filter['rentree_scolaire'] = { $in: data.rentree_scolaire }
    if (!data.formation || data.formation.length == 0) delete data.formation
    else filter['formation'] = { $in: data.formation }
    if (!data.url_form || data.url_form.length == 0) delete data.url_form
    else filter['type_form'] = { $in: data.url_form }
    if (!data.campus || data.campus.length == 0) delete data.campus
    else filter['campus_choix_1'] = { $in: data.campus }
    if (!data.phase_candidature || data.phase_candidature.length == 0) delete data.phase_candidature
    else filter['phase_candidature'] = { $in: data.phase_candidature }

    let date_debut = new Date(2000, 1, 1)
    let date_fin = new Date()
    if (data.date_1) {
        date_debut = new Date(data.date_1)
        if (data.date_2)
            date_fin = new Date(data.date_2)
    }

    //filter['date_creation'] = { $lte: date_fin, $gte: date_debut }
    Prospect.find(filter).populate('user_id').then(prospectList => {
        let ProspectFiltered = []
        let stats_paiements = {
            preinscription: {
                virement: 0,
                espece: 0,
                cheque: 0,
                lien: 0,
                compensation: 0,
                total: 0
            },
            inscription: {
                virement: 0,
                espece: 0,
                cheque: 0,
                lien: 0,
                compensation: 0,
                total: 0
            }
        }
        if (data.pays && data.pays.length != 0)
            prospectList.forEach(val => {
                if (val.user_id && data.pays.includes(val.user_id.pays_adresse)) {
                    data.payement.forEach(pay => {
                        if (pay.montant >= 560) {
                            stats_paiements.inscription.total += 1
                            if (pay.type == 'Lien de paiement')
                                stats_paiements.inscription.lien += 1
                            else if (pay.type == 'Compensation')
                                stats_paiements.inscription.compensation += 1
                            else if (pay.type.includes('Virement'))
                                stats_paiements.inscription.virement += 1
                            else if (pay.type.includes('Espèce'))
                                stats_paiements.inscription.espece += 1
                            else if (pay.type.includes('Chèque'))
                                stats_paiements.inscription.cheque += 1
                        } else {
                            stats_paiements.preinscription.total += 1
                            if (pay.type == 'Lien de paiement')
                                stats_paiements.preinscription.lien += 1
                            else if (pay.type == 'Compensation')
                                stats_paiements.preinscription.compensation += 1
                            else if (pay.type.includes('Virement'))
                                stats_paiements.preinscription.virement += 1
                            else if (pay.type.includes('Espèce'))
                                stats_paiements.preinscription.espece += 1
                            else if (pay.type.includes('Chèque'))
                                stats_paiements.preinscription.cheque += 1
                        }
                    })
                    ProspectFiltered.push(val)
                }

            })
        else
            ProspectFiltered = prospectList
        let stats = {
            tt_prospects: ProspectFiltered.length,
            tt_admis: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'Accepté' ? 1 : 0), 0)),
            tt_paiements: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.statut_payement == 'Oui' ? 1 : 0), 0)),
            tt_visa: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_visa == 'Oui' ? 1 : 0), 0)),
            tt_etudiants: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'Inscription définitive' ? 1 : 0), 0)),
            tt_orientation: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En phase d\'orientation scolaire' ? 1 : 0), 0)),
            tt_admission: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En phase d\'admission' ? 1 : 0), 0)),
            tt_consulaire: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En phase d\'orientation consulaire' ? 1 : 0), 0)),
            nn_affecte: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En attente d\'affectation' ? 1 : 0), 0)),
            recours: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'Recours' ? 1 : 0), 0)),
        }
        let stats_orientation = {
            contact: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation != 'En attente' ? 1 : 0), 0)),
            non_contact: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'En attente' ? 1 : 0), 0)),
            joignable: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'Joignable' ? 1 : 0), 0)),
            non_joignable: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'Non Joignable  &  Mail envoyé' ? 1 : 0), 0)),
            valide: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Validé') ? 1 : 0), 0)),
            non_valide: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Dossier rejeté') ? 1 : 0), 0)),
            oriente: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Changement de campus') || next?.decision_orientation.includes('Changement de formation') || next?.decision_orientation.includes('Changement de destination') ? 1 : 0), 0)),
            suspension: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Suspendu') ? 1 : 0), 0)),
        }
        let stats_admission = {
            traite: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.dossier_traited_by != null ? 1 : 0), 0)),
            non_traite: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.dossier_traited_by == null ? 1 : 0), 0)),
            admissible: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'Accepté' || next?.decision_admission == 'Accepté sur réserve' ? 1 : 0), 0)),
            non_admissible: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'Refusé' ? 1 : 0), 0)),
            attente: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'En attente de traitement' ? 1 : 0), 0)),
        }
        let stats_consulaire = {
            contacte: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.contact_orientation != null ? 1 : 0), 0)),
            non_contacte: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.contact_orientation == null ? 1 : 0), 0)),
            logement: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.logement != null ? 1 : 0), 0)),
        }

        res.send({ stats, stats_orientation, stats_admission, stats_consulaire, stats_paiements })
    })

})

app.get('/getDataForDashboardInternationalBasique', (req, res) => {
    Prospect.find().populate('user_id').then(prospectList => {
        let ProspectFiltered = []
        let stats_paiements = {
            preinscription: {
                virement: 0,
                espece: 0,
                cheque: 0,
                lien: 0,
                compensation: 0,
                total: 0
            },
            inscription: {
                virement: 0,
                espece: 0,
                cheque: 0,
                lien: 0,
                compensation: 0,
                total: 0
            }
        }
        prospectList.forEach(data => {
            if (data && data.payement)
                data.payement.forEach(pay => {
                    console.log(pay);
                    if (pay.montant >= 560) {
                        stats_paiements.inscription.total += 1
                        if (pay?.method)
                            if (pay.method == 'Lien de paiement')
                                stats_paiements.inscription.lien += 1
                            else if (pay.method == 'Compensation')
                                stats_paiements.inscription.compensation += 1
                            else if (pay.method.includes('Virement'))
                                stats_paiements.inscription.virement += 1
                            else if (pay.method.includes('Espèce'))
                                stats_paiements.inscription.espece += 1
                            else if (pay.method.includes('Chèque'))
                                stats_paiements.inscription.cheque += 1
                    } else {
                        stats_paiements.preinscription.total += 1
                        if (pay?.method)
                            if (pay.method == 'Lien de paiement')
                                stats_paiements.preinscription.lien += 1
                            else if (pay.method == 'Compensation')
                                stats_paiements.preinscription.compensation += 1
                            else if (pay.method?.includes('Virement'))
                                stats_paiements.preinscription.virement += 1
                            else if (pay.method?.includes('Espèce'))
                                stats_paiements.preinscription.espece += 1
                            else if (pay.method?.includes('Chèque'))
                                stats_paiements.preinscription.cheque += 1
                    }
                })
        })
        ProspectFiltered = prospectList


        let stats = {
            tt_prospects: ProspectFiltered.length,
            tt_admis: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'Accepté' ? 1 : 0), 0)),
            tt_paiements: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.statut_payement == 'Oui' ? 1 : 0), 0)),
            tt_visa: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_visa == 'Oui' ? 1 : 0), 0)),
            tt_etudiants: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'Inscription définitive' ? 1 : 0), 0)),
            tt_orientation: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En phase d\'orientation scolaire' ? 1 : 0), 0)),
            tt_admission: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En phase d\'admission' ? 1 : 0), 0)),
            tt_consulaire: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En phase d\'orientation consulaire' ? 1 : 0), 0)),
            nn_affecte: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'En attente d\'affectation' ? 1 : 0), 0)),
            recours: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'Recours' ? 1 : 0), 0)),
        }
        let stats_orientation = {
            contact: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation != 'En attente' ? 1 : 0), 0)),
            non_contact: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'En attente' ? 1 : 0), 0)),
            joignable: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'Joignable' ? 1 : 0), 0)),
            non_joignable: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'Non Joignable  &  Mail envoyé' ? 1 : 0), 0)),
            valide: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Validé') ? 1 : 0), 0)),
            non_valide: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Dossier rejeté') ? 1 : 0), 0)),
            oriente: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Changement de campus') || next?.decision_orientation.includes('Changement de formation') || next?.decision_orientation.includes('Changement de destination') ? 1 : 0), 0)),
            suspension: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Suspendu') ? 1 : 0), 0)),
        }
        let stats_admission = {
            traite: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.dossier_traited_by != null ? 1 : 0), 0)),
            non_traite: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.dossier_traited_by == null ? 1 : 0), 0)),
            admissible: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'Accepté' || next?.decision_admission == 'Accepté sur réserve' ? 1 : 0), 0)),
            non_admissible: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'Refusé' ? 1 : 0), 0)),
            attente: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.decision_admission == 'En attente de traitement' ? 1 : 0), 0)),
        }
        let stats_consulaire = {
            contacte: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.contact_orientation != null ? 1 : 0), 0)),
            non_contacte: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.contact_orientation == null ? 1 : 0), 0)),
            logement: Math.trunc(ProspectFiltered.reduce((total, next) => total + (next?.logement != null ? 1 : 0), 0)),
        }

        res.send({ stats, stats_orientation, stats_admission, stats_consulaire, stats_paiements })
    })
})

app.post('/getDataForDashboardPerformance', (req, res) => {
    let data = req.body //{  source,rentree_scolaire, formation,url_form,date_1,date_2,campus, pays, phase_candidature}
    let filter = {}
    if (!data.source || data.source.length == 0) delete data.source
    else filter['source'] = { $in: data.source }
    if (!data.rentree_scolaire || data.rentree_scolaire.length == 0) delete data.rentree_scolaire
    else filter['rentree_scolaire'] = { $in: data.rentree_scolaire }
    if (!data.formation || data.formation.length == 0) delete data.formation
    else filter['formation'] = { $in: data.formation }
    if (!data.url_form || data.url_form.length == 0) delete data.url_form
    else filter['type_form'] = { $in: data.url_form }
    if (!data.campus || data.campus.length == 0) delete data.campus
    else filter['campus_choix_1'] = { $in: data.campus }
    if (!data.phase_candidature || data.phase_candidature.length == 0) delete data.phase_candidature
    else filter['phase_candidature'] = { $in: data.phase_candidature }

    let date_debut = new Date(2000, 1, 1)
    let date_fin = new Date()
    if (data.date_1) {
        date_debut = new Date(data.date_1)
        if (data.date_2)
            date_fin = new Date(data.date_2)
    }
    //filter['date_creation'] = { $lte: date_fin, $gte: date_debut }
    //filter['dossier_traited_by'] = req.body.member._id
    Prospect.find(filter).populate('user_id').then(prospectList => {
        let ProspectOrientationFiltered = []
        let ProspectAdmissionFiltered = []
        let ProspectSourcingFiltered = []
        let ProspectConsulaireFiltered = []

        let ProspectAttestation = []
        let score_attente = 0
        if (data.pays && data.pays.length != 0)
            prospectList.forEach(val => {
                if (val.user_id && data.pays.includes(val.user_id.pays_adresse)) {
                    if (val.dossier_traited_by == req.body.member._id) {
                        ProspectAdmissionFiltered.push(val)//????

                    }

                    if (val.agent_sourcing_id == req.body.member._id)
                        ProspectSourcingFiltered.push(val)//Sourcing
                    if (val.consulaire_traited_by == req.body.member._id) {
                        ProspectConsulaireFiltered.push(val)//Consulaire
                        let tempBool = false
                        val.documents_administrative.forEach(doc => {
                            if (doc.traited_by == `${req.body.member.lastname} ${req.body.member.firstname}`)
                                tempBool = true
                        })
                        if (tempBool)
                            ProspectAttestation.push(val)
                    }

                    if (val.contact_orientation == req.body.member._id) {
                        ProspectOrientationFiltered.push(val)//Orientation
                        score_attente += Math.ceil((new Date(val?.date_creation).getTime() - new Date(val?.contact_date).getTime()) / (1000 * 3600 * 24))
                    }

                }

            })
        else
            prospectList.forEach(val => {
                if (val.dossier_traited_by == req.body.member._id)
                    ProspectAdmissionFiltered.push(val)//????
                if (val.agent_sourcing_id == req.body.member._id)
                    ProspectSourcingFiltered.push(val)//Sourcing
                if (val.consulaire_traited_by == req.body.member._id) {
                    ProspectConsulaireFiltered.push(val)//Consulaire
                    let tempBool = false
                    val.documents_administrative.forEach(doc => {
                        if (doc?.traited_by == `${req.body.member.lastname} ${req.body.member.firstname}`)
                            tempBool = true
                    })
                    if (tempBool)
                        ProspectAttestation.push(val)
                }
                if (val.contact_orientation == req.body.member._id) {
                    ProspectOrientationFiltered.push(val)//Orientation
                    score_attente += Math.ceil((new Date(val?.date_creation).getTime() - new Date(val?.contact_date).getTime()) / (1000 * 3600 * 24))
                }
            })
        //let ProspectFiltered = ProspectAdmissionFiltered.concat(ProspectSourcingFiltered, ProspectConsulaireFiltered, ProspectOrientationFiltered)
        let days = Math.ceil((new Date(req.body.member.date_creation).getTime() - new Date().getTime()) / (1000 * 3600 * 24))

        let r = {
            orientation: {
                assigned: ProspectOrientationFiltered.length,
                contacted: Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.avancement_orientation != 'En attente' ? 1 : 0), 0)),
                oriented: Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Changement de campus') || next?.decision_orientation.includes('Changement de formation') || next?.decision_orientation.includes('Changement de destination') ? 1 : 0), 0)),
                suspension: Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Suspendu') ? 1 : 0), 0)),
                joignable: Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'Joignable' ? 1 : 0), 0)),
                nn_joignable: Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'Non Joignable  &  Mail envoyé' ? 1 : 0), 0)),
                valided: Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Validé') ? 1 : 0), 0)),
                nn_valided: Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.decision_orientation.includes('Dossier rejeté') ? 1 : 0), 0)),
            },
            admission: {
                prospects: ProspectAdmissionFiltered.length,
                attestations: ProspectAttestation.length
            },
            paiements: { nb: Math.trunc(ProspectSourcingFiltered.reduce((total, next) => total + (next?.statut_payement == "Oui" ? 1 : 0), 0)), },
            consulaire: {
                prospects: ProspectConsulaireFiltered.length,
                logements: Math.trunc(ProspectConsulaireFiltered.reduce((total, next) => total + (next?.logement != null ? 1 : 0), 0)),
            },
            global: {
                prospects: Math.ceil(ProspectOrientationFiltered.length / Math.trunc(ProspectOrientationFiltered.reduce((total, next) => total + (next?.avancement_orientation != 'En attente' ? 1 : 0), 0))),//Nombre des prospects assigné / Nombre des prospects contactés 
                daily_contact: Math.ceil(ProspectOrientationFiltered.length / days),
                delai: Math.ceil(score_attente / ProspectOrientationFiltered.length) * -1
            }
        }
        res.send(r)
    })
})

app.post('/getDataForDashboardPartenaire', (req, res) => {
    let data = req.body // {pays : string,rentree_scolaire:string,partenaire_id:string[],commercial_id:string[]}
    let globalstats = {
        nb_partenaire: 0,
        anciennete: {
            nouveau: 0,
            ancien: 0
        },
        contribution: {
            actif: 0,
            non_actif: 0,
            occasionnel: 0
        },
        etat_contrat: {
            pas_contrat: 0,
            en_cours: 0,
            signe: 0
        }
    }

    let activitystats = {
        chiffre_affaire: 0,
        nb_prospects: 0,
        nb_prospects_contact: 0,
        nb_prospects_accepte: 0,
        nb_prospects_preinscrits: 0,
        nb_visas: 0,
        nb_inscrits: 0,
        nb_alternants: 0,
        nb_contrats: 0,
        nb_chaumage: 0
    }
    Partenaire.find().then(listPartenaire => {
        globalstats.nb_partenaire = listPartenaire.length
        globalstats.anciennete.ancien = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.statut_anciennete == 'Ancien > 1 an' ? 1 : 0), 0))
        globalstats.anciennete.nouveau = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.statut_anciennete == 'Ancien > 1 an' ? 0 : 1), 0))

        globalstats.contribution.actif = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.contribution == 'Actif' ? 1 : 0), 0))
        globalstats.contribution.non_actif = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.contribution == 'Inactif' ? 1 : 0), 0))
        globalstats.contribution.occasionnel = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.contribution == 'Occasionnel' ? 1 : 0), 0))

        globalstats.etat_contrat.pas_contrat = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.etat_contrat == 'Non' ? 1 : 0), 0))
        globalstats.etat_contrat.en_cours = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.etat_contrat == 'En cours' ? 1 : 0), 0))
        globalstats.etat_contrat.signe = Math.trunc(listPartenaire.reduce((total, next) => total + (next?.etat_contrat == 'Signé' ? 1 : 0), 0))
        let filter = { $exists: true }
        // data : {pays : string,rentree_scolaire:string,partenaire_id:string[],commercial_id:string[]}
        if (data.partenaire_id && data.partenaire_id.length != 0) filter = { $in: data.partenaire_id }
        Vente.find({ partenaire_id: filter }).then(dataVente => {
            activitystats.chiffre_affaire = Math.trunc(dataVente.reduce((total, next) => total + next?.montant, 0))
            let newFilter = {}
            newFilter['partenaire_id'] = filter
            newFilter['_id'] = { $exists: true }
            if (data.commercial_id && data.commercial_id.length != 0) newFilter['_id'] = { $in: data.commercial_id }
            CommercialPartenaire.find(newFilter).then(listCommercial => {
                let listCode = []
                listCommercial.forEach(c => {
                    listCode.push(c.code_commercial_partenaire)
                })
                delete data.partenaire_id
                delete data.commercial_id
                let pays_adresse = data.pays
                delete data.pays
                data.code_commercial = listCode
                Prospect.find(data).populate('user_id').then(tempFiltered => {
                    let prospectFiltered = []
                    if (pays_adresse)
                        tempFiltered.forEach(p => { if (p.user_id && p.user_id?.pays_adresse == pays_adresse) prospectFiltered.push(p) })
                    else prospectFiltered = tempFiltered
                    activitystats.nb_prospects = prospectFiltered.length
                    activitystats.nb_prospects_contact = Math.trunc(prospectFiltered.reduce((total, next) => total + (next?.avancement_orientation == 'En attente' ? 1 : 0), 0))
                    activitystats.nb_prospects_accepte = Math.trunc(prospectFiltered.reduce((total, next) => total + (next?.decision_admission == 'Accepté' ? 1 : 0), 0))
                    activitystats.nb_prospects_preinscrits = Math.trunc(prospectFiltered.reduce((total, next) => total + (next?.statut_payement == 'Oui' || next?.statut_payement == true ? 1 : 0), 0))
                    activitystats.nb_visas = Math.trunc(prospectFiltered.reduce((total, next) => total + (next?.avancement_visa == 'Oui' ? 1 : 0), 0))
                    activitystats.nb_inscrits = Math.trunc(prospectFiltered.reduce((total, next) => total + (next?.phase_candidature == 'Inscription définitive' ? 1 : 0), 0))
                    if (pays_adresse)
                        data['pays'] = pays_adresse
                    AlternantsPartenaire.find(data).then(alternantsFiltered => {
                        activitystats.nb_alternants = alternantsFiltered.length
                        activitystats.nb_contrats = Math.trunc(alternantsFiltered.reduce((total, next) => total + (next?.etat_contrat == 'Contrat signé' ? 1 : 0), 0))
                        activitystats.nb_chaumage = Math.trunc(alternantsFiltered.reduce((total, next) => total + (next?.etat_contrat == 'A la recherche' ? 1 : 0), 0))
                        res.send({ globalstats, activitystats })
                    })

                })
            })

        })

    })

})
app.get('/getPopulate/:id', (req, res) => {
    Prospect.findById(req.params.id).populate('user_id').then(data => {
        res.send(data)
    })
})

app.get('/docChecker/:input', (req, res) => {
    User.findOne({ email: req.params.input, type: "Prospect" }).then(data => {
        if (data)
            res.send({ data, type: "User" })
        else {
            Prospect.findOne({ documents_administrative: { $elemMatch: { custom_id: req.params.input } } }).then(doc => {
                res.send({ data: doc, type: "Prospect" })
            })
        }
    })
})

app.get('/getAllHistoriqueFromLeadID/:lead_id', (req, res) => {
    HistoriqueLead.find({ lead_id: req.params.lead_id }).sort({ date_creation: -1 }).populate('lead_id').populate('user_id').then(data => {
        res.send(data)
    })
})

//Mise à jour d'un groupe de prospect
app.put("/updateMany", (req, res, next) => {
    let listIds = req.body._id
    delete req.body._id
    console.log(listIds)
    Prospect.updateMany({ _id: { $in: listIds } },
        {
            ...req.body
        }, { new: true })
        .then(() => {
            Prospect.find({ _id: { $in: listIds } }).populate("user_id").populate('agent_id').then(prospects => {
                res.status(201).send(prospects)
            })

        })
        .catch((error) => { res.status(400).send(error.message); })
});

app.post('/deleteMany', (req, res) => {
    User.deleteMany({ _id: { $in: req.body.user_ids } }).then(u => {
        Prospect.deleteMany({ _id: { $in: req.body.listIds } }).then(p => {
            res.send({ p, u })
        })
    })
})

app.post('/sendMailAffectation', (req, res) => {
    let htmlemail = `
    <p>Bonjour,</p><br>
    <p>Nous avons le plaisir de vous informer que le lead ${req.body.prospect_name} vous a été attribué pour traitement. Cette attribution a eu lieu le ${req.body.date}.</p><br>

    <p>Nous vous demandons aimablement de prendre en charge ce lead et de faire le nécessaire pour le traiter. Votre expertise et votre engagement sont essentiels pour assurer la satisfaction de notre clientèle.</p>
    <p>Nous vous remercions de votre collaboration et de votre dévouement continu. Nous avons pleinement confiance en vos compétences pour mener à bien cette mission avec succès.</p><br>
    
    <p>Cordialement,</p>
    `
    let mailOptions = {
        from: 'ims@intedgroup.com',
        to: req.body.email,
        subject: '[IMS - International] - Attribution d\'un lead',
        html: htmlemail,
        attachments: [{
            filename: 'signature.png',
            path: 'assets/ims-intedgroup-logo.png',
            cid: 'red' //same cid value as in the html img src
        }]
    };


    transporterINTED.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        }
        res.send({ ...req.body })
    });
})

// TODO: Methode de modification d'un prospect alternable et de ses informations user


//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;
