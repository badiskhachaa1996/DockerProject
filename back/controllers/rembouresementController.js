const express = require('express');
const { Remboursement } = require('../models/Remboursement');
const router = express.Router();

const app = express();
app.post('/newremb', async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const newRemboursement = new Remboursement(req.body);
        const savedRemboursement = await newRemboursement.save();
        console.log('Saved Remboursement:', savedRemboursement);
        res.status(201).json(savedRemboursement);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Erreur lors de la création du remboursement.' });
    }
});


app.get('/getAll',  (req, res) => {
 Remboursement.find().sort({ _id: -1 }).then(r=>{
    res.send(r)
 })
});

app.get('/:id', async (req, res) => {
    try {
        const remboussement = await Remboursement.findById(req.params.id);
        if (!remboussement) {
            return res.status(404).json({ message: 'Remboursement introuvable.' });
        }
        res.status(200).json(remboussement);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du remboursement.' });
    }
});

app.put('/:id', async (req, res) => { 
    try {
        const updatedRemboussement = await Remboursement.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
        });
        if (!updatedRemboussement) {
            return res.status(404).json({ message: 'Remboursement introuvable.' });
        }
        res.status(200).json(updatedRemboussement);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du remboursement.' });
    }
});


app.delete('/:id', async (req, res) => {
    try {
        const deletedRemboussement = await Remboursement.findByIdAndDelete(req.params.id);
        if (!deletedRemboussement) {
            return res.status(404).json({ message: 'Remboursement introuvable.' });
        }
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du remboursement.' });
    }
});
// app.get('/findDemandeByDocNumber/:docNumber', async (req, res) => {
//     const docNumber = req.params.docNumber;
  
//     try {
//       const demande = await findDemandeByDocNumber(docNumber);
  
//       if (!demande) {
//         return res.status(404).json({ message: 'Demande not found' });
//       }
  
//       res.status(200).json(demande);
//     } catch (error) {
//       res.status(500).json({ message: 'Error while retrieving demande' });
//     }
//   });
  

module.exports = app;

