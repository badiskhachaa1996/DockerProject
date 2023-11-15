import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  showEvaluationForm:boolean = false;
  evaluation:Evaluation;
  evaluations:Evaluation[] = [];
  evaluationForm: FormGroup = new FormGroup({
    label: new FormControl('',),
    lien: new FormControl('',),
    duree:new FormControl('',),
    score: new FormControl('',),
    Condition_admission: new FormControl('',),
    description: new FormControl('',),
  });
  constructor(private evalService:EvaluationService) { }

  ngOnInit(): void {
    this.evalService.getevaluations().then((results)=>
    this.evaluations=results)

  }
addEvaluation(){
  this.evaluation = new Evaluation();
  console.log(this.evaluationForm.value.label);
this.evaluation.label=this.evaluationForm.value.label;
this.evaluation.lien=this.evaluationForm.value.lien;
this.evaluation.duree=this.evaluationForm.value.duree;
this.evaluation.score=this.evaluationForm.value.score;
this.evaluation.Condition_admission=this.evaluationForm.value.Condition_admission;
this.evaluation.description=this.evaluationForm.value.description;
this.evalService.postEvaluation(this.evaluation).then((result)=>{console.log(result);});
  }

}
