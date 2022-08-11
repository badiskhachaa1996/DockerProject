var XLSX = require('xlsx')
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Prospect } = require("../models/prospect");
var workbook = XLSX.readFile('Prospect.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

function convertDate(date) {
    let day = date.substring(0, 2)
    let month = date.substring(3, 5)
    let year = date.substring(6)
    let r = new Date(year, parseInt(month) - 1, parseInt(day) + 1)
    console.log(r, date)
    if (r != "Invalid Date") {
        return r
    }
    return null
}

mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        User.find().then(dataUser => {
            let userDic = {}
            dataUser.forEach(user => {
                let l = user.lastname
                let name = l + " " + user.firstname
                userDic[name] = user._id;
            })
            xlData.forEach(data => {
                let n = data['NOM']
                let p = data['Prenom']
                let cc = data['Code du commercial']
                User.findOne({ lastname: n, firstname: p }).then(fUser => {
                    if (fUser) {
                        Prospect.findOneAndUpdate({ user_id: fUser._id }, { code_commercial: cc }, { new: true }, function (err2, p) {
                            if (err2) {
                                console.error(err2)
                            }
                        })
                    } else {
                        const u = new User({
                            firstname: p,
                            lastname: n,
                            email_perso: data.Email,
                            pays_adresse: data['Pays de residence'],
                            nationnalite: data.Nationalite,
                            date_creation: new Date(),
                            phone: data.Telephone
                        })
                        u.save((errU, newUser) => {
                            if (errU) {
                                console.error(errU)
                            } else {
                                let dn = data['Date de naissance ']
                                let dt = data["Date de traitement "]
                                if (typeof (dn) == typeof ("string")) {
                                    dn = convertDate(dn)
                                }
                                if (typeof (dt) == typeof ("string")) {
                                    dt = convertDate(dt)
                                }
                                const e = new Prospect({
                                    user_id: newUser._id,
                                    nationnalite: data.Nationalite,
                                    date_naissance: dn,
                                    type_form: data["Ecole demandée"],
                                    campus_choix_1: data['1er choix(Campus)'],
                                    formation: data.formation,
                                    Programme: data.Programme,
                                    rythme_formation: data['Rythme de Formation'],
                                    nomAgence: data["Nom de l'agence(Email AA)"],
                                    decision_admission: data['Decision Admission'],
                                    phase_complementaire: data['Phase complémentaire'],
                                    customid: data['ID Etudiant'],
                                    statut_payement: data["Statut Payement"],
                                    traited_by: data["Att Traité par"],
                                    date_traitement: dt,
                                    code_commercial: data['Code du commercial']
                                })
                                if (userDic[data['Agent(Traité par)']]) {
                                    r.agent_id = userDic[data['Agent(Traité par)']]
                                }
                                e.save((errP, newProspect) => {
                                    if (errP) {
                                        console.error(errP)
                                        console.log(dn, dt, "errorP")
                                        console.log(newUser.lastname + " " + newUser.firstname + " " + newProspect.code_commercial)
                                    } else {
                                        //console.log(newUser.lastname + " " + newUser.firstname + " " + newProspect?.date_naissance)
                                        if (xlData[xlData.length - 1] == data) {
                                            console.log("Finish")
                                        }
                                    }
                                    //console.log(newUser.lastname + " " + newUser.firstname + " " + newProspect?.customid)
                                })
                            }
                        })
                    }
                })
            })

        })

    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });