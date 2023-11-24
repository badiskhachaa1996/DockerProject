import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DemandeConseiller } from 'src/app/models/DemandeConseiller';
import { teamCommercial } from 'src/app/models/teamCommercial';
import { DemandeConseillerService } from 'src/app/services/commercial/demande-conseiller.service';
import { TeamCommercialService } from 'src/app/services/team-commercial.service';

@Component({
  selector: 'app-detail-equipe',
  templateUrl: './detail-equipe.component.html',
  styleUrls: ['./detail-equipe.component.scss']
})
export class DetailEquipeComponent implements OnInit {

  team: teamCommercial;
  seeAffectation: DemandeConseiller = null
  affectationList: DemandeConseiller[]
  showFormAddDemande = false

  demandeConseillerForm: FormGroup = new FormGroup({
    conseiller_id: new FormControl('', Validators.required)
  })

  constructor(private messageService: MessageService, private activatedRoute: ActivatedRoute, private TCService: TeamCommercialService, private DCService: DemandeConseillerService) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params.equipe_id) {
      this.TCService.getByID(this.activatedRoute.snapshot.params.equipe_id).subscribe(t => {
        this.team = t
      })
      this.DCService.getAllByTeamCommercialID(this.activatedRoute.snapshot.params.equipe_id).subscribe(dcs => {
        this.affectationList = dcs
      })
    }
  }

  affected() {
    let bypass: any = this.seeAffectation.student_id._id
    this.DCService.update({
      _id: this.seeAffectation._id,
      student_id: bypass,
      conseiller_id: this.demandeConseillerForm.value.conseiller_id,
      archived: false,
      activated: true
    }).subscribe(dc => {
      this.affectationList.splice(this.affectationList.indexOf(this.seeAffectation), 1, dc)
      this.messageService.add({ severity: 'success', summary: 'L\'affectation a été realisé avec succès' })
      this.seeAffectation = null
    }, err => {
      console.error(err)
      this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'affectation' })
    })
  }

}
