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
    //Lorsqu'un utilisateur se connecte il rejoint une salle pour ses Notification
    socket.on('userLog', (user) => {
        console.log(user._id+" connecté")
        socket.join(user._id)
        if(user.service_id){
            socket.join(user.service_id)
        }else{
            socket.join(user.role)
        }
        
    })

    //Lorsqu'une nouvelle Notification est crée, alors on l'envoi à la personne connecté
    socket.on('NewNotif', (data) => {
        console.log("Nouvelle notif pour: "+data.user_id)
        io.to(data.user_id).emit('NewNotif', data)
        io.emit(data,{NewNotif:  data});
    })

    socket.on('reloadNotif',(data)=>{
        io.to(data.id).emit('reloadNotif')
    })

    socket.on('reloadImage',(data)=>{
        io.to(data).emit('reloadImage')
    })

    socket.on('refreshServiceTicket',(service_id)=>{
        io.to(service_id).emit('refreshServiceTicket')
    })

    socket.on('refreshServiceTicket',(service_id)=>{
        io.to(service_id).emit('refreshServiceTicket')
    })

});

httpServer.listen(3000, () => {
    console.log("SERVEUR START")
});
