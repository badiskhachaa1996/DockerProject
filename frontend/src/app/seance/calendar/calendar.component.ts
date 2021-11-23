import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SeanceService } from 'src/app/services/seance.service';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

    //variables du calendrier
    options: any;
    events: any[];
    ////////////////////////

  constructor(private seanceService: SeanceService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    
    //Evenement lié au calendrier
    let seancesCal: any[] = [];

    this.seanceService.getAll().subscribe(
      (datas) => {
        for (let data of datas) {
          seancesCal.push({
            "id": data._id,
            "title": "Classe: " + data.classe_id + " Formateur:" + data.formateur_id,
            "start": data.date_debut,
            "end": data.date_fin
          });
        }

        this.events = seancesCal;
      },
    );


    //Options du calendrier
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: new Date(),
      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'today,dayGridMonth,timeGridDay'
      },
      footer: {
        left: 'prev,next',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      eventClick: function(col) {
        alert(col.event.title + "\n de " + col.event.start.getHours() + "h" + col.event.start.getMinutes() + " à " + col.event.end.getHours() + "h" + col.event.end.getMinutes());
      },
      eventMouseEnter: function(col) {
        // changement de couleur
        col.el.style.borderColor = 'red';
      },
      eventMouseLeave: function(col) {
        // changement de couleur
        col.el.style.borderColor = 'white';
      },
    
      locale: 'fr',
      timeZone: 'local',
      contentHeight: 550,
      weekends: false
      
    }

  }

  //Liste des séances
  onShowSeance()
  {
    this.router.navigate(['/seance']);
  }
}
