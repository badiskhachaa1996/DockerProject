const mongoose = require("mongoose");
const ticket_schema = new mongoose.Schema({
    //Exemple Ticket
    sujet_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "sujet"
    },
    filiere: { type: String, required: false },
    site: { type: String, required: false },
    campus: { type: String, required: false },
    type: { type: String, required: false },
    demande: { type: String, required: false },
    module: { type: String, required: false },
    //Fin Exemple
    custom_id: { type: String, required: false },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    created_date: { type: Date },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    type_auto: { type: String, default: 'Assignation Automatique' }
});
//creation de la table avec le nom User ( model/classe) à l'aide de la biblio mongoose et son schema
const AutoTicket = mongoose.model("autoTicket", ticket_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { AutoTicket };