import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureFormateur } from 'src/app/models/FactureFormateur';
import { FormateurService } from 'src/app/services/formateur.service';
import { SeanceService } from 'src/app/services/seance.service';

@Component({
  selector: 'app-facture-formateur',
  templateUrl: './facture-formateur.component.html',
  styleUrls: ['./facture-formateur.component.scss']
})
export class FactureFormateurComponent implements OnInit {

  showAddFacture = false
  formateurList = []
  seanceList = []
  factures = []
  formAddFacture: FormGroup = this.formBuilder.group({
    formateur_id: ['', Validators.required],
    seance_id: ['', Validators.required],
    file: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private FormateurService: FormateurService, private SeanceService: SeanceService) { }

  ngOnInit(): void {
    this.FormateurService.getAllPopulate().subscribe(r => {
      r.forEach(formateur => {
        let bypass: any = formateur.user_id
        if (bypass)
          this.formateurList.push({ value: bypass._id, label: bypass.lastname + " " + bypass.firstname })
      })
    })
  }

  filterSeanceByFormateur() {
    this.seanceList = []
    this.SeanceService.getAllbyFormateur(this.formAddFacture.value.formateur_id).subscribe(r => {
      r.forEach(seance => {
        let d = new Date(seance.date_debut)
        let hour = d.getHours()
        let minutes = d.getMinutes()
        let jour = d.getDate()
        let mois = d.getMonth() + 1
        let year = d.getFullYear().toString()?.substring(2)
        let date = jour + "/" + mois + "/" + year + " " + hour + "H" + minutes
        this.seanceList.push({ value: seance._id, label: seance.libelle + " " + date })
      })
    })
  }

  downloadFacture(facture: FactureFormateur) {

  }

  onAddFacture() {

  }

  FileUploadPC(event) {
    if (event && event.length > 0) {
      this.formAddFacture.patchValue({ file: event[0] })
    }
    console.log(event)
  }


  clickFile() {
    document.getElementById('selectedFile').click();
  }

}
