var XLSX = require('xlsx')
const mongoose = require("mongoose");
const { Partenaire } = require("./models/partenaire");
var workbook = XLSX.readFile('data.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
var CPL = 0
function generateCode(p) {
    let n = (CPL++).toString().substring(0, 3)
    while (n.length < 3) {
        n = "0" + n
    }
    console.log(p.Pays)
    let pays = p.Pays.toUpperCase().substring(0, 3)
    return "EHP" + pays + n
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
        Partenaire.find().then(pDATA => {
            CPL = pDATA.length + 1
            xlData.forEach(data => {
                const part = new Partenaire({
                    nom: data['Nom de Société'],
                    phone: data['Téléphone'],
                    email: data['Email'],
                    number_TVA: data['TVA'],
                    SIREN: data['SIREN'],
                    SIRET: data['SIRET'],
                    format_juridique: data['Format Juridique'],
                    APE: data['Code APE'],
                    Services: data['Services proposés'],
                    Pays: data['Pays Activité'],
                    type: data['Type de Societe'],
                    //WhatsApp: data['TVA'],
                    indicatifPhone: data['Indicatif'],
                    //indicatifWhatsApp: data['TVA']
                })
                part.code_partenaire = generateCode(part)
                part.save((errU, newPartenaire) => {
                    if (errU) {
                        console.error(errU)
                    } else {
                        console.log(newPartenaire.nom + newPartenaire.code_partenaire)
                    }
                })
            })
        }).catch(err => {
            console.error(err);
        });
    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });