import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import { MicrosoftService } from 'src/app/services/microsoft.service';
import { CV } from 'src/app/models/CV';
import frLocale from '@fullcalendar/core/locales/fr';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridMonth from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import jwt_decode from "jwt-decode";
import { Annonce } from 'src/app/models/Annonce';
import { DisponibiliteEtudiant } from 'src/app/models/DisponibiliteEtudiant';
import { CalendrierEtudiantService } from 'src/app/services/calendrier-etudiant.service';

@Component({
  selector: 'app-rdv-calendar-interne',
  templateUrl: './rdv-calendar-interne.component.html',
  styleUrls: ['./rdv-calendar-interne.component.scss']
})
export class RdvCalendarInterneComponent implements OnInit {

  @Input() offre_id
  @Input() ID //ID de l'étudiant avec qui prendre le rdv
  @Output() formExit = new EventEmitter<{ ID: string, offre_id: string }>();
  rdvTaker: User

  form = new FormGroup({
    date: new FormControl('', Validators.required),
    offre_id: new FormControl(null)

  })
  annonces = []
  cv: CV;
  profilePic
  dicPicture
  token;
  USER: { cv_id, lastname, firstname, email, email_perso, winner_email, winner_lastname, winner_firstname, winner_id, profilePic, profile, civilite }
  constructor(private route: ActivatedRoute, private McService: MicrosoftService, private UserService: AuthService,
    private ToastService: MessageService, private router: Router, private MeetingTeamService: MeetingTeamsService,
    private cvservice: CvService, private annonceService: AnnonceService, private DispoEtuService: CalendrierEtudiantService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    if (this.offre_id)
      this.form.patchValue({ offre_id: this.offre_id })
    this.UserService.nstuget(this.ID).subscribe(u => {
      this.USER = u

      this.dicPicture = this.USER.profilePic // {id:{ file: string, extension: string }}
      const reader = new FileReader();
      const byteArray = new Uint8Array(atob(this.dicPicture.file).split('').map(char => char.charCodeAt(0)));
      let blob: Blob = new Blob([byteArray], { type: this.dicPicture.extension })
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        this.profilePic = reader.result;
      }
    })
    this.UserService.getPopulate(this.token.id).subscribe(r => {
      this.rdvTaker = r
    })
    this.cvservice.getByID(this.ID).subscribe((data) => {
      this.cv = data.dataCv;
    })

    if (localStorage.getItem('token')) {
      let token: any = jwt_decode(localStorage.getItem("token"));
      this.UserService.getPopulate(token.id).subscribe(userConnected => {
        this.form.patchValue({ email: userConnected.email_perso, phone: userConnected.phone })
        if (userConnected.type == 'CEO Entreprise' || userConnected.type == 'Tuteur' || userConnected.type == 'Représentant')
          this.annonceService.getAnnoncesByUserId(userConnected._id)
            .then((response: Annonce[]) => {
              response.forEach(ann => {
                this.annonces.push({ label: `${ann.missionName} - ${ann.custom_id}`, value: ann._id })
              })

            })
            .catch((error) => console.error(error));
        else
          this.annonceService.getAnnonces()
            .then((response: Annonce[]) => {
              response.forEach(ann => {
                this.annonces.push({ label: `${ann?.missionName} - ${ann?.custom_id}`, value: ann._id })
              })
            })
            .catch((error) => console.error(error));
      })

    }
    this.loadEvents()
  }

  onSubmit() {
    let student_name = `${this.USER.lastname} ${this.USER.firstname}`;

    let student_email = this.USER?.email;
    if (!student_email)
      student_email = this.USER?.email_perso

    let company_email = this.rdvTaker.email_perso;

    let winner_email = this.USER?.winner_email;

    let meeting_start_date = new Date(this.form.value.date);

    let description = "Entretien d'embauche";

    let meeting_end_date = new Date(meeting_start_date.getTime() + 45 * 60000);

    const event = {
      subject: "Entretien d'embauche - " + student_name,
      body: {
        contentType: 'HTML',
        content: description
      },
      start: {
        dateTime: meeting_start_date,
        timeZone: 'Europe/London'
      },
      end: {
        dateTime: meeting_end_date,
        timeZone: 'Europe/London'
      },
      location: {
        displayName: 'En Ligne'
      },
      attendees: [
        {
          emailAddress: {
            address: company_email,
          },
          type: 'required'
        },
        {
          emailAddress: {
            address: student_email,
            name: student_name
          },
          type: 'required'
        },
        {
          emailAddress: {
            address: winner_email,
            name: `${this.USER.winner_lastname} ${this.USER.winner_firstname}`
          },
          type: 'required'
        }
      ], isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness'
    };
    this.MeetingTeamService.create(new MeetingTeams(null, this.USER?.winner_id, this.ID, null, company_email, meeting_start_date, new Date(), description + "\nNuméro de téléphone de l'entreprise: " + this.form.value.phone, null, null, this.form.value.offre_id)).subscribe(mt => {
      this.ToastService.add({ severity: 'success', summary: 'Le rendez-vous a été enregistré sur IMS' })
      meeting_start_date.setHours(meeting_start_date.getHours() - 1)
      this.DispoEtuService.create(new DisponibiliteEtudiant(null, 'Entretien avec ' + company_email, 'Other', this.ID, meeting_start_date, new Date(meeting_start_date.getTime() + + 3600000))).subscribe(dispoR => {
        this.ToastService.add({ severity: 'success', summary: 'Le rendez-vous a été planifié sur IMS pour l\'étudiant' })
      })
      this.formExit.emit({ ID: this.ID, offre_id: this.offre_id })
      this.McService.createTeamsMeeting(event).then(r => {
        if (r) {
          this.ToastService.add({ severity: 'success', summary: 'Le rendez-vous a été planifié sur TEAMS' })
          this.router.navigate(['/imatch'])
        }

      })

    }, error => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Le rendez-vous a eu un problème', detail: error?.error })
    })

  }
  events: any[] = [];
  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'today,dayGridMonth,timeGridWeek,timeGridDay,timeGridFourDay'
    },
   locale: frLocale,
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
  date_start = new Date()
  date_fin = new Date()
  displayModal = false
  eventClickFCRH(event) {
    this.displayModal = true
    this.date_start = new Date(event.event.start)
    this.date_fin = new Date(event.event.end)
    this.chooseDate()

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
    this.date_start = new Date(start)
    this.date_fin = new Date(end)
    this.chooseDate()
  }
  addEvent(title: string, start: Date, end: Date, extendedProps: any, type) {
    let backgroundColor = '#cc3300'
    let borderColor = '#cc0000'
    if (type == 'Disponible') {
      backgroundColor = '#33cc33'
      borderColor = '#248f24'
    } else if (type == "Other" && extendedProps.isReu) {
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'

    } else {
      title = "Indisponible"
      type = "Indisponible"
    }
    //title = title + start.getTime().toString()
    if (type == "Other") {
      this.events.forEach((val, idx) => {
        if (val.extendedProps.isReu || new Date(val.start).getTime() == new Date(start).getTime()) {
          this.events.splice(idx, 1)
        }
      })
      this.eventsDefault.forEach((val, idx) => {
        if (val.extendedProps.isReu || new Date(val.start).getTime() == new Date(start).getTime()) {
          this.eventsDefault.splice(idx, 1)
        }
      })
    }
    this.events.push({ title, start, end, backgroundColor, borderColor, extendedProps })
    if (this.actualView != 'dayGridMonth') {
      this.eventsDefault = this.events
    } else {
      this.eventsDefault.push({ title, start, end, backgroundColor, borderColor, extendedProps })
    }
    //  this.events.push({ title: "TEST", date: new Date() })
    this.options.events = this.events
    this.events = Object.assign([], this.events) //Parceque Angular est trop c*n pour voir le changement de la variable autrement

    //this.cd.detectChanges();
  }
  eventsDefault = []
  actualView = 'timeGridWeek'
  eventsExist(date_start, date_end, typeExcept = null) {
    let r = false
    let cs = new Date(date_start).getTime() //date to check = req.body.date_debut
    let ce = new Date(date_end).getTime() //date to check = req.body.date_fin
    this.events.forEach(ev => {
      if (typeExcept && ev.extendedProps.type == typeExcept) {

      } else {
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
      }
    })
    return r
  }
  onChangeView(event) {
    this.actualView = event.view.type
    if (event.view.type == 'dayGridMonth') {
      this.eventsDefault = this.events
      let newEvents = []
      this.events.forEach(val => {
        if (val.extendedProps.type != 'Disponible' && !val.extendedProps.isReu) {
          val.title = "Indisponible"
          val.backgroundColor = '#cc3300'
          val.borderColor = ' #cc0000'
          newEvents.push(val)
        } else if (val.extendedProps.isReu) {
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
  loadEvents() {
    this.events = []
    this.DispoEtuService.getAllByUSERID(this.ID).subscribe(mts => {
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

  checkValider = true
  chooseDate() {
    this.date_fin = new Date(this.date_start.getTime() + 3600000)
    this.checkValider = this.date_start.getHours() > 7 && this.date_start.getHours() < 21
    this.checkValider = this.checkValider && !this.eventsExist(new Date(this.date_start), new Date(this.date_start.getTime() + 3600000), "Disponible")
  }
  old_date = null
  onSelectRDV() {

    if (this.old_date) {
      if (this.old_date.getTime() != this.date_start.getTime()) {
        if (this.actualView != 'dayGridMonth')
          this.addEvent("Disponible", new Date(this.old_date), new Date(this.old_date.getTime() + 3600000), { type: "Disponible" }, "Disponible")
        else
          this.eventsDefault.push({
            title: "Disponible", start: new Date(this.old_date), end: new Date(this.old_date.getTime() + 3600000), backgroundColor: '#33cc33', borderColor: '#248f24', extendedProps: { type: "Disponible" }
          })
        this.form.patchValue({ date: this.date_start })
        this.displayModal = false
        this.addEvent("Entretien Choisi", this.date_start, new Date(this.date_start.getTime() + 3600000), { type: "Other", isReu: true }, "Other")
        this.old_date = this.date_start
      } else {
        this.displayModal = false
      }
    } else {
      this.form.patchValue({ date: this.date_start })
      this.displayModal = false
      this.addEvent("Entretien Choisi", this.date_start, new Date(this.date_start.getTime() + 3600000), { type: "Other", isReu: true }, "Other")
      this.old_date = this.date_start
    }

  }

}
