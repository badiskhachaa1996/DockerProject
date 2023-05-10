const mongoose = require("mongoose");
const { Note } = require("../models/note");
mongoose
    .connect(`mongodb://localhost:27017/1403`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {

    })