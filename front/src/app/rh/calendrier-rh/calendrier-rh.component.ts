import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayGridMonth from '@fullcalendar/timegrid';
import jwt_decode from 'jwt-decode';
import interactionPlugin from '@fullcalendar/interaction';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendrierRhService } from 'src/app/services/calendrier-rh.service';
import { EventCalendarRH } from 'src/app/models/EventCalendarRH';
import { MessageService } from 'primeng/api';
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
      left: "title",
      right: 'prev,next'
      // left: 'prev,next'
    },
    locale: 'fr',
    timeZone: 'local',
    contentHeight: 500,
    dateClick: this.dateClickFC.bind(this),
    events: [

    ],
    eventDidMount: this.eventToolTip(this),
    defaultView: "dayGridMonth",
    minTime: '08:00:00',
    firstDay: 1,
    selectable: true,
  };

  formAdd = new FormGroup({
    type: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required),
  })
  typeList = [
    { label: 'Jour férié Tunis', value: "Jour férié Tunis" },//BLUE
    { label: 'Jour férié France', value: "Jour férié France" },//YELLOW
    { label: 'Autre événement', value: "Autre événement" },//Violet
  ]
  events = []
  constructor(private CalendrierRHService: CalendrierRhService, private ToastService: MessageService) { }

  dateClickFC(col) {
    //Afficher la popup
    console.log(col)
    this.DataDay = col
    this.displayPopUp = true
  }
  visible = false
  addEvent(event: EventCalendarRH) {
    this.visible = false
    this.events.push({ title: event.type, date: new Date(event.date), allDay: true, backgroundColor: 'green', borderColor: 'dark-green' })
    //this.events.push({ title: "TEST", date: new Date() })
    this.options.events = this.events
    this.visible = true
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
    this.CalendrierRHService.getAll().subscribe(events => {
      events.forEach(ev => { this.addEvent(ev) })
    })
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

}
