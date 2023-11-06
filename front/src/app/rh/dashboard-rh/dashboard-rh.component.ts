import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { DailyCheck } from 'src/app/models/DailyCheck';
import { PointageData } from 'src/app/models/PointageData';
import { DailyCheckService } from 'src/app/services/daily-check.service';
import { PointageService } from 'src/app/services/pointage.service';
import { RhService } from 'src/app/services/rh.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import mongoose from 'mongoose';
import * as moment from 'moment';
import { PointeuseService } from 'src/app/services/pointeuse.service';
import { TeamsRHService } from 'src/app/services/teams-rh.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-dashboard-rh',
  templateUrl: './dashboard-rh.component.html',
  styleUrls: ['./dashboard-rh.component.scss']
})
export class DashboardRhComponent implements OnInit {
  displayCRA = false
  today: Date = new Date();
  dailyChecks: DailyCheck[] = [];
  userChecksHistorique: DailyCheck[] = [];
  defaultUserChecksHistorique: DailyCheck[] = [];
  showUserChecksHistorique: boolean = false;
  collaborateurs: Collaborateur[] = [];
  dicCollaborateurs = {}
  numberOfChecks: number = 0;
  numberOfConge: number = 0;
  numberOfAbsent: number = 0;
  numberOfPause: number = 0;
  numberOfDisponible: number = 0;
  numberOfReunion: number = 0;
  numberOfOccupe: number = 0;
  collaborateurConnected: Collaborateur
  token;
  teamRHFilter = []
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
  USER: User
  constructor(private rhService: RhService, private dailyCheckService: DailyCheckService, private PoiService: PointeuseService,
    private messageService: MessageService, private PointageService: PointageService, private AuthService: AuthService, private TeamRHService: TeamsRHService) { }
  machineList = []
  machineDic = {}
  uidDic = {}
  ngOnInit(): void {
    // recuperation de la liste des checks
    this.onGetUsersDailyChecksAndCollaborateur();
    this.PointageService.getAllWithUserID().subscribe(r => {
      this.dataMachine = r
    })
    this.PoiService.getAll().subscribe(ps => {
      this.machineList = ps
      ps.forEach(m => {
        this.machineDic[m.serial_number] = m
      })
    })
    this.PoiService.getData().subscribe(pd => {
      pd.forEach(p => {
        p.users.forEach(u => {
          if (u.user_id) {
            if (this.uidDic[p.serial_number]) {
              this.uidDic[p.serial_number][u.UID] = u.user_id
            } else {
              this.uidDic[p.serial_number] = {}
              this.uidDic[p.serial_number][u.UID] = u.user_id
            }
          }
        })
      })
    })
    this.token = jwt_decode(localStorage.getItem('token'));
    this.AuthService.getPopulate(this.token.id).subscribe(user => this.USER = user)
    this.TeamRHService.MRgetByUSERID(this.token.id).subscribe(members => {
      members.forEach(m => {
        if (m.role == 'Responsable')
          this.teamRHFilter.push({ label: m.team_id.nom, value: m.team_id._id })
      })
    })
  }

  // recuperation de la liste des checks du jours et des collaborateurs
  onGetUsersDailyChecksAndCollaborateur(): void {
    // recuperation de la liste des checks
    this.dailyCheckService.getAllUsersDailyChecks()
      .then((dcs) => {
        this.dailyChecks = [];
        dcs.forEach(dc => {
          let pauseTiming = 0;
          if (dc && dc.pause && dc.pause.length != 0) {
            dc?.pause.forEach((p) => {
              if (p.out) {
                pauseTiming = pauseTiming + (moment(new Date(p.out)).diff(moment(new Date(p.in)), 'minutes'));
              } else {
                pauseTiming = pauseTiming + (moment(new Date()).diff(moment(new Date(p.in)), 'minutes'));
              }
            })
          }
          if (dc && dc.cra) {
            let workingTiming = (moment(new Date()).diff(moment(new Date(dc?.check_in)), 'minutes'));
            if (dc.check_out)
              workingTiming = (moment(new Date(dc?.check_out)).diff(moment(new Date(dc?.check_in)), 'minutes'));
            let max = workingTiming - pauseTiming
            let worked = 0
            dc?.cra.map((cra) => {
              worked += cra.number_minutes;
            });
            dc.taux_cra = ((worked * 100) / max)
          }

          if (dc && dc.user_id)
            this.dailyChecks.push(dc)
        })
        this.AuthService.getPopulate(this.token.id).subscribe(USER => {
          let services_list = [];
          let service_dic = {};
          USER.roles_list.forEach((val) => {
            if (!service_dic[val.module])
              service_dic[val.module] = val.role
          })
          services_list = Object.keys(service_dic)
          if (!services_list.includes('Ressources Humaines') || !service_dic['Ressources Humaines'] || service_dic['Ressources Humaines'] != 'Super-Admin')
            this.dt1.filter('qsdqsdqsdqdsq', 'user_id._id', 'equals')
        })
        // nombre de checks
        this.numberOfChecks = this.dailyChecks.length;

        // recuperation de la liste des collaborateurs
        this.rhService.getCollaborateurs()
          .then((response) => {
            this.collaborateurs = response;
            this.collaborateurs.forEach((c, idx) => {
              if (!c.user_id) {
                this.collaborateurs.splice(idx, 1)
              }
            })
            let listCIDS = []
            this.dailyChecks.forEach((dc: any) => {
              if (dc && dc.user_id)
                listCIDS.push(dc.user_id._id)
            })
            this.collaborateurs.forEach((c, idx) => {
              if (c.user_id && c.user_id.lastname && c.user_id.firstname && listCIDS.includes(c.user_id._id) == false) {
                c.user_id.statut = "Absent"
                this.dailyChecks.push(new DailyCheck(new mongoose.Types.ObjectId().toString(), c.user_id, new Date().toLocaleDateString(), null, null, null, null, null, null, null, null))
              }
              if (c.user_id) {
                this.dicCollaborateurs[c.user_id._id] = c
              }
              if (c.user_id?._id == this.token.id)
                this.collaborateurConnected = c
            })
            this.defaultdailyChecks = this.dailyChecks
            this.loading = false;

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
        this.userChecksHistorique = response.reverse();
        this.defaultUserChecksHistorique = response
        this.showUserChecksHistorique = true;
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: "Impossible de récupérer l'historique de check du collaborateur" }); });
  }

  getCheckIn(user_id) {
    if (this.dataMachine) {
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
  }

  getCheckOut(user_id) {
    if (this.dataMachine) {
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

  localisationList: any[] = [
    { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ];
  siteSelected = []
  defaultdailyChecks = []
  filterCollaborateur(e: string[]) {
    this.dailyChecks = []
    if (e.length != 0)
      this.defaultdailyChecks.forEach(check => {
        if (check.user_id) {
          if ((this.dicCollaborateurs[check.user_id._id] && this.dicCollaborateurs[check.user_id._id]?.localisation)) {
            let localisations: string[] = []
            if (typeof this.dicCollaborateurs[check.user_id._id].localisation == typeof 'str')
              localisations = [this.dicCollaborateurs[check.user_id._id].localisation]
            else if (typeof this.dicCollaborateurs[check.user_id._id].localisation == typeof ['str'])
              localisations = this.dicCollaborateurs[check.user_id._id].localisation
            let r = false
            localisations.forEach(val => {
              if (this.siteSelected.includes(val))//this.siteSelected
                r = true
            })
            if (r) {
              this.dailyChecks.push(check)
            }
          }
        }
      })
    else
      this.dailyChecks = this.defaultdailyChecks
  }

  onReinitPointage(check: DailyCheck) {
    this.dailyCheckService.patchCheckIn({ _id: check._id, check_out: null, pause: [], isInPause: false, pause_timing: 0, validated: false, taux_cra: 0 }).then(d => {
      this.onGetUsersDailyChecksAndCollaborateur();
    })
  }
  craStatutList = [
    { label: 'Valider', value: true },
    { label: 'Non Valider', value: false }
  ]
  dataCHECK: DailyCheck
  onValidateCRA(check: DailyCheck) {
    this.displayCRA = true
    this.dataCHECK = check
  }
  displayNote = false
  noteCheck: DailyCheck
  takeNote(check: DailyCheck) {
    this.displayNote = true
    this.noteCheck = check
  }
  saveNote(check: DailyCheck) {
    check.commented_by = this.USER
    check.commented_date = new Date()
    this.dailyCheckService.patchCheckIn(check).then(r => {
      this.messageService.add({ severity: 'success', summary: "L'activité a été mis à jour" })
      this.displayNote = false
    })
  }

  seePause(pause: any[]) {

  }

  onFilter(value: string) {
    if (new Date(value).toString() != 'Invalid Date') {
      let db = new Date(value)
      db.setHours(0, 0, 0, 0)
      let df = new Date(value)
      df.setHours(23, 59, 59, 59)
      console.log(value, db, df)
      this.userChecksHistorique = []
      this.defaultUserChecksHistorique.forEach(check => {
        let day = check.today[0] + check.today[1]
        let month = check.today[3] + check.today[4]
        let year = check.today[6] + check.today[7] + check.today[8] + check.today[9]
        let td = new Date(month + "/" + day + "/" + year)
        if (td.getTime() >= db.getTime() && td.getTime() <= df.getTime())
          this.userChecksHistorique.push(check)

      })
    }
  }
  saveCheck(check: DailyCheck) {
    this.dailyCheckService.patchCheckIn(check).then(r => {
      this.messageService.add({ severity: 'success', summary: "L'activité a été mis à jour" })

    }, error => { console.error(error) })
  }
  pointages = []
  displayActivite = false
  choosenCollaborateur: Collaborateur
  seePointage(check: DailyCheck) {
    this.choosenCollaborateur = this.dicCollaborateurs[check.user_id._id]
    this.PointageService.getAllToday().subscribe(ps => {

      ps.forEach(p => {
        if (this.uidDic[p?.machine][p?.uid] && this.uidDic[p?.machine][p?.uid] == check.user_id._id)
          this.pointages.push(p)
      })
      this.displayActivite = true
    })
  }
  @ViewChild('dt1') dt1: Table;
  chooseTeam(team_id) {
    if (team_id)
      this.TeamRHService.MRgetAllByTeamID(team_id).subscribe(members => {
        let ids = []
        members.forEach(m => { ids.push(m.user_id._id) })
        this.dt1.filter(ids, 'user_id._id', 'in')
      })
    else
      this.AuthService.getPopulate(this.token.id).subscribe(USER => {
        let services_list = [];
        let service_dic = {};
        USER.roles_list.forEach((val) => {
          if (!service_dic[val.module])
            service_dic[val.module] = val.role
        })
        services_list = Object.keys(service_dic)
        if (!services_list.includes('Ressources Humaines') || !service_dic['Ressources Humaines'] || service_dic['Ressources Humaines'] != 'Super-Admin')
          this.dt1.filter('qsdqsdqsdqdsq', 'user_id._id', 'equals')
        else
          this.dt1.filter([], 'user_id._id', 'in')
      })
  }
}
