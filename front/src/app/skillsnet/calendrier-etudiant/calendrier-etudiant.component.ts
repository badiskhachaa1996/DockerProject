import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-calendrier-etudiant',
  templateUrl: './calendrier-etudiant.component.html',
  styleUrls: ['./calendrier-etudiant.component.scss']
})
export class CalendrierEtudiantComponent implements OnInit {
  token;
  user: User;
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
    })
    //Détecter tous les events dans la journée et si y'a aucun alors rajouter un event Disponible
  }

  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: 'fr',
    events: [],
    minTime: '08:00:00',
    firstDay: 1,
    eventClick: this.eventClickFCRH.bind(this),
    dateClick: this.dateClickFC.bind(this),
  }
  displayModal = false
  form = new FormGroup({
    user_id: new FormControl(''),
    type: new FormControl('Indisponible'),
    from: new FormControl(new Date(), Validators.required),
    to: new FormControl(new Date(), Validators.required),
  })
  eventClickFCRH(event) {
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
    console.log(start,end)
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
      backgroundColor = ' #66ffff'
      borderColor = '#00b3b3'
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
    //this.cd.detectChanges();

  }

  onAddIndispo() {

  }
}
