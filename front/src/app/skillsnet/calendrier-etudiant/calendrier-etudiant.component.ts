import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridMonth from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ViewportScroller } from '@angular/common';
import { Annonce } from 'src/app/models/Annonce';
import { Router } from '@angular/router';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { User } from 'src/app/models/User';
import { DisponibiliteEtudiant } from 'src/app/models/DisponibiliteEtudiant';
import { CalendrierEtudiantService } from 'src/app/services/calendrier-etudiant.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendrier-etudiant',
  templateUrl: './calendrier-etudiant.component.html',
  styleUrls: ['./calendrier-etudiant.component.scss']
})
export class CalendrierEtudiantComponent implements OnInit {
  token;
  user: User;

  typeList = [
    { label: "Indisponible", value: "Indisponible" },
    { label: "Disponible", value: "Disponible" },
    { label: "Réunion Teams", value: "Teams" },
    { label: "Entretien", value: "Other" }
  ]
  constructor(private DispoEtuService: CalendrierEtudiantService, private ToastService: MessageService,
    private AuthService: AuthService, private viewportScroller: ViewportScroller, private router: Router,
    private CVService: CvService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.AuthService.getPopulate(this.token.id).subscribe(user => {
      this.user = user
      this.loadEvents()
    })
  }

  loadEvents() {
    this.events = []
    this.DispoEtuService.getAllByUSERID(this.token.id).subscribe(mts => {
      mts.forEach(mt => {
        this.addEvent(mt.libelle, new Date(mt.from), new Date(mt.to), { ...mt }, mt.type)
      })
      let date_start = new Date()
      date_start.setMonth(date_start.getMonth() - 1)
      date_start.setDate(1)
      date_start.setHours(8)
      date_start.setMinutes(0)
      date_start.setSeconds(0)
      date_start.setMilliseconds(0)
      let date_end = new Date()
      date_end.setMonth(date_end.getMonth() + 1)
      date_end.setDate(31)
      date_end.setHours(8)
      date_end.setMinutes(0)
      date_end.setSeconds(0)
      date_end.setMilliseconds(0)
      while (date_start < date_end) {
        if (date_start.getHours() > 19) {
          date_start.setHours(8)
          date_start.setDate(date_start.getDate() + 1)
        }
        if (!this.eventsExist(new Date(date_start), new Date(date_start.getTime() + 3600000)))
          this.addEvent("Disponible", new Date(date_start), new Date(date_start.getTime() + 3600000), { type: "Disponible" }, "Disponible")
        date_start.setHours(date_start.getHours() + 1)
      }
      if (this.actualView == 'dayGridMonth') {
        this.onChangeView({ view: { type: "dayGridMonth" } })
      }
    })

    //Détecter tous les events dans la journée et si y'a aucun alors rajouter un event Disponible
  }
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'today,dayGridMonth,timeGridWeek,timeGridDay,timeGridFourDay'
    },
    locale: 'fr',
    events: [],
    defaultView: 'timeGridWeek',
    /*views: {
      timeGridFourDay: {
        weekends: false,
        type: 'timeGrid',
        firstDay: 1,
        dayCount: 5,
        buttonText: 'Semaine de travail'
      }
    },*/
    firstDay: 1,
    eventClick: this.eventClickFCRH.bind(this),
    dateClick: this.dateClickFC.bind(this),
    datesRender: this.onChangeView.bind(this),// Version du FullCalendar inférieur à 6
    datesSet: this.onChangeView.bind(this) // Version du FullCalendar Supérieur à 5
  }
  displayModal = false
  form = new FormGroup({
    user_id: new FormControl(''),
    libelle: new FormControl('Indisponible'),
    type: new FormControl('Indisponible', Validators.required),
    from: new FormControl(new Date(), Validators.required),
    to: new FormControl(new Date(), Validators.required),
  })
  eventClickFCRH(event) {
    this.displayModal = true
    let start = new Date(event.event.start)
    let end = new Date(event.event.end)
    this.form.patchValue({ user_id: this.token.id, from: start, to: end, type: "Indisponible", libelle: "Indisponible" })
  }
  dateClickFC(event: { dateStr: string, allDay: Boolean }) {
    this.displayModal = true
    let start = new Date(event.dateStr)
    let end = new Date(event.dateStr)
    if (event.allDay) {
      start.setHours(8)
      end.setHours(9)
    } else {
      end.setHours(start.getHours() + 1)
    }
    this.form.patchValue({ user_id: this.token.id, from: start, to: end, type: "Indisponible" })
  }

  events: any[] = [];

  addEvent(title: string, start: Date, end: Date, extendedProps: any, type) {
    let backgroundColor = '#1F618D'
    let borderColor = '#17202A'
    if (type == 'Other') {
      //GRIS
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'
    } else if (type == 'Teams') {
      //VIOLET
      backgroundColor = ' #6264A7'
      borderColor = '#2e2f52'
    } else if (type == 'Indisponible') {
      backgroundColor = '#cc3300'
      borderColor = ' #cc0000'
    } else if (type == 'Disponible') {
      backgroundColor = '#33cc33'
      borderColor = '#248f24'
    }
    this.events.push({ title, start, end, backgroundColor, borderColor, extendedProps })
    //  this.events.push({ title: "TEST", date: new Date() })
    this.options.events = this.events
    this.events = Object.assign([], this.events) //Parceque Angular est trop c*n pour voir le changement de la variable autrement
    if (this.actualView != 'dayGridMonth') {
      this.eventsDefault = this.events
    } else {
      this.eventsDefault.push({ title, start, end, backgroundColor, borderColor, extendedProps })
    }
    //this.cd.detectChanges();

  }

  onAddIndispo() {
    this.DispoEtuService.create({ ...this.form.value }).subscribe(r => {
      this.loadEvents()
      this.displayModal = false
      this.form.reset()
    })
  }
  eventsExist(date_start, date_end) {
    let r = false

    let cs = new Date(date_start).getTime() //date to check = req.body.date_debut
    let ce = new Date(date_end).getTime() //date to check = req.body.date_fin
    this.events.forEach(ev => {
      let s = new Date(ev.start).getTime() // debut = temp.date_debut
      let e = new Date(ev.end).getTime() // fin = temp.date_fin
      /*
(date_start < e.start && date_end < e.end && date_start < e.end && e.start < date_end) ||
        (e.start < date_start && e.end < date_end && e.start < date_end && date_start < e.end) ||
        (e.start < date_start && date_end < e.end && date_start < e.end && e.start < date_end) ||
        !(e.start < date_start && e.end < date_start && e.start < date_end && e.end < date_end) ||
        !(date_start < e.start && date_start < e.end && date_end < e.start && date_end < e.end)
      */
      if ((cs == s && e == cs) || (cs >= s && cs < e) || (ce > s && ce <= e)) {
        r = true
      } else if (new Date(ev.start).getDate() == new Date(date_start).getDate() && new Date(ev.start).getMonth() == new Date(date_start).getMonth() && new Date(ev.start).getHours() == new Date(date_start).getHours() && new Date(ev.start).getMinutes() == new Date(date_start).getMinutes()) {
        r = true
      }

    })
    return r
  }
  eventsDefault = []
  actualView = 'timeGridWeek'
  onChangeView(event) {
    this.actualView = event.view.type
    if (event.view.type == 'dayGridMonth') {
      this.eventsDefault = this.events
      let newEvents = []
      console.log(this.events)
      this.events.forEach(val => {
        if (val.extendedProps.type != 'Disponible') {
          val.title = "Indisponible"
          val.backgroundColor = '#cc3300'
          val.borderColor = ' #cc0000'
          newEvents.push(val)
        }

      })
      this.events = Object.assign([], newEvents)
      this.options.events = newEvents
    } else {
      this.events = Object.assign([], this.eventsDefault)
      this.options.events = this.eventsDefault
    }
  }
}
