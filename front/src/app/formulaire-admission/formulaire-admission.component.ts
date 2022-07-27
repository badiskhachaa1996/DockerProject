import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { Inscription } from 'src/app/models/Inscription';
import { MessageService } from 'primeng/api';
import { Diplome } from 'src/app/models/Diplome';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { ServService } from 'src/app/services/service.service';


@Component({
  selector: 'app-formulaire-admission',
  templateUrl: './formulaire-admission.component.html',
  styleUrls: ['./formulaire-admission.component.scss'],

})
export class FormulaireAdmissionComponent implements OnInit {
  emailExist: boolean;

  constructor(private route: ActivatedRoute, private servService: ServService, private diplomeService: DiplomeService, private campusService: CampusService, private router: Router, private formBuilder: FormBuilder, private AuthService: AuthService, private messageService: MessageService, private admissionService: AdmissionService, private NotifService: NotificationService,) { }

  routeItems: MenuItem[];
  cookieCodeCommercial = ""
  nationList = environment.nationalites;
  calendar: any;
  fr = environment.fr;
  ActiveIndex = 0;
  RegisterForm: FormGroup;
  paysList = environment.pays;
  civiliteList = environment.civilite;
  diplomes = [];
  diplomesOfCampus = [];
  userConnected: User;
  maxYear = new Date().getFullYear() - 13
  minYear = new Date().getFullYear() - 80
  rangeYear = this.minYear + ":" + this.maxYear
  minDateCalendar = new Date("01/01/" + this.minYear)
  maxDateCalendar = new Date("01/01/" + this.maxYear)
  token = localStorage.getItem('token')
  service_admission_id;
  formSteps: any[] = [
    "Infos",
    "Parcours",
    "Programme",
    "Partenaires",
    "Fin",
  ];

  academicList =
    [
      { label: 'Pré-bac', value: 'Pré-bac' },
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
      { value: "Campus Paris - France" },
      { value: "Campus Montpellier - France" },
      { value: "Campus Athène - Grèce" },
      { value: "Campus Valence - Espagne" },
      { value: "Campus Florence - Italie" },
      { value: "Campus UAE - Dubai" },
      { value: "Campus Tunis - Tunisie" },

    ];

  programList =
    [
      { value: "Programme Anglais" },
      { value: "Programme Français" },
    ];

  programeFrDropdown =
    [
      { value: "BTS MCO - Management Commercial Opérationnel" },
      { value: "BTS NDRC - Négociation et Digitalisation de la Relation Client" },
      { value: "BTS CG - Comptabilité et Gestion" },
      { value: "RNCP CI - Commerce International" },
      { value: "RNCP NTC - Négociateur Technico-Commercial" },
      { value: "RNCP - Chargé de Développement Marketing et Commercial" },
      { value: "RNCP - IA - Ingénieur d'Affaires" },
      { value: "RNCP Management et Commerce International" },
      { value: "BTS Services Informatique aux Organisations - SISR" },
      { value: "BTS Services Informatique aux Organisations - SLAM" },
      { value: "RNCP TSSR - Technicien Supérieur Systèmes et Réseaux" },
      { value: "RNCP DWWM - Développeur Web & Web Mobile" },
      { value: "RNCP AIS - Administrateur d'Infrastructures Sécurisées" },
      { value: "RNCP CDA - Concepteur Développeur d'Applications" },
      { value: "RNCP MPI Big Data - Expert IT – Applications Intelligentes & Big Data" },
      { value: "RNCP MPI CyberSecurité - Expert IT – Cybersécurité et Haute Disponibilité" },
      { value: "BTS Collaborateur Juriste Notarial" },
      { value: "RNCP - Assistant Ressources Humaines" },
      { value: "RNCP- Management des Ressources Humaines" },
      { value: "BTS SPSSS - Services et Prestations des Secteurs Sanitaire et Social" },
      { value: "RNCP - BIM modeleur du Bâtiement" },
      { value: "RNCP - BIM modeleur du Coordinateur BIM du Bâtiment" },
    ];

  programEnDropdown =
    [
      { value: "Level 3 - Foundation Diploma for Higher Education Studies" },
      { value: "Level 4 - Business Management " },
      { value: "Level 4 - Information Technology " },
      { value: "Level 4 - Tourism and Hospitality Management" },
      { value: "Level 4 - Health and Social care Management" },
      { value: "Level 5 - Business Management" },
      { value: "Level 5 - Information Technology" },
      { value: "Level 7 - Project Management" },
      { value: "Level 7 - Tourism and Hospitality Management" },
      { value: "Level 7 - Health and Social care Management", }

    ];

  typeFormationDropdown = [
    { value: "Intiale" },
    { value: "Alternance" }
  ];

  form_origin: string = this.route.snapshot.paramMap.get('ecole'); //eduhorizons estya adg espic


  ngOnInit(): void {
    if(localStorage.getItem("CommercialCode")){
      this.cookieCodeCommercial=localStorage.getItem("CommercialCode")
    }


    if (this.form_origin == "eduhorizons") {
      this.campusDropdown = [
        { value: "Campus France - Paris" },
        { value: "Campus France - Montpellier" },
        { value: "Campus Valence - Espagne" },
        { value: "Campus Florence - Italie" },
        { value: "Campus UAE - Dubai" },
        { value: "Campus Tunisie - Tunis" },
        { value: "Campus Montréal - Canada" },
        { value: "Campus Malte " },
        { value: "Campus Congo" },
        { value: "Campus Maroc" },
        { value: "Campus USA" },
        { value: "Campus En ligne" }
      ]
    } else if (this.form_origin == "estya") {
      this.campusDropdown = [
        { value: "Campus Paris - France" },
        { value: "Campus Montpellier - France" },
        { value: "Campus Brazzaville - Congo" },
        { value: "Campus Rabat - Maroc " },
        { value: "Campus Malte" },
        { value: "Campus En ligne" }
      ]
    } else if (this.form_origin == "adg") {
      this.campusDropdown = [
        { value: "Campus Paris - France" },
        { value: "Campus Montpellier - France" },
        { value: "Campus En ligne" }
      ]

      this.programeFrDropdown = [
        { value: "GH - Gouvernant(e) en hôtellerie - Titre RNCP - Niveau 4" },
        { value: "CAP AEPE – CAP Accompagnant Educatif Petite Enfance" },
        { value: "GM - Gouvernant(e) de maison - Diplôme maison" },
        { value: "BTS MCO - Management Commercial Operationnel" },
        { value: "BTS NDRC - Négociation et Digitalisation de la Relation Client" },
        { value: "BTS GPME" },
        { value: "BTS CI - Commerce International" },
        { value: "NTC - Négociateur Technico-Commercial (Titre Professionnel)" },
        { value: "Chargé de gestion commerciale - Spécialité service commercial" },
        { value: "IA - Ingénieur d'Affaires" },
        { value: "Management et Stratégie d’Entreprise " },
        { value: "BTS SIO - Services Informatiques aux Organisations" },
        { value: "TSSR - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)" },
        { value: "DWWM - Développeur Web et Web Mobile (Titre professionnel)" },
        { value: "AIS - Administrateur d’Infrastructures Sécurisées" },
        { value: "CDA - Concepteur Développeur d’Applications" },
        { value: "EXPERT IT - CYBERSÉCURITÉ ET HAUTE DISPONIBILITÉ " },
        { value: "EXPERT IT - APPLICATIONS INTELLIGENTES & BIG DATA " },
        { value: "BTS CJN  - Collaborateur Juriste Notarial" },
        { value: "BTS CG - Comptabilité et Gestion" },
        { value: "ARH : Assistant Ressources Humaines (Titre Professionnel)" },
        { value: "BIM Modeleur du Bâtiment (Titre Professionnel)" },
        { value: "Coordinateur BIM du Bâtiment" },
        { value: "BTS SPSSS - Services et Prestations dans les Secteurs Sanitaire et Social" },
        { value: "Formations continues IPERIA" }
      ]
    } else if (this.form_origin == "espic") {
      this.campusDropdown = [
        { value: "Campus France - Paris" },
        { value: "Campus Athène - Grèce" },
        { value: "Campus En ligne" }
      ]

    }


    this.onInitRegisterForm();

    this.routeItems = [
      { label: 'Infos' },
      { label: 'Parcours' },
      { label: 'Programme' },
      { label: 'Partenaires' },
      { label: 'Dernière étape' },
    ];

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
      numero_whatsapp: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), ]),
      indicatif_whatsapp: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),

      //******* Parcours académiques et professionnel *******
      validated_academic_level: new FormControl(this.academicList[0], [Validators.required]),
      statut_actuel: new FormControl(this.statutList[0], [Validators.required]),
      other: new FormControl(''),
      languages: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      is_professional_experience: new FormControl(false, [Validators.required]),
      professional_experience: new FormControl('', Validators.required),

      //******* Choix du pays de destination, du programme et de la formation  *******
      campusChoix1: new FormControl(this.campusDropdown[0], [Validators.required]),
      campusChoix2: new FormControl(this.campusDropdown[1], [Validators.required]),
      campusChoix3: new FormControl(this.campusDropdown[2], [Validators.required]),
      formation: new FormControl(this.programeFrDropdown[0], [Validators.required]),
      programme: new FormControl(this.programList[0], [Validators.required]),
      rythme_formation: new FormControl('', Validators.required),

      //****** Notre partenaire d'accompagnement Eduhorizons *******
      servicesEh_1: new FormControl(false, [Validators.required]),
      servicesEh_2: new FormControl(false, [Validators.required]),
      servicesEh_3: new FormControl(false, [Validators.required]),
      servicesEh_4: new FormControl(false, [Validators.required]),
      servicesEh_5: new FormControl(false, [Validators.required]),
      isGarant: new FormControl(false, [Validators.required]),
      nomGarant: new FormControl('', [Validators.pattern('[^0-9]+')]),
      prenomGarant: new FormControl('', [Validators.pattern('[^0-9]+')]),

      //****** Une dernière étape *******
      agence: new FormControl(false),
      nomAgence: new FormControl('', Validators.pattern('[^0-9]+')),
      donneePerso: new FormControl(false, Validators.required),
      code_commercial: new FormControl(this.cookieCodeCommercial),

    });
  };

  nextPage() {
    this.ActiveIndex++
  }

  previousPage() {
    this.ActiveIndex--
  }

  verifEmailInBD() {
    this.emailExist = false
    this.AuthService.getByEmail(this.RegisterForm.value.email).subscribe((dataMail) => {
      if (dataMail) {
        this.emailExist = true
        this.messageService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: "L'inscription ne pourra pas être finalisé" });
        return true
      }
    },
      (error) => {
        console.log(this.emailExist + '151')
        console.log("Email unique")
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
  get code_commercial() { return this.RegisterForm.get('code_commercial'); }

  //******* Parcours académiques et professionnel *******
  get validated_academic_level() { return this.RegisterForm.get('validated_academic_level'); }
  get statut_actuel() { return this.RegisterForm.get('statut_actuel').value; }
  get other() { return this.RegisterForm.get('other'); }
  get languages() { return this.RegisterForm.get('languages'); }
  get is_professional_experience() { return this.RegisterForm.get('is_professional_experience'); }
  get professional_experience() { return this.RegisterForm.get('professional_experience'); }

  //******* Choix du pays de destination, du programme et de la formation  *******
  get campusChoix1() { return this.RegisterForm.get('campusChoix1'); }
  get campusChoix2() { return this.RegisterForm.get('campusChoix2'); }
  get campusChoix3() { return this.RegisterForm.get('campusChoix3'); }
  get programme() { return this.RegisterForm.get('programme').value.value; }
  get formation() { return this.RegisterForm.get('formation').value.value; }
  get rythme_formation() { return this.RegisterForm.get('rythme_formation').value; }

  //****** Notre partenaire d'accompagnement Eduhorizons *******
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
    let code_commercial = this.RegisterForm.get('code_commercial').value;

    //******* Parcours académiques et professionnel *******
    let validated_academic_level = this.RegisterForm.get('validated_academic_level').value.value;
    let statut_actuel = this.RegisterForm.get('statut_actuel').value.value;
    let other = this.RegisterForm.get('other').value;
    let languages = this.RegisterForm.get('languages').value;
    let is_professional_experience = this.RegisterForm.get('is_professional_experience').value;
    let professional_experience = this.RegisterForm.get('professional_experience').value;

    //******* Choix du pays de destination, du programme et de la formation  *******
    let campusChoix1 = this.RegisterForm.get('campusChoix1').value.value;
    let campusChoix2 = this.RegisterForm.get('campusChoix2').value.value;
    let campusChoix3 = this.RegisterForm.get('campusChoix3').value.value;
    let programme = this.RegisterForm.get('programme').value.value;
    let formation = this.RegisterForm.get('formation').value.value;
    let rythme_formation = this.RegisterForm.get('rythme_formation').value.value;
    if (this.form_origin == "eduhorizons") {
      programme = null
      formation = null
    }
    //****** Notre partenaire d'accompagnement Eduhorizons *******
    let servicesEh = [this.RegisterForm.get('servicesEh_1').value, this.RegisterForm.get('servicesEh_2').value, this.RegisterForm.get('servicesEh_3').value, this.RegisterForm.get('servicesEh_4').value, this.RegisterForm.get('servicesEh_5').value];
    let isGarant = this.RegisterForm.get('isGarant').value.value;
    let nomGarant = this.RegisterForm.get('nomGarant').value;
    let prenomGarant = this.RegisterForm.get('prenomGarant').value;

    //****** Une dernière étape *******
    let agence = this.RegisterForm.get('agence').value;
    let nomAgence = this.RegisterForm.get('nomAgence').value;
    let donneePerso = this.RegisterForm.get('donneePerso').value;

    //Création du nouvel user
    let user = new User(null, firstname, lastname, this.RegisterForm.get('indicatif').value, phone, '', email, firstname + '@2022', 'user', null, null, civilite, null, null, 'Prospect', null, pays_adresse.value, null, null, null, null, nationalite);

    //Creation du nouveau prospect
    let prospect = new Prospect(null, null, date_naissance, numero_whatsapp, validated_academic_level, statut_actuel, other, languages, professional_experience, campusChoix1, campusChoix2, campusChoix3, programme, formation, rythme_formation, servicesEh, nomGarant, prenomGarant, nomAgence, donneePerso, Date(), this.form_origin, code_commercial, "En attente de traitement", null, "En cours de traitement", null, null, indicatif_whatsapp);
    this.admissionService.create({ 'newUser': user, 'newProspect': prospect }).subscribe(
      ((response) => {
        if (response.success) {
          //Envoie de notif TODO


          this.NotifService.create(new Notification(null, null, null, "nouvelle demande admission", null, null, "62555405607a7a55050430bc")).subscribe((notif) => {
           console.log(notif)
            this.NotifService.newNotif(notif)


          }, (error) => {
            console.error(error)
          });

          this.messageService.add({ severity: 'success', summary: 'La demande d\'admission a été envoyé', detail: "Vérifiez vos mails pour les informations de connexion" });
          this.getFilesAccess(response.dataUser._id)
        } else {
          this.messageService.add({ severity: 'error', summary: 'Impossible de finaliser la pré-inscription', detail: "Votre email est peut-être déjà utilisé" });
          console.error(response)
        }

      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Impossible de finaliser la pré-inscription veuillez contacter un administrateur', detail: "Votre email est peut-être déjà utilisé" });
        console.error(error);
      })
    );
  }

  getFilesAccess(ID) {
    this.AuthService.WhatTheRole(ID).subscribe(data => {
      localStorage.setItem("ProspectConected", data.Ptoken)
      if (this.token == null) {
        localStorage.setItem("token", this.token)
      }
      this.router.navigateByUrl('/suivre-ma-preinscription', { skipLocationChange: true }).then(() => {
        if (this.token == null) {
          localStorage.setItem("token", this.token)
        }
        localStorage.setItem("ProspectConected", data.Ptoken)
        this.router.navigate(["/suivre-ma-preinscription"]);
      });
    })
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


}