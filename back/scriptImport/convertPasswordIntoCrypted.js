const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        /*User.find({ password: { $ne: null } }).then(dataU => {
            console.log(dataU)
        })*/
        User.find({ $where: "this.password == this.email" }).then(dataU2 => {
            dataU2.forEach(u => {
                User.findByIdAndUpdate(u._id, {
                    password: bcrypt.hashSync(u.password, 8)
                }, { new: true }, (newU => {
                    console.log(newU)
                }))
            })
        })
    })