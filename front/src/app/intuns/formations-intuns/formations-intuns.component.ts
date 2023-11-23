import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormationsIntuns } from 'src/app/models/intuns/formationsIntuns';
import { EtudiantsIntunsService } from 'src/app/services/intuns/etudiants-intuns.service';

@Component({
  selector: 'app-formations-intuns',
  templateUrl: './formations-intuns.component.html',
  styleUrls: ['./formations-intuns.component.scss']
})
export class FormationsIntunsComponent implements OnInit {
  formations: FormationsIntuns[]
  showCreateForm = false
  selectedFormation: FormationsIntuns
  constructor(private EtudiantIntunsService: EtudiantsIntunsService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.EtudiantIntunsService.FIgetAll().subscribe(data => {
      this.formations = data
    })
  }

  updateForm: UntypedFormGroup = new UntypedFormGroup({
    _id: new UntypedFormControl('', Validators.required),
    title: new UntypedFormControl('', Validators.required),
    linkedin: new UntypedFormControl('')
  })

  createForm: UntypedFormGroup = new UntypedFormGroup({
    title: new UntypedFormControl('', Validators.required),
    linkedin: new UntypedFormControl('')
  })

  initCreate() {
    this.showCreateForm = true
  }

  onCreate() {
    this.EtudiantIntunsService.FIcreate({ ...this.createForm.value }).subscribe(data => {
      this.formations.push(data)
      this.createForm.reset()
      this.showCreateForm = false
      this.MessageService.add({ severity: "success", summary: `Ajout de la filière avec succès` })
    })
  }

  initUpdate(formation) {
    this.selectedFormation = formation
    this.updateForm.patchValue({ ...formation })
  }
  onUpdate() {
    this.EtudiantIntunsService.FIupdate({ ...this.updateForm.value }).subscribe(data => {
      this.formations.splice(this.formations.indexOf(this.selectedFormation), 1, data)
      this.selectedFormation = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de la filière avec succès` })
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
