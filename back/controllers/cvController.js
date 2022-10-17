const { CV } = require("../models/cv");

const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");
app.post("/create", (req, res) => {
    //Sauvegarde d'un cv
    delete req.body._id
    let cv = new CV(
        {
            ...req.body
        });

    cv.save()
        .then((cvsaved) => { res.status(201).send(cvsaved) })
        .catch((error) => {
            console.error(error)
            res.status(400).send(error);
        });
});

app.get("/getAll", (req, res) => {
    CV.find().then(cvs => {
        res.status(201).send(cvs)
    }, err => {
        console.error(err)
        res.status(500).send(err)
    })
})
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (!fs.existsSync('storage/CV/' + req.body.id + '/')) {
            fs.mkdirSync('storage/CV/' + req.body.id + '/', { recursive: true })
        }
        callBack(null, 'storage/CV/' + req.body.id + '/')
    },
    filename: (req, file, callBack) => {
        callBack(null, "cv.pdf")//`${file.originalname}`
    }
})
const upload = multer({ storage: storage, limits: { fileSize: 1000000 } })
app.post('/uploadCV/:user_id', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        res.status(400).send(error)
    } else {

        res.status(201).json({ dossier: "dossier mise à jour" });
    }

}, (error) => { res.status(500).send(error); })