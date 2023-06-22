import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { map } from 'rxjs';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { Notification } from 'src/app/models/notification';
import { Partenaire } from 'src/app/models/Partenaire';
import { Prospect } from 'src/app/models/Prospect';
import { RentreeAdmission } from 'src/app/models/RentreeAdmission';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { ServService } from 'src/app/services/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formulaire-admission-international',
  templateUrl: './formulaire-admission-international.component.html',
  styleUrls: ['./formulaire-admission-international.component.scss']
})
export class FormulaireAdmissionInternationalComponent implements OnInit {
  emailExist: boolean;

  constructor(private route: ActivatedRoute, private servService: ServService, private diplomeService: DiplomeService, private campusService: CampusService, private router: Router,
    private formBuilder: FormBuilder, private AuthService: AuthService, private messageService: MessageService, private admissionService: AdmissionService,
    private NotifService: NotificationService, private PartenaireService: PartenaireService, private FAService: FormulaireAdmissionService) { }

  routeItems: MenuItem[] = [
    { label: 'Infos' },
    { label: 'Parcours' },
    { label: 'Programme' },
    { label: 'Partenaires' },
    { label: 'Dernière étape' },
  ];;
  langueList = [
    { label: 'Français', value: 'Français', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg' },
    { label: 'English', value: 'English', src: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg' },
  ]
  nationList = environment.nationalites;
  paysList = environment.pays;
  civiliteList = environment.civilite;
  calendar: any;
  fr = environment.fr;
  ActiveIndex = 0;
  RegisterForm: FormGroup;

  diplomes = [];
  diplomesOfCampus = [];
  userConnected: User;
  maxYear = new Date().getFullYear() - 13
  minYear = new Date().getFullYear() - 80
  rangeYear = this.minYear + ":" + this.maxYear
  minDateCalendar = new Date("01/01/" + this.minYear)
  maxDateCalendar = new Date("01/01/" + this.maxYear)
  btnTextBack = "Se connecter"

  formSteps: any[] = [
    "Infos",
    "Parcours",
    "Programme",
    "Partenaires",
    "Fin",
  ];

  rentreeList = [

  ]

  academicList =
    [
      { label: 'Pré-bac', value: 'Pré-bac' },
      { label: 'Bac +1', value: 'Bac +1' },
      { label: 'Bac +2', value: 'Bac +2' },
      { label: 'Bac +3', value: 'Bac +3' },
      { label: 'Bac +4', value: 'Bac +4' },
      { label: 'Bac +5', value: 'Bac +5' },
    ];

  statutList =
    [
      { label: 'Etudiant', value: 'Etudiant' },
      { label: 'Salarié', value: 'Salarié' },
      { label: 'Au chômage', value: 'Au chômage' },
      { label: 'Autre', value: 'Autre' },
    ];

  campusDropdown =
    [
      { value: "Paris - France", label: "Paris - France" },
      { value: "Montpellier - France", label: "Montpellier - France" },
      { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
      { value: "Rabat - Maroc", label: "Rabat - Maroc" },
      { value: "La Valette - Malte", label: "La Valette - Malte" },
      { value: "UAE - Dubai", label: "UAE - Dubai" },
      { value: "En ligne", label: "En ligne" },
    ];

  niveauFR =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "J’ai une attestation de niveau (TCF DALF DELF..)", value: "J’ai une attestation de niveau (TCF DALF DELF..)" },
      { label: "Aucun de ces choix", value: "Aucun de ces choix" },
    ]
  niveauEN =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "Avancé", value: "Avancé" },
      { label: "Intermédiaire", value: "Intermédiaire" },
      { label: "Basique", value: "Basique" },
      { label: "Je ne parle pas l’anglais", value: "Je ne parle pas l’anglais" },
    ]

  programList =
    [
      { value: "Programme Français" },
      { value: "Programme Anglais" },
    ];
  programeFrDropdown = []

  programEnDropdown = []
  defaultDropdown = this.programeFrDropdown

  typeFormationDropdown = [
    { value: "Initiale" },
    { value: "Alternance" }
  ];

  form_origin: string = this.route.snapshot.paramMap.get('ecole'); //eduhorizons estya adg espic studinfo

  choixCampus() {
    if (this.RegisterForm.value.campusChoix1.value == "UAE - Dubai") {
      this.programeFrDropdown = [
        { label: 'Project Management', value: 'Project Management' },
        { label: 'Information Technology', value: 'Information Technology' },
        { label: 'Business Management', value: 'Business Management' },
        { label: 'Master Manager en ressources humaine', value: 'Master Manager en ressources humaine' },
        { label: 'Master Ingénieur d\'affaire', value: 'Master Ingénieur d\'affaire' },
        { label: 'Chargé de gestion commerciale', value: 'Chargé de gestion commerciale' },
        { label: 'English Foundation Year', value: 'English Foundation Year' },
      ]
    } else
      this.programeFrDropdown = this.defaultDropdown
  }
  changeLanguage(langue) {
    this.ECOLE.langue = langue
    if (langue == "English") {
      this.typeFormationDropdown = [
        { value: "Initial" },
        { value: "Alternance" }
      ];
      this.programList =
        [
          { value: "French Program" },
          { value: "English Program" },
        ];
      this.niveauFR =
        [
          { label: "Native language", value: "Native language" },
          { label: "I have a level certificate (TCF DALF DELF..)", value: "I have a level certificate (TCF DALF DELF..)" },
          { label: "I don't speak French", value: "I don't speak French" },
          { label: "None of these choices", value: "None of these choices" },
        ]
      this.niveauEN =
        [
          { label: "Native language", value: "Native language" },
          { label: "Advanced", value: "Advanced" },
          { label: "Intermediate", value: "Intermediate" },
          { label: "Basic", value: "Basic" },
          { label: "I don't speak English", value: "I don't speak English" },
        ]

      this.academicList =
        [
          { label: 'Pre-bac', value: 'Pre-bac' },
          { label: 'Bac +1', value: 'Bac +1' },
          { label: 'Bac +2', value: 'Bac +2' },
          { label: 'Bac +3', value: 'Bac +3' },
          { label: 'Bac +4', value: 'Bac +4' },
          { label: 'Bac +5', value: 'Bac +5' },
        ];

      this.statutList =
        [
          { label: 'Student', value: 'Student' },
          { label: 'Employee', value: 'Employee' },
          { label: 'Unemployed', value: 'Unemployed' },
          { label: 'Other', value: 'Other' },
        ];
      this.formSteps = [
        "Information",
        "Background",
        "School program",
        "Partners",
        "End",
      ];

      this.nationList = environment.nationalities;
      this.paysList = environment.paysEnglish;
      this.civiliteList = environment.civiliteEN;
    }
    else {
      this.typeFormationDropdown = [
        { value: "Initiale" },
        { value: "Alternance" }
      ];
      this.programList =
        [
          { value: "Programme Français" },
          { value: "Programme Anglais" },
        ];
      this.niveauFR =
        [
          { label: "Langue maternelle", value: "Langue maternelle" },
          { label: "J’ai une attestation de niveau (TCF DALF DELF..)", value: "J’ai une attestation de niveau (TCF DALF DELF..)" },
          { label: "Aucun de ces choix", value: "Aucun de ces choix" },
        ]
      this.niveauEN =
        [
          { label: "Langue maternelle", value: "Langue maternelle" },
          { label: "Avancé", value: "Avancé" },
          { label: "Intermédiaire", value: "Intermédiaire" },
          { label: "Basique", value: "Basique" },
          { label: "Je ne parle pas l’anglais", value: "Je ne parle pas l’anglais" },
        ]

      this.academicList =
        [
          { label: 'Pré-bac', value: 'Pré-bac' },
          { label: 'Bac +1', value: 'Bac +1' },
          { label: 'Bac +2', value: 'Bac +2' },
          { label: 'Bac +3', value: 'Bac +3' },
          { label: 'Bac +4', value: 'Bac +4' },
          { label: 'Bac +5', value: 'Bac +5' },
        ];

      this.statutList =
        [
          { label: 'Etudiant', value: 'Etudiant' },
          { label: 'Salarié', value: 'Salarié' },
          { label: 'Au chômage', value: 'Au chômage' },
          { label: 'Autre', value: 'Autre' },
        ];
      this.formSteps = [
        "Infos",
        "Parcours",
        "Programme",
        "Partenaires",
        "Fin",
      ];

      this.nationList = environment.nationalites;
      this.paysList = environment.pays;
      this.civiliteList = environment.civilite;
    }
  }
  hideCC = false
  ECOLE: EcoleAdmission
  RENTREE: RentreeAdmission[]
  ngOnInit(): void {
    this.FAService.EAgetByParams(this.form_origin).subscribe(data => {
      if (!data)
        this.router.navigate(['/'])
      this.ECOLE = data
      if (!this.route.snapshot.paramMap.get('lang'))
        this.changeLanguage(data.langue)
      else if (this.route.snapshot.paramMap.get('lang') == 'fr')
        this.changeLanguage('Français')
      else if (this.route.snapshot.paramMap.get('lang') == 'en')
        this.changeLanguage('English')
      this.FAService.RAgetByEcoleID(data._id).subscribe(dataEcoles => {
        this.RENTREE = dataEcoles
        data.formations.forEach(f => {
          if (f.langue.includes('Programme Français'))
            this.programeFrDropdown.push({ label: f.nom, value: f.nom })
          if (f.langue.includes('Programme Anglais'))
            this.programEnDropdown.push({ label: f.nom, value: f.nom })
        })
        dataEcoles.forEach(rentre => {
          this.rentreeList.push({ label: rentre.nom, value: rentre.nom, _id: rentre._id })
        })

      })
      this.campusDropdown = []
      data.campus.forEach(c => {
        this.campusDropdown.push({ label: c, value: c })
      })
    })

    this.defaultDropdown = this.programeFrDropdown

    this.onInitRegisterForm();
    if (localStorage.getItem('token'))
      this.btnTextBack = "Revenir à IMS"

    if (this.route.snapshot.paramMap.get('code_commercial')) {
      this.hideCC = true
    }
  }


  onInitRegisterForm() {
    this.RegisterForm = this.formBuilder.group({

      // ****** Informations générales *******
      civilite: new FormControl(environment.civilite[0], [Validators.required]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      firstname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      date_naissance: new FormControl('', [Validators.required]),
      nationalite: new FormControl(this.nationList[0], [Validators.required]),
      pays_adresse: new FormControl(this.paysList[76], [Validators.required, Validators.pattern('[^0-9]+')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      indicatif: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      numero_whatsapp: new FormControl('', [Validators.pattern('[- +()0-9]+'),]),
      indicatif_whatsapp: new FormControl('', [Validators.pattern('[- +()0-9]+')]),
      numero_telegram: new FormControl('', [Validators.pattern('[- +()0-9]+'),]),
      indicatif_telegram: new FormControl('', [Validators.pattern('[- +()0-9]+')]),
      // ****** Informations suplumentaires si alternant *******
      nir: new FormControl(''),
      mobilite_reduite: new FormControl(false),
      sportif_hn: new FormControl(false),

      //******* Parcours académiques et professionnel *******
      validated_academic_level: new FormControl('', [Validators.required]),
      statut_actuel: new FormControl(this.statutList[0], [Validators.required]),
      other: new FormControl(''),
      languages_fr: new FormControl('', [Validators.required]),
      languages_en: new FormControl('', [Validators.required]),
      is_professional_experience: new FormControl(false, [Validators.required]),
      professional_experience: new FormControl('', Validators.required),

      //******* Choix du pays de destination, du programme et de la formation  *******
      campusChoix1: new FormControl(this.campusDropdown[0], [Validators.required]),
      campusChoix2: new FormControl(this.campusDropdown[1], [Validators.required]),
      campusChoix3: new FormControl(this.campusDropdown[2], [Validators.required]),
      formation: new FormControl("", [Validators.required]),
      rentree_scolaire: new FormControl('', [Validators.required]),
      programme: new FormControl(this.programList[0], [Validators.required]),
      rythme_formation: new FormControl('', Validators.required),

      //****** Notre partenaire d'accompagnement EduHorizons *******
      servicesEh_1: new FormControl(false, [Validators.required]),
      servicesEh_2: new FormControl(false, [Validators.required]),
      servicesEh_3: new FormControl(false, [Validators.required]),
      servicesEh_4: new FormControl(false, [Validators.required]),
      servicesEh_5: new FormControl(false, [Validators.required]),
      servicesEh_6: new FormControl(false, [Validators.required]),
      isGarant: new FormControl(false, [Validators.required]),
      nomGarant: new FormControl('', [Validators.pattern('[^0-9]+')]),
      prenomGarant: new FormControl('', [Validators.pattern('[^0-9]+')]),

      //****** Une dernière étape *******
      agence: new FormControl(false),
      nomAgence: new FormControl(''),
      mailAgence: new FormControl(''),
      numeroAgence: new FormControl(''),
      donneePerso: new FormControl(false, Validators.required),
      code_commercial: new FormControl(this.route.snapshot.paramMap.get('code_commercial')),

    });
    if (!this.route.snapshot.paramMap.get('code_commercial') && localStorage.getItem("CommercialCode")) {
      this.RegisterForm.patchValue({ code_commercial: localStorage.getItem("CommercialCode") })
    }
    console.log(this.RegisterForm.value.code_commercial, localStorage.getItem("CommercialCode"), this.route.snapshot.paramMap.get('code_commercial'))
  };

  nextPage() {
    this.ActiveIndex++
    if (this.ActiveIndex == 3) {
      //A la demande de Haithem caché la page Accompagnement
      this.ActiveIndex = 4
    }
  }

  previousPage() {
    this.ActiveIndex--
  }

  partenaireFound: Partenaire = null;
  nomAgenceFinder() {
    let agenceNom = this.RegisterForm.value.nomAgence
    let agenceEmail = this.RegisterForm.value.mailAgence
    this.PartenaireService.getByNameOrEmail(agenceNom, agenceEmail).subscribe(p => {
      if (p) {
        this.partenaireFound = p
        this.RegisterForm.patchValue({ code_commercial: p.code_partenaire, nomAgence: p.nom, mailAgence: p.email })
      } else {
        if (this.ECOLE.langue == 'English') {
          this.messageService.add({ severity: "info", summary: "No partners found with this email or name", detail: "You can continue if you insert the commercial code" })
        } else
          this.messageService.add({ severity: "info", summary: "Aucun partenaire trouvé avec cette email ou nom", detail: "Vous pouvez continuez si vous inserez le code commercial" })
      }
    })
  }

  verificationCode() {
    this.PartenaireService.getByCode(this.RegisterForm.value.code_commercial).subscribe(p => {
      if (p)
        if (this.ECOLE.langue == 'English') this.messageService.add({ severity: "success", summary: "Successful partner" })
        else this.messageService.add({ severity: "success", summary: "Partenaire trouvé avec succès" })
      else
        if (this.ECOLE.langue == 'English') this.messageService.add({ severity: "error", summary: "No partners found with this code" })
        else this.messageService.add({ severity: "error", summary: "Aucun partenaire trouvé avec ce code" })
    })
  }

  verifEmailInBD() {
    this.emailExist = false
    this.AuthService.getByEmail(this.RegisterForm.value.email).subscribe((dataMail) => {
      if (dataMail) {
        this.emailExist = true
        if (this.ECOLE.langue == 'English') {
          this.messageService.add({ severity: 'error', summary: 'Your email is already in use', detail: "Registration cannot be finalized" });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: "L'inscription ne pourra pas être finalisé" });
        }

        return true
      }
    },
      (error) => {
        return false
      })
  }

  // ****** Informations générales *******
  get civilite() { return this.RegisterForm.get('civilite').value; }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get date_naissance() { return this.RegisterForm.get('date_naissance'); }
  get pays_adresse() { return this.RegisterForm.get('pays_adresse').value; }
  get nationalite() { return this.RegisterForm.get('nationalite').value; }
  get indicatif() { return this.RegisterForm.get('indicatif'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get email() { return this.RegisterForm.get('email'); }
  get numero_whatsapp() { return this.RegisterForm.get('numero_whatsapp'); }
  get indicatif_whatsapp() { return this.RegisterForm.get('indicatif_whatsapp'); }
  get numero_telegram() { return this.RegisterForm.get('numero_telegram'); }
  get indicatif_telegram() { return this.RegisterForm.get('indicatif_telegram'); }
  get code_commercial() { return this.RegisterForm.get('code_commercial'); }

  //******* Parcours académiques et professionnel *******
  get validated_academic_level() { return this.RegisterForm.get('validated_academic_level'); }
  get statut_actuel() { return this.RegisterForm.get('statut_actuel').value; }
  get other() { return this.RegisterForm.get('other'); }
  get rentree_scolaire() { return this.RegisterForm.get('rentree_scolaire'); }
  get languages_fr() { return this.RegisterForm.get('languages_fr'); }
  get languages_en() { return this.RegisterForm.get('languages_en'); }
  get is_professional_experience() { return this.RegisterForm.get('is_professional_experience'); }
  get professional_experience() { return this.RegisterForm.get('professional_experience'); }

  //******* Choix du pays de destination, du programme et de la formation  *******
  get campusChoix1() { return this.RegisterForm.get('campusChoix1'); }
  get campusChoix2() { return this.RegisterForm.get('campusChoix2'); }
  get campusChoix3() { return this.RegisterForm.get('campusChoix3'); }
  get programme() { return this.RegisterForm.get('programme').value; }
  get formation() { return this.RegisterForm.get('formation').value; }
  get rythme_formation() { return this.RegisterForm.get('rythme_formation').value; }
  get nir() { return this.RegisterForm.get('nir'); }
  get mobilite_reduite() { return this.RegisterForm.get('mobilite_reduite'); }
  get sportif_hn() { return this.RegisterForm.get('sportif_hn'); }
  //****** Notre partenaire d'accompagnement EduHorizons *******
  get servicesEh() { return this.RegisterForm.get('servicesEh'); }
  get isGarant() { return this.RegisterForm.get('isGarant'); }
  get nomGarant() { return this.RegisterForm.get('nomGarant'); }
  get prenomGarant() { return this.RegisterForm.get('prenomGarant'); }

  //****** Une dernière étape *******
  get agence() { return this.RegisterForm.get('agence'); }
  get nomAgence() { return this.RegisterForm.get('nomAgence'); }
  get donneePerso() { return this.RegisterForm.get('donneePerso'); }

  get ville_adresse() { return this.RegisterForm.get('ville_adresse'); }
  get rue_adresse() { return this.RegisterForm.get('rue_adresse'); }
  get numero_adresse() { return this.RegisterForm.get('numero_adresse'); }
  get postal_adresse() { return this.RegisterForm.get('postal_adresse'); }

  get classe_id() { return this.RegisterForm.get('classe_id'); }
  get statut() { return this.RegisterForm.get('statut'); }
  get campus() { return this.RegisterForm.get('campus'); }
  get diplome() { return this.RegisterForm.get('diplome'); }


  loadDiplome() {

    for (let diplome of this.diplomes) {
      if (diplome.campus_id = this.campus) {

        console.log(diplome)
        this.diplomesOfCampus.push(diplome)
      }

    }

    this.diplomeService.getAllByCampus(this.RegisterForm.value.campus._id).subscribe(
      (data) => {
        this.diplomesOfCampus = data;
        console.log(this.diplomesOfCampus)
      },
      (error) => { console.log(error) }
    );
  }


  //Methode d'ajout d'un nouveau prospect
  onAddProspect() {

    //recuperation des données du formulaire
    let civilite = this.RegisterForm.get('civilite').value.value;
    let lastname = this.RegisterForm.get('lastname').value;
    let firstname = this.RegisterForm.get('firstname').value;
    let date_naissance = this.RegisterForm.get('date_naissance').value;
    let nationalite = this.RegisterForm.get('nationalite').value.value;
    let pays_adresse = this.RegisterForm.get('pays_adresse').value;
    let email = this.RegisterForm.get('email').value;
    let phone = this.RegisterForm.get('phone').value;
    let numero_whatsapp = this.RegisterForm.get('numero_whatsapp').value;
    let indicatif_whatsapp = this.RegisterForm.get('indicatif_whatsapp').value;
    let numero_telegram = this.RegisterForm.get('numero_telegram').value;
    let indicatif_telegram = this.RegisterForm.get('indicatif_telegram').value;
    let code_commercial = this.RegisterForm.get('code_commercial').value;

    //******* Parcours académiques et professionnel *******
    let validated_academic_level = this.RegisterForm.get('validated_academic_level').value.value;
    let statut_actuel = this.RegisterForm.get('statut_actuel').value.value;
    let other = this.RegisterForm.get('other').value;
    let languages_fr = this.RegisterForm.get('languages_fr').value;
    let languages_en = this.RegisterForm.get('languages_en').value;
    let is_professional_experience = this.RegisterForm.get('is_professional_experience').value;
    let professional_experience = this.RegisterForm.get('professional_experience').value;

    //******* Choix du pays de destination, du programme et de la formation  *******
    let campusChoix1 = this.RegisterForm.get('campusChoix1').value.value;
    let campusChoix2 = this.RegisterForm.get('campusChoix2').value.value;
    let campusChoix3 = this.RegisterForm.get('campusChoix3').value.value;
    let programme = this.RegisterForm.get('programme').value.value;
    let formation = this.RegisterForm.get('formation').value;
    let rentree_scolaire = this.RegisterForm.value.rentree_scolaire
    let rythme_formation = this.RegisterForm.get('rythme_formation').value.value;
    // if (rythme_formation == "Alternance") {
    let nir = this.RegisterForm.get('nir').value;
    let mobilite_reduite = this.RegisterForm.get('mobilite_reduite').value.value;
    let sportif_hn = this.RegisterForm.get('sportif_hn').value.value;


    if (this.form_origin == "eduhorizons") {
      programme = null
      formation = null
    }
    //****** Notre partenaire d'accompagnement EduHorizons *******
    let servicesEh = [this.RegisterForm.get('servicesEh_1').value, this.RegisterForm.get('servicesEh_2').value, this.RegisterForm.get('servicesEh_3').value, this.RegisterForm.get('servicesEh_4').value, this.RegisterForm.get('servicesEh_5').value, this.RegisterForm.get('servicesEh_6').value];
    let isGarant = this.RegisterForm.get('isGarant').value.value;
    let nomGarant = this.RegisterForm.get('nomGarant').value;
    let prenomGarant = this.RegisterForm.get('prenomGarant').value;
    let hors_Admission = false;
    if (this.route.snapshot.paramMap.get('code_commercial')) {
      hors_Admission = true;
    }
    //****** Une dernière étape *******
    let agence = this.RegisterForm.get('agence').value;
    let nomAgence = this.RegisterForm.get('nomAgence').value;
    let numeroAgence = this.RegisterForm.get('numeroAgence').value
    let donneePerso = this.RegisterForm.get('donneePerso').value;
    let customid = ""
    try {
      customid = this.generateCode(nationalite, firstname, lastname, date_naissance)
    } catch (error) {
      customid = ""
    }
    let source = "Site Web";
    if (this.route.snapshot.paramMap.get('code_commercial') || localStorage.getItem("CommercialCode") || code_commercial)
      source = "Partenaire"
    if (localStorage.getItem('sourceProspect'))
      source = localStorage.getItem('sourceProspect')

    //Création du nouvel user
    let user = new User(null, firstname, lastname, this.RegisterForm.get('indicatif').value, phone, '', email, firstname + '@2022', 'user', null, null, civilite, null, null, 'Prospect', null, pays_adresse.value, null, null, null, null, nationalite, false, new Date());

    //Creation du nouveau prospect

    let prospect = new Prospect(null, null, date_naissance, numero_whatsapp, validated_academic_level, statut_actuel, other, languages_fr + ", " + languages_en,
      professional_experience, campusChoix1, campusChoix2, campusChoix3,
      programme, formation, rythme_formation, servicesEh, nomGarant, prenomGarant, nomAgence, donneePerso, Date(), this.form_origin, code_commercial,
      "En attente de traitement", null, "En cours de traitement", null, null, indicatif_whatsapp, null, null, null, customid, null, null, null, null, false, null,
      nir, mobilite_reduite, sportif_hn,
      hors_Admission, null, null, null, null, null, null, null, source, rentree_scolaire, null, numeroAgence, languages_fr, languages_en, numero_telegram, indicatif_telegram);
    this.admissionService.create({ 'newUser': user, 'newProspect': prospect }).subscribe(
      ((response) => {
        if (response.success) {
          this.servService.getAServiceByLabel("Admission").subscribe(serviceAdmission => {
            console.log(serviceAdmission)

            this.NotifService.create(new Notification(null, null, null, "nouvelle demande admission", null, null, serviceAdmission._id)).pipe(map(notif => {
              this.NotifService.newNotif(notif)
            }, (error) => {
              console.error(error)
            }));

            if (this.ECOLE.langue == 'English') this.messageService.add({ severity: 'success', summary: 'The request for admission was sent', detail: "Check your email for login details" });
            else this.messageService.add({ severity: 'success', summary: 'La demande d\'admission a été envoyé', detail: "Vérifiez vos mails pour les informations de connexion" });
            this.getFilesAccess(response.dataUser._id, response.token, response.dataProspect._id)
          })
        } else {
          if (this.ECOLE.langue == 'English') this.messageService.add({ severity: 'error', summary: 'Unable to finalize pre-registration', detail: "Your email may already be in use" });
          else this.messageService.add({ severity: 'error', summary: 'Impossible de finaliser la pré-inscription', detail: "Votre email est peut-être déjà utilisé" });
          console.error(response)
        }

      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Impossible de finaliser la pré-inscription veuillez contacter un administrateur', detail: "Votre email est peut-être déjà utilisé" });
        console.error(error);
      })
    );
  }

  getFilesAccess(ID, token, id) {
    /*this.admissionService.getTokenByUserId(ID).subscribe(data => {
      localStorage.setItem("ProspectConected", data.token)
      this.router.navigate(["/suivre-ma-preinscription"]);
    })*/
    console.log(token)
    localStorage.setItem('token', token)
    this.router.navigate(["/admission/lead-informations/" + id]);
  }




  VerifCampus() {
    let c1 = this.RegisterForm.value.campusChoix1.value
    let c2 = this.RegisterForm.value.campusChoix2.value
    let c3 = this.RegisterForm.value.campusChoix3.value
    if (c1 != null && c2 != null) {
      return c1 == c2 || c2 == c3 || c1 == c3
    } else {
      return null
    }
  }

  redirectAgent() {
    this.router.navigate(["/"])
  }

  redirectLogin() {
    this.router.navigate(["/loginExterne"])
  }

  generateCode(nation, firstname, lastname, date_naissance) {
    let code_pays = nation.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[nation] && code[nation] != undefined) {
        code_pays = code[nation]
      }
    })
    let prenom = firstname.substring(0, 1)
    let nom = lastname.substring(0, 1)
    let y = 0
    for (let i = 0; i < (nom.match(" ") || []).length; i++) {
      nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
      y = nom.indexOf(" ", y) + 1
    }
    let dn = new Date(date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = new Date().getMilliseconds().toString()
    nb = nb.substring(nb.length - 3)
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
    return r

  }



}
