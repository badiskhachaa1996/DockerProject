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
  selectedEcole: EcoleAdmission
  constructor(private FAService: FormulaireAdmissionService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.FAService.EAgetAll().subscribe(data => {
      this.ecoles = data
    })
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    titre: new FormControl('', Validators.required),
    adresse: new FormControl(''),
    email: new FormControl(''),
    site_web: new FormControl(''),
    url_form: new FormControl('', Validators.required),
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

  initFormations(rowData: EcoleAdmission){}

}
