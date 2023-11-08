const mongoose = require("mongoose");
const { DailyCheck } = require("../models/DailyCheck");
//59 23 * * 1-5 node /home/ubuntu/ems3/back/scriptCron/checkOutChecker.js >/home/ubuntu/logCron/checkOutChecker/`date +\%d\\\%m`.log 2>&1
mongoose
    .connect( "mongodb://127.0.0.1:27017/learningNode", {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('MONGODB CONNECTED')
        DailyCheck.updateMany({ check_out: null }, { auto: true }).then(conges => {
            process.exit()
        })
    })