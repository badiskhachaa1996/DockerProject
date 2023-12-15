
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
const { Classe } = require('../models/classe')
const { Diplome } = require('../models/diplome')
const { Campus } = require('../models/campus')
var d = new Date().toLocaleDateString('fr-FR')
const mongoose = require("mongoose");
var fs = require('fs');
var XLSX = require("xlsx");
//50 23 * * * node /home/ubuntu/ems3/back/scriptCron/exportDBEtudiants.js >/home/ubuntu/logCron/`date +\%d\\\%m\-\%H:\%M`-exceldump.log 2>&1
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        setTimeout(() => {
            process.exit()

        }, 300000)
        //Sample data set
        var d = new Date().toLocaleDateString('fr-FR')
        d = d.replace(/\//, '-')
        d = d.replace(/\//, '-')
        d = d.replace(/\//, '-')
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
                            "Ecole": etudiant?.ecole_id?.libelle,
                            'Statut': etudiant?.statut,
                            'Initial/Alternant': (etudiant?.isAlternant) ? 'Alternant' : 'Initial',
                            "Dernier Diplôme": etudiant?.dernier_diplome,
                            "Remarque": etudiant?.remarque,
                            "ENIC NARIC": etudiant?.enic_naric,
                            "Année Scolaire": etudiant?.annee_scolaire,
                            "Livret": etudiant?.lien_livret?.read,
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
                            "ID USER": etudiant?.user_id?.id,
                            "ID DIPLOME": etudiant?.filiere?.id,
                            "ID CAMPUS": etudiant?.campus?.id,
                            "ID ECOLE": etudiant?.ecole_id?.id,
                            "ID ETUDIANT": etudiant?.id

                        }
                        let classe_name = etudiant?.classe_id?.abbrv
                        classe_name = classe_name.replace('- ESTYA', '')
                        classe_name = classe_name.replace('Montpellier', 'MTP')
                        classe_name = classe_name.replace('  ', ' ')
                        classe_name = classe_name.replace('  ', ' ')
                        if (classe_name.length > 30)
                            classe_name = classe_name.replace('RNCP ', '')
                        if (!etudiantDic[classe_name])
                            etudiantDic[classe_name] = [data]
                        else
                            etudiantDic[classe_name].push(data)
                        if (!classeList.includes(classe_name))
                            classeList.push(classe_name)
                    }

                })
                let worksheets = {}
                classeList.forEach(classe => {
                    worksheets[classe] = XLSX.utils.json_to_sheet(etudiantDic[classe]);
                })
                let dir = "/home/ubuntu/backupEXCEL"
                const workbook = { Sheets: worksheets, SheetNames: classeList };
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                var files = fs.readdirSync(dir);
                if (files.length > 90) {
                    let fileToDelete = ""
                    let DateToFile = new Date()
                    files.forEach(f => {
                        let stats = fs.statSync(`${dir}/${f}`)
                        if (DateToFile.getTime() < stats.mtime.getTime()) {
                            DateToFile = stats.mtime
                            fileToDelete = f
                        }
                        fs.unlink(`${dir}/${fileToDelete}`, (err) => {
                            if (err) {
                                throw err;
                            }
                        
                            console.log(`${fileToDelete} supprimé`);
                        });
                    })
                }
                XLSX.writeFile(workbook, `${dir}/Etudiants_${d}.xls`);
                process.exit()
            })
    })