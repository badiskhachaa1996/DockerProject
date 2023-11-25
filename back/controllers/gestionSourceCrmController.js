const express = require("express");
const { SourceCRM } = require("../models/sourceCRM");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", async (req, res) => {
    console.log(req.body)

    delete req.body._id
    let f = new SourceCRM({...req.body})
    try {
        const formFromDb = await f.save()
        res.status(201).send(formFromDb)
    }
    catch (error) {
        console.log(error)
    }

})

app.get("/getAll",  async (req, res, next) => {
    try {
        const formFromDb = await SourceCRM.find()
        res.status(200).send(formFromDb);
    } catch (error) {
        console.log(error)
    }
});


//update produit by id
app.put("/update", async (req, res) => {
    let produit = await SourceCRM.findById(req.body._id)
    if (!produit) return res.status(404).send("Source introuvable")
    try {
        const formFromDb = await SourceCRM.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true })
        res.status(200).send(formFromDb);
    } catch (error) {
        console.log(error)
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const formFromDb = await SourceCRM.findByIdAndRemove(req.params.id)
        res.send(formFromDb).status(200)
    } catch (error) {
        console.log(error)
    }
})


module.exports = app;