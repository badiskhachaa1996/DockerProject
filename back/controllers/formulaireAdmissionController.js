const express = require("express");
const { EcoleAdmission } = require("../models/ecoleAdmission");
const { FormationAdmission } = require("../models/formationAdmission");
const { RentreeAdmission } = require("../models/rentreeAdmission");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/RA/create", (req, res) => {
    delete req.body._id
    let f = new RentreeAdmission({ ...req.body })
    f.save()
        .then((FFSaved) => {
            RentreeAdmission.findById(FFSaved._id).populate('ecoles')
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/RA/getByID/:id", (req, res) => {
    RentreeAdmission.findById(req.params.id).populate('ecoles')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/RA/getByEcoleID/:id", (req, res) => {
    RentreeAdmission.find({ ecoles: { $in: [req.params.id] } }).populate('ecoles')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/RA/getAll", (req, res, next) => {
    RentreeAdmission.find().populate('ecoles')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/RA/update", (req, res) => {
    RentreeAdmission.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }).then(doc => {
        RentreeAdmission.findById(req.body._id).populate('ecoles')
            .then((formFromDb) => { console.log(formFromDb); res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})


app.post("/FA/create", (req, res) => {
    delete req.body._id
    let f = new FormationAdmission({ ...req.body })
    f.save()
        .then((FFSaved) => {
            res.status(200).send(FFSaved);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})
app.put("/FA/update", (req, res) => {
    FormationAdmission.findByIdAndUpdate(req.body._id, { ...req.body }, (err, doc) => {
        res.status(200).send(doc);
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/FA/getAll", (req, res, next) => {
    FormationAdmission.find()
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/FA/getByID/:id", (req, res) => {
    FormationAdmission.findById(req.params.id)
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.delete("/FA/delete/:id", (req, res) => {
    FormationAdmission.findByIdAndDelete(req.params.id)
        .then((formFromDb) => {
            res.status(200).send(formFromDb);
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})



app.post("/EA/create", (req, res) => {
    delete req.body._id
    let f = new EcoleAdmission({ ...req.body })
    f.save()
        .then((FFSaved) => {
            EcoleAdmission.findById(FFSaved._id).populate('formations')
                .then((formFromDb) => { res.status(200).send(formFromDb); })
                .catch((error) => { console.error(error); res.status(500).send(error); });
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/EA/getByID/:id", (req, res) => {
    EcoleAdmission.findById(req.params.id).populate('formations')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/EA/getByParams/:params", (req, res) => {
    EcoleAdmission.findOne({ url_form: req.params.params }).populate('formations')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})

app.get("/EA/getAll", (req, res, next) => {
    EcoleAdmission.find().populate('formations')
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.put("/EA/update", (req, res) => {
    EcoleAdmission.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true }, (err, doc) => {
        EcoleAdmission.findById(req.body._id).populate('formations')
            .then((formFromDb) => { res.status(200).send(formFromDb); })
            .catch((error) => { console.error(error); res.status(500).send(error); });
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})



module.exports = app;