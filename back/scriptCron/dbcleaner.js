//Nettoyer les Objets du type Etudiant ou Formateur qui n'ont plus l'objet user
//
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Prospect } = require('../models/prospect')
const { Formateur } = require('../models/formateur')
const { Tuteur } = require('../models/Tuteur')
const mongoose = require("mongoose");
var readlineSync = require('readline-sync');
var willBeDeleted = []
var emailUpdated = []
var emailIMSUpdated = []
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        //Etudiant
        setTimeout(() => {
            process.exit()

        }, 300000)
        Etudiant.find().populate('user_id').then(etudiants => {
            etudiants.forEach(etu => {
                if (etu.user_id == null) {
                    Etudiant.findByIdAndRemove(etu._id)
                }
            })
            console.log('Etudiant nettoyé')
        })

        //Formateur
        Formateur.find().populate('user_id').then(formateurs => {
            formateurs.forEach(f => {
                if (f.user_id == null) {
                    Formateur.findByIdAndRemove(f._id)
                }
            })
            console.log('Formateur nettoyé')
        })

        //Prospect
        Prospect.find().populate('user_id').then(prospects => {
            prospects.forEach(p => {
                if (p.user_id == null) {
                    Prospect.findByIdAndRemove(p._id)
                }
            })
            console.log('Prospect nettoyé')
        })

        //Tuteur
        Tuteur.find().populate('user_id').then(tuteurs => {
            tuteurs.forEach(t => {
                if (t.user_id == null) {
                    Tuteur.findByIdAndRemove(t._id)
                }
            })
            console.log('Tuteur nettoyé')
        })
        var emailList = []
        //Vérification des doublons
        User.find().then(users => {
            users.forEach(u => {
                if (customIncludes(u.email_perso, u.email)) {
                    deleteUser(u)
                }
                /*if (u.email_perso == u.email) {
                    whichSave(u)
                }*/
            })
            User.updateMany({ _id: emailIMSUpdated }, { email: null })
            User.updateMany({ _id: emailUpdated }, { email_perso: null })
            User.deleteMany({ _id: willBeDeleted })
        })

        function customIncludes(email_perso, email_ims) {
            let r = false
            emailList.forEach(email => {
                if (email == email_perso || email == email_ims) {
                    r = true
                }
            })
            if (email_perso != null && emailList.includes(email_perso) == false)
                emailList.push(email_perso)
            if (email_ims != null && emailList.includes(email_ims) == false)
                emailList.push(email_ims)
            return r
        }

        function deleteUser(u) {
            if (readlineSync.keyInYN(u.email + " " + u.email_perso + " est un doublon.\nVoulez-vous le supprimer ?")) {
                if (u.email == null)
                    u.email = u.email_perso
                if (u.email_perso == null)
                    u.email_perso = u.email
                User.find({ $or: [{ email: u.email }, { email_perso: u.email_perso }, { email: u.email_perso }, { email_perso: u.email }] }).then(users => {
                    let dic = {}
                    let i = 1
                    users.forEach(us => {
                        dic[i] = us._id
                        console.log(i.toString() + " :" + us.toString())
                        i++
                    })
                    console.log(users.length)
                    var r2 = readlineSync.question("Lequel voulez-vous garder ? (-1 pour annuler)")
                    console.log(dic[r2.toString()])
                    if (r2.toString() != "-1")
                        for (let index = 1; index < i; index++) {
                            if (index.toString() != r2)
                                willBeDeleted.push(dic[index])
                        }
                })
            }
        };

        function whichSave(u) {
            console.log(u.toString())
            let r = readlineSync.question(u.email + " est un doublon 1: IMS 2: Perso.\nLequel voulez-vous supprimer ? (1\\2)")
            if (r == '1') {
                emailIMSUpdated.push(u._id)
            } else {
                emailUpdated.push(u._id) // email_perso: null
            }
        }
    })