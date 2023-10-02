const linksSchema = mongoose.Schema({
    nom: { type: String, required: true },
    lien: { type: String, required: true },
 
});

const Links = mongoose.model('links', linksSchema);
module.exports = { Links };