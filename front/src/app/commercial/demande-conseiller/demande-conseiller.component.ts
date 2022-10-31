import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DemandeConseiller } from 'src/app/models/DemandeConseiller';
import { DemandeConseillerService } from 'src/app/services/commercial/demande-conseiller.service';
import { TeamCommercialService } from 'src/app/services/team-commercial.service';

@Component({
  selector: 'app-demande-conseiller',
  templateUrl: './demande-conseiller.component.html',
  styleUrls: ['./demande-conseiller.component.scss']
})
export class DemandeConseillerComponent implements OnInit {
  demandes: DemandeConseiller[] = []
  seeAffectation: DemandeConseiller = null
  listConseiller: any[] = []
  constructor(public DCService: DemandeConseillerService, public messageService: MessageService, public TCService: TeamCommercialService) { }

  ngOnInit(): void {
    this.DCService.getAll().subscribe(dcs=>{
      this.demandes=dcs
    })
    this.TCService.getAllCommercial().subscribe(u => {
      u.forEach(user => {
        this.listConseiller.push({ label: user.lastname + " " + user.firstname, value: user._id })
      })
    })
  }

  accepted(rowData: DemandeConseiller) {
    this.DCService.Update(rowData).subscribe(d => {
      this.demandes.splice(this.demandes.indexOf(rowData), 1)
      this.messageService.add({ severity: 'success', summary: 'Suppression avec succès' })
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Une erreur est arrivé', detail: err.error })
    })
  }

  demandeConseillerForm: FormGroup = new FormGroup({
    conseiller_id: new FormControl('', Validators.required)
  })

  affected() {
    this.DCService.Update({
      _id: this.seeAffectation._id,
      student_id: this.seeAffectation.student_id,
      conseiller_id: this.demandeConseillerForm.value.conseiller_id,
      archived: false,
      activated: true
    }).subscribe(dc => {
      this.demandes.splice(this.demandes.indexOf(this.seeAffectation), 1, dc)
      this.messageService.add({ severity: 'success', summary: 'Demande de conseillé envoyé' })
    }, err => {
      console.error(err)
      this.messageService.add({ severity: 'error', summary: 'Erreur lors de la demande de conseillé' })
    })
  }

  deleted(rowData: DemandeConseiller) {
    this.DCService.delete(rowData._id).subscribe(d => {
      this.demandes.splice(this.demandes.indexOf(rowData), 1)
      this.messageService.add({ severity: 'success', summary: 'Suppression avec succès' })
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Une erreur est arrivé', detail: err.error })
    })
  }

}
