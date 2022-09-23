//Nettoyer les Objets du type Etudiant ou Formateur qui n'ont plus l'objet user

const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Prospect } = require('../models/prospect')
const { Formateur } = require('../models/formateur')
const { Tuteur } = require('../models/Tuteur')
const mongoose = require("mongoose");
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        //Etudiant
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
        let emailList = []
        let emailDoublon = []
        //Vérification des doublons
        User.find().then(users => {
            users.forEach(u => {
                if (customIncludes(emailList, u.email_perso, u.email)) {
                    deleteUser(u)
                }
                if (u.email_perso == u.email) {
                    whichSave(u)
                }
            })
        })

        function customIncludes(emailList, email_perso, email_ims) {
            let r = false
            emailList.forEach(email => {
                if (email == email_perso || email == email_ims) {
                    r = true
                    emailDoublon.push(email)
                }
            })
            return r
        }

        function deleteUser(u) {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question(u.email + " " + u.email_perso + " est un doublon.\nVoulez-vous le supprimer ? (y\\n)", r => {
                if (r == 'y') {
                    User.find({ $or: [{ email: u.email, email_perso: u.email_perso }] }).then(users => {
                        let dic = {}
                        let i = 1
                        users.forEach(us => {
                            dic[i] = us._id
                            console.log(i.toString() + " :" + us.toString())
                            i++
                        })
                        readline.close();
                        readline.question("Lequel voulez-vous supprimer ?", r2 => {
                            console.log(dic[r2.toString()])
                            //TODO
                        });
                    })
                }else{
                    readline.close();
                }
            });
        }

        function whichSave(u) {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            console.log(u.toString())
            readline.question("1: " + u.email + " 2: " + u.email_perso + " est un doublon.\nLequel voulez-vous supprimer ? (1\\2)", r => {
                if (r == '1') {
                    User.findByIdAndUpdate(u._id, { email: null })
                } else {
                    User.findByIdAndUpdate(u._id, { email_perso: null })
                }
                readline.close()
            });
        }
    })