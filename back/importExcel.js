var XLSX = require('xlsx')
const mongoose = require("mongoose");
const { User } = require("./models/user");
const { Prospect } = require("./models/prospect");
var workbook = XLSX.readFile('data.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

function convertDate(date) {
    let day = date.substring(date.indexOf('/') + 1)
    let month = date.substring(date.indexOf(day) + day.length)
    let year = date.substring(date.indexOf(month) + month.length)
    let r = new Date(day, month, year)
    console.log(r,date)
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
                let l2 = data.NOM
                const u = new User({
                    firstname: data.Prenom,
                    lastname: l2,
                    email: data.Email,
                    email_perso: data.Email,
                    pays_adresse: data['Pays de residence'],
                    nationnalite: data.Nationalite,
                    date_creation: new Date(),
                    phone: data.Telephone
                })
                u.save((errU, newUser) => {
                    let dn = convertDate(data['Date de naissance'])
                    let dt = convertDate(data["Date de la demande (traité à)"])
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
                        date_traitement: dt
                    })
                    if (userDic[data['Agent(Traité par)']]) {
                        r.agent_id = userDic[data['Agent(Traité par)']]
                    }
                    /*e.save((errP, newProspect) => {
                        if (errP || errU) {
                            console.error(errP, errU)
                        }
                        console.log(newUser.lastname + " " + newUser.firstname + " " + newProspect?.customid)
                    })*/
                })
            })

        })

    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });
