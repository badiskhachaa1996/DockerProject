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

@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss']
})
export class MytaskComponent implements OnInit {
  value: number = 50;
  selectedTabIndex: number = 0;
  task_consignes: any;
  avancement: number =0;
  pourcentage_disabled: boolean =true;
  visible: boolean = false;
  visible_consigne : boolean = false;
  tasktodo: any[] = [];
  taskdone: any[] = [];
  taskencours: any[] = [];
  taskarchiver: any[] = [];
  task!: Task[];
  icone:string="pi-pencil"
  taskDetails:Task;
  tasktoupdate: Task;
  ticket!: Ticket[];
  project: Project[] = [];
  items: MenuItem[];
  userConnected: User;
  nbr_consigne:number = 0;
  token: any;
  project_id: string; tache_id: string; ticket_id: string; project_titre: string;
  date_assegnation: string; date_limite: string; nbr_heur: number; etat_traitement: string;
  etat_avancement: number; description: string; note: string;

  constructor(private userService: AuthService, private messageService: MessageService, private projectService: ProjectService,
    private ticketService: TicketService, private router: Router) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'To Do',
        icon: 'pi  pi-bars',
        command: () => {
          this.todo();
        }
      },
      {
        label: 'En cours',
        icon: 'pi pi-refresh',
        command: () => {
          this.encours();
        }
      },
      {
        label: 'Done',
        icon: 'pi pi-check',
        command: () => {
          this.done();
        }

      },
      { separator: true },
      {
        label: 'Archivés',
        icon: 'pi pi-thumbs-up',
        command: () => {
          this.archiver();
        }

      }
    ];

    // decoded the token
    this.token = jwt_decode(localStorage.getItem('token'));
    this.ticket = [];
    //recuperation de toute les informations
    this.getAllInformation();
  }
//recuperation des information  
  getAllInformation() {
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;
        this.projectService.getTaskbyagent(this.userConnected._id)
          .then(datatache => {
            this.task = datatache;
            this.task.forEach(t => {
              if (t.ticketId.statut=="Traité"){
                t.avancement=100
                this.projectService.putTask(t);
              }
              
              if (t.etat === "En attente de traitement") {
                this.tasktodo.push(t);
              }
              if (t.etat === "En cour de traitement") {
                this.taskencours.push(t);
              }
              if (t.etat === "fin de traitement") {
                this.taskdone.push(t);
              }
              if (t.etat === "archiver") {
                this.taskarchiver.push(t);
              }

            })
          })
      }
    })
  }
//afficher le details
  showDialog(task: Task) {
    this.taskDetails=task;
    this.visible = true;
  }
 // afficher les consignes
showDialogc(task:Task){
  this.visible_consigne = true;
  console.log(task)
  this.task_consignes=task.consignes; 
  
 
  
}

  save(severity: string, task: Task) {
    this.tasktoupdate = task;
    this.messageService.add({ severity: severity, summary: 'Success', detail: 'Deplacer' });
  }
  todo() {

    if (this.tasktoupdate.etat === "En cour de traitement") {
      this.taskencours.splice(this.taskencours.indexOf(this.tasktoupdate), 1);
      this.tasktodo.push(this.tasktoupdate);
    }
    if (this.tasktoupdate.etat === "fin de traitement") {
      this.taskdone.splice(this.taskdone.indexOf(this.tasktoupdate), 1);
      this.tasktodo.push(this.tasktoupdate);
    }
    if (this.tasktoupdate.etat === "archiver") {
      this.taskarchiver.splice(this.taskarchiver.indexOf(this.tasktoupdate), 1);
      this.tasktodo.push(this.tasktoupdate);
    }
    if (this.tasktoupdate) {
      this.tasktoupdate.etat = "En attente de traitement";
      this.projectService.putTask(this.tasktoupdate);
      this.messageService.add({ severity: 'success', summary: 'Selected', detail: 'Success' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Attention ', detail: 'veuillez cliquer sur le bouton "Deplacer" avant de choisir ' });

    }
  }

  encours() {
    if (this.tasktoupdate.etat === "En attente de traitement") {
      this.tasktodo.splice(this.tasktodo.indexOf(this.tasktoupdate), 1);
      this.taskencours.push(this.tasktoupdate);
    }

    if (this.tasktoupdate.etat === "fin de traitement") {
      this.taskdone.splice(this.taskdone.indexOf(this.tasktoupdate), 1);
      this.taskencours.push(this.tasktoupdate);
    }
    if (this.tasktoupdate.etat === "archiver") {
      this.taskarchiver.splice(this.taskarchiver.indexOf(this.tasktoupdate), 1);
      this.taskencours.push(this.tasktoupdate);
    }
    if (this.tasktoupdate) {
      this.tasktoupdate.etat = "En cour de traitement";
      this.projectService.putTask(this.tasktoupdate);
      this.messageService.add({ severity: 'success', summary: 'Selected', detail: 'Success' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Attention ', detail: 'veuillez cliquer sur le bouton "Deplacer" avant de choisir ' });

    }
  }

  done() {
    if (this.tasktoupdate.etat === "En attente de traitement") {
      this.tasktodo.splice(this.tasktodo.indexOf(this.tasktoupdate), 1);
      this.taskdone.push(this.tasktoupdate);
    }
    if (this.tasktoupdate.etat === "En cour de traitement") {
      this.taskencours.splice(this.taskencours.indexOf(this.tasktoupdate), 1);
      this.taskdone.push(this.tasktoupdate);
    }
   
    if (this.tasktoupdate.etat === "archiver") {
      this.taskarchiver.splice(this.taskarchiver.indexOf(this.tasktoupdate), 1);
      this.taskdone.push(this.tasktoupdate);
    }
    if (this.tasktoupdate) {
      this.tasktoupdate.etat = "fin de traitement";
      this.projectService.putTask(this.tasktoupdate);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Attention ', detail: 'veuillez cliquer sur le bouton "Deplacer" avant de choisir ' });

    }
  }
  archiver() {
    if (this.tasktoupdate.etat === "En attente de traitement") {
      this.tasktodo.splice(this.tasktodo.indexOf(this.tasktoupdate), 1);
      this.taskarchiver.push(this.tasktoupdate);
    }
    if (this.tasktoupdate.etat === "En cour de traitement") {
      this.taskencours.splice(this.taskencours.indexOf(this.tasktoupdate), 1);
      this.taskarchiver.push(this.tasktoupdate);
    }
    if (this.tasktoupdate.etat === "fin de traitement") {
      this.taskdone.splice(this.taskdone.indexOf(this.tasktoupdate), 1);
      this.taskarchiver.push(this.tasktoupdate);
    }
   
    if (this.tasktoupdate) {
      this.tasktoupdate.etat = "archiver";
      this.projectService.putTask(this.tasktoupdate);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Attention ', detail: 'veuillez cliquer sur le bouton "Deplacer" avant de choisir ' });

    }
  }
  //FONCTION POUR MODIFIER LE POURCETAGE
  modifierpoucentage(task: Task) {
    if (this.pourcentage_disabled){
      this.pourcentage_disabled = false;
      this.icone="pi-check"
    }else {
      this.pourcentage_disabled = true;
      this.icone="pi-pencil"
      this.projectService.putTask(task);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Pourcentage modifier' });

    }
    

  }

  getColorForStatus(statut: string): string {
    switch (statut) {
      case 'En attente de traitement':
        return 'orange'; 
      case 'En cours de traitement':
        return 'green';
      case 'fin de traitement':
        return 'gray';
         
      default:
        return 'black'; 
    }
  }
  getColorForValidation(validation){
    switch (validation) {
      case 'La tâche n’est pas validée':
        return 'red'; 
    default: return'green';

  }
}
showTicket(task:Task){
  console.log(task.ticketId._id);
  this.router.navigate(['/ticketing/gestion/assignes'],{ queryParams: { data: task.ticketId._id } });
}
}
