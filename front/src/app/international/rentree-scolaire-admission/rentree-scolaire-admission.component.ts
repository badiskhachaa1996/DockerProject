import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, Form } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
import { RentreeAdmission } from 'src/app/models/RentreeAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-rentree-scolaire-admission',
  templateUrl: './rentree-scolaire-admission.component.html',
  styleUrls: ['./rentree-scolaire-admission.component.scss']
})
export class RentreeScolaireAdmissionComponent implements OnInit {

  rentrees: RentreeAdmission[] = []
  selectedRentree: RentreeAdmission
  constructor(private FAService: FormulaireAdmissionService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.FAService.RAgetAll().subscribe(data => {
      this.rentrees = data
    })
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(d => {
        this.ecolesList.push({ label: d.titre, value: d._id })
      })
    })
  }

  updateForm: UntypedFormGroup = new UntypedFormGroup({
    _id: new UntypedFormControl('', Validators.required),
    nom: new UntypedFormControl('', Validators.required),
    date_debut_inscription: new UntypedFormControl(''),
    date_fin_inscription: new UntypedFormControl(''),
    date_commencement: new UntypedFormControl(''),
  })

  initUpdate(rowData: RentreeAdmission) {
    this.selectedRentree = rowData

    this.updateForm.patchValue({ ...rowData })
  }

  onUpdate() {
    this.FAService.RAupdate({ ...this.updateForm.value }).subscribe(data => {
      this.rentrees.splice(this.rentrees.indexOf(this.selectedRentree), 1, data)
      this.selectedRentree = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de la rentrée ${data.nom} avec succès` })
    })
  }

  createForm: UntypedFormGroup = new UntypedFormGroup({
    nom: new UntypedFormControl('', Validators.required),
    date_debut_inscription: new UntypedFormControl(''),
    date_fin_inscription: new UntypedFormControl(''),
    date_commencement: new UntypedFormControl(''),
  })

  addForm = false

  initCreate() {
    this.addForm = true
  }

  onCreate() {
    this.FAService.RAcreate({ ...this.createForm.value }).subscribe(data => {
      this.rentrees.push(data)
      this.addForm = null
      this.createForm.reset()
      this.MessageService.add({ severity: "success", summary: `Ajout d'une nouvelle rentrée scolaire avec succès` })
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
    ecoles: new UntypedFormControl([])
  })

  affectedEcole: RentreeAdmission = null
  initEcoles(rowData: RentreeAdmission) {
    this.affectedEcole = rowData
    let listEcole = []
    rowData.ecoles.forEach(e => {
      listEcole.push(e._id)
    })
    this.affectedForm.patchValue({ _id: rowData._id, ecoles: listEcole })
  }

  onAffect() {
    this.FAService.RAupdate({ ...this.affectedForm.value }).subscribe(data => {
      this.rentrees.splice(this.rentrees.indexOf(this.affectedEcole), 1, data)
      this.affectedEcole = null
      this.affectedForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour des écoles de la rentrée scolaire ${data.nom} avec succès` })
    })
  }

  onDeleteRentreeScolaire(id: string): void 
  {
    this.FAService.RAdelete(id)
      .then((response) => {
        this.MessageService.add({severity: 'success', summary: 'Rentrée scolaire', detail: response.success});
        this.FAService.RAgetAll().subscribe(data => {
          this.rentrees = data
        })
      })
      .catch((error) => { console.error(error); this.MessageService.add({ severity: 'error', summary:'Rentrée scolaire', detail: error.error }); });
    }
  

  ecolesList: any[] = []


}
