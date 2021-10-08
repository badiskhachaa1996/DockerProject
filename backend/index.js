const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json({ limit: '20mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))

const origin = require("./config")

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
        console.log("L'api s'est connecté à MongoDB.");
    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
        process.exit();
    });

const UserController = require('./controllers/userController');
const ServiceController = require('./controllers/serviceController');
const SujetController = require('./controllers/sujetController');
const messageController = require('./controllers/messageController')
const ticketController = require('./controllers/ticketController');
const notifController = require('./controllers/notificationController')
const classeController = require('./controllers/classeController')

const { defaultMaxListeners } = require("events");

app.use("/soc/user", UserController);

app.use("/soc/service", ServiceController);

app.use("/soc/sujet", SujetController);

app.use("/soc/message", messageController);

app.use('/soc/ticket', ticketController)

app.use('/soc/notification', notifController)

app.use('/soc/classe', classeController)

io.on("connection", (socket) => {
    //Lorsqu'un utilisateur se connecte il rejoint une salle pour ses Notification
    socket.on('userLog', (user) => {
        LISTTOJOIN = [user._id,(user.service_id)?user.service_id:user.role]
        socket.join(LISTTOJOIN)
        console.log("User Join: "+LISTTOJOIN)
    })

    //Lorsqu'une nouvelle Notification est crée, alors on l'envoi à la personne connecté
    socket.on('NewNotif', (data) => {
        io.to(data.user_id).emit('NewNotif', data)
        io.emit(data, { NewNotif: data });
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
        console.log('refreshMessage SOC')
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
});

httpServer.listen(3000, () => {
    console.log("SERVEUR START")
});
