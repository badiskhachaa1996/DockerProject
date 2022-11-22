const mongoose = require("mongoose");
var XLSX = require('xlsx')

const { Classe } = require('../models/classe')
const { Diplome } = require('../models/diplome')
const { User } = require('../models/user.js')
const { Etudiant } = require('../models/etudiant')
const prompt = require('prompt-sync')();
let dicClasse = {}
let listClasse = []
mongoose
    .connect(`mongodb://localhost:27017/b`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Start")
        let listDATA = ['DATA_COMMERCE.xlsx']//'DATA_MANAGEMENT.xlsx'
        listDATA.forEach(doc_name => {
            var workbook = XLSX.readFile(doc_name);
            var sheet_name_list = [workbook.SheetNames[0]];
            Classe.find({ abbrv: /ESTYA Paris/i }).populate('diplome_id').then(classes => {
                classes.forEach(c => {
                    dicClasse[c.abbrv] = c
                    listClasse.push(c.abbrv)
                })
                sheet_name_list.forEach(sheet => {
                    let classe_id = ""
                    Classe.find({ abbrv: /ESTYA Paris/i }).then(classes => {
                        if (classes.length == 1)
                            classe_id = dicClasse[classes[0].abbrv]._id
                        else {
                            let i = 1
                            classes.forEach(c => {
                                console.log(i, ':', c.abbrv)
                                i++
                            })
                            let r = parseInt(prompt("Quel classe correspond à " + sheet + " ?\n"))
                            classe_id = dicClasse[classes[r - 1].abbrv]._id
                        }
                        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                        xlData.forEach(data => {
                            if (data['Mail école'])
                                Etudiant.find().populate({ path: 'user_id', match: { $or: [{ email: { $eq: data['Mail école'] } }, { email_perso: { $eq: data['Mail personnel'] } }] } }).then(etudiants => {
                                    etudiants.forEach(etudiant => {
                                        if (etudiant && etudiant.user_id) {
                                            Etudiant.findByIdAndUpdate(etudiant._id, { valided_by_admin: true, classe_id: classe_id, valided_by_support: true }, { new: true }, (err, doc) => {
                                                if (err) {
                                                    console.error("Error Vérification admission par email IMS", err)
                                                } else if (doc) {
                                                    console.log(data['Mail école'], 'validé par Email IMS')
                                                    User.findByIdAndUpdate(etudiant.user_id._id, { email_perso: data['Mail personnel'], email: data['Mail personnel'] })
                                                }
                                            })
                                        }
                                    })
                                })
                            else if (data['Mail personnel'])
                                Etudiant.find().populate({ path: 'user_id', match: { email_perso: { $eq: data['Mail personnel'] } } }).then(etudiants => {
                                    etudiants.forEach(etudiant => {
                                        if (etudiant && etudiant.user_id)
                                            Etudiant.findByIdAndUpdate(etudiant._id, { valided_by_admin: true, classe_id: classe_id, valided_by_support: false }, { new: true }, (err, doc) => {
                                                if (err) {
                                                    console.error("Error Vérification admission par email Perso 2", doc)
                                                } else if (doc) {
                                                    console.log(etudiant.user_id.email_perso, 'validé par Email Perso 2')
                                                }
                                            })
                                    })
                                })
                            else
                                console.log(data, "Etudiant invalide")
                        })
                    })
                })
            })
        })

        Etudiant.find({ classe_id: { $ne: null } }).populate('classe_id').populate('user_id').then(etudiants => {
            etudiants.forEach(etudiant => {
                if (etudiant.classe_id) {
                    Etudiant.findByIdAndUpdate(etudiant._id, { campus: etudiant.classe_id.campus_id }).then(val => {
                        if (val) {
                            //console.log('Mis à jour des étudiants sans campus avec succès')
                        } else {
                            console.error(val, "Echec de la mis à jour des étudiants sans campus")
                        }
                    }, err => {
                        console.error(err, "Echec de la mis à jour des étudiants sans campus")
                    })
                    Etudiant.findByIdAndUpdate(etudiant._id, { filiere: etudiant.classe_id.diplome_id }).then(val => {
                        if (val) {
                            //console.log('Mis à jour des étudiants sans campus avec succès')
                        } else {
                            console.error(val, "Echec de la mis à jour des étudiants sans filière")
                        }
                    }, err => {
                        console.error(err, "Echec de la mis à jour des étudiants sans filière")
                    })
                    if (etudiant.user_id && etudiant.user_id.email && (etudiant.user_id.email.includes('@estya.com') || etudiant.user_id.email.includes('@intedgroup.com'))) {
                        Etudiant.findByIdAndUpdate(etudiant._id, { valided_by_support: true }).then(val => {
                            if (val) {
                                //console.log('Mis à jour des étudiants sans campus avec succès')
                            } else {
                                console.error(val, "Echec de la mis à jour des étudiants avec email INTED")
                            }
                        }, err => {
                            console.error(err, "Echec de la mis à jour des étudiants avec email INTED")
                        })
                    } else {
                        Etudiant.findByIdAndUpdate(etudiant._id, { valided_by_support: false }).then(val => {
                            if (val) {
                                //console.log('Mis à jour des étudiants sans campus avec succès')
                            } else {
                                console.error(val, "Echec de la mis à jour des étudiants sans email INTED")
                            }
                        }, err => {
                            console.error(err, "Echec de la mis à jour des étudiants sans email INTED")
                        })
                    }
                }
            })
            console.log('Réparation des étudiants sans campus et des etudiants avec/sans email INTED attribué/retiré de l\'écran support')
        })
    })

