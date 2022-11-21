var XLSX = require('xlsx')
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Campus } = require('../models/campus')
const { Etudiant } = require('../models/etudiant')
const { Ecole } = require('../models/ecole')
const { Classe } = require('../models/Classe')
var workbook = XLSX.readFile('mtp_data.xlsx', { cellDates: true });
var sheet_name_list = workbook.SheetNames; // Classes Name
//sheet_name_list = [workbook.SheetNames[24]]
let users = []
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        let campus = ""
        let classeDic = {}
        Classe.find().then(classes => {
            classes.forEach(c => {
                classeDic[c.abbrv] = c._id
            })
            Campus.find({ libelle: { "$regex": "Montpellier", "$options": "i" } }).populate('ecole_id').then(c1 => {
                if (c1 && c1.length == 1) {
                    campus = c1[0]
                }
                else {
                    c1.forEach(c => {
                        if (c.ecole_id.libelle.toUpperCase().includes("STYA")) {
                            campus = c
                        }
                    })
                }
                console.log(c1)
                if (campus && campus != "")
                    User.find().then(data => {
                        users = data
                        let EmailList = []
                        data.forEach(us => {
                            EmailList.push(us?.email)
                        })
                        sheet_name_list.forEach(sheet => {
                            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                            xlData.forEach(data => {
                                let classe = classeDic[data['Groupe/Classe']]
                                let dn = data['Date de naissance']
                                if (typeof (dn) == typeof ('str')) {
                                    dn.replace(' ', '')
                                    dn = new Date(convertDate(dn))
                                    if (dn == "Invalid Date")
                                        dn = new Date()
                                }

                                if (data['Email IMS']) {
                                    let mail = data['Email IMS']
                                    if (EmailList.includes(mail)) {
                                        User.findOneAndUpdate({ email: data['Email IMS'] }, {
                                            firstname: toCamelCase(data['Prénom']),
                                            lastname: data['Nom'].toUpperCase(),
                                            phone: data['Téléphone'],
                                            email: data['Email IMS'],
                                            email_perso: data['Email Perso'],
                                            civilite: null,
                                            type: data['Alternant'] == 'NON' ? 'Initial' : 'Alternant',
                                            nationnalite: data['Nationnalité'],
                                            verifedEmail: true
                                        }, { new: true }, (err, newU) => {
                                            if (!err && newU) {
                                                let code = ""
                                                if (dn && data['Nationnalité']) {
                                                    if (!newU.nationnalite)
                                                        newU.nationnalite = "Inconnu"
                                                    code = generateCode(newU, dn)
                                                } else {
                                                    newU.nationnalite = "Inconnu"
                                                    code = generateCode(newU, new Date())
                                                    console.error("BAD CODE:", data['Nom'], dn, data['Nationalité'])
                                                }
                                                Etudiant.findOne({ user_id: newU._id }).then(dataU => {
                                                    if (dataU) {
                                                        Etudiant.findByIdAndUpdate(dataU._id, {
                                                            classe_id: classe,
                                                            statut: data['Alternant'] == 'NON' ? 'Initial' : 'Alternant',
                                                            nationalite: data['Nationnalité'],
                                                            date_naissance: dn,
                                                            custom_id: code,
                                                            dernier_diplome: data['Filière'],
                                                            isAlternant: data['Alternant'] != 'NON',
                                                            diplome: data['Filière'],
                                                            remarque: getRemarque(data, sheet),
                                                            valided_by_admin: true,
                                                            valided_by_support: true
                                                        }, { new: true }, (err, newE) => {
                                                            if (err) {
                                                                console.error(err)
                                                            } else {
                                                                console.log(newU.email, " mis à jour x2")
                                                            }
                                                        })
                                                    } else {
                                                        let etu = new Etudiant({
                                                            user_id: newU._id,
                                                            classe_id: classe,
                                                            statut: data['Alternant'] == 'NON' ? 'Initial' : 'Alternant',
                                                            nationalite: data['Nationnalité'],
                                                            date_naissance: dn,
                                                            custom_id: code,
                                                            dernier_diplome: data['Filière'],
                                                            isAlternant: data['Alternant'] != 'NON',
                                                            diplome: data['Filière'],
                                                            remarque: getRemarque(data, sheet),
                                                            campus: campus._id,
                                                            valided_by_admin: true,
                                                            valided_by_support: true
                                                        })
                                                        etu.save((errEtu, newEtu) => {
                                                            if (errEtu) {
                                                                console.error(errEtu)
                                                            } else {
                                                                console.log(newEtu.email, " mis à jour")
                                                            }
                                                        })
                                                    }
                                                })
                                            } else {
                                                console.error(err, newU)
                                            }
                                        })
                                    } else {
                                        EmailList.push(mail)
                                        let u = new User({
                                            firstname: toCamelCase(data['Prénom']),
                                            lastname: data['Nom'].toUpperCase(),
                                            phone: data['Téléphone'],
                                            email: data['Email IMS'],
                                            email_perso: data['Email Perso'],
                                            civilite: null,
                                            type: data['Alternant'] == 'NON' ? 'Initial' : 'Alternant',
                                            nationnalite: data['Nationnalité'],
                                            verifedEmail: true
                                        })
                                        u.save((err, newUser) => {
                                            users.push(newUser)
                                            let code = ""
                                            if (dn && data['Nationnalité']) {
                                                if (!newUser.nationnalite)
                                                    newUser.nationnalite = "Inconnu"
                                                code = generateCode(newUser, dn)
                                            } else {
                                                newUser.nationnalite = "Inconnu"
                                                code = generateCode(newUser, new Date())
                                                console.error("BAD CODE:", data['Nom'], dn, data['Nationalité '])
                                            }
                                            if (!err && newUser) {
                                                let etu = new Etudiant({
                                                    user_id: newUser._id,
                                                    classe_id: classe,
                                                    statut: data['Alternant'] == 'NON' ? 'Initial' : 'Alternant',
                                                    nationalite: data['Nationnalité'],
                                                    date_naissance: dn,
                                                    custom_id: code,
                                                    dernier_diplome: data['Filière'],
                                                    isAlternant: data['Alternant'] != 'NON',
                                                    diplome: data['Filière'],
                                                    remarque: getRemarque(data, sheet),
                                                    campus: campus._id,
                                                    valided_by_admin: true,
                                                    valided_by_support: true
                                                })
                                                etu.save((errEtu, newEtu) => {
                                                    if (errEtu) {
                                                        console.error(errEtu)
                                                    } else {
                                                        console.log(newEtu?.custom_id)
                                                    }
                                                })
                                            } else {
                                                console.error(err, u)
                                            }
                                        })

                                    }
                                } else {
                                    if (data['Prénom']) {
                                        console.error("Email not found", data['Prénom'], sheet)
                                    } else {
                                        console.error("Prenom not found", data)
                                    }

                                }
                            })

                        })
                        console.log("FINISH")
                    })
                else
                    console.error("Campus not found")
            })
        })


    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });

function giveStatut(dataStatut) {
    try {
        if (dataStatut != undefined) {
            let statut = dataStatut.toLowerCase()
            if (statut.indexOf('initial') != -1) {
                return "Etudiant"
            } else {
                return "Alternant"
            }
        } else {
            return "Etudiant"
        }
    } catch (error) {
        console.error(error, dataStatut)
        return "Etudiant"
    }


}

function giveAddress(adresse) {
    //22 rue de Paris 91120 Massy Palaiseau
    if (adresse && !adresse.toUpperCase().includes('NON')) {
        let Rue = ""
        let Numero = adresse.substring(0, 3).replace(/[^0-9]/g, '')
        if (adresse.indexOf('bis') != -1) {
            Numero += " bis"
        }

        if (adresse.indexOf('BIS') != -1) {
            Numero += " BIS"
        }
        let r = adresse.replace(Numero, "")
        Rue = r.substring(0, r.indexOf(/[0-9]/g))
        let Postal = adresse.replace(Numero, "").replace(Rue, "").replace(/[^0-9]/g, '').replace(' ', '')
        let Ville = adresse.replace(Numero, "").replace(Rue, "").replace(/[0-9]/g, '').replace('bis', "").replace("BIS", '')
        if (Ville.indexOf(' ') == 0)
            Ville = Ville.slice(1)
        //Rue = adresse.substring(adresse.lastIndexOf(/[0-9]/g) + 1)
        Rue = Ville.slice(Ville.indexOf('  ') + 2)
        Ville = Ville.replace(Rue, "").replace('  ', '')
        return { Ville: Rue, Rue: Ville, Numero, Postal }
    } else {
        return { Ville: "", Rue: "", Numero: "", Postal: "" }
    }



}

function getRemarque(data, sheet) {
    return 'Excel du 20/11/2022 fourni par Haythem, rentré via script le 21/11/2022'
}

function generateCode(user, dn) {
    try {
        let code_pays = user.nationnalite.substring(0, 3)
        dicNationaliteCode.forEach(code => {
            if (code[user.nationnalite] && code[user.nationnalite] != undefined) {
                code_pays = code[user.nationnalite]
            }
        })
        let prenom = user.firstname.substring(0, 1)
        let nom = user.lastname.substring(0, 1)
        let y = 0
        for (let i = 0; i < (nom.match(" ") || []).length; i++) {
            nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
            y = nom.indexOf(" ", y) + 1
        }
        let jour = dn.getDate()
        let mois = dn.getMonth() + 1
        let year = dn.getFullYear().toString().substring(2)
        let nb = users.length.toString()
        nb = nb.substring(nb.length - 3)
        let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
        return r
    } catch (error) {
        console.error(error, user)
    }
}


function toCamelCase(wordArr) {
    if (wordArr) {
        let newStr = wordArr[0].toUpperCase()
        for (let i in wordArr) {
            if (i != 0) {
                if (newStr[i - 1] == " ") {
                    newStr += wordArr[i].toUpperCase()
                } else {
                    newStr += wordArr[i].toLowerCase()
                }
            }
        }
        return newStr
    } else {
        console.error("NAME NOT FOUND")
    }

}

function convertDate(date) {
    let day = date.substring(0, 2)
    let month = date.substring(3, 5)
    let year = date.substring(6)
    let r = new Date(year, parseInt(month) - 1, parseInt(day) + 1)
    if (r != "Invalid Date") {
        return r
    }
    return null
}

let dicNationaliteCode = [
    { 'Aruba': 'ABW' }, // TODO
    { 'Afghane': 'AFG' },
    { 'Angolaise': 'AGO' },
    { 'Anguilla': 'AIA' }, // TODO
    { 'Åland Islands': 'ALA' }, // TODO
    { 'Albanaise': 'ALB' },
    { 'Andorra': 'AND' }, // TODO
    { 'United Arab Emirates': 'ARE' }, // TODO
    { 'Argentine': 'ARG' },
    { 'Armenia': 'ARM' }, // TODO
    { 'American Samoa': 'ASM' }, // TODO
    { 'Antarctica': 'ATA' }, // TODO
    { 'French Southern Territories': 'ATF' }, // TODO
    { 'Antiguaise et barbudienne': 'ATG' },
    { 'Australienne': 'AUS' },
    { 'Autrichienne': 'AUT' },
    { 'Azerbaïdjanaise': 'AZE' },
    { 'Burundaise': 'BDI' },
    { 'Belge': 'BEL' },
    { 'Beninoise': 'BEN' },
    { 'Bonaire, Sint Eustatius and Saba': 'BES' }, //TODO
    { 'Burkinabe': 'BFA' },
    { 'Bangladaise': 'BGD' },
    { 'Bulgare': 'BGR' },
    { 'Bahreinienne': 'BHR' },
    { 'Bahamienne': 'BHS' },
    { 'Bosnienne': 'BIH' },
    { 'Saint BarthÃ©lemy': 'BLM' }, //TODO
    { 'Bielorusse': 'BLR' },
    { 'Belizienne': 'BLZ' },
    { 'Bermuda': 'BMU' },//TODO
    { 'Bolivienne': 'BOL' },
    { 'Brazil': 'BRA' },//TODO
    { 'Barbadienne': 'BRB' },
    { 'Brunei Darussalam': 'BRN' },//TODO
    { 'Bhoutanaise': 'BTN' },
    { 'Bouvet Island': 'BVT' },//TODO
    { 'Botswanaise': 'BWA' },
    { 'Centrafricaine': 'CAF' },
    { 'Canadienne': 'CAN' },
    { 'Cocos (Keeling) Islands': 'CCK' },//TODO
    { 'Suisse': 'CHE' },
    { 'Chilienne': 'CHL' },
    { 'Chinoise': 'CHN' },
    { "Ivoirienne": 'CIV' },
    { 'Camerounaise': 'CMR' },
    { 'Congolaise': 'COD' },
    { 'Congolais': 'COG' },
    { 'Cook Islands': 'COK' },//TODO
    { 'Colombienne': 'COL' },
    { 'Comorienne': 'COM' },
    { 'Cap-verdienn': 'CPV' },
    { 'Costaricaine': 'CRI' },
    { 'Cubaine': 'CUB' },
    { 'Curaçao': 'CUW' },//TODO
    { 'Christmas Island': 'CXR' },//TODO
    { 'Cayman Islands': 'CYM' },//TODO
    { 'Cyprus': 'CYP' },//TODO Chypriote
    { 'Czech Republic': 'CZE' }, //TODO Croate
    { 'Allemande': 'DEU' },
    { 'Djiboutienne': 'DJI' },
    { 'Dominiquaise': 'DMA' },
    { 'Danoise': 'DNK' }, { 'Dominicaine': 'DOM' }, { 'Algerienne': 'DZA' },
    { 'Equatorienne': 'ECU' }, { 'Egyptienne': 'EGY' }, { 'Erythreenne': 'ERI' },
    { 'Western Sahara': 'ESH' },//TODO 
    { 'Espagnole': 'ESP' },
    { 'Estonienne': 'EST' }, { 'Ethiopienne': 'ETH' }, { 'Finlandaise': 'FIN' },
    { 'Fidjienne': 'FJI' },
    { 'Falkland Islands (Malvinas)': 'FLK' },//TODO
    { 'Française': 'FRA' },
    { 'Faroe Islands': 'FRO' }, //TODO
    { 'Micronesia, Federated States of': 'FSM' },//TODO
    { 'Gambienne': 'GAB' },
    { 'Britannique': 'GBR' },
    { 'Georgienne': 'GEO' },
    { 'Guernsey': 'GGY' }, //TODO
    { 'Ghaneenne': 'GHA' },
    { 'Gibraltar': 'GIB' },//TODO
    { 'Guineenne': 'GIN' },
    { 'Guadeloupe': 'GLP' },//TODO
    { 'Gambia': 'GMB' },//TODO
    { 'Guinea-Bissau': 'GNB' },//TODO
    { 'Equatorial Guinea': 'GNQ' },//TODO
    { 'Grecque': 'GRC' }, { 'Grenadienne': 'GRD' },
    { 'Greenland': 'GRL' },//TODO
    { 'Guatemalteque': 'GTM' },
    { 'French Guiana': 'GUF' },//TODO
    { 'Guam': 'GUM' },//TODO
    { 'Guyanienne': 'GUY' },
    { 'Hong Kong': 'HKG' },//TODO
    { 'Heard Island and McDonald Islands': 'HMD' },//TODO
    { 'Hondurienne': 'HND' },
    { 'Croate': 'HRV' },
    { 'Haïtienne': 'HTI' },
    { 'Hongroise': 'HUN' },
    { 'Indonesienne': 'IDN' },
    { 'Isle of Man': 'IMN' },//TODO
    { 'Indienne': 'IND' },
    { 'British Indian Ocean Territory': 'IOT' },//TODO
    { 'Irlandaise': 'IRL' },//TODO
    { 'Iran, Islamic Republic of': 'IRN' }, //TODO
    { 'Irakienne': 'IRQ' },
    { 'Islandaise': 'ISL' },
    { 'Israel': 'ISR' },
    { 'Italienne': 'ITA' },
    { 'Jamaïcaine': 'JAM' },
    { 'Jersey': 'JEY' },//TODO
    { 'Jordanienne': 'JOR' }, { 'Japonaise': 'JPN' },
    { 'Kazakhstanaise': 'KAZ' }, { 'Kenyane': 'KEN' }, { 'Kirghize': 'KGZ' },
    { 'Cambodgienne': 'KHM' },
    { 'Kiribatienne': 'KIR' }, { 'Kittitienne-et-nevicienne': 'KNA' },
    { 'Korea, Republic of': 'KOR' }, //TODO
    { 'Kuwait': 'KWT' },//TODO Koweitienne
    { "Lao People's Democratic Republic": 'LAO' }, //TODO Laotienne
    { 'Libanaise': 'LBN' },
    { 'Liberienne': 'LBR' },
    { 'Libyenne': 'LBY' },
    { 'Saint Lucia': 'LCA' }, //TODO
    { 'Liechtensteinoise': 'LIE' },
    { 'Sri Lanka': 'LKA' },//TODO
    { 'Lesothane': 'LSO' },
    { 'Lituanienne': 'LTU' }, { 'Luxembourgeoise': 'LUX' },
    { 'Latvia': 'LVA' },  //TODO
    { 'Macao': 'MAC' }, //TODO
    { 'Saint-Martinois': 'MAF' },
    { 'Morocco': 'MAR' }, //TODO
    { 'Monaco': 'MCO' }, //TODO
    { 'Moldave': 'MDA' },
    { 'Madagascar': 'MDG' },//TODO
    { 'Maldivienne': 'MDV' },
    { 'Mexicaine': 'MEX' },
    { 'Marshall Islands': 'MHL' },//TODO
    { 'Macedonia, the former Yugoslav Republic of': 'MKD' },//TODO
    { 'Malienne': 'MLI' },
    { 'Maltaise': 'MLT' },
    { 'Myanmar': 'MMR' },//TODO
    { 'Montenegrine': 'MNE' },
    { 'Mongole': 'MNG' },
    { 'Northern Mariana Islands': 'MNP' },//TODO
    { 'Mozambicaine': 'MOZ' }, { 'Mauritanienne': 'MRT' },
    { 'Montserrat': 'MSR' },//TODO
    { 'Martinique': 'MTQ' },//TODO
    { 'Mauritius': 'MUS' },//TODO
    { 'Malawienne': 'MWI' },//TODO
    { 'Malaisienne': 'MYS' },
    { 'Mayotte': 'MYT' },//TODO
    { 'Namibienne': 'NAM' },
    { 'New Caledonia': 'NCL' },//TODO
    { 'Nigerienne': 'NER' },
    { 'Norfolk Island': 'NFK' },//TODO
    { 'Nigeriane': 'NGA' },
    { 'Nicaraguayenne': 'NIC' },
    { 'Niue': 'NIU' },//TODO Niuéenne
    { 'Néerlandaise': 'NLD' },
    { 'Norvegienne': 'NOR' }, { 'Nepalaise': 'NPL' },
    { 'Nauruane': 'NRU' }, { 'Neo-zelandaise': 'NZL' },
    { 'Omanaise': 'OMN' }, { 'Pakistanaise': 'PAK' }, { 'Panameenne': 'PAN' },
    { 'Pitcairn': 'PCN' },//TODO Pitcairnaise
    { 'Peruvienne': 'PER' }, { 'Philippine': 'PHL' },
    { 'Palau': 'PLW' },
    { 'Papouane-neoguineenne': 'PNG' },
    { 'Polonaise': 'POL' }, { 'Portoricaine': 'PRI' },
    { "Korea, Democratic People's Republic of": 'PRK' },
    { 'Portugaise': 'PRT' }, { 'Paraguayenne': 'PRY' }, { 'Palestinienne': 'PSE' },
    { 'French Polynesia': 'PYF' },//TODO Polynésiens
    { 'Qatarienne': 'QAT' },
    { 'Réunion': 'REU' },//TODO Réunionnais
    { 'Roumaine': 'ROU' },
    { 'Russe': 'RUS' }, { 'Rwandaise': 'RWA' },
    { 'Saoudienne': 'SAU' },
    { 'Soudanaise': 'SDN' }, { 'Senegalaise': 'SEN' },
    { 'Singapourienne': 'SGP' },
    { 'South Georgia and the South Sandwich Islands': 'SGS' },//TODO
    { 'Hellenique': 'SHN' },
    { 'Svalbard and Jan Mayen': 'SJM' },//TODO
    { 'Salomonaise': 'SLB' },
    { 'Sierra-leonaise': 'SLE' },
    { 'El Salvador': 'SLV' },
    { 'San Marino': 'SMR' },
    { 'Somalienne': 'SOM' },
    { 'Miquelonais': 'SPM' },
    { 'Serbe': 'SRB' },
    { 'Saoudienne': 'SSD' },
    { 'Santomeenne': 'STP' },
    { 'Surinamaise': 'SUR' },
    { 'Slovaque': 'SVK' }, { 'Slovene': 'SVN' }, { 'Suedoise': 'SWE' },
    { 'Swazie': 'SWZ' },
    { 'Sint Maarten (Dutch part)': 'SXM' },//TODO
    { 'Seychelloise': 'SYC' },
    { 'Syrienne': 'SYR' },
    { 'Turks and Caicos Islands': 'TCA' }, //TODO
    { 'Tchadienne': 'TCD' },
    { 'Togolaise': 'TGO' },
    { 'Thaïlandaise': 'THA' },
    { 'Tadjike': 'TJK' },
    { 'Tokelau': 'TKL' },
    { 'Turkmene': 'TKM' },
    { 'Est-timoraise': 'TLS' },
    { 'Tonguienne': 'TON' }, { 'Trinidadienne': 'TTO' }, { 'Tunisienne': 'TUN' },
    { 'Turque': 'TUR' }, { 'Tuvaluane': 'TUV' }, { 'Taiwanaise': 'TWN' },
    { 'Tanzanienne': 'TZA' },
    { 'Ougandaise': 'UGA' },
    { 'Ukrainienne': 'UKR' },
    { 'United States Minor Outlying Islands': 'UMI' }, //TODO
    { 'Uruguayenne': 'URY' },
    { 'Americaine': 'USA' },
    { 'Ouzbeke': 'UZB' },
    { 'Holy See (Vatican City State)': 'VAT' },//TODO
    { 'Saint-vincentaise-et-grenadine': 'VCT' },
    { 'Venezuelienne': 'VEN' },
    { 'Virgin Islands, British': 'VGB' },//TODO
    { 'Virgin Islands, U.S.': 'VIR' }, //TODO
    { 'Vietnamienne': 'VNM' },
    { 'Vanuatu': 'VUT' },
    { 'Wallis and Futuna': 'WLF' },
    { 'Samoane': 'WSM' },
    { 'Yemenite': 'YEM' },
    { 'Sud-africaine': 'ZAF' },
    { 'Zambienne': 'ZMB' }, { 'Zimbabweenne': 'ZWE' }
]

/*
Email not found MUSTAFA Listing 2022-2023
Email not found ROENA Listing 2022-2023
Email not found BOLLOU, OLIVE, LANDRY Listing 2022-2023
Email not found HAMZA Listing 2022-2023
Email not found ADJO, ANAELLE, CATHY Listing 2022-2023
Email not found ALBAN Listing 2022-2023
Email not found MUAD Listing 2022-2023
Email not found FIRDAOUS Listing 2022-2023
Email not found SABRINA Listing 2022-2023
Email not found SAMY Listing 2022-2023
Email not found MOUCHIDATH, NELI Listing 2022-2023
Email not found KOUASSI, HUGUES, WILFRIED Listing 2022-2023
Email not found GNIDAH Listing 2022-2023
Email not found ARAMATOULAYE Listing 2022-2023
Email not found DOUNIA Listing 2022-2023
Email not found YENOUKOUME, ALIDA, LARISSA Listing 2022-2023
Email not found WALID, ABDERRAHMANE Listing 2022-2023
Email not found ILIAS Listing 2022-2023
Email not found SENAN, CHARLINE Listing 2022-2023
Email not found ILIMATH Listing 2022-2023
Email not found ALLAL Listing 2022-2023
Email not found JULES GAEL Listing 2022-2023
Email not found MOUSSA ADAM Listing 2022-2023
Email not found BADIS Listing 2022-2023
Email not found DON DIVINE Listing 2022-2023
Email not found CHAIMAA Listing 2022-2023
Email not found TAHIRU Listing 2022-2023
Email not found NATHANAEL Listing 2022-2023
Email not found MERVEILLE Listing 2022-2023
Email not found HARCIA, PRUFALDIN Listing 2022-2023
Email not found PAULIN, HANS, GAUTHIER Listing 2022-2023
Email not found FINARITRA Listing 2022-2023
Email not found ELEA Listing 2022-2023
Email not found TATIANA Listing 2022-2023
Email not found WISSALE Listing 2022-2023
Email not found KINDINNIN, KOROTOUM, YASMINE Listing 2022-2023
Email not found AHMED Listing 2022-2023
Email not found MARINETTE Listing 2022-2023
Email not found THIERRY JUNIOR Listing 2022-2023
Email not found KHAOULA Listing 2022-2023
Email not found ORNELLA Listing 2022-2023
Email not found AIMEE, MALVINA Listing 2022-2023
Email not found MARCEL, DESIRE Listing 2022-2023
Email not found ANGELA, SOURIA, OCEANNE Listing 2022-2023
Email not found FATMA Listing 2022-2023
Email not found ISSA HARANE Listing 2022-2023
Email not found WALID Listing 2022-2023
Email not found LUBELINE Listing 2022-2023
Email not found DAVID Listing 2022-2023
Email not found YASSIN Listing 2022-2023
Email not found EVODIE Listing 2022-2023
Email not found AXEL  Listing 2022-2023
Email not found BENJAMIN Listing 2022-2023
Email not found MAZEN Listing 2022-2023
Email not found MOHAMED Listing 2022-2023
Email not found SAINT-CLAIRE, ORPHÉE Listing 2022-2023
Email not found MOHAMED REDA Listing 2022-2023
Email not found AHMED Listing 2022-2023
Email not found YAHYA Listing 2022-2023
Email not found SARAH Listing 2022-2023
Email not found HERVY LAURENCE Listing 2022-2023
Email not found AMINA Listing 2022-2023
Email not found MATTEO Listing 2022-2023
Email not found MOHAMED WISSEM Listing 2022-2023
Email not found HENOC ROCK MAHOUCLO Listing 2022-2023
Email not found PERNELLE ORANE CRESCENCE Listing 2022-2023
Email not found ANNICK-OCEANE Listing 2022-2023
Email not found GAEL Listing 2022-2023
Email not found OMAR Listing 2022-2023
Email not found GUEMIRATOU Listing 2022-2023
Email not found EL MAHDI Listing 2022-2023
Email not found MOHAMED Listing 2022-2023
Email not found DOLINA Listing 2022-2023
Email not found ALEX GLOIRE Listing 2022-2023
Email not found MANEL Listing 2022-2023
Email not found MOHAMED MOINDZE Listing 2022-2023
Email not found PENGDWENDE, PELAGIE, OLIVIA Listing 2022-2023
Email not found YOUSSOUF Listing 2022-2023
Email not found YOUSSOUF Listing 2022-2023
Email not found HASSAN Listing 2022-2023
Email not found - Listing 2022-2023
Email not found STEPHANIE Listing 2022-2023
Email not found CHRISTOPHER Listing 2022-2023
Email not found ILYASS Listing 2022-2023
Email not found YATTA Listing 2022-2023
Email not found CELESTIN MICHEL Listing 2022-2023
Email not found SARRA Listing 2022-2023
Email not found KARL EVAN Listing 2022-2023
Email not found BILLAL Listing 2022-2023
Email not found FARID Listing 2022-2023
Email not found SANA Listing 2022-2023
Email not found MERIEM Listing 2022-2023
Email not found CLAUDE JAVIS Listing 2022-2023
Email not found LOTH LOUIS Listing 2022-2023
Email not found OUMAIMA Listing 2022-2023
Email not found OUMAR Listing 2022-2023
Email not found JUDITH Listing 2022-2023
Email not found FARIDATOU Listing 2022-2023
Email not found KENETH, URIEL, NESTOR Listing 2022-2023
Email not found YAHYA Listing 2022-2023
Email not found DREAD POL Listing 2022-2023
Email not found WENDINMI, FRANCINE, ELODIE Listing 2022-2023
Email not found SAFAA Listing 2022-2023
Email not found BERNICE Listing 2022-2023
Email not found SANTIANA Listing 2022-2023
Email not found CHEIKH, AHMADOU, KHADIM Listing 2022-2023
Email not found DANNAN, BARTHEL Listing 2022-2023
Email not found MELINA Listing 2022-2023
*/