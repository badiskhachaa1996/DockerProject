const mongoose = require("mongoose");
var XLSX = require('xlsx')

const { Classe } = require('../models/classe')
const { Diplome } = require('../models/diplome')
const { User } = require('../models/user.js')
const { Etudiant } = require('../models/etudiant')
let ID_SIO_1_SISR = "633d4cf5c2f7a51506d7dd74" //"640ee95d3eef9e225d77c108"
let ID_SIO_1_SLAM = "633d4cfec2f7a51506d7dd7b" //"640ee9653eef9e225d77c10d"
mongoose
    .connect(`mongodb://localhost:27017/b`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Start")
        var workbook = XLSX.readFile('bts_sio.xlsx');
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        console.log(xlData, xlData.length)
        Classe.findById(ID_SIO_1_SISR, {}, {}, (err, sisr) => {
            if (err)
                console.error(err)
            Classe.findById(ID_SIO_1_SLAM, {}, {}, (err2, slam) => {
                if (err2)
                    console.error(err2)
                Etudiant.find().populate('user_id').then(doc => {
                    let dicEtudiant = {}
                    doc.forEach(d => {
                        if (d && d.user_id)
                            dicEtudiant[d.user_id.email] = d._id
                    })
                    let sisrList = []
                    let slamList = []
                    xlData.forEach(data => {
                        if (dicEtudiant[data['EMAIL']]) {
                            if (data['TYPE'] && data['TYPE'].startsWith('SISR')) {
                                Etudiant.findByIdAndUpdate(dicEtudiant[data['EMAIL']], { classe_id: sisr._id })
                                sisrList.push(dicEtudiant[data['EMAIL']])
                            }
                            else if (data['TYPE'] && data['TYPE'].startsWith('SLAM')) {
                                slamList.push(data['EMAIL'])
                                Etudiant.findByIdAndUpdate(dicEtudiant[data['EMAIL']], { classe_id: slam._id })
                            }
                            else
                                console.log(data?.TYPE)
                        }
                    })
                    console.log(slamList, slamList.length, sisrList, sisrList.length)
                    process.exit()
                })
            })
        })

    })