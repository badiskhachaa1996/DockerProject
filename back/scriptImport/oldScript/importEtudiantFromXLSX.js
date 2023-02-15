var XLSX = require('xlsx')
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Etudiant } = require('../models/etudiant')
var workbook = XLSX.readFile('dataEtu.xlsx', { cellDates: true });
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
        User.find().then(data => {
            users = data
            let EmailList = []
            /*data.forEach(us => {
                EmailList.push(us?.email)
            })*/
            sheet_name_list.forEach(sheet => {
                let trueSheetName = sheet
                if (!sheet.includes('-2022') && sheet != 'Dashboard') {
                    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                    sheet = sheet.replace('promo ', '')
                    sheet = sheet.replace('Promo ', '')
                    if (sheet.indexOf(' - ') != -1)
                        sheet = sheet.substring(sheet.indexOf('- ') + 2)
                    sheet = sheet.substring(0, sheet.indexOf(' 20'))
                    if (sheet.lastIndexOf('1') == sheet.length - 1)
                        sheet = sheet.replace(' 1', '')
                    xlData.forEach(data => {
                        if (data['Vérification admission'] != "démission" && data['Vérification admission'] != "demission") {
                            let dn = data['Date de naissance ']
                            let di = data["Date d'inscription"]
                            if (typeof (dn) == typeof ('str')) {
                                dn.replace(' ', '')
                                dn = new Date(convertDate(dn))
                            }
                            if (typeof (di) == typeof ('str')) {
                                if (di.indexOf('-') != -1) {
                                    di = di.substring(0, di.indexOf('-') - 1)
                                    di.replace(' ', '')
                                    di = new Date(convertDate(di))
                                }
                                di = new Date(di)
                                if (di == "Invalid Date")
                                    di = null
                            }

                            if (data['Mail école'] && data['Prénom']) {
                                let mail = data['Mail école']
                                // s.aitsaid@estya.com 1A 1B d.kimbassa@estya.com 1B 1C i.massengo@estya.com 1C 1B f.mfourga@estya.com 1B 1C d.massivi@estya.com
                                if (EmailList.includes(mail)) {
                                    console.log(data, sheet, "existe déjà")
                                } else {
                                    EmailList.push(mail)
                                    let adresse = giveAddress(data['Adresse étudiant'])
                                    let u = new User({
                                        firstname: toCamelCase(data['Prénom']),
                                        lastname: data['Nom'].toUpperCase(),
                                        phone: data['Numéro de téléphone '],
                                        email: data['Mail école'],
                                        email_perso: data['Mail personnel'],
                                        civilite: getCivilite(data['Sexe']),
                                        type: "Initial",
                                        pays_adresse: "France",
                                        ville_adresse: adresse['Ville'],
                                        rue_adresse: adresse['Rue'],
                                        numero_adresse: adresse['Numero'],
                                        postal_adresse: adresse['Postal'],
                                        nationnalite: data['Nationalité '],
                                        verifedEmail: true,
                                        date_creation: di
                                    })
                                    u.save((err, newUser) => {
                                        users.push(newUser)
                                        let code = ""
                                        if (dn && data['Nationalité ']) {
                                            code = generateCode(u, dn)
                                        } else {
                                            newUser.nationnalite = "Inconnu"
                                            code = generateCode(newUser,new Date())
                                            console.error("BAD CODE:", data['Nom'], dn, data['Nationalité '])
                                        }
                                        if (!err) {
                                            let etu = new Etudiant({
                                                user_id: newUser._id,
                                                classe_id: null,
                                                statut: giveStatut(data['Statut (Init/Alt) ']),
                                                nationalite: data['Nationalité '],
                                                date_naissance: dn,
                                                custom_id: code,
                                                dernier_diplome: sheet,
                                                isAlternant: giveStatut(data['Statut (Init/Alt) ']) == "Alternant",
                                                diplome: sheet,
                                                remarque: getRemarque(data, trueSheetName)
                                            })
                                            etu.save((errEtu, newEtu) => {
                                                if (errEtu) {
                                                    console.error(errEtu)
                                                } else {
                                                    console.log(etu?.custom_id)
                                                }
                                            })
                                        } else {
                                            console.error(err, u)
                                        }
                                    })

                                }
                            } else {
                                if (data['Prénom']) {
                                    console.error("Email not found", data, sheet)
                                } else {
                                    console.error("Prenom not found", data)
                                }

                            }

                        }
                    })
                }

            })
            console.log("FINISH")
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
    let str = "Sheet: " + sheet + "\n"
    if (data['Ville de naissance'])
        str = str + "Ville de naissance: " + data['Ville de naissance'] + "\n"
    if (data['Pays de naissance'])
        str = str + "Pays de naissance: " + data['Pays de naissance'] + "\n"
    if (data['Carte étudiant'])
        str = str + "Carte étudiant: " + data['Carte étudiant'] + "\n"
    if (data['Linkedln Learning'])
        str = str + "Linkedln Learning: " + data['Linkedln Learning'] + "\n"
    if (data['Campus!'])
        str = str + "Campus: " + data['Campus!'] + "\n"
    if (data['Rentrée principale/décalé'])
        str = str + "Rentrée principale/décalé: " + data['Rentrée principale/décalé'] + "\n"
    if (data['Adresse étudiant'])
        str = str + "Adresse: " + data['Adresse étudiant'] + "\n"
    return str
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
function getCivilite(str) {
    if (str) {
        str = str.replace(' ', '')
    }
    if (str == "M" || str == "H") {
        return "Monsieur"
    } else if (str == "F") {
        return "Madame"
    } else {
        return "Autre"
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