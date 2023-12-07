const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
//const scrypt_Mail = require("./middleware/scrypt_Mail");
// var CronJob = require('cron').CronJob;
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(express.static('public', {
  etag: true, // Just being explicit about the default.
  lastModified: true,  // Just being explicit about the default.
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // All of the project's HTML files end in .html
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));
let dblog = "mongodb://127.0.0.1:27017/learningNode"; //Production:5c74a988f3a038777f875347ea98d165@
let origin = ["http://localhost:4200"];
if (process.argv[2]) {
  let argProd = process.argv[2];
  if (!argProd.includes("dev") && !argProd.includes("qa") && !argProd.includes("prod1") && !argProd.includes("prod2")) {
    dblog = "mongodb://127.0.0.1:27017/" + argProd;
  } else if (argProd.includes("dev")) {
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
      "https://partenaire.eduhorizons.com",
      "https://login.eduhorizons.com",
      "https://ims.adgeducation.com",
      "https://ims.intedgroup.com",
      "https://t.dev.estya.com",
      "https://wio.fr/",
      "https://studinfo.com"
    ];
}
app.use(cors({ origin: origin }));

const httpServer = require("http").createServer(app);
const options = {
  cors: {
    origin: origin,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true,
};
//finding the demande by the docs id
// function findDemandeByDocId (documentId){
//   return Remboursement.findById(documentId).exec();
// }
const io = require("socket.io")(httpServer, options);
console.log('URL Connection MONGODB:' + dblog)
mongoose
  .connect(dblog, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("L'api s'est connecté à MongoDB.\nL'origin est: " + origin);

    /* 
        //Lancer le scrypt MailAuto une fois par mois a 12h11min:11sec
        
                var CronJob = require('cron').CronJob;
        var job = new CronJob(
            '11 11 12 *'/1 * *',
            function() {
                scrypt_Mail.smail();
            },
            null,
            true,
            'local'
        );
        */
  })
  .catch((err) => {
    console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    process.exit();
  });
const { Critere } = require("./models/critere");

const UserController = require('./controllers/userController');
const ServiceController = require('./controllers/serviceController');
const SujetController = require('./controllers/sujetController');
const messageController = require('./controllers/messageController');
const ticketController = require('./controllers/ticketController');
const notifController = require('./controllers/notificationController');
const classeController = require('./controllers/classeController');
const GroupeController = require('./controllers/GroupeController');
const anneeScolaireController = require('./controllers/anneeScolaireController');
const ecoleController = require('./controllers/ecoleController');
const campusController = require('./controllers/campusController');
const diplomeController = require('./controllers/diplomeController');
const presenceController = require('./controllers/presenceController');
const seanceController = require('./controllers/seanceController');
const formateurController = require('./controllers/formateurController');
const ressourceController = require('./controllers/ressourceController');
const etudiantController = require('./controllers/etudiantController');
const matiereController = require('./controllers/matiereController');
const noteController = require('./controllers/noteController');
const entrepriseController = require('./controllers/entrepriseController');
const examenController = require('./controllers/examenController');
const rbc = require('./controllers/rachatBulletinController');
const contactController = require('./controllers/contactController');
const prestataireController = require('./controllers/prestataireController');
const historiqueController = require('./controllers/historiqueController');
const prospectController = require('./controllers/prospectController');
const dashboardController = require('./controllers/dashboardController');
const partenaireController = require('./controllers/partenaireController');
const commercialPartenaireController = require('./controllers/commercialPartenaireController');
const appreciationController = require('./controllers/appreciationController');
const historiqueEchangeController = require('./controllers/historiqueEchangeController');
const forfeitFormController = require('./controllers/forfeitFormController');
const tuteurController = require('./controllers/tuteurController');
const demandeEventsController = require('./controllers/demandeEventsController');
const paymentController = require('./controllers/paymentController');
const teamCommercialController = require('./controllers/teamCommercialController');
const logementController = require('./controllers/logementController');
const cvTypeController = require('./controllers/cvTypeController');
const genSchoolController = require('./controllers/gen_doc/genSchoolController');
const genCampusController = require('./controllers/gen_doc/genCampusController');
const genDocController = require('./controllers/gen_doc/genDocController');
const genFormationController = require('./controllers/gen_doc/genFormationController');
const genRentreController = require('./controllers/gen_doc/genRentreController');
const DemandeConseillerController = require('./controllers/demandeConseillerController');
const congeController = require('./controllers/congeController');
const devoirController = require('./controllers/devoirController');
const renduDevoirController = require('./controllers/renduDevoirController');
const abscenceCollaborateurController = require('./controllers/abscenceCollaborateurController');
const factureFormateurController = require('./controllers/factureFormateurController');
const annonceController = require('./controllers/annonceController');
// const annonceController = require('./controllers/annonceController');
const skillsController = require('./controllers/skillsController');
const progressionPedaController = require('./controllers/progressionPedaController');
const QSController = require('./controllers/questionnaireSatisfactionController');
const projectController = require('./controllers/projectController');
const projetController = require('./controllers/projectv2Controller');
const linksController = require('./controllers/linksController');
const teamController = require('./controllers/teamController');
const EvenementsController = require('./controllers/evenementController')
const ExtSkillsnetController = require('./controllers/ExterneSkillsnetController')
const MatchingController = require('./controllers/matchingController')
const stageController = require('./controllers/stageController')
const venteController = require('./controllers/venteCommissionController')
const factureCommissionController = require('./controllers/factureCommissionController')
const intunsEtudiantsController = require('./controllers/intunsEtudiantsController')
const teamsIntController = require('./controllers/teamsIntController')
const teamsRHController = require('./controllers/teamsRHController')
const formulaireAdmissionController = require('./controllers/formulaireAdmissionController')
const admissionFormDubaiController = require('./controllers/admissionFormDubaiController')
const dailyCheckController = require('./controllers/dailyCheckController')
const PAC = require('./controllers/alternantsPartenaireController')
const rhControlleur = require('./controllers/rhController');
const bookingController = require('./controllers/bookingController');
const mailController = require('./controllers/mailController');
const meetingTeamsController = require('./controllers/meetingTeamsController');
const gestionProduitsCrmController = require('./controllers/gestionProduitsCrmController');
const gestionOperationCrmController = require('./controllers/gestionPoerationCrmController');
const gestionSourceCrmController = require('./controllers/gestionSourceCrmController');


const { User } = require("./models/user");
const rembouresementController = require('./controllers/rembouresementController'); // Require the controller module
// const documentsController = require('./controllers/documentsController');
const { Remboursement } = require("./models/Remboursement");
const { evaluation } = require("./controllers/evaluationController");
app.use("/", function (req, res, next) {
  let token = jwt.decode(req.header("token"));
  if (token && token["prospectFromDb"]) {
    token = token["prospectFromDb"];
  }
  if (token && token.id && token.role) {
    User.findOne({ _id: token.id, role: token.role }, (err, user) => {
      if (err) {
        console.error(err);
        res.status(403).send("Accès non autorisé, Erreur", err);
      } else if (user) {
        jwt.verify(
          req.header("token"),
          "126c43168ab170ee503b686cd857032d",
          function (errToken, decoded) {
            if (req.originalUrl.startsWith("/soc/user/HowIsIt")) {
              next();
            } else if (decoded == undefined) {
              if (errToken.name == "JsonWebTokenError") {
                //Token Incorrect
                res.status(403).send(errToken);
              } else if (errToken.name == "TokenExpiredError") {
                //Token Expired
                res.status(401).send(errToken);
              }
            } else {
              User.findByIdAndUpdate(
                user._id,
                { last_connection: new Date() },
                {},
                (err, user) => {
                  if (err) {
                    console.error(err);
                  }
                  next();
                }
              );
            }
          }
        );
      } else {
        console.error(user);
        res.status(403).send("Accès non autorisé, User not found");
      }
    });
  } else {
    if (
      req.originalUrl == "/soc/formulaireAdmission/FA/getAll" ||
      req.originalUrl == "/soc/formulaireAdmission/RA/getAll" ||
      req.originalUrl == "/soc/formulaireAdmission/EA/getAll" ||
      req.originalUrl.startsWith("/soc/user/getPopulate/") ||
      req.originalUrl == "/soc/demanderemboursement/upload-docs" ||

      req.originalUrl == "/soc/user/AuthMicrosoft" ||
      req.originalUrl == "/soc/demande-events" ||
      req.originalUrl == "/soc/partenaire/inscription" ||
      req.originalUrl.startsWith("/soc/notification/create") ||
      req.originalUrl.startsWith("/soc/prospect/") ||
      req.originalUrl.startsWith("/soc/service/getByLabel") ||
      req.originalUrl == "/soc/demande-events/create" ||
      req.originalUrl == "/soc/user/login" ||
      req.originalUrl.startsWith("/soc/user/getByEmail") ||
      req.originalUrl.startsWith("/soc/presence/getAtt_ssiduitePDF") ||
      req.originalUrl == "/soc/etudiant/getAllAlternants" ||
      req.originalUrl == "/soc/etudiant/getAll" ||
      req.originalUrl == "/soc/diplome/getAll" ||
      req.originalUrl == "/soc/entreprise/createNewContrat" ||
      req.originalUrl == "/soc/classe/getAll" ||
      req.originalUrl.startsWith("/soc/forfeitForm") ||
      req.originalUrl == "/soc/qs/create" ||
      req.originalUrl == "/soc/qs/createQFF" ||
      req.originalUrl.startsWith("/soc/user/HowIsIt") ||
      req.originalUrl.startsWith("/soc/user/pwdToken") ||
      req.originalUrl == "/soc/partenaire/getNBAll" ||
      req.originalUrl.startsWith("/soc/entreprise/getAllContratsbyTuteur") ||
      req.originalUrl.startsWith("/soc/entreprise/getAllContratsbyEntreprise") ||
      req.originalUrl.startsWith("/soc/user/reinitPwd") ||
      req.originalUrl.startsWith("/soc/qs/create") ||
      req.originalUrl.startsWith("/soc/user/getProfilePicture") ||
      req.originalUrl == "/soc/user/file" ||
      req.originalUrl == "/soc/user/patchById" ||
      req.originalUrl === "/soc/user/send-recovery-password-mail" ||
      req.originalUrl === "/soc/user/recovery-password" ||
      req.originalUrl === "/soc/user/verifyUserPassword" ||
      req.originalUrl.startsWith("/soc/formulaireAdmission/") ||
      req.originalUrl.startsWith("/soc/formulaireICBS/") ||
      req.originalUrl === '/soc/admission-dubai/post-dubai-admission' ||
      req.originalUrl === '/soc/cv/get-cvs-public' ||
      req.originalUrl === '/soc/cv/upload-cv' ||
      req.originalUrl === '/soc/cv/post-cv' ||
      req.originalUrl.startsWith("/soc/cv/get-object-cv/") ||
      req.originalUrl.startsWith("/soc/user/nstuget/") ||
      req.originalUrl === '/soc/extSkillsnet/getAll' ||
      req.originalUrl.startsWith('/soc/extSkillsnet/create') ||
      req.originalUrl === '/soc/cv/getAllPicture' ||
      req.originalUrl.startsWith("/soc/cv/get-picture-by-user/") ||
      req.originalUrl.startsWith("/soc/cv/download-cv/") ||
      req.originalUrl === '/soc/skills/get-competences' ||
      req.originalUrl === '/soc/skills/get-profiles' ||
      req.originalUrl.startsWith('/soc/disponbiliteEtudiant/getAllByUSERID') ||
      req.originalUrl.startsWith("/soc/fIM") ||
      req.originalUrl.startsWith('/soc/RA/getByEcoleID') ||
      req.originalUrl.startsWith('/soc/docGenInt/download') ||
      req.originalUrl === '/soc/meetingTeams/create' ||
      req.originalUrl.startsWith('/soc/genDoc/get-doc') ||
      req.originalUrl === '/soc/annonce/post-annonce' ||
      req.originalUrl === '/soc/matching/create' ||
      req.originalUrl === "/soc/entreprise/createEntrepriseRepresentant" ||
      req.originalUrl.startsWith('/soc/annonce/postAnnonce') ||
      req.originalUrl.startsWith('/soc/annonce/get-annonces') ||
      req.originalUrl === '/soc/ticket/getAllPopulate' ||
      req.originalUrl === '/soc/demanderemboursement/newremb' ||
      req.originalUrl === '/soc/demanderemboursement/upload-docs' ||
      req.originalUrl == '/soc/LeadCRM/create'
      /*
          Dans des cas particulier certaines requêtes doivent être effectué alors que l'user n'ait pas connecté ou ne possède pas de compte,
          il faut dans ce cas rajouter le chemin de la route ici
      */
      || req.originalUrl === '/soc/template/formulaire/getAllPopulate'
    ) {
      next();
    } else {

      res
        .status(403)
        .send(
          "Accès non autorisé, Wrong Token " +
          token +
          " Vérifiez aussi que la méthode de request POST ou GET est respecté\n" +
          req.originalUrl
        );
    }
  }
});
app.use("/soc/extSkillsnet", ExtSkillsnetController);

app.use("/soc/evenements", EvenementsController);

app.use("/soc/rachatBulletin", rbc);

app.use("/soc/user", UserController);

app.use("/soc/service", ServiceController);

app.use("/soc/demande-events", demandeEventsController);

app.use("/soc/sujet", SujetController);

app.use("/soc/message", messageController);

app.use("/soc/ticket", ticketController);

app.use("/soc/notification", notifController);

app.use("/soc/classe", classeController);
app.use("/soc/groupe", GroupeController);
app.use("/soc/anneeScolaire", anneeScolaireController);

app.use("/soc/ecole", ecoleController);

app.use("/soc/campus", campusController);
app.use("/soc/campusR", require('./controllers/campusReworkController'));

app.use("/soc/diplome", diplomeController);

app.use("/soc/presence", presenceController);

app.use("/soc/seance", seanceController);

app.use("/soc/formateur", formateurController);

app.use("/soc/ressource", ressourceController);

app.use("/soc/etudiant", etudiantController);

app.use("/soc/matiere", matiereController);

app.use("/soc/note", noteController);

app.use("/soc/entreprise", entrepriseController);

app.use("/soc/examen", examenController);

app.use("/soc/cv", cvTypeController);



app.use("/soc/genSchool", genSchoolController);
app.use("/soc/genCampus", genCampusController);
app.use("/soc/genDoc", genDocController);
app.use("/soc/genFormation", genFormationController);
app.use("/soc/genRentre", genRentreController);


app.use("/soc/prestataire", prestataireController);

app.use("/soc/historique", historiqueController);

app.use("/soc/partenaire", partenaireController);

app.use("/soc/commercialPartenaire", commercialPartenaireController);

app.use("/soc/appreciation", appreciationController);

app.use("/soc/prospect", prospectController);

app.use("/soc/historiqueEchange", historiqueEchangeController);

app.use("/soc/forfeitForm", forfeitFormController);

app.use("/soc/contact", contactController);

app.use("/soc/tuteur", tuteurController);

app.use("/soc/lemon", paymentController);
app.use("/soc/logement", logementController);

app.use("/soc/dashboard", dashboardController);

app.use("/soc/teamCommercial", teamCommercialController);

app.use("/soc/demandeConseiller", DemandeConseillerController);

app.use('/soc/conge', congeController);

app.use('/soc/factureFormateur', factureFormateurController)
app.use('/soc/devoir', devoirController);
app.use('/soc/renduDevoir', renduDevoirController);
app.use('/soc/abscenceCollaborateur', abscenceCollaborateurController);
app.use('/soc/annonce', annonceController);
app.use('/soc/skills', skillsController);

app.use('/soc/progressionPeda', progressionPedaController);
app.use('/soc/qs', QSController)
app.use('/soc/project', projectController);
app.use('/soc/projet', projetController);
app.use('/soc/links', linksController);
app.use('/soc/team', teamController);
app.use('/soc/matching', MatchingController)
app.use('/soc/stage', stageController)
app.use('/soc/vente', venteController)
app.use('/soc/factureCommission', factureCommissionController)

app.use('/soc/intuns', intunsEtudiantsController)
app.use('/soc/teamsInt', teamsIntController)
app.use('/soc/teamsRH', teamsRHController)
app.use('/soc/formulaireAdmission', formulaireAdmissionController)
app.use('/soc/admission-dubai', admissionFormDubaiController);
app.use('/soc/check', dailyCheckController);
app.use('/soc/rh', rhControlleur);
app.use('/soc/sujet-booking', bookingController);

app.use('/soc/alternantsPartenaire', PAC)
app.use('/soc/supportMarketing', require('./controllers/SupportMarketingController'))
app.use('/soc/actualiteInt', require('./controllers/activiteIntController'))
app.use('/soc/actualiteRH', require('./controllers/actualiteRHController'))
app.use('/soc/docGenInt', require('./controllers/docGenController'))
app.use('/soc/formulaireICBS', require('./controllers/formulaireICBSController'))
app.use('/soc/leadCRM', require('./controllers/leadCRMController'))
app.use('/soc/teamsCRM', require('./controllers/teamsCRMController'))
app.use('/soc/critere', require('./controllers/criteresController'))
app.use('/soc/mail', mailController)
app.use('/soc/target', require('./controllers/targetController'))
app.use('/soc/candidatureLead', require('./controllers/candidatureLeadController'))
app.use('/soc/pointeuse', require('./controllers/pointeuseController'))
app.use('/soc/calendrierRH', require('./controllers/eventCalendarRHController'))
app.use('/soc/pointage', require('./controllers/pointageController'))
app.use('/soc/fIM', require('./controllers/formulaireMIController'))
app.use('/soc/meetingTeams', meetingTeamsController)
// app.use('/soc/demanderemboursement',rembouresementController)
app.use('/soc/demanderemboursement', require('./controllers/rembouresementController'));
// app.use('/soc/docremb',require('./controllers/documentsController'));

app.use('/soc/template/formulaire', require('./controllers/template/formulaireController'))
app.use('/soc/suivi-candidat', require('./controllers/suiviCandidatController'))
app.use('/soc/disponbiliteEtudiant', require('./controllers/disponibiliteEtudiantController'))
app.use('/soc/evaluation', require('./controllers/evaluationController'));
//CRM Gestion Produits

app.use('/soc/gestion-produits', gestionProduitsCrmController)
app.use('/soc/gestion-operation', gestionOperationCrmController)
app.use('/soc/gestion-sources', gestionSourceCrmController)


io.on("connection", (socket) => {
  //Lorsqu'un utilisateur se connecte il rejoint une salle pour ses Notification
  socket.on("userLog", (user) => {
    LISTTOJOIN = [user._id, user.role];
    User.findById(user._id).then(userdata => {
      userdata.roles_list.forEach(s => {
        LISTTOJOIN.push(s.module, `${s.module} - ${s.role}`)
      })
      socket.join(LISTTOJOIN);
      console.log("NEW USER :", LISTTOJOIN)
    })

  });

  socket.on("NewNotifV2", (channel, text = "") => {
    io.to(channel).emit("NewNotifV2", text);
  })

  //Lorsqu'une nouvelle Notification est crée, alors on l'envoi à la personne connecté
  socket.on("NewNotif", (data) => {
    //console.log(data);
    if (data?.user_id) {
      io.to(data?.user_id).emit("NewNotif", data);
      io.emit(data, { NewNotif: data });
    } else {
      io.to(data?.service_id).emit("NewNotif", data);
      io.emit(data, { NewNotif: data });
    }
  });

  socket.on("reloadNotif", (data) => {
    io.to(data.id).emit("reloadNotif");
  });

  socket.on("reloadImage", (data) => {
    io.to(data).emit("reloadImage");
  });

  //Si un user ajoute un nouveau ticket --> refresh les tickets queue d'entrée du service du ticket des Agents et de l'admin
  socket.on("AddNewTicket", (service_id) => {
    io.to("Admin").to(service_id).emit("refreshQueue");
  });

  //Si un agent répond à un ticket --> refresh les messages du ticket de l'user et le ticket (à cause du statut) + AllTickets du service et des admins
  socket.on("NewMessageByAgent", (data) => {
    //Refresh du message de l'user et des tickets (à cause du statut)
    io.to(data.user_id).emit("refreshMessage");
    //Refresh du 3ème tableau du service (à cause du Tableau)
    io.to("Admin").to(data.service_id).emit("refresh3emeTableau");
  });

  //Si un user répond à un ticket --> refresh les messages du ticket de l'agent
  socket.on("NewMessageByUser", (agent_id) => {
    io.to(agent_id).emit("refreshMessage");
  });

  //Si un agent affecte ou accepte un ticket --> refresh les tickets d'un admin et les tickets de queue d'entrée et de mon service des agents et du créateur
  socket.on("refreshAll", (data) => {
    //refresh les tickets d'un admin et les tickets de queue d'entrée et de mon service des agents)
    io.to("Admin").to(data.service_id).emit("refreshAllTickets");
    //Refresh les tickets suivi de l'user
    io.to(data.user_id).emit("refreshSuivi");
  });

  socket.on("addPresence", () => {
    io.emit("refreshPresences");
  });

  socket.on("isAuth", (b) => {
    io.emit("isAuth", b);
  });
  socket.on("TraitementProspect", (prospect) => {
    prospect.enTraitement = true;
    io.emit("TraitementProspect", prospect);
    setTimeout(function () {
      prospect.enTraitement = false;
      io.emit("TraitementProspect", prospect);
    }, 20000);
  });

  socket.on("UpdatedProspect", (prospect) => {
    prospect.enTraitement = false;

    io.emit("UpdatedProspect", prospect);
  });
  socket.on("CloseUpdProspect", (prospect) => {
    prospect.enTraitement = false;

    io.emit("CloseUpdProspect", prospect);
  });
});

httpServer.listen(3000, () => {
  console.log("SERVEUR START");
});



// captcha 
app.post('/verify-recaptcha', async (req, res) => {
  try {
    const { token, recaptchaAction } = req.body;
    const score = await createAssessment({ token, recaptchaAction });
    res.json({ score });
  } catch (error) {
    console.error('Error during reCAPTCHA assessment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
