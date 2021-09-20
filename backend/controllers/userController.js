const express = require("express");
const app = express(); //à travers ça je peux faire la creation des services
const { User } = require("./../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const myPlaintextPassword = 's0/\/\P4$$w0rD';


let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
        user: 'estya-ticketing@estya.com',
        pass: 'ESTYA@@2021',
    },
});




//service registre
app.post("/registre", (req, res) => {
    let data = req.body;
    let user = new User({
        civilite: data.civilite,
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        adresse: data.adresse,
        email: data.email,
        password: bcrypt.hashSync(data.password, 8),
        role: data.role || "user",
        service_id: data?.service_id || null
    })
    user.save().then((userFromDb) => {
        res.status(200).send(userFromDb);
        let htmlmail = '<p>Bonjour ' + userFromDb.lastname + ' ' + userFromDb.firstname + ', </p><p style="color:black"> <span style="color:orange">Felicitations ! </span> Votre compte E-Ticketing a été crée avec succés.</p><p style="color:black">Cordialement.</p><footer> <img  src="red"/></footer>';
        let mailOptions = {
            from: 'estya-ticketing@estya.com',
            to: data.email,
            subject: 'Estya-Ticketing',
            html: htmlmail,
            attachments: [{
                filename: 'signature.png',
                path: 'assets/signature.png',
                cid: 'red' //same cid value as in the html img src
            }]
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });
    }).catch((error) => {
        console.log(error)
        res.status(400).send(error);
    })
});




//service registre
app.post("/sendemail", (req, res) => {
    let data = req.body;
        let htmlmail = '<p>Bonjour ' + ', </p><p style="color:black">  Voila le lien pour modifier votre mot de passe.</p> <p>http://localhost:4200/initialmdp</p> <p style="color:black">Cordialement.</p><footer> <img  src="red"/></footer>';
        let mailOptions = {
            from: 'estya-ticketing@estya.com',
            to: data.email,
            subject: 'Estya-Ticketing',
            html: htmlmail,
            attachments: [{
                filename: 'signature.png',
                path: 'assets/signature.png',
                cid: 'red' //same cid value as in the html img src
            }]
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(500).send(error)
            }else{
                res.status(200).send(info)
            }
        });
   
});

//service login
app.post("/login", (req, res) => {
    let data = req.body;
    User.findOne({
        email: data.email,
    }).then((userFromDb) => {
        comparer = bcrypt.compareSync(data.password, userFromDb.password);
        if (!userFromDb || !comparer) {
            res.status(404).send({ message: data });
        }
        else {
            let token = jwt.sign({ id: userFromDb._id, role: userFromDb.role, service_id: userFromDb.service_id }, "mykey")
            res.status(200).send({ token });
        }
    }).catch((error) => {
        console.log(error)
        res.status(404).send(error);
    })
});
app.get("/getById/:id", (req, res) => {
    let id = req.params.id;
    User.findOne({ _id: id }).then((userFromDb) => {
        let userToken = jwt.sign({ userFromDb }, "userData")
        res.status(200).send({ userToken });
    }).catch((error) => {
        console.log(error)
        res.status(404).send(error);
    })
});
app.get("/getAll", (req, res) => {
    User.find()
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            console.log(err);
            res.status(404).send(error);
        })
});

app.get("/sendmail",(req,res) => {
    
})
app.post("/updateById/:id", (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id },
        {
            civilite: req.body.civilite,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            role: req.body.role,
            adresse: req.body.adresse,
            service_id: req.body.service_id

        }, { new: true }, (err, user) => {
            if (err) {
                console.log(err);
                res.send(err)
            }else{
                res.send(user)
            }
        })
})
app.get("/getAllbyService/:id", (req, res) => {
    User.find({ service: req.params.id })
        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.log(err);
        })
});
app.get("/getAllAgent/", (req, res) => {
    User.find({ role: ["Responsable", "Agent", "Admin"] })

        .then(result => {
            res.send(result.length > 0 ? result : []);
        })
        .catch(err => {
            res.status(404).send(error);
            console.log(err);
        })
})

app.post("/updatePassword/:id",(req,res)=>{
    User.findOneAndUpdate({ _id: req.params.id },{
        password:bcrypt.hashSync(req.body.password, 8)
    }, { new: true }, (err, user) => {
        if (err) {
            console.log(err);
            res.send(err)
        }else{
            res.send(user)
        }
    })
})



app.post("/uploadPhoto/:id",(req,res)=>{
if (req.body.file && req.body.file != null && req.body.file != '') {
    fs.mkdir("./storage/" + "avatar" + "/",
        { recursive: true }, (err) => {
            if (err) {
                console.error(err);
            }
        });
    fs.writeFile("storage/" + "avatar"+ "/" + req.body.file.filename, req.body.file.value, 'base64', function (err) {
        if (err) {
            console.log(err);
        }
    });
}
})


module.exports = app;
