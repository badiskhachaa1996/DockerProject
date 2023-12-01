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
@Component({
  selector: 'app-mes-rendez-vous',
  templateUrl: './mes-rendez-vous.component.html',
  styleUrls: ['./mes-rendez-vous.component.scss']
})
export class MesRendezVousComponent implements OnInit {
  token;
  meetings: MeetingTeams[] = []
  constructor(private MeetingTeamsService: MeetingTeamsService, private ToastService: MessageService,
    private AuthService: AuthService, private viewportScroller: ViewportScroller, private router: Router,
    private CVService: CvService) { }
  user: User
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.AuthService.getPopulate(this.token.id).subscribe(user => {
      this.user = user
      this.loadEvents()
    })

  }
  loadEvents() {
    this.events = []
    this.MeetingTeamsService.getAllByEmail(this.user.email_perso).subscribe(mts => {
      this.meetings = mts
      mts.forEach(mt => {
        this.addEvent(mt)
      })
    })
  }

  form = new FormGroup({
    statut: new FormControl('', Validators.required)
  })

  rdvToUpdate: MeetingTeams
  meetingSelected: MeetingTeams
  showForm

  statutDropdown = [
    { label: "Planifié", value: "Planifié" },
    { label: "Validé par le candidat", value: "Validé par le candidat" },
    { label: "Annulé", value: "Annulé" },
    { label: "Fait", value: "Fait" },
  ]

  onInitUpdate(rdv: MeetingTeams) {
    this.form.patchValue({ statut: rdv.statut })
    this.rdvToUpdate = rdv
    this.scrollToTop()
  }

  onInitCustom(rdv: MeetingTeams, type = 'Note') {
    this.showForm = type
    this.meetingSelected = rdv
    this.scrollToTop()
  }

  onUpdateCustom() {
    this.MeetingTeamsService.update({ ...this.meetingSelected }).subscribe(r => {
      this.showForm = null
      this.loadEvents()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour du rendez-vous avec succès' })
    })
  }

  onUpdate() {
    this.MeetingTeamsService.update({ _id: this.rdvToUpdate._id, ...this.form.value }).subscribe(r => {
      this.meetings[this.meetings.indexOf(this.rdvToUpdate)].statut = this.form.value.statut
      this.form.reset()
      this.rdvToUpdate = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour du rendez-vous avec succès' })
    })
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  onCancel(rdv: MeetingTeams) {   
    this.MeetingTeamsService.update({ ...rdv, statut: 'Annulé' }).subscribe(r => {
      this.form.reset()
      this.rdvToUpdate = null
      this.loadEvents()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour du rendez-vous avec succès' })
    })
  }

  annonceSelected: Annonce
  visibleSidebar = false
  seeOffer(rdv: MeetingTeams) {
    this.annonceSelected = rdv.offre_id;
    this.visibleSidebar = true
  }
  seeCV(rdv: MeetingTeams) {
    if (rdv?.cv_id)
      this.router.navigate(['skillsnet/cv', rdv.cv_id._id])
    else
      this.CVService.getCvbyUserId(rdv.user_id._id).subscribe(r => {
        if (r)
          this.router.navigate(['skillsnet/cv', r._id])
        else
          this.ToastService.add({ severity: 'error', summary: "Impossible de trouver le CV", detail: "L'étudiant l'a peut être supprimé, merci de le contacter à " + rdv?.user_id?.email + " ou " + rdv?.user_id?.email_perso })
      })
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
   locale: frLocale,
    events: [],
    minTime: '08:00:00',
    firstDay: 1,
    eventClick: this.eventClickFCRH.bind(this),
    dateClick: this.dateClickFC.bind(this),
  }

  eventClickFCRH(event) {
    //console.log(event.event.extendedProps)
    this.meetings = []
    this.meetings.push(event.event.extendedProps)
    /*this.options.events.forEach(ev => {
      if (new Date(event.event.start).toLocaleDateString() == new Date(ev.start).toLocaleDateString())
        this.meetings.push(ev.extendedProps)
    })*/
    this.viewportScroller.scrollToAnchor('dt1');
  }
  dateClickFC(event) {
    //console.log(event)
    this.meetings = []
    this.options.events.forEach(ev => {
      if (new Date(event.dateStr).toLocaleDateString() == new Date(ev.start).toLocaleDateString())
        this.meetings.push(ev.extendedProps)
    })
    this.viewportScroller.scrollToAnchor('dt1');
  }

  events: any[] = [];

  addEvent(event: MeetingTeams) {
    let backgroundColor = '#1F618D'
    let borderColor = '#17202A'
    if (event.statut == 'Planifié') {
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'
    } else if (event.statut == 'Validé par le candidat') {
      backgroundColor = ' #66ffff'
      borderColor = '#00b3b3'
    } else if (event.statut == 'Annulé') {
      backgroundColor = '#cc3300'
      borderColor = ' #cc0000'
    } else if (event.statut == 'Fait') {
      backgroundColor = '#33cc33'
      borderColor = '#248f24'
    }
    let end = new Date(new Date(event.meeting_start_date).getTime() + 45 * 60000);
    this.events.push({ title: `${event.user_id.firstname} ${event.user_id.lastname} - ${event?.offre_id?.missionName}`, start: new Date(event.meeting_start_date), end, backgroundColor, borderColor, extendedProps: { ...event } })
    //  this.events.push({ title: "TEST", date: new Date() })
    this.options.events = this.events
    this.events = Object.assign([], this.events) //Parceque Angular est trop c*n pour voir le changement de la variable autrement
    //this.cd.detectChanges();

  }


}
