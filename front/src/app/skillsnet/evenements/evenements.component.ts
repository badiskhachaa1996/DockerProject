import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Evenements } from 'src/app/models/Evenements';
import jwt_decode from 'jwt-decode';
import { EvenementsService } from 'src/app/services/skillsnet/evenements.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-evenements',
  templateUrl: './evenements.component.html',
  styleUrls: ['./evenements.component.scss']
})
export class EvenementsComponent implements OnInit {
  events: Evenements[] = []
  token;
  typeList = [
    { label: "POP", value: "POP" },
    { label: "Ateliers", value: "Ateliers" },
    { label: "Event", value: "Event" },
    { label: "Autre", value: "Autre" },
  ]
  tl = ["POP", "Ateliers", "Event"]
  showAdd = false
  showUpdate = false
  showInscrit: Evenements;
  dropdownInscrit = []
  formAddEvent: FormGroup = new FormGroup({
    nom: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    date_lieu: new FormControl(''),
    autre: new FormControl('')
  })

  formUpdateEvent: FormGroup = new FormGroup({
    nom: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    date_lieu: new FormControl(''),
    autre: new FormControl(''),
    _id: new FormControl('', Validators.required)
  })

  formInscritEvent: FormGroup = new FormGroup({
    liste_inscrit: new FormControl('', [Validators.required]),
    _id: new FormControl('', Validators.required)
  })
  constructor(public EventService: EvenementsService, private messageService: MessageService, private UserService: AuthService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.EventService.getAll().subscribe(events => {
      this.events = events
    })
    this.UserService.getAll().subscribe(users => {

    })
  }

  onAddEvent() {
    let type = this.formAddEvent.value.type
    if (type == "Autre" && this.formAddEvent.value.autre)
      type = this.formAddEvent.value.autre
    let event = {
      nom: this.formAddEvent.value.nom,
      type,
      date_creation: new Date(),
      created_by: this.token.id,
      description: this.formAddEvent.value.description,
      date_lieu: this.formAddEvent.value.date_lieu
    }
    this.EventService.create(event).subscribe(evenement => {
      this.events.push(evenement)
      this.formAddEvent.reset()
      this.showAdd = false
      this.messageService.add({ summary: 'Ajout de l\'évenement avec succès', severity: 'success' })
    })
  }

  onUpdateEvent() {
    let type = this.formUpdateEvent.value.type
    if (type == "Autre" && this.formUpdateEvent.value.autre)
      type = this.formUpdateEvent.value.autre
    let event = {
      nom: this.formUpdateEvent.value.nom,
      type,
      description: this.formUpdateEvent.value.description,
      date_lieu: this.formUpdateEvent.value.date_lieu
    }
    this.EventService.update(this.formUpdateEvent.value._id, event).subscribe(evenement => {
      this.events.splice(this.includesId(evenement._id), 1, evenement)
      this.formUpdateEvent.reset()
      this.showUpdate = false
      this.messageService.add({ summary: 'Mis à jour de l\'évenement avec succès', severity: 'success' })
    })
  }

  onAddInscrit() {
    this.EventService.updateInscrit(this.formInscritEvent.value._id, this.formInscritEvent.value.liste_inscrit).subscribe(evenement => {
      this.events.splice(this.includesId(evenement._id), 1, evenement)
      this.formInscritEvent.reset()
      this.showInscrit = null
      this.messageService.add({ summary: 'Mis à jour des inscrits de l\'évenement avec succès', severity: 'success' })
    })
  }

  InitUpdateForm(event) {
    let autre = ""
    let type = event.type
    if (!this.tl.includes(event.type)) {
      autre = event.type
      type = "Autre"
    }


    this.formUpdateEvent.setValue({
      nom: event.nom,
      type,
      description: event.description,
      date_lieu: event.date_lieu,
      autre,
      _id: event._id
    })
    this.showUpdate = true
  }

  includesId(id: string) {
    let r = -1
    this.events.forEach((val, index) => {
      if (val._id == id)
        r = index
    })
    return r
  }

  InitAddInscrit(event: Evenements) {
    let inscrits = []
    event.list_inscrit.forEach(user => {
      inscrits.push(user._id)
    })
    this.formInscritEvent.setValue({
      _id: event._id,
      liste_inscrit: inscrits
    })
    this.showInscrit = event
  }

}
