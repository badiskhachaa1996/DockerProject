const mongoose = require("mongoose");
var XLSX = require('xlsx');
const { CommercialPartenaire } = require("../models/CommercialPartenaire");
const { Partenaire } = require("../models/partenaire");
const { User } = require("../models/user");
var workbook = XLSX.readFile('partenaires.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
var nb = 0
const bcrypt = require("bcryptjs");
mongoose
    .connect(`mongodb://localhost:27017/imaginePartenaire`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        xlData.forEach(data => {
            let user_id = new mongoose.Types.ObjectId()
            let partenaire_id = new mongoose.Types.ObjectId()
            let code_partenaire = generatePartenaireID(data)
            User.findOneAndRemove({ email_perso: data['Adresse email : '].replace(' ', '') }, function (err, doc) {
                new User({
                    firstname: data['Prénom du contact : '],
                    lastname: data['Nom du contact : '],
                    phone: data['Numéro de téléphone : '],
                    email_perso: data['Adresse email : '].replace(' ', ''),
                    password: bcrypt.hashSync(code_partenaire, 8),
                    civilite: data['Civilité:'],
                    type: 'Commercial',
                    verifedEmail: true,
                    date_creation: new Date(),
                    _id: user_id
                }).save().then(user => {
                    console.log(user, code_partenaire)
                })
            })

            new Partenaire({
                user_id,
                code_partenaire,
                nom: data['Nom de la société : '],
                phone: data['Numéro de téléphone : '],
                email: data['Adresse email : '].replace(' ', ''),
                type: data['Type de la société :'],
                Pays: data['Pays  cilbles : '],
                WhatsApp: data['Numéro de WhatsApp : '],
                typePartenaire: data['Type partenaire'],
                site_web: data["Site web de l'entreprise : "],
                facebook: data["Page Facebook de l'entreprise : "],
                Services: data["Secteur d'activité :"],
                description: data["Description de l'entreprise :"],
                date_creation: new Date(),
                statut_anciennete: data['Ancienneté : '],
                contribution: data['Contribution : '],
                etat_contrat: data['Etat de contrat'],
                localisation: data['Localisation'],
                groupeWhatsApp: data['Groupe WhatsApp'],
                _id: partenaire_id

            }).save().then(partenaire => {
                console.log(partenaire)
            })
            new CommercialPartenaire({
                user_id,
                partenaire_id,
                code_commercial_partenaire: code_partenaire + "001",
                statut: "Admin",
                isAdmin: true,
                //pays: convertPaysToArray(data['Pays  cilbles : ']),
                //localisation : data['Localisation'],
                whatsapp: data['Numéro de WhatsApp : '],
                //contribution: data['Contribution : '],
                //localisation: data['Localisation'],
                //etat_contrat: data['Etat de contrat'],
                date_ajout: new Date()
            }).save().then(commercial => {
                console.log(commercial)
            })
            nb = nb + 1
        })
        //process.exit()
    })
function getIndicatif(phone) {
    return phone.substring(0, phone.indexOf(' '))
}
function generatePartenaireID(data) {
    let n = (nb + 1).toString().substring(0, 3)
    while (n.length < 3) {
        n = "0" + n
    }
    let tempsPays = convertPaysToArray(data['Pays  cilbles : '])
    let pays = data['Pays  cilbles : ']
    if (tempsPays[0])
        pays = tempsPays[0].toUpperCase().substring(0, 3)
    return "P" + pays + n
}
function convertPaysToArray(pays) {
    if (pays.indexOf(';') == -1)
        return [pays.replace(' ', '')]
    else
        return []
}