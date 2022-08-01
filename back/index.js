const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
//const scrypt_Mail = require("./middleware/scrypt_Mail");
// var CronJob = require('cron').CronJob;

app.use(bodyParser.json({ limit: '20mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
let origin = ["http://localhost:4200"]
if (process.argv[2]) {
    let argProd = process.argv[2]
    if (argProd.includes('dev')) {
        origin = ["https://t.dev.estya.com"]
    } else (
        origin = ["https://ims.estya.com", "https://ticket.estya.com", "https://estya.com", "https://adgeducations.com", "https://eduhorizons.com", "https://espic.com", "http://partenaire.eduhorizons.com", "http://login.eduhorizons.com"]
    )
}
app.use(cors({ origin: origin }));

const httpServer = require("http").createServer(app);
const options = {
    cors: {
        origin: origin,
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }, allowEIO3: true
};
const io = require("socket.io")(httpServer, options);

mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.\nL'origin est:" + origin);
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
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
        process.exit();
    });

const UserController = require('./controllers/userController');
const ServiceController = require('./controllers/serviceController');
const SujetController = require('./controllers/sujetController');
const messageController = require('./controllers/messageController');
const ticketController = require('./controllers/ticketController');
const notifController = require('./controllers/notificationController');
const classeController = require('./controllers/classeController');
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
const rbc = require('./controllers/rachatBulletinController')
const contactController = require('./controllers/contactController');
const prestataireController = require('./controllers/prestataireController');
const historiqueController = require('./controllers/historiqueController');
const prospectController = require('./controllers/prospectController');
const partenaireController = require('./controllers/partenaireController');
const commercialPartenaireController = require('./controllers/commercialPartenaireController');
const appreciationController = require('./controllers/appreciationController');
const historiqueEchangeController = require('./controllers/historiqueEchangeController');
const forfeitFormController = require('./controllers/forfeitFormController');
const { User } = require("./models/user");
const { scrypt } = require("crypto");

app.use('/', function (req, res, next) {
    let token = jwt.decode(req.header("token"))
    if (token && token['prospectFromDb']) {
        token = token['prospectFromDb']
    }
    if (token && token.id && token.role) {
        User.findOne({ _id: token.id, role: token.role }, (err, user) => {
            if (err) {
                console.error(err)
                res.status(403).send("Accès non autorisé, Erreur", err)
            }
            else if (user) {
                jwt.verify(req.header("token"), '126c43168ab170ee503b686cd857032d', function (errToken, decoded) {
                    if (req.originalUrl.startsWith('/soc/user/HowIsIt')) {
                        next()
                    } else if (decoded == undefined) {
                        if (errToken.name == "JsonWebTokenError") {
                            //Token Incorrect
                            res.status(403).send(errToken)
                        } else if (errToken.name == "TokenExpiredError") {
                            //Token Expired
                            res.status(401).send(errToken)
                        }
                    } else {
                        next()
                    }
                });
            } else {
                console.error(user)
                res.status(403).send("Accès non autorisé, User not found")
            }
        })
    } else {
        if (req.originalUrl == "/soc/user/AuthMicrosoft" || req.originalUrl == "/soc/partenaire/inscription" || req.originalUrl.startsWith('/soc/prospect/')
            || req.originalUrl == "/soc/user/login" || req.originalUrl.startsWith("/soc/user/getByEmail") ||
            req.originalUrl.startsWith('/soc/forfeitForm') || req.originalUrl.startsWith('/soc/user/HowIsIt') || req.originalUrl.startsWith('/soc/user/pwdToken') || req.originalUrl == "/soc/partenaire/getNBAll" || req.originalUrl.startsWith('/soc/user/reinitPwd')) {
            next()
        } else {
            res.status(403).send("Accès non autorisé, Wrong Token\n" + req.originalUrl)
        }
    }
});

app.use('/soc/rachatBulletin', rbc)

app.use("/soc/user", UserController);

app.use("/soc/service", ServiceController);

app.use("/soc/sujet", SujetController);

app.use("/soc/message", messageController);

app.use('/soc/ticket', ticketController);

app.use('/soc/notification', notifController);

app.use('/soc/classe', classeController);

app.use('/soc/anneeScolaire', anneeScolaireController);

app.use('/soc/ecole', ecoleController);

app.use('/soc/campus', campusController);

app.use('/soc/diplome', diplomeController);

app.use('/soc/presence', presenceController);

app.use('/soc/seance', seanceController);

app.use('/soc/formateur', formateurController);

app.use('/soc/ressource', ressourceController);

app.use('/soc/etudiant', etudiantController);

app.use('/soc/matiere', matiereController);

app.use('/soc/note', noteController);

app.use('/soc/entreprise', entrepriseController);

app.use('/soc/examen', examenController);

app.use('/soc/prestataire', prestataireController);

app.use('/soc/historique', historiqueController);

app.use('/soc/partenaire', partenaireController);

app.use('/soc/commercialPartenaire', commercialPartenaireController);

app.use('/soc/appreciation', appreciationController);

app.use('/soc/prospect', prospectController)

app.use('/soc/historiqueEchange', historiqueEchangeController)

app.use('/soc/forfeitForm', forfeitFormController)
app.use('/soc/contact', contactController)

io.on("connection", (socket) => {
    //Lorsqu'un utilisateur se connecte il rejoint une salle pour ses Notification
    socket.on('userLog', (user) => {
        LISTTOJOIN = [user._id, (user.service_id) ? user.service_id : user.role]
        socket.join(LISTTOJOIN)
        console.log("User join: " + LISTTOJOIN)
    })

    //Lorsqu'une nouvelle Notification est crée, alors on l'envoi à la personne connecté
    socket.on('NewNotif', (data) => {
        console.log(data)
        if (data?.user_id) {
            io.to(data?.user_id).emit('NewNotif', data)
            io.emit(data, { NewNotif: data });
        }
        else {
            io.to(data?.service_id).emit('NewNotif', data)
            io.emit(data, { NewNotif: data });
        }

    })

    socket.on('reloadNotif', (data) => {
        io.to(data.id).emit('reloadNotif')
    })

    socket.on('reloadImage', (data) => {
        io.to(data).emit('reloadImage')
    })

    //Si un user ajoute un nouveau ticket --> refresh les tickets queue d'entrée du service du ticket des Agents et de l'admin
    socket.on('AddNewTicket', (service_id) => {
        io.to("Admin").to(service_id).emit('refreshQueue')
    })

    //Si un agent répond à un ticket --> refresh les messages du ticket de l'user et le ticket (à cause du statut) + AllTickets du service et des admins
    socket.on('NewMessageByAgent', (data) => {
        //Refresh du message de l'user et des tickets (à cause du statut)
        io.to(data.user_id).emit('refreshMessage')
        //Refresh du 3ème tableau du service (à cause du Tableau)
        io.to("Admin").to(data.service_id).emit('refresh3emeTableau')
    })

    //Si un user répond à un ticket --> refresh les messages du ticket de l'agent
    socket.on('NewMessageByUser', (agent_id) => {
        io.to(agent_id).emit('refreshMessage')
    })

    //Si un agent affecte ou accepte un ticket --> refresh les tickets d'un admin et les tickets de queue d'entrée et de mon service des agents et du créateur
    socket.on('refreshAll', (data) => {
        //refresh les tickets d'un admin et les tickets de queue d'entrée et de mon service des agents)
        io.to('Admin').to(data.service_id).emit('refreshAllTickets')
        //Refresh les tickets suivi de l'user
        io.to(data.user_id).emit('refreshSuivi')
    })

    socket.on('addPresence', () => {
        io.emit('refreshPresences')
    })

    socket.on('isAuth', (b) => {
        io.emit('isAuth', b)
    })
    socket.on('TraitementProspect', (prospect) => {
        prospect.enTraitement = true;
        io.emit('TraitementProspect', prospect)
        setTimeout(function () {
            prospect.enTraitement = false;
            io.emit('TraitementProspect', prospect)
        }, 20000);
    })

    socket.on('UpdatedProspect', (prospect) => {
        prospect.enTraitement = false;

        io.emit('UpdatedProspect', prospect)

    })
    socket.on('CloseUpdProspect', (prospect) => {
        prospect.enTraitement = false;

        io.emit('CloseUpdProspect', prospect)

    })


});

httpServer.listen(3000, () => {
    console.log("SERVEUR START")
});
