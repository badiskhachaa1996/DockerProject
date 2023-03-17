import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-questionnaire-formateur',
  templateUrl: './questionnaire-formateur.component.html',
  styleUrls: ['./questionnaire-formateur.component.scss']
})
export class QuestionnaireFormateurComponent implements OnInit {

  satisfactionsForm: FormGroup = new FormGroup({

  })
  show = true

  constructor() { }

  ngOnInit(): void {
  }


  onAddForm() {

  }

}
