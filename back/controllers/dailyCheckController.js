const express = require('express');
const app = express();
app.disable("x-powered-by");
const { DailyCheck } = require('../models/DailyCheck');


// verification du check journalier
app.get("/verif-check-by-user-id/:id", (req, res) => {
    const { id } = req.params;

    // formatage de la date du jour
    let today = new Date().toLocaleDateString();

    DailyCheck.findOne({ user_id: id, today: today }).populate('user_id').populate('commented_by')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { console.error(error); res.status(400).send(error) });
});

// recuperation de la liste des présences de tous les utilisateurs
app.get("/get-checks", (req, res) => {
    DailyCheck.find().populate('user_id').populate('commented_by')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences, veuillez contacter un admin' }) });
});

// recuperation de la liste des présences du jour de tous les utilisateurs
app.get("/get-all-users-daily-checks", (req, res) => {
    const today = new Date().toLocaleDateString();

    DailyCheck.find({ today: today }).populate('user_id').populate('commented_by')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences, veuillez contacter un admin' }) });
});
// recuperation de la liste des présences du jour de tous les utilisateurs
app.post("/get-all-users-date-checks", (req, res) => {
    const today = new Date(req.body.date).toLocaleDateString();

    DailyCheck.find({ today: today }).populate('user_id').populate('commented_by')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(500).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences, veuillez contacter un admin' }) });
});


// recuperation de la liste des présences d'un utilisateur
app.get("/get-user-checks/:userId", (req, res) => {
    const { userId } = req.params;

    DailyCheck.find({ user_id: userId }).populate('user_id').populate('commented_by')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences de l\'utilisateurs' }) });
});

// recuperation de la liste des présences d'un utilisateur
app.get("/getUserChecksByDate/:userId/:date", (req, res) => {
    const { userId } = req.params;
    if (req.params.date != 'null')
        DailyCheck.find({ user_id: userId, check_in: { $gte: `${req.params.date}-01`, $lte: `${req.params.date}-31` } }).populate('user_id').populate('commented_by')
            .then((response) => { res.status(200).send(response); })
            .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences de l\'utilisateurs' }) });
    else
        DailyCheck.find({ user_id: userId }).populate('user_id').populate('commented_by')
            .then((response) => { res.status(200).send(response); })
            .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences de l\'utilisateurs' }) });
});


// recuperation d'une presence via son id
app.get("/get-check/:id", (req, res) => {
    const { id } = req.params;

    DailyCheck.findOne({ _id: id }).populate('user_id').populate('commented_by')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences de l\'utilisateurs' }) });
});

// recuperation d'une presence via son user id
app.get("/get-check-by-user-id/:id", (req, res) => {
    const { id } = req.params;

    DailyCheck.findOne({ user_id: id }).populate('user_id').populate('commented_by')
        .then((response) => { res.status(200).send(response); })
        .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de récupérer la liste des présences de l\'utilisateurs' }) });
});


// méthode de check in
app.post("/post-check-in", (req, res) => {
    const dailyCheck = new DailyCheck({ ...req.body });
    dailyCheck.today = new Date().toLocaleDateString();

    dailyCheck.save()
        .then((response) => { res.status(201).send(response); })
        .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de prendre votre check in en considération' }) });
});

// méthode de mise à jour du check
app.patch("/patch-check-in", (req, res) => {
    console.log(req.body)
    DailyCheck.findByIdAndUpdate(req.body._id, { ...req.body })
        .then((response) => {
            if (response){
                console.log(response,response.commentaire);
                res.status(201).send(response);
            }

            else {
                const dailyCheck = new DailyCheck({ ...req.body });
                dailyCheck.today = new Date().toLocaleDateString();

                dailyCheck.save()
                    .then((response) => { res.status(201).send(response); })
                    .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de prendre votre check in en considération' }) });
            }
        })
        .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de mettre à jour votre check' }); console.error(error) });
});

app.delete('/delete/:id', (req, res) => {

    DailyCheck.findByIdAndDelete(req.params.id)
        .then((response) => { res.status(201).send(response); })
        .catch((error) => { res.status(400).json({ error: error, errorMsg: 'Impossible de supprimer votre check' }) });
});


module.exports = app;