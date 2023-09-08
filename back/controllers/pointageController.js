const express = require("express");
const { PointageData } = require("../models/PointageData");
const { PointeuseData } = require("../models/PointeuseData");
const app = express(); //à travers ça je peux faire la creation des services
app.disable("x-powered-by");

app.get("/getAll", (req, res, next) => {
    PointageData.find().sort({ date: -1 })
        .then((formFromDb) => {
            let r = {}// {date : PointageData[]}
            formFromDb.forEach(pd => {
                let d = new Date(pd.date)
                let k = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
                if (r[k]) {
                    r[k].push(pd)
                } else {
                    r[k] = [pd]
                }
            })
            res.status(200).send({ pointages: formFromDb, dicDayPointage: r })
        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get("/getAllToday", (req, res, next) => {
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    console.log(`${year}-${month}-${day}`)
    PointageData.find({ date: { $gte: `${year}-${month}-${day}`, $lte: `${year}-${month}-${day} 23:59` } }).sort({ updateDate: -1 })
        .then((formFromDb) => { res.status(200).send(formFromDb); })
        .catch((error) => { console.error(error); res.status(500).send(error); });
});

app.get('/getAllWithUserID', (req, res) => {
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    PointageData.find({ date: { $gte: `${year}-${month}-${day}`, $lte: `${year}-${month}-${day} 23:59` } }).sort({ updateDate: -1 })
        .then((formFromDb) => {
            let machine_id = []
            formFromDb.forEach(pd => {
                machine_id.push(pd.machine)
            })
            PointeuseData.find({ serial_number: { $in: machine_id } }).populate({ path: 'users', populate: { path: 'user_id' } }).then(poid => {
                let dicR = {}
                poid.forEach(poi => {
                    if (!dicR[poi.serial_number])
                        dicR[poi.serial_number] = {}
                    poi.users.forEach(u => {
                        dicR[poi.serial_number][u.UID] = u.user_id
                    })
                })
                res.status(200).send({ PD: formFromDb, dicPD: dicR });
            })

        })
        .catch((error) => { console.error(error); res.status(500).send(error); });
})


app.delete('/delete/:id', (req, res) => {
    PointageData.findByIdAndRemove(req.params.id).then(doc => {
        res.send(doc)
    }).catch((error) => { console.error(error); res.status(500).send(error); });
})

module.exports = app;