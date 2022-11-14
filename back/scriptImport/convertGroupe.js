const mongoose = require("mongoose");
var XLSX = require('xlsx')
const { Etudiant } = require('../models/etudiant')
const mco_b_id = "63724fe64d06a260126a2c32"
const mco_a_id = "6322d512f1eb12342596117b"
const sio_slam_id = "6322d7aff1eb123425961249"
const sio_sisr_id = "6322d5eaf1eb1234259611ad"
const sio_id = "63724ef84d06a260126a2c24"
var workbook = XLSX.readFile('mco2_a_b.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames;
var mco2A = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
var mco2B = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
var users = {}
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
        Etudiant.find({ classe_id: mco_a_id }).populate('user_id').then(etudiants => {
            etudiants.forEach(etu => {
                if (mco2BList.includes(etu.user_id.email) == true)
                    Etudiant.findByIdAndUpdate(etu._id, { classe_id: mco_b_id }).then(()=>{
                        console.log(etu.user_id.email," convertit en MCO 2B")
                    })
            })
        })
        Etudiant.updateMany({ classe_id: sio_slam_id }, { classe_id: sio_id }).then((val,err)=>{
            console.log("SIO SLAM 1 convertit en SIO 1")
        })
        Etudiant.updateMany({ classe_id: sio_sisr_id }, { classe_id: sio_id }).then((val,err)=>{
            console.log("SIO SISR 1 convertit en SIO 1")
        })

    })