const mongoose = require("mongoose");
const { User } = require("../models/user");
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Mongo Up")
        User.updateMany({ type: "Etudiant" }, { type: "Initial" }, { new: true }, (err, doc) => {
            if (err) {
                console.error(err)
            }else{
                if(doc){
                    console.log("Fini")
                }
            }
        })
    })