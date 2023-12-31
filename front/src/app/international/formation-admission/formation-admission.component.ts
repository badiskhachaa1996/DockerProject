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
  rentres:RentreeAdmission[] = [];
  rentresList:[] = [];
  formationtoShow:FormationAdmission;
  selectedFormation: FormationAdmission;
  rentreeAdmissionList :any;
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
      { label: "BAC +2", value: "BAC +2" },
      { label: "BAC +3", value: "BAC +3" },
      { label: "BAC +4", value: "BAC +4" },
      { label: "BAC +5", value: "BAC +5" }
    ]

  bacFilter =
    [
      { label: "Tous les BAC", value: null },
      ...this.bacList
    ]

  anneesList =
    [
      { label: "Année 1", value: "Année 1" },
      { label: "Année 2", value: "Année 2" },

    ]
    filiereList = [
      { value: "Informatique", label: "Informatique" },
      { value: "Commerce", label: "Commerce" },
      { value: "Communication", label: "Communication" },
      { value: "Comptabilité", label: "Comptabilité" },
      { value: "Ressources Humaines", label: "Ressources Humaines" },
      { value: "Bâtiment BIM", label: "Bâtiment BIM" },
      { value: "Programme anglais", label: "Programme anglais" },
      { value: "Logistique", label: "Logistique" },
      { value: "Hôtellerie", label: "Hôtellerie" },
      { value: "Médical", label: "Médical" },
      { value: "Service aux particuliers", label: "Service aux particuliers" },
      { value: "Petite enfance", label: "Petite enfance" },
      
    ]
  
  anneeFilter =
    [
      { label: "Toutes les filières", value: null },
      ...this.filiereList
    ]
  constructor(private FAService: FormulaireAdmissionService, private RAService: FormulaireAdmissionService,
    private MessageService: MessageService, private CampusService: CampusService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.FAService.FAgetAll().subscribe(data => {
      
      this.formations = data
      this.formations.sort((a, b) => {
      if (a.filiere < b.filiere) return -1;
      if (a.filiere > b.filiere) return 1;
      return 0;
    });
    })
    this.FAService.RAgetAll().subscribe(data1 =>{
      
      this.rentres=data1;
      console.log(data1);
    }
      );
      

   

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

 
  anneeList =
    [
      { label: "Année 1", value: "Anneé 1" },
      { label: "Année 2", value: "Anneé 2" },

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

  onDeleteRentreeScolaire(id: number): void {
    this.formationtoShow.rentree.splice(id, 1);
    this.FAService.FAupdate(this.formationtoShow)
      .subscribe((response) => {
        this.FAService.RAgetAll().subscribe(data => {
          this.rentreeScolaire = data
        })
      })
  }

  onAddRentreeScolaire() {
  
    
    this.formationtoShow.rentree.push({ campus: "", annee_scolaire: "", date_debut: "", date_fin: "", nb_heures: "", rythme: "", calendrier: "", examens: "" })

  }

  onCreateRA() {
  
  this.FAService.FAupdate(this.formationtoShow).subscribe(data => {
    console.log(data)
  })
    this.FAService.RAcreate({ ...this.createFormRA.value }).subscribe(data => {
      console.log(data)
    })
  }
  rScolaire(formation:FormationAdmission){
    this.showFormRentreeScolaire = true;
    this.formationtoShow=formation;

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
