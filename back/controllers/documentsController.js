// const express = require('express');
// const { DocumentDem } = require('../models/DocumentDem');
// const router = express.Router();
// const app = express();
// app.post('/newDoc', async (req, res) => {
//     try {
//         console.log('Request Body:', req.body);
//         const newDocumentDem = new DocumentDem(req.body);
//         const savedDocumentDem = await newDocumentDem.save();
//         console.log('Saved Remboursement:', savedDocumentDem);
//         res.status(201).json(savedDocumentDem);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Erreur lors de la création du document.' });
//     }
// });
// app.get('/:id', async (req, res) => {
//     try {
//         const document = await DocumentDem.findById(req.params.id);
//         if (!DocumentDem) {
//             return res.status(404).json({ message: 'document introuvable.' });
//         }
//         res.status(200).json(document);
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la récupération du document.' });
//     }
// });
// app.put('/:id', async (req, res) => {
//     try {
//         const updatedDocumentDem = await DocumentDem.findByIdAndUpdate(req.params.id, req.body, {
//             new: true, 
//         });
//         if (!updatedDocumentDem) {
//             return res.status(404).json({ message: 'document introuvable.' });
//         }
//         res.status(200).json(updatedDocumentDem);
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la mise à jour du document.' });
//     }
// });
// app.delete('/:id', async (req, res) => {
//     try {
//         const deletedDocumentDem = await DocumentDem.findByIdAndDelete(req.params.id);
//         if (!deletedDocumentDem) {
//             return res.status(404).json({ message: 'document introuvable.' });
//         }
//         res.status(204).send(); 
//     } catch (error) {
//         res.status(500).json({ message: 'Erreur lors de la suppression du remboursement.' });
//     }
// });

// module.exports = app;