// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  origin: "https://t.dev.estya.com/soc/",
  key: "6abdfb04243e096a4a51b46c8f3d4b32",
  clientId:"c2fdb74f-1c56-4ebb-872b-0e0279e91612",
   User: null,

  fr: {
    firstDayOfWeek: 0,
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    today: 'Aujourdhui',
    clear: 'Clear',
    dateFormat: 'dd-mm-yy',
    weekHeader: 'sem'
  },

  role: [
    { id: 1, value: 'Agent', valeur: 'Role_agent' },
    { id: 2, value: 'Responsable', valeur: 'Role_responsable' }
  ],

  typeUser: [{
    value: "Etudiant",
  }, {
    value: "Salarié"
  }, {
    value: "Alternant/Stagiaire"
  }],

  campus:[
    {value:"Paris"},
    {value:"Montpellier"},
    {value:"Dubai"},
    {value:"Montréal"},
    {value:"Londres"},
    {value:"Tunis"},
    {value:"En Ligne(365)"}
  ],

  formations:[
    {value:"BTS MCO"},
    {value:"BTS NDR"},
    {value:"RNCP MUM"},
    {value:"RNCP NTC"},
    {value:"RNCP MERCD"},
    {value:"RNCP CMD"},
    {value:"RNCP MCI"},
    {value:"RNCP MCI CI"},
    {value:"RNCP MCI IA"},
    {value:"BTS SIO"},
    {value:"BTS WEB"},
    {value:"RNCP Réseaux"},
    {value:"RNCP Développeur"},
    {value:"RNCP AIS"},
    {value:"MPI Big Data"},
    {value:"MPI CyberSecurité"},
    {value:"RNCP ARH"},
    {value:"BTS Assurance"},
    {value:"BTS Banque"},
    {value:"BTS CG"},
    {value:"RNCP GCF"},
    {value:"BTS PME"},
    {value:"BTS Notariat"},
    {value:"DCG"},
    {value:"DCGS"},
    {value:"RNCP MRH"},
    {value:"RNCP BIM"},
    {value:"BTS MEC"},
    {value:"Bachelor BIM"},
    {value:"BTS Hôtellerie-Restauration"},
    {value:"BTS SPSSS"},
    {value:"RNCP RET"},
  ],

  entreprisesList:[
    {value:"Elitelabs"},
    {value:"ESTYA"},
    {value:"ADG"},
    {value:"Autre"}
  ],




  civilite: [
    { id: 1, value: 'Monsieur', viewValue: 'Mr' },
    { id: 2, value: 'Madame', viewValue: 'Mme' },
  ],

  profil: [
    { id: 1, value: 'Salarié', viewValue: 'Salarié' },
    { id: 2, value: 'Apprenti', viewValue: 'Apprenti' },
    { id: 3, value: 'Demandeur d\'emploi', viewValue: 'Demandeur d\'emploi' },
    { id: 4, value: 'Paticulier', viewValue: 'Paticulier' },
    { id: 5, value: 'Autre', viewValue: 'Autre' },
    { id: 6, value: 'Contrat de professionnalisation', viewValue: 'Contrat de professionnalisation' },
    { id: 7, value: 'Contrat d\'apprentissage', viewValue: 'Contrat d\'apprentissage' },
  ],

  statut: [
    { value: 'En cours de traitement', viewValue: 'En cours de traitement' },
    { value: 'En attente d\'une réponse', viewValue: 'En attente d\'une réponse' },
    { value: 'Traité', viewValue: 'Traité' },
  ],

  sujetTicketing: [
    { value: "Attestation d'emploi et Certificat de travail", viewValue: "Attestation d'emploi et Certificat de travail" },
    { value: "Déclarer un arrêt de travail", viewValue: 'Déclarer un arrêt de travail' },
    { value: "Renouvellement de contrat", viewValue: "Renouvellement de contrat" },
    { value: "Demander ses BDS", viewValue: "Demander ses BDS" },
    { value: "Démission", viewValue: "Démission" },
    { value: "Domiciliation de salaire", viewValue: "Domiciliation de salaire" },
    { value: "Attestation de salaire", viewValue: "Attestation de salaire" },
    { value: "Avenant de contrat", viewValue: "Avenant de contrat" },
    { value: "Ticket resto", viewValue: "Ticket resto" },
    { value: "Avenant de contrat", viewValue: "Avenant de contrat" },
    { value: "Prévoyance et mutuelle", viewValue: "Prévoyance et mutuelle" },

  ],


  nationalites: [
    { value: "Afghane", viewValue: 'Afghane' },
    { value: "Albanaise", viewValue: 'Albanaise' },
    { value: "Algerienne", viewValue: 'Algerienne' },
    { value: "Allemande", viewValue: 'Allemande' },
    { value: "Americaine", viewValue: 'Americaine' },
    { value: "Andorrane", viewValue: 'Andorrane' },
    { value: "Angolaise", viewValue: 'Angolaise' },
    { value: "Antiguaise et barbudienne", viewValue: 'Antiguaise et barbudienne' },
    { value: "Argentine", viewValue: 'Argentine' },
    { value: "Australienne", viewValue: 'Australienne' },
    { value: "Autrichienne", viewValue: 'Autrichienne' },
    { value: "Azerbaïdjanaise", viewValue: 'Azerbaïdjanaise' },
    { value: "Bahamienne", viewValue: 'Bahamienne' },
    { value: "Bahreinienne", viewValue: 'Bahreinienne' },
    { value: "Bangladaise", viewValue: 'Bangladaise' },
    { value: "Barbadienne", viewValue: 'Barbadienne' },
    { value: "Belge", viewValue: 'Belge' },
    { value: "Belizienne", viewValue: 'Belizienne' },
    { value: "Beninoise", viewValue: 'Beninoise' },
    { value: "Bhoutanaise", viewValue: 'Bhoutanaise' },
    { value: "Bielorusse", viewValue: 'Bielorusse' },
    { value: "Birmane", viewValue: 'Birmane' },
    { value: "Bissau-Guinéenne", viewValue: 'Bissau-Guinéenne' },
    { value: "Bolivienne", viewValue: 'Bolivienne' },
    { value: "Bosnienne", viewValue: 'Bosnienne' },
    { value: "Botswanaise", viewValue: 'Botswanaise' },
    { value: "Britannique", viewValue: 'Britannique' },
    { value: "Bruneienne", viewValue: 'Bruneienne' },
    { value: "Bulgare", viewValue: 'Bulgare' },
    { value: "Burkinabe", viewValue: 'Burkinabe' },
    { value: "Burundaise", viewValue: 'Burundaise' },
    { value: "Cambodgienne", viewValue: 'Cambodgienne' },
    { value: "Camerounaise", viewValue: 'Camerounaise' },
    { value: "Canadienne", viewValue: 'Canadienne' },
    { value: "Cap-verdienne", viewValue: 'Cap-verdienne' },
    { value: "Centrafricaine", viewValue: 'Centrafricaine' },
    { value: "Chilienne", viewValue: 'Chilienne' },
    { value: "Chinoise", viewValue: 'Chinoise' },
    { value: "Chypriote", viewValue: 'Chypriote' },
    { value: "Colombienne", viewValue: 'Colombienne' },
    { value: "Comorienne", viewValue: 'Comorienne' },
    { value: "Congolaise", viewValue: 'Congolaise' },
    { value: "Costaricaine", viewValue: 'Costaricaine' },
    { value: "Croate", viewValue: 'Croate' },
    { value: "Cubaine", viewValue: 'Cubaine' },
    { value: "Danoise", viewValue: 'Danoise' },
    { value: "Djiboutienne", viewValue: 'Djiboutienne' },
    { value: "Dominicaine", viewValue: 'Dominicaine' },
    { value: "Dominiquaise", viewValue: 'Dominiquaise' },
    { value: "Egyptienne", viewValue: 'Egyptienne' },
    { value: "Emirienne", viewValue: 'Emirienne' },
    { value: "Equato-guineenne", viewValue: 'Equato-guineenne' },
    { value: "Equatorienne", viewValue: 'Equatorienne' },
    { value: "Erythreenne", viewValue: 'Erythreenne' },
    { value: "Espagnole", viewValue: 'Espagnole' },
    { value: "Est-timoraise", viewValue: 'Est-timoraise' },
    { value: "Estonienne", viewValue: 'Estonienne' },
    { value: "Ethiopienne", viewValue: 'Ethiopienne' },
    { value: "Fidjienne", viewValue: 'Fidjienne' },
    { value: "Finlandaise", viewValue: 'Finlandaise' },
    { value: "Française", viewValue: 'Française' },
    { value: "Gabonaise", viewValue: 'Gabonaise' },
    { value: "Gambienne", viewValue: 'Gambienne' },
    { value: "Georgienne", viewValue: 'Georgienne' },
    { value: "Ghaneenne", viewValue: 'Ghaneenne' },
    { value: "Grèce", viewValue: 'Grèce' },
    { value: "Grenadienne", viewValue: 'Grenadienne' },
    { value: "Guatemalteque", viewValue: 'Guatemalteque' },
    { value: "Guineenne", viewValue: 'Guineenne' },
    { value: "Guyanienne", viewValue: 'Guyanienne' },
    { value: "Grecque", viewValue: 'Grecque' },
    { value: "Haïtienne", viewValue: 'Haïtienne' },
    { value: "Hellenique", viewValue: 'Hellenique' },
    { value: "Hondurienne", viewValue: 'Hondurienne' },
    { value: "Hongroise", viewValue: 'Hongroise' },
    { value: "Hongrie", viewValue: 'Hongrie' },
    { value: "Indienne", viewValue: 'Indienne' },
    { value: "Indonesienne", viewValue: 'Indonesienne' },
    { value: "Irakienne", viewValue: 'Irakienne' },
    { value: "Irlandaise", viewValue: 'Irlandaise' },
    { value: "Islandaise", viewValue: 'Islandaise' },
    { value: "Italienne", viewValue: 'Italienne' },
    { value: "Ivoirienne", viewValue: 'Ivoirienne' },
    { value: "Jamaïcaine", viewValue: 'Jamaïcaine' },
    { value: "Japonaise", viewValue: 'Japonaise' },
    { value: "Jordanienne", viewValue: 'Jordanienne' },
    { value: "Kazakhstanaise", viewValue: 'Kazakhstanaise' },
    { value: "Kenyane", viewValue: 'Kenyane' },
    { value: "Kirghize", viewValue: 'Kirghize' },
    { value: "Kiribatienne", viewValue: 'Kiribatienne' },
    { value: "Kittitienne-et-nevicienne", viewValue: 'Kittitienne-et-nevicienne' },
    { value: "Kossovienne", viewValue: 'Kossovienne' },
    { value: "Koweitienne", viewValue: 'Koweitienne' },
    { value: "Laotienne", viewValue: 'Laotienne' },
    { value: "Lesothane", viewValue: 'Lesothane' },
    { value: "Lettone", viewValue: 'Lettone' },
    { value: "Libanaise", viewValue: 'Libanaise' },
    { value: "Liberienne", viewValue: 'Liberienne' },
    { value: "Libyenne", viewValue: 'Libyenne' },
    { value: "Liechtensteinoise", viewValue: 'Liechtensteinoise' },
    { value: "Lituanienne", viewValue: 'Lituanienne' },
    { value: "Luxembourgeoise", viewValue: 'Luxembourgeoise' },
    { value: "Macedonienne", viewValue: 'Macedonienne' },
    { value: "Malaisienne", viewValue: 'Malaisienne' },
    { value: "Malawienne", viewValue: 'Malawienne' },
    { value: "Maldivienne", viewValue: 'Maldivienne' },
    { value: "Malgache", viewValue: 'Malgache' },
    { value: "Malienne", viewValue: 'Malienne' },
    { value: "Maltaise", viewValue: 'Maltaise' },
    { value: "Marocaine", viewValue: 'Marocaine' },
    { value: "Marshallaise", viewValue: 'Marshallaise' },
    { value: "Mauricienne", viewValue: 'Mauricienne' },
    { value: "Mauritanienne", viewValue: 'Mauritanienne' },
    { value: "Mexicaine", viewValue: 'Mexicaine' },
    { value: "Micronesienne", viewValue: 'Micronesienne' },
    { value: "Moldave", viewValue: 'Moldave' },
    { value: "Monegasque", viewValue: 'Monegasque' },
    { value: "Mongole", viewValue: 'Mongole' },
    { value: "Montenegrine", viewValue: 'Montenegrine' },
    { value: "Mozambicaine", viewValue: 'Mozambicaine' },
    { value: "Namibienne", viewValue: 'Namibienne' },
    { value: "Nauruane", viewValue: 'Nauruane' },
    { value: "Néerlandaise", viewValue: 'Neerlandaise' },
    { value: "Neo-zelandaise", viewValue: 'Neo-zelandaise' },
    { value: "Nepalaise", viewValue: 'Nepalaise' },
    { value: "Nicaraguayenne", viewValue: 'Nicaraguayenne' },
    { value: "Nigeriane", viewValue: 'Nigeriane' },
    { value: "Nigerienne", viewValue: 'Nigerienne' },
    { value: "Nord-coréenne", viewValue: 'Nord-coréenne' },
    { value: "Norvegienne", viewValue: 'Norvegienne' },
    { value: "Omanaise", viewValue: 'Omanaise' },
    { value: "Ougandaise", viewValue: 'Ougandaise' },
    { value: "Ouzbeke", viewValue: 'Ouzbeke' },
    { value: "Pakistanaise", viewValue: 'Pakistanaise' },
    { value: "Palau", viewValue: 'Palau' },
    { value: "Palestinienne", viewValue: 'Palestinienne' },
    { value: "Panameenne", viewValue: 'Panameenne' },
    { value: "Papouane-neoguineenne", viewValue: 'Papouane-neoguineenne' },
    { value: "Paraguayenne", viewValue: 'Paraguayenne' },
    { value: "Peruvienne", viewValue: 'Peruvienne' },
    { value: "Philippine", viewValue: 'Philippine' },
    { value: "Polonaise", viewValue: 'Polonaise' },
    { value: "Portoricaine", viewValue: 'Portoricaine' },
    { value: "Portugaise", viewValue: 'Portugaise' },
    { value: "Qatarienne", viewValue: 'Qatarienne' },
    { value: "Roumaine", viewValue: 'Roumaine' },
    { value: "Russe", viewValue: 'Russe' },
    { value: "Rwandaise", viewValue: 'Rwandaise' },
    { value: "Saint-lucienne", viewValue: 'Saint-lucienne' },
    { value: "Saint-marinaise", viewValue: 'Saint-marinaise' },
    { value: "Saint-vincentaise-et-grenadine", viewValue: 'Saint-vincentaise-et-grenadine' },
    { value: "Salomonaise", viewValue: 'Salomonaise' },
    { value: "Salvadorienne", viewValue: 'Salvadorienne' },
    { value: "Samoane", viewValue: 'Samoane' },
    { value: "Santomeenne", viewValue: 'Santomeenne' },
    { value: "Saoudienne", viewValue: 'Saoudienne' },
    { value: "Senegalaise", viewValue: 'Senegalaise' },
    { value: "Serbe", viewValue: 'Serbe' },
    { value: "Seychelloise", viewValue: 'Seychelloise' },
    { value: "Sierra-leonaise", viewValue: 'Sierra-leonaise' },
    { value: "Singapourienne", viewValue: 'Singapourienne' },
    { value: "Slovaque", viewValue: 'Slovaque' },
    { value: "Slovene", viewValue: 'Slovene' },
    { value: "Somalienne", viewValue: 'Somalienne' },
    { value: "Soudanaise", viewValue: 'Soudanaise' },
    { value: "Sri-lankaise", viewValue: 'Sri-lankaise' },
    { value: "Sud-africaine", viewValue: 'Sud-africaine' },
    { value: "Sud-coréenne", viewValue: 'Sud-coréenne' },
    { value: "Suedoise", viewValue: 'Suedoise' },
    { value: "Suisse", viewValue: 'Suisse' },
    { value: "Surinamaise", viewValue: 'Surinamaise' },
    { value: "Swazie", viewValue: 'Swazie' },
    { value: "Syrienne", viewValue: 'Syrienne' },
    { value: "Tadjike", viewValue: 'Tadjike' },
    { value: "Taiwanaise", viewValue: 'Taiwanaise' },
    { value: "Tanzanienne", viewValue: 'Tanzanienne' },
    { value: "Tchadienne", viewValue: 'Tchadienne' },
    { value: "Tcheque", viewValue: 'Tcheque' },
    { value: "Thaïlandaise", viewValue: 'Thaïlandaise' },
    { value: "Togolaise", viewValue: 'Togolaise' },
    { value: "Tonguienne", viewValue: 'Tonguienne' },
    { value: "Trinidadienne", viewValue: 'Trinidadienne' },
    { value: "Tunisienne", viewValue: 'Tunisienne' },
    { value: "Turkmene", viewValue: 'Turkmene' },
    { value: "Turque", viewValue: 'Turque' },
    { value: "Tuvaluane", viewValue: 'Tuvaluane' },
    { value: "Ukrainienne", viewValue: 'Ukrainienne' },
    { value: "Uruguayenne", viewValue: 'Uruguayenne' },
    { value: "Vanuatuane", viewValue: 'Vanuatuane' },
    { value: "Venezuelienne", viewValue: 'Venezuelienne' },
    { value: "Vietnamienne", viewValue: 'Vietnamienne' },
    { value: "Yemenite", viewValue: 'Yemenite' },
    { value: "Zambienne", viewValue: 'Zambienne' },
    { value: "Zimbabweenne", viewValue: 'Zimbabweenne' },

  ],

  nationalites_UE: [
    { value: "Allemande", viewValue: 'Allemande' },
    { value: "Autrichienne", viewValue: 'Autrichienne' },
    { value: "Belge", viewValue: 'Belge' },
    { value: "Danoise", viewValue: 'Danoise' },
    { value: "Espagnole", viewValue: 'Espagnole' },
    { value: "Estonienne", viewValue: 'Estonienne' },
    { value: "Finlandaise", viewValue: 'Finlandaise' },
    { value: "Française", viewValue: 'Française' },
    { value: "Grèce", viewValue: 'Grèce' },
    { value: "Hongrie", viewValue: 'Hongrie' },
    { value: "Islandaise", viewValue: 'Islandaise' },
    { value: "Italienne", viewValue: 'Italienne' },
    { value: "Liechtensteinoise", viewValue: 'Liechtensteinoise' },
    { value: "Lituanienne", viewValue: 'Lituanienne' },
    { value: "Lettone", viewValue: 'Lettone' },
    { value: "Luxembourgeoise", viewValue: 'Luxembourgeoise' },
    { value: "Maltaise", viewValue: 'Maltaise' },
    { value: "Norvegienne", viewValue: 'Norvegienne' },
    { value: "Néerlandaise", viewValue: 'Néerlandaise' },
    { value: "Polonaise", viewValue: 'Polonaise' },
    { value: "Portugaise", viewValue: 'Portugaise' },
    { value: "Slovaque", viewValue: 'Slovaque' },
    { value: "Slovene", viewValue: 'Slovene' },
    { value: "Suedoise", viewValue: 'Suedoise' },
    { value: "Suisse", viewValue: 'Suisse' },
    { value: "Tcheque", viewValue: 'Tcheque' },
  ],

  nationalitesEDU: [
    { value: "Afghane", viewValue: 'Afghane' },
    { value: "Albanaise", viewValue: 'Albanaise' },
    { value: "Algerienne", viewValue: 'Algerienne' },
    { value: "Americaine", viewValue: 'Americaine' },
    { value: "Andorrane", viewValue: 'Andorrane' },
    { value: "Angolaise", viewValue: 'Angolaise' },
    { value: "Antiguaise et barbudienne", viewValue: 'Antiguaise et barbudienne' },
    { value: "Argentine", viewValue: 'Argentine' },
    { value: "Australienne", viewValue: 'Australienne' },
    { value: "Azerbaïdjanaise", viewValue: 'Azerbaïdjanaise' },
    { value: "Bahamienne", viewValue: 'Bahamienne' },
    { value: "Bahreinienne", viewValue: 'Bahreinienne' },
    { value: "Bangladaise", viewValue: 'Bangladaise' },
    { value: "Barbadienne", viewValue: 'Barbadienne' },
    { value: "Belizienne", viewValue: 'Belizienne' },
    { value: "Beninoise", viewValue: 'Beninoise' },
    { value: "Bhoutanaise", viewValue: 'Bhoutanaise' },
    { value: "Bielorusse", viewValue: 'Bielorusse' },
    { value: "Birmane", viewValue: 'Birmane' },
    { value: "Bissau-Guinéenne", viewValue: 'Bissau-Guinéenne' },
    { value: "Bolivienne", viewValue: 'Bolivienne' },
    { value: "Bosnienne", viewValue: 'Bosnienne' },
    { value: "Botswanaise", viewValue: 'Botswanaise' },
    { value: "Britannique", viewValue: 'Britannique' },
    { value: "Bruneienne", viewValue: 'Bruneienne' },
    { value: "Bulgare", viewValue: 'Bulgare' },
    { value: "Burkinabe", viewValue: 'Burkinabe' },
    { value: "Burundaise", viewValue: 'Burundaise' },
    { value: "Cambodgienne", viewValue: 'Cambodgienne' },
    { value: "Camerounaise", viewValue: 'Camerounaise' },
    { value: "Canadienne", viewValue: 'Canadienne' },
    { value: "Cap-verdienne", viewValue: 'Cap-verdienne' },
    { value: "Centrafricaine", viewValue: 'Centrafricaine' },
    { value: "Chilienne", viewValue: 'Chilienne' },
    { value: "Chinoise", viewValue: 'Chinoise' },
    { value: "Chypriote", viewValue: 'Chypriote' },
    { value: "Colombienne", viewValue: 'Colombienne' },
    { value: "Comorienne", viewValue: 'Comorienne' },
    { value: "Congolaise", viewValue: 'Congolaise' },
    { value: "Costaricaine", viewValue: 'Costaricaine' },
    { value: "Croate", viewValue: 'Croate' },
    { value: "Cubaine", viewValue: 'Cubaine' },
    { value: "Djiboutienne", viewValue: 'Djiboutienne' },
    { value: "Dominicaine", viewValue: 'Dominicaine' },
    { value: "Dominiquaise", viewValue: 'Dominiquaise' },
    { value: "Egyptienne", viewValue: 'Egyptienne' },
    { value: "Emirienne", viewValue: 'Emirienne' },
    { value: "Equato-guineenne", viewValue: 'Equato-guineenne' },
    { value: "Equatorienne", viewValue: 'Equatorienne' },
    { value: "Erythreenne", viewValue: 'Erythreenne' },
    { value: "Est-timoraise", viewValue: 'Est-timoraise' },
    { value: "Ethiopienne", viewValue: 'Ethiopienne' },
    { value: "Fidjienne", viewValue: 'Fidjienne' },
    { value: "Gabonaise", viewValue: 'Gabonaise' },
    { value: "Gambienne", viewValue: 'Gambienne' },
    { value: "Georgienne", viewValue: 'Georgienne' },
    { value: "Ghaneenne", viewValue: 'Ghaneenne' },
    { value: "Grenadienne", viewValue: 'Grenadienne' },
    { value: "Guatemalteque", viewValue: 'Guatemalteque' },
    { value: "Guineenne", viewValue: 'Guineenne' },
    { value: "Guyanienne", viewValue: 'Guyanienne' },
    { value: "Grecque", viewValue: 'Grecque' },
    { value: "Haïtienne", viewValue: 'Haïtienne' },
    { value: "Hellenique", viewValue: 'Hellenique' },
    { value: "Hondurienne", viewValue: 'Hondurienne' },
    { value: "Hongroise", viewValue: 'Hongroise' },
    { value: "Indienne", viewValue: 'Indienne' },
    { value: "Indonesienne", viewValue: 'Indonesienne' },
    { value: "Irakienne", viewValue: 'Irakienne' },
    { value: "Irlandaise", viewValue: 'Irlandaise' },
    { value: "Ivoirienne", viewValue: 'Ivoirienne' },
    { value: "Jamaïcaine", viewValue: 'Jamaïcaine' },
    { value: "Japonaise", viewValue: 'Japonaise' },
    { value: "Jordanienne", viewValue: 'Jordanienne' },
    { value: "Kazakhstanaise", viewValue: 'Kazakhstanaise' },
    { value: "Kenyane", viewValue: 'Kenyane' },
    { value: "Kirghize", viewValue: 'Kirghize' },
    { value: "Kiribatienne", viewValue: 'Kiribatienne' },
    { value: "Kittitienne-et-nevicienne", viewValue: 'Kittitienne-et-nevicienne' },
    { value: "Kossovienne", viewValue: 'Kossovienne' },
    { value: "Koweitienne", viewValue: 'Koweitienne' },
    { value: "Laotienne", viewValue: 'Laotienne' },
    { value: "Lesothane", viewValue: 'Lesothane' },
    { value: "Libanaise", viewValue: 'Libanaise' },
    { value: "Liberienne", viewValue: 'Liberienne' },
    { value: "Libyenne", viewValue: 'Libyenne' },
    { value: "Macedonienne", viewValue: 'Macedonienne' },
    { value: "Malaisienne", viewValue: 'Malaisienne' },
    { value: "Malawienne", viewValue: 'Malawienne' },
    { value: "Maldivienne", viewValue: 'Maldivienne' },
    { value: "Malgache", viewValue: 'Malgache' },
    { value: "Malienne", viewValue: 'Malienne' },
    { value: "Marocaine", viewValue: 'Marocaine' },
    { value: "Marshallaise", viewValue: 'Marshallaise' },
    { value: "Mauricienne", viewValue: 'Mauricienne' },
    { value: "Mauritanienne", viewValue: 'Mauritanienne' },
    { value: "Mexicaine", viewValue: 'Mexicaine' },
    { value: "Micronesienne", viewValue: 'Micronesienne' },
    { value: "Moldave", viewValue: 'Moldave' },
    { value: "Monegasque", viewValue: 'Monegasque' },
    { value: "Mongole", viewValue: 'Mongole' },
    { value: "Montenegrine", viewValue: 'Montenegrine' },
    { value: "Mozambicaine", viewValue: 'Mozambicaine' },
    { value: "Namibienne", viewValue: 'Namibienne' },
    { value: "Nauruane", viewValue: 'Nauruane' },
    { value: "Neo-zelandaise", viewValue: 'Neo-zelandaise' },
    { value: "Nepalaise", viewValue: 'Nepalaise' },
    { value: "Nicaraguayenne", viewValue: 'Nicaraguayenne' },
    { value: "Nigeriane", viewValue: 'Nigeriane' },
    { value: "Nigerienne", viewValue: 'Nigerienne' },
    { value: "Nord-coréenne", viewValue: 'Nord-coréenne' },
    { value: "Omanaise", viewValue: 'Omanaise' },
    { value: "Ougandaise", viewValue: 'Ougandaise' },
    { value: "Ouzbeke", viewValue: 'Ouzbeke' },
    { value: "Pakistanaise", viewValue: 'Pakistanaise' },
    { value: "Palau", viewValue: 'Palau' },
    { value: "Palestinienne", viewValue: 'Palestinienne' },
    { value: "Panameenne", viewValue: 'Panameenne' },
    { value: "Papouane-neoguineenne", viewValue: 'Papouane-neoguineenne' },
    { value: "Paraguayenne", viewValue: 'Paraguayenne' },
    { value: "Peruvienne", viewValue: 'Peruvienne' },
    { value: "Philippine", viewValue: 'Philippine' },
    { value: "Portoricaine", viewValue: 'Portoricaine' },
    { value: "Qatarienne", viewValue: 'Qatarienne' },
    { value: "Roumaine", viewValue: 'Roumaine' },
    { value: "Russe", viewValue: 'Russe' },
    { value: "Rwandaise", viewValue: 'Rwandaise' },
    { value: "Saint-lucienne", viewValue: 'Saint-lucienne' },
    { value: "Saint-marinaise", viewValue: 'Saint-marinaise' },
    { value: "Saint-vincentaise-et-grenadine", viewValue: 'Saint-vincentaise-et-grenadine' },
    { value: "Salomonaise", viewValue: 'Salomonaise' },
    { value: "Salvadorienne", viewValue: 'Salvadorienne' },
    { value: "Samoane", viewValue: 'Samoane' },
    { value: "Santomeenne", viewValue: 'Santomeenne' },
    { value: "Saoudienne", viewValue: 'Saoudienne' },
    { value: "Senegalaise", viewValue: 'Senegalaise' },
    { value: "Serbe", viewValue: 'Serbe' },
    { value: "Seychelloise", viewValue: 'Seychelloise' },
    { value: "Sierra-leonaise", viewValue: 'Sierra-leonaise' },
    { value: "Singapourienne", viewValue: 'Singapourienne' },
    { value: "Somalienne", viewValue: 'Somalienne' },
    { value: "Soudanaise", viewValue: 'Soudanaise' },
    { value: "Sri-lankaise", viewValue: 'Sri-lankaise' },
    { value: "Sud-africaine", viewValue: 'Sud-africaine' },
    { value: "Sud-coréenne", viewValue: 'Sud-coréenne' },
    { value: "Surinamaise", viewValue: 'Surinamaise' },
    { value: "Swazie", viewValue: 'Swazie' },
    { value: "Syrienne", viewValue: 'Syrienne' },
    { value: "Tadjike", viewValue: 'Tadjike' },
    { value: "Taiwanaise", viewValue: 'Taiwanaise' },
    { value: "Tanzanienne", viewValue: 'Tanzanienne' },
    { value: "Tchadienne", viewValue: 'Tchadienne' },
    { value: "Thaïlandaise", viewValue: 'Thaïlandaise' },
    { value: "Togolaise", viewValue: 'Togolaise' },
    { value: "Tonguienne", viewValue: 'Tonguienne' },
    { value: "Trinidadienne", viewValue: 'Trinidadienne' },
    { value: "Tunisienne", viewValue: 'Tunisienne' },
    { value: "Turkmene", viewValue: 'Turkmene' },
    { value: "Turque", viewValue: 'Turque' },
    { value: "Tuvaluane", viewValue: 'Tuvaluane' },
    { value: "Ukrainienne", viewValue: 'Ukrainienne' },
    { value: "Uruguayenne", viewValue: 'Uruguayenne' },
    { value: "Vanuatuane", viewValue: 'Vanuatuane' },
    { value: "Venezuelienne", viewValue: 'Venezuelienne' },
    { value: "Vietnamienne", viewValue: 'Vietnamienne' },
    { value: "Yemenite", viewValue: 'Yemenite' },
    { value: "Zambienne", viewValue: 'Zambienne' },
    { value: "Zimbabweenne", viewValue: 'Zimbabweenne' },

  ],
  entreprises: [
    { value: "ESTYA Education", viewValue: 'ESTYA Education' },
    { value: "ESTYA Training", viewValue: 'ESTYA Training' },
    { value: "Académie des gouvernantes", viewValue: 'Académie des gouvernantes' },

  ],
  status: [
    { label: "À traiter", value: 'À traiter' },
    { label: "En cours de traitement", value: 'En cours de traitement' },
    { label: "En attente de retour", value: 'En attente de retour' },
    { label: "Clôturé", value: 'Clôturé' }
  ],

  etat_annee: [
    { label: "Nouvelle", value: 'Nouvelle' },
    { label: "Active", value: 'Active' },
    { label: "Archivée", value: 'Archivée' },
  ],
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
