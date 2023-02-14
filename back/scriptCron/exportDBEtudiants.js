
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Classe } = require('../models/classe')
const { Diplome } = require('../models/diplome')
const { Campus } = require('../models/campus')
var d = new Date().toLocaleDateString('fr-FR')
const mongoose = require("mongoose");
var XLSX = require("xlsx");
mongoose
    .connect(`mongodb://localhost:27017/backup`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        //Sample data set
        d = d.replaceAll('/', '-')
        console.log(d)
        Etudiant.find().populate('user_id').populate('classe_id').populate('campus')
            .populate('filiere').populate('conseiller').then(etudiants => {
                var etudiantDic = {}
                var classeList = []
                etudiants.forEach(etudiant => {
                    if (etudiant.user_id && etudiant.classe_id) {
                        let data = {
                            //Informations Personnelles
                            'ID Etudiant': etudiant?.custom_id,
                            'Prénom': etudiant?.user_id?.firstname,
                            'Nom': etudiant?.user_id?.lastname,
                            'Email Teams': etudiant?.user_id?.email,
                            'Email Perso': etudiant?.user_id?.email_perso,
                            'Nationalité': etudiant?.nationalite,
                            'Date de naissance': etudiant?.date_naissance,
                            "Pays d'origine": etudiant?.pays_origine,
                            //Informations Scolaires
                            'Campus': etudiant?.campus?.libelle,
                            'Filière': etudiant?.filiere?.titre,
                            "Ecole": etudiant?.ecole?.libelle,
                            'Statut': etudiant?.statut,
                            'Initial/Alternant': (etudiant?.isAlternant) ? 'Alternant' : 'Initial',
                            "Dernier Diplôme": etudiant?.dernier_diplome,
                            "Remarque": etudiant?.remarque,
                            "ENIC NARIC": etudiant?.enic_naric,
                            "Année Scolaire": etudiant?.annee_scolaire,
                            "Livret": etudiant?.lien_livret.read,
                            "Dossier Professionel": etudiant?.lien_dossier_professionel,
                            "Tableau Synthèse": etudiant?.lien_tableau_synthese,
                            "Bulletins": etudiant?.lien_bulletin,
                            "Attestation": etudiant?.lien_attestation,
                            "Date Inscription": etudiant?.date_inscription,
                            //Informations Alternance
                            'Code Partenaire': etudiant?.code_partenaire,
                            'INE': etudiant?.numero_INE,
                            'NUR': etudiant?.numero_NIR,
                            "En Stage": (etudiant?.isOnStage) ? "Stagiaire" : "Non",
                            "Conseiller": (etudiant?.conseiller) ? etudiant?.conseiller?.firstname + " " + etudiant?.conseiller?.lastname : "Non",
                            "Etat Contract": etudiant?.etat_contract,
                            "Entreprise": etudiant?.entreprise,
                            //Informations SOS
                            "SOS Email": etudiant?.sos_email,
                            "SOS Téléphone": etudiant?.sos_phone,
                            "Nom Représentant Légal": etudiant?.nom_rl,
                            "Prénom Représentant Légal": etudiant?.nom_rl,
                            "Téléphone Représentant Légal": etudiant?.phone_rl,
                            "Email Représentant Légal": etudiant?.email_rl,
                            "Adresse Représentant Légal": etudiant?.adresse_rl,
                            "Personne à Mobilité Réduite": (etudiant?.isHandicaped) ? 'Oui' : 'Non',
                            "Suivi PMR": etudiant?.suivi_handicaped,
                            //Autres
                            "Statut du Dossier": etudiant?.statut_dossier,
                            "Désactivé": (etudiant?.isActive) ? "Activé" : "Désactivé",
                            "Accès IMS": (etudiant?.valided_by_admin) ? "Oui" : "Non",
                            "Accès Teams": (etudiant?.valided_by_support) ? etudiant?.date_valided_by_support : "Non",
                            "Date Téléchargement Bulletin": etudiant?.date_telechargement_bulletin,
                            "Source Insertion": etudiant?.source,
                            //IMS
                            "ID USER": etudiant?.user_id?._id,
                            "ID DIPLOME": etudiant?.filiere?._id,
                            "ID CAMPUS": etudiant?.campus?._id,
                            "ID ECOLE": etudiant?.ecole_id?._id

                        }
                        if (!etudiantDic[etudiant.classe_id.abbrv])
                            etudiantDic[etudiant.classe_id.abbrv] = [data]
                        else
                            etudiantDic[etudiant.classe_id.abbrv].push(data)
                        if (classeList.includes(etudiant.classe_id.abbrv))
                            classeList.push(etudiant.classe_id.abbrv)
                    }

                })
                let worksheets = {}
                classeList.forEach(classe => {
                    worksheets[classe] = XLSX.utils.json_to_sheet(etudiantDic[classe]);
                })
                console.log(worksheets, classeList)
                const workbook = { Sheets: worksheets, SheetNames: classeList };
                XLSX.writeFile(workbook, `Etudiants_${d}.xls`);
                process.exit()
            })
    })