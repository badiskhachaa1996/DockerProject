const mongoose = require("mongoose");
var XLSX = require('xlsx')
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const mco_a_id = "6322d51cf1eb123425961180"
const mco_b_id = "63724fe64d06a260126a2c32"
var workbook = XLSX.readFile('mco2_a_b.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var mco2A = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
var mco2B = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
var mco2AList = []
var mco2BList = []
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Start")
        mco2B.forEach(tab => {
            mco2BList.push(tab['Email'])
        })
        mco2A.forEach(tab => {
            mco2AList.push(tab['Email'])
        })
        Etudiant.find({ classe_id: mco_a_id }).populate('user_id').then(etudiants => {
            etudiants.forEach(etu => {
                if (customIncludes(etu.user_id.email, mco2BList))
                    Etudiant.findByIdAndUpdate(etu._id, { classe_id: mco_b_id }).then(() => {
                        console.log(etu.user_id.email, " convertit en MCO 2B")
                    })
                else
                    console.log("'",etu.user_id.email,"' not found in DB")
            })
        })
        Etudiant.find({ classe_id: mco_b_id }).populate('user_id').then(etudiants => {
            etudiants.forEach(etu => {
                if (customIncludes(etu.user_id.email, mco2AList))
                    Etudiant.findByIdAndUpdate(etu._id, { classe_id: mco_a_id }).then(() => {
                        console.log(etu.user_id.email, " convertit en MCO 2A")
                    })
                else
                    console.log("'",etu.user_id.email,"' not found in DB")
            })
        })
    })
function customIncludes(email, list) {
    let r = false
    list.forEach(e => {
        if (e.regex(`/${email}/i`) ) {
            r = true
        }
    })
    return r
}