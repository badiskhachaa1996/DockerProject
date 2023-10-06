import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { log } from 'console';
import { MessageService } from 'primeng/api';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { Campus } from 'src/app/models/Campus';
import { CampusService } from 'src/app/services/campus.service';
import { RentreeAdmission } from 'src/app/models/RentreeAdmission';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formation-admission',
  templateUrl: './formation-admission.component.html',
  styleUrls: ['./formation-admission.component.scss']
})
export class FormationAdmissionComponent implements OnInit {
  seeAction = true
  formations: FormationAdmission[] = []
  selectedFormation: FormationAdmission
  dropdownCampus= [
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Congo Brazzaville', value: 'Congo Brazzaville' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Malte', value: 'Malte' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'UK', value: 'UK' },
    { label: 'Marne', value: 'Marne' },
    { label: 'En ligne', value: 'En ligne' }
  ]
  rentreeScolaire = []
  showFormRentreeScolaire: boolean = false
  campusFilter: string | null = null;
  Filtercompuse =
    [
      { label: "Tous les campus", value: null },
      ...this.dropdownCampus
    ]
  bacList =
    [
      { label: "Bac +2", value: "Bac +2" },
      { label: "Bac +3", value: "Bac +3" },
      { label: "Bac +4", value: "Bac +4" },
      { label: "Bac +5", value: "Bac +5" }
    ]

  bacFilter =
    [
      { label: "Tous les bac", value: null },
      ...this.bacList
    ]

  anneesList =
    [
      { label: "Année 1", value: "Année 1" },
      { label: "Année 2", value: "Année 2" },
      { label: "Année 3", value: "Année 3" },
      { label: "Année 4", value: "Année 4" },
      { label: "Année 5", value: "Année 5" },
    ]

  anneeFilter =
    [
      { label: "Toutes les années", value: null },
      ...this.anneesList
    ]
  constructor(private FAService: FormulaireAdmissionService, private RAService: FormulaireAdmissionService,
    private MessageService: MessageService, private CampusService: CampusService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.FAService.FAgetAll().subscribe(data => {
      
      this.formations = data
    })

   

    // permet de récupérer la liste des rentrées scolaire
    this.RAService.RAgetAll().subscribe(rentrees => {
      rentrees.forEach(rentree => {
        this.rentreeScolaire.push({ label: rentree.nom, value: rentree._id })
      })
    })
    this.route.url.subscribe(r => {
      this.seeAction = !(r[0].path == "informations")
    })
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    niveau: new FormControl(''),
    rncp: new FormControl(''),
    certificateur: new FormControl(''),
    duree: new FormControl(''),
    description: new FormControl(''),
    criteres: new FormControl(''),
    tarif: new FormControl(''),
    langue: new FormControl([], Validators.required),
    deroulement: new FormControl(''),
    filiere: new FormControl(''),
    bac: new FormControl(''),
    code: new FormControl(''),
    annee: new FormControl(''),
    code_france_competence: new FormControl(''),
    validite: new FormControl(''),
    organisme_referent: new FormControl(''),
    campus: new FormControl(''),
    annee_scolaire: new FormControl(''),
    date_debut: new FormControl(''),
    date_fin: new FormControl(''),
    nb_heures: new FormControl(''),
    rythme: new FormControl(''),
    calendrier: new FormControl(''),
    examens: new FormControl(''),
    note: new FormControl(''),
  })

  filiereList = [
    { value: "Informatique", label: "Informatique" },
    { value: "Commerce et Marketing", label: "Commerce et Marketing" },
    { value: "Comptabilité Gestion et Finance", label: "Comptabilité Gestion et Finance" },
    { value: "Ressources Humaines", label: "Ressources Humaines" },
    { value: "BIM", label: "BIM" },
    { value: "Programme anglais", label: "Programme anglais" },
    { value: "Logistique", label: "Logistique" },
    { value: "Hôtellerie", label: "Hôtellerie" },
    { value: "Médical", label: "Médical" },
    { value: "Service à la personne", label: "Service à la personne" },
    { value: "Petite enfance", label: "Petite enfance" },
  ]

  anneeList =
    [
      { label: "Année 1", value: "Anneé 1" },
      { label: "Année 2", value: "Anneé 2" },
      { label: "Année 3", value: "Anneé 3" },
      { label: "Année 4", value: "Anneé 4" },
      { label: "Année 5", value: "Anneé 5" },
    ];

  initUpdate(rowData: FormationAdmission) {
    this.selectedFormation = rowData
    this.updateForm.patchValue({ ...rowData })
  }

  onUpdate() {
    this.FAService.FAupdate({ ...this.updateForm.value }).subscribe(data => {
      this.formations.splice(this.formations.indexOf(this.selectedFormation), 1, data)
      this.selectedFormation = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de la formation ${data.nom} avec succès` })
    })
  }

  onBlur(formation: FormationAdmission) {
    this.FAService.FAupdate({ ...formation }).subscribe(data => {
    })
  }

  onDeleteRentreeScolaire(id: string): void {
    this.FAService.RAdelete(id)
      .then((response) => {
        this.FAService.RAgetAll().subscribe(data => {
          this.rentreeScolaire = data
        })
      })
  }

  onAddRentreeScolaire() {
    if (this.formations == null) {
      this.formations = []
    }
    this.formations.push({ campus: "", annee_scolaire: "", date_debut: "", date_fin: "", nb_heures: "", rythme: "", calendrier: "", examens: "" })

  }

  onCreateRA() {
    this.FAService.RAcreate({ ...this.createFormRA.value }).subscribe(data => {
      console.log(data)
    })
  }

  createFormRA: FormGroup = new FormGroup({
    campus: new FormControl(''),
    annee_scolaire: new FormControl(''),
    date_debut: new FormControl(''),
    date_fin: new FormControl(''),
    nb_heures: new FormControl(''),
    rythme: new FormControl(''),
    calendrier: new FormControl(''),
    examens: new FormControl(''),
    note: new FormControl(''),
  })

  createForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    niveau: new FormControl(''),
    rncp: new FormControl(''),
    certificateur: new FormControl(''),
    duree: new FormControl(''),
    description: new FormControl(''),
    criteres: new FormControl(''),
    tarif: new FormControl(''),
    langue: new FormControl([], Validators.required),
    deroulement: new FormControl(''),
    filiere: new FormControl(''),
    bac: new FormControl(''),
    campus: new FormControl(''),
    code: new FormControl(''),
    annee: new FormControl(''),
    code_france_competence: new FormControl(''),
    validite: new FormControl(''),
    organisme_referent: new FormControl(''),
  })

  addForm = false

  initCreate() {
    this.addForm = true
  }

  onCreate() {
    this.FAService.FAcreate({ ...this.createForm.value }).subscribe(data => {
      console.log(data)
      this.formations.push(data)
      this.addForm = null
      this.createForm.reset()
      this.MessageService.add({ severity: "success", summary: `Ajout d'une nouvelle formation avec succès` })
    })
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  delete(rowData: FormationAdmission) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?"))
      this.FAService.FAdelete(rowData._id).subscribe(data => {
        this.formations.splice(this.formations.indexOf(rowData), 1)
        this.MessageService.add({ severity: "success", summary: `Suppression de la formation avec succès` })
      })
  }

  deroulementList = [
    { label: "En ligne", value: "En ligne" },
    { label: "Présentiel", value: "Présentiel" },
    { label: "Hybride", value: "Hybride" },
  ]

  languesList = [
    { label: "Français", value: "Programme Français" },
    { label: "Anglais", value: "Programme Anglais" },
  ]
  formationSelected;
  showDescriptionBool = false
  showDescription(formation: FormationAdmission) {
    this.formationSelected = formation,
      this.showDescriptionBool = true
  }

}
