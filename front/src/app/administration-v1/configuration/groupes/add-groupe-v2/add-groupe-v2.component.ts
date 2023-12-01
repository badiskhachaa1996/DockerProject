import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Groupe } from 'src/app/models/Groupe';
import { CampusRService } from 'src/app/services/administration/campus-r.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { GroupeService } from 'src/app/services/groupe.service';

@Component({
  selector: 'app-add-groupe-v2',
  templateUrl: './add-groupe-v2.component.html',
  styleUrls: ['./add-groupe-v2.component.scss']
})

export class AddGroupeV2Component implements OnInit {
  @Output() addGroupe = new EventEmitter<Groupe>()
  @Output() updateGroupe = new EventEmitter<Groupe>()
  @Input() isUpdate: Groupe;
  dropdownCampus = []
  dropdownEcole = []
  dropdownFormation = []
  formAddClasse = new UntypedFormGroup({
    campus_id: new FormControl('', Validators.required),
    ecole_id: new FormControl('', Validators.required),
    formation_id: new FormControl('', Validators.required),
    //annee: new FormControl(1, Validators.required),
    nom: new FormControl(''),
    abbrv: new FormControl('', Validators.required),
  })
  constructor(private GroupeService: GroupeService, private ToastService: MessageService, private FAService: FormulaireAdmissionService, private CampusService: CampusRService) { }

  ngOnInit(): void {
    if (this.isUpdate) this.formAddClasse.patchValue({ ...this.isUpdate })
    else this.formAddClasse.reset()

    this.CampusService.getAll().subscribe(campus => {
      campus.forEach(c => {
        this.dropdownCampus.push({ label: c.libelle, value: c._id })
      })
      if (this.isUpdate) this.formAddClasse.patchValue({ campus_id: this.isUpdate.campus_id._id })
      else this.formAddClasse.patchValue({ campus_id: this.dropdownCampus[0].value })
    })
    this.FAService.FAgetAll().subscribe(formations => {
      formations.forEach(f => {
        this.dropdownFormation.push({ label: f.nom, value: f._id })
      })
      if (this.isUpdate) this.formAddClasse.patchValue({ formation_id: this.isUpdate.formation_id._id })
      else this.formAddClasse.patchValue({ formation_id: this.dropdownFormation[0]._id })
    })
    this.FAService.EAgetAll().subscribe(ecoles => {
      ecoles.forEach(e => {
        this.dropdownEcole.push({ label: e.titre, value: e._id })
      })
      if (this.isUpdate) this.formAddClasse.patchValue({ ecole_id: this.isUpdate.ecole_id._id })
      else this.formAddClasse.patchValue({ ecole_id: this.dropdownEcole[0].value })
    })
  }

  saveClasse() {
    if (!this.isUpdate)
      this.GroupeService.create({ ...this.formAddClasse.value }).subscribe(g => {
        this.ToastService.add({ severity: 'success', summary: 'Création du groupe avec succès' })
        this.addGroupe.emit(g)
        this.formAddClasse.reset()
        this.formAddClasse.patchValue({ campus_id: this.dropdownCampus[0].value, ecole_id: this.dropdownEcole[0].value, formation_id: this.dropdownFormation[0]._id })
      }, err => {
        this.ToastService.add({ severity: 'error', summary: 'Une erreur est apparu', detail: err?.error })
        console.error(err)
      })
    else
      this.GroupeService.update({ ...this.formAddClasse.value, _id: this.isUpdate._id }).subscribe(g => {
        this.ToastService.add({ severity: 'success', summary: 'Mis à jour du groupe avec succès' })
        console.log(g)
        this.updateGroupe.emit(g)
        this.formAddClasse.reset()
        this.formAddClasse.patchValue({ campus_id: this.dropdownCampus[0].value, ecole_id: this.dropdownEcole[0].value, formation_id: this.dropdownFormation[0]._id })
      }, err => {
        this.ToastService.add({ severity: 'error', summary: 'Une erreur est apparu', detail: err?.error })
        console.error(err)
      })
  }

}
