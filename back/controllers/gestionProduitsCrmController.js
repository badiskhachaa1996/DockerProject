const express = require("express");
const { ProduitCRM } = require("../models/produitCRM");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.post("/create", async (req, res) => {
    console.log(req.body)

    delete req.body._id
    let f = new ProduitCRM({...req.body})
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
        const formFromDb = await ProduitCRM.find()
        res.status(200).send(formFromDb);
    } catch (error) {
        console.log(error)
    }
});


//update produit by id
app.put("/update", async (req, res) => {
    let produit = await ProduitCRM.findById(req.body._id)
    if (!produit) return res.status(404).send("Produit introuvable")
    try {
        const formFromDb = await ProduitCRM.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true })
        res.status(200).send(formFromDb);
    } catch (error) {
        console.log(error)
    }
})

app.delete('/delete/:id', async (req, res) => {
    try {
        const formFromDb = await ProduitCRM.findByIdAndRemove(req.params.id)
        res.send(formFromDb).status(200)
    } catch (error) {
        console.log(error)
    }
})


module.exports = app;