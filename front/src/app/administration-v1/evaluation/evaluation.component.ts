import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Evaluation } from 'src/app/models/evaluation';
import { EvaluationService } from 'src/app/services/evaluation.service';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  showEvaluationForm: boolean = false;
  showUpdateForm: boolean = false;
  evaluation: Evaluation;
  evaluation_actuelle: Evaluation;
  evaluations: Evaluation[] = [];
  evaluationForm: FormGroup = new FormGroup({
    label: new FormControl('', Validators.required),
    lien: new FormControl('', Validators.required),
    duree: new FormControl('', Validators.required),
    score: new FormControl('', Validators.required),
    Condition_admission: new FormControl('',),
    description: new FormControl('',),
  });
  updateForm: FormGroup = new FormGroup({
    label: new FormControl('', Validators.required),
    lien: new FormControl('', Validators.required),
    duree: new FormControl('', Validators.required),
    score: new FormControl('', Validators.required),
    Condition_admission: new FormControl('',),
    description: new FormControl('',),
  });
  constructor(private evalService: EvaluationService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.evalService.getevaluations().then((results) =>
      this.evaluations = results)

  }
  addEvaluation() {

    this.evalService.postEvaluation({ ...this.evaluationForm.value }).then((result) => {
      this.evaluations.push(result)
      this.showEvaluationForm = false
      this.ToastService.add({ severity: 'success', summary: 'Ajout d\'évaluation avec succès' })
    });
  };
  initupdateLeadForm(evaluation: Evaluation) {
    this.updateForm.patchValue({
      ...evaluation
    })
    this.showUpdateForm = true;
    this.evaluation_actuelle = evaluation
  }
  UpdateEvaluation() {
    this.evalService.putEvaluation({ ...this.updateForm.value, _id: this.evaluation_actuelle._id }).then((result) => {
      this.evalService.getevaluations().then((results) => {
        this.evaluations = results
        this.evaluation_actuelle = null
        this.showUpdateForm = false
        this.ToastService.add({ severity: 'success', summary: 'Mis à jout de l\'évaluation avec succès' })
      })
    });


  }
  delete(evaluation: Evaluation) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette évaluation ?")) {
      this.evalService.delete(evaluation._id).then((result) => {
        this.evalService.getevaluations().then((results) =>
          this.evaluations = results)
      });
    }


  }

}
