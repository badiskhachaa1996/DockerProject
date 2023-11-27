import { Component, OnInit } from '@angular/core';
import { Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
import jwt_decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { AdmissionService } from 'src/app/services/admission.service';
import { Prospect } from 'src/app/models/Prospect';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-lead-evaluation',
  templateUrl: './lead-evaluation.component.html',
  styleUrls: ['./lead-evaluation.component.scss']
})
export class LeadEvaluationComponent implements OnInit {
  constructor(private ToastService: MessageService, private ProspectService: AdmissionService, private domSanitizer: DomSanitizer) { }
  token;
  PROSPECT: Prospect
  selectedIndex = 0
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.ProspectService.getByUserId(this.token.id).subscribe(prospect => {
      this.PROSPECT = prospect
    })
  }
  EvaluationOnGoing: Evaluation
  DateStart: Date;
  secondesPassed

  onStartEval(evaluation, index) {
    this.selectedIndex = index
    this.EvaluationOnGoing = evaluation.evaluation_id
    this.transform(this.EvaluationOnGoing.lien)
    this.DateStart = new Date()
    let secondesMAX = evaluation.evaluation_id.duree * 60
    this.secondesPassed = 0
    setInterval(() => {
      if (secondesMAX > 0)
        secondesMAX--;
      else
        this.onCloseEval()
      if (secondesMAX == 60)
        this.ToastService.add({ severity: 'info', summary: 'Il vous reste 1 minutes!', detail: 'Pensez à envoyer le formulaire pour ne rien perdre!' })
      this.secondesPassed++
    }, 1000)
  }
  showTimer() {
    let calc = (this.EvaluationOnGoing.duree * 60) - this.secondesPassed
    let minutes = Math.trunc(calc / 60)
    let secondes = calc - (minutes * 60)
    return `${minutes}min ${secondes}`
  }
  onCloseEval() {
    //Store seeTimer()

    let minutes = 0
    let calc = new Date().getTime() - this.DateStart.getTime()
    minutes = Math.trunc(calc / 60000)

    this.PROSPECT.evaluations[this.selectedIndex].etat = "Envoyé"
    this.PROSPECT.evaluations[this.selectedIndex].date_passation = new Date()
    this.PROSPECT.evaluations[this.selectedIndex].duree_mise = minutes

    this.ProspectService.updateV2({ _id: this.PROSPECT, evaluations: this.PROSPECT.evaluations }, 'Réalisation d\'une évaluation').subscribe(r => {
      this.PROSPECT = r
      this.EvaluationOnGoing = null

    })
  }
  URLFORM
  transform(url) {
    this.URLFORM = this.domSanitizer.bypassSecurityTrustResourceUrl(url + "?embedded=true");
  }
}
