import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Task } from 'src/app/models/project/Task';
import { Project } from 'src/app/models/Project';
import { ProjectService } from 'src/app/services/projectv2.service';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";
import { Ticket } from 'src/app/models/Ticket';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { DataViewModule, DataViewLayoutOptions } from 'primeng/dataview';
import { FormControl, FormGroup } from '@angular/forms';
import { saveAs } from "file-saver";
import mongoose from 'mongoose';
import { RhService } from 'src/app/services/rh.service';
import { Label } from 'src/app/models/project/Label';
@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss']
})
export class MytaskComponent implements OnInit {
  token;
  USER: User
  taskToDo: Task[] = []
  taskDoing: Task[] = []
  taskDone: Task[] = []
  userList: any[] = []
  constructor(private userService: AuthService, private ToastService: MessageService, private projectService: ProjectService, private rhService: RhService) { }
  showLabelConfig = false
  labels: Label[] = []
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.getAllInformation();
  }
  //recuperation des information  
  getAllInformation() {
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => {
        this.USER = response;
        this.projectService.getTaskbyagent(this.token.id).then(tasks => {
          console.log(tasks)
          tasks.forEach(d => {
            if (d.etat === "En attente de traitement") {
              this.taskToDo.push(d);
            } else if (d.etat === "En cours de traitement") {
              this.taskDoing.push(d);
            } else { this.taskDone.push(d) }
          })

        })
      }
    })

    this.rhService.getAgents().then(data => {
      data.forEach(user => {
        if (user.type === "Collaborateur") {
          this.userList.push({ label: `${user.firstname} ${user.lastname} | ${user.type}`, value: user })
        }
      })
    })

    this.projectService.getLabels().subscribe(data => {
      this.labels = data
    })
  }
  TaskToShow: Task
  displayTache = false
  // Affichage tache
  onShowTache(task: Task) {
    this.TaskToShow = task;
    this.displayTache = true;
  }

  ToDoing(t: Task) {
    if (t.etat === "En attente de traitement") {
      const indexToRemove = this.taskToDo.findIndex(task => task._id === t._id);
      if (indexToRemove !== -1)
        this.taskToDo.splice(indexToRemove, 1);
    } else {
      const indexToRemove = this.taskDone.findIndex(task => task._id === t._id);
      if (indexToRemove !== -1)
        this.taskDone.splice(indexToRemove, 1);
    }
    t.etat = "En cours de traitement"
    this.taskDoing.push(t);
    this.projectService.putTask(t).then(resultat => {
      this.ToastService.add({ severity: 'success', summary: 'success', detail: ' Doing' })
    });
  }

  //passer une tache a Done
  ToDone(t: Task) {
    const indexToRemove = this.taskDoing.findIndex(task => task._id === t._id);
    if (indexToRemove !== -1)
      this.taskDoing.splice(indexToRemove, 1)
    t.etat = "Traiter"
    this.taskDone.push(t);
    this.projectService.putTask(t).then(resultat => {
      this.ToastService.add({ severity: 'success', summary: 'success', detail: '  Done' })
    });
  }
  //passer une tache dans TODO
  ToToDo(t: Task) {
    const indexToRemove = this.taskDoing.findIndex(task => task._id === t._id);
    if (indexToRemove !== -1)
      this.taskDoing.splice(indexToRemove, 1);
    t.etat = "En attente de traitement"
    this.taskToDo.push(t);
    this.projectService.putTask(t).then(resultat => {
      this.ToastService.add({ severity: 'success', summary: 'success', detail: ' To Do' })
    });
  }
  onUpdate() {
    this.projectService.putTask({ ...this.TaskToShow }).then(r => {
      console.log('Tache modifié')
    })
  }


  indexDocuments = 0
  downloadFile(index) {
    this.indexDocuments = index
    console.log(this.TaskToShow._id, this.TaskToShow.documents[index]._id, this.TaskToShow.documents[index].path)
    this.projectService.downloadFile(this.TaskToShow._id, this.TaskToShow.documents[index]._id, this.TaskToShow.documents[index].path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), this.TaskToShow.documents[index].path)
    }, (error) => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }
  uploadFile(index) {
    this.indexDocuments = index
    document.getElementById('selectedFileDoc').click();
  }
  deleteFile(index) {
    if (confirm("Voulez-vous vraiment supprimer ce document  ?")) {
      this.TaskToShow.documents.splice(index, 1)

      this.projectService.putTask(this.TaskToShow).then(data => {

        this.ToastService.add({ severity: "success", summary: "Mis à jour du lead avec succès" })
      });
    }
  }
  onAddDocuments() {
    this.TaskToShow.documents.push({ nom: '', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  onAddComment() {
    this.TaskToShow.commentaires.push({ _id: new mongoose.Types.ObjectId().toString(), by: this.USER, date: new Date() })
  }

  FileUpload(event) {
    console.log(event)
    if (event != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('document_id', this.TaskToShow.documents[this.indexDocuments]._id)
      formData.append('_id', this.TaskToShow._id)
      formData.append('file', event[0])
      this.projectService.uploadFile(formData).subscribe(res => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.TaskToShow.documents[this.indexDocuments].path = event[0].name
        event = null;
        //this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  deleteTaskFromSiderbar() {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      this.projectService.deleteTask(this.TaskToShow._id).then(() => {
        this.ToastService.add({ severity: 'success', summary: 'success', detail: ' réussie' });
      })
    }

  }

  calcDureeMise() {

    /*let HRestant = (this.TaskToShow.avancement * this.TaskToShow.number_of_hour) / 100
    let MinRestant = (Math.abs(HRestant) - Math.floor(HRestant)) * 60
    return `${Math.trunc(HRestant)}H ${Math.trunc(MinRestant)}min`*/

    return "XXH XXmin"
  }

  onAddLabel() {
    this.projectService.createLabel({ color: '#37BAD4', libelle: 'Label' }).subscribe(r => {
      this.labels.push(r)
    })
  }
  onUpdateLabel(label) {
    this.projectService.updateLabel(label).subscribe(r => {
    })
  }

  deleteLabel(label) {
    this.projectService.deleteLabel(label._id).subscribe(r => {
      this.labels.splice(this.labels.indexOf(label), 1)
    })
  }
}
