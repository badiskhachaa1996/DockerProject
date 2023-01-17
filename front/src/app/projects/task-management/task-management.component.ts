import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project/Project';
import {CardModule} from 'primeng/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit {

  loading:boolean = true;

  /** project */
  projects: Project[] = [];
  showFormAddProject: boolean = false;
  formAddProject: FormGroup;


  /** Tasks */
  tasks: Task[] = [];
  showFormAddTask: boolean = false;
  formAddTask: FormGroup;

  token: any;
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

    // récuperation de la liste des projects
    this.projectService.getProjects()
    .then((response) => { this.projects = response; })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: "Impossible de récuperer les projets, veuillez contacter un administrateur" }); });

    // recuperation de la liste des taches
    this.projectService.getTasks()
    .then((response) => { this.tasks = response; })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'tache', detail: "Impossible de récuperer les tâches, veuillez contacter un administrateur" }); });
  }




  /** Project */
  onAddProject(): void
  {
    let formValue = this.formAddProject.value;
    const project = new Project();

    project.libelle = formValue.libelle;
    project.percent         = 0;
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
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: error.error }); });
  }



  /** Task */

}
