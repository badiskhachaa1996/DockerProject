const mongoose = require("mongoose");
const { DailyCheck } = require("../models/DailyCheck");
const { Collaborateur } = require("../models/Collaborateur");
//50 23 * * 1-5 node /home/ubuntu/ems3/back/scriptCron/checkOutChecker.js >/home/ubuntu/logCron/checkOutChecker/`date +\%d\\\%m`.log 2>&1
function diffinMinutes(date1, date2) {
    date1 = new Date(date1)
    date2 = new Date(date2)
    let hours = date2.getHours() - date1.getHours()
    let minutes = date2.getMinutes() - date1.getMinutes()
    return hours * 60 + minutes
}
mongoose
    .connect("mongodb://127.0.0.1:27017/learningNode", {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('MONGODB CONNECTED')
        setTimeout(() => {
            process.exit()

        }, 300000)
        DailyCheck.find({ check_out: null }).then(dcs => {
            Collaborateur.find().then(collabs => {
                let dicCollab = {}
                collabs.forEach(c => { dicCollab[c.user_id] = c })
                dcs.forEach(dc => {
                    let pauseTiming = 0;
                    if (dc.pause)
                        dc.pause.forEach((p) => {
                            if (p.out) {
                                pauseTiming = pauseTiming + diffinMinutes(p.in, p.out);
                            } else {
                                p.out = new Date(p.in)
                                p.out.setHours(p.out.getHours() + 1)
                                pauseTiming = pauseTiming + diffinMinutes(p.in, p.out);
                            }
                        })

                    dc.pause_timing = pauseTiming;
                    let totalTimeCra = 0;
                    if (dc.cra)
                        dc?.cra.map((cra) => {
                            totalTimeCra += cra.number_minutes;
                        });

                    if (!dicCollab[dc.user_id] || !dicCollab[dc.user_id].h_cra) {
                        dicCollab[dc.user_id] = { h_cra: 7 }
                    }
                    // conversion du taux cra du collaborateur en minutes
                    dicCollab[dc.user_id].h_cra *= 60;
                    // partie calcule du pourcentage en fonction du totalTimeCra
                    let percent = (totalTimeCra * 100) / dicCollab[dc.user_id].h_cra;
                    dc.taux_cra = percent
                    dc.auto = true
                    dc.check_out = new Date()
                    let hours = new Date(dc.check_in).getHours() + totalTimeCra + Math.trunc(pauseTiming / 60)
                    let minutes = new Date(dc.check_in).getMinutes() + (pauseTiming - Math.trunc(pauseTiming % 60))
                    dc.check_out.setHours(hours, minutes, 0, 0)
                    DailyCheck.findByIdAndUpdate(dc._id, { ...dc }).then(r => {
                        if (dc._id == dcs[dcs.length - 1]._id) {
                            console.log("DONE")
                            process.exit()
                        }
                    }, error => {
                        if (dc._id == dcs[dcs.length - 1]._id) {
                            console.error(error)
                            process.exit()
                        }
                    })
                })
            })



        })
    })