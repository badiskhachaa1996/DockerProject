var XLSX = require('xlsx')
var workbook = XLSX.readFile('data.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);

const { Prospect } = require("../models/prospect");

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
            Prospect.findByIdAndUpdate(data["ID"], { code_commercial: data['Code Commercial'] }, { new: true }, function (err2, p) {
                if (err2) {
                    console.error(err2)
                }
            })
        })
    })