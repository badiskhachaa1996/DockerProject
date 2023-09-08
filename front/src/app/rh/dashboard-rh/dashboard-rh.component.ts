import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { DailyCheck } from 'src/app/models/DailyCheck';
import { PointageData } from 'src/app/models/PointageData';
import { DailyCheckService } from 'src/app/services/daily-check.service';
import { PointageService } from 'src/app/services/pointage.service';
import { RhService } from 'src/app/services/rh.service';

@Component({
  selector: 'app-dashboard-rh',
  templateUrl: './dashboard-rh.component.html',
  styleUrls: ['./dashboard-rh.component.scss']
})
export class DashboardRhComponent implements OnInit {

  today: Date = new Date();
  dailyChecks: DailyCheck[] = [];
  userChecksHistorique: DailyCheck[] = [];
  showUserChecksHistorique: boolean = false;
  collaborateurs: Collaborateur[] = [];
  numberOfChecks: number = 0;
  checkPercent: number = 0;
  numberOfConge: number = 0;
  numberOfAbsent: number = 0;
  numberOfPause: number = 0;
  numberOfDisponible: number = 0;
  numberOfReunion: number = 0;
  numberOfOccupe: number = 0;

  loading: boolean = true;
  statutList: any[] = [
    { label: 'En congé', value: 'En congé' },
    { label: 'Disponible', value: 'Disponible' },
    { label: 'En réunion', value: 'En réunion' },
    { label: 'Occupé', value: 'Occupé' },
    { label: 'Absent', value: 'Absent' },
    { label: 'En pause', value: 'En pause' },
  ];

  dataMachine;

  constructor(private rhService: RhService, private dailyCheckService: DailyCheckService,
    private messageService: MessageService, private PointageService: PointageService) { }

  ngOnInit(): void {
    // recuperation de la liste des checks
    this.onGetUsersDailyChecksAndCollaborateur();
    this.PointageService.getAllWithUserID().subscribe(r => {
      this.dataMachine = r
    })
  }

  // recuperation de la liste des checks du jours et des collaborateurs
  onGetUsersDailyChecksAndCollaborateur(): void {
    // recuperation de la liste des checks
    this.dailyCheckService.getAllUsersDailyChecks()
      .then((response) => {
        this.dailyChecks = response;
        // nombre de checks
        this.numberOfChecks = this.dailyChecks.length;

        // recuperation de la liste des collaborateurs
        this.rhService.getCollaborateurs()
          .then((response) => {
            this.collaborateurs = response;
            let listCIDS = []
            this.dailyChecks.forEach((dc: any) => {
              listCIDS.push(dc.user_id._id)
            })
            this.collaborateurs.forEach(c => {
              if (c.user_id && c.user_id.lastname && c.user_id.firstname && listCIDS.includes(c.user_id._id) == false) {
                c.user_id.statut = "Absent"
                console.log(c.user_id)
                this.dailyChecks.push(new DailyCheck(null, c.user_id, new Date().toLocaleDateString(), null, null, null, null, null, null, null, null))
              }

            })
            this.loading = false;
            // pourcentage de checks
            this.checkPercent = Math.ceil((this.numberOfChecks / this.collaborateurs.length) * 100);

            // initialisation à zero
            this.numberOfDisponible = 0;
            this.numberOfConge = 0;
            this.numberOfReunion = 0;
            this.numberOfOccupe = 0;
            this.numberOfAbsent = 0;
            this.numberOfPause = 0;
            console.log(this.collaborateurs)
            // remplissage des variables de statuts
            this.collaborateurs.forEach((collaborateur: Collaborateur) => {
              const { user_id }: any = collaborateur;

              if (user_id?.statut == 'Disponible') {
                this.numberOfDisponible++;
              } else if (user_id?.statut == 'En congé') {
                this.numberOfConge++;
              } else if (user_id?.statut == 'En réunion') {
                this.numberOfReunion++;
              } else if (user_id?.statut == 'Occupé') {
                this.numberOfOccupe++;
              } else if (user_id?.statut == 'Absent') {
                this.numberOfAbsent++;
              } else if (user_id?.statut == 'En pause') {
                this.numberOfPause++;
              }
            });
          })
          .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de récupérer la liste des collaborateurs' }); console.error(error) });
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de récupérer la liste des présences' }); console.error(error) });
  }

  // recuperation de la liste des check d'un utilisateur
  onGetUserChecksHistorique(check: DailyCheck): void {
    const { user_id }: any = check;

    this.dailyCheckService.getUserChecks(user_id._id)
      .then((response) => {
        this.userChecksHistorique = response;
        this.showUserChecksHistorique = true;
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: "Impossible de récupérer l'historique de check du collaborateur" }); });
  }

  getCheckIn(user_id) {
    let UID = this.dataMachine.UserToUID[user_id]
    if (this.dataMachine.DataDic[UID]) {
      let listCheck: PointageData[] = this.dataMachine.DataDic[UID]
      let date = new Date(listCheck[0].date)
      listCheck.forEach(element => {
        if (new Date(element.date) < date)
          date = new Date(element.date)
      });
      return date
    } else {
      return null
    }

  }

  getCheckOut(user_id) {
    let UID = this.dataMachine.UserToUID[user_id]
    if (this.dataMachine.DataDic[UID]) {
      let listCheck: PointageData[] = this.dataMachine.DataDic[UID]
      let date = new Date(listCheck[0].date)
      listCheck.forEach(element => {
        if (new Date(element.date) > date)
          date = new Date(element.date)
      });
      return date
    } else {
      return null
    }
  }




}
