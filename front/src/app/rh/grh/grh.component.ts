import { JustificatifCollaborateurService } from 'src/app/services/justificatif-collaborateur.service';
import { AbscenceCollaborateur } from './../../models/AbscenceCollaborateur';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InTime } from 'src/app/models/InTime';
import { AuthService } from 'src/app/services/auth.service';
import { IntimeService } from 'src/app/services/intime.service';
import { CongeService } from 'src/app/services/conge.service';
import { Conge } from 'src/app/models/Conge';
import { MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-grh',
  templateUrl: './grh.component.html',
  styleUrls: ['./grh.component.scss']
})
export class GrhComponent implements OnInit {

  //Partie dedié aux présences
  showSelectDateForm: boolean = false;
  selectDateForm: FormGroup;

  showPresenceList: boolean = false;
  presences: InTime[] = [];
  from: string;
  to: string;

  typeList: any = [
    { label: 'Tous les types', value: null },
    { label: 'Salarié', value: 'Salarié' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Commercial', value: 'Commercial' },
  ];

  //Partie dedié aux demandes de congés
  conges: Conge[] = [];
  showCongeList: boolean = false;

  //Partie dedié aux verification d'abscence
  showAbscenceList: boolean = false;
  absences: AbscenceCollaborateur[] = [];

  constructor(private abscenceService: JustificatifCollaborateurService, private messageService: MessageService, private formBuilder: FormBuilder, private congeService: CongeService, private inTimeService: IntimeService, private userService: AuthService) { }

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


  //Recuperation de la liste des congés
  onGetConges()
  {
    this.congeService.getAllPopulate()
    .then((response: Conge[]) => {
      this.conges = response;
      this.showCongeList = true;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: "Erreur interne, veuillez contacter un administrateur" }); });
  }


  //Recuperation de la liste des abscences
  onGetAbscences()
  {
    this.abscenceService.getAllPopulate()
    .then((response: AbscenceCollaborateur[]) => {
      this.absences = response;
    })
    .catch((error) => { console.log(error); })
  }

  downloadFile(id: string, fileName: string) 
  {
    this.abscenceService.downloadFile(id, fileName)
    .then((data: any) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      FileSaver(new Blob([byteArray], { type: data.extension }), fileName);
      
      this.messageService.add({ severity: 'success', summary: 'Téléchargement du Fichier...', detail: 'Fichier téléchargé' });
    }, (error) => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }

}