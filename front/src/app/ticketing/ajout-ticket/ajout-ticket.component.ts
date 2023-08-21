import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';
import mongoose from 'mongoose';
import { FileUpload } from 'primeng/fileupload';
import { SocketService } from 'src/app/services/socket.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/notification';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Task} from 'src/app/models/project/Task';
import { ProjectService } from 'src/app/services/projectv2.service';
@Component({
  selector: 'app-ajout-ticket',
  templateUrl: './ajout-ticket.component.html',
  styleUrls: ['./ajout-ticket.component.scss']
})
export class AjoutTicketComponent implements OnInit {

  receivedTask: Task;
  itsTask:boolean = false;
  taskID:string;

  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priorite: new FormControl('', Validators.required)
  })
  token;
  sujetDropdown: any[] = [
  ];
  serviceDropdown: any[] = [
  ];;
  // Haute priorité / Moyenne priorité / Basse priorité / Priorité normale
  prioriteDropdown: any[] = [
    { label: 'Priorité normale', value: "Priorité normale" },
    { label: 'Basse priorité', value: "Basse priorité" },
    { label: 'Moyenne priorité', value: "Moyenne priorité" },
    { label: 'Haute priorité', value: "Haute priorité" },
  ];
  onAdd() {
    let documents = []
    this.uploadedFiles.forEach(element => {
      documents.push({ path: element.name, name: element.name, _id: new mongoose.Types.ObjectId().toString() })
    });
    this.TicketService.create({ ...this.TicketForm.value, documents, id: this.token.id }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: 'Création du ticket avec succès' })

      let d = new Date()
      this.Socket.NewNotifV2('Ticketing - Super-Admin', `Un nouveau ticket a été crée pour le service ${this.serviceDic[this.TicketForm.value.service_id]}, dont le ${this.sujetDic[this.TicketForm.value.sujet_id]} le ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} par ${this.USER.lastname} ${this.USER.firstname}`)
      this.NotificationService.createV2(new Notification(null, null, false, `Un nouveau ticket a été crée pour le service ${this.serviceDic[this.TicketForm.value.service_id]}, dont le ${this.sujetDic[this.TicketForm.value.sujet_id]} le ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} par ${this.USER.lastname} ${this.USER.firstname}`, new Date(), null, this.TicketForm.value.service_id), 'Ticketing', "Super-Admin").subscribe(test => { console.log(test) })
      this.TicketForm.reset()
      this.uploadedFiles.forEach((element, idx) => {
        let formData = new FormData()
        formData.append('ticket_id', data.doc._id)
        formData.append('document_id', documents[idx]._id)
        formData.append('file', element)
        formData.append('path', element.name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès', detail: element.name })
        })
      });
    if(this.itsTask){
      
      this.projectService.getTask(this.taskID).then((datat) => {
        console.log(1111111111111);
        console.log(data.doc._id);
        datat.ticketId=data.doc._id;
        console.log(datat.ticketId);
        this.projectService.putTask(datat)   
        }) 

    }
    })
  }
  onSelectService() {
    this.sujetDropdown = []
    this.SujetService.getAllByServiceID(this.TicketForm.value.service_id).subscribe(data => {
      data.forEach(val => {
        this.sujetDropdown.push({ label: val.label, value: val._id })
      })
    })
  }
  uploadedFiles: File[] = []
  onUpload(event: { files: File[] }, fileUpload: FileUpload) {
    this.uploadedFiles.push(event.files[0])
    fileUpload.clear()
  }
  constructor(private TicketService: TicketService, private ToastService: MessageService, private ServService: ServService, private router: Router, private route: ActivatedRoute,
    private SujetService: SujetService, private Socket: SocketService, private AuthService: AuthService, private NotificationService: NotificationService,private projectService: ProjectService) { }
  serviceDic = {}
  sujetDic = {}
  USER: User
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.AuthService.getPopulate(this.token.id).subscribe(data => {
      this.USER = data
    })
    this.SujetService.getAll().subscribe(data => {
      data.forEach(element => {
        this.sujetDic[element._id] = element.label
      });
    })
    if (this.router.url.startsWith('/ticketing-igs')) {
      //Charger les sujets et services IGS
      this.ServService.getAll().subscribe(data => {
        data.forEach(val => {
          if(val.label.startsWith('IGS')){
            this.serviceDropdown.push({ label: val.label, value: val._id })
            this.serviceDic[val._id] = val.label
          }
        })
      })
    } else {
      this.ServService.getAll().subscribe(data => {
        data.forEach(val => {
          if(!val.label.startsWith('IGS')){
            this.serviceDropdown.push({ label: val.label, value: val._id })
            this.serviceDic[val._id] = val.label
          }
        })
      })
    }
    this.route.queryParams.subscribe(params => {
      if (params && params.data) {
        this.receivedTask = JSON.parse(params.data);
        this.itsTask=true;
        this.taskID = this.receivedTask._id; 
        this.TicketForm.patchValue({
          description: this.receivedTask.libelle + ' :'+ this.receivedTask.description_task,
          priorite: this.receivedTask.priorite,
          
        })
         
      }
    });

  }
}
