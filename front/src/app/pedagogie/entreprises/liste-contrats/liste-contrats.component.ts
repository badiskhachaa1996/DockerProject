import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { AuthService } from 'src/app/services/auth.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DiplomeService } from 'src/app/services/diplome.service';
import { map } from 'rxjs';
import { User } from 'src/app/models/User';
import { EcoleService } from 'src/app/services/ecole.service';
import { CampusService } from 'src/app/services/campus.service';
import { saveAs } from 'file-saver';
import { ClasseService } from 'src/app/services/classe.service';
import { error } from 'console';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-liste-contrats',
  templateUrl: './liste-contrats.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./liste-contrats.component.scss']
})
export class ListeContratsComponent implements OnInit {

  token;
  collaborateur: User; // collaborateur actuellement connecté
  Professionnalisation: boolean;
  ListeContrats: ContratAlternance[] = []
  tuteurInfoPerso: any;
  EntreprisesName: any[] = [];
  maxYear = new Date().getFullYear() - 16
  minYear = new Date().getFullYear() - 60
  rangeYear = this.minYear + ":" + this.maxYear
  minDateCalendar = new Date("01/01/" + this.minYear)
  maxDateCalendar = new Date("01/01/" + this.maxYear)
  maxYearC = new Date().getFullYear() + 4
  minYearC = new Date().getFullYear() - 1
  rangeYearC = this.minYear + ":" + this.maxYearC
  minDateCalendarC = new Date("01/01/" + this.minYearC)
  maxDateCalendarC = new Date("01/01/" + this.maxYearC)
  listAlternantDD: any = []
  myListAlternantDD: {};
  formationList = []
  myFormationList = {}
  RegisterNewCA: FormGroup;
  idTuteur = this.route.snapshot.paramMap.get('idTuteur');
  ParmTuteur = this.route.snapshot.paramMap.get('idTuteur');
  formAddNewCA: boolean = false;
  ConnectedEntreprise: any;
  EntrepriseList = [];
  myEntrepriseList = {};
  TuteursList = [];
  dropdownTuteurList = []
  ListCommercial = [];

  dropDownCommecialList = [];
  myDropDownCommecialList = {};
  dropdownCFA = [];

  //partie dedié à la mise à jour 
  showFormUpdateCa: boolean = false;
  formUpdateCa: FormGroup;
  contratToUpdate: ContratAlternance;

  //Liste des années scolaire
  dropDownAnneeList: any[] = [
    { label: '2021-2022' },
    { label: '2022-2023' },
    { label: '2023-2024' },
    { label: '2024-2025' },
    { label: '2025-2026' },
  ];

  filtreAgent = [
    { value: null, label: "Commerciaux" }
  ];

  filtreCampus = [
    { value: null, label: "Campus" }
  ];

  filtreFormation = [
    { value: null, label: "Toutes les formations" }
  ];

  filtreStatus = [
    { label: 'Status', value: null },
    { label: '0- Créé', value: 'Créé' },
    { label: '1- Conclu', value: 'Conclu' },
    { label: '2- En attente d’informations', value: 'En attente d’informations' },
    { label: '3- En attente de validation', value: 'En attente de validation' },
    { label: '4- Champs requis', value: 'Champs requis' },
    { label: '5- Montant optimisé', value: 'Montant optimisé' },
    { label: '6- Signé', value: 'Signé' },
    { label: '7- Déposé à l’OPCO', value: 'Déposé à l’OPCO' },
    { label: '8- Relance à traiter', value: 'Relance à traiter' },
    { label: '9- Validé à facturation', value: 'Validé à facturation' },
    { label: '10- Résilié', value: 'Résilié' },
  ];

  filtreMobility = [
    { label: 'Mobilité *', value: null },
    { label: 'Non', value: 'Non' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Accordé', value: 'Accordé' }, //* Un champs pour saisir la valeur sera affiché pour mentionner le montant subventionné
    { label: 'Facturé à l\’opco', value: 'Facturé à l\’opco' },
    { label: 'Fournis à l\'étudiant', value: 'Fournis à l\'étudiant' },
  ];

  filtreEcole = [
    { label: 'Choissisez une école', value: null }
  ]

  advantageStatusList: any[] = [
    { label: 'Non', value: 'Non' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Accordé', value: 'Accordé' }, //* Un champs pour saisir la valeur sera affiché pour mentionner le montant subventionné
    { label: 'Facturé à l\’opco', value: 'Facturé à l\’opco' },
    { label: 'Fournis à l\'étudiant', value: 'Fournis à l\'étudiant' },
  ];

  // pour afficher le champs de saisie du prix de la mobilité
  showCout: boolean = false;
  // pour afficher le champs de saisie du prix du matériel pédagogique
  showMatPedPrice: boolean = false;
  // pour afficher le champs de saisie du prix d'aide au permis
  showDLHelpPrice: boolean = false;

  showStatusForm: boolean = false;
  statusForm: FormGroup;

  statusList: any = [
    { label: 'Choisir le status du contrat', value: null },
    { label: '1- Conclu', value: 'Conclu' },
    { label: '2- En attente d’informations', value: 'En attente d’informations' },
    { label: '3- En attente de validation', value: 'En attente de validation' },
    { label: '4- Champs requis', value: 'Champs requis' },
    { label: '5- Montant optimisé', value: 'Montant optimisé' },
    { label: '6- Signé', value: 'Signé' },
    { label: '7- Déposé à l’OPCO', value: 'Déposé à l’OPCO' },
    { label: '8- Relance à traiter', value: 'Relance à traiter' },
    { label: '9- Validé à facturation', value: 'Validé à facturation' },
    { label: '10- Résilié', value: 'Résilié' },
  ];

  showFormAddCerfa: boolean = false;
  showFormAddConvention: boolean = false;
  showFormAddResiliation: boolean = false;
  showFormAddAccordPriseEnCharge: boolean = false;
  showFormAddRelance: boolean = false;
  showFormAddLivret: boolean = false;
  doc: any;

  // partie dédié à la gestion de l'affichage par filtre par commercial
  listeContratsFilteredByCommercial: ContratAlternance[] = [];
  commercialFiltered: User;
  showFilterByCommercial: boolean = false;
  // partie dédié à la gestion de l'affichage par filtre par commercial
  listeContratsFilteredByCampus: ContratAlternance[] = [];
  campusFiltered: User;
  showFilterByCampus: boolean = false;
  showHistoriqueModif: boolean = false;


  constructor(private entrepriseService: EntrepriseService, private route: ActivatedRoute,
    private messageService: MessageService, private router: Router, private etudiantService: EtudiantService,
    private authService: AuthService, private tuteurService: TuteurService, public classeService: ClasseService,
    private formationService: DiplomeService, private formBuilder: FormBuilder, private EcoleService: EcoleService,
    private campusService: CampusService) { }

  get entreprise_id() { return this.RegisterNewCA.get('entreprise_id'); }
  get tuteur_id() { return this.RegisterNewCA.get('tuteur_id').value; }
  get debut_contrat() { return this.RegisterNewCA.get('debut_contrat'); }
  get fin_contrat() { return this.RegisterNewCA.get('fin_contrat'); }
  get horaire() { return this.RegisterNewCA.get('horaire').value; }
  get alternant() { return this.RegisterNewCA.get('alternant').value; }

  get alternantValidite() { return this.RegisterNewCA.get('alternant').invalid; }
  get intitule() { return this.RegisterNewCA.get('intitule').value; }
  get classification() { return this.RegisterNewCA.get('classification').value; }
  get niv() { return this.RegisterNewCA.get('niv').value; }
  get coeff_hier() { return this.RegisterNewCA.get('coeff_hier').value; }
  get code_commercial() { return this.RegisterNewCA.get('code_commercial').value; }
  get form() { return this.RegisterNewCA.get('form').value; }
  get professionnalisation() { return this.RegisterNewCA.get('professionnalisation'); }


  get entreprise_id_m() { return this.formUpdateCa.get('entreprise_id'); }
  get tuteur_id_m() { return this.formUpdateCa.get('tuteur_id').value; }
  get debut_contrat_m() { return this.formUpdateCa.get('debut_contrat'); }
  get fin_contrat_m() { return this.formUpdateCa.get('fin_contrat'); }
  get horaire_m() { return this.formUpdateCa.get('horaire').value; }
  get alternant_m() { return this.formUpdateCa.get('alternant').value; }

  get alternantValidite_m() { return this.formUpdateCa.get('alternant').invalid; }
  get intitule_m() { return this.formUpdateCa.get('intitule').value; }
  get classification_m() { return this.formUpdateCa.get('classification').value; }
  get niv_m() { return this.formUpdateCa.get('niv').value; }
  get coeff_hier_m() { return this.formUpdateCa.get('coeff_hier').value; }
  get code_commercial_m() { return this.formUpdateCa.get('code_commercial').value; }
  get form_m() { return this.formUpdateCa.get('form').value; }
  get professionnalisation_m() { return this.formUpdateCa.get('professionnalisation'); }


  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))
    // recuperation de l'utilisateur actuellement connecté
    this.authService.getPopulate(this.token.id).subscribe({
      next: (response) => {
        this.collaborateur = response;
      },
      error: (error) => { console.log(error) },
    });

    this.campusService.getAll().subscribe(campus => {
      campus.forEach(c => {
        this.filtreCampus.push({ label: c.libelle, value: c._id })
      })
    })

    //Lister toutes les formations
    this.formationService.getAll().subscribe(data => {

      data.forEach(element => {
        this.formationList.push({ label: element.titre, value: element._id });
        this.myFormationList[element._id] = element;
      });
      this.onInitFormUpdateCa();
      this.onInitRegisterNewCA();
    })

    //Lister toutes les entreprises 
    this.entrepriseService.getAll().subscribe(listEntre => {
      this.EntrepriseList = [];
      this.myEntrepriseList = {};
      listEntre.forEach(ent => {
        this.EntrepriseList.push({ label: ent.r_sociale, value: ent._id })
        this.myEntrepriseList[ent._id] = ent;
      })
      // Lister tous les étudiants alternants
      this.etudiantService.getAllAlternants().subscribe(alternantsData => {
        this.listAlternantDD = [];
        this.myListAlternantDD = {};
        alternantsData.forEach(altdata => {
          //ajouter l'attribut nom complet aux objets etudiants pour les afficher
          if (altdata.user_id) {
            altdata.nomcomplet = altdata.user_id?.firstname + ' ' + altdata.user_id?.lastname
            this.listAlternantDD.push({ label: altdata.nomcomplet, value: altdata._id })

            this.myListAlternantDD[altdata._id] = `${altdata.user_id?.lastname} ${altdata.user_id?.firstname}`;
          }
        })
      })

      this.EcoleService.getAll().subscribe(data => {
        data.forEach(e => {
          this.dropdownCFA.push({ value: e._id, label: e.libelle })
          this.filtreEcole.push({ value: e._id, label: e.libelle })
        })
      })


      // LISTE A AFFICHER POUR LADMIN
      if (this.token.role == "Admin" || this.token.role == "Agent") {
        this.entrepriseService.getAllContrats().subscribe(Allcontrats => {
          this.ListeContrats = Allcontrats;
          this.InitAgentFilter()
          Allcontrats.forEach(cont => {
            if (cont.tuteur_id && cont.tuteur_id?.entreprise_id)
              this.entrepriseService.getById(cont.tuteur_id?.entreprise_id).subscribe(entpName => {
                this.EntreprisesName[entpName._id] = entpName;
              })
          })
        })
      }
      // Liste des contrats à afficher pour le watcher
      else if (this.token.role == "Watcher") {
        this.entrepriseService.getAllContrats().subscribe({
          next: (response) => {
            response.forEach((contrat: ContratAlternance) => {
              let { ecole }: any = contrat;
              if (ecole.libelle == 'ADG') {
                this.ListeContrats.push(contrat);
              }
            })
          },
          error: (error) => { console.log(error) },
          complete: () => { console.log('Contrats Watcher récupéré') }
        });
      }


      /// *******LISTE A AFFICHER POUR LES CEO ENTREPRISE******** 
      else if (!this.idTuteur && this.token.type == "CEO Entreprise") {
        this.entrepriseService.getByDirecteurId(this.token.id).subscribe(
          entrepriseData => {
            this.ConnectedEntreprise = entrepriseData;

            this.RegisterNewCA.patchValue({ entreprise_id: this.ConnectedEntreprise })

            this.tuteurService.getAllByEntrepriseId(this.ConnectedEntreprise._id).subscribe(
              listTuteur => {
                this.TuteursList = listTuteur;
                this.dropdownTuteurList = []

                // recuperation des informations du CEO actuellement connecté
                this.authService.getInfoById(this.token.id).subscribe(
                  ((userConnected) => {
                    // ajout des données du representant en tant que tuteur
                    this.dropdownTuteurList.push({ label: `${userConnected.firstname} ${userConnected.lastname}`, value: userConnected._id });

                    this.TuteursList.forEach(tut => {
                      if (tut.user_id && tut.user_id.firstname && tut.user_id.lastname) {
                        tut.nomCOmplet = tut.user_id?.firstname + " " + tut.user_id?.lastname
                        this.dropdownTuteurList.push({ label: tut.nomCOmplet, value: tut._id })
                      }
                    })
                  }),
                  ((error) => { console.log(error); })
                );

              }, (eror) => { console.error(eror) })

            this.entrepriseService.getAllContratsbyEntreprise(entrepriseData._id).subscribe(
              listeData => {
                this.ListeContrats = listeData;
                this.InitAgentFilter()
              },
              (eror) => { console.error(eror) })
          }, (eror) => { console.error(eror) })

      }
      // LISTE A AFFICHER POUR LES TUTEURS
      else if (this.token.type == "Tuteur") {
        this.tuteurService.getByUserId(this.token.id).subscribe(TutData => {
          this.idTuteur = TutData._id

          this.entrepriseService.getAllContratsbyTuteur(this.idTuteur).subscribe(listeData => {
            this.ListeContrats = listeData;
            this.InitAgentFilter()
          })
        })
      }
      else {
        this.entrepriseService.getAllContratsbyTuteur(this.idTuteur).subscribe(listeData => {
          this.ListeContrats = listeData;
          this.InitAgentFilter()
          this.tuteurService.getById(this.idTuteur).subscribe(TutData => {
            this.authService.getInfoById(TutData._id).subscribe(TuteurInfoPerso => {
              this.tuteurInfoPerso = TuteurInfoPerso
            })
          })
        })
      }
      this.authService.getAllCommercialV2().subscribe(CommercialData => {
        this.ListCommercial = CommercialData
        this.filtreAgent = [{ value: null, label: "Commerciaux" }]
        this.ListCommercial.forEach(comData => {
          comData.nomComplet = comData.firstname + " " + comData.lastname;
          this.dropDownCommecialList.push({ label: comData.nomComplet, value: comData._id })
          this.filtreAgent.push({ label: comData.nomComplet, value: comData._id })
          this.myDropDownCommecialList[comData._id] = comData.nomComplet;
        })
      })
    })

    // initialisation du formulaire de mise à jour du status
    this.statusForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });

    // Filtre pour récupérer la liste des formations
    this.token = jwt_decode(localStorage.getItem("token"))
    this.formationService.getAll().subscribe(formation => {
      formation.forEach(f => {
        this.filtreFormation.push({ label: f.titre_long, value: f._id })
      })
    })

   
  }

  showPresence(alternant_id) {
    this.router.navigate(["details/" + alternant_id]);
  }
  ShowAddNewCA() {
    this.onInitRegisterNewCA()
    this.formAddNewCA = true;
  }
  afficherProsChamp() {

    this.Professionnalisation = this.RegisterNewCA.value.professionnalisation

  }
  onInitRegisterNewCA() {

    this.RegisterNewCA = this.formBuilder.group({
      entreprise_id: new FormControl(''),
      tuteur_id: new FormControl('', Validators.required),
      debut_contrat: new FormControl('', Validators.required),
      fin_contrat: new FormControl('', Validators.required),
      horaire: new FormControl(''),
      alternant: new FormControl('', Validators.required),
      intitule: new FormControl(''),
      classification: new FormControl(''),
      niv: new FormControl(''),
      coeff_hier: new FormControl(''),
      form: new FormControl(this.formationList[0].value, Validators.required),
      code_commercial: new FormControl(''),
      professionnalisation: new FormControl(''),
      anne_scolaire: new FormControl(),
      ecole: new FormControl('', Validators.required),
      mob_int: [this.advantageStatusList[0].label],
      cout_mobilite: new FormControl(''),
      mat_ped: [this.advantageStatusList[0].label],
      cout_mat_ped: [''],
      dl_help: [this.advantageStatusList[0].label],
      cout_dl_help: [''],
    })
  }


  onInitFormUpdateCa() {
    this.formUpdateCa = this.formBuilder.group({
      entreprise_id: new FormControl(''),
      tuteur_id: new FormControl('', Validators.required),
      debut_contrat: new FormControl('', Validators.required),
      fin_contrat: new FormControl('', Validators.required),
      horaire: new FormControl(''),
      alternant: new FormControl('', Validators.required),
      intitule: new FormControl(''),
      classification: new FormControl(''),
      niv: new FormControl(''),
      coeff_hier: new FormControl(''),
      form: new FormControl('', Validators.required),
      code_commercial: new FormControl(''),
      anne_scolaire: new FormControl(''),
      professionnalisation: new FormControl(''),
      ecole: new FormControl('', Validators.required),
      mob_int: [this.advantageStatusList[0].label],
      cout_mobilite: new FormControl(''),
      mat_ped: [this.advantageStatusList[0].label],
      cout_mat_ped: [''],
      dl_help: [this.advantageStatusList[0].label],
      cout_dl_help: [''],
    })
  }


  loadTuteur(event: any, tuteurId = null) {
    this.dropdownTuteurList = []
    let idENT = event;
    // recuperation de l'entreprise pour avoir le nom du directeur
    this.entrepriseService.getByIdPopulate(idENT).subscribe(
      ((entreprise) => {
        let byPassDirecteur: any = entreprise.directeur_id;

        this.tuteurService.getAllByEntrepriseId(idENT).subscribe(
          listTuteur => {
            this.TuteursList = listTuteur;
            if (byPassDirecteur && byPassDirecteur.firstname && byPassDirecteur.lastname)
              this.dropdownTuteurList.push({ label: `${byPassDirecteur.firstname} ${byPassDirecteur.lastname}`, value: byPassDirecteur._id });

            this.TuteursList.forEach(tut => {
              if (tut.user_id && tut.user_id.firstname && tut.user_id.lastname) {
                tut.nomCOmplet = tut.user_id?.firstname + " " + tut.user_id?.lastname
                this.dropdownTuteurList.push({ label: tut.nomCOmplet, value: tut._id })
              }
            })
            if (tuteurId != null) {
              this.dropdownTuteurList.forEach((tuteur) => {
                if (tuteur.value == tuteurId) {
                  this.formUpdateCa.patchValue({
                    tuteur_id: { label: tuteur.label, value: tuteur.value }
                  });
                }
              });
            }

          }, (eror) => { console.error(eror) })
      }),
      ((error) => { console.log(error); })
    )

  }


  // creation d'un nouveau contrat d'alternance
  createNewCA() {
    let annee_scolaires = [];

    this.RegisterNewCA.get('anne_scolaire')?.value.forEach((annee) => {
      annee_scolaires.push(annee.label);
    });

    let CA_Object = new ContratAlternance(null, this.debut_contrat.value, this.fin_contrat.value, this.horaire, this.alternant, this.intitule, this.classification, this.niv, this.coeff_hier, this.form, this.tuteur_id, '', this.RegisterNewCA.get('entreprise_id').value, this.code_commercial, 'créé', annee_scolaires, this.RegisterNewCA.value.ecole, this.RegisterNewCA.get('mob_int')?.value, this.RegisterNewCA.get('cout_mobilite')?.value, this.RegisterNewCA.get('mat_ped')?.value, this.RegisterNewCA.get('cout_mat_ped')?.value, this.RegisterNewCA.get('dl_help')?.value, this.RegisterNewCA.get('cout_dl_help')?.value, null, null, null, null, null, null, null, null, this.collaborateur._id, new Date(), null)

    this.entrepriseService.createContratAlternance(CA_Object).subscribe(
      resData => {
        this.messageService.add({ severity: 'success', summary: 'Le contrat alternance', detail: " a été créé avec succés" });
        this.formAddNewCA = false
        this.ngOnInit()

      }, (error => {
        this.messageService.add({ severity: 'error', summary: "Une erreur est arrivé", detail: error?.error?.message })
        console.error(error)
      }))
  }


  //Mise à jour d'un contrat d'alternance
  onUpdateCa() {
    let formValue = this.formUpdateCa.value;

    // partie historisation des modifications
    let listModif = [];

    new Date(this.contratToUpdate.debut_contrat).toLocaleDateString() !== formValue.debut_contrat.toLocaleDateString() ? listModif.push(`Date de debut est passé de ${new Date(this.contratToUpdate.debut_contrat).toLocaleDateString()} à ${formValue.debut_contrat.toLocaleDateString()}`) : false;
    new Date(this.contratToUpdate.fin_contrat).toLocaleDateString() !== formValue.fin_contrat.toLocaleDateString() ? listModif.push(`Date de fin est passé de ${new Date(this.contratToUpdate.fin_contrat).toLocaleDateString()} à ${formValue.fin_contrat.toLocaleDateString()}`) : false;
    this.contratToUpdate.horaire !== formValue.horaire ? listModif.push(`Horaire est passé de ${this.contratToUpdate.horaire}h à ${formValue.horaire}h`) : false;

    const {_id}: any = this.contratToUpdate.alternant_id;
    const {formation}: any = this.contratToUpdate;
    const {tuteur_id}: any = this.contratToUpdate;
    const {directeur_id}: any = this.contratToUpdate;
    const {entreprise_id}: any = this.contratToUpdate;
    
    _id != formValue.alternant ? listModif.push(`Changement de l'alternant, de ${this.myListAlternantDD[_id]} à ${this.myListAlternantDD[formValue.alternant]}`) : false;
    formation._id != formValue.form ? listModif.push(`Formation: de ${this.myFormationList[formation._id]} à ${this.myFormationList[formValue.form]}`) : false;
    
    if(tuteur_id != null)
    {
      tuteur_id._id != formValue.tuteur_id.value ? listModif.push(`Le tuteur a été modifié`) : false;
    } else if(directeur_id != null)
    {
      directeur_id._id != formValue.tuteur_id.value ? listModif.push(`Le tuteur a été modifié`) : false;
    }
  
    entreprise_id._id != formValue.entreprise_id.value ? listModif.push(`Entreprise est passé de ${this.myEntrepriseList[entreprise_id._id].r_sociale} à ${this.myEntrepriseList[formValue.entreprise_id.value].r_sociale}`) : false;
    this.contratToUpdate.code_commercial != formValue.code_commercial ? listModif.push(`Commercial est passé de ${this.myDropDownCommecialList[this.contratToUpdate.code_commercial]} à ${this.myDropDownCommecialList[formValue.code_commercial]}`) : false;
    this.contratToUpdate.anne_scolaire != formValue.anne_scolaire ? listModif.push(`L'année scolaire à été mis à jour`) : false;
    this.contratToUpdate.ecole != formValue.ecole ? listModif.push(`L'école a été modifié`) : false;
    this.contratToUpdate.cout_mobilite_status != formValue.mob_int ? listModif.push(`Le status de la mobilité internationale a été modifié`) : false;
    if(this.contratToUpdate.cout_mobilite == null)
    {
      formValue.cout_mobilite != '' ? listModif.push(`Le cout de la mobilité internationale a été modifié`) : false;
    } else {
      this.contratToUpdate.cout_mobilite != formValue.cout_mobilite ? listModif.push(`Le cout de la mobilité internationale a été modifié`) : false;
    }
    
    this.contratToUpdate.cout_mat_ped_status != formValue.mat_ped ? listModif.push(`Le status du champs matériel pédagogique à été mis à jour`) : false;
    
    if(this.contratToUpdate.cout_mat_ped == null)
    {
      formValue.cout_mat_ped != '' ? listModif.push(`Le coût du matériel pédagogique a été mis à jour`) : false;
    } else {
      this.contratToUpdate.cout_mat_ped != formValue.cout_mat_ped ? listModif.push(`Le coût du matériel pédagogique a été mis à jour`) : false;
    }
    
    this.contratToUpdate.cout_dl_help_status != formValue.dl_help ? listModif.push(`Le status du champs aide au permis à été mis à jour`) : false;
    
    if(this.contratToUpdate.cout_dl_help == null)
    {
      formValue.cout_dl_help != '' ? listModif.push(`Le coût du champs aide au permis a été mis à jour`) : false;
    } else {
      this.contratToUpdate.cout_dl_help != formValue.cout_dl_help ? listModif.push(`Le coût du champs aide au permis a été mis à jour`) : false;
    }

    console.log(this.contratToUpdate.cout_mobilite, formValue.cout_mobilite);
    console.log(listModif);

    const historiqueModification = 
    {
      user_id: this.collaborateur._id,
      update_description: listModif,
      update_date: new Date(),
    }

    // mise en place des données à envoyer
    this.contratToUpdate.debut_contrat = formValue.debut_contrat;
    this.contratToUpdate.fin_contrat = formValue.fin_contrat;
    this.contratToUpdate.horaire = formValue.horaire;
    this.contratToUpdate.alternant_id = formValue.alternant;
    this.contratToUpdate.intitule = formValue.intitule;
    this.contratToUpdate.classification = formValue.classification;
    this.contratToUpdate.niveau_formation = formValue.niv;
    this.contratToUpdate.coeff_hierachique = formValue.coeff_hier;
    this.contratToUpdate.formation = formValue.form;
    this.contratToUpdate.tuteur_id = formValue.tuteur_id.value;
    this.contratToUpdate.directeur_id = '';
    this.contratToUpdate.entreprise_id = formValue.entreprise_id.value;
    this.contratToUpdate.code_commercial = formValue.code_commercial;
    this.contratToUpdate.anne_scolaire = formValue.anne_scolaire;
    this.contratToUpdate.ecole = formValue.ecole;
    this.contratToUpdate.cout_mobilite_status = formValue.mob_int;
    this.contratToUpdate.cout_mobilite = formValue.cout_mobilite;
    this.contratToUpdate.cout_mat_ped_status = formValue.mat_ped;
    this.contratToUpdate.cout_mat_ped = formValue.cout_mat_ped;
    this.contratToUpdate.cout_dl_help_status = formValue.dl_help;
    this.contratToUpdate.cout_dl_help = formValue.cout_dl_help;
    this.contratToUpdate.historique_modification.push(historiqueModification);

    this.entrepriseService.updateContratAlternance(this.contratToUpdate).subscribe(resData => {
      this.messageService.add({ severity: 'success', summary: 'Le contrat alternance', detail: " a été mis à jour avec succés" });
      this.showFormUpdateCa = false
      this.ngOnInit()

    }, (error => { console.error(error) }))
  }


  //Methode pour preparer le formulaire de modification d'un contrat
  onFillFormUpdate(contrat: ContratAlternance) {
    this.contratToUpdate = contrat;
    console.log(this.contratToUpdate)
    // this.loadTuteur(contrat.tuteur_id.entreprise_id, contrat.tuteur_id._id)
    let bypass_alternant: any = contrat.alternant_id
    let bypass_formation: any = contrat.formation
    let bypass_commercial: any = contrat.code_commercial
    let bypass_entreprise: any = contrat.entreprise_id;

    let bypass_tuteur: any;
    if (contrat.tuteur_id == null) {
      bypass_tuteur = contrat.directeur_id;
      this.loadTuteur(bypass_entreprise._id, bypass_tuteur._id);
    } else {
      bypass_tuteur = contrat.tuteur_id;
      this.loadTuteur(bypass_entreprise._id, bypass_tuteur.user_id._id);
    }


    this.formUpdateCa.patchValue({
      entreprise_id: { label: bypass_entreprise.r_social, value: bypass_entreprise._id },
      debut_contrat: new Date(contrat.debut_contrat),
      fin_contrat: new Date(contrat.fin_contrat),
      horaire: contrat.horaire,
      alternant: bypass_alternant._id,
      intitule: contrat.intitule,
      classification: contrat.classification,
      niv: contrat.niveau_formation,
      coeff_hier: contrat.coeff_hierachique,
      form: bypass_formation._id,
      code_commercial: bypass_commercial._id,
      // anne_scolaire: contrat.anne_scolaire,

      professionnalisation: contrat.classification != "",
      ecole: contrat.ecole
    });
  }
  InitAgentFilter() {
    const contrats = this.ListeContrats
    let code_commercial = []
    contrats.forEach(contrat => {
      let cc: any = contrat.code_commercial
      if (cc && !code_commercial.includes(cc._id)) {
        code_commercial.push(cc._id)
        this.filtreAgent.push({ label: cc.firstname + " " + cc.lastname, value: cc._id })
      }
    })
  }

  // méthode d'affichage du cout
  onShowCout(event: any): void {
    if (event.value == 'Accordé') {
      this.showCout = true;
    } else {
      this.showCout = false;
    }
  }

  // méthode d'affichage du champs de saisie du montant coût pédagogique
  onShowMatPedPrice(event: any): void {
    if (event.value == 'Accordé') {
      this.showMatPedPrice = true;
    } else {
      this.showMatPedPrice = false;
    }
  }

  // méthode d'affichage du champs de saisie du montant d'aide au permis
  onShowDLPrice(event: any): void {
    if (event.value == 'Accordé') {
      this.showDLHelpPrice = true;
    } else {
      this.showDLHelpPrice = false;
    }
  }

  // mis à jour su status du contrat
  onUpdateStatus(): void {
    // recuperation des données du formulaire
    const formValue = this.statusForm.value;
    this.contratToUpdate.statut = formValue.libelle;

    this.entrepriseService.updateStatus(this.contratToUpdate)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Contrat alternance', detail: response.successMsg });
        this.showStatusForm = false;
        this.statusForm.reset();
        this.ngOnInit();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Contrat alternance', detail: error.errorMsg }) });
  }

  nettoyage() {
    this.entrepriseService.nettoyageCA().then(r => {
      this.ngOnInit()
      this.messageService.add({ severity: "success", summary: "Nettoyage des contracts avec succès", detail: `${r.n} contrats ont été supprimés.` })
    })
  }

  // méthode de selection du fichier
  onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      this.doc = event.target.files[0];
    }
  }

  // méthode d'ajout du cerfa
  onAddCerfa(): void {
    let formData = new FormData();
    formData.append('id', this.contratToUpdate._id);
    formData.append('file', this.doc);

    // envoi du document dans la base de données
    this.entrepriseService.uploadCerfa(formData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        this.showFormAddCerfa = false;
        this.ngOnInit();
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
  }

  // méthode d'ajout du la convention
  onAddConvention(): void {
    let formData = new FormData();
    formData.append('id', this.contratToUpdate._id);
    formData.append('file', this.doc);

    // envoi du document dans la base de données
    this.entrepriseService.uploadConvention(formData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        this.showFormAddConvention = false;
        this.ngOnInit();
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
  }

  // méthode d'ajout de l'accord de prise en charge
  onAddAccordPriseEnCharge(): void {
    let formData = new FormData();
    formData.append('id', this.contratToUpdate._id);
    formData.append('file', this.doc);

    // envoi du document dans la base de données
    this.entrepriseService.uploadAccordPriseEnCharge(formData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        this.showFormAddAccordPriseEnCharge = false;
        this.ngOnInit();
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
  }

  // méthode d'ajout du la résiliation du contrat
  onAddResiliation(): void {
    let formData = new FormData();
    formData.append('id', this.contratToUpdate._id);
    formData.append('file', this.doc);

    // envoi du document dans la base de données
    this.entrepriseService.uploadResiliation(formData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        this.showFormAddResiliation = false;
        this.ngOnInit();
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
  }

  // méthode d'ajout du la relance du contrat
  onAddRelance(): void {
    let formData = new FormData();
    formData.append('id', this.contratToUpdate._id);
    formData.append('file', this.doc);

    // envoi du document dans la base de données
    this.entrepriseService.uploadRelance(formData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        this.showFormAddRelance = false;
        this.ngOnInit();
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
  }

  // méthode d'ajout du livret d'apprentissage du contrat
  onAddLivret(): void {
    let formData = new FormData();
    formData.append('id', this.contratToUpdate._id);
    formData.append('file', this.doc);

    // envoi du livret d'apprentissage dans la base de données
    this.entrepriseService.uploadLivret(formData)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Document', detail: response.successMsg });
        this.showFormAddLivret = false;
        this.ngOnInit();
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Document', detail: error.error }); });
  }


  // méthode de téléchargement du calendrier de la formation
  onDownloadCalendar(id: string): void {
    this.classeService.downloadCalendar(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `calendrier.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Calendrier", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Calendrier", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement du cerfa
  onDownloadCerfa(id: string): void {
    this.entrepriseService.getCerfa(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `cerfa.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Cerfa", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Cerfa", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement de la convention
  onDownloadConvention(id: string): void {
    this.entrepriseService.getConvention(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `convention.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Convention", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Convention", detail: `Impossible de télécharger le fichier` }); });
  }

  // methode de téléchargement de l'accord de prise en charge
  onDownloadAccordPriseEnCharge(id: string): void {
    this.entrepriseService.getAccord(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `accord_prise_charge.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Accord de prise en charge", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Accord de prise en charge", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement de la résiliation
  onDownloadResiliation(id: string): void {
    this.entrepriseService.getResiliation(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `resiliation.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Resiliation", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Resiliation", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement de la rélance
  onDownloadRelance(id: string): void {
    this.entrepriseService.getRelance(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `relance.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Relance", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Relance", detail: `Impossible de télécharger le fichier` }); });
  }

  // méthode de téléchargement du livret d'apprentissage
  onDownloadLivret(id: string): void {
    this.entrepriseService.getLivret(id)
      .then((response: Blob) => {

        let filetype = '';
        if (response.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          filetype = 'docx';
        } else if (response.type === "application/msword") {
          filetype = 'doc';
        } else {
          filetype = 'undefined';
        }

        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `livret.${filetype}`);
        this.messageService.add({ severity: "success", summary: "Livret d'apprentissage", detail: "Téléchargement réussi" });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Livret d'apprentissage", detail: "Impossible de télécharger le télécharger le fichier" }); });
  }


  // méthodes pour compter le nombre de contrats filtrés par commercial
  onFilterByCommercial(event: any): void {
    // on vide le tableau avant de le remplir
    this.listeContratsFilteredByCommercial = [];
    // Parcourt la liste des contrats pour récupérer les contrats avec l'id du commercial filtré
    this.ListeContrats.forEach((contrat) => {
      let { code_commercial }: any = contrat;
      this.commercialFiltered = code_commercial;
      if (code_commercial._id == event.value) {
        this.listeContratsFilteredByCommercial.push(contrat);
      }
    });
    this.showFilterByCommercial = true;
  }

  // méthodes pour compter le nombre de contrats filtrés par commercial
  onFilterByCampus(event: any): void {
    console.log(event)
    // on vide le tableau avant de le remplir
    this.listeContratsFilteredByCampus = [];
    // Parcourt la liste des contrats pour récupérer les contrats avec l'id du commercial filtré
    this.ListeContrats.forEach((contrat) => {
      let { code_commercial }: any = contrat;
      this.campusFiltered = code_commercial;
      if (code_commercial._id == event.value) {
        this.listeContratsFilteredByCampus.push(contrat);
      }
    });
    this.showFilterByCampus = true;
  }

  onFilterByEcole(event) {

  }

  exportExcel() {
    let dataExcel = []
    //Clean the data
  
    this.ListeContrats.forEach(p => {
      let t = {}
      let buffer: any = p?.alternant_id;
      let bufferEcole: any = p?.ecole
      let bufferEntreprise: any = p?.entreprise_id
      let bufferCommercial: any = p?.code_commercial
      let bufferTuteur: any = p?.tuteur_id
      let bufferDirecteur: any = p?.directeur_id
      t['Nom'] = buffer?.user_id?.lastname 
      t['Prenom'] = buffer?.user_id?.firstname
      t['Statut'] = p?.statut
      t['Dernière date de changement du statut'] = p?.last_status_change_date
      t['Formation'] = p?.formation?.titre_long
      t['OPCO'] = bufferEntreprise?.OPCO
      t['Ecole'] = bufferEcole?.libelle
      t['Date du contrat'] = p?.debut_contrat 
      t['Horaire'] = p?.horaire
      t['Niveau de la formation'] = p?.niveau_formation
      t['Groupe'] = p?.formation
      t['Commercial'] = bufferCommercial?.firstname, bufferCommercial?.lastname
      t['Tuteur'] = bufferTuteur?.firstname 
      if (bufferTuteur == null && bufferDirecteur !== null) {
      t['Tuteur'] = bufferDirecteur?.firstname + " " + bufferDirecteur?.lastname
      }
      t['Année scolaire'] = ""
      p?.anne_scolaire.forEach(annee => {
        t['Année scolaire'] = t['Année scolaire'] + " " + annee
      })
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "contratAlternance" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");

  }
}
