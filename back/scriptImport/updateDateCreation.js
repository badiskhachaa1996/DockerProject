const mongoose = require("mongoose");
const { Etudiant } = require("../models/etudiant");
const { User } = require("../models/user");
var XLSX = require('xlsx')
var workbook = XLSX.readFile('exportUsers_2023-2-6.csv', { cellDates: true });
var sheet_name_list = workbook.SheetNames; // Classes Name
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
        xlData.forEach(etu => {
            if (etu['createdDateTime'] && (typeof etu['createdDateTime'] != "string" || !etu['createdDateTime'].includes('#')) && etu['mail']) {
                let date = new Date(etu['createdDateTime'])
                User.findOne({ email: etu['mail'] }, {}, {}, (err, doc) => {
                    if (doc) {
                        Etudiant.findOneAndUpdate({ user_id: doc._id }, { date_valided_by_support: date }, { new: true }, (err2, doc2) => {
                            if (doc2)
                                console.log(doc2.date_valided_by_support,date)
                            else
                                console.error(err2)
                        })
                    }
                })
            }
        })
    })