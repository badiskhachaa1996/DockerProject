const mongoose = require("mongoose");
var fs = require('fs');
const { PointeuseData } = require("../models/PointeuseData");
const { PointageData } = require("../models/PointageData");
//*/5 9-17 * * 1-5 node /home/ubuntu/ems3/back/scriptCron/collectAttendanceData.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-collectAttendanceData.log 2>&1
mongoose
    .connect(`mongodb://127.0.0.1:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        setTimeout(() => {
            process.exit()

        }, 200000)
        let pathToDirectory = '/var/www/P' //'/var/www/P'
        const directoriesInDIrectory = fs.readdirSync(pathToDirectory, { withFileTypes: true })
            .filter((item) => item.isDirectory())
            .map((item) => item.name);
        directoriesInDIrectory.forEach(serial_number => {
            const files = fs.readdirSync(pathToDirectory + "/" + serial_number)
            files.forEach(f => {
                var linesNb = 0
                if (f != 'users' && !f.startsWith('config')) {
                    let fileData = fs.readFileSync(pathToDirectory + "/" + serial_number + "/" + f).toString()
                    let lines = fileData.split('\n')
                    if (fs.existsSync(pathToDirectory + "/" + serial_number + `/config-${f}.txt`))
                        linesNb = parseInt(fs.readFileSync(pathToDirectory + "/" + serial_number + `/config-${f}.txt`))
                    fs.writeFileSync(pathToDirectory + "/" + serial_number + `/config-${f}.txt`, lines.length.toString())
                    if (lines != linesNb) {
                        let newlines = lines.slice(linesNb)
                        newlines.forEach(dataLine => {
                            if (dataLine.indexOf('Received data') != -1) {
                                dataLine = dataLine.replace('Received data: <Attendance>: ', '')
                                let UID = dataLine.substring(0, dataLine.indexOf(' : '))
                                let date = new Date(dataLine.substring(dataLine.indexOf(' : ') + ' : '.length, dataLine.indexOf(' (')))
                                let type = "Face"
                                if (dataLine.includes('(25, 0)'))
                                    type = "Finger"

                                let r = new PointageData({
                                    machine: serial_number,
                                    date, uid: UID, type,
                                    updateDate: new Date()
                                })
                                r.save().then(newPointage => {
                                    console.log('Ajout de ', { ...newPointage._doc })
                                    if (serial_number == directoriesInDIrectory[directoriesInDIrectory.length - 1] && f == files[files.length - 1])
                                        process.exit()
                                }, error => {
                                    console.error(error)
                                    if (serial_number == directoriesInDIrectory[directoriesInDIrectory.length - 1] && f == files[files.length - 1])
                                        process.exit()
                                })
                            }
                        })
                    }
                }

            })
            if (files.length == 0 && serial_number == directoriesInDIrectory[directoriesInDIrectory.length - 1])
                process.exit()
        })
        //process.exit()
    })