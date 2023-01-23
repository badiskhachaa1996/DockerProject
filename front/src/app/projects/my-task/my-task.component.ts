import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Project } from 'src/app/models/project/Project';
import { Tache } from 'src/app/models/project/Tache';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss']
})
export class MyTaskComponent implements OnInit {

  loading:boolean = true;

  /** project */
  projects: Project[] = [];
  projectSelected: Project;
  clonedProjects: { [s: string]: Project; } = {};
  showFormAddProject: boolean = false;
  formAddProject: FormGroup;


  /** Task */
  taches: Tache[] = [];
  tacheSelected: Tache;
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

    // initialize form add task
    this.formAddTache = this.formBuilder.group({
      libelle: ['', Validators.required],
      attribuateTo: [''],
      dateLimite: [''],
    });
    
    // initialize form update task
    this.formUpdateTache = this.formBuilder.group({
      libelle: ['', Validators.required],
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
      error: (error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Utilisateur', detail: "Impossible de récuperer l'utilisateur connecté, veuillez contacter un administrateur" }); },
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
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Utilisateur', detail: "Impossible de récuperer la liste des salariés, veuillez contacter un administrateur" }); });

    // récuperation de la liste des projects
    this.projectService.getProjects()
    .then((response) => { this.projects = response; })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: "Impossible de récuperer les projets, veuillez contacter un administrateur" }); });

    // récuperation de la liste des taches de l'utilisateur
    this.projectService.getTasksByIdUser(this.token.id)
    .then((response) => { this.taches = response; })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'tache', detail: "Impossible de récuperer les tâches, veuillez contacter un administrateur" }); });
  }

}
