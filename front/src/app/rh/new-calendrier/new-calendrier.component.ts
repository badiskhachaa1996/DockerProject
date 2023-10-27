import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayGridMonth from '@fullcalendar/timegrid';
import jwt_decode from 'jwt-decode';
import interactionPlugin from '@fullcalendar/interaction';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendrierRhService } from 'src/app/services/calendrier-rh.service';
import { EventCalendarRH } from 'src/app/models/EventCalendarRH';
import { MessageService } from 'primeng/api';
import { CongeService } from 'src/app/services/conge.service';
import { DailyCheckService } from 'src/app/services/daily-check.service';
import { ActivatedRoute } from '@angular/router';
import frLocale from '@fullcalendar/core/locales/fr';
import { User } from 'src/app/models/User';
import { RhService } from 'src/app/services/rh.service';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { Conge } from 'src/app/models/Conge';
import { PointageService } from 'src/app/services/pointage.service';
import { PointageData } from 'src/app/models/PointageData';
import { DailyCheck } from 'src/app/models/DailyCheck';

@Component({
  selector: 'app-new-calendrier',
  templateUrl: './new-calendrier.component.html',
  styleUrls: ['./new-calendrier.component.scss']
})
export class NewCalendrierComponent implements OnInit {
  indexTabView = 0
  siteSelected = []
  eventGlobal = []
  defaultEventsGlobal = []
  eventUsers = []
  defaultEventUsers = []
  userSelected: Collaborateur
  filter_value = ['Absence Non Justifié', 'Absence', 'Autorisation', 'Jour férié Tunis', 'Jour férié France', 'Autre événement', 'Présent', 'Cours']
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
  collaborateurList = []
  collaborateurDic = {}

  optionsGlobal = {
    plugins: [dayGridPlugin, dayGridMonth, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
    header: {
      right: 'prev,next',
      center: 'title',
      left: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: frLocale,
    timeZone: 'local',
    contentHeight: 500,
    eventClick: this.eventClickGlobal.bind(this),
    dateClick: this.dateClickGlobal.bind(this),
    events: [],
    //eventDidMount: this.eventToolTip(this),
    defaultView: "dayGridMonth",
    minTime: '08:00:00',
    firstDay: 1,
    selectable: true,
    views: {
      dayGridMonth: { // name of view
        titleFormat: { year: 'numeric', month: 'long' }
        // other view-specific options here
      }
    }
  };
  dataMachine;
  optionsUsers = {
    plugins: [dayGridPlugin, dayGridMonth, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
    header: {
      right: 'prev,next',
      center: 'title',
      left: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: frLocale,
    timeZone: 'local',
    contentHeight: 500,
    events: [],
    eventClick: this.eventClickUser.bind(this),
    //eventDidMount: this.eventToolTip(this),
    defaultView: "dayGridMonth",
    minTime: '08:00:00',
    firstDay: 1,
    selectable: true,
    views: {
      dayGridMonth: { // name of view
        titleFormat: { year: 'numeric', month: 'long' }
        // other view-specific options here
      }
    }
  };
  constructor(private rhService: RhService, private ToastService: MessageService, private PointageService: PointageService,
    private CalendrierRHService: CalendrierRhService, private dailyCheckService: DailyCheckService,
    private congeService: CongeService) { }
  token;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.getGlobalEvents()
    this.PointageService.getAllWithUserID().subscribe(r => {
      this.dataMachine = r
    })
    this.rhService.getCollaborateurs()
      .then((response) => {
        response.forEach(c => {
          if (c.user_id) {
            this.collaborateurList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c })
            this.collaborateurDic[c.user_id._id] = c
          }

        })
      })
      .catch((error) => { this.ToastService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
  }

  dateClickGlobal(col) {
    this.DataDay = col
    this.displayPopUp = true
  }
  DataCRA = []
  displayCRA
  dateCRA: string;
  eventClickUser(event) {
    console.log(event)
    if (event.event.extendedProps.type == "Présent") {
      this.dateCRA = new Date(event.event.start).toDateString()
      this.DataCRA = this.PresentDicUser[this.dateCRA]
      this.displayCRA = true
    }
  }
  dicAbsent = {}
  eventClickGlobal(event) {

    if (event.event.extendedProps.type == 'Absence') {
      this.dateAbsence = new Date(event.event.start).toDateString()
      this.dicAbsent[this.dateAbsence] = []
      let listPresent = []
      if (this.PresentDic[this.dateAbsence])
        this.PresentDic[this.dateAbsence].forEach(pd => {
          listPresent.push(pd.user_id._id)
        })
      this.collaborateurList.forEach(c => {
        if (listPresent.includes(c.value.user_id._id) == false && this.siteSelected.length == 0)
          this.dicAbsent[this.dateAbsence].push(c.value)
        else if (listPresent.includes(c.value.user_id._id) == false && this.atleastOne(c.value.localisation, this.siteSelected))
          this.dicAbsent[this.dateAbsence].push(c.value)
      })
      this.displayAbsence = true
    } else if (event.event.extendedProps.type == 'Autorisation') {
      this.dateAutorisation = new Date(event.event.start).toDateString()
      this.displayAutorisation = true
    } else {
      this.displayData = true
      this.dataEvent = event.event.extendedProps;
    }

    /*
    Si Global :
      Si Type == 'Absent' => Affiché les Collaborateurs qui sont Absents
      Si Type == 'Autorisation' => Affiché les Collaborateurs qui sont en congé autorisé

    Si User :
      RIEN
    */
  }

  changeSite(e) {
    this.getGlobalEvents()
  }
  changeUser(e) {
    this.getUsersEvents()
  }
  AbsentDic = {}
  CongeDic = {}
  PresentDic = {}

  getGlobalEvents() {
    this.eventGlobal = []
    this.defaultEventsGlobal = []
    this.CalendrierRHService.getAll().subscribe(events => {
      events.forEach(ev => { this.addEventGlobal(ev) })
      this.dailyCheckService.getChecks().then(dcs => {
        this.congeService.getAll().then(conges => {
          //Si conge Vert Si Check Rien Si Weekend Rien Si Absence de check hors Weekend alors Rouge
          let congesList: Date[] = []
          let presencesList: Date[] = []
          conges.forEach(c => {
            let dateC = new Date(c.date_debut)
            dateC.setDate(dateC.getDate() - 1)
            while (dateC < new Date(c.date_fin)) {
              congesList.push(dateC)
              if (this.CongeDic[dateC.toDateString()]) {
                this.CongeDic[dateC.toDateString()].push(c)
              } else {
                this.CongeDic[dateC.toDateString()] = [c]
              }

              this.addEventGlobal(new EventCalendarRH(null, dateC, "Autorisation", "Nous vous souhaitons de bonnes congés, couper votre téléphone, ne pensez pas au travail et reposez-vous bien!", null, "Autorisation"))
              dateC.setDate(dateC.getDate() + 1)
            }
          })
          dcs.forEach(dc => {
            presencesList.push(new Date(dc.check_in))
            if (this.PresentDic[new Date(dc.check_in).toDateString()]) {
              this.PresentDic[new Date(dc.check_in).toDateString()].push(dc)
            } else {
              this.PresentDic[new Date(dc.check_in).toDateString()] = [dc]
            }
          })
          let dateDebut = new Date()
          let dateEnd = new Date()
          dateEnd.setFullYear(dateEnd.getFullYear() - 1)
          while (dateEnd < dateDebut) {
            if (dateDebut.getDay() != 0 && dateDebut.getDay() != 6) {
              this.addEventGlobal(new EventCalendarRH(null, dateDebut, "Absence", "Contacté la RH pour régulariser votre Absence ou via l'onglet 'Demande de congé / autorisation' de votre dashboard", null, "Absence", null,))
            }
            dateDebut.setDate(dateDebut.getDate() - 1)
          }
          this.defaultEventsGlobal = this.eventGlobal
          this.onFilter()

        })
      })
    })
  }
  PresentDicUser = {}
  getUsersEvents() {
    this.eventUsers = []
    this.defaultEventUsers = []
    this.CalendrierRHService.getAll().subscribe(events => {
      //events.forEach(ev => { this.addEventUser(ev) })
      this.dailyCheckService.getUserChecks(this.userSelected.user_id._id).then(dcs => {
        this.congeService.getAllByUserId(this.userSelected.user_id._id).then(conges => {
          //Si conge Vert Si Check Rien Si Weekend Rien Si Absence de check hors Weekend alors Rouge
          let congesList: Date[] = []
          let absencesList: Date[] = []
          let presencesList: Date[] = []
          conges.forEach(c => {
            let dateC = new Date(c.date_debut)
            dateC.setDate(dateC.getDate() - 1)
            while (dateC < new Date(c.date_fin)) {
              congesList.push(new Date(dateC))
              this.addEventUser(new EventCalendarRH(null, dateC, "Autorisation", "Nous vous souhaitons de bonnes congés, couper votre téléphone, ne pensez pas au travail et reposez-vous bien!", null))
              dateC.setDate(dateC.getDate() + 1)
            }
          })
          dcs.forEach(dc => {
            presencesList.push(new Date(dc.check_in))
            if (this.PresentDicUser[new Date(dc.check_in).toDateString()]) {
              this.PresentDicUser[new Date(dc.check_in).toDateString()].push(dc)
            } else {
              this.PresentDicUser[new Date(dc.check_in).toDateString()] = [dc]
              this.addEventUser(new EventCalendarRH(null, new Date(dc.check_in), "Présent", "", null, "Présent"))
            }

          })
          console.log(this.PresentDicUser)
          let dateDebut = new Date()
          let dateEnd = new Date()
          dateEnd.setFullYear(dateEnd.getFullYear() - 1)
          while (dateEnd < dateDebut) {
            if (dateDebut.getDay() != 0 && dateDebut.getDay() != 6) {
              //Vérifier si il a été présent ou si il a été en congé 
              if (presencesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                congesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                events.find(d => (new Date(d.date).getDate() == dateDebut.getDate() && new Date(d.date).getMonth() == dateDebut.getMonth())) == undefined) {
                absencesList.push(dateDebut)
                this.addEventUser(new EventCalendarRH(null, dateDebut, "Absence Non Justifié", "Contacté la RH pour régulariser votre Absence ou via l'onglet 'Demande de congé / autorisation' de votre dashboard", null))
              } else {
                //console.log(dateDebut,events)
              }
            }
            dateDebut.setDate(dateDebut.getDate() - 1)
          }
          this.defaultEventUsers = this.eventUsers
          this.onFilter()
        })
      })
    })
    this.onFilter()
  }

  addEventGlobal(event: EventCalendarRH) {
    let backgroundColor = '#1F618D'
    let borderColor = '#17202A'
    if (event.type == 'Jour férié France') {
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'
    } else if (event.type == 'Autre événement') {
      backgroundColor = '#9B59B6'
      borderColor = '#8E44AD'
    } else if (event.type == "Autorisation") {
      backgroundColor = '#1ABC9C'
      borderColor = '#186A3B'
    } else if (event.type == "Absence Non Justifié" || event.type == "Absence") {
      backgroundColor = '#E74C3C'
      borderColor = '#7B241C'
    }
    let title = event.type
    if (event.name)
      title = event.name
    if (event.campus)
      title = title + ", " + event.campus
    this.eventGlobal.push({ title, date: new Date(event.date), allDay: true, backgroundColor, borderColor, extendedProps: { ...event } })
    this.optionsGlobal.events = this.eventGlobal
    this.eventGlobal = Object.assign([], this.eventGlobal) //Parceque Angular est trop c*n pour voir le changement de la variable autrementF

  }
  addEventUser(event: EventCalendarRH) {
    let backgroundColor = '#1F618D'
    let borderColor = '#17202A'
    if (event.type == 'Jour férié France') {
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'
    } else if (event.type == 'Autre événement') {
      backgroundColor = '#9B59B6'
      borderColor = '#8E44AD'
    } else if (event.type == "Autorisation") {
      backgroundColor = '#1ABC9C'
      borderColor = '#186A3B'
    } else if (event.type == "Absence Non Justifié") {
      backgroundColor = '#E74C3C'
      borderColor = '#7B241C'
    }
    let title = event.type
    if (event.name)
      title = event.name
    if (event.campus)
      title = title + ", " + event.campus
    this.eventUsers.push({ title, date: new Date(event.date), allDay: true, backgroundColor, borderColor, extendedProps: { ...event } })
    this.optionsUsers.events = this.eventUsers
    this.eventUsers = Object.assign([], this.eventUsers)

  }
  onFilter() {
    /*
    Si User:
      ( Absence , Activité , cours , Autorisation )
    Si Global:
      Site  ( check list pour voir le calendrier des membres d’un site ) =>concerne  les absences et les autorisation ( tout site par défaut  ) 
Absence , Autorisation , Férié France , Férié Tunis , Autre évènement : cases à cocher (True par défaut ) 

    */
    //{ title: event?.name + ', ' + event?.campus, date: new Date(event.date), allDay: true, backgroundColor, borderColor, extendedProps: { ...event } }
    this.eventUsers = []
    this.defaultEventUsers.forEach(r => {
      if (this.filter_value.includes(r.extendedProps.type)) {
        this.eventUsers.push(r)
      }
    })
    this.eventGlobal = []
    this.defaultEventsGlobal.forEach(r => {
      if (this.filter_value.includes(r.extendedProps.type)) {
        this.eventGlobal.push(r)
      }
    })
    if (this.siteSelected.length != 0) {
      let keys = Object.keys(this.CongeDic)
      keys.forEach(k => {
        let r = []
        this.CongeDic[k].forEach((value: Conge) => {
          if (value.user_id) {
            let c: Collaborateur = this.collaborateurDic[value.user_id._id]
            if (this.atleastOne(c.localisation, this.siteSelected))
              r.push(c)
          }
        })
        this.CongeDic[k] = r
      })
    }

  }
  atleastOne(arr1: string[], arr2: string[]) {
    if (typeof arr1 != typeof ['qsdqdqsd'])
      arr1 = [arr1.toString()]
    if (typeof arr2 != typeof ['qsdqdqsd'])
      arr2 = [arr2.toString()]
    let r = false
    arr1.forEach(val => {
      if (arr2.includes(val))
        r = true
    })
    return r
  }
  DataDay: {
    date: Date,
    dateStr: string,
    allDay: Boolean
  };

  displayPopUp = false

  onSave() {
    this.CalendrierRHService.create({ ...this.formAdd.value, created_by: this.token.id, date: this.DataDay.date }).subscribe(newEvent => {
      this.getGlobalEvents()
      this.getUsersEvents()
      this.formAdd.reset()
      this.displayPopUp = false
      this.DataDay = null
      this.ToastService.add({ severity: 'success', summary: 'Ajout d\'un événement avec succès' })
    })
  }

  displayData = false
  dataEvent: EventCalendarRH;
  showEdit = false

  formAdd = new FormGroup({
    type: new FormControl('', Validators.required),
    note: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    campus: new FormControl('', Validators.required)
  })

  formUpdate = new FormGroup({
    type: new FormControl('', Validators.required),
    note: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    campus: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)
  })
  typeList = [
    { label: 'Jour férié Tunis', value: "Jour férié Tunis" },//BLUE
    { label: 'Jour férié France', value: "Jour férié France" },//YELLOW
    { label: 'Autre événement', value: "Autre événement" },//Violet
  ]
  campusList = [
    { label: 'IEG', value: 'IEG' },
    { label: 'Marne', value: 'Marne' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'UK', value: 'UK' },
    { label: 'Tunis', value: 'Tunis' },
    { label: 'Intuns', value: 'Intuns' }
  ]
  onInitUpdate() {
    this.showEdit = true
    this.formUpdate.patchValue({ ...this.dataEvent })
  }

  onDelete() {
    this.CalendrierRHService.delete(this.dataEvent._id).subscribe(d => {
      this.getGlobalEvents()
      this.getUsersEvents()
      this.displayData = false
      this.dataEvent = null
    })
  }

  onUpdate() {
    this.CalendrierRHService.update({ ...this.formUpdate.value }).subscribe(d => {
      this.dataEvent = d
      this.getGlobalEvents()
      this.getUsersEvents()
      this.showEdit = false
      this.formUpdate.reset()
    })
  }

  dateAbsence: string = ''
  dateAutorisation: string = ''
  displayAutorisation = false
  displayAbsence = false

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
  displayCRACheck = false
  dataCHECK: DailyCheck
  onValidateCRA(check: DailyCheck) {
    this.displayCRACheck = true
    this.dataCHECK = check
  }

  saveCheck(check: DailyCheck) {
    this.dailyCheckService.patchCheckIn(check).then(r => {
      this.ToastService.add({ severity: 'success', summary: "L'activité a été mis à jour" })

    }, error => { console.error(error) })
  }
}
