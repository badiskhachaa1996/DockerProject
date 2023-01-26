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
  tachesInProgress: Tache[] = [];
  tachesFinished: Tache[] = [];
  tacheSelected: Tache;
  showFormAddTache: boolean = false;
  formAddTache: FormGroup;
  formUpdateTachePercent: FormGroup;
  showFormUpdateTache: boolean = false;
  showFormUpdateTachePercent: boolean = false;
  formUpdateTache: FormGroup;

  token: any;
  dropdownUser: any[] = []; // contient tous les salariés, agent, responsable
  selectedMulti: string[] = [];
  userConnected: User;
  dropdownProjet: any[] = [{ label: 'Veuillez choisir le projet', value: null }];

  constructor(private userService: AuthService, private formBuilder: FormBuilder, private projectService: ProjectService, private messageService: MessageService) { }

  ngOnInit(): void {
    // decoded the token
    this.token = jwt_decode(localStorage.getItem('token'));

    // récuperation de la liste des classes
    this.onGetAllClasses();

    // initialize form add task
    this.formAddTache = this.formBuilder.group({
      libelle: ['', Validators.required],
      projet: [''],
      attribuateTo: [''],
      dateLimite: [''],
    });
    
    // initialize form update task
    this.formUpdateTache = this.formBuilder.group({
      libelle: ['', Validators.required],
      attribuateTo: [''],
      dateLimite: [''],
    });

    // initialize form update percentage
    this.formUpdateTachePercent = this.formBuilder.group({
      percent: ['', Validators.required],
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
    .then((response) => { 
      this.projects = response; 
    
      response.forEach((projet: Project) => {
        console.log(projet);
        this.dropdownProjet.push({ label: projet.libelle, value: projet._id});
      });
    })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: "Impossible de récuperer les projets, veuillez contacter un administrateur" }); });

    // recuperation de la liste des taches en cours
    this.projectService.getTasksInProgressByIdUser(this.token.id)
    .then((response) => { this.tachesInProgress = response; })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'tache', detail: "Impossible de récuperer les tâches, veuillez contacter un administrateur" }); });
  
    // recuperation de la liste des taches finis
    this.projectService.getTasksFinishedByIdUser(this.token.id)
    .then((response) => { this.tachesFinished = response; this.loading = false; })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'tache', detail: "Impossible de récuperer les tâches, veuillez contacter un administrateur" }); });
  }

  // methode de remplissage du mise à jour du pourcentage d'une tâche
  onFillFormUpdatePercent(tache: Tache)
  {
    this.tacheSelected = tache;

    this.formUpdateTachePercent.patchValue({
      percent: this.tacheSelected.percent,
    });

    this.showFormUpdateTachePercent = true;
  }

  // methode de mise à jour du pourcentage d'une tâche
  onUpdateTachePercent(): void
  {
    const formValue = this.formUpdateTachePercent.value;
    // Mis à jour de la tâche selctionnée
    const tache = this.tacheSelected;
    tache.percent = formValue.percent;

    // envoi de la tâche dans la bd
    this.projectService.putTask(tache)
    .then((response) => { 
      this.messageService.add({ severity: 'success', summary:'Tâche', detail: response.success }); 
      this.formUpdateTachePercent.reset();
      this.showFormUpdateTachePercent = false;
      this.onGetAllClasses();
    })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'tache', detail: "Impossible de récuperer les tâches, veuillez contacter un administrateur" }); })
  }

  
  // methode d'ajout d'une tâche
  onAddTask(): void
  {
    const formValue = this.formAddTache.value;
    const tache = new Tache();

    tache.libelle = formValue.libelle;
    tache.percent = 0;
    tache.attribuate_to = [];

    formValue.attribuateTo.forEach((data: any) => {
      tache.attribuate_to.push(data.value);
    });

    tache.project_id        = formValue.projet;
    tache.date_limite       = formValue.dateLimite;
    tache.created_at        = new Date();
    tache.creator_id        = this.userConnected._id;

    this.projectService.postTask(tache)
    .then((response) => { 
      this.messageService.add({severity:'success', summary:'Tâche', detail: response.success});
      this.formAddTache.reset();
      this.showFormAddTache = false;
      this.onGetAllClasses();
     })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Tâche', detail: error.error }); });
  }


  // methode de remplissage du formulaire de mise à jour d'une tâche
  onFillFormUpdateTache(tache: Tache): void
  {
    this.tacheSelected = tache;

    this.formUpdateTache.patchValue({
      libelle: this.tacheSelected.libelle,
      dateLimite: this.tacheSelected.date_limite,
    });

    this.showFormUpdateTache = true;
  }

}
