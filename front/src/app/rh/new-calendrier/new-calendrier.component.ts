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

@Component({
  selector: 'app-new-calendrier',
  templateUrl: './new-calendrier.component.html',
  styleUrls: ['./new-calendrier.component.scss']
})
export class NewCalendrierComponent implements OnInit {
  indexTabView = 0
  siteSelected = []
  eventGlobal = []
  eventUsers = []
  userSelected: User
  filter_value = {
    absence: true,
    autorisation: true,
    tunis_ferie: true,
    france_ferie: true,
    autre: true,
    present: true,
    cours: true
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
  collaborateurList = []

  optionsGlobal = {
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
    eventClick: this.eventClickGlobal.bind(this),
    dateClick: this.dateClickGlobal.bind(this),
    events: [],
    //eventDidMount: this.eventToolTip(this),
    defaultView: "dayGridMonth",
    minTime: '08:00:00',
    firstDay: 1,
    selectable: true,
  };

  optionsUsers = {
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
    eventClick: this.eventClickGlobal.bind(this),
    dateClick: this.dateClickGlobal.bind(this),
    events: [],
    //eventDidMount: this.eventToolTip(this),
    defaultView: "dayGridMonth",
    minTime: '08:00:00',
    firstDay: 1,
    selectable: true,
  };
  constructor(private rhService: RhService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.rhService.getCollaborateurs()
      .then((response) => {
        response.forEach(c => {
          if (c.user_id)
            this.collaborateurList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c.user_id._id })
        })
      })
      .catch((error) => { this.ToastService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
  }

  dateClickGlobal(col) {
  }
  eventClickGlobal(event) {
    /*
    Si Global :
    Si Type == 'Absent' => Affiché les Collaborateurs qui sont Absents
    Si Type == 'Autorisation' => Affiché les Collaborateurs qui sont en congé autorisé

        Si User :
RIEN
    */
  }

  changeSite(e) {

  }
  changeUser(e) {

  }

  loadEvents() {

  }


}
