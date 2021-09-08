// import 3 librairies
const mongoose = require ("mongoose");
const express= require("express");
const bodyParser = require("body-parser");                   
const cors = require("cors");
const app = express(); //à travers ça je peux faire la création de service
app.use(bodyParser.json({limit: '20mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}))
app.use(cors({origin: "*"}));

mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
        process.exit();
    });


//lors de chargement et lancement du serveur
app.get("/",(req,res)=>res.status(200).send("GG ça marche"));
//il va attendre le lancement du serveur et lire à partir du port 3000 et si il est strated affiche moi le serveur il est up.
app.listen(3000,  ()=>console.log("Node.JS started"));

// const io = socketIo(server);

// io.on('connection',(socket) => {
//     socket.emit('hello', {
//         greeting: 'heelo estya'
//     });
// });



// server.listen(3000,  ()=>{
//     console.log("socket ");
// });
////

///////////
const UserController = require('./controllers/userController');
const ServiceController = require('./controllers/serviceController');
const SujetController = require('./controllers/sujetController');
const messageController = require('./controllers/messageController')
const ticketController = require('./controllers/ticketController');
const notifController = require('./controllers/notificationController')

const { defaultMaxListeners } = require("events");

app.use("/user",UserController);

app.use("/service",ServiceController);

app.use("/sujet",SujetController);

app.use("/message",messageController);

app.use('/ticket',ticketController)

app.use('/notification',notifController)

/*const server = require('http').Server(app);
const io = require('socket.io')(server);
io.on('connection',function (socket)  {
    socket.emit('hello', 
         'heelo estya'
    );

});
server.listen(3000, () => {
    console.log("socket.io est connecté")
 });*/
