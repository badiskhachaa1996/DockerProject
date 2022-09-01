const mongoose = require("mongoose");
const { Prospect } = require("../models/prospect");
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Prospect.find().then(dataP => {
            dataP.forEach(p => {
                let c1 = p?.campus_choix_1?.replace('Campus ', '')
                let c2 = p?.campus_choix_2?.replace('Campus ', '')
                let c3 = p?.campus_choix_3?.replace('Campus ', '')
                let type_form = p?.type_form?.replace('eduhorizons', "EduHorizons")
                Prospect.findByIdAndUpdate(p._id, { campus_choix_1: c1, campus_choix_2: c2, campus_choix_3: c3, type_form }, { new: true },(err,newP)=>{
                    if(err){
                        console.error(err)
                    }else{
                        console.log(newP.campus_choix_1)
                    }
                })
            })
        })
    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });