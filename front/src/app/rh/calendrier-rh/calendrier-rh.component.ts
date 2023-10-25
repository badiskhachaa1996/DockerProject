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
@Component({
  selector: 'app-calendrier-rh',
  templateUrl: './calendrier-rh.component.html',
  styleUrls: ['./calendrier-rh.component.scss']
})
export class CalendrierRhComponent implements OnInit {
  options = {
    plugins: [dayGridPlugin, dayGridMonth, interactionPlugin],
    defaultDate: new Date(),
    titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
    header: {
      right: 'prev,next',
      left: 'today,dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: frLocale,
    timeZone: 'local',
    contentHeight: 500,
    eventClick: this.eventClickFC.bind(this),
    dateClick: this.dateClickFC.bind(this),
    events: [

    ],
    eventDidMount: this.eventToolTip(this),
    defaultView: "dayGridMonth",
    minTime: '08:00:00',
    firstDay: 1,
    selectable: true,
  };

  ID = this.route.snapshot.paramMap.get('id');

  formAdd = new FormGroup({
    type: new FormControl('', Validators.required),
    note: new FormControl(''),
  })

  formUpdate = new FormGroup({
    type: new FormControl('', Validators.required),
    note: new FormControl(''),
    _id: new FormControl('', Validators.required)
  })
  typeList = [
    { label: 'Jour férié Tunis', value: "Jour férié Tunis" },//BLUE
    { label: 'Jour férié France', value: "Jour férié France" },//YELLOW
    { label: 'Autre événement', value: "Autre événement" },//Violet
  ]
  events = []
  constructor(private CalendrierRHService: CalendrierRhService, private ToastService: MessageService,
    private dailyCheckService: DailyCheckService, private congeService: CongeService, private route: ActivatedRoute) { }

  dateClickFC(col) {
    this.DataDay = col
    this.displayPopUp = true
  }
  eventClickFC(event) {
    this.displayData = true
    this.dataEvent = event.event.extendedProps;
    //console.log(event)
  }
  addEvent(event: EventCalendarRH) {
    let backgroundColor = '#1F618D'
    let borderColor = '#17202A'
    if (event.type == 'Jour férié France') {
      backgroundColor = '#D4AC0D'
      borderColor = '#D35400'
    } else if (event.type == 'Autre événement') {
      backgroundColor = '#9B59B6'
      borderColor = '#8E44AD'
    } else if (event.type == "Congé Validé") {
      backgroundColor = '#1ABC9C'
      borderColor = '#186A3B'
    } else if (event.type == "Absence Non Justifié") {
      backgroundColor = '#E74C3C'
      borderColor = '#7B241C'
    }
    this.events.push({ title: event.type, date: new Date(event.date), allDay: true, backgroundColor, borderColor, extendedProps: { ...event } })
    //  this.events.push({ title: "TEST", date: new Date() })
    this.options.events = this.events
    this.events = Object.assign([], this.events) //Parceque Angular est trop c*n pour voir le changement de la variable autrementF
    //this.cd.detectChanges();

  }

  DataDay: {
    date: Date,
    dateStr: string,
    allDay: Boolean
  };
  displayPopUp = false
  token;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.reloadCalendar()

  }

  onSave() {
    this.CalendrierRHService.create({ ...this.formAdd.value, created_by: this.token.id, date: this.DataDay.date }).subscribe(newEvent => {
      this.addEvent(newEvent)
      this.formAdd.reset()
      this.displayPopUp = false
      this.DataDay = null
      this.ToastService.add({ severity: 'success', summary: 'Ajout d\'un événement avec succès' })
    })
  }

  eventToolTip(ev) {
    //https://fullcalendar.io/docs/event-tooltip-demo
  }

  displayData = false
  dataEvent: EventCalendarRH;
  showEdit = false
  onInitUpdate() {
    this.showEdit = true
    this.formUpdate.patchValue({ ...this.dataEvent })
  }

  onDelete() {
    this.CalendrierRHService.delete(this.dataEvent._id).subscribe(d => {
      this.reloadCalendar()
      this.displayData = false
      this.dataEvent = null
    })
  }

  onUpdate() {
    this.CalendrierRHService.update({ ...this.formUpdate.value }).subscribe(d => {
      this.dataEvent = d
      this.reloadCalendar()
      this.showEdit = false
      this.formUpdate.reset()
    })
  }

  reloadCalendar() {
    this.events = []
    if (this.ID)
      this.loadCalendar()
    else {
      this.CalendrierRHService.getAll().subscribe(events => {
        events.forEach(ev => { this.addEvent(ev) })

      })
      //this.loadEverything()
    }

  }

  loadCalendar() {
    this.events = []
    this.CalendrierRHService.getAll().subscribe(events => {
      events.forEach(ev => { this.addEvent(ev) })
      this.dailyCheckService.getUserChecks(this.ID).then(dcs => {
        this.congeService.getAllByUserId(this.ID).then(conges => {
          //Si conge Vert Si Check Rien Si Weekend Rien Si Absence de check hors Weekend alors Rouge
          let congesList: Date[] = []
          let absencesList: Date[] = []
          let presencesList: Date[] = []
          conges.forEach(c => {
            let dateC = new Date(c.date_debut)
            dateC.setDate(dateC.getDate() - 1)
            while (dateC < new Date(c.date_fin)) {
              congesList.push(new Date(dateC))
              this.addEvent(new EventCalendarRH(null, dateC, "Congé Validé", "Nous vous souhaitons de bonnes congés, couper votre téléphone, ne pensez pas au travail et reposez-vous bien!", null))
              dateC.setDate(dateC.getDate() + 1)
            }
          })
          dcs.forEach(dc => {
            presencesList.push(new Date(dc.check_in))
          })
          let dateDebut = new Date()
          let dateEnd = new Date()
          dateEnd.setFullYear(dateEnd.getFullYear() - 1)
          console.log(congesList, conges)
          while (dateEnd < dateDebut) {
            if (dateDebut.getDay() != 0 && dateDebut.getDay() != 6) {
              //Vérifier si il a été présent ou si il a été en congé 
              if (presencesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                congesList.find(d => (d.getDate() == dateDebut.getDate() && d.getMonth() == dateDebut.getMonth())) == undefined &&
                events.find(d => (new Date(d.date).getDate() == dateDebut.getDate() && new Date(d.date).getMonth() == dateDebut.getMonth())) == undefined) {
                absencesList.push(dateDebut)
                this.addEvent(new EventCalendarRH(null, dateDebut, "Absence Non Justifié", "Contacté la RH pour régulariser votre Absence ou via l'onglet 'Demande de congé / autorisation' de votre dashboard", null))
              } else {
                //console.log(dateDebut,events)
              }
            }
            dateDebut.setDate(dateDebut.getDate() - 1)
          }
        })
      })
    })

  }
}
