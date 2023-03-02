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


@Component({
  selector: 'app-liste-contrats',
  templateUrl: './liste-contrats.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./liste-contrats.component.scss']
})
export class ListeContratsComponent implements OnInit {

  token;
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
  formationList = []
  RegisterNewCA: FormGroup;
  idTuteur = this.route.snapshot.paramMap.get('idTuteur');
  ParmTuteur = this.route.snapshot.paramMap.get('idTuteur');
  formAddNewCA: boolean = false;
  ConnectedEntreprise: any;
  EntrepriseList = [];
  TuteursList = [];
  dropdownTuteurList = []
  ListCommercial = [];

  dropDownCommecialList = [];
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
    { value: null, label: "Tous les commerciaux" }
  ];

  filtreCampus = [
    { value: null, label: "Tous les campus" }
  ];

  mobiliteOptions: any = [
    { name: 'Non', value: 0 },
    { name: 'Oui', value: 1 },
  ];

  showCout: boolean = false;
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
  ];


  constructor(private entrepriseService: EntrepriseService, private route: ActivatedRoute,
    private messageService: MessageService, private router: Router, private etudiantService: EtudiantService,
    private authService: AuthService, private tuteurService: TuteurService,
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
    this.campusService.getAll().subscribe(campus => {
      campus.forEach(c => {
        this.filtreCampus.push({ label: c.libelle, value: c._id })
      })
    })

    //Lister toutes les formations
    this.formationService.getAll().subscribe(data => {

      data.forEach(element => {
        this.formationList.push({ label: element.titre, value: element._id });
      });
      this.onInitFormUpdateCa();
      this.onInitRegisterNewCA();
    })

    //Lister toutes les entreprises 
    this.entrepriseService.getAll().subscribe(listEntre => {
      this.EntrepriseList = [];
      listEntre.forEach(ent => {
        this.EntrepriseList.push({ label: ent.r_sociale, value: ent._id })
      })
      // Lister tous les étudiants alternants
      this.etudiantService.getAllAlternants().subscribe(alternantsData => {
        this.listAlternantDD = []
        alternantsData.forEach(altdata => {
          //ajouter l'attribut nom complet aux objets etudiants pour les afficher
          if (altdata.user_id) {
            altdata.nomcomplet = altdata.user_id?.firstname + ' ' + altdata.user_id?.lastname
            this.listAlternantDD.push({ label: altdata.nomcomplet, value: altdata._id })
          }
        })
      })

      this.EcoleService.getAll().subscribe(data => {
        data.forEach(e => {
          this.dropdownCFA.push({ value: e._id, label: e.libelle })
        })
      })


      // LISTE A AFFICHER POUR LADMIN
      if (this.token.role == "Admin") {
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
      this.authService.getAllCommercial().subscribe(CommercialData => {

        this.ListCommercial = CommercialData
        this.ListCommercial.forEach(comData => {
          comData.nomComplet = comData.firstname + " " + comData.lastname;
          this.dropDownCommecialList.push({ label: comData.nomComplet, value: comData._id })
        })
      })
    })

    // initialisation du formulaire de mise à jour du status
    this.statusForm = this.formBuilder.group({
      libelle: ['', Validators.required]
    });
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
      code_commercial: new FormControl('', Validators.required),
      professionnalisation: new FormControl(''),
      anne_scolaire: new FormControl(),
      ecole: new FormControl('', Validators.required),
      cout_mobilite: new FormControl(''),
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
      cout_mobilite: new FormControl(''),
    })
  }


  loadTuteur(idENT, idTuteur = null) {
    this.dropdownTuteurList = []

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
              if (idTuteur && idTuteur == tut._id) {
                this.formUpdateCa.patchValue({ tuteur_id: idTuteur, entreprise_id: idENT })
              }

            })

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

    let CA_Object = new ContratAlternance(null, this.debut_contrat.value, this.fin_contrat.value, this.horaire, this.alternant, this.intitule, this.classification, this.niv, this.coeff_hier, this.form, this.tuteur_id, '', this.RegisterNewCA.get('entreprise_id').value, this.code_commercial, 'créé', annee_scolaires, this.RegisterNewCA.value.ecole, this.RegisterNewCA.get('cout_mobilite')?.value)

    this.entrepriseService.createContratAlternance(CA_Object).subscribe(
      resData => {
        this.messageService.add({ severity: 'success', summary: 'Le contrat alternance', detail: " a été créé avec Succés" });
        this.formAddNewCA = false
        this.ngOnInit()

      }, (error => { console.error(error) }))
  }


  //Mise à jour d'un contrat d'alternance
  onUpdateCa() {
    let annee_scolaires = [];

    this.formUpdateCa.get('anne_scolaire')?.value.forEach((annee) => {
      annee_scolaires.push(annee.label);
    });

    let CA_Object = new ContratAlternance(this.contratToUpdate._id, this.debut_contrat_m.value, this.fin_contrat_m.value, this.horaire_m, this.alternant_m, this.intitule_m, this.classification_m, this.niv_m, this.coeff_hier_m, this.form_m, this.tuteur_id_m, '', this.formUpdateCa.get('entreprise_id').value, this.code_commercial_m, 'créé',
      annee_scolaires, this.formUpdateCa.value.ecole, this.formUpdateCa.get('cout_mobilite')?.value)

    this.entrepriseService.updateContratAlternance(CA_Object).subscribe(resData => {
      this.messageService.add({ severity: 'success', summary: 'Le contrat alternance', detail: " a été mis à jour avec succés" });
      this.showFormUpdateCa = false
      this.ngOnInit()

    }, (error => { console.error(error) }))
  }



  //Methode pour preparer le formulaire de modification d'un contrat
  onFillFormUpdate(contrat: ContratAlternance) {
    this.contratToUpdate = contrat;
    // this.loadTuteur(contrat.tuteur_id.entreprise_id, contrat.tuteur_id._id)
    let bypass_alternant: any = contrat.alternant_id
    let bypass_formation: any = contrat.formation
    let bypass_commercial: any = contrat.code_commercial
    this.formUpdateCa.patchValue({
      // entreprise_id: contrat.tuteur_id.entreprise_id,
      // tuteur_id: contrat.tuteur_id._id,
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
      if (!code_commercial.includes(cc._id)) {
        code_commercial.push(cc._id)
        this.filtreAgent.push({ label: cc.firstname + " " + cc.lastname, value: cc._id })
      }
    })
  }

  // methoe d'affichage du cout
  onShowCout(event: any): void {
    if (event.value.value == 0) {
      this.showCout = false;
    } else {
      this.showCout = true;
    }
  }

  // mis à jour su status du contrat
  onUpdateStatus(): void {
    // recuperation des donées du formulaire
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

}
