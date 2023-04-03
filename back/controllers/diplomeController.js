const express = require("express");
const app = express();
app.disable("x-powered-by");
const { Diplome } = require("./../models/diplome");
const multer = require('multer');
const fs = require("fs")

app.post("/creatediplome", (req, res) => {
    //Ajout d'un diplôme
    let data = req.body;
    let diplome = new Diplome({
        ...data
    });
    diplome.save().then((diplomeFromDB) => {
        res.status(200).send(diplomeFromDB);
    }).catch((error) => {
        console.error(error)
        res.status(404).send(error);
    })
});

app.post("/editById/:id", (req, res) => {
    //Modifier un diplome
    Diplome.findByIdAndUpdate(req.params.id,
        {
            ...req.body

        }, { new: true }, (err, diplome) => {
            if (err) {
                res.status(500).send(err)
            }
            else {
                res.send(diplome)
            }
        });
});

app.get("/getAll", (req, res) => {
    //Récupérer tous les diplomes
    Diplome.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
        .catch(error => {
            console.error(error);
        })
});

app.get("/getAllPopulate", (req, res) => {
    //Récupérer tous les diplomes
    Diplome.find().then(result => {
        res.send(result.length > 0 ? result : [])
    })
        .catch(error => {
            console.error(error);
        })
});

app.get("/getById/:id", (req, res) => {
    //Récupérer un diplome via un id
    Diplome.findOne({ _id: req.params.id }).then((diplome) => {
        res.status(200).send(diplome);
    }).catch((error) => {
        res.status(404).send(error);
    })
});


app.get("/getAllByCampus/:id", (req, res) => {
    //Récupérer un diplome via un campus
    Diplome.find({ campus_id: req.params.id }).then((datadiplome) => {
        res.status(200).send(datadiplome);
    }).catch((error) => {
        res.status(404).send(error);
    })

});

//Sauvegarde de la photo de profile
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        let id = req.body.id
        if (!fs.existsSync('storage/diplomeFiles/' + id + '/')) {
            fs.mkdirSync('storage/diplomeFiles/' + id + '/', { recursive: true })
        }
        callBack(null, 'storage/diplomeFiles/' + id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } })
//Sauvegarde de la photo de profile
app.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    Diplome.findById(req.body.id, (err, diplome) => {
        let FileList = diplome.imgNames
        let TypeList = diplome.imgTypes
        if (FileList.indexOf(file.originalname) != -1) {
            TypeList[FileList.indexOf(file.originalname)] = file.mimetype
        } else {
            FileList.push(file.originalname)
            TypeList.push(file.mimetype)
        }
        Diplome.findOneAndUpdate({ _id: req.body.id }, {
            imgNames: FileList,
            imgTypes: TypeList
        }, (errUser, user) => {
            if (errUser) {
                console.error(errUser)
            }
            //Renvoie de la photo de profile au Front pour pouvoir l'afficher
            res.send({ message: "Photo mise à jour", FileList, TypeList });

        })
    })
})

app.get('/getFile/:id/:name', (req, res) => {
    Diplome.findById(req.params.id, (err, diplome) => {
        try {
            if (diplome.imgNames.indexOf(req.params.name) != -1) {
                let file = fs.readFileSync("storage/diplomeFiles/" + req.params.id + '/' + req.params.name, { encoding: 'base64' }, (err2) => {
                    if (err2) {
                        return console.error(err2);
                    }
                });
                res.status(201).send({ file: file, documentType: diplome.imgTypes[diplome.imgNames.indexOf(req.params.name)] })
            } else {
                res.status(404).send({ error: req.params.name + " not found in list", imgNames: diplome.imgNames })
            }
        } catch (e) {
            res.status(400).send({ error: e })
        }
    })
});

module.exports = app;