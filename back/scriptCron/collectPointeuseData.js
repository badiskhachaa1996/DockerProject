const mongoose = require("mongoose");
var fs = require('fs');
const { PointeuseData } = require("../models/PointeuseData");
//*/5 * * * * node /home/ubuntu/ems3/back/scriptCron/collectPointeuseData.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-collectPointeuseData.log 2>&1
mongoose
    .connect(`mongodb://127.0.0.1:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('CONNECTION MONFO')
        let pathToDirectory = '/var/www/P' //'/var/www/P'
        const directoriesInDIrectory = fs.readdirSync(pathToDirectory, { withFileTypes: true })
            .filter((item) => item.isDirectory())
            .map((item) => item.name);
        console.log(directoriesInDIrectory)
        directoriesInDIrectory.forEach(serial_number => {
            let fileData = fs.readFileSync(pathToDirectory + "/" + serial_number + "/users").toString()

            let nb_users = fileData.match(new RegExp("User ID", "g")).length

            let posDN = fileData.indexOf('DeviceName       : ')
            let nom_appareil = fileData.substring(posDN + 'DeviceName       : '.length, fileData.indexOf('\n', posDN)).replace(' ', '')

            let posIP = fileData.indexOf('IP:')
            let ip = fileData.substring(posIP + 'IP:'.length, fileData.indexOf(' ', posIP)).replace(' ', '')

            let posMask = fileData.indexOf('mask:')
            let mask = fileData.substring(posMask + 'mask:'.length, fileData.indexOf(' ', posMask)).replace(' ', '')

            let posGate = fileData.indexOf('gateway:')
            let gateway = fileData.substring(posGate + 'gateway:'.length, fileData.indexOf('\n', posGate)).replace(' ', '')

            let posFirm = fileData.indexOf('Firmware Version : ')
            let firmware = fileData.substring(posFirm + 'Firmware Version : '.length, fileData.indexOf('\n', posFirm)).replace(' ', '')

            let posPlateforme = fileData.indexOf('Platform         : ')
            let plateforme = fileData.substring(posPlateforme + 'Platform         : '.length, fileData.indexOf('\n', posPlateforme)).replace(' ', '')

            let posMac = fileData.indexOf('MAC: ')
            let adresse_mac = fileData.substring(posMac + 'MAC: '.length, fileData.indexOf('\n', posMac)).replace(' ', '')

            let posFace = fileData.indexOf('faces:')
            let nb_faces = fileData.substring(posFace + 'faces:'.length, fileData.indexOf('/', posFace)).replace(' ', '')

            let posFinger = fileData.indexOf('fingers:')
            let nb_fingers = fileData.substring(posFinger + 'fingers:'.length, fileData.indexOf('/', posFinger)).replace(' ', '')

            PointeuseData.findOne({ serial_number }).then(data => {
                if (data) {
                    PointeuseData.findByIdAndUpdate(data._id, {
                        nb_users, nom_appareil, ip, mask, gateway, firmware, plateforme, adresse_mac, nb_faces, nb_fingers
                    }).then(pd => {
                        console.log('Update de ' + serial_number)
                    })
                } else {
                    let pd = new PointeuseData({
                        nb_users, nom_appareil, ip, mask, gateway, firmware, plateforme, adresse_mac, nb_faces, nb_fingers, serial_number
                    })
                    pd.save().then(newPd => {
                        console.log('Ajout de ' + serial_number)
                    })
                }
            })
        })

    })