// import 3 librairies
const mongoose = require ("mongoose");
const express= require("express");
const bodyParser = require("body-parser");                   
const cors = require("cors");
const app = express(); //à travers ça je peux faire la création de service
app.use(bodyParser.json());
app.use(cors());

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

const UserController = require('./controllers/userController')
app.use("/user",UserController)