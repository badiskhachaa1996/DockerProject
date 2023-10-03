import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Ticket } from 'src/app/models/Ticket';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { TicketService } from 'src/app/services/ticket.service';
import { saveAs } from "file-saver";
import jwt_decode from "jwt-decode";
import { SocketService } from 'src/app/services/socket.service';
import { SujetService } from 'src/app/services/sujet.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { Task } from 'src/app/models/project/Task';
import { ProjectService } from 'src/app/services/projectv2.service';
import { User } from 'src/app/models/User';
@Component({
  selector: 'app-ticket-non-assignes',
  templateUrl: './ticket-non-assignes.component.html',
  styleUrls: ['./ticket-non-assignes.component.scss']
})
export class TicketNonAssignesComponent implements OnInit {
  constructor(private TicketService: TicketService, private ToastService: MessageService, private UserService: AuthService, private projectService: ProjectService,
    private ServService: ServService, private Socket: SocketService, private SujetService: SujetService, private NotifService: NotificationService) { }
  tickets = []
  ticketUpdate: Ticket;
  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priorite: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)

  })
  task!: Task[];
  userDic = {}
  token;
  filterService = [{ label: 'Tous les services', value: null }]
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getPopulate(this.token.id).subscribe((u: User) => {
      let server_list = []
      u.roles_ticketing_list.forEach((data => {
        if (data.role == 'Responsable')
          server_list.push(data.module)
      }))
      if (u.role != 'Admin') { //TODO Voir si il possède le role Super-Admin dans Ticketing
        this.TicketService.getAllNonAssigneV2(server_list).subscribe(data => {
          this.tickets = data
        })
      } else {
        this.TicketService.getAllNonAssigne().subscribe(data => {
          this.tickets = data
        })
      }

    })

    this.UserService.getAllAgent().subscribe(data => {
      data.forEach(u => {
        this.dropdownMember.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
        this.userDic[u._id] = u
      })
    })
    this.ServService.getAll().subscribe(data => {
      data.forEach(val => {
        this.filterService.push({ label: val.label, value: val._id })
      })
    })
  }
  dropdownMember = []
  TicketAffecter = null
  formAffectation = new FormGroup({
    _id: new FormControl('', Validators.required),
    agent_id: new FormControl('', Validators.required),
    date_limite: new FormControl(''),
    note_assignation: new FormControl(''),
  })
  initAffecter(ticket) {
    this.TicketAffecter = ticket
    this.formAffectation.patchValue({ ...ticket })
    this.UserService.getAllByServiceFromList(ticket.sujet_id.service_id._id).subscribe(data => {
      this.dropdownMember = []
      data.forEach(u => {
        this.dropdownMember.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
      })
    })
  }
  memberSelected: string;
  onAffectation() {
    this.TicketService.update({ ...this.formAffectation.value, statut: "En attente de traitement", assigne_by: this.token.id }).subscribe(data => {
      let d = new Date()
      let month = (d.getUTCMonth() + 1).toString()
      if (d.getUTCMonth() + 1 < 10)
        month = "0" + month
      let day = (d.getUTCDate()).toString()
      if (d.getUTCDate() < 10)
        day = "0" + day
      let year = d.getUTCFullYear().toString().slice(-2);
      this.Socket.NewNotifV2(this.formAffectation.value.agent_id, `Un nouveau ticket vous a été assigné pour le service ${this.TicketAffecter.sujet_id.service_id.label}. Le sujet du ticket est ${this.TicketAffecter.sujet_id.label}. Il vous a été assigné le ${day}/${month}/${year}.`)
      this.TicketService.sendMailAff({ sujet: this.TicketAffecter.sujet_id.label, service: this.TicketAffecter.sujet_id.service_id.label, date: `${day}/${month}/${year}`, agent_email: this.userDic[this.formAffectation.value.agent_id]?.email }).subscribe(() => {

      })
      this.NotifService.create(new Notification(null, null, false, `Un nouveau ticket vous a été assigné pour le service ${this.TicketAffecter.sujet_id.service_id.label}. Le sujet du ticket est ${this.TicketAffecter.sujet_id.label}. Il vous a été assigné le ${day}/${month}/${year}.`, new Date(), this.formAffectation.value.agent_id, this.TicketAffecter.sujet_id.service_id._id)).subscribe(() => { console.log('SUCCES') })
      this.tickets.splice(this.tickets.indexOf(this.TicketAffecter), 1)
      //verfier si c'est une tache alors modifier la tache
      this.projectService.getTaskbyticket(this.TicketAffecter._id)
        .then(data => { if (data) { data.attribuate_to = this.formAffectation.value.agent_id; data.etat = "En attente de traitement"; this.projectService.putTask(data); } });
      this.TicketAffecter = null
      this.ToastService.add({ severity: 'success', summary: "Affectation du ticket avec succès" })
    })




  }

  getAttente(temp_date) {
    let date_creation = new Date(temp_date).getTime()
    let total = new Date().getTime() - date_creation
    let day = Math.floor(total / 86400000)
    total = total % 86400000
    let hours = Math.floor(total / 3600000)
    total = total % 3600000
    let minutes = Math.floor(total / 60000)
    return `${day}J ${hours}H${minutes}m`
  }
  downloadFile(index, ri: Ticket) {
    this.TicketService.downloadFile(ri._id, ri.documents[index]._id, ri.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), ri.documents[index].path)
    }, (error) => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }
  deleteFile(index, ri: Ticket) {
    ri.documents.splice(index, 1)
    this.TicketService.update({ _id: ri._id, documents: ri.documents }).subscribe(data => {

      this.ToastService.add({ severity: 'success', summary: 'Documents supprimé' })
    })
  }

  downloadFileService(index, ri: Ticket) {
    this.TicketService.downloadFile(ri._id, ri.documents[index]._id, ri.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), ri.documents[index].path)
    }, (error) => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }

  deleteFileService(index, ri: Ticket) {
    ri.documents_service.splice(index, 1)
    this.TicketService.update({ _id: ri._id, documents_service: ri.documents_service }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: 'Documents supprimé' })
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
}
