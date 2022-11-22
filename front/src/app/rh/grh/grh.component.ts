import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InTime } from 'src/app/models/InTime';
import { AuthService } from 'src/app/services/auth.service';
import { IntimeService } from 'src/app/services/intime.service';

@Component({
  selector: 'app-grh',
  templateUrl: './grh.component.html',
  styleUrls: ['./grh.component.scss']
})
export class GrhComponent implements OnInit {

  showSelectDateForm: boolean = false;
  selectDateForm: FormGroup;

  showPresenceList: boolean = false;
  presences: InTime[] = [];
  from: string;
  to: string;

  typeList: any = [
    { label: 'Tous les types', value: null },
    { label: 'Salarié', value: 'Salarié' },
    { label: 'Représentant', value: 'Représentant' },
    { label: 'Tuteur', value: 'Tuteur' },
    { label: 'Etudiant', value: 'Etudiant' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Formateur', value: 'Formateur' },
    { label: 'Commercial', value: 'Commercial' },
  ];

  constructor(private formBuilder: FormBuilder, private inTimeService: IntimeService, private userService: AuthService) { }

  ngOnInit(): void {
    //Methode d'initialisation du formulaire de selection des dates
    this.selectDateForm = this.formBuilder.group({
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }


  //Methode de recuperation des presence
  onGetPresences()
  {
    const formValue = this.selectDateForm.value;

    let originalBeginDate = formValue['beginDate'].toLocaleDateString();
    let beginDate = '';

    for(let i = 0; i < originalBeginDate.length; i++)
    {
      if(originalBeginDate[i] === '/')
      {
        beginDate += '-';
      }
      else
      {
        beginDate += originalBeginDate[i];
      }
    }
    this.from = beginDate;

    let originalEndDate = formValue['endDate'].toLocaleDateString();
    let endDate = '';

    for(let i = 0; i < originalEndDate.length; i++)
    {
      if(originalEndDate[i] === '/')
      {
        endDate += '-';
      }
      else
      {
        endDate += originalEndDate[i];
      }
    }
    this.to = endDate;

    // Recuperation de la liste des présences
    this.inTimeService.getAllByDateBetweenPopulateUserId(beginDate, endDate)
    .then((response: InTime[]) => {
      this.presences = response;
      this.showPresenceList = true;
    })
    .catch((error) => { console.log(error); })
  }

}