var XLSX = require('xlsx')
const mongoose = require("mongoose");
const { Partenaire } = require("./models/partenaire");
const { CommercialPartenaire } = require("./models/CommercialPartenaire");
const { User } = require("./models/user");
var workbook = XLSX.readFile('data1.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
var dicP = {}
var cLength = 0
function generateCode(c, p) {
    //let n = (cLength ++).toString().substring(0, 2)
    let n = "1"
    while (n.length < 2) {
        n = "0" + n
    }
    return p.code_partenaire + "C" + n
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
            pDATA.forEach(p => {
                dicP[p.nom] = p
            })
            CommercialPartenaire.find().then(cData => {
                cLength = cData.length+1
                xlData.forEach(data => {
                    var p = dicP[data['Partenaire']]
                    if(p!=undefined){
                        const u = new User({
                            firstname: data['Prénom'],
                            lastname: data.NOM.toUpperCase(),
                            email: data.Email,
                            email_perso: data.Email,
                            pays_adresse: data.Pays,
                            nationnalite: data['Nationalité'],
                            date_creation: new Date(),
                            phone: data['Téléphone'],
                            password: data['Mot de passe'],
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
                    }else{
                        console.error(data['Partenaire'])
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