import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-ecole-admission',
  templateUrl: './ecole-admission.component.html',
  styleUrls: ['./ecole-admission.component.scss']
})
export class EcoleAdmissionComponent implements OnInit {

  ecoles: EcoleAdmission[] = []
  langueList = [
    { label: 'Français', value: 'Français' },
    { label: 'English', value: 'English' },
  ]
  selectedEcole: EcoleAdmission
  constructor(private FAService: FormulaireAdmissionService, private MessageService: MessageService) { }
  campusList = [
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Congo Brazzaville', value: 'Congo Brazzaville' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Malte', value: 'Malte' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'En ligne', value: 'En ligne' }
  ]
  ngOnInit(): void {
    this.FAService.EAgetAll().subscribe(data => {
      console.log(data)
      this.ecoles = data
    })
    this.FAService.FAgetAll().subscribe(data => {
      this.formationsList = data
    })
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    titre: new FormControl('', Validators.required),
    adresse: new FormControl(''),
    email: new FormControl(''),
    site_web: new FormControl(''),
    url_form: new FormControl('', Validators.required),
    campus: new FormControl([], Validators.required),
    langue: new FormControl('Français')
  })

  initUpdate(rowData: EcoleAdmission) {
    this.selectedEcole = rowData
    this.updateForm.patchValue({ ...rowData })
  }

  onUpdate() {
    this.FAService.EAupdate({ ...this.updateForm.value }).subscribe(data => {
      this.ecoles.splice(this.ecoles.indexOf(this.selectedEcole), 1, data)
      this.selectedEcole = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de l'école ${data.titre} avec succès` })
    })
  }

  createForm: FormGroup = new FormGroup({
    titre: new FormControl('', Validators.required),
    adresse: new FormControl(''),
    email: new FormControl(''),
    site_web: new FormControl(''),
    url_form: new FormControl('', Validators.required),
    campus: new FormControl([], Validators.required),
    langue: new FormControl('Français')
  })

  addForm = false

  initCreate() {
    this.addForm = true
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

  affectedForm: FormGroup = new FormGroup({
    _id: new FormControl(),
    formations: new FormControl()
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

  formationsList = []

}
