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
  showUpdateForm:boolean=false;
  evaluation:Evaluation;
  evaluation_actuelle:Evaluation;
  evaluations:Evaluation[] = [];
  evaluationForm: FormGroup = new FormGroup({
    label: new FormControl('',),
    lien: new FormControl('',),
    duree:new FormControl('',),
    score: new FormControl('',),
    Condition_admission: new FormControl('',),
    description: new FormControl('',),
  });
  updateForm: FormGroup = new FormGroup({
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
this.evalService.getevaluations().then((results)=>
this.evaluations=results)
  };
  initupdateLeadForm(evaluation:Evaluation){
    this.updateForm.setValue({
      label:evaluation.label,
      lien:evaluation.lien,
      duree:evaluation.duree,
      score:evaluation.score,
      Condition_admission:evaluation.Condition_admission,
      description:evaluation.description,
    })
    this.showUpdateForm=true;
this.evaluation_actuelle=evaluation
  }
  UpdateEvaluation(){
  this.evaluation = new Evaluation();
  console.log(this.evaluationForm.value.label);
this.evaluation_actuelle.label=this.updateForm.value.label;
this.evaluation_actuelle.lien=this.updateForm.value.lien;
this.evaluation_actuelle.duree=this.updateForm.value.duree;
this.evaluation_actuelle.score=this.updateForm.value.score;
this.evaluation_actuelle.Condition_admission=this.updateForm.value.Condition_admission;
this.evaluation_actuelle.description=this.updateForm.value.description;
this.evalService.putEvaluation(this.evaluation_actuelle).then((result)=>{console.log(result);});
this.evalService.getevaluations().then((results)=>
this.evaluations=results)

  }
  delete(evaluation:Evaluation){
    this.evalService.delete(evaluation._id).then((result)=>{console.log(result);});
    this.evalService.getevaluations().then((results)=>
this.evaluations=results)
  }

}
