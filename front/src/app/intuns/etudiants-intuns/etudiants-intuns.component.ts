import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EtudiantIntuns } from 'src/app/models/intuns/EtudiantIntuns';
import { EtudiantsIntunsService } from 'src/app/services/intuns/etudiants-intuns.service';

@Component({
  selector: 'app-etudiants-intuns',
  templateUrl: './etudiants-intuns.component.html',
  styleUrls: ['./etudiants-intuns.component.scss']
})
export class EtudiantsIntunsComponent implements OnInit {
  etudiants: EtudiantIntuns[]
  selectedEtudiant: EtudiantIntuns
  formationsList = []
  constructor(private EtudiantIntunsService: EtudiantsIntunsService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.EtudiantIntunsService.EIgetAll().subscribe(data => {
      this.etudiants = data
    })
    this.EtudiantIntunsService.FIgetAll().subscribe(data => {
      data.forEach(f => {
        this.formationsList.push({ label: f.title, value: f._id })
      })
    })
  }

  updateForm: UntypedFormGroup = new UntypedFormGroup({
    _id: new UntypedFormControl('', Validators.required),
    formation_id: new UntypedFormControl('', Validators.required)
  })

  initUpdate(etudiant) {
    this.selectedEtudiant = etudiant
    this.updateForm.patchValue({ ...etudiant })
  }

  onUpdate() {
    this.EtudiantIntunsService.EIupdate({ ...this.updateForm.value }).subscribe(data => {
      this.etudiants.splice(this.etudiants.indexOf(this.selectedEtudiant), 1, data)
      this.selectedEtudiant = null
      this.MessageService.add({severity:"success",summary:`Mis à jour de la formation de ${data.user_id.lastname} ${data.user_id.firstname} avec succès`})
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
