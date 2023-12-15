import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Project } from 'src/app/models/Project';
import { Task } from 'src/app/models/project/Task';
import { Ticket } from 'src/app/models/Ticket';
import { Ressources } from 'src/app/models/project/Ressources';
import { Budget } from 'src/app/models/project/Budget';
import { ProjectService } from 'src/app/services/projectv2.service';
import jwt_decode from "jwt-decode";
import {PaginatorModule} from 'primeng/paginator';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard-project-v2',
  templateUrl: './dashboard-project-v2.component.html',
  styleUrls: ['./dashboard-project-v2.component.scss']
})
export class DashboardProjectV2Component implements OnInit {
  token: any;
  task!: Task[];
  taskSelected: Task;
  tickets: Ticket[] = [];
  tasks:Task[] = [];
  responsablesListe: any[] = [];
  projectListe: any[] = [];
  taskListe: any[] = [];
  nbr_projet: number = 0; nbr_projet_encour: number = 0; nbr_projet_cloture: number = 0;
  nbr_taches: number = 0; nbr_tache_attente: number = 0; nbr_tache_encour: number = 0; nbr_tache_traite: number = 0; nbr_tache_valide: number = 0;
  constructor(private formBuilder: FormBuilder,
    private userService: AuthService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private router: Router) { }

  ngOnInit(): void {
    this.nbr_projet = 0; this.nbr_projet_encour = 0; this.nbr_projet_cloture = 0;
    this.nbr_taches = 0; this.nbr_tache_attente = 0; this.nbr_tache_encour = 0;
    this.nbr_tache_traite = 0; this.nbr_tache_valide = 0;
    this.taskSelected = null
    this.token = jwt_decode(localStorage.getItem('token'));
    this.projectService.getProjects()
      .then(data => {
        this.projectListe = [];
        this.nbr_projet = data.length;
        data.forEach(project => {
          const newprojet = {
            label: `${project.titre}`,
            value: [project._id]
          };
          this.projectListe.push(newprojet);

          if (project.etat == "En cours") {
            this.nbr_projet_encour = this.nbr_projet_encour + 1;
          }
          if (project.etat == "Clôturé") {
            this.nbr_projet_cloture = this.nbr_projet_cloture + 1;
          }
          this.projectService.getTasksByIdProject(project._id)
            .then(data => {
              
              this.nbr_taches = this.nbr_taches + data.length;
              data.forEach((t) => {
                this.tasks.push(t);
                const newtask = {
                  label: `${t.libelle}`,
                  value: [t._id]
                };
                this.taskListe.push(newtask);
                if (t.avancement<100) {
                  this.nbr_tache_encour = this.nbr_tache_encour + 1;
                }
                else  {
                  this.nbr_tache_traite = this.nbr_tache_traite + 1
                }
                
              })
            })
          const newresonsable = {
            label: `${project.responsable}`,
            value: [project.responsable_id]
          };
          var existe = false;
          for (const colab of this.responsablesListe) {
            if (colab.label === newresonsable.label && colab.value[0] === newresonsable.value[0]) {
              existe = true;
              break;
            }
          }
          // Si le collaborateur n'existe pas déjà dans la liste, ajoutez-le
          if (!existe) {
            this.responsablesListe.push(newresonsable);
          }

        });

      })
      console.log(this.tasks)

  }
  onResponsableSelected(event: any) {
    this.taskSelected = null
    this.projectListe = [];
    this.taskListe = [];
    this.nbr_projet = 0; this.nbr_projet_encour = 0; this.nbr_projet_cloture = 0;
    this.nbr_taches = 0; this.nbr_tache_attente = 0; this.nbr_tache_encour = 0;
    this.nbr_tache_traite = 0; this.nbr_tache_valide = 0;

    const responsableID = event.value;
    this.projectService.getProjects()
      .then(data => {
        this.projectListe = [];
        this.nbr_projet = data.length;
        data.forEach(project => {
          if (project.responsable_id == responsableID) {
            const newprojet = {
              label: `${project.titre}`,
              value: [project._id]
            };
            this.projectListe.push(newprojet);
            if (project.etat == "En cours") {
              this.nbr_projet_encour = this.nbr_projet_encour + 1;
            }
            if (project.etat == "Clôturé") {
              this.nbr_projet_cloture = this.nbr_projet_cloture + 1;
            }
            this.projectService.getTasksByIdProject(project._id)
              .then(data => {
                this.tasks = data;
                this.nbr_taches = this.nbr_taches + data.length;
                data.forEach((t) => {
                  const newtask = {
                    label: `${t.libelle}`,
                    value: [t._id]
                  };
                  this.taskListe.push(newtask);
                 
                  if (t.etat === "En cour de traitement") {
                    this.nbr_tache_encour = this.nbr_tache_encour + 1;
                  }
                  if (t.etat === "fin de traitement") {
                    this.nbr_tache_traite = this.nbr_tache_traite + 1
                  }
                  if (t.validation === "Tache validée") {
                    this.nbr_tache_valide = this.nbr_tache_valide + 1;
                  }
                })
              })

          }
        });

      })
  }
  onProjectSelected(event) {
    this.taskSelected = null
    this.nbr_taches = 0; this.nbr_tache_attente = 0; this.nbr_tache_encour = 0;
    this.nbr_tache_traite = 0; this.nbr_tache_valide = 0;
    this.taskListe = [];
    const projectID = event.value;
    this.projectService.getTasksByIdProject(projectID)
      .then(data => {
        this.tasks=data;
        this.nbr_taches = data.length;
        data.forEach(t => {
          const newtask = {
            label: `${t.libelle}`,
            value: [t._id]
          };
          this.taskListe.push(newtask);
          if (t.etat === "En attente de traitement") {
            this.nbr_tache_attente = this.nbr_tache_attente + 1;
          }
          if (t.etat === "En cour de traitement") {
            this.nbr_tache_encour = this.nbr_tache_encour + 1;
          }
          if (t.etat === "fin de traitement") {
            this.nbr_tache_traite = this.nbr_tache_traite + 1
          }
          if (t.validation === "Tache validée") {
            this.nbr_tache_valide = this.nbr_tache_valide + 1;
          }
        })
      });

  }
  onTacheSelected(event) {
    this.tickets = [];
    this.tasks = [];
    const taskID = event.value;
    this.projectService.getTask(taskID).then(data => {
      this.tasks.push(data);
      this.taskSelected = data;
      for (let i = 0; i < this.taskSelected.ticketId.length; i = i + 1) {
        this.tickets.push(this.taskSelected.ticketId[i])
        console.log(this.tickets)
      }
      console.log(this.taskSelected)
    })
  }
  getDelaiTraitrement(ri) {
    if (this.tasks) {
      let date1 = new Date()

      if (this.tasks[ri].avancement>= 100 )
        return("NONE")
      let date2 = new Date(this.tasks[ri].createdDate)

      var diff = {
        sec: 0,
        min: null,
        hour: 0,
        day: 0
      }							// Initialisation du retour
      var tmp = date1.getTime() - date2.getTime();

      tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
      diff.sec = tmp % 60;					// Extraction du nombre de secondes

      tmp = Math.floor((tmp - diff.sec) / 60);	// Nombre de minutes (partie entière)
      diff.min = tmp % 60;					// Extraction du nombre de minutes

      tmp = Math.floor((tmp - diff.min) / 60);	// Nombre d'heures (entières)
      diff.hour = tmp % 24;					// Extraction du nombre d'heures

      tmp = Math.floor((tmp - diff.hour) / 24);	// Nombre de jours restants
      diff.day = tmp;
      if (diff.min < 10)
        diff.min = "0" + diff.min.toString()

      return `${diff?.day}J ${diff?.hour}H${diff?.min}M`;
    }
  }

}
