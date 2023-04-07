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
import { map } from 'rxjs';
import { PartenaireService } from '../services/partenaire.service';
import { Partenaire } from '../models/Partenaire';


@Component({
  selector: 'app-formulaire-admission',
  templateUrl: './formulaire-admission.component.html',
  styleUrls: ['./formulaire-admission.component.scss'],

})
export class FormulaireAdmissionComponent implements OnInit {
  emailExist: boolean;

  constructor(private route: ActivatedRoute, private servService: ServService, private diplomeService: DiplomeService, private campusService: CampusService, private router: Router,
    private formBuilder: FormBuilder, private AuthService: AuthService, private messageService: MessageService, private admissionService: AdmissionService,
    private NotifService: NotificationService, private PartenaireService: PartenaireService) { }

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

  formSteps: any[] = [
    "Infos",
    "Parcours",
    "Programme",
    "Partenaires",
    "Fin",
  ];

  rentreeList = [
    { label: "Mars 2023", value: "Mars 2023" },
    { label: "Septembre 2023", value: "Septembre 2023" }
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
      { value: "Paris - France" },
      { value: "Montpellier - France" },
      { value: "Brazzaville - Congo" },
      { value: "Rabat - Maroc" },
      { value: "La Valette - Malte" },
      { value: "UAE - Dubai" },
      { value: "En ligne" },
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
  programeFrDropdown =
    [
      {
        label: "1ere année BTS MCO - Management Commercial Operationnel",
        value: "1ere année BTS MCO - Management Commercial Operationnel"
      },
      {
        label: "1ere année BTS NDRC - Négociation et Digitalisation de la Relation Client",
        value: "1ere année BTS NDRC - Négociation et Digitalisation de la Relation Client"
      },
      {
        label: "1ere année BTS CI - Commerce International",
        value: "1ere année BTS CI - Commerce International"
      },
      {
        label: "Année 2 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)",
        value: "Année 2 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)"
      },
      {
        label: "Année 3 : Bachelor Chargé de gestion commerciale - Spécialité service commercial ",
        value: "Année 3 : Bachelor Chargé de gestion commerciale - Spécialité service commercial"
      },
      {
        label: "Mastère 1 : IA - Ingénieur d'Affaires",
        value: "Mastère 1 : IA - Ingénieur d'Affaires"
      },
      {
        label: "1ere année BTS SIO - Services Informatiques aux Organisations",
        value: "1ere année BTS SIO - Services Informatiques aux Organisations"
      },
      {
        label: "Année 1 : TSSR   - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)",
        value: "Année 1 : TSSR   - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)"
      },
      {
        label: "Année 2 : TSSR  - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)",
        value: "Année 2 : TSSR  - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)"
      },
      {
        label: "Année 1 : DWWM  - Développeur Web et Web Mobile (Titre professionnel)",
        value: "Année 1 : DWWM  - Développeur Web et Web Mobile (Titre professionnel)"
      },
      {
        label: "Année 2 : DWWM - Développeur Web et Web Mobile (Titre professionnel)",
        value: "Année 2 : DWWM - Développeur Web et Web Mobile (Titre professionnel)"
      },
      {
        label: "Année 3 : Bachelor AIS - Administrateur d’Infrastructures Sécurisées",
        value: "Année 3 : Bachelor AIS - Administrateur d’Infrastructures Sécurisées"
      },
      {
        label: "Année 3 : Bachelor CDA - Concepteur Développeur d’Applications",
        value: "Année 3 : Bachelor CDA - Concepteur Développeur d’Applications"
      },
      {
        label: "Mastère 1 : EXPERT IT - CYBERSÉCURITÉ ET HAUTE DISPONIBILITÉ ",
        value: "Mastère 1 : EXPERT IT - CYBERSÉCURITÉ ET HAUTE DISPONIBILITÉ"
      },
      {
        label: "Mastère 1 : EXPERT IT - APPLICATIONS INTELLIGENTES & BIG DATA ",
        value: "Mastère 1 : EXPERT IT - APPLICATIONS INTELLIGENTES & BIG DATA "
      },
      {
        label: "Année 1 TP ARH : Assistant Ressources Humaines (Titre Professionnel)",
        value: "Année 1 TP ARH : Assistant Ressources Humaines (Titre Professionnel)"
      },
      {
        label: "Année 3 : Bachelor Chargé de Gestion et Management - Comptabilité & Finance d'Entreprise",
        value: "Année 3 : Bachelor Chargé de Gestion et Management - Comptabilité & Finance d'Entreprise"
      },
      {
        label: "Année 3 : Bachelor Chargé de Gestion et Management - Management & Ressources humaines",
        value: "Année 3 : Bachelor Chargé de Gestion et Management - Management & Ressources humaines"
      },
      {
        label: "Mastère 1 : Manager en ressources humaines",
        value: "Mastère 1 : Manager en ressources humaines"
      },
      {
        label: "Mastère 1 MRH - Mastère européen - Management des Ressources Humaines",
        value: "Mastère 1 MRH - Mastère européen - Management des Ressources Humaines"
      },
      {
        label: "Mastère 1 : Manager des organisations - Management et stratégies financières ",
        value: "Mastère 1 : Manager des organisations - Management et stratégies financièresl"
      },
      {
        label: "Année 1 TP BIM Modeleur du Bâtiment (Titre Professionnel)",
        value: "Année 1 TP BIM Modeleur du Bâtiment (Titre Professionnel)"
      },
      {
        label: "Année 3 : Bachelor Coordinateur BIM du Bâtiment",
        value: "Année 3 : Bachelor Coordinateur BIM du Bâtiment"
      },
      {
        label: "BTS SPSSS - Services et Prestations dans les Secteurs Sanitaire et Social",
        value: "BTS SPSSS - Services et Prestations dans les Secteurs Sanitaire et Social"
      },
      //Septembre 2023 || Mars 2023 && Programme Français
      {
        label: "Année 3 : Bachelor Chargé de développement  marketing et commercial",
        value: "Année 3 : Bachelor Chargé de développement  marketing et commercial"
      },
      {
        label: "Mastère 1 : MDO : Manager des organisations",
        value: "Mastère 1 : MDO : Manager des organisations"
      },

      {
        label: "Année 1 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)",
        value: "Année 1 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)"
      }

    ];

  programEnDropdown =
    [
      {
        label: "Level 4 : Business Management ",
        value: "Level 4 : Business Management "
      },
      {
        label: "Level 4 : Information Technology ",
        value: "Level 4 : Information Technology "
      },
      {
        label: "Level 7 : Project Management ",
        value: "Level 7 : Project Management "
      },
      {
        label: "Level 4 : Tourism and Hospitality Management ",
        value: "Level 4 : Tourism and Hospitality Management "
      },
      {
        label: "Level 7 : Tourism and Hospitality Management ",
        value: "Level 7 : Tourism and Hospitality Management "
      },
      {
        label: "Level 5 : Business Management ",
        value: "Level 5 : Business Management "
      },
      {
        label: "Level 6 : Business Management ",
        value: "Level 6 : Business Management "
      },
      {
        label: "Année 3 : Bachelor Chargé de développement  marketing et commercial",
        value: "Année 3 : Bachelor Chargé de développement  marketing et commercial"
      },
      {
        label: "Level 5 : Information Technology ",
        value: "Level 5 : Information Technology"
      },
      {
        label: "Level 6 : Information Technology ",
        value: "Level 6 : Information Technology"
      }

    ];
  defaultDropdown = this.programeFrDropdown

  typeFormationDropdown = [
    { value: "Intiale" },
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


  ngOnInit(): void {
    if (localStorage.getItem("CommercialCode")) {
      this.cookieCodeCommercial = localStorage.getItem("CommercialCode")
    }
    if (this.form_origin == "eduhorizons") {
      //COMME ESTYA
    } else if (this.form_origin == "estya") {
      //DROPDOWN PAR DEFAUT
    } else if (this.form_origin == "adg") {
      //Septembre 2023 || Mars 2023 & Programme Français
      this.programeFrDropdown.push(
        {
          label: "Assistant maternel - Garde d’enfants - samedi ",
          value: "Assistant maternel - Garde d’enfants - samedi"
        },
        {
          label: "Gouvernant d’enfants",
          value: "Gouvernant d’enfants"
        },
        {
          label: "CAP AEPE - Accompagnant éducatif petite enfance",
          value: "CAP AEPE - Accompagnant éducatif petite enfance"
        },
        {
          label: "Année 3 : Bachelor  Chargé de gestion commerciale - Spécialité Tourisme ",
          value: "Année 3 : Bachelor  Chargé de gestion commerciale - Spécialité Tourisme "
        },
        {
          label: "Année 3 : Bachelor Chargé de gestion commerciale - Spécialité hôtellerie restauration",
          value: "Année 3 : Bachelor Chargé de gestion commerciale - Spécialité hôtellerie restauration"
        },
        {
          label: "EH - Employé d'étage ",
          value: "EH - Employé d'étage "
        },
        {
          label: "TP GH Gouvernant en Hôtellerie ",
          value: "TP GH Gouvernant en Hôtellerie "
        }
      )
      this.programEnDropdown =
        [
          {
            label: "Level 4 : Business Management ",
            value: "Level 4 : Business Management "
          },
          {
            label: "Level 4 : Information Technology ",
            value: "Level 4 : Information Technology "
          },
          {
            label: "Level 7 : Project Management ",
            value: "Level 7 : Project Management "
          },
          {
            label: "Level 4 : Tourism and Hospitality Management ",
            value: "Level 4 : Tourism and Hospitality Management "
          },
          {
            label: "Level 7 : Tourism and Hospitality Management ",
            value: "Level 7 : Tourism and Hospitality Management "
          },
          {
            label: "Level 5 : Business Management ",
            value: "Level 5 : Business Management "
          },
          {
            label: "Level 6 : Business Management ",
            value: "Level 6 : Business Management "
          },
          {
            label: "ENP - Diploma in Tourism and Hospitality Management",
            value: "ENP - Diploma in Tourism and Hospitality Management"
          },
          {
            label: "Level 5 : Information Technology ",
            value: "Level 5 : Information Technology"
          },
          {
            label: "Level 6 : Information Technology ",
            value: "Level 6 : Information Technology"
          }

        ];
    } else if (this.form_origin == "espic") {
      this.programeFrDropdown =
        [
          {
            label: "1ere année BTS MCO - Management Commercial Operationnel",
            value: "1ere année BTS MCO - Management Commercial Operationnel"
          },
          {
            label: "1ere année BTS NDRC - Négociation et Digitalisation de la Relation Client",
            value: "1ere année BTS NDRC - Négociation et Digitalisation de la Relation Client"
          },
          {
            label: "1ere année BTS CI - Commerce International",
            value: "1ere année BTS CI - Commerce International"
          },
          {
            label: "Année 2 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)",
            value: "Année 2 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)"
          },
          {
            label: "Année 3 : Bachelor Chargé de gestion commerciale - Spécialité service commercial ",
            value: "Année 3 : Bachelor Chargé de gestion commerciale - Spécialité service commercial"
          },
          {
            label: "Mastère 1 : IA - Ingénieur d'Affaires",
            value: "Mastère 1 : IA - Ingénieur d'Affaires"
          },
          {
            label: "Année 1 TP ARH : Assistant Ressources Humaines (Titre Professionnel)",
            value: "Année 1 TP ARH : Assistant Ressources Humaines (Titre Professionnel)"
          },
          {
            label: "Année 3 : Bachelor Chargé de Gestion et Management - Comptabilité & Finance d'Entreprise",
            value: "Année 3 : Bachelor Chargé de Gestion et Management - Comptabilité & Finance d'Entreprise"
          },
          {
            label: "Année 3 : Bachelor Chargé de Gestion et Management - Management & Ressources humaines",
            value: "Année 3 : Bachelor Chargé de Gestion et Management - Management & Ressources humaines"
          },
          {
            label: "Mastère 1 : Manager en ressources humaines",
            value: "Mastère 1 : Manager en ressources humaines"
          },
          {
            label: "Mastère 1 MRH - Mastère européen - Management des Ressources Humaines",
            value: "Mastère 1 MRH - Mastère européen - Management des Ressources Humaines"
          },
          {
            label: "Mastère 1 : Manager des organisations - Management et stratégies financières ",
            value: "Mastère 1 : Manager des organisations - Management et stratégies financièresl"
          },
          {
            label: "Année 1 TP BIM Modeleur du Bâtiment (Titre Professionnel)",
            value: "Année 1 TP BIM Modeleur du Bâtiment (Titre Professionnel)"
          },
          {
            label: "Année 3 : Bachelor Coordinateur BIM du Bâtiment",
            value: "Année 3 : Bachelor Coordinateur BIM du Bâtiment"
          },
          {
            label: "BTS SPSSS - Services et Prestations dans les Secteurs Sanitaire et Social",
            value: "BTS SPSSS - Services et Prestations dans les Secteurs Sanitaire et Social"
          },
          //Septembre 2023 || Mars 2023 && Programme Français
          {
            label: "Année 3 : Bachelor Chargé de développement  marketing et commercial",
            value: "Année 3 : Bachelor Chargé de développement  marketing et commercial"
          },
          {
            label: "Mastère 1 : MDO : Manager des organisations",
            value: "Mastère 1 : MDO : Manager des organisations"
          },

          {
            label: "Année 1 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)",
            value: "Année 1 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)"
          }
        ];
      this.programEnDropdown =
        [
          {
            label: "Level 4 : Business Management ",
            value: "Level 4 : Business Management "
          },
          {
            label: "Level 4 : Information Technology ",
            value: "Level 4 : Information Technology "
          },
          {
            label: "Level 7 : Project Management ",
            value: "Level 7 : Project Management "
          },
          {
            label: "Level 4 : Tourism and Hospitality Management ",
            value: "Level 4 : Tourism and Hospitality Management "
          },
          {
            label: "Level 7 : Tourism and Hospitality Management ",
            value: "Level 7 : Tourism and Hospitality Management "
          },
          {
            label: "Level 5 : Business Management ",
            value: "Level 5 : Business Management "
          },
          {
            label: "Level 6 : Business Management ",
            value: "Level 6 : Business Management "
          },
          {
            label: "Level 5 : Information Technology ",
            value: "Level 5 : Information Technology"
          },
          {
            label: "Level 6 : Information Technology ",
            value: "Level 6 : Information Technology"
          }

        ];
    } else if (this.form_origin == "studinfo") {
      this.programeFrDropdown =
        [
          {
            label: "1ere année BTS SIO - Services Informatiques aux Organisations",
            value: "1ere année BTS SIO - Services Informatiques aux Organisations"
          },
          {
            label: "Année 1 : TSSR   - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)",
            value: "Année 1 : TSSR   - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)"
          },
          {
            label: "Année 2 : TSSR  - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)",
            value: "Année 2 : TSSR  - Technicien Supérieur Systèmes et Réseaux (Titre professionnel)"
          },
          {
            label: "Année 1 : DWWM  - Développeur Web et Web Mobile (Titre professionnel)",
            value: "Année 1 : DWWM  - Développeur Web et Web Mobile (Titre professionnel)"
          },
          {
            label: "Année 2 : DWWM - Développeur Web et Web Mobile (Titre professionnel)",
            value: "Année 2 : DWWM - Développeur Web et Web Mobile (Titre professionnel)"
          },
          {
            label: "Année 3 : Bachelor AIS - Administrateur d’Infrastructures Sécurisées",
            value: "Année 3 : Bachelor AIS - Administrateur d’Infrastructures Sécurisées"
          },
          {
            label: "Année 3 : Bachelor CDA - Concepteur Développeur d’Applications",
            value: "Année 3 : Bachelor CDA - Concepteur Développeur d’Applications"
          },
          {
            label: "Mastère 1 : EXPERT IT - CYBERSÉCURITÉ ET HAUTE DISPONIBILITÉ ",
            value: "Mastère 1 : EXPERT IT - CYBERSÉCURITÉ ET HAUTE DISPONIBILITÉ"
          },
          {
            label: "Mastère 1 : EXPERT IT - APPLICATIONS INTELLIGENTES & BIG DATA ",
            value: "Mastère 1 : EXPERT IT - APPLICATIONS INTELLIGENTES & BIG DATA "
          },
          {
            label: "Année 1 TP BIM Modeleur du Bâtiment (Titre Professionnel)",
            value: "Année 1 TP BIM Modeleur du Bâtiment (Titre Professionnel)"
          },
          {
            label: "Année 3 : Bachelor Coordinateur BIM du Bâtiment",
            value: "Année 3 : Bachelor Coordinateur BIM du Bâtiment"
          }
        ];
      this.programEnDropdown =
        [
          {
            label: "Level 4 : Information Technology ",
            value: "Level 4 : Information Technology "
          },
          {
            label: "Level 5 : Information Technology ",
            value: "Level 5 : Information Technology"
          },
          {
            label: "Level 6 : Information Technology ",
            value: "Level 6 : Information Technology"
          }
        ]

    } else if (this.form_origin == "estya-dubai") {
      this.programeFrDropdown = [
        { label: 'Project Management', value: 'Project Management' },
        { label: 'Information Technology', value: 'Information Technology' },
        { label: 'Business Management', value: 'Business Management' },
        { label: 'Master Manager en ressources humaine', value: 'Master Manager en ressources humaine' },
        { label: 'Master Ingénieur d\'affaire', value: 'Master Ingénieur d\'affaire' },
        { label: 'Chargé de gestion commerciale', value: 'Chargé de gestion commerciale' },
        { label: 'English Foundation Year', value: 'English Foundation Year' },
      ]
    } else if (this.form_origin == "intuns") {
      this.programeFrDropdown = [
        { label: 'Niveau 6 : Chargé de Gestion et Management', value: "Niveau 6 : Chargé de Gestion et Management" },//(Titre RNCP No 34734)
        { label: 'Niveau 6 : Chargé de Gestion Commerciale', value: "Niveau 6 : Chargé de Gestion Commerciale" },// (Titre RNCP No 34465)
        { label: 'Niveau 7 : Manager en Ressources Humaines', value: "Niveau 7 : Manager en Ressources Humaines" },// (Titre RNCP No 35125)
        { label: 'Titre : Ingénieur d’affaire', value: "Titre : Ingénieur d’affaire" }, //(Titre RNCP No 23692)
        { label: 'ENGLISH PROGRAM L7 Project Management', value: "ENGLISH PROGRAM L7 Project Management" },//(1-year Master program)
      ]
    } else if (this.form_origin == "intunivesity") {
      //PAREIL QUE ESTYA
    }
    this.defaultDropdown = this.programeFrDropdown

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
      this.RegisterForm.controls.code_commercial.patchValue(this.cookieCodeCommercial)
    }
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
        this.messageService.add({ severity: "info", summary: "Aucun partenaire trouvé avec cette email ou nom", detail: "Vous pouvez continuez si vous inserez le code commercial" })
      }
    })
  }

  verificationCode() {
    this.PartenaireService.getByCode(this.RegisterForm.value.code_commercial).subscribe(p => {
      if (p)
        this.messageService.add({ severity: "success", summary: "Partenaire trouvé avec succès" })
      else
        this.messageService.add({ severity: "error", summary: "Aucun partenaire trouvé avec ce code" })
    })
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
    let source = (code_commercial != "" || hors_Admission) ? "Partenaire" : "Interne";

    //Création du nouvel user
    let user = new User(null, firstname, lastname, this.RegisterForm.get('indicatif').value, phone, '', email, firstname + '@2022', 'user', null, null, civilite, null, null, 'Prospect', null, pays_adresse.value, null, null, null, null, nationalite);

    //Creation du nouveau prospect

    let prospect = new Prospect(null, null, date_naissance, numero_whatsapp, validated_academic_level, statut_actuel, other, languages_fr + ", " + languages_en, professional_experience, campusChoix1, campusChoix2, campusChoix3, programme, formation, rythme_formation, servicesEh, nomGarant, prenomGarant, nomAgence, donneePerso, Date(), this.form_origin, code_commercial,
      "En attente de traitement", null, "En cours de traitement", null, null, indicatif_whatsapp, null, null, null, customid, null, null, null, null, false, null, nir, mobilite_reduite, sportif_hn,
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

            this.messageService.add({ severity: 'success', summary: 'La demande d\'admission a été envoyé', detail: "Vérifiez vos mails pour les informations de connexion" });
            this.getFilesAccess(response.dataUser._id)
          })
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
    this.admissionService.getTokenByUserId(ID).subscribe(data => {
      localStorage.setItem("ProspectConected", data.token)
      this.router.navigate(["/suivre-ma-preinscription"]);
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

  choixRentree() {
    if (this.RegisterForm.value.rentree_scolaire == "Mars 2023") {
      if (this.form_origin == "estya" || this.form_origin == "eduhorizons" || this.form_origin == "intunivesity" || this.form_origin == "espic")
        this.programeFrDropdown = [
          {
            label: "Année 3 : Bachelor Chargé de développement  marketing et commercial",
            value: "Année 3 : Bachelor Chargé de développement  marketing et commercial"
          },
          {
            label: "Mastère 1 : MDO : Manager des organisations",
            value: "Mastère 1 : MDO : Manager des organisations"
          },

          {
            label: "Année 1 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)",
            value: "Année 1 TP NTC - Négociateur Technico-Commercial (Titre Professionnel)"
          }
        ]
    } else {
      this.programeFrDropdown = this.defaultDropdown
    }
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