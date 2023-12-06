const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Ecole } = require("./../models/ecole");

/* Partie dedié à l'upload de fichier */
//Importation de multer
const multer = require("multer");
const fs = require("fs");

//Envoi de logo
const logoStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id;
        let link = 'storage/ecole/' + id;
        if (!fs.existsSync(link)) {
            fs.mkdirSync(link, { recursive: true });
        }

        callBack(null, link);
    },
    filename: (req, file, callBack) => {
        callBack(null, 'logo.png')
    }
});

const uploadLogo = multer({ storage: logoStorage });

app.post("/sendLogo", uploadLogo.single("file"), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier chargé');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(200).send('file');
});

//Envoi de cachet
const cachetStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id;
        let link = 'storage/ecole/' + id;
        if (!fs.existsSync(link)) {
            fs.mkdirSync(link, { recursive: true });
        }
        callBack(null, link);
    },
    filename: (req, file, callBack) => {
        callBack(null, 'cachet.png');
    }
});

const uploadCachet = multer({ storage: cachetStorage });

app.post("/sendCachet", uploadCachet.single('file'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(200).send('file');
});


//Envoi du pied de page
const pPStorage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id;
        let link = 'storage/ecole/' + id;

        if (!fs.existsSync(link)) {
            fs.mkdirSync(link, { recursive: true });
        }
        callBack(null, link);
    },
    filename: (req, file, callBack) => {
        callBack(null, 'pied_de_page.png');
    }
});

const uploadPp = multer({ storage: pPStorage });

app.post("/sendPp", uploadPp.single('file'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Aucun fichier choisis');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.status(200).send('file');
});
/* end */



app.post("/createecole", (req, res) => {
    //Ajouter une école
    let data = req.body;
    let ecole = new Ecole({
        libelle: data.libelle,
        annee_id: data.annee_id,
        ville: data.ville,
        pays: data.pays,
        adresse: data.adresse,
        email: data.email,
        site: data.site,
        telephone: data.telephone,
        logo: data.logo,
    });
    ecole.save().then((ecoleFromDB) => {
        res.status(200).send(ecoleFromDB);
    }).catch((error) => {
        res.status(404).send(error);
    })

});

app.put("/editById", (req, res) => {
    Ecole.findByIdAndUpdate(req.body._id,
        {
            libelle: req.body.libelle,
            annee_id: req.body.annee_id,
            ville: req.body.ville,
            pays: req.body.pays,
            adresse: req.body.adresse,
            email: req.body.email,
            site: req.body.site,
            telephone: req.body.telephone,
            logo: req.body?.logo,
            cachet: req.body?.cachet,
            pied_de_page: req.body?.pied_de_page

        }).then((ecoleFromDB) => {
            res.status(201).send(ecoleFromDB);
        }).catch((error) => {
            res.status(400).send(error);
        })

});

app.get("/getAll", (req, res) => {
    //Récupérer toutes les écoles
    Ecole.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
        .catch((error) => {
            console.error(error);
        })
});

app.get("/getById/:id", (req, res) => {
    //Récupérer une école via un ID
    Ecole.findOne({ _id: req.params.id }).then((dataEcole) => {
        res.status(200).send({ dataEcole });
    }).catch((error) => {
        res.status(404).send(error);
    })
})

app.get("/getAllByAnnee/:id", (req, res) => {
    //Récupérer une école via une année scolaire
    Ecole.find({ annee_id: req.params.id }).then((dataAnneeScolaire) => {
        res.status(200).send(dataAnneeScolaire);
    }).catch((error) => {
        res.status(404).send(error);
    })
});
app.get("/downloadCachet/:id", (req, res) => {
    Ecole.findById(req.params.id).then(data => {
        res.sendFile('storage/ecole/' + data._id + "/cachet.png", { root: "./" }, function (err) {
            if (err)
                console.error(err)
        })
    })
})
app.get("/downloadLogo/:id", (req, res) => {
    Ecole.findById(req.params.id).then(data => {
        res.sendFile('storage/ecole/' + data._id + "/logo.png", { root: "./" }, function (err) {
            if (err)
                console.error(err)
        })
    })
})
app.get("/downloadPied/:id", (req, res) => {
    Ecole.findById(req.params.id).then(data => {
        res.sendFile('storage/ecole/' + data._id + "/pied_de_page.png", { root: "./" }, function (err) {
            if (err)
                console.error(err)
        })

    })
})

app.get("/saveColor/:id/:hex_color", (req, res) => {
    Ecole.findByIdAndUpdate(req.params.id, { color: "#" + req.params.hex_color }, { new: true }, (err, doc) => {
        if (err) {
            console.error(err)
            res.status(500).send(error)
        }
        else
            res.send(doc)
    })
})
module.exports = app;
