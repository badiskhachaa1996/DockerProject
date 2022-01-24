import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Seance } from '../models/Seance';
import { SeanceService } from '../services/seance.service';
//plugins du calendrier
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-seance',
  templateUrl: './seance.component.html',
  styleUrls: ['./seance.component.css']
})
export class SeanceComponent implements OnInit {

  showFormAddSeance: Boolean = false;
  showFormUpdateSeance: Seance = null;
  seances: Seance[] = [];

  //variables du calendrier
  options: any;
  events: any[];
  ////////////////////////


  seanceForm: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    debut: new FormControl('', Validators.required),
    fin: new FormControl('', Validators.required),
    formateur: new FormControl('', Validators.required),
  });

  seanceFormUpdate: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    debut: new FormControl('', Validators.required),
    fin: new FormControl('', Validators.required),
    formateur: new FormControl('', Validators.required),
  });

  columns = [

  ]


  constructor(private seanceService: SeanceService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.updateList();

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
      contentHeight: 500,
      weekends: false
      
    }
  }

  updateList() {
    this.seanceService.getAll().subscribe((data) => {
      this.seances = data;
    });
  }

  saveSeance() {
    let seance = new Seance(null, this.seanceForm.value.classe, this.seanceForm.value.debut, this.seanceForm.value.fin, this.seanceForm.value.formateur);

    this.seanceService.create(seance).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'La séance a bien été ajouté!' });
      this.seances.push(data)
      this.showFormAddSeance = false;
      this.seanceForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  showModify(rowData: Seance) {
    this.showFormUpdateSeance = rowData;
    this.showFormAddSeance = false;
    this.seanceFormUpdate.setValue({ classe: rowData.classe_id, debut: rowData.date_debut, fin: rowData.date_fin, formateur: rowData.formateur_id });
  }

  modifySeance() {
    let seance = new Seance(this.showFormUpdateSeance._id, this.seanceFormUpdate.value.classe, this.seanceFormUpdate.value.debut, this.seanceFormUpdate.value.fin, this.seanceFormUpdate.value.formateur);

    this.seanceService.update(seance).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'Votre séance a bien été modifié!' });
      this.updateList()
      this.showFormUpdateSeance = null;
      this.seanceFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });
  }


  //Pour naviguer sur le calendrier
  onShowCalendar() {
    this.router.navigate(['seance/calendrier']);
  }

}

