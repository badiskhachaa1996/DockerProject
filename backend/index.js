const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json({ limit: '20mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
app.use(cors({ origin: "http://localhost:4200" }));

const httpServer = require("http").createServer(app);
const options = {
    cors: {
        origin: "http://localhost:4200",
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

const { defaultMaxListeners } = require("events");

app.use("/user", UserController);

app.use("/service", ServiceController);

app.use("/sujet", SujetController);

app.use("/message", messageController);

app.use('/ticket', ticketController)

app.use('/notification', notifController)

io.on("connection", (socket) => {
<<<<<<< HEAD
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  
    socket.on("send.notification",function(data){
        io.emit("new-notification", data)
    });

  });

  

httpServer.listen(3000,()=>{
=======
    //Lorsqu'un utilisateur se connecte il rejoint une salle pour ses Notification
    socket.on('userLog', (user) => {
        console.log("User "+ user._id + " connecté")
        socket.join(user._id)
    })

    //Lorsqu'une nouvelle Notification est crée, alors on l'envoi à la personne connecté
    socket.on('NewNotif', (data) => {
        console.log("Je dois envoyer une notification à "+ data.userid)
        io.to(data.userid).emit('NewNotif', data.notif)
    })
});

httpServer.listen(3000, () => {
>>>>>>> b22742ac0a1976bc341f6307ae41a498c8ac5bf7
    console.log("SERVEUR START")
});
