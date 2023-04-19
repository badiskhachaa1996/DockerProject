import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-formation-admission',
  templateUrl: './formation-admission.component.html',
  styleUrls: ['./formation-admission.component.scss']
})
export class FormationAdmissionComponent implements OnInit {

  formations: FormationAdmission[] = []
  selectedFormation: FormationAdmission
  constructor(private FAService: FormulaireAdmissionService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.FAService.FAgetAll().subscribe(data => {
      this.formations = data
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
    langue: new FormControl(''),
    deroulement: new FormControl(''),
  })

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

  createForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    niveau: new FormControl(''),
    rncp: new FormControl(''),
    certificateur: new FormControl(''),
    duree: new FormControl(''),
    description: new FormControl(''),
    criteres: new FormControl(''),
    tarif: new FormControl(''),
    langue: new FormControl(''),
    deroulement: new FormControl(''),
  })

  addForm = false

  initCreate() {
    this.addForm = true
  }

  onCreate() {
    this.FAService.FAcreate({ ...this.createForm.value }).subscribe(data => {
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
}
