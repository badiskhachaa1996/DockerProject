const express = require("express");
const app = express();
app.disable("x-powered-by");
const { User } = require("./../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const multer = require("multer");
var mime = require('mime-types')
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Formateur } = require("../models/formateur");
const { Etudiant } = require("../models/etudiant");
const { pwdToken } = require("../models/pwdToken");
const { Partenaire } = require("../models/partenaire");
const { Prospect } = require("../models/prospect");
const { Service } = require("../models/service");
const { CommercialPartenaire } = require("../models/CommercialPartenaire");
const { CvType } = require("../models/CvType");
const { Competence } = require("../models/Competence");
const { Profile } = require("../models/Profile");


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
      "https://ims.estya.com",
      "https://ticket.estya.com",
      "https://estya.com",
      "https://adgeducations.com",
      "https://eduhorizons.com",
      "https://espic.com",
      "http://partenaire.eduhorizons.com",
      "http://login.eduhorizons.com",
    ];
}
let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // true for 587, false for other ports
  requireTLS: true,
  auth: {
    user: "ims@intedgroup.com",
    pass: "InTeDGROUP@@0908",
  },
});

//Enregsitrement d'un nouvel user
app.post("/registre", (req, res) => {
  let data = req.body;
  User.findOne({ email: data?.email, role: "user" }, (errFO, user) => {
    if (errFO) {
      console.error(errFO);
    }
    if (user) {
      User.findOneAndUpdate(
        { _id: user._id },
        {
          civilite: data.civilite,
          firstname: data.firstname,
          lastname: data.lastname,
          indicatif: data.indicatif,
          phone: data.phone,
          role: data.role,
          service_id: data?.service_id || null,
          type: data.type,
          mention: data.mention,
          entreprise: data.entreprise,
          pays_adresse: data.pays_adresse,
          ville_adresse: data.ville_adresse,
          rue_adresse: data.rue_adresse,
          numero_adresse: data.numero_adresse,
          postal_adresse: data.postal_adresse,
        },
        { new: true },
        (err, userModified) => {
          if (err) {
            console.error(err);
          } else {
            res.send(userModified);
          }
        }
      );
    } else {
      let newUser = new User({
        civilite: data.civilite,
        firstname: data.firstname,
        lastname: data.lastname,
        indicatif: data.indicatif,
        phone: data.phone,
        email: data?.email,
        email_perso: data?.email,
        /*password: bcrypt.hashSync(data.password, 8),*/
        role: data.role || "user",
        service_id: data?.service_id || null,
        type: data.type,
        mention: data.mention,
        entreprise: data.entreprise,
        pays_adresse: data.pays_adresse,
        ville_adresse: data.ville_adresse,
        rue_adresse: data.rue_adresse,
        numero_adresse: data.numero_adresse,
        postal_adresse: data.postal_adresse,
        date_creation: new Date(),
      });
      newUser
        .save()
        .then((userFromDb) => {
          res.status(200).send(userFromDb);
          let gender = userFromDb.civilite == "Monsieur" ? "M. " : "Mme ";
          let htmlmail =
            "<p>Bonjour " +
            gender +
            userFromDb.lastname +
            " " +
            userFromDb.firstname +
            ', </p><p style="color:black"> <span style="color:orange">Felicitations ! </span> Votre compte IMS a été crée avec succés.</p><p style="color:black">Cordialement.</p><footer> <img  src="red"/></footer>';
          let mailOptions = {
            from: "ims@intedgroup.com",
            to: data.email,
            subject: "[IMS] - Création de compte",
            html: htmlmail,
            attachments: [
              {
                filename: "signature.png",
                path: "assets/ims-intedgroup-logo.png",
                cid: "red", //same cid value as in the html img src
              },
            ],
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.error(error);
            }
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(400).send(error);
        });
    }
  });
});

//Connexion d'un user
app.post("/login", (req, res) => {
  let data = req.body;
  User.findOne({
    email_perso: data.email,
  })
    .then((userFromDb) => {
      if (
        !userFromDb ||
        !bcrypt.compareSync(data.password, userFromDb.password)
      ) {
        res.status(404).send({ message: "Email ou Mot de passe incorrect" });
      } else {
        /*if (userFromDb.verifedEmail) {

        } else {
          res.status(304).send({ message: "Compte pas activé", data });
        }*/

        let token = jwt.sign(
          {
            id: userFromDb._id,
            role: userFromDb.role,
            service_id: userFromDb.service_id,
            type: userFromDb.type,
          },
          "126c43168ab170ee503b686cd857032d",
          { expiresIn: "7d" }
        );
        res.status(200).send({ token });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send(error);
    });
});

//Récupération d'un user via ID
app.get("/getById/:id", (req, res) => {
  let id = req.params.id;
  User.findOne({ _id: id })
    .then((userFromDb) => {
      let userToken = jwt.sign(
        { userFromDb, id: id },
        "126c43168ab170ee503b686cd857032d",
        { expiresIn: "7d" }
      );
      res.status(200).send({ userToken });
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send(error);
    });
});

//Recuperation des infos user
app.get("/getInfoById/:id", (req, res, next) => {
  User.findOne({ _id: req.params.id }).populate("savedProject")
    .then((userfromDb) => {
      res.status(200).send(userfromDb);
    })
    .catch((error) => {
      res
        .status(500)
        .send("Impossible de recuperer ce utilisateur: " + error.message);
    });
});

//Recuperation des infos user
app.get("/getPopulate/:id", (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .populate("service_id").populate('savedTicket').populate("savedAnnonces").populate("savedProject").populate("savedLeadCRM").populate('service_list').populate("roles_ticketing_list.module").populate({ path: "savedAdministration", populate: { path: 'user_id' } }).populate({ path: "savedAdministration", populate: { path: 'evaluations.evaluation_id' } }).populate({ path: "savedAdministration", populate: { path: 'decision.membre' } }).populate({ path: "savedMatching", populate: { path: 'user_id' } }).populate({ path: "savedMatching", populate: { path: 'competences', populate: { path: "profile_id" } } })
    ?.then((userfromDb) => {
      res.status(200).send(userfromDb);
    })
    .catch((error) => {
      res
        .status(500)
        .send("Impossible de recuperer ce utilisateur: " + error.message);
    });
});

app.get("/nstuget/:id", (req, res, next) => {

  User.findById(req.params.id)
    ?.then((userfromDb) => {
      CvType.find({ user_id: req.params.id }).populate('winner_id').then(w => {

        let my_cv = w[0]
        let fileOne
        let cv_id = my_cv?._id
        if (cv_id !== undefined) {
          try {
            let filenames = fs.readdirSync("storage/cvPicture/" + cv_id)
            if (filenames)
              fileOne = {
                file: fs.readFileSync("storage/cvPicture/" + cv_id + "/" + filenames[0], { encoding: 'base64' }, (err) => {
                  if (err) return console.error(err);
                }),
                extension: mime.contentType(path.extname("storage/cvPicture/" + cv_id + "/" + filenames[0])),
                url: ""
              }
          } catch (error) {
            fileOne = { file: "", extension: "" }
          }

          Competence.find({ _id: my_cv.competences[0] }).then(competence => {
            if (competence.length != 0)
              Profile.find({ _id: competence[0].profile_id }).then(profile => {
                res.status(200).send({
                  lastname: userfromDb.lastname, firstname: userfromDb.firstname, civilite: userfromDb.civilite, cv_id: cv_id,
                  email: userfromDb.email, profilePic: fileOne, profile: profile[0].libelle, email_perso: userfromDb.email_perso, winner_email: w?.email, winner_lastname: w?.lastname, winner_firstname: w?.firstname, winner_id: w?._id
                });
              })
            else
              res.status(200).send({
                lastname: userfromDb.lastname, firstname: userfromDb.firstname, civilite: userfromDb.civilite, cv_id: cv_id,
                email: userfromDb.email, profilePic: fileOne, email_perso: userfromDb.email_perso, winner_email: w?.email, winner_lastname: w?.lastname, winner_firstname: w?.firstname, winner_id: w?._id
              });
          })
        }

        // add then to get the profile and add a then for the

      })
    })
    .catch((error) => {
      res
        .status(500)
        .send("Impossible de recuperer ce utilisateur: " + error.message);
    });
});

app.get('/getAllAgentByService/:service_id', (req, res) => {
  User.find({ service_list: { $in: req.params.service_id } }).then(r => {
    res.send(r)
  })
})

//Recuperation de la liste des users pour la cv theque
app.get("/get-all-for-cv", (_, res) => {
  User.find({
    $or: [
      { type: "Etudiant" },
      { type: "Initial" },
      { type: "Prospect" },
      { type: "Alternant" },
      { type: "Formateur" },
      { type: "Externe" },
      { type: "Externe-InProgress" },
    ],
    lastname: { $ne: null },
    firstname: { $ne: null },
  })
    .then((usersFromDb) => {
      res.status(200).send(usersFromDb);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

//Recuperation de la liste des users pour la partie project
app.get("/get-all-salarie", (_, res) => {
  User.find({
    $or: [
      { type: "Salarié" },
      { role: "Admin" },
      { role: "Agent" },
      { role: "Responsable" },
    ],
  })
    .then((usersFromDb) => {
      res.status(200).send(usersFromDb);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

//Recuperation de la liste des users populate sur les services
app.get("/getAllPopulate", (_, res) => {
  User.find()
    .populate("service_id")
    ?.then((usersFromDb) => {
      res.status(200).send(usersFromDb);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

//Récupération de tous les users
app.get("/getAll", (req, res) => {
  User.find()
    .then((result) => {
      res.send(result.length > 0 ? result : []);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

//Récupération de tous les users
app.get("/getNBUser", (req, res) => {
  User.find()
    .then((result) => {
      res.send({ r: result.length });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

//Mise à jour d'un user
app.post("/updateById/:id", (req, res) => {
  let user = { ...req.body.user };
  if (user.password_clear) {
    user["password"] = bcrypt.hashSync(user.password_clear, 8);
  }
  delete user._id
  User.findByIdAndUpdate(req.params.id, user,
    { new: true },
    (err, user) => {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.send(user);
      }
    }
  );
});

//Mise à jour des infos users, utilisé depuis la page de gestion des utilisateurs
app.patch("/patchById", (req, res) => {
  const user = new User({ ...req.body });

  User.updateOne({ _id: user._id }, { ...req.body })
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((error) => {
      res.status(400).json({ msg: error.message });
    });
});

//Mise à jour d'un user
app.post("/updateByIdForPrivate/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      firstname: req.body.user.firstname,
      lastname: req.body.user.lastname,
      email: req.body.user.email,
      email_perso: req.body.user.email_perso,
    },
    { new: true },
    (err, user) => {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.send(user);
      }
    }
  );
});

app.post("/ValidateEmail/:email", (req, res) => {
  User.findOneAndUpdate(
    { email: req.params.email },
    {
      verifedEmail: true,
    },
    { new: true },
    (err, user) => {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        res.status(200).send(user);
      }
    }
  );
});

//Mise à jour d'un user
app.post("/updatePreInscrit/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      civilite: req.body.user.civilite,
      firstname: req.body.user.firstname,
      lastname: req.body.user.lastname,
      indicatif: req.body.user.indicatif,
      phone: req.body.user,
      role: req.body.user.role,
      service_id: req.body?.user.service_id,
      entreprise: req.body.user.entreprise,
      type: req.body.user.type,
      pays_adresse: req.body.user.pays_adresse,
      ville_adresse: req.body.user.ville_adresse,
      rue_adresse: req.body.user.rue_adresse,
      numero_adresse: req.body.user.numero_adresse,
      postal_adresse: req.body.user.postal_adresse,
    },
    { new: true },
    (err, user) => {
      if (err) {
        console.error(err);
        res.send(err);
      } else {
        Inscription.findById(user._id, (err2, inscription) => {
          if (inscription) {
            //findOneAndUpdate
            Inscription.findOneAndUpdate(
              { user_id: user._id },
              {
                classe: req.body.inscription.classe,
                statut: req.body.inscription.statut,
                diplome: req.body.inscription.diplome,
                nationalite: req.body.inscription.nationalite,
                date_naissance: req.body.inscription.date_naissance,
              },
              (err3, InscriptionUpdate) => {
                if (errInscription) {
                  console.error(errInscription);
                  res.send(errInscription);
                } else {
                  res.send(InscriptionUpdate);
                }
              }
            );
          } else {
            //new Inscription()
            let inscrit = new Inscription({
              user_id: user._id,
              classe: req.body.inscription.classe,
              statut: req.body.inscription.statut,
              diplome: req.body.inscription.diplome,
              nationalite: req.body.inscription.nationalite,
              date_naissance: req.body.inscription.date_naissance,
            });

            inscrit
              .save()
              .then(() => res.status(200).send(user))
              .catch((errSave) => res.status(400).send(errSave));
          }
        });
      }
    }
  );
});

//Mise à jour d'un étudiant
app.post("/updateEtudiant/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      civilite: req.body.user.civilite,
      firstname: req.body.user.firstname,
      lastname: req.body.user.lastname,
      indicatif: req.body.user.indicatif,
      phone: req.body.user.phone,
      role: req.body.user.role,
      service_id: req.body?.user.service_id,
      entreprise: req.body.user.entreprise,
      isAlternant: req.body.user.type,
      pays_adresse: req.body.user.pays_adresse,
      ville_adresse: req.body.user.ville_adresse,
      rue_adresse: req.body.user.rue_adresse,
      numero_adresse: req.body.user.numero_adresse,
      postal_adresse: req.body.user.postal_adresse,
      statut: req.body.user.statut,
      type: req.body.user.type,
      // diplome : req.body.user.diplome
    },
    { new: true },
    (err, user) => {
      if (err || !user) {
        console.error(err);
        res.send(err);
      } else {
        let etudiantData = req.body.newEtudiant;
        if (etudiantData._id) {
          Etudiant.findByIdAndUpdate(
            etudiantData._id,
            {
              ...etudiantData,
            },
            { new: true },
            (err, doc) => {
              if (!err && doc) {
                res.status(201).json(doc);
              } else {
                res.status(500).json(err);
              }
            }
          );
        } else {
          delete etudiantData._id;
          let etudiant = new Etudiant({
            ...etudiantData,
          });
          etudiant
            .save()
            .then((etudiantCreated) => {
              res.status(201).json({ success: "Etudiant crée" });
            })
            .catch((error) => {
              res.status(500).send(error);
            });
        }
      }
    }
  );
});

//Récupérer tous les users via Service ID
app.get("/getAllbyService/:id", (req, res) => {
  User.find({ service_id: req.params.id })
    .then((result) => {
      res.send(result.length > 0 ? result : []);
    })
    .catch((err) => {

      console.error(err);
      res.status(404).send(err);
    });
});
app.get("/getAllCommercial/", (req, res) => {
  User.find({ type: "Commercial" })
    .then((result) => {
      res.send(result.length > 0 ? result : []);
    })
    .catch((err) => {

      console.error(err);
      res.status(404).send(err);
    });
});

app.get("/getAllbyEmailPerso/:id", (req, res) => {
  let emailperso = req.params.id;
  User.findOne({ email_perso: emailperso })
    .then((userFromDb) => {
      let userToken = jwt.sign(
        { userFromDb },
        "126c43168ab170ee503b686cd857032d",
        { expiresIn: "7d" }
      );
      res.status(200).send(userToken);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);

    });
});
app.get("/getByEmail/:email", (req, res) => {
  User.findOne({ email_perso: req.params.email })
    .then((dataInscription) => {
      if (dataInscription) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    })
    .catch((err) => {
      res.status(404).send(err);
      console.error(err);
    });
});

//Récupérer tous les non-users
app.get("/getAllAgent/", (req, res) => {
  User.find({ role: ["Responsable", "Agent", "Admin"] })

    .then((result) => {
      res.send(result.length > 0 ? result : []);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);
    });
});

app.get("/getAllAgentPopulate", (req, res) => {
  User.find({ $or: [{ role: ["Responsable", "Agent", "Admin"] }, { type: ['Collaborateur', 'Responsable', null, 'Formateur'], haveNewAccess: true }, { type_supp: { $in: ['Collaborateur', 'Responsable'] } }] }).populate('service_id').populate('roles_ticketing_list.module').populate('service_list')

    .then((result) => {
      res.send(result.length > 0 ? result : []);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send(err);

    });
});


//Mise à jour du mot de passe
app.post("/updatePassword/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    let comparer = bcrypt.compareSync(req.body.actualpassword, user.password);
    if (comparer) {
      User.findOneAndUpdate(
        { _id: req.params.id },
        {
          password: bcrypt.hashSync(req.body.password, 8),
        },
        { new: true },
        (errfind, userUpdated) => {
          if (errfind) {
            console.error(errfind);
            res.send(errfind);
          } else {
            res.send(userUpdated);
          }
        }
      );
    } else {
      res.send({ error: "Pas le bon mot de passe actuel" });
    }
  });
});

//Sauvegarde de la photo de profile
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    let id_photo = req.body.id;
    if (!fs.existsSync("storage/profile/" + id_photo + "/")) {
      fs.mkdirSync("storage/profile/" + id_photo + "/", { recursive: true });
    }
    callBack(null, "storage/profile/" + id_photo + "/");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } });
app.get("/deletePDP/:user_id", (req, res, next) => {
  User.findByIdAndUpdate(req.params.user_id, { pathImageProfil: null, typeImageProfil: null }).then(old_user => {
    try {
      fs.unlinkSync(
        "storage/profile/" + req.params.user_id + "/" + old_user.pathImageProfil
      );
    } catch {

    }
    res.send(old_user)
  })
})
//Sauvegarde de la photo de profile
app.post("/file", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }
  User.findById(req.body.id, (err, photo) => {
    try {
      if (
        fs.existsSync(
          "storage/profile/" + req.body.id + "/" + photo.pathImageProfil
        )
      )
        fs.unlinkSync(
          "storage/profile/" + req.body.id + "/" + photo.pathImageProfil
        );
      //file removed
    } catch (err2) {
      console.error("Un fichier n'existait pas avant");
      console.error(err2, photo);
    }
  });

  User.findOneAndUpdate(
    { _id: req.body.id },
    {
      pathImageProfil: file.filename,
      typeImageProfil: file.mimetype,
    },
    (errUser, user) => {
      console.error(errUser);
      //Renvoie de la photo de profile au Front pour pouvoir l'afficher
      res.send({ message: "Photo mise à jour" });
    }
  );
});

//Envoie de la photo de profile
app.get("/getProfilePicture/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (user && user.pathImageProfil) {
      try {
        let file = fs.readFileSync(
          "storage/profile/" + req.params.id + "/" + user.pathImageProfil,
          { encoding: "base64" },
          (err2) => {
            if (err2) {
              return console.error(err2);
            }
          }
        );
        res.send({ file: file, documentType: user.typeImageProfil });
      } catch (e) {
        res.send({ error: e });
      }
    } else {
      res.send({ error: "Image non défini" });
    }
  });

});

//Methode pour envoyer la photo de profil d'un utilisateur methode Idrissa Sall
app.get("/loadProfilePicture/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user.pathImageProfil) {
        let imgPath = path.join(
          "storage",
          "profile",
          user._id.toString(),
          user.pathImageProfil.toString()
        );
        let imgExtention = user.pathImageProfil
          .toString()
          .slice(user.pathImageProfil.toString().lastIndexOf(".") - 1 + 2);

        try {
          let img = fs.readFileSync(
            imgPath,
            { encoding: "base64" },
            (error) => {
              if (error) {
                res.status(400).json({ error: error });
              }
            }
          );
          res.status(200).json({ image: img, imgExtension: imgExtention });
        } catch (e) {
          res.status(200).json({ error: e });
        }
      } else {
        res.status(200).json({ error: "Image non definis" });
      }
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

app.post("/AuthMicrosoft", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      let token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          service_id: user.service_id,
          type: user.type,
        },
        "126c43168ab170ee503b686cd857032d",
        { expiresIn: "7d" }
      );
      if (!user.civilite) {
        res
          .status(200)
          .send({ token, message: "Nouveau compte crée via Ticket" });
      } else {
        res.status(200).send({ token });
      }
    } else {
      let lastname = req.body.name.substring(req.body.name.indexOf(" ") + 1); //Morgan HUE
      let firstname = req.body.name.replace(" " + lastname, "");
      let newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: req.body.email,
        role: 'Etudiant',
        type: 'Externe-InProgress',
        service_id: null,
        haveNewAccess: true
      });
      newUser.save().then(
        (userFromDb) => {
          let token = jwt.sign(
            {
              id: userFromDb._id,
              role: userFromDb.role,
              service_id: userFromDb.service_id,
            },
            "126c43168ab170ee503b686cd857032d",
            { expiresIn: "7d" }
          );
          res.status(200).send({ token, message: "Nouveau compte crée" });
        },
        (err2) => {
          console.error(err2);
        }
      );
    }
  });
});

app.get("/WhatTheRole/:id", (req, res) => {
  let id = new mongoose.mongo.ObjectId(req.params.id);
  Formateur.findOne({ user_id: id }).then((f) => {
    if (f && f.length != 0) {
      res.status(200).send({ data: f, type: "Formateur" });
    } else {
      Etudiant.findOne({ user_id: id }).then((a) => {
        if (a && a.length != 0) {
          res.status(200).send({ data: a, type: a.type });
        } else {
          Etudiant.findOne({ user_id: id }).then((e) => {
            if (e && e.length != 0) {
              res.status(200).send({ data: e, type: "Etudiant" });
            } else {
              CommercialPartenaire.findOne({ user_id: id }).then((p) => {
                if (p && p.length != 0) {
                  res.status(200).send({ data: p, type: "Commercial" });
                } else {
                  Prospect.findOne({ user_id: id }).then((p) => {
                    if (p && p.length != 0) {
                      let Ptoken = jwt.sign(
                        { p },
                        "126c43168ab170ee503b686cd857032d",
                        { expiresIn: "7d" }
                      );
                      res
                        .status(200)
                        .send({ data: p, type: "Prospect", Ptoken });
                    } else {
                      res.status(200).send({ data: null });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.post("/verifyUserPassword", (req, res) => {
  let passwordToVerif = req.body.password;
  let id = req.body.id;

  console.log(passwordToVerif, " ", id);
  User.findOne({ _id: id })
    .then((userFromDb) => {
      bcrypt
        .compare(passwordToVerif, userFromDb.password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({ success: "OK" });
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/updatePwd/:id", (req, res) => {
  let pwd = req.body.pwd;
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      password: bcrypt.hashSync(pwd, 8),
    }
  )
    .then((userFromDb) => {
      console.log(userFromDb);
      let token = {
        id: userFromDb._id,
        role: userFromDb.role,
        service_id: userFromDb.service_id,
      };

      console.log(token);
      res.status(200).send(token);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/pwdToken/:email", (req, res) => {
  console.log(req.params.email);
  //  let pwd_token = { 'email': req.params.email, 'date_creation': new Date() };

  let PwdToken = new pwdToken({
    email: req.params.email,
    date_creation: new Date(),
  });

  PwdToken.save()
    .then((pwdTokFromDb) => {
      let Intedtransporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 587, false for other ports
        requireTLS: true,
        auth: {
          user: "noreply@intedgroup.com",
          pass: "@iNTEDgROUPE",
        },
      });
      console.log(pwdTokFromDb);
      let htmlmail =
        '<p>Bonjour , </p><p style="color:black">Nous avons reçu une demande de modification de mot de passe pour votre compte IMS. Si vous souhaitez poursuivre la réinitialisation de votre mot de passe, cliquez sur le lien ci-dessous ou copiez-le directement dans la barre d\'adresse de votre navigateur : </p><p style="color:black"> <a href="' +
        origin +
        "/#/mot_de_passe_reinit/" +
        pwdTokFromDb._id +
        '"> Je réinitialise mon mot de passe </a> </span>  </p><p style="color:black">Si vous n\'êtes pas l\'auteur de cette requête, ou si vous ne voulez pas réinitialiser votre mot de passe, merci de ne pas tenir compte de cet e-mail.</p><p style="color:black">En cas de questions ou de problèmes, ou si vous rencontrez des difficultés au cours de la réinitialisation de votre mot de passe, contactez nous par email sur l\'adresse email suivante : contact@intedgroup.com</p><p style="color:black">Cordialement.</p><footer> <img  src="footer_signature"/></footer>';
      let mailOptions = {
        from: "noreply@intedgroup.com",
        to: PwdToken.email,
        subject: "[IMS] Mot de passe oublié",
        html: htmlmail,
        attachments: [
          {
            filename: "logoIMS.png",
            path: "assets/logoIMS.png",
            cid: "footer_signature", //same cid value as in the html img src
          },
        ],
      };
      Intedtransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error);
        }
      });

      res.status(200).send(pwdTokFromDb);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send(error);
    });
});
app.post("/reinitPwd/:pwdTokenID", (req, res) => {
  pwdToken.findOne({ _id: req.params.pwdTokenID }).then((TokenData) => {
    console.log((new Date() - TokenData.date_creation) / 1000 / 3600);
    if ((new Date() - TokenData.date_creation) / 1000 / 3600 < 0.25) {
      console.log("password Updated");

      User.findOneAndUpdate(
        { email: TokenData.email },
        { password: bcrypt.hashSync(req.body.pwd, 8) },
        { new: true },
        (err, userModified) => {
          if (err) {
            console.error(err);
          } else {
            res.send(userModified);
          }
        }
      );
    } else {
      console.log("Token expired");
      res.send("Token expired");
    }
  });
});
/*app.get('/TESTMAIL', (req, res) => {
    let origin = "http://localhost:4200"
    if (process.argv[2]) {
        let argProd = process.argv[2]
        if (argProd.includes('dev')) {
            origin = "https://141.94.71.25"
        } else (
            origin = "https://ticket.estya.com"
        )
    }
    let temp = fs.readFileSync('assets/Esty_Mailauth2.html', { encoding: "utf-8", flag: "r" })
    let temp2 = temp.replace('eMailduProSpect', "m.hue@estya.com")

    temp2 = temp2.replace('oRiGin', origin)

    temp2 = temp2.replace("\"oRiGin/", '"' + origin + "/")

    let htmlmail = fs.readFileSync('assets/Estya_Mail authetifiacation.html', { encoding: "utf-8", flag: "r" }) + temp2

    let mailOptions = {
        from: "ims@intedgroup.com",
        to: "m.hue@estya.com",
        subject: 'TEST EMAIL',
        html: htmlmail,
        attachments: [{
            filename: 'Image1.png',
            path: 'assets/Image1.png',
            cid: 'Image1' //same cid value as in the html img src
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
            res.status(500).send(error)
        } else {
            res.status(200).send({ temp, temp2 })
        }
    });
});*/

/*app.get("/SecretPathForAbsoluteNoReason", (req, res) => {
    //Convertir l'ancienDB vers la nouvelle
    //Supprimer phone pour que tout le monde repasse par first_connection
    User.updateMany({ role: "user" }, { phone: null }).exec(data => {
        console.log(data)
        res.send(data)
    })
})*/

app.get("/HowIsIt/:id", (req, res) => {
  jwt.verify(
    req.header("token"),
    "126c43168ab170ee503b686cd857032d",
    function (err, decoded) {
      if (decoded == undefined) {
        res.status(201).send(err);
      } else {
        User.findById(req.params.id)
          .then((userFromDb) => {
            if (!userFromDb) {
              res.status(201).send({
                name: "Cette utilisateur n'existe pas",
                type: userFromDb.type,
              });
            } else if (userFromDb.civilite == null) {
              res
                .status(201)
                .send({ name: "Profil incomplet", type: userFromDb.type });
            } else {
              res
                .status(201)
                .send({ name: "Profil complet", type: userFromDb.type });
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(201).send(error);
          });
      }
    }
  );
});

app.get("/getAllCommercialFromTeam/:id", (req, res) => {
  Service.findOne({ label: /ommercial/i }).then((s) => {
    User.find({ role: "Agent", service_id: s._id }).then((u) => {
      res.status(201).send(u);
    });
  });
});

app.get("/getAllCommercialV2", (req, res) => {
  Service.findOne({ label: /ommercial/i }).then((s) => {
    if (s)
      User.find({ role: { $ne: "user" }, service_id: s._id }).then((u) => {
        res.status(201).send(u);
      });
    else res.status(500).send("Le service de commercial n'existe pas");
  });
});
app.get("/findDuplicateIMS", async (req, res) => {
  /*
    db.collection.aggregate([
    {"$group" : { "_id": "$name", "count": { "$sum": 1 } } },
    {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } }, 
    {"$project": {"name" : "$_id", "_id" : 0} }
    ]);
    */
  let r = [];
  User.updateMany({ email: " " }, { email: "" }, { new: true }, (err, doc) => {
    User.updateMany({ email: "" }, { email: null }, (err, doc) => {
      console.log('email:"" et email:" " convertir en null');
    });
  });
  let agg = await User.aggregate([
    { $group: { _id: "$email", count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    { $project: { email: "$_id", _id: 0 } },
  ]);
  for (const doc of agg) {
    await User.find({ email: doc.email }).then((users) => {
      if (users[0]) r.push({ _id: users[0]._id, data: users });
    });
  }
  res.status(201).send(r);
});

app.get("/findDuplicatePerso", async (req, res) => {
  let r = [];
  User.updateMany(
    { email_perso: " " },
    { email_perso: "" },
    { new: true },
    (err, doc) => {
      User.updateMany(
        { email_perso: "" },
        { email_perso: null },
        (err, doc) => {
          console.log('email_perso:"" et email_perso:" " convertir en null');
        }
      );
    }
  );
  let agg = await User.aggregate([
    { $group: { _id: "$email_perso", count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    { $project: { email_perso: "$_id", _id: 0 } },
  ]);
  for (const doc of agg) {
    await User.find({ email_perso: doc.email_perso }).then((users) => {
      if (users[0]) r.push({ _id: users[0]._id, data: users });
    });
  }
  res.status(201).send(r);
});

app.get("/delete/:user_id", (req, res) => {
  let token = jwt.decode(req.header("token"));
  if (token.role == "Admin")
    User.findByIdAndRemove(req.params.user_id).then((r) => {
      res.send(r); console.log(r, 'compte supprimé')
    });
  //Chercher dans les autres tables si son ID ne traine pas dans les Models Formateur, Etudiant, Prospects, Commercial etc
  else res.status(403).send("Vous n'avez pas l'accès necessaire.");
});

app.get("/toAdmin", (req, res) => {
  //Attribuer ceux sans classe_id et !statut : {$in:'Dossier Complet'} en valided_by_admin : false
  Etudiant.updateMany(
    { classe_id: null, statut_dossier: { $nin: "Dossier Complet" } },
    { valided_by_admin: false },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        res.status(500).send(err);
      }
    }
  );
});
app.get("/toPedagogie", (req, res) => {
  //Attribuer ceux sans classe_id et statut : {$in:'Dossier Complet'} en valided_by_admin : true
  Etudiant.updateMany(
    { classe_id: null, statut_dossier: { $in: "Dossier Complet" } },
    { valided_by_admin: true },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        res.status(500).send(err);
      }
    }
  );
});

app.get("/toSupport", (req, res) => {
  //Attribuer ceux en valided_by_admin:true et sans email_ims en valided_by_support : false
  Etudiant.find({ valided_by_admin: true })
    .populate("user_id")
    .then(
      (r) => {
        let users = [];
        r.forEach((user) => {
          if (user.user_id)
            if (
              user.user_id.email == null ||
              user.user_id.email == "" ||
              user.user_id.email == " "
            )
              users.push(user.user_id._id);
        });
        Etudiant.updateMany(
          { user_id: { $in: users } },
          { valided_by_support: false },
          { new: true },
          (err, doc) => {
            res.send(doc);
          }
        );
      },
      (err) => {
        res.status(500).send(err);
      }
    );
});

app.get("/cleanModel", (req, res) => {
  //Nettoyer les tables si user_id renvoie null dans les Models Formateur, Etudiant, Prospects, Commercial etc
  Etudiant.find()
    .populate("user_id")
    .then((r) => {
      r.forEach((user) => {
        if (!user.user_id) Etudiant.findByIdAndRemove(user._id).exec();
      });
    });
  Formateur.find()
    .populate("user_id")
    .then((r) => {
      r.forEach((user) => {
        if (!user.user_id) Formateur.findByIdAndRemove(user._id).exec();
      });
    });
  CommercialPartenaire.find()
    .populate("user_id")
    .then((r) => {
      r.forEach((user) => {
        if (!user.user_id)
          CommercialPartenaire.findByIdAndRemove(user._id).exec();
      });
    });
  Prospect.find()
    .populate("user_id")
    .then((r) => {
      r.forEach((user) => {
        if (!user.user_id) Prospect.findByIdAndRemove(user._id).exec();
      });
    });

  res.status(200).send({});
});

app.get("/deleteDuplicateProspect", async (req, res) => {
  //Supprimer les doublons de prospects
  let agg = await User.aggregate([
    { $group: { _id: "$email_perso", count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    { $project: { email_perso: "$_id", _id: 0 } },
  ]);
  let r = [];
  for (const doc of agg) {
    if (
      doc.email_perso != "" &&
      doc.email_perso != " " &&
      doc.email_perso != null
    )
      await User.findOneAndRemove(
        {
          email_perso: doc.email_perso,
          $or: [{ type: "Prospect" }, { type: null }],
        },
        { new: true },
        (err, doc) => {
          r.push(doc);
        }
      );
  }
  res.status(201).send(r);
});

app.get("/getAllWithSameEmail", (req, res) => {
  User.find({ email: { $ne: null } })
    .$where("this.email==this.email_perso")
    .then((r) => {
      res.status(201).send(r);
    });
});

app.get("/cleanAllWithSameEmail", (req, res) => {
  User.find({ email: { $ne: null } })
    .$where("this.email==this.email_perso")
    .then((r) => {
      r.forEach((user) => {
        let email = user.email.toLowerCase();
        if (
          email.indexOf("@gmail.com") != -1 ||
          email.indexOf("@yahoo.fr") != -1 ||
          email.indexOf("@outlook.fr") != -1
        )
          User.findByIdAndUpdate(
            user._id,
            { email: null },
            { new: true },
            (err, doc) => {
              console.log(doc);
            }
          );
        else if (
          email.indexOf("@estya.com") != -1 ||
          email.indexOf("@elitech.education") != -1 ||
          email.indexOf("@intedgroup.com") ||
          email.indexOf("@eduhorizons.com")
        )
          User.findByIdAndUpdate(
            user._id,
            { email_perso: null },
            { new: true },
            (err, doc) => {
              console.log(doc);
            }
          );
      });
    });
  res.status(200).send({});
});

app.get("/deleteEmail/:user_id/:type", (req, res) => {
  if (req.params.type == "IMS")
    User.findByIdAndUpdate(
      req.params.user_id,
      { email: null },
      { new: true },
      (err, doc) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(doc);
        }
      }
    );
  else
    User.findByIdAndUpdate(
      req.params.user_id,
      { email_perso: null },
      { new: true },
      (err, doc) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(doc);
        }
      }
    );
});

// méthode d'envoi de mail pour la recuperation du mot de passe externe
app.post("/send-recovery-password-mail", (req, res) => {
  const email = req.body.email;

  User.findOne({ email_perso: email })
    .then((response) => {
      //  création du model de mail
      const htmlMail =
        "<p>Bonjour vous avez demander la reinitialisation de votre mot de passe, veuillez cliquer sur le lien suivant: <a href=\"https://ims.intedgroup.com/#/mp-oublie/" + response._id + "\">Modifier mon mot de passe</a></p>" +
        "<p>Si vous n'êtes pas à l'origine de cette demande, veuillez ne pas en tenir compte.</p>" +
        "<p>Cordialement</p>";

      // mise en place des options
      const mailOptions = {
        from: "ims@intedgroup.com",
        to: email,
        subject: "Mot de passe [IMS]",
        html: htmlMail,
      };

      // envoi du mail
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).json({ errMsg: "Impossible d'effectuer un envoi de mail, veuillez contacter un administrateur", });
        }
      });

      res.status(200).json({ successMsg: "Un email vous a été envoyé" });
    })
    .catch((error) => {
      res.status(400).json({ error: error, errMsg: "Adresse mail introuvable" });
    });
});

// methode de recuperation du mot de passe (modification)
app.patch("/recovery-password", (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;

  const passwordHashed = bcrypt.hashSync(password, 8);

  User.updateOne({ _id: userId }, { password: passwordHashed })
    .then((response) => {
      res.status(201).json({ successMsg: "Votre mot de passe à bien été modifié" });
    })
    .catch((error) => {
      res.status(500).json({ errMsg: "Impossible de mettre à jour votre mot de passe, veuillez contacter un administrateur", });
    });
});

app.post('/create', (req, res) => {
  let user = new User({ ...req.body })

  user.save().then(data => {
    res.send(data)
  }, error => {
    res.status(500).send(error)
  })
  /*
  User.findOne({ email: req.body.email }).then(u => {
    if (!u || !req.body.email)

    else {
      res.status(500).send('Email déjà existant')
    }
  })*/

})

app.get('/getAllByServiceFromList/:service_id', (req, res) => {
  User.find({ service_list: { $in: [req.params.service_id] } }).populate('roles_ticketing_list.module').then((usersFromDb) => {
    if (usersFromDb)
      res.status(200).send(usersFromDb);
    else
      res.status(200).send([]);
  })
    .catch((error) => {
      res.status(400).send(error.message);
    });
})

app.get("/getAllBySujet/:sujet_id", (req, res) => {
  User.find({ sujet_list: { $in: [req.params.sujet_id] } }).then((usersFromDb) => {
    if (usersFromDb)
      res.status(200).send(usersFromDb);
    else
      res.status(200).send([]);
  })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

// méthode de mise à jour du statut du collaborateur
app.put('/path-user-statut', (req, res) => {
  const { statut } = req.body;
  const { id } = req.body;

  User.findOneAndUpdate({ _id: id }, { statut: statut })
    .then((response) => {
      res.status(201).send(response);
    })
    .catch((error) => { res.status(400).send(error); });
});

//Sauvegarde de la photo de profile
const storage2 = multer.diskStorage({
  destination: (req, file, callBack) => {
    let id = req.body._id;
    if (!fs.existsSync("storage/documentRH/" + id + "/")) {
      fs.mkdirSync("storage/documentRH/" + id + "/", { recursive: true });
    }
    callBack(null, "storage/documentRH/" + id + "/");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  },
});

const upload2 = multer({ storage: storage2, limits: { fileSize: 20000000 } });
//Sauvegarde de la photo de profile
app.post("/uploadRH", upload2.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("No File");
    error.httpStatusCode = 400;
    return next(error);
  }

  res.send({ message: 'success' });
});

app.get('/getByEmailIMS/:email', (req, res) => {
  User.findOne({ email: req.params.email }).then(r => {
    if (r)
      res.send(r)
    else
      res.status(404).send()
  })
})

app.get("/downloadRH/:_id/:path", (req, res) => {
  let pathFile = "storage/documentRH/" + req.params._id + "/" + req.params.path
  let fileFinal = fs.readFileSync(pathFile, { encoding: 'base64' }, (err) => {
    if (err)
      return console.error(err);
  });
  res.status(201).send({ file: fileFinal, documentType: mime.contentType(path.extname(pathFile)) })
});

module.exports = app;
