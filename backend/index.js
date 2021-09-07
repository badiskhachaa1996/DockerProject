// import 3 librairies
const mongoose = require ("mongoose");
const express= require("express");
const bodyParser = require("body-parser");                   
const cors = require("cors");
const nodemailer = require("nodemailer");
const socketIo = require("socket.io");
const io = socketIo(server);
const app = express(); //à travers ça je peux faire la création de service
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
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

io.on('connection',function (socket)  {
    socket.emit('hello',
       'heelo estya'
    );
});
server.listen(3000,() => {
     console("socket is listenning on port 3000");
});
////
// app.post("/sendmail",(req,res) => {
//       console.log("request came");
//       let user = req.body;
//       SendmailTransport(user, info => {
//      console.log("L'email est envoyé et id est  ${info.messageId}");
//          res.send(info);
//       });
// });
// async function sendMail(user,callback) {
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth:{
//             user: "estya-ticketing@estya.com",
//             pass: "ESTYA@@2021"
//         }
//     });
//     let mailOptions = {
//        from: '"estya-ticketing@estya.com"',
//        to: "farahouasrhir1999@gmail.com",
//        subject: "Welcome to Ticketing",
//        html: '<h1>Hi  ${user.name}<h1><br> <h4> Thanks for joining us </h4>'
//     };

//     let info = await transporter.sendMail(mailOptions);

//     callback(info);

// }
///////////
const UserController = require('./controllers/userController');
const ServiceController = require('./controllers/serviceController');
const SujetController = require('./controllers/sujetController');
const messageController = require('./controllers/messageController')
const ticketController = require('./controllers/ticketController');
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const { defaultMaxListeners } = require("events");

app.use("/user",UserController);

app.use("/service",ServiceController);

app.use("/sujet",SujetController);

app.use("/message",messageController);

app.use('/ticket',ticketController)