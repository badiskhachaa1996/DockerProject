const express = require('express');
const app = express();
app.disable("x-powered-by");
const { CommercialPartenaire } = require('../models/CommercialPartenaire');
const { User } = require('../models/user');
const { Prospect } = require("../models/prospect");
const bcrypt = require("bcryptjs");

//Recuperation de la liste des commerciales
app.get("/getAll", (req, res, next) => {
    CommercialPartenaire.find()
        .then((commercialPartenaires) => { res.status(200).send(commercialPartenaires); })
        .catch((error) => { res.status(400).send(error.message); })
});

app.get("/getAllPopulate", (req, res, next) => {
    CommercialPartenaire.find().populate({ path: 'partenaire_id', populate: { path: 'user_id' } }).populate('user_id')
        .then((commercialPartenaires) => {
            res.status(200).send(commercialPartenaires);
        })
        .catch((error) => { res.status(400).send(error.message); })
});

//Recuperation de la liste des commerciales
app.get("/getAllByPartenaireId/:partenaire_id", (req, res, next) => {
    CommercialPartenaire.find({ partenaire_id: req.params.partenaire_id })
        .then((commercialPartenaires) => { res.status(200).send(commercialPartenaires); })
        .catch((error) => { res.status(400).send(error.message); })
});

app.get("/getAllPopulateByPartenaireID/:partenaire_id", (req, res, next) => {
    CommercialPartenaire.find({ partenaire_id: req.params.partenaire_id }).populate('user_id')
        .then((commercialPartenaires) => { res.status(200).send(commercialPartenaires); })
        .catch((error) => { res.status(400).send(error.message); })
});

//Recuperation d'un commercial partenaire via son id
app.get("/getById/:id", (req, res, next) => {
    CommercialPartenaire.findOne({ _id: req.params.id })
        .then((commercialPartenaire) => { res.status(200).send(commercialPartenaire); })
        .catch((error) => { res.status(500).send(error.message); })
});

//Recuperation d'un commercial partenaire via son code
app.get("/getCommercialDataFromCommercialCode/:code", (req, res, next) => {
    CommercialPartenaire.findOne({ code_commercial_partenaire: req.params.code })
        .then((commercialPartenaire) => { res.status(200).send(commercialPartenaire); })
        .catch((error) => { res.status(500).send(error.message); })
});

//Recuperation d'un commercial partenaire via son code
app.get("/getByCode/:code", (req, res, next) => {
    CommercialPartenaire.findOne({ code_commercial_partenaire: req.params.code }).populate('user_id')
        .then((commercialPartenaire) => { res.status(200).send(commercialPartenaire); })
        .catch((error) => { console.error(error); res.status(500).send(error); })
});

//Recuperation d'un commercial via son id user
app.get("/getByUserId/:id", (req, res, next) => {
    CommercialPartenaire.findOne({ user_id: req.params.id })
        .then((commercialPartenaire) => { res.status(200).send(commercialPartenaire); })
        .catch((error) => { res.status(500).send(error.message); })
});

//Creation d'un nouveau commercial
app.post("/create", (req, res, next) => {
    //Recuperation des données commercial envoyé depuis le front
    const commercialPartenaireData = req.body.newCommercialPartenaire;

    //Suppression de l'id envoyé depuis le front
    delete commercialPartenaireData._id;
    //Creation du nouvel objet CommercialPartenaire
    const commercialPartenaire = new CommercialPartenaire({ ...commercialPartenaireData });

    //recuperation des données user envoyé depuis le front
    const userData = req.body.newUser;

    //Creation du nouvel objet user
    const user = new User(
        {
            civilite: userData.civilite,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phone: userData.phone,
            email: userData.email,
            email_perso: userData.email,
            password: bcrypt.hashSync(userData.password, 8),
            role: userData.role,
            service_id: userData.service_id,
            type: "Commercial",
            entreprise: userData.entreprise,
            pays_adresse: userData.pays_adresse,
            ville_adresse: userData.ville_adresse,
            rue_adresse: userData.rue_adresse,
            numero_adresse: userData.numero_adresse,
            postal_adresse: userData.postal_adresse,
            date_creation: new Date(),
            verifedEmail: true
            //statut_ent:userData?.statut
        });

    //Verification de l'existence de l'utilisateur
    User.findOne({ email: userData.email })
        .then((userFromDb) => {
            if (userFromDb) {
                CommercialPartenaire.findOne({ user_id: userFromDb._id })
                    .then((commercialPartenaireFromDb) => {
                        if (commercialPartenaireFromDb) {
                            res.status(201).json({ error: 'Cet commercial existe déja' });
                        } else {
                            commercialPartenaire.user_id = userFromDb._id;

                            commercialPartenaire.save()
                                .then((commercialPartenaireSaved) => { res.status(201).json({ success: 'Commercial ajouté' }); })
                                .catch((error) => { res.status(400).json({ error: 'Impossible d\'ajouter ce commercial' }) });
                        }
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de verifier l\'existence de ce commercial ' }) });
            }
            else {
                user.save()
                    .then((userCreated) => {
                        commercialPartenaire.user_id = userCreated._id;
                        commercialPartenaire.save()
                            .then((commercialPartenaireCreated) => { res.status(201).json({ success: 'Commercial crée' }) })
                            .catch((error) => { res.status(400).json({ error: 'Impossible de crée ce commercial' }); });
                    })
                    .catch((error) => { res.status(400).json({ error: 'Impossible de créer un nouvel utilisateur ' }); });
            }
        })
        .catch((error) => { res.status(500).json({ error: 'Impossible de verifier l\'existence de l\'utilisateur' }) });
});


//Modification d'un commercial via son id
app.put("/update", (req, res, next) => {

    //Recuperation des infos commerciale
    const commercialData = req.body.commercialToUpdate;

    //Recuperation des infos user
    const userData = req.body.userToUpdate;

    //D'abord on met à jour le commercial
    CommercialPartenaire.findOneAndUpdate({ _id: commercialData._id },
        {
            partenaire_id: commercialData.partenaire_id,
            user_id: commercialData.user_id,
            code_commercial_partenaire: commercialData.code_commercial_partenaire,
            statut: commercialData.statut,
        })
        .then((commercialPartenaires) => {
            //Une fois le commercial mis à jour, on met à jour le user
            User.findOneAndUpdate({ _id: userData._id },
                {
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    phone: userData.phone,
                    email: userData.email,
                    civilite: userData.civilite,
                })
                .then((users) => { res.status(200).json({ 'success': 'Modification reussie' }); })
                .catch((error) => { res.status(500).json({ 'error': 'Problème de modification' }); });
        })
        .catch((error) => { res.status(500).json({ 'error': 'Problème de modification, contactez un administrateur' }); })

});

app.get('/delete/:id', (req, res) => {
    CommercialPartenaire.findById(req.params.id).then(c => {
        Prospect.updateMany({ code_commercial: { $regex: "^" + c.code_commercial_partenaire } }, { code_commercial: "" }, {}, (err, u) => {
            if (err)
                console.error(err)
        })
        User.findByIdAndRemove(c.user_id, {}, (err, u) => {
            if (err)
                console.error(err)
        })
        CommercialPartenaire.findByIdAndRemove(c._id, {}, (err, cdeleted) => {
            if (err)
                console.error(err)
            else
                res.send(cdeleted)
        })
    })
})
const fs = require("fs");
const multer = require("multer");
const { Partenaire } = require('../models/partenaire');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id_photo = req.body.id;
        if (!fs.existsSync("storage/Partenaire/photo/" + id_photo + "/")) {
            fs.mkdirSync("storage/Partenaire/photo/" + id_photo + "/", { recursive: true });
        }
        callBack(null, "storage/Partenaire/photo/" + id_photo + "/");
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`);
    },
});
const upload = multer({ storage: storage, limits: { fileSize: 20000000 } });
//Sauvegarde de la photo de profile
app.post("/file", upload.single("file"), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error("No File");
        error.httpStatusCode = 400;
        return next(error);
    }
    Partenaire.findById(req.body.id, (err, cp) => {
        try {
            if (fs.existsSync("storage/Partenaire/photo/" + req.body.id + "/" + cp?.pathImageProfil))
                fs.unlinkSync("storage/Partenaire/photo/" + req.body.id + "/" + cp?.pathImageProfil);
            //file removed
        } catch (err2) {
            console.error(err2, "Pas de fichier existant")
        }
    });
    Partenaire.findOneAndUpdate(
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
})

app.get("/getProfilePicture/:id", (req, res) => {
    Partenaire.findById(req.params.id, (err, cp) => {

        if (cp && cp.pathImageProfil) {
            try {
                let file = fs.readFileSync(
                    "storage/Partenaire/photo/" + cp.id + "/" + cp.pathImageProfil,
                    { encoding: "base64" },
                    (err2) => {
                        if (err2) {
                            return console.error(err2);
                        }
                    }
                );
                res.send({ file: file, documentType: cp.typeImageProfil });
            } catch (e) {
                res.send({ error: e });
            }
        } else {
            res.send({ error: "Image non défini" });
        }
    });
});

app.put('/newUpdate', (req, res) => {
    CommercialPartenaire.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        if (!err)
            res.send(doc);
        else {
            console.error(err)
            res.status(500).send(err);
        }

    })
})

var mime = require('mime-types')
const path = require('path');

const uploadContrat = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            if (!fs.existsSync('storage/commercial/contrat/' + req.body.id + '/')) {
                fs.mkdirSync('storage/commercial/contrat/' + req.body.id + '/', { recursive: true })
            } else {
                let filenames = fs.readdirSync('storage/commercial/contrat/' + req.body.id + '/')
                if (filenames && filenames[0])
                    fs.unlinkSync('storage/commercial/contrat/' + req.body.id + '/' + filenames[0])
            }
            callBack(null, 'storage/commercial/contrat/' + req.body.id + '/')
        },
        filename: (req, file, callBack) => {
            callBack(null, file.originalname)
        }
    })
    , limits: { fileSize: 10000000 }
})


app.post('/uploadContrat/:id', uploadContrat.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {
        CommercialPartenaire.findByIdAndUpdate(req.params.id, { contrat: file.originalname }, { new: true }, (err, doc) => {
            res.status(201).json(doc);
        })
    }

}, (error) => { res.status(500).send(error); })

app.get("/downloadContrat/:id", (req, res) => {
    let pathFile = "storage/commercial/contrat/" + req.params.id
    fs.readdir(pathFile, (err, files) => {
        if (err) {
            return console.error(err);
        }
        let file = files[0]
        const pathFileFinal = `${pathFile}/${file}`
        let fileFinal = fs.readFileSync(pathFileFinal, { encoding: 'base64' }, (err) => {
            if (err) {
                return console.error(err);
            }
        });
        res.status(201).send({ file: fileFinal, documentType: mime.contentType(path.extname(pathFileFinal)), fileName: file })
    });
});
module.exports = app;
