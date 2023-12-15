
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
let dicUser = {}
console.log(mongoose.version)
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        setTimeout(() => {
            process.exit()

        }, 300000)
        var emailPersoList = []
        var emailIMSList = []
        User.find().then(users => {
            Etudiant.find().then(etudiants => {
                etudiants.forEach(etu => {
                    dicUser[etu.user_id] = etu
                })
                users.forEach(u => {
                    if (customIncludes(u.email_perso, u.email)) {
                        deleteUser(u)
                    }
                    /*if (u.email_perso == u.email) {
                        whichSave(u)
                    }*/
                })
                console.log("Update en cours")
                User.find({ _id: { $in: emailIMSUpdated } }).then(u => {
                    console.log("Executez la commande suvante dans mongodb:\ndb.users.update({_id:{ $in: " + emailIMSUpdated + " }},{$set:{email: null}})")
                    /*User.updateMany({ _id: { $in: emailIMSUpdated } }, { email: null }, { new: true }, (err, u) => {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log("Email IMS des Users mis à jour avec succès")
                        }
                    })*/
                    console.log("Executez la commande suvante dans mongodb:\ndb.users.update({_id:{ $in: " + emailUpdated + " }},{$set:{email_perso: null}})")
                    /*User.updateMany({ _id: { $in: emailUpdated } }, { email_perso: null }, { new: true }, (err, u) => {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log("Email perso des Users mis à jour avec succès")
                        }
                    })*/
                    console.log("Executez la commande suvante dans mongodb:\ndb.users.remove({_id:{ $in: " + willBeDeleted + " }})")
                    /*User.deleteMany({ _id: { $in: willBeDeleted } }, {}, (err, u) => {
                        if (err) {
                            console.error(err)
                        } else {
                            console.log("User supprimé avec succès", willBeDeleted, u)
                        }
                    })*/
                })

            })
        })

        function customIncludes(email_perso, email_ims) {
            let r = false
            emailPersoList.forEach(email => {
                if (email == email_perso) {
                    r = true
                }
            })
            emailIMSList.forEach(email => {
                if (email == email_ims) {
                    r = true
                }
            })
            if (email_perso != null && emailPersoList.includes(email_perso) == false)
                emailPersoList.push(email_perso)
            if (email_ims != null && emailIMSList.includes(email_ims) == false)
                emailIMSList.push(email_ims)
            return r
        }

        function deleteUser(u) {
            if (u.email == null)
                u.email = u.email_perso
            if (u.email_perso == null)
                u.email_perso = u.email
            if (readlineSync.keyInYN(u.email + " " + u.email_perso + " est un doublon.\nVoulez-vous le supprimer ?")) {
                User.find({ $or: [{ email: u.email }, { email_perso: u.email_perso }] }).then(users => {
                    let dic = {}
                    let i = 1
                    users.forEach(us => {
                        dic[i] = us._id
                        console.log(i.toString() + " :" + us.toString())
                        if (dicUser[us._id]) {
                            let etu = dicUser[us._id]
                            console.log(etu.classe_id, etu.date_naissance, etu.custom_id, etu._id, etu.code_partenaire, etu.filiere, etu.campus)
                        } else {
                            console.log("Pas Etudiant")
                        }
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