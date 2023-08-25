import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Project } from 'src/app/models/Project';
import { Task } from 'src/app/models/project/Task';
import { Ressources } from 'src/app/models/project/Ressources';
import { Budget } from 'src/app/models/project/Budget';
import { ProjectService } from 'src/app/services/projectv2.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-myproject',
  templateUrl: './myproject.component.html',
  styleUrls: ['./myproject.component.scss']
})
export class MyprojectComponent implements OnInit {
  token: any;
  selectedTabIndex: number = 0;
  showproject: boolean = false;
  formFindProject: FormGroup;
  projectListe: any[] = [];
  tasktodo: any[] = [];
  taskdone: any[] = [];
  taskencours: any[] = [];
  taskarchiver: any[] = [];
  task!: Task[];
  task_v:Task;
  taskDetails:Task;
  actual_task:Task;
  tasktoupdate: Task;
  selectedProject: Project = null;
  collaborateurListe: any[] = [];
  userConnected: User;
  task_consignes: any;
  selectedProjectId: string;
  selectedcolID: string;
  pourcentage_disabled: boolean = true;
  visible: boolean = false;
  visibled: boolean = false;
  itsupdate: boolean=false;
  indexupdate:number;
  heur_realiser: number = 0;
  heur_total: number = 0;
  avancementp:number = 0;
  items: MenuItem[];
  formAddConsigne : FormGroup;
  icone:string="pi-pencil"


  constructor(private formBuilder: FormBuilder,
    private userService: AuthService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private router: Router) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    //deplacer
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
    //INITIALISATION DU FORMULAIRE Project
    this.formFindProject = this.formBuilder.group({
      project: ['', Validators.required],
      collaborateur: ['']
    });
    //INITIALISATION consigne
    this.formAddConsigne = this.formBuilder.group({
      consigne: [''],
    })
    //recuperation des info 
    this.getallinformation();
  }
  getallinformation() {
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => {
        this.userConnected = response;
        this.projectService.getProjects()
          .then(data => {
            this.projectListe = [];

            data.forEach((project: Project) => {
              if (project.createur_id === response._id) {
                const newproject = {
                  label: `${project.titre}`,
                  value: [project._id]
                };
                this.projectListe.push(newproject);
              }
            });
          })
      }
    })
  }
//filter selon le projet sellectioner
  onProjectSelected(event: any) {
    this.heur_realiser=0;
    this.heur_total=0;
    this.avancementp=0;
    this.selectedProjectId = event.value;
    this.projectService.getTasksByIdProject(this.selectedProjectId)
      .then(data => {

        this.collaborateurListe = [];

        data.forEach((task: Task) => {
          this.avancementp = this.avancementp + task.avancement / data.length;
          this.heur_realiser =this.heur_realiser + (task.avancement * (task.number_of_hour/100));
          this.heur_total =this.heur_total + task.number_of_hour;
          const newcolab = {

            label: `${task.attribuate_to[0].firstname} ${task.attribuate_to[0].lastname}`,
            value: [task.attribuate_to[0]._id]
          }
            var existe=  false;
          for (const colab of this.collaborateurListe) {
            if (colab.label === newcolab.label && colab.value[0] === newcolab.value[0]) {
               existe = true;
              break;
            }
          }
          // Si le collaborateur n'existe pas déjà dans la liste, ajoutez-le
          if (!existe) {
            this.collaborateurListe.push(newcolab);
          }
        });
        this.projectService.getProject(this.selectedProjectId)
        .then(data => {data.avancement = this.avancementp; this.projectService.putProject(data)})


      })
  };

  //envoi du forulaire creation de project 
  findProject() {
    if (this.formFindProject.invalid) {
      // Vérifier si le formulaire est invalide, si oui, ne rien faire
      return;
    }
    // Construire l'objet à envoyer au serveur avec les données du formulaire
    this.tasktodo = [];this.taskdone = [];this.taskencours = [];this.taskarchiver= [];
    const project_id = this.formFindProject.get('project').value;
    const collaborateur_id = this.formFindProject.get('collaborateur').value;

    this.projectService.getProject(project_id)
      .then(data => {
        this.selectedProject = data;
        this.projectService.getTasksByIdProject(data._id)
          .then(datatache => {
            
            this.task = datatache;
            this.task.forEach(t => {
              if (t.ticketId.statut == "Traité") {
                t.avancement = 100
                this.projectService.putTask(t);
              }
              if (collaborateur_id) {
              if (t.attribuate_to[0]._id==collaborateur_id) {
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
              }} else {
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

              }
            })
          })
      });
    this.showproject = true
    
    this.messageService.add({ severity: 'success', summary: 'success', detail: 'PROJET TROUVER' })
    

  }
  showDialogd(task:Task) {
    this.taskDetails=task;
    this.visibled = true;
  }
  showDialog(task: Task) {
    this.visible = true;
    this.actual_task=task;
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
  modifierpoucentage(task: Task) {
    if (this.pourcentage_disabled){
      this.pourcentage_disabled = false;
      this.icone="pi-check"
    }else {
      this.icone="pi-pencil"
      this.pourcentage_disabled = true;
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
  addConsigne(task: Task){
    const consigne=this.formAddConsigne.get('consigne').value;
    if(this.itsupdate){
      this.actual_task.consignes[this.indexupdate]=consigne;
      this.projectService.putTask(this.actual_task);
    }else{
    this.actual_task.consignes.push(consigne);
    this.projectService.putTask(this.actual_task);
  }
  this.formAddConsigne.reset();
  this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ajout réussie' })                    
}
  initialisation_c(c,rir){
    this.formAddConsigne=this.formBuilder.group({
      consigne:c
  })
  this.itsupdate=true;
  this.indexupdate=rir;
  }
  delete_c(rir){
    this.actual_task.consignes.splice(rir, 1);
    this.projectService.putTask(this.actual_task);
  }
  valider(task: Task){
    if (confirm("Êtes-vous sûr de vouloir valider?")) {
    task.validation="Tache validée";
    this.projectService.putTask(task);
    this.messageService.add({ severity: 'success', summary: 'success', detail: 'Validation réussie' })

  }}
  getColorForValidation(validation){
    switch (validation) {
      case 'La tâche n’est pas validée':
        return 'red'; 
    default: return'green';

  }}
  showTicket(task:Task){
    console.log(task.ticketId._id);
    this.router.navigate(['/ticketing/gestion/assignes'],{ queryParams: { data: task.ticketId._id } });
  }

}
