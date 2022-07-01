const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Inscription } = require("./../models/inscription");
const { User } = require("./../models/user");
const nodemailer = require('nodemailer');
const fs = require("fs");
const bcrypt = require("bcryptjs");
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
       

        if (!fs.existsSync('storage/preinscription/' + req.body.id + '/' + req.body.document + '/')) {
            
            fs.mkdirSync('storage/preinscription/' + req.body.id + '/' + req.body.document + '/', { recursive: true })

        }
        callBack(null, 'storage/preinscription/' + req.body.id + '/' + req.body.document + '/')

    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } })


let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'admission@estya.com',
        pass: 'ADMIelite19',
    },
});


/*app.post("/create", (req, res) => {
    //Ajouter une inscription pour un user existant ( réinscription)
    let data = req.body;

    let inscription = new Inscription({
        user_id: null,
        statut: data.statut,
        diplome: data.diplome,

    });
    inscription.save().then((inscriptionFromDB) => {
        res.status(200).send(inscriptionFromDB);
    }).catch((error) => {
        res.status(404).send(error);
    })

}); */
//supression d'une préinscription
app.get("/deleteById/:id", (req, res) => {
    Inscription.findByIdAndRemove(req.params.id, (err, user) => {
       
        if (err) {
            res.send(err)
        }
        res.send(user)
    })
});
// Ajouter une premiere inscription implique creation d'un user 
app.post("/firstInscription", (req, res) => {

    let data = req.body.fInscription;

   
    let inscription = new Inscription({

        user_id: null,
        statut: data.statut,
        diplome: data.diplome,
        nationalite: data.nationalite,
        date_naissance: data.date_naissance,
        code_partenaire:data.code_partenaire

    });

    //Creation du nouveau user
    let userData = req.body.newUser;

    let user = new User({

        civilite:  userData.civilite,
        firstname: userData.firstname,
        lastname: userData.lastname,
        indicatif: userData.indicatif,
        phone: userData.phone,
        email: userData.firstname.slice(0, 1) + "." + userData.lastname+userData.postal_adresse + "@estya.com",
        email_perso: userData.email_perso,
        password: bcrypt.hashSync(userData.password, 8),
        role: "user",
        service_id: null,
        type: null,
        entreprise: null,
        pays_adresse: userData.pays_adresse,
        ville_adresse:  userData.ville_adresse,
        rue_adresse:  userData.rue_adresse,
        numero_adresse:  userData.numero_adresse,
        postal_adresse:  userData.postal_adresse,
        date_creation: new Date()
    });
    //vérification de l'existence du user
    User.findOne({ email_perso: userData.email_perso })
        .then((userFromDb) => {
            let userFromdb = userFromDb
            if (userFromdb) {

              
                inscription.user_id = userFromdb._id;
              
                res.status(401).json({ error: ' Email saisie est deja existante !' })
            }

            else {

                user.save().then((userCreated) => {
                    inscription.user_id = userCreated._id;
                    inscription.save()
                        .then((inscriptionCreated) => {
                           

                            let htmlmail = '<p>Bonjour, </p><p style="color:black"> <span style="color:orange">Felicitations ! </span> Votre préinscription  chez ESTYA University a été enregistré avec succés.</p><p style="color:black">Connectez vous avec votre email et le mot de passe : <strong> ' + userCreated.firstname + '@2022  </strong>  sur <a href="https://t.dev.estya.com/etatpreinscription">www.estya.com/etatpreinscription</a>    pour suivre les étapes d\'inscription .</p><p style="color:black">Cordialement.</p><footer><img  src="red"> </footer>';
                            let mailOptions = {
                                from: 'admission@estya.com',
                                to: userCreated.email_perso,
                                subject: 'Estya-EMS',
                                html: htmlmail,
                                attachments: [{
                                    filename: 'EUsign.png',
                                    path: 'assets/EUsign.png',
                                    cid: 'red' //same cid value as in the html img src
                                }]
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.error(error);
                                    
                                }
                                console.log("Email inscription envoyé à"+userCreated.email_perso)
                               
                            });
                            res.status(201).json({ success: 'Inscription crée' })
                        }
                        )
                        .catch((error) => { res.status(400).json({ error: error }) });
                })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' + error.message }) });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur ' }) });

});
//Modifier une inscription par ID
app.post("/editStatutById/:id", (req, res) => {
    
    let email_perso = req.body[1]
    Inscription.findOneAndUpdate({ _id: req.params.id },
        {

            statut: req.body[0].statut,

        }).then((inscriptionupd) => {


            let htmlmail = '<p>Bonjour, </p><p style="color:black"> <span style="color:orange">Felicitations ! </span> l\'etat de votre préinscription  chez ESTYA University a été mise a jour .</p> <p style="color:green">Votre Dossier d\'admission est validé.</p><span></span><p style="color:black">Connectez vous sur www.estya.com/etatpreinscription ,pour suivre les étapes d\'inscription .</p><p style="color:black">Cordialement.</p><footer> <img  src="red" ></footer>';
            let mailOptions = {
                from: 'ems_no_reply@estya.com',
                to: email_perso,
                subject: 'Estya-EMS',
                html: htmlmail,
                attachments: [{
                    filename: 'EUsign.png',
                    path: 'assets/EUsign.png',
                    cid: 'red' //same cid value as in the html img src
                }]
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error(error);
                }
            });

            res.status(201).send(inscriptionupd);

        }).catch((error) => {
            console.error(error)
            res.status(400).send(error);
        });
})

app.get("/getAll", (req, res) => {
    //Récupérer toutes les inscription
    Inscription.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
        .catch((error) => {
            console.error(error);
        })
});

app.get("/getAllByCode/:code", (req, res) => {
    Inscription.find().then(result => {
        let p = []
        result.forEach(d=>{
            if(d.code_partenaire==req.params.code){
                p.push(d)
            }
        })
        res.send(p)
    })
});

app.get("/getById/:id", (req, res) => {

    Inscription.findOne({ _id: req.params.id }).then((dataInscription) => {
        res.status(200).send({ dataInscription });
    }).catch((error) => {
        res.status(404).send(error);
    })
})

app.get("/getByUserId/:user_id", (req, res) => {

    Inscription.findOne({ user_id: req.params.user_id }).then((dataInscription) => {

        res.status(200).send(dataInscription);
    })
        .catch(err => {
            res.status(404).send(err);
            console.error(err);
        })
})

app.get("/getByEmail/:email", (req, res) => {

    Inscription.findOne({ email_perso: req.params.email }).then((dataInscription) => {
        res.status(200).send(dataInscription);
    })
        .catch(err => {
            res.status(404).send(err);
            console.error(err);
        })
})

//Charger un fichier 
app.post('/uploadFile/:id_preins', upload.single('file'), (req, res, next) => {

    id_inscription = req.body.id
    const file = req.file;
   

    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }


    res.send({ message: "dossier mise à jour" });
   

})
let id_inscription;

app.post("/downloadFile/:id/:directory/:filename", (req, res) => {
  
    let file = fs.readFileSync("storage/preinscription/" + req.params.id + "/" + req.params.directory + "/" + req.params.filename, { encoding: 'base64' }, (err) => {
        if (err) {
            return console.error(err);
        }
    });

    res.status(200).send({ file: file, documentType: file.documentType })

});

app.get("/getFilesInscri/:id", (req, res) => {
    // recupére
    let filesTosend = [];
    fs.readdir('./storage/preinscription/' + req.params.id + "/", (err, files) => {
        if (err) {

        }
        else {

            files.forEach(file => {

                if (!fs.lstatSync('./storage/preinscription/' + req.params.id + "/" + file).isDirectory()) {
                    filesTosend.push(file)
                }
                else {
                    let files = fs.readdirSync('./storage/preinscription/' + req.params.id + "/" + file)
                    if (err) {
                      

                    }
                    else {
                        files.forEach(f => {
                            filesTosend.push(file + "/" + f)
                           
                        });
                    }
                }
            });
        }
      
        res.status(200).send({ filesTosend });
    })

})




module.exports = app;