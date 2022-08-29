const mongoose = require("mongoose");
const { Prospect } = require("../models/prospect");
var XLSX = require('xlsx')
var workbook = XLSX.readFile('prospects.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        xlData.forEach(p => {
            if(p['Email']){
                Prospect.findOneAndUpdate({ "user_id.email_perso": p['Email'] }, { origin: "Import IMS" }, { new: true }).populate("user_id").exec(function(err, newP){
                    if (err || !newP) {
                        nextEmail(p)
                    } else {
                        console.log(newP.user_id.email_perso)
                    }
                })
            }else{
                nextEmail(p)
            }
        })
    })

function nextEmail(p){
    if(p['ID Etudiant']){
        Prospect.findOneAndUpdate({ "customid": p['ID Etudiant'] }, { origin: "Import IMS" }, { new: true }).populate("user_id").exec(function(err, newP)  {
            if (err || !newP) {
                nextID(p)
            } else {
                console.log(newP.customid)
            }
        })
    }else{
        nextID(p)
    }
}

function nextID(p){
    if(p['Prenom'] && p['NOM']){
        Prospect.findOneAndUpdate({ "user_id.lastname": p['NOM'],"user_id.firstname": p['Prenom'] }, { origin: "Import IMS" }, { new: true }).populate("user_id").exec(function(err, newP){
            if (err || !newP) {
                console.error(p['Prenom'],p['NOM'],p['Email'],p['ID Etudiant'],newP)
            } else {
                console.log(newP.user_id.lastname,newP.user_id.firstname)
            }
        })
    }
}

