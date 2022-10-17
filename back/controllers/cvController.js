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