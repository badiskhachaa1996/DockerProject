const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var XLSX = require('xlsx')
var workbook = XLSX.readFile('dataC.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        /*User.find({ password: { $ne: null } }).then(dataU => {
            console.log(dataU)
        })*/
        xlData.forEach(data => {
            let password = data['Mot de passe']
            password.replace(' ', '')
            let u = {
                verifedEmail: true,
                type: "Commercial",
                password: bcrypt.hashSync(password)
            }
            User.findOneAndUpdate({ email_perso: data['Email'] }, u, { new: true }).then(newData => {
                console.log(newData)
            })
        })
    })