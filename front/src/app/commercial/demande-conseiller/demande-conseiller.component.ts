import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  constructor(public DCService: DemandeConseillerService, public messageService: MessageService, public TCService: TeamCommercialService, private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (!this.activatedRoute.snapshot.params.equipe_id)
      this.DCService.getAll().subscribe(dcs => {
        this.demandes = dcs
      })
    else
      this.DCService.getAllWaitingByTeamCommercialID(this.activatedRoute.snapshot.params.equipe_id).subscribe(dcs => {
        this.demandes = dcs
      })
    this.TCService.getAllCommercial().subscribe(u => {
      u.forEach(user => {
        this.listConseiller.push({ label: user.lastname + " " + user.firstname, value: user._id })
      })
    })
  }

  accepted(rowData: DemandeConseiller) {
    rowData.activated = true
    this.DCService.update(rowData).subscribe(d => {
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
    let bypass: any = this.seeAffectation.student_id._id
    this.DCService.update({
      _id: this.seeAffectation._id,
      student_id: bypass,
      conseiller_id: this.demandeConseillerForm.value.conseiller_id,
      archived: false,
      activated: true
    }).subscribe(dc => {
      this.demandes.splice(this.demandes.indexOf(this.seeAffectation), 1)
      this.messageService.add({ severity: 'success', summary: 'L\'affectation a été realisé avec succès' })
      this.seeAffectation = null
    }, err => {
      console.error(err)
      this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'affectation' })
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
