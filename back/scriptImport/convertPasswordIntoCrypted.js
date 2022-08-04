const { User } = require("../models/user");
const mongoose = require("mongoose");
const { Partenaire } = require('../models/partenaire')
const { CommercialPartenaire } = require('../models/CommercialPartenaire')
const bcrypt = require("bcryptjs");
var XLSX = require('xlsx')
var workbook = XLSX.readFile('dataC.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
var dicP = {}
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        /*User.find({ password: { $ne: null } }).then(dataU => {
            console.log(dataU)
        })*/
        Partenaire.find().then(pDATA => {
            pDATA.forEach(p => {
                dicP[p.nom] = p
            })
            xlData.forEach(data => {
                let password = data['Mot de passe']
                password.replace(' ', '')
                let u = {
                    verifedEmail: true,
                    type: "Commercial",
                    password: bcrypt.hashSync(password)
                }
                User.findOneAndUpdate({ email_perso: data['Email'] }, u, { new: true }).then(newData => {
                    if (newData != null) {
                        console.log(newData.email)
                    } else {
                        var p = dicP[data['Partenaire']]
                        if (p != undefined) {
                            let password = data['Mot de passe']
                            password.replace(' ', '')
                            const u = new User({
                                firstname: data['Prénom'],
                                lastname: data.NOM.toUpperCase(),
                                email: data.Email,
                                email_perso: data.Email,
                                verifedEmail: true,
                                type: "Commercial",
                                pays_adresse: data.Pays,
                                nationnalite: data['Nationalité'],
                                date_creation: new Date(),
                                phone: data['Téléphone'],
                                password: bcrypt.hashSync(password)
                            })
                            u.save((errU, newUser) => {
                                if (!errU) {
                                    const c = new CommercialPartenaire({
                                        partenaire_id: p._id,
                                        user_id: newUser._id,
                                        statut: data["Statut au Sein de l'entreprise"],
                                        isAdmin: data['Est Admin'] == 'Oui'
                                    })
                                    c.code_commercial_partenaire = generateCode(c, p)
                                    c.save((errU, newCommercial) => {
                                        if (errU) {
                                            console.error(errU)
                                        } else {
                                            console.log(newCommercial.code_commercial_partenaire)
                                        }
                                    })
                                } else {
                                    console.error(errU)
                                }
                            })
                        } else {
                            console.error("404 Partenaire Not Found :" + data['Partenaire'])
                        }

                    }

                }, error => {
                    console.error(error)
                })
            })
        })
    })