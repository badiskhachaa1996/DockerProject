var XLSX = require('xlsx')
var workbook = XLSX.readFile('dataPartenaire.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
const mongoose = require("mongoose");
var xlDataPartenaire = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
let dicPartenaire = {}
const { CommercialPartenaire } = require('../models/CommercialPartenaire');
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
        xlDataPartenaire.forEach(data => {
            const p = new Partenaire({
                code_partenaire: data["ID Partenaire"],
                nom: data['Nom de Société'],
                phone: data['Téléphone'],
                email: data['Email'],
                Services: data['Services proposés'],
                Pays: data['Pays Activité'],
                type: data['Type de Societe'],
            })
            p.save((error,newPartenaire) => {
                if (error)
                    console.error(error)
                if (newPartenaire)
                    dicPartenaire[newPartenaire.code_partenaire] = newPartenaire._id
            })
        })
        CommercialPartenaire.find({ partenaire_id: null }).populate('partenaire_id').then(dataC => {
            dataC.forEach(c => {
                let cc = c.code_commercial_partenaire.substring(0, c.code_commercial_partenaire.length - 3)
                if (dicPartenaire[cc]) {
                    CommercialPartenaire.findByIdAndUpdate(c._id, { partenaire_id: dicPartenaire[cc] }, { new: true }, (err, newC) => {
                        if (err) {
                            console.log(err)
                        }else{
                            console.log(newC)
                        }
                    })
                } else {
                    //console.error("C'est la merde", cc, c)
                }
            })
        })
    })