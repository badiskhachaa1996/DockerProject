import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    date_debut_inscription: new FormControl(''),
    date_fin_inscription: new FormControl(''),
    date_commencement: new FormControl(''),
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

  createForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    date_debut_inscription: new FormControl(''),
    date_fin_inscription: new FormControl(''),
    date_commencement: new FormControl(''),
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


}
