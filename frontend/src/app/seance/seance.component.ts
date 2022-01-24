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
import { ClasseService } from '../services/classe.service';
import { Classe } from '../models/Classe';
import { Formateur } from '../models/Formateur';
import { FormateurService } from '../services/formateur.service';
import { Matiere } from '../models/Matiere';
import { MatiereService } from '../services/matiere.service';


@Component({
  selector: 'app-seance',
  templateUrl: './seance.component.html',
  styleUrls: ['./seance.component.css']
})
export class SeanceComponent implements OnInit {

  showFormAddSeance: Boolean = false;
  showFormUpdateSeance: Seance = null;
  seanceFormUpdate: FormGroup;
  seances: Seance[] = [];

  //variables du calendrier
  options: any;
  events: any[];
  ////////////////////////

  classes: Classe[] = [];
  dropdownClasse: any[] = [{ nom: '', value: '' }];
  classToModif: string;

  formateurs: Formateur[] = [];
  dropdownFormateur: any[] = [{ nom: '', value: '' }];

  matieres: Matiere[] = [];
  dropdownMatiere: any[] = [{ nom: '', value: '' }];
  matiereToModif: string;

  //Evenement lié au calendrier
  seancesCal: any[] = [];

  infosSeances: string;


  seanceForm: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    matiere: new FormControl('', Validators.required),
    libelle: new FormControl(''),
    debut: new FormControl('', Validators.required),
    fin: new FormControl('', Validators.required),
    formateur: new FormControl('', Validators.required),
  });


  constructor(private matiereService: MatiereService, private formateurService: FormateurService, private seanceService: SeanceService, private classeService: ClasseService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.updateList();

    //remplissage de la liste des Matières
    this.matiereService.getAll().subscribe(
      ((response) => {
        response.forEach(item => {
          this.dropdownMatiere.push({ nom: item.nom, value: item._id });
          this.matieres[item._id] = item;
        })
      }),
      ((error) => { console.log(error) })
    );

    //Remplissage de la liste des formateurs
    this.formateurService.getAllUser().subscribe(
      ((response) => {
        for (let formateurId in response) {
          this.dropdownFormateur.push({ nom: response[formateurId].firstname + ' ' + response[formateurId].lastname, value: response[formateurId]._id });
          this.formateurs[response[formateurId]._id] = response[formateurId];
        }
      }),
      ((error) => { console.log(error) })
    );

    //Remplissage de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(item => {
          this.dropdownClasse.push({ nom: item.nom, value: item._id });
          this.classes[item._id] = item;
        });

      }),
      ((error) => { console.log(error) })
    );

    this.seanceService.getAll().subscribe(
      (datas) => {
        this.seancesCal = [];
        for (let data of datas) {
          this.seancesCal.push({
            "id": data._id,
            "title": data.infos,
            "start": data.date_debut,
            "end": data.date_fin,
            "extendedProps": {
              "description":data.infos
            }
          });
        }
        this.options.events = this.seancesCal
        this.events = this.seancesCal;

      },
    );


    //Options du calendrier
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin ],
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
      eventClick: function (col) {
        console.log(col.event)
        alert(col.event.extendedProps.description + "\n de " + col.event.start.getHours() + "h" + col.event.start.getMinutes() + " à " + col.event.end.getHours() + "h" + col.event.end.getMinutes());   
      },
      eventMouseEnter: function (col) {
        // changement de couleur
        col.el.style.borderColor = 'red';
      },
      eventMouseLeave: function (col) {
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
      this.seancesCal = [];
      for (let d of data) { 
        if(!d.libelle || d.libelle==""){
          this.seancesCal.push({
            "id": d._id,
            "title": d.infos,
            "start": d.date_debut,
            "end": d.date_fin,
            "extendedProps": {
              "description":d.infos
            }
          });
        }else{
          this.seancesCal.push({
            "id": d._id,
            "title": d.libelle,
            "start": d.date_debut,
            "end": d.date_fin,
            "extendedProps": {
              "description":d.infos
            }
          });
        }
      }
      this.options.events = this.seancesCal;
      this.events = this.seancesCal;
    });
  }

  saveSeance() {

    let seance = new Seance(null, this.seanceForm.value.classe.value, this.seanceForm.value.matiere.value, this.seanceForm.value.libelle, this.seanceForm.value.debut, this.seanceForm.value.fin, this.seanceForm.value.formateur.value, 'classe: ' + this.seanceForm.value.classe.nom + ' Formateur: ' + this.seanceForm.value.formateur.nom);

    this.seanceService.create(seance).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'La séance a bien été ajouté!' });
      this.updateList()
      this.showFormAddSeance = false;
      this.seanceForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  showModify(rowData: Seance) {

    this.seanceFormUpdate = new FormGroup({
      classe: new FormControl('', Validators.required),
      matiere: new FormControl('', Validators.required),
      libelle: new FormControl(''),
      debut: new FormControl('', Validators.required),
      fin: new FormControl('', Validators.required),
      formateur: new FormControl('', Validators.required),
    });

    this.showFormUpdateSeance = rowData;
    this.showFormAddSeance = false;
    this.seanceFormUpdate.patchValue({libelle: rowData.libelle}); //STRING
    this.seanceFormUpdate.patchValue({debut: new Date(rowData.date_debut).toISOString().slice(0, 16), fin:  new Date(rowData.date_fin).toISOString().slice(0, 16)});//DATE
    this.seanceFormUpdate.patchValue({classe: {nom:this.classes[rowData.classe_id].nom,value:rowData.classe_id}, matiere: {nom:this.matieres[rowData.matiere_id].nom,value:rowData.matiere_id}, formateur: {nom:this.formateurs[rowData.formateur_id].firstname+" "+this.formateurs[rowData.formateur_id].lastname,value:rowData.formateur_id} });//DROPDOWN ID
  }

  modifySeance() {
    let seance = new Seance(this.showFormUpdateSeance._id, this.seanceFormUpdate.value.classe.value, this.seanceFormUpdate.value.matiere.value, this.seanceFormUpdate.value.libelle, this.seanceFormUpdate.value.debut, this.seanceFormUpdate.value.fin, this.seanceFormUpdate.value.formateur.value, 'classe: ' + this.seanceFormUpdate.value.classe.nom + ' Formateur: ' + this.seanceFormUpdate.value.formateur.nom);

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

