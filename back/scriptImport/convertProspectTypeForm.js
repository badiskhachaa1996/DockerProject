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
        Prospect.updateMany({ type_form: { $in: ["Estya", "ESTYA"] } }, { type_form: "estya" })
        Prospect.updateMany({ type_form: "ADG" }, { type_form: "adg" })
    })