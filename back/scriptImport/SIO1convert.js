const mongoose = require("mongoose");
var XLSX = require('xlsx')

const { Classe } = require('../models/classe')
const { Note } = require('../models/note')
const { User } = require('../models/user.js')
const { Examen } = require('../models/examen.js')
const { Etudiant } = require('../models/etudiant')
let ID_SIO_1_SISR = "640ee95d3eef9e225d77c108" //"640ee95d3eef9e225d77c108"
let ID_SIO_1_SLAM = "640ee9653eef9e225d77c10d" //"640ee9653eef9e225d77c10d"
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Start")
        var workbook = XLSX.readFile('bts_sio.xlsx');
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        //console.log(xlData, xlData.length)
        Classe.findById('63724ef84d06a260126a2c24', {}, {}, (err, oldSIO) => {
            Classe.findById(ID_SIO_1_SISR, {}, {}, (err, sisr) => {
                if (err)
                    console.error(err)
                Classe.findById(ID_SIO_1_SLAM, {}, {}, (err2, slam) => {
                    if (err2)
                        console.error(err2)
                    Etudiant.find().populate('user_id').then(doc => {
                        let dicEtudiant = {}
                        let listEmail = []
                        doc.forEach(d => {
                            if (d && d.user_id) {
                                dicEtudiant[d.user_id.email] = d._id
                            }
                        })
                        let sisrList = []
                        let slamList = []
                        xlData.forEach(data => {
                            listEmail.push(data['EMAIL'])
                            if (dicEtudiant[data['EMAIL']]) {
                                if (data['TYPE'] && data['TYPE'].startsWith('SISR')) {
                                    listEmail.splice(listEmail.indexOf(data['EMAIL']))
                                    sisrList.push(dicEtudiant[data['EMAIL']])
                                }
                                else if (data['TYPE'] && data['TYPE'].startsWith('SLAM')) {
                                    listEmail.splice(listEmail.indexOf(data['EMAIL']))
                                    slamList.push(dicEtudiant[data['EMAIL']])
                                }
                                else if (!data['TYPE']) {
                                    listEmail.splice(listEmail.indexOf(data['EMAIL']))
                                }
                            }
                        })
                        Etudiant.updateMany({ _id: { $in: sisrList } }, { classe_id: sisr._id }, { new: true }).then(docs => {
                            Note.updateMany({ etudiant_id: { $in: sisrList } }, { classe_id: sisr._id })
                            Etudiant.updateMany({ _id: { $in: slamList } }, { classe_id: slam._id }, { new: true }).then(docs2 => {
                                Note.updateMany({ etudiant_id: { $in: slamList } }, { classe_id: slam._id })
                                console.log(docs.n, docs2.n, "Ces emails n'ont pas pu être attribué:", listEmail)
                                Examen.updateMany({ classe_id: { $in: [sisr._id, slam._id, oldSIO._id] } }, { classe_id: [sisr._id, slam._id, oldSIO._id] })
                                process.exit()
                            })
                        })

                    })
                })
            })
        })


    })