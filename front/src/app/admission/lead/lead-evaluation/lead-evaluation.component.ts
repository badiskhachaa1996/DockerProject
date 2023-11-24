import { Component, OnInit } from '@angular/core';
import { Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
import jwt_decode from 'jwt-decode';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-lead-evaluation',
  templateUrl: './lead-evaluation.component.html',
  styleUrls: ['./lead-evaluation.component.scss']
})
export class LeadEvaluationComponent implements OnInit {
  evaluations: Evaluation[] = []
  constructor(private EvaluationService: EvaluationService, private ToastService: MessageService) { }
  token;
  resultatDic = {}
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.EvaluationService.getevaluations().then(evaluations => {
      this.evaluations = evaluations
      evaluations.forEach(ev => {
        ev.resultats.forEach(r => {
          if (r.user_id == this.token.id) {
            this.resultatDic[ev._id] = r
          }
        })
      })
    })

  }
  EvaluationOnGoing: Evaluation
  DateStart: Date;
  onStartEval(evaluation: Evaluation) {
    this.EvaluationOnGoing = evaluation
    this.DateStart = new Date()
  }

  seeTimer() {
    let minutes = 0
    let secondes = 0
    let dateEnd = new Date(this.DateStart)
    dateEnd.setMinutes(dateEnd.getMinutes() + 30)
    let calc = dateEnd.getTime() - new Date().getTime()
    minutes = Math.trunc(calc / 60000)
    secondes = Math.trunc((calc - minutes * 60000) / 1000)
    if (minutes == 0 && secondes == 0)
      this.onCloseEval()
    if (minutes == 2 && secondes == 31)
      this.ToastService.add({ severity: 'info', summary: 'Il vous reste 2 minutes 30.' })
    return `${minutes}:${secondes}`
  }

  onCloseEval() {
    //Store seeTimer()

    let minutes = 0
    let dateEnd = new Date(this.DateStart)
    dateEnd.setMinutes(dateEnd.getMinutes() + 30)
    let calc = dateEnd.getTime() - new Date().getTime()
    minutes = Math.trunc(calc / 60000)
    let r = {
      user_id: this.token.id,
      date_passation: new Date(),
      duree_mise: minutes
    }
    this.EvaluationOnGoing.resultats.push(r)
    this.resultatDic[this.EvaluationOnGoing._id] = r
    this.EvaluationService.putEvaluation(this.EvaluationOnGoing).then(evaluation => {
      this.EvaluationOnGoing = null
      this.ToastService.add({ severity: 'success', summary: 'Votre application a été ajouté' })
    })
  }

}
