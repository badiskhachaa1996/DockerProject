
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Campus } = require('../models/campus')
const { Diplome } = require('../models/diplome')
const { Etudiant } = require('../models/etudiant')
const { Classe } = require('../models/classe')
var XLSX = require('xlsx')
var workbook = XLSX.readFile('data.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
let dicFiliere = {}
let dicClasse = {}
let dicCampus = {}
let users = []
mongoose
    .connect(`mongodb://localhost:27017/testV2`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Diplome.find().then(d => {
            d.forEach(diplo => {
                dicFiliere[diplo.titre] = diplo._id
            })
            Classe.find().then(c => {
                c.forEach(diplo => {
                    dicClasse[diplo.abbrv] = diplo._id
                })
                Campus.find().then(ca => {
                    ca.forEach(diplo => {
                        dicCampus[diplo.libelle] = diplo._id
                    })
                    User.find().then(dataUU => {
                        users = dataUU
                        let EmailList = []
                        let EmailPersoList = []
                        dataUU.forEach(us => {
                            if (us?.email)
                                EmailList.push(us?.email.replace(' ', '')?.toLowerCase())
                            if (us.email_perso)
                                EmailPersoList.push(us?.email_perso.replace(' ', '')?.toLowerCase())
                        })
                        xlData.forEach(data => {
                            let dn = data['Date de naissance']
                            if (typeof (dn) == typeof ('str')) {
                                dn.replace(' ', '')
                                dn = new Date(convertDate(dn))
                                if (dn == "Invalid Date")
                                    dn = new Date()
                            }
                            if (!dn) {
                                dn = new Date()
                            }
                            let email_ims = data['Email IMS']?.replace(' ', '')?.toLowerCase()
                            let email_perso = data['Email Perso']?.replace(' ', '')?.toLowerCase()
                            if (email_ims) {
                                if (EmailList.includes(email_ims)) {
                                    let natio = data['Nationnalité']?.substring(4)
                                    User.findOneAndUpdate({ email: email_ims }, {
                                        firstname: toCamelCase(data['Prénom']),
                                        lastname: data['Nom'].toUpperCase(),
                                        phone: data['Téléphone'],
                                        email: email_ims,
                                        email_perso: email_perso,
                                        civilite: null,
                                        type: "Etudiant",
                                        nationnalite: natio,
                                        verifedEmail: true
                                    }, { new: true }, (err, newU) => {
                                        if (!err && newU) {
                                            let natio = data['Nationnalité']?.substring(4)
                                            let code = generateCode(newU, dn, data['Nationnalité'])
                                            Etudiant.findOne({ user_id: newU._id }).then(dataU => {
                                                if (dataU) {
                                                    if (!dicClasse[data["Groupe/Classe"]] || !dicCampus[data["Campus"]] || !dicFiliere[data["Filière"]])
                                                        console.log(dicClasse[data["Groupe/Classe"]], dicCampus[data["Campus"]], dicFiliere[data["Filière"]], dataU)
                                                    Etudiant.findByIdAndUpdate(dataU._id, {
                                                        classe_id: dicClasse[data["Groupe/Classe"]],
                                                        statut: (data["Alternant"] == "Oui" ? "Alternant" : "Initial"),
                                                        nationalite: natio,
                                                        date_naissance: dn,
                                                        custom_id: code,
                                                        isAlternant: data["Alternant"] == "Oui",
                                                        campus: dicCampus[data["Campus"]],
                                                        filiere: dicFiliere[data["Filière"]]
                                                    }, { new: true }, (err, newE) => {
                                                        if (err) {
                                                            console.error(err)
                                                        } else {
                                                            console.log(newE.custom_id, " mis à jour x2")
                                                        }
                                                    })
                                                } else {
                                                    if (!dicClasse[data["Groupe/Classe"]] || !dicCampus[data["Campus"]] || !dicFiliere[data["Filière"]])
                                                        console.log(dicClasse[data["Groupe/Classe"]], dicCampus[data["Campus"]], dicFiliere[data["Filière"]], newU)
                                                    let etu = new Etudiant({
                                                        user_id: newU._id,
                                                        classe_id: dicClasse[data["Groupe/Classe"]],
                                                        statut: (data["Alternant"] == "Oui" ? "Alternant" : "Initial"),
                                                        nationalite: natio,
                                                        date_naissance: dn,
                                                        custom_id: code,
                                                        isAlternant: data["Alternant"] == "Oui",
                                                        campus: dicCampus[data["Campus"]],
                                                        filiere: dicFiliere[data["Filière"]]
                                                    })
                                                    etu.save((errEtu, newEtu) => {
                                                        if (errEtu)
                                                            console.error(errEtu)
                                                        else
                                                            console.log(newEtu.email, " mis à jour")
                                                    })
                                                }
                                            })
                                        } else {
                                            console.error(err, newU, "117", data)
                                        }
                                    })
                                } else {
                                    EmailList.push(email_ims)
                                    let natio = data['Nationnalité']?.substring(4)
                                    let u = new User({
                                        firstname: toCamelCase(data['Prénom']),
                                        lastname: data['Nom'].toUpperCase(),
                                        phone: data['Telephone'],
                                        email: email_ims,
                                        email_perso: email_perso,
                                        civilite: null,
                                        type: "Etudiant",
                                        nationnalite: natio,
                                        verifedEmail: true
                                    })
                                    u.save((err, newUser) => {
                                        users.push(newUser)

                                        if (!err) {
                                            let code = generateCode(newUser, dn, data['Nationnalité'])
                                            if (!dicClasse[data["Groupe/Classe"]] || !dicCampus[data["Campus"]] || !dicFiliere[data["Filière"]])
                                                console.log(dicClasse[data["Groupe/Classe"]], dicCampus[data["Campus"]], dicFiliere[data["Filière"]], newUser)
                                            let etu = new Etudiant({
                                                user_id: newUser._id,
                                                classe_id: dicClasse[data["Groupe/Classe"]],
                                                statut: (data["Alternant"] == "Oui" ? "Alternant" : "Initial"),
                                                nationalite: natio,
                                                date_naissance: dn,
                                                custom_id: code,
                                                isAlternant: data["Alternant"] == "Oui",
                                                campus: dicCampus[data["Campus"]],
                                                filiere: dicFiliere[data["Filière"]]
                                            })
                                            etu.save((errEtu, newEtu) => {
                                                if (errEtu) {
                                                    console.error(errEtu)
                                                } else {
                                                    console.log(newEtu?.custom_id)
                                                }
                                            })
                                        } else {
                                            console.error(err, u, "158", data)
                                        }
                                    })

                                }
                            } else {
                                if (data['Prénom']) {
                                    if (email_perso) {
                                        if (EmailPersoList.includes(email_perso)) {
                                            let natio = data['Nationnalité']?.substring(4)
                                            User.findOneAndUpdate({ email_perso: email_perso }, {
                                                firstname: toCamelCase(data['Prénom']),
                                                lastname: data['Nom'].toUpperCase(),
                                                phone: data['Téléphone'],
                                                civilite: null,
                                                type: "Etudiant",
                                                nationnalite: natio,
                                                verifedEmail: true
                                            }, { new: true }, (err, newU) => {
                                                if (!err && newU) {
                                                    let natio = data['Nationnalité']?.substring(4)
                                                    let code = generateCode(newU, dn, data['Nationnalité'])
                                                    Etudiant.findOne({ user_id: newU._id }).then(dataU => {
                                                        if (dataU) {
                                                            if (!dicClasse[data["Groupe/Classe"]] || !dicCampus[data["Campus"]] || !dicFiliere[data["Filière"]])
                                                                console.log(dicClasse[data["Groupe/Classe"]], dicCampus[data["Campus"]], dicFiliere[data["Filière"]], dataU)
                                                            Etudiant.findByIdAndUpdate(dataU._id, {
                                                                classe_id: dicClasse[data["Groupe/Classe"]],
                                                                statut: (data["Alternant"] == "Oui" ? "Alternant" : "Initial"),
                                                                nationalite: natio,
                                                                date_naissance: dn,
                                                                custom_id: code,
                                                                isAlternant: data["Alternant"] == "Oui",
                                                                campus: dicCampus[data["Campus"]],
                                                                filiere: dicFiliere[data["Filière"]]
                                                            }, { new: true }, (err, newE) => {
                                                                if (err) {
                                                                    console.error(err)
                                                                } else {
                                                                    console.log(newE.custom_id, " mis à jour x2")
                                                                }
                                                            })
                                                        } else {
                                                            if (!dicClasse[data["Groupe/Classe"]] || !dicCampus[data["Campus"]] || !dicFiliere[data["Filière"]])
                                                                console.log(dicClasse[data["Groupe/Classe"]], dicCampus[data["Campus"]], dicFiliere[data["Filière"]], newU)
                                                            let etu = new Etudiant({
                                                                user_id: newU._id,
                                                                classe_id: dicClasse[data["Groupe/Classe"]],
                                                                statut: (data["Alternant"] == "Oui" ? "Alternant" : "Initial"),
                                                                nationalite: natio,
                                                                date_naissance: dn,
                                                                custom_id: code,
                                                                isAlternant: data["Alternant"] == "Oui",
                                                                campus: dicCampus[data["Campus"]],
                                                                filiere: dicFiliere[data["Filière"]]
                                                            })
                                                            etu.save((errEtu, newEtu) => {
                                                                if (errEtu)
                                                                    console.error(errEtu)
                                                                else
                                                                    console.log(newEtu.email, " mis à jour")
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    console.error(err, newU, "220", data)
                                                }
                                            })
                                        } else {
                                            EmailList.push(email_perso)
                                            let natio = data['Nationnalité']?.substring(4)
                                            let u = new User({
                                                firstname: toCamelCase(data['Prénom']),
                                                lastname: data['Nom'].toUpperCase(),
                                                phone: data['Telephone'],
                                                email: email_perso,
                                                email_perso: email_perso,
                                                civilite: null,
                                                type: "Etudiant",
                                                nationnalite: natio,
                                                verifedEmail: true
                                            })
                                            u.save((err, newUser) => {
                                                users.push(newUser)
                                                let code = generateCode(u, dn, data['Nationnalité'])
                                                if (!err) {
                                                    if (!dicClasse[data["Groupe/Classe"]] || !dicCampus[data["Campus"]] || !dicFiliere[data["Filière"]])
                                                        console.log(dicClasse[data["Groupe/Classe"]], dicCampus[data["Campus"]], dicFiliere[data["Filière"]], newUser)
                                                    let etu = new Etudiant({
                                                        user_id: newUser._id,
                                                        classe_id: dicClasse[data["Groupe/Classe"]],
                                                        statut: (data["Alternant"] == "Oui" ? "Alternant" : "Initial"),
                                                        nationalite: natio,
                                                        date_naissance: dn,
                                                        custom_id: code,
                                                        isAlternant: data["Alternant"] == "Oui",
                                                        campus: dicCampus[data["Campus"]],
                                                        filiere: dicFiliere[data["Filière"]]
                                                    })
                                                    etu.save((errEtu, newEtu) => {
                                                        if (errEtu) {
                                                            console.error(errEtu)
                                                        } else {
                                                            console.log(newEtu?.custom_id)
                                                        }
                                                    })
                                                } else {
                                                    console.error(err, u, 260, data)
                                                }
                                            })

                                        }
                                    }
                                } else {
                                    console.error("Prenom not found", data)
                                }

                            }
                        })

                    })
                }).catch(err => {
                    console.error(err)
                })
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        })
    })
function generateCode(user, dn, nationnalite) {
    if (user)
        try {
            let code_pays = "INC"
            if (nationnalite)
                code_pays = nationnalite.substring(0, 3)
            let prenom = user.firstname?.substring(0, 1)
            let nom = user.lastname?.substring(0, 1)
            let y = 0
            for (let i = 0; i < (nom.match(" ") || []).length; i++) {
                nom = nom + nom?.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
                y = nom.indexOf(" ", y) + 1
            }
            let jour = dn.getDate()
            let mois = dn.getMonth() + 1
            let year = dn.getFullYear().toString()?.substring(2)
            let nb = users.length.toString()
            nb = nb?.substring(nb.length - 3)
            let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
            r = r.replace(' ', '')
            return r
        } catch (error) {
            console.error(error, user, 306)
            return "UNDEFINEDCODEERROR"
        }
    else {
        console.error("WTF YA PAS DUSER")
        return "UNDEFINEDCODEERROR"
    }
}


function toCamelCase(wordArr) {
    if (wordArr) {
        let newStr = wordArr[0].toUpperCase()
        for (let i in wordArr) {
            if (i != 0) {
                if (newStr[i - 1] == " ") {
                    newStr += wordArr[i].toUpperCase()
                } else {
                    newStr += wordArr[i].toLowerCase()
                }
            }
        }
        return newStr
    } else {
        console.error("NAME NOT FOUND")
    }

}

function convertDate(date) {
    let day = date.substring(0, 2)
    let month = date.substring(3, 5)
    let year = date.substring(6)
    let r = new Date(year, parseInt(month) - 1, parseInt(day) + 1)
    if (r != "Invalid Date") {
        return r
    }
    return null
}