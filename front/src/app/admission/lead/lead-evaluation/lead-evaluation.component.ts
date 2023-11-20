import { Component, OnInit } from '@angular/core';
import { Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-lead-evaluation',
  templateUrl: './lead-evaluation.component.html',
  styleUrls: ['./lead-evaluation.component.scss']
})
export class LeadEvaluationComponent implements OnInit {
  evaluations: Evaluation[] = []
  constructor(private EvaluationService: EvaluationService) { }
  token;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.EvaluationService.getevaluations().then(evaluations => {
      this.evaluations = evaluations
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
      return `${minutes}:${secondes}`
  }

  onCloseEval() {
    //Store seeTimer()
    this.EvaluationOnGoing = null
  }

}
