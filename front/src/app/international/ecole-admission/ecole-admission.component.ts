import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-ecole-admission',
  templateUrl: './ecole-admission.component.html',
  styleUrls: ['./ecole-admission.component.scss']
})
export class EcoleAdmissionComponent implements OnInit {
  seeAction = true
  ecoles: EcoleAdmission[] = []
  langueList = [
    { label: 'Français', value: 'Français' },
    { label: 'English', value: 'English' },
  ]
  selectedEcole: EcoleAdmission
  constructor(private FAService: FormulaireAdmissionService, private MessageService: MessageService, private route: ActivatedRoute) { }
  campusList = [
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
  dropdownCampus= [
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Marne', value: 'Marne' },
    { label: 'En ligne', value: 'En ligne' }
  ]
  campusFilter = [
    { label: 'Tous les campus', value: null },
    ...this.campusList
  ]
  ngOnInit(): void {
    this.FAService.EAgetAll().subscribe(data => {
      this.ecoles = data
    })
    this.FAService.FAgetAll().subscribe(data => {
      this.formationsList = data
    })
    this.route.url.subscribe(r => {
      this.seeAction = !(r[0].path == "informations")
    })

  }

  updateForm: UntypedFormGroup = new UntypedFormGroup({
    _id: new UntypedFormControl('', Validators.required),
    titre: new UntypedFormControl('', Validators.required),
    adresse: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    site_web: new UntypedFormControl(''),
    url_form: new UntypedFormControl('', Validators.required),
    campus: new UntypedFormControl([], Validators.required),
    NDA:new UntypedFormControl(''),
    UAI:new UntypedFormControl(''),
    langue: new UntypedFormControl('Français')
  })

  initUpdate(rowData: EcoleAdmission) {
    this.selectedEcole = rowData
    this.updateForm.patchValue({ ...rowData })
  }
  onAddRentreeScolaire() {
  
    
    this.selectedEcole.campusinfo.push({ campus: "", adresse: "", UAI: "" })

  }

  onUpdate() {
    this.FAService.EAupdate({ ...this.updateForm.value }).subscribe(data => {
      this.ecoles.splice(this.ecoles.indexOf(this.selectedEcole), 1, data)
      this.selectedEcole = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de l'école ${data.titre} avec succès` })
    })
  }

  createForm: UntypedFormGroup = new UntypedFormGroup({
    titre: new UntypedFormControl('', Validators.required),
    adresse: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    site_web: new UntypedFormControl(''),
    url_form: new UntypedFormControl('', Validators.required),
    campus: new UntypedFormControl([], Validators.required),
    NDA:new UntypedFormControl(''),
    UAI:new UntypedFormControl(''),
    langue: new UntypedFormControl('Français')
  })

  addForm = false

  
  
  initCreate() {
    this.addForm = true
  }
  createFormRA: UntypedFormGroup = new UntypedFormGroup({
    campus: new UntypedFormControl(''),
    annee: new UntypedFormControl(''),
    UAI: new UntypedFormControl(''),
  })
  onCreateRA() {
    
   
    if(this.createFormRA.value.campus.length > 3){
      this.selectedEcole.campus=this.createFormRA.value.campus;
    this.selectedEcole.campus.push(this.createFormRA.value.campus)}
  this.FAService.EAupdate(this.selectedEcole).subscribe(data => {
    console.log(data)
  })
    
  }
  onDeleteRentreeScolaire(id: number): void {
    console.log("*********************");
    this.selectedEcole.campusinfo.splice(id, 1);
    this.FAService.EAupdate(this.selectedEcole);
      
  }

  onCreate() {
    this.FAService.EAcreate({ ...this.createForm.value }).subscribe(data => {
      this.ecoles.push(data)
      this.addForm = null
      this.createForm.reset()
      this.MessageService.add({ severity: "success", summary: `Ajout d'une nouvelle école avec succès` })
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

  affectedForm: UntypedFormGroup = new UntypedFormGroup({
    _id: new UntypedFormControl(),
    formations: new UntypedFormControl()
  })

  affectedFormations: EcoleAdmission = null

  initFormations(rowData: EcoleAdmission) {
    this.affectedFormations = rowData
    this.affectedForm.patchValue({ ...rowData })
  }

  onAffect() {
    this.FAService.EAupdate({ ...this.affectedForm.value }).subscribe(data => {
      this.ecoles.splice(this.ecoles.indexOf(this.affectedFormations), 1, data)
      this.affectedFormations = null
      this.affectedForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour des formations de l'école ${data.titre} avec succès` })
    })
  }

  onDeleteEcole(id: string): void {
    this.FAService.EAdelete(id)
      .then((response) => {
        this.MessageService.add({ severity: 'success', summary: 'École', detail: response.success });
        this.FAService.EAgetAll().subscribe(data => {
          this.ecoles = data
        })
      })
      .catch((error) => { console.error(error); this.MessageService.add({ severity: 'error', summary: 'École', detail: error.error }); });
  }


  formationsList = []
  showSideBar = false
  selectedEcoleDetails: EcoleAdmission
  showDetails(data: EcoleAdmission) {
    this.selectedEcoleDetails = data
    this.showSideBar = true
    console.log(data)
  }

  convertAdresse(adresse: string) {
    while (adresse.indexOf('\n') != -1)
      adresse = adresse.replace('\n', '<br>')
    return adresse
  }
}
