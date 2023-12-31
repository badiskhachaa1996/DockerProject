const mongoose = require("mongoose");
const { User } = require('../models/user')
const { Etudiant } = require('../models/etudiant')
mongoose
    .connect(`mongodb://localhost:27017/learningNode`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("L'api s'est connecté à MongoDB.");
        Etudiant.find().populate('user_id').then(listEtudiant => {
            listEtudiant.forEach(function (etudiant, index) {
                if (etudiant.user_id) {
                    if (!etudiant.user_id.nationnalite)
                        etudiant.user_id.nationnalite = "Inconnu"
                    if (!etudiant.date_naissance)
                        etudiant.date_naissance = new Date()
                    let custom_id = generateCode(etudiant.user_id, etudiant.date_naissance, (index + 1).toString())
                    Etudiant.findByIdAndUpdate(etudiant._id, { custom_id }, { new: true }, (err, data) => {
                        console.log(data.custom_id)
                    })
                }
            })
        })
    })
    .catch(err => {
        console.error("L'api n'a pas reussi à se connecter à MongoDB :(", err);
    });
function generateCode(user, dn, nb) {
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
    nb = nb.substring(nb.length - 3)
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase().replace('É','E')
    return r


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