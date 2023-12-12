const express = require("express");
const { User } = require("../models/user");
const app = express();
app.disable("x-powered-by");
const { Entreprise } = require("./../models/entreprise");
const { Tuteur } = require("./../models/Tuteur");
const { CAlternance } = require("./../models/contrat_alternance");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { application } = require("express");
const e = require("express");
const multer = require('multer');
const fs = require("fs")
var mime = require('mime-types')
const path = require('path');

let origin = ["http://localhost:4200"];
if (process.argv[2]) {
  let argProd = process.argv[2];
  if (argProd.includes("dev")) {
    origin = ["https://141.94.71.25", "https://dev-ims.intedgroup.com"];
  } else if (argProd.includes("qa")) {
    origin = ["https://152.228.219.55", "https://qa-ims.intedgroup.com"];
  } else if (argProd.includes("prod2")) {
    origin = ["https://51.68.215.184", "https://prod2-ims.intedgroup.com"];
  } else
    origin = [
      "https://ticket.estya.com",
      "https://estya.com",
      "https://adgeducations.com",
    ];
}
let transporterINTED = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // true for 587, false for other ports
  requireTLS: true,
  auth: {
    user: "ims@intedgroup.com",
    pass: "InTeDGROUP@@0908",
  },
});

//Recupère la liste des entreprises
app.get("/getAll", (req, res, next) => {
  Entreprise.find()
    .sort({ r_sociale: 1 })
    .populate("commercial_id").populate('created_by')
    .then((entreprisesFromDb) => {
      res.status(200).send(entreprisesFromDb);
    })
    .catch((error) => {
      res.status(500).json({
        error:
          "Impossible de recuperer la liste des entreprises " + error.message,
      });
    });
});

//creation d'une nouvelle entreprise
app.post("/create", (req, res, next) => {
  delete req.body._id;
  let entreprise = new Entreprise({
    ...req.body,
    date_creation: new Date()
  });

  //Création d'une nouvelle entreprise
  entreprise
    .save()
    .then((entrepriseSaved) => {
      res.status(201).send(entrepriseSaved);
    })
    .catch((error) => {
      res.status(400).json({
        error: "Impossible d'ajouter une nouvelle entreprise " + error.message,
      });
    });
});

//Création d'une nouvelle entreprise avec un représentant
app.post("/createEntrepriseRepresentant", (req, res, next) => {
  let entrepriseData = req.body.newEntreprise;
  let representantData = req.body.newRepresentant;

  delete entrepriseData._id;
  delete representantData._id;

  let entreprise = new Entreprise({
    ...entrepriseData,
    date_creation: new Date()
  });

  let representant = new User({
    ...representantData,
    date_creation: new Date()
  });

  // verification de la raison sociale de l'entreprise
  Entreprise.findOne({ r_sociale: entreprise.r_sociale })
    .then((enterpriseFromDB) => {
      if (enterpriseFromDB) {
        res.status(400).send("L'entreprise existe déjà");
      } else {
        User.findOne({ email_perso: representantData.email_perso })
          .then((userFromDb) => {
            /**
             *  Si l'utilisateur existe déjà on attribut son id au directeur_id de l'entreprise
             *  et un mail lui est envoyé pour lui dire qu'une nouvelle entreprise est ajouté en son nom pour son espace
             */
            if (userFromDb && userFromDb.email_perso != null && userFromDb.email_perso != '') {
              entreprise.directeur_id = userFromDb._id;
              entreprise
                .save()
                .then((entrepriseSaved) => {
                  // création du mail à envoyer
                  let Ceo_htmlmail =
                    "<p>Bonjour,</p><p>Une nouvelle entreprise vous à été attribué sur votre espace IMS, merci de consulter les contrats d'alternances, vous récevrez un mail à chaque ajout de contrat.</p>" +
                    " <p>Cordialement.</p>";

                  let Ceo_mailOptions = {
                    from: "ims@intedgroup.com",
                    to: userFromDb.email_perso,
                    subject: "Votre acces [IMS] ",
                    html: Ceo_htmlmail,
                    // attachments: [{
                    //     filename: 'Image1.png',
                    //     path: 'assets/Image1.png',
                    //     cid: 'Image1' //same cid value as in the html img src
                    // }]
                  };

                  // envoi du mail
                  transporterINTED.sendMail(
                    Ceo_mailOptions,
                    function (error, info) {
                      if (error) {
                        console.error(error);
                      }
                    }
                  );

                  res.status(201).send({ entreprise: entrepriseSaved, representant: userFromDb });
                })
                .catch((error) => {
                  console.error(error);
                  res
                    .status(400)
                    .send("Impossible de créer la nouvelle entreprise");
                });
            } else {
              /**
               * Si l'utilisateur saisie n'existe pas dans la base de données alors on le créer et un mail avec ses identifiants lui sont envoyés
               */
              //Création des accès pour les CEO
              if (representant.email_perso && representant.email_perso != null && representant.email_perso != '') {


                let Ceo_Pwd =
                  representant.firstname.substring(0, 3) +
                  "@" +
                  (Math.random() + 1).toString(16).substring(7).replace(" ", "");
                representant.password = bcrypt.hashSync(Ceo_Pwd, 8);

                representant
                  .save()
                  .then((userCreated) => {
                    entreprise.directeur_id = userCreated._id;
                    entreprise
                      .save()
                      .then((entrepriseSaved) => {
                        // création du mail à envoyer
                        let Ceo_htmlmail =
                          "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                          Ceo_Pwd +
                          "</strong></p>" +
                          '<p ><span style="color: rgb(36, 36, 36);font-weight: bolder;"> Vous pouvez vous connecter en cliquant sur ce lien:' +
                          '<a href=\"www.ims.intedgroup.com/#/login\">IMS</a></span></p>' +
                          '<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l\'adresse mail <a href="mailto:contact@intedgroup.com">contact@intedgroup.com</a></p>' +
                          "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                          " <p>Cordialement.</p>";

                        let Ceo_mailOptions = {
                          from: "ims@intedgroup.com",
                          to: userCreated.email_perso,
                          subject: "Votre acces [IMS] ",
                          html: Ceo_htmlmail,
                          // attachments: [{
                          //     filename: 'Image1.png',
                          //     path: 'assets/Image1.png',
                          //     cid: 'Image1' //same cid value as in the html img src
                          // }]
                        };

                        // envoi du mail
                        transporterINTED.sendMail(
                          Ceo_mailOptions,
                          function (error, info) {
                            if (error) {
                              console.error(error);
                            }
                          }
                        );

                        // envoi de la reponse du serveur
                        res.status(201).send({ entreprise: entrepriseSaved, representant: representant });
                      })
                      .catch((error) => {
                        console.error(error);
                        res
                          .status(400)
                          .send("Impossible de créer une nouvelle entreprise");
                      });
                  })
                  .catch((error) => {
                    console.error(error);
                    res
                      .status(400)
                      .send("Impossible de créer un nouvel utilisateur");
                  });
              } else {
                entreprise.directeur_id = null;
                entreprise
                  .save()
                  .then((entrepriseSaved) => {
                    // envoi de la reponse du serveur
                    res.status(201).send({ entreprise: entrepriseSaved, representant: null });
                  })
                  .catch((error) => {
                    console.error(error);
                    res
                      .status(400)
                      .send("Impossible de créer une nouvelle entreprise");
                  });
              }
            }
          })
          .catch((error) => {
            console.error(error)
            res
              .status(500)
              .send("Impossible de vérifier l'existence de l'utilisateur");
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send("Impossible de verifier l'existence de l'entreprise");
    });
});

//Modification d'une entreprise et de son representant
app.put("/updateEntrepriseRepresentant", (req, res) => {
  let entrepriseData = req.body.entrepriseToUpdate;
  let representantData = req.body.representantToUpdate;

  User.findOneAndUpdate(
    { _id: representantData._id },
    {
      ...representantData,
    }
  ).then((userSaved) => {
    Entreprise.findOneAndUpdate(
      { _id: entrepriseData._id },
      {
        ...entrepriseData,
      }
    )
      .then((entrepriseFromDb) => res.status(201).send(entrepriseFromDb))
      .catch((error) => {
        res.status(500).send("Impossible de mettre à jour l'entreprise");
      })
      .catch((error) => {
        res.status(500).send("Impossible de mettre à jour le representant");
      });
  });
});

app.post("/createNewContrat", (req, res, next) => {
  let CeoData = req.body.CEO;
  delete CeoData._id;
  let EntrepriseData = req.body.entreprise;
  delete EntrepriseData._id;
  let TuteurData = req.body.t1;
  delete TuteurData._id;
  let tuteurObject = req.body.TuteurObject;
  delete tuteurObject._id;
  let ContratData = req.body.contratAlternance;

  delete ContratData._id;

  let NewCeo = new User({ ...CeoData });
  let NewEntrepise = new Entreprise({ ...EntrepriseData });
  let NewTuteur = new User({ ...TuteurData });
  let NewContrat = new CAlternance({ ...ContratData });
  let NewtuteurObject = new Tuteur({ ...tuteurObject });

  NewContrat.alternant_id = ContratData.alternant_id;
  //Verification de l'existence du mail CEO dans la BD
  User.findOne({ email: CeoData.email })
    .then((CeoFromDb) => {
      if (CeoFromDb) {
        res.status(400).json({
          error:
            "Impossible de créer un nouvel utilisateur-- Email deja Utilisé ",
        });
      } else {
        //Creation d'un nouveau utilisateur CEO d'entreprise
        let Ceo_Pwd =
          NewCeo.firstname.substring(0, 3) +
          "@" +
          (Math.random() + 1).toString(16).substring(7).replace(" ", "");
        (NewCeo.password = bcrypt.hashSync(Ceo_Pwd, 8)),
          NewCeo.save()
            .then((CeoCreated) => {
              NewEntrepise.Directeur_id = CeoCreated._id;
              //Creation d'une nouvelle entreprise
              NewEntrepise.save()
                .then((EntrepCreated) => {
                  if (NewTuteur.email === CeoCreated.email) {
                    NewtuteurObject.entreprise_id = EntrepCreated._id;
                    NewtuteurObject.save()
                      .then((NewobjTuteur) => {
                        NewContrat.tuteur_id = NewobjTuteur._id;
                        //Creation d'un nouveau contrat alternance
                        NewContrat.save()
                          .then((NewContData) => {
                            // Initialisation et Envoi des accés par email pour le CEO et le tuteur

                            let Ceo_htmlmail =
                              "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                              Ceo_Pwd +
                              "</strong></p>" +
                              '<p ><span style="color: rgb(36, 36, 36);font-weight: bolder;"> Activer votre compte et valider votre email en cliquant sur' +
                              ' <a href="' +
                              origin[0] +
                              "/#/validation-email/" +
                              CeoCreated.email_perso +
                              "\">J'active mon compte IMS</a></span></p> " +
                              '<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l\'adresse mail <a href="mailto:contact@intedgroup.com">contact@intedgroup.com</a></p>' +
                              "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                              " <p>Cordialement.</p>";

                            let Ceo_mailOptions = {
                              from: "ims@intedgroup.com",
                              to: CeoCreated.email_perso,
                              subject: "Votre acces [IMS] ",
                              html: Ceo_htmlmail,
                              // attachments: [{
                              //     filename: 'Image1.png',
                              //     path: 'assets/Image1.png',
                              //     cid: 'Image1' //same cid value as in the html img src
                              // }]
                            };
                            transporterINTED.sendMail(
                              Ceo_mailOptions,
                              function (error, info) {
                                if (error) {
                                  console.error(error);
                                }
                              }
                            );

                            res
                              .status(200)
                              .send([NewContData, EntrepCreated, CeoCreated]);
                          })
                          .catch((errorCt) => {
                            res.status(400).json({
                              error:
                                "impossible de creer un nouveau Contrat" +
                                errorCt.message,
                            });
                          });
                      })
                      .catch((errorCt) => {
                        res.status(400).json({
                          error:
                            "impossible de creer un nouveau Contrat" +
                            errorCt.message,
                        });
                      });
                  } else {
                    NewtuteurObject.entreprise_id = EntrepCreated._id;
                    NewTuteur.entreprise = EntrepCreated._id;

                    //Cration d'un utilisateur Tuteur d'entreprise
                    let Tuteur_Pwd =
                      NewTuteur.firstname.substring(0, 3) +
                      "@" +
                      (Math.random() + 1)
                        .toString(16)
                        .substring(7)
                        .replace(" ", "");
                    (NewTuteur.password = bcrypt.hashSync(Tuteur_Pwd, 8)),
                      NewTuteur.save()
                        .then((NewTutData) => {
                          NewtuteurObject.user_id = NewTutData._id;

                          NewtuteurObject.save().then((NewobjTuteur) => {
                            NewContrat.tuteur_id = NewobjTuteur._id;
                            //Creation d'un nouveau contrat alternance
                            NewContrat.save()
                              .then((NewContData) => {
                                // Initialisation et Envoi des accés par email pour le CEO et le tuteur

                                let Ceo_htmlmail =
                                  "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                  Ceo_Pwd +
                                  "</strong></p>" +
                                  '<p ><span style="color: rgb(36, 36, 36);font-weight: bolder;"> Activer votre compte et valider votre email en cliquant sur' +
                                  ' <a href="' +
                                  origin[0] +
                                  "/#/validation-email/" +
                                  CeoCreated.email_perso +
                                  "\">J'active mon compte IMS</a></span></p> " +
                                  '<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l\'adresse mail <a href="mailto:contact@intedgroup.com">contact@intedgroup.com</a></p>' +
                                  "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                                  " <p>Cordialement.</p>";

                                let Ceo_mailOptions = {
                                  from: "ims@intedgroup.com",
                                  to: CeoCreated.email_perso,
                                  subject: "Votre acces [IMS] ",
                                  html: Ceo_htmlmail,
                                  // attachments: [{
                                  //     filename: 'Image1.png',
                                  //     path: 'assets/Image1.png',
                                  //     cid: 'Image1' //same cid value as in the html img src
                                  // }]
                                };
                                transporterINTED.sendMail(
                                  Ceo_mailOptions,
                                  function (error, info) {
                                    if (error) {
                                      console.error(error);
                                    }
                                  }
                                );

                                let Teuteur_HtmlMail =
                                  "<p>Bonjour,</p><p>Votre accés sur notre plateforme a été créé. Pour vous connecter, utilisez votre adresse mail et votre mot de passe : <strong> " +
                                  Tuteur_Pwd +
                                  "</strong></p>" +
                                  '<p ><span style="color: rgb(36, 36, 36);font-weight: bolder;"> Activer votre compte et valider votre email en cliquant sur' +
                                  ' <a href="' +
                                  origin[0] +
                                  "/#/validation-email/" +
                                  NewTutData.email_perso +
                                  "\">J'active mon compte IMS</a></span></p> " +
                                  '<p>Si vous avez des difficultés à vous connecter, vous pouvez nous contacter directement sur l\'adresse mail <a href="mailto:contact@intedgroup.com">contact@intedgroup.com</a></p>' +
                                  "<p> <br />Nous restons à votre disposition pour tout complément d'information. </p>" +
                                  " <p>Cordialement.</p>";

                                let Tuteur_mailOptions = {
                                  from: "ims@intedgroup.com",
                                  to: NewTutData.email_perso,
                                  subject: "Votre acces [IMS] ",
                                  html: Teuteur_HtmlMail,
                                  // attachments: [{
                                  //     filename: 'Image1.png',
                                  //     path: 'assets/Image1.png',
                                  //     cid: 'Image1' //same cid value as in the html img src
                                  // }]
                                };
                                transporterINTED.sendMail(
                                  Tuteur_mailOptions,
                                  function (error, info) {
                                    if (error) {
                                      console.error(error);
                                    }
                                  }
                                );

                                res
                                  .status(200)
                                  .send([
                                    NewContData,
                                    EntrepCreated,
                                    CeoCreated,
                                    NewTutData,
                                  ]);
                              })
                              .catch((errorCt) => {
                                res.status(400).json({
                                  error:
                                    "impossible de creer un nouveau Contrat" +
                                    errorCt.message,
                                });
                              });
                          });
                        })
                        .catch((errorT1) => {
                          res.status(400).json({
                            error:
                              "impossible de creer un nouveau tuteur" +
                              errorT1.message,
                          });
                        });
                  }
                })
                .catch((errorEN) => {
                  res.status(400).json({
                    error:
                      "Impossible de créer une nouvelle entreprise " +
                      errorEN.message,
                  });
                });
            })
            .catch((error) => {
              res.status(400).json({
                error:
                  "Impossible de créer un nouvel utilisateur " + error.message,
              });
            });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(501).json({ error });
    });
});

app.post("/createContratAlternance", (req, res, next) => {
  let ContratData = req.body;
  let argProd = process.argv[2];
  delete ContratData._id;
  let NewContrat = new CAlternance({
    ...ContratData,
  });
  NewContrat.directeur_id = null;
  CAlternance.findOne(NewContrat).then((r) => {
    if (r)
      res.status(500).send({ message: "Un contrat similaire existe déjà" });
    else
      Tuteur.findOne({ _id: NewContrat.tuteur_id })
        .then((tuteur) => {
          if (tuteur) {
            //création du contrat
            NewContrat.save()
              .then((NewContData) => {
                // recuperation de l'adresse mail du directeur de l'entreprise
                Entreprise.findOne({ _id: NewContData.entreprise_id })
                  .then((entreprise) => {
                    User.findOne({ _id: entreprise.directeur_id })
                      .then((user) => {
                        // création du mail à envoyer
                        res.status(200).send(NewContData);
                        let Ceo_htmlmail =
                          "<p>Bonjour,</p><p>Un nouveau contrat est disponible sur votre espace IMS, merci de verifier son contenu.</p><p>ims.intedgroup.com/#/login</p>";

                        let Ceo_mailOptions = {
                          from: "ims@intedgroup.com",
                          to: user.email_perso,
                          subject: "Nouveau contrat [IMS]",
                          html: Ceo_htmlmail,
                          // attachments: [{
                          //     filename: 'Image1.png',
                          //     path: 'assets/Image1.png',
                          //     cid: 'Image1' //same cid value as in the html img src
                          // }]
                        };

                        // envoi du mail
                        transporterINTED.sendMail(
                          Ceo_mailOptions,
                          function (error, info) {
                            if (error) {
                              console.error(error);
                            }
                          }
                        );
                      })
                      .catch((error) => {
                        console.error(error);
                        res.status(400).send(error);
                      });
                  })
                  .catch((error) => {
                    res.status(400).send(error);
                  });
              })
              .catch((error) => {
                res.status(400).json({
                  error:
                    "Impossible de créer un nouveau contrat " + error.message,
                });
              });
          } else {
            NewContrat.directeur_id = NewContrat.tuteur_id;
            NewContrat.tuteur_id = null;

            //création du contrat
            NewContrat.save()
              .then((NewContData) => {
                Entreprise.findOne({ _id: NewContData.entreprise_id })
                  .then((entreprise) => {
                    User.findOne({ _id: entreprise.directeur_id })
                      .then((user) => {
                        // création du mail à envoyer
                        let Ceo_htmlmail =
                          "<p>Bonjour,</p><p>Un nouveau contrat est disponible sur votre espace IMS, merci de verifier son contenu.</p><p>ims.intedgroup.com/#/login</p>";

                        let Ceo_mailOptions = {
                          from: "ims@intedgroup.com",
                          to: user.email_perso,
                          subject: "Nouveau contrat [IMS]",
                          html: Ceo_htmlmail,
                          // attachments: [{
                          //     filename: 'Image1.png',
                          //     path: 'assets/Image1.png',
                          //     cid: 'Image1' //same cid value as in the html img src
                          // }]
                        };

                        // envoi du mail
                        transporterINTED.sendMail(
                          Ceo_mailOptions,
                          function (error, info) {
                            if (error) {
                              console.error(error);
                            }
                          }
                        );
                        res.status(200).send(NewContData);
                      })
                      .catch((error) => {
                        console.error(error);
                        res.status(400).send(error);
                      });
                  })
                  .catch((error) => {
                    res.status(400).send(error);
                  });
              })
              .catch((error) => {
                res.status(400).json({
                  error:
                    "Impossible de créer un nouveau contrat " + error.message,
                });
              });
          }
        })
        .catch((error) => {
          res.status(500).send(error);
        });
  });

  // verification si le tuteur est un directeur
});

app.post("/updateContratAlternance", (req, res, next) => {
  let ContratData = new CAlternance({ ...req.body });

  // verification si le tuteur est un directeur
  Tuteur.findOne({ _id: ContratData.tuteur_id })
    .then((tuteur) => {
      if (tuteur) {
        ContratData.directeur_id = null;

        CAlternance.findByIdAndUpdate(
          ContratData._id,
          ContratData,
          { new: true },
          (err, value) => {
            if (err) {
              console.error(err);
              res.status(500).send(err);
            } else {
              res.status(201).send(value);
            }
          }
        );
      } else {
        ContratData.directeur_id = ContratData.tuteur_id;
        ContratData.tuteur_id = null;

        CAlternance.findByIdAndUpdate(
          ContratData._id,
          ContratData,
          { new: true },
          (err, value) => {
            if (err) {
              console.error(err);
              res.status(500).send(err);
            } else {
              res.status(201).send(value);
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// envoi du mail de création des entreprises
app.post("/send-creation-link", (req, res) => {
  let idCommercial = req.body.idCommercial;
  let email = req.body.email;

  // création du mail à envoyer
  let Ceo_htmlmail =
    "<p>Bonjour,</p><p>Voici le lien de création de votre entreprise sur notre espace IMS, merci de cliquer sur le lien suivant: ims.intedgroup.com/#/creer-mon-entreprise/" +
    idCommercial +
    "</p>";

  let Ceo_mailOptions = {
    from: "ims@intedgroup.com",
    to: email,
    subject: "Lien de création d'entreprise [IMS]",
    html: Ceo_htmlmail,
    // attachments: [{
    //     filename: 'Image1.png',
    //     path: 'assets/Image1.png',
    //     cid: 'Image1' //same cid value as in the html img src
    // }]
  };

  // envoi du mail
  transporterINTED.sendMail(Ceo_mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    }
  });

  res.status(200).json({ success: "Entreprise ajouté" });
});

app.get("/getAllContratsbyTuteur/:idTuteur", (req, res, next) => {
  CAlternance.find({ tuteur_id: req.params.idTuteur })
    .populate({ path: "alternant_id", populate: { path: "user_id" } })
    .populate({ path: "alternant_id", populate: { path: "classe_id" } })
    .populate({ path: "formation" })
    .populate({ path: "tuteur_id", populate: { path: "user_id" } })
    ?.populate("ecole")
    ?.populate("code_commercial")
    ?.populate("directeur_id")
    ?.populate("entreprise_id")
    ?.populate('add_by')
    ?.populate('historique_modification.user_id')
    .then((CAFromDb) => {
      res.status(200).send(CAFromDb);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Impossible de récupérer la liste des contrats " + error.message,
      });
    });
});

// recuperation de la liste des entreprises d'un CEO
app.get("/get-entreprises-by-id-ceo/:idCEO", (req, res, next) => {
  Entreprise.find({ directeur_id: req.params.idCEO })
    ?.populate("commercial_id")
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(400)
        .json({ error: "Impossible de récuperer la liste de vos entréprises" });
    });
});

app.get("/getAllContratsbyEntreprise/:entreprise_id", (req, res, next) => {
  CAlternance.find({ entreprise_id: req.params.entreprise_id })
    .populate({ path: "alternant_id", populate: { path: "user_id" } })
    .populate({ path: "alternant_id", populate: { path: "classe_id" } })
    .populate({ path: "formation" })
    .populate({ path: "tuteur_id", populate: { path: "user_id" } })
    ?.populate("ecole")
    ?.populate("code_commercial")
    ?.populate("directeur_id")
    ?.populate("entreprise_id")
    ?.populate('add_by')
    ?.populate('historique_modification.user_id')
    .then((CAFromDb) => {
      res.status(200).send(CAFromDb);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Impossible de recuperer la liste des contrats " + error.message,
      });
    });
});

app.get("/getAllContrats/", (req, res, next) => {
  CAlternance.find()
    .populate({ path: "alternant_id", populate: { path: "user_id" } })
    .populate({ path: "alternant_id", populate: { path: "classe_id" } })
    .populate({ path: "formation" })
    .populate({ path: "tuteur_id", populate: { path: "user_id" } })
    ?.populate("ecole")
    ?.populate("code_commercial")
    ?.populate("directeur_id")
    ?.populate("entreprise_id")
    ?.populate('add_by')
    ?.populate('historique_modification.user_id')
    .then((CAFromDb) => {
      res.status(200).send(CAFromDb);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Impossible de recuperer la liste des contrats " + error.message,
      });
    });
});

// recuperation de la liste des contrats d'un ceo
app.get("/contrats-by-ceo/:id", (req, res) => {
  CAlternance.find({ directeur_id: req.params.id })
    .populate({ path: "alternant_id", populate: { path: "user_id" } })
    .populate({ path: "alternant_id", populate: { path: "classe_id" } })
    .populate({ path: "formation" })
    .populate({ path: "tuteur_id", populate: { path: "user_id" } })
    ?.populate("ecole")
    ?.populate("code_commercial")
    ?.populate("directeur_id")
    ?.populate("entreprise_id")
    ?.populate('add_by')
    ?.populate('historique_modification.user_id')
    .then((response) => {
      res
        .status(200)
        .json({ success: "Liste des contrats récuperé", contrats: response });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({
        error: error,
        errorMsg: "Impossible de récuperer la liste des contrats",
      });
    });
});

//Recuperation d'une entreprise selon un id
app.get("/getById/:id", (req, res, next) => {
  Entreprise.findOne({ _id: req.params.id })
    .then((entrepriseFormDb) => {
      res.status(200).send(entrepriseFormDb);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Impossible de recuperer cette entreprise" });
    });
});

app.delete("/delete/:id", (req, res, next) => {
  Entreprise.findByIdAndRemove(req.params.id)
    .then((entrepriseFormDb) => {
      //Tuteur.remove({ entreprise_id: entrepriseFormDb._id })
      res.status(200).send(entrepriseFormDb);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Impossible de recuperer cette entreprise" });
    });
});

//Recuperation d'une entreprise selon un id en populate
app.get("/getByIdPopulate/:id", (req, res, next) => {
  Entreprise.findOne({ _id: req.params.id })
    ?.populate("directeur_id")
    .then((entrepriseFormDb) => {
      res.status(200).send(entrepriseFormDb);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Impossible de recuperer cette entreprise" });
    });
});

//recupération d'une liste d'entreprise selon id director
app.get("/getByDirecteurId/:id", (req, res, next) => {
  Entreprise.findOne({ directeur_id: req.params.id })
    .then((entrepriseFormDb) => {
      res.status(200).send(entrepriseFormDb);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Impossible de recuperer cette entreprise" });
    });
});

//récupération d'un contrat d'alternance en fonction de l'id étudiant
app.get("/getByEtudiantId/:id", (req, res, next) => {
  CAlternance.findOne({ alternant_id: req.params.id })
    .then((entrepriseFormDb) => {
      res.status(200).send(entrepriseFormDb);
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de recuperer ce contrat" });
    });
});
app.get("/getByEtudiantIdPopolate/:id", (req, res, next) => {
  CAlternance.findOne({ alternant_id: req.params.id })
    .populate({ path: "tuteur_id" })
    .then((ContratDetails) => {
      res.status(200).send(ContratDetails);
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de recuperer ce contrat" });
    });
});

// mise à jour du status d'un contrat
app.patch("/update-status", (req, res) => {
  const contract_id = req.body._id;
  const status = req.body.statut;
  const today = new Date();

  CAlternance.findOneAndUpdate(
    { _id: contract_id },
    { statut: status, last_status_change_date: today }
  )
    .then((response) => {
      // récupération du commercial référent
      User.findOne({ _id: response.code_commercial })
        .then((commercial) => {
          // création du mail à envoyer
          let htmlMail =
            '<p>Bonjour, le contrat numéro <span style="color: red">' +
            response._id +
            "</span> vient d'être modifié.</p>" +
            '<p>Nouveau statut du contrat: <span style="color: red">' +
            status +
            "</span>.</p>" +
            "<p>Pour retrouver le contrat veuillez saisir le numéro du contrat dans le filtre sur la page des contrats.</p>" +
            "<p>Cordialement.</p>";

          let mailOptions = {
            from: "ims@intedgroup.com",
            to: commercial.email,
            cc: "igal@intedgroup.com",
            subject: "Statut de contrat mis à jour [IMS]",
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

          // envoi de la réponse du serveur
          res.status(201).json({
            successMsg:
              "Status du contrat mis à jour, le commercial référent a été notifier par mail",
          });
        })
        .catch((error) => {
          res.status(400).send({
            errorMsg: "Impossible de notifier le commercial référent",
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        errorMsg:
          "Impossible de mettre à jour le status du contrat, veuillez contacter un administrateur!",
        error: error,
      });
    });
});

//Modification d'une entreprise
app.put("/update", (req, res, next) => {
  Entreprise.findOneAndUpdate(
    { _id: req.body._id },
    {
      ...req.body,
    }
  )
    .then((entrepriseUpdated) => {
      res.status(201).send(entrepriseUpdated);
    })
    .catch((error) => {
      res.status(400).send("Impossible de modifier cette entreprise");
    });
});

app.get("/nettoyageCA", (req, res) => {
  let toDelete = [];
  CAlternance.find().then((allCA) => {
    allCA.forEach((ca) => {
      if (!toDelete.includes(ca._id.toString())) {
        allCA.forEach((catocheck) => {
          if (
            catocheck._id.toString() != ca._id.toString() &&
            catocheck._id.toString() == "6407666cc8ef7f5cebf043d8" &&
            ca.alternant_id.toString() == catocheck.alternant_id.toString() &&
            ca.entreprise_id.toString() == catocheck.entreprise_id.toString() &&
            ca.fin_contrat.toString() == catocheck.fin_contrat.toString()
          )
            //console.log(ca.debut_contrat == catocheck.debut_contrat, ca.fin_contrat == catocheck.fin_contrat, ca.alternant_id == catocheck.alternant_id, ca.entreprise_id == catocheck.entreprise_id)
            if (
              ca.debut_contrat.toString() == catocheck.debut_contrat.toString() &&
              ca.fin_contrat.toString() == catocheck.fin_contrat.toString() &&
              ca.alternant_id.toString() == catocheck.alternant_id.toString() &&
              ca.entreprise_id.toString() == catocheck.entreprise_id.toString() &&
              ca.ecole.toString() == catocheck.ecole.toString() &&
              catocheck._id.toString() != ca._id.toString()
            )
              toDelete.push(catocheck._id.toString());
        });
      }
    });
    CAlternance.deleteMany({ _id: { $in: toDelete } }, (err) => {
      if (err) console.error(err);
    }).then((r) => {
      res.send(r);
    });
  });
});

// upload du cerfa pour le contrat d'alternance
const uploadCerfaStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const id = req.body.id;
    const destination = `storage/contrat/${id}`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    callBack(null, destination);
  },
  filename: (req, file, callBack) => {
    let filename = "cerfa";
    callBack(null, `${filename}.${file.mimetype.split("/")[1]}`);
  },
});

const uploadCerfa = multer({ storage: uploadCerfaStorage });

app.post("/upload-cerfa", uploadCerfa.single("file"), (req, res) => {
  const file = req.file;
  const id = req.body.id;

  if (!file) {
    res.status(400).send("Aucun fichier sélectionnée");
  } else {
    CAlternance.findOneAndUpdate({ _id: id }, { cerfa: "cerfa.pdf" })
      .then((response) => {
        res
          .status(201)
          .json({ successMsg: "Cerfa téléversé, contrat mis à jour" });
      })
      .catch((error) => {
        res.status(400).send("Impossible de mettre à jour le contrat");
      });
  }
});

// upload de la convention pour le contrat d'alternance
const uploadConventionStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const id = req.body.id;
    const destination = `storage/contrat/${id}`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    callBack(null, destination);
  },
  filename: (req, file, callBack) => {
    let filename = "convention";
    callBack(null, `${filename}.${file.mimetype.split("/")[1]}`);
  },
});

const uploadConvention = multer({ storage: uploadConventionStorage });

app.post("/upload-convention", uploadConvention.single("file"), (req, res) => {
  const file = req.file;
  const id = req.body.id;

  if (!file) {
    res.status(400).send("Aucun fichier sélectionnée");
  } else {
    CAlternance.findOneAndUpdate(
      { _id: id },
      { convention_formation: "convention.pdf" }
    )
      .then((response) => {
        res
          .status(201)
          .json({ successMsg: "Convention téléversé, contrat mis à jour" });
      })
      .catch((error) => {
        res.status(400).send("Impossible de mettre à jour le contrat");
      });
  }
});

// upload de l'accord de prise en charge' de contrat pour le contrat d'alternance
const uploadAccordStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const id = req.body.id;
    const destination = `storage/contrat/${id}`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    callBack(null, destination);
  },
  filename: (req, file, callBack) => {
    let filename = "accord_prise_charge";
    callBack(null, `${filename}.${file.mimetype.split("/")[1]}`);
  },
});

const uploadAccord = multer({ storage: uploadAccordStorage });

app.post(
  "/upload-accord-prise-en-charge",
  uploadAccord.single("file"),
  (req, res) => {
    const file = req.file;
    const id = req.body.id;

    if (!file) {
      res.status(400).send("Aucun fichier sélectionnée");
    } else {
      CAlternance.findOneAndUpdate(
        { _id: id },
        { accord_prise_charge: "accord_prise_charge.pdf" }
      )
        .then((response) => {
          res
            .status(201)
            .json({ successMsg: "Accord téléversé, contrat mis à jour" });
        })
        .catch((error) => {
          res.status(400).send("Impossible de mettre à jour le contrat");
        });
    }
  }
);

// upload de la rupture de contrat pour le contrat d'alternance
const uploadResiliationStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const id = req.body.id;
    const destination = `storage/contrat/${id}`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    callBack(null, destination);
  },
  filename: (req, file, callBack) => {
    let filename = "resiliation";
    callBack(null, `${filename}.${file.mimetype.split("/")[1]}`);
  },
});

const uploadResiliation = multer({ storage: uploadResiliationStorage });

app.post(
  "/upload-resiliation",
  uploadResiliation.single("file"),
  (req, res) => {
    const file = req.file;
    const id = req.body.id;

    if (!file) {
      res.status(400).send("Aucun fichier sélectionnée");
    } else {
      CAlternance.findOneAndUpdate(
        { _id: id },
        { resiliation_contrat: "resiliation.pdf" }
      )
        .then((response) => {
          res
            .status(201)
            .json({ successMsg: "Convention téléversé, contrat mis à jour" });
        })
        .catch((error) => {
          res.status(400).send("Impossible de mettre à jour le contrat");
        });
    }
  }
);

// upload du document de relance de contrat pour le contrat d'alternance
const uploadRelanceStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const id = req.body.id;
    const destination = `storage/contrat/${id}`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    callBack(null, destination);
  },
  filename: (req, file, callBack) => {
    let filename = "relance";
    callBack(null, `${filename}.${file.mimetype.split("/")[1]}`);
  },
});

const uploadRelance = multer({ storage: uploadRelanceStorage });

app.post("/upload-relance", uploadRelance.single("file"), (req, res) => {
  const file = req.file;
  const id = req.body.id;

  if (!file) {
    res.status(400).send("Aucun fichier sélectionnée");
  } else {
    CAlternance.findOneAndUpdate({ _id: id }, { relance: "relance.pdf" })
      .then((response) => {
        res.status(201).json({
          successMsg: "Document de relance téléversé, contrat mis à jour",
        });
      })
      .catch((error) => {
        res.status(400).send("Impossible de mettre à jour le contrat");
      });
  }
});

// upload du livret d'apprentissage pour le contrat d'alternance
const uploadLivretStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const id = req.body.id;
    const destination = `storage/contrat/${id}`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    callBack(null, destination);
  },
  filename: (req, file, callBack) => {
    let filename = "livret_apprentissage";
    const fileSplited = file.originalname.split(".");
    const filetype = fileSplited[fileSplited.length - 1];

    callBack(null, `${filename}.${filetype}`);
  },
});

const uploadLivret = multer({ storage: uploadLivretStorage });

app.post("/upload-livret", uploadLivret.single("file"), (req, res) => {
  const file = req.file;
  const id = req.body.id;

  if (!file) {
    res.status(400).send("Aucun fichier sélectionnée");
  } else {
    const fileSplited = file.originalname.split(".");
    const filetype = fileSplited[fileSplited.length - 1];
    CAlternance.findOneAndUpdate(
      { _id: id },
      { livret_apprentissage: `livret_apprentissage.${filetype}` }
    )
      .then((response) => {
        res.status(201).json({
          successMsg: "Livret d'apprentissage téléversé, contrat mis à jour",
        });
      })
      .catch((error) => {
        res.status(400).send("Impossible de mettre à jour le contrat");
      });
  }
});

// méthode de téléchargement du cerfa pour un contrats d'alternance
app.get("/download-cerfa/:idContrat", (req, res) => {
  res.download(
    `./storage/contrat/${req.params.idContrat}/cerfa.pdf`,
    function (err) {
      if (err) {
        res.status(400).send(err);
      }
    }
  );
});

// méthode de téléchargement de la convention pour un contrat d'alternance
app.get("/download-convention/:idContrat", (req, res) => {
  res.download(
    `./storage/contrat/${req.params.idContrat}/convention.pdf`,
    function (err) {
      if (err) {
        res.status(400).send(err);
      }
    }
  );
});

// méthode de téléchargement de l'accord de prise en charge pour un contrat d'alternance
app.get("/download-accord/:idContrat", (req, res) => {
  res.download(
    `./storage/contrat/${req.params.idContrat}/accord_prise_charge.pdf`,
    function (err) {
      if (err) {
        res.status(400).send(err);
      }
    }
  );
});

// méthode de téléchargement du document de resiliation pour un contrat d'alternance
app.get("/download-resiliation/:idContrat", (req, res) => {
  res.download(
    `./storage/contrat/${req.params.idContrat}/resiliation.pdf`,
    function (err) {
      if (err) {
        res.status(400).send(err);
      }
    }
  );
});

// méthode de téléchargement du document de relance pour un contrat d'alternance
app.get("/download-relance/:idContrat", (req, res) => {
  res.download(
    `./storage/contrat/${req.params.idContrat}/relance.pdf`,
    function (err) {
      if (err) {
        res.status(400).send(err);
      }
    }
  );
});

// méthode de téléchargement du livret d'apprentissage pour un contrat d'alternance
app.get("/download-livret/:idContrat", (req, res) => {
  CAlternance.findOne({ _id: req.params.idContrat })
    .then((response) => {
      res.download(
        `./storage/contrat/${req.params.idContrat}/${response.livret_apprentissage}`,
        function (err) {
          if (err) {
            res.status(400).send(err);
          }
        }
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// méthode d'ajout ou de modification d'une remarque sur un contrat d'alternance
app.patch("/patch-remarque", (req, res) => {
  const idContrat = req.body.idContrat;
  const remarque = req.body.remarque;

  CAlternance.updateOne({ _id: idContrat }, { remarque: remarque })
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});


//Sauvegarde de la photo de profile
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    let id_photo = req.body.id;
    if (!fs.existsSync("storage/entreprise/logo/" + id_photo + "/")) {
      fs.mkdirSync("storage/entreprise/logo/" + id_photo + "/", { recursive: true });
    }
    callBack(null, "storage/entreprise/logo/" + id_photo + "/");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } });
//Sauvegarde de la photo de profile
app.post("/uploadLogo", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  Entreprise.findByIdAndUpdate(req.body.id, { logoFile: file.originalname }, { new: true }, (err, doc) => {
    if (err) {
      console.error(err)
      res.status(500).send(err)
    } else
      res.status(201).send(doc)
  })

});

//Envoie de la photo de profile
app.get("/getLogo/:id", (req, res) => {
  Entreprise.findById(req.params.id, (err, entreprise) => {
    if (entreprise && entreprise.logoFile) {
      let pathFile = "storage/entreprise/logo/" + req.params.id + "/" + entreprise.logoFile
      try {
        let file = fs.readFileSync(
          pathFile,
          { encoding: "base64" },
          (err2) => {
            if (err2) {
              return console.error(err2);
            }
          }
        );
        res.send({ file: file, documentType: mime.contentType(path.extname(pathFile)) });
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      res.status(404).send({ error: "Image non défini" });
    }
  });


});

app.get('/getAllLogo', (req, res) => {
  let ids = []
  try {
    ids = fs.readdirSync("storage/entreprise/logo")
    let fileDic = {}
    ids.forEach(id => {
      let filenames = fs.readdirSync("storage/entreprise/logo/" + id)
      if (filenames) {
        try {
          fileDic[id] = {
            file: fs.readFileSync("storage/entreprise/logo/" + id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
              if (err) return console.error(err);
            }),
            extension: mime.contentType(path.extname("storage/entreprise/logo/" + id + "/" + filenames[0])),
            url: ""
          }
        } catch {
          console.error("storage/entreprise/logo/" + id + "/" + filenames[0] + " introuvable")
        }
      }
    })
    res.status(200).send({ files: fileDic, ids })
  } catch {
    res.status(404).send('Dossier storage/entreprise/logo introuvable')
  }

})


//export du module app pour l'utiliser dans les autres parties de l'application
module.exports = app;
