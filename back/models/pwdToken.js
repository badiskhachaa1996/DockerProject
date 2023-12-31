//déclaration de la biblio mongoose pour l'utiliser c'est comme un import
const mongoose = require("mongoose");
// creation d'une table bd avec le nom de la table dans la BD nosql collection et voila son schema
const pwdToken_schema = new mongoose.Schema({
    date_creation: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    }
    
});
//creation de la table avec le nom Service ( model/classe) à l'aide de la biblio mongoose et son schema
const pwdToken = mongoose.model("pwdToken", pwdToken_schema);
//on prépare ce model pour l'importer dans d'autres composants en l'exportant comme ça
module.exports = { pwdToken };
