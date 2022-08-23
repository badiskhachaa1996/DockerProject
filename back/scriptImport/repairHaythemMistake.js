var XLSX = require('xlsx')
var workbook = XLSX.readFile('data.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
const mongoose = require("mongoose");
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const { CommercialPartenaire } = require('../models/CommercialPartenaire');

const { User } = require('../models/user');
const { Partenaire } = require('../models/partenaire');

mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        xlData.forEach(data => {
            User.findOne({ email_perso: data["Email"] }).then(dataUser => {
                if (dataUser && dataUser.email_perso) {
                    if (dataUser.type == "Commercial") {
                        CommercialPartenaire.findOneAndUpdate({ user_id: dataUser._id }, { code_commercial_partenaire: data['Code Commercial'] }, { new: true }).then(updateCommercial => {
                            if (updateCommercial){
                                //console.log(data["Email"], "a été mis à jour")
                            }
                            else{
                                Partenaire.find({ nom: data['p_nom'] }).then(partenaire => {
                                    if (partenaire) {
                                        let c = new CommercialPartenaire({
                                            partenaire_id: partenaire._id,
                                            user_id: newUser._id,
                                            code_commercial_partenaire: data['Code Commercial'],
                                            isAdmin: data['Est Admin'] == "Oui"
                                        })
                                        c.save().then(newCommercial => {
                                            console.log(newCommercial._id, newUser._id)
                                        })
                                    } else {
                                        let cp = data['Code Commercial'].substring(0, data['Code Commercial'].length - 3)
                                        let p = new Partenaire({
                                            user_id: newUser._id,
                                            code_partenaire: cp,
                                            nom: data['p_nom'],
                                            email: data["p_email"],
                                            Services: data['services'],
                                            Pays: data['Pays']
                                        })
                                        p.save().then(newPartenaire => {
                                            let c = new CommercialPartenaire({
                                                partenaire_id: newPartenaire._id,
                                                user_id: newUser._id,
                                                code_commercial_partenaire: data['Code Commercial'],
                                                isAdmin: data['isAdmin']
                                            })
                                            c.save().then(newCommercial => {
                                                console.log(newCommercial._id, newPartenaire._id, newUser._id)
                                            })
                                        })
                                    }
                                })
                            }
                                
                        })
                    } else {
                        CommercialPartenaire.findOneAndUpdate({ user_id: dataUser._id }, { code_commercial_partenaire: data['Code Commercial'] }, { new: true }).then(updateCommercial => {
                            if (updateCommercial) {
                                User.findByIdAndUpdate(dataUser._id, { type: "Commercial" })
                                //console.log(data["Email"], "a été mis à jour")
                            }
                            else {
                                console.error(dataUser.email, "C'est la GIGA merde bro")
                            }

                        })

                    }
                } else {
                    //Check if partenaire exist
                    let email = data['Email']
                    if (email)
                        email = email.replace(' ', '')
                    let u = new User({
                        lastname: data['NOM'],
                        firstname: data['Prenom'],
                        phone: data['phone'],
                        email: email,
                        email_perso: email,
                        nationnalite: data['Nationalite'],
                        password: data['password']
                    })
                    u.save().then(newUser => {
                        Partenaire.findOne({ nom: data['p_nom'] }).then(partenaire => {
                            if (partenaire) {
                                let c = new CommercialPartenaire({
                                    partenaire_id: partenaire._id,
                                    user_id: newUser._id,
                                    code_commercial_partenaire: data['Code Commercial'],
                                    isAdmin: data['Est Admin'] == "Oui"
                                })
                                c.save().then(newCommercial => {
                                    console.log(newCommercial._id, newUser._id)
                                })
                            } else {
                                let cp = data['Code Commercial'].substring(0, data['Code Commercial'].length - 3)
                                let p = new Partenaire({
                                    user_id: newUser._id,
                                    code_partenaire: cp,
                                    nom: data['p_nom'],
                                    email: data["p_email"],
                                    Services: data['services'],
                                    Pays: data['Pays']
                                })
                                p.save().then(newPartenaire => {
                                    let c = new CommercialPartenaire({
                                        partenaire_id: newPartenaire._id,
                                        user_id: newUser._id,
                                        code_commercial_partenaire: data['Code Commercial'],
                                        isAdmin: data['isAdmin']
                                    })
                                    c.save().then(newCommercial => {
                                        console.log(newCommercial._id, newPartenaire._id, newUser._id)
                                    })
                                })
                            }
                        })
                    })

                }
            })
        })
    })