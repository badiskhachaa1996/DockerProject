import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project/Project';
import {CardModule} from 'primeng/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { Task } from 'src/app/models/project/Task';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {

  loading:boolean = true;

  /** project */
  projects: Project[] = [];
  projectSelected: Project;
  clonedProjects: { [s: string]: Project; } = {};
  showFormAddProject: boolean = false;
  formAddProject: FormGroup;


  /** Tasks */
  showProjectTaches: boolean = false;
  projectTaches: Task[] = [];
  taches: Task[] = [];
  tacheSelected: Task;
  showFormAddTache: boolean = false;
  formAddTache: FormGroup;
  showFormUpdateTache: boolean = false;
  formUpdateTache: FormGroup;

  token: any;
  dropdownUser: any[] = []; // contient tous les salariés, agent, responsable
  selectedMulti: string[] = [];
  userConnected: User;

  constructor(private userService: AuthService, private formBuilder: FormBuilder, private projectService: ProjectService, private messageService: MessageService) { }

  ngOnInit(): void {
    // decoded the token
    this.token = jwt_decode(localStorage.getItem('token'));

    // récuperation de la liste des classes
    this.onGetAllClasses();

    // initialize form add project
    this.formAddProject = this.formBuilder.group({
      libelle: ['', Validators.required],
    });

    // initialize form add task
    this.formAddTache = this.formBuilder.group({
      libelle:            ['', Validators.required],
      number_of_hour:     [''],
      attribuateTo:       [''],
      dateLimite:         [''],
    });
    
    // initialize form update task
    this.formUpdateTache = this.formBuilder.group({
      libelle: ['', Validators.required],
      number_of_hour: [''],
      attribuateTo: [''],
      dateLimite: [''],
    });
  }

  // get all classes we need
  onGetAllClasses(): void 
  {
    // récuperation de l'utilisateur actuellement connecté
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => { this.userConnected = response; },
      error: (error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Utilisateur', detail: "Impossible de récuperer l'utilisateur connecté, veuillez contacter un administrateur" }); },
      complete: () => console.log("information de l'utilisateur connecté récuperé")
    });

    // recuperation des utilisateur pour la partie attribution de tâche
    this.userService.getAllSalarie()
    .then((response) => {
      this.dropdownUser = [];

      response.forEach((user: User) => {
        this.dropdownUser.push({ label: `${user.firstname} ${user.lastname}`, value: user._id });
      });
    })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Utilisateur', detail: "Impossible de récuperer la liste des salariés, veuillez contacter un administrateur" }); });

    // récuperation de la liste des projects
    this.projectService.getProjects()
    .then((response) => { this.projects = response; })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: "Impossible de récuperer les projets, veuillez contacter un administrateur" }); });

    // recuperation de la liste des taches
    this.projectService.getTasks()
    .then((response) => { this.taches = response; })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'tache', detail: "Impossible de récuperer les tâches, veuillez contacter un administrateur" }); });
  }


  /** Project */
  onAddProject(): void
  {
    let formValue = this.formAddProject.value;
    const project = new Project();

    project.libelle = formValue.libelle;
    project.created_at      = new Date();
    project.creator_id      = this.userConnected._id;

    console.log(project)

    this.projectService.postProject(project)
    .then((response) => {
      this.messageService.add({severity:'success', summary:'Projet', detail: response.success});
      this.formAddProject.reset();
      this.showFormAddProject = false;
      this.onGetAllClasses();
    })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: error.error }); });
  }

  // au clic du bouton de modification
  onRowEditInit(project: Project) {
    this.clonedProjects[project._id] = {...project};
  }

  // à la validation de la modif
  onRowEditSave(project: Project) {
      // envoi du projet modifié en base de données
      this.projectService.putProject(project)
      .then((response) => {
        this.messageService.add({severity:'success', summary:'Projet', detail: response.success});
        this.onGetAllClasses();
      })
      .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: error.error }); });

      // après la validation
      delete this.clonedProjects[project._id];
      this.messageService.add({severity:'success', summary: 'Projet', detail:'Mis à jour réussi'});
  }

  // a l'annulation de la modif
  onRowEditCancel(project: Project, index: number) {
      delete this.clonedProjects[project._id];
  }


  /** Task */
  // récuperation des tâches d'un projet
  onGetProjectTasks(idProject: string): void
  {
    this.projectService.getTasksByIdProject(idProject)
    .then((response) => { 
      this.projectTaches = response;
      this.showProjectTaches = true;
    })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: error.error }); });
  }

  // ajout d'une nouvelle tâche
  onAddTask(): void
  {
    const formValue = this.formAddTache.value;
    const tache = new Task();

    tache.libelle = formValue.libelle;
    //tache.percent = 0;
    tache.attribuate_to = [];

    formValue.attribuateTo.forEach((data: any) => {
      tache.attribuate_to.push(data.value);
    });

    tache.project_id        = this.projectSelected._id;
    tache.number_of_hour    = formValue.number_of_hour;
    tache.date_limite       = formValue.dateLimite;
    //tache.created_at        = new Date();
    //tache.creator_id        = this.userConnected._id;

    this.projectService.postTask(tache)
    .then((response) => { 
      this.messageService.add({severity:'success', summary:'Tâche', detail: response.success});
      this.formAddTache.reset();
      this.showFormAddTache = false;
      this.onGetAllClasses();
     })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Tâche', detail: error.error }); });
  }


  // methode de remplissage du formulaire de mise à jour d'une tâche
  onFillFormUpdateTache(tache: Task): void
  {
    this.tacheSelected = tache;

    this.formUpdateTache.patchValue({
      libelle: this.tacheSelected.libelle,
      dateLimite: this.tacheSelected.date_limite,
    });
  }

  // formulaire de modification d'une tâche
  onUpdateTask()
  {
    const formValue = this.formUpdateTache.value;
    const tache = new Task();

    tache._id               = this.tacheSelected._id;
    tache.libelle           = formValue.libelle;
    tache.number_of_hour    = formValue.number_of_hour;
    //tache.percent           = this.tacheSelected.percent;
    tache.attribuate_to     = [];

    formValue.attribuateTo.forEach((data: any) => {
      tache.attribuate_to.push(data.value);
    });

    tache.project_id = this.tacheSelected.project_id;
    tache.date_limite = this.tacheSelected.date_limite;
    //tache.created_at = this.tacheSelected.created_at;
    //tache.creator_id = this.tacheSelected.creator_id;

    this.projectService.putTask(tache)
    .then((response) => {
      this.messageService.add({severity:'success', summary:'Tâche', detail: response.success});
      this.onGetAllClasses();
      this.formUpdateTache.reset();
      this.showProjectTaches = false;
      this.showFormUpdateTache = false;
    })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Tâche', detail: error.error }); });

  }

  // suppression de la tâche
  onDeleteTask(id: string): void
  {
    this.projectService.deleteTask(id)
    .then((response) => {
      this.messageService.add({severity:'success', summary:'Tâche', detail: response.success}); 
      this.showProjectTaches = false;
      this.showFormAddTache = false;
      this.showFormUpdateTache = false;
      this.showFormAddProject = false;
      this.onGetAllClasses();
    })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Tâche', detail: error.error }); });
  }
}
