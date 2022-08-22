var XLSX = require('xlsx')
var workbook = XLSX.readFile('data.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
const bcrypt = require("bcryptjs");
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);

const { CommercialPartenaire } = require('../models/CommercialPartenaire');
const { User } = require('../models/user');
const { Partenaire } = require('../models/partenaire');

ongoose
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
                if (dataUser) {
                    if (dataUser.type == "Commercial") {
                        Commercial.findByIdAndUpdate({ user_id: dataUser._id }, { code_commercial_partenaire: data['Code Commercial'] })
                    } else {
                        console.error(dataUser, " n'est pas Commercial")
                    }
                } else {
                    console.error(dataUser, " doit être crée")
                    //Check if partenaire exist
                    let u = new User({
                        lastname: data['NOM'],
                        firstname: data['Prenom'],
                        phone: data['phone'],
                        email: data['Email'],
                        email_perso: data['Email'],
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