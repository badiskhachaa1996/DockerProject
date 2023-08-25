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
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss'],
})
export class GestionComponent implements OnInit {
  private task_id: string;
  private project_id: string;
  private ressources_id: string;
  private budgetid: string;
  avancement_p: number = 0;
  showAddProjectForm: boolean = false;
  showressources: boolean = false;
  showbudget: boolean = false;
  showUpdateProjectForm: boolean = false;
  showAddRessourcesForm: boolean = false;
  showAddBudgetForm: boolean = false;
  showUpdateRessourcesForm: boolean = false;
  showUpdateBudgetForm: boolean = false;
  formAddProject: FormGroup;
  formAddTache: FormGroup;
  formAddressources: FormGroup;
  formAddbudget: FormGroup;
  responsableListe: any[] = [];
  project!: Project[];
  task!: Task[];
  ressources!: Ressources[];
  budget!: Budget[];
  userConnected: User;
  token: any;
  showTachesTable: boolean = false;
  showtache: boolean = false;
  showAddTacheForm: boolean = false;
  showUpdateTacheForm: boolean = false;
  nbr_project: number;
  nbr_projectEnCour: number;
  nbr_projectCloturer: number;
  budget_charge: number;
  budgect_depense: number;
  prioriteListe: any[] = [
    { label: 'Priorité normale', value: "Priorité normale" },
    { label: 'Basse priorité', value: "Basse priorité" },
    { label: 'Moyenne priorité', value: "Moyenne priorité" },
    { label: 'Haute priorité', value: "Haute priorité" },
  ];
  projectIdForTask: any
  constructor(
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private router: Router
  ) { }
  ngOnInit(): void {
    // decoded the token
    this.token = jwt_decode(localStorage.getItem('token'));
    this.getthecrateur()
    //appelle a la fonction de recupreation des personnes consernees
    this.getallusers();
    //recuperer les project avec getProjects
    this.projectService.getProjects().then((data) => {
      this.project = [];
      this.project = data;
    })
    //recuperation du nombre de project
    this.listeprojets();
    //INITIALISATION DU FORMULAIRE Project
    this.formAddProject = this.formBuilder.group({
      titre: ['', Validators.required],
      responsable: [''],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
      description: ['', Validators.required]
    });
    //INITIALISATION DU FORMULAIRE Tache
    this.formAddTache = this.formBuilder.group({
      libelle: ['', Validators.required],
      priorite: [''],
      number_of_hour: ['', Validators.required],
      date_limite: ['', Validators.required],
      description: ['', Validators.required]
    });
    //INITIALISATION DU FORMULAIRE Ressource
    this.formAddressources = this.formBuilder.group({
      nom: ['', Validators.required],
      importance: ['', Validators.required],
    })
    //INITIALISATION DU FORMULAIRE budget 
    this.formAddbudget = this.formBuilder.group({
      libelle: ['', Validators.required],
      charge: ['', Validators.required],
      depense: ['', Validators.required],
    })

  }
  //recuperation de user qui vas cree le formulaire
  getthecrateur() {
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => { this.userConnected = response; },
      error: (error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Utilisateur', detail: "Impossible de récuperer l'utilisateur connecté, veuillez contacter un administrateur" }); },
      complete: () => console.log("information de l'utilisateur connecté récuperé")
    });
  }

  listeprojets() {
    this.projectService.getProjects()
      .then(projects => {
        this.nbr_project = projects.length;
        const length_projects = this.nbr_project
        this.nbr_projectCloturer = 0;
        this.nbr_projectEnCour = 0;
        for (let i = 0; i < projects.length; i = i + 1) {
          this.projectService.getTasksByIdProject(projects[i]._id).then((data) => {
            for (let j = 0; j < data.length; j++) {
              this.avancement_p = this.avancement_p + data[j].avancement / data.length;
            }
            projects[i].avancement = this.avancement_p;
            this.projectService.putProject(projects[i]);
            this.avancement_p = 0;
          })
          if (projects[i].etat == "cloture") {
            this.nbr_projectCloturer++;
          }
          if (projects[i].etat == "encour") {
            this.nbr_projectEnCour++
          }
        }
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }
  // recuperation des utilisateur  pour les afficher dans le drop down
  getallusers(): void {
    this.userService.getAllSalarie()
      .then((response) => {
        this.responsableListe = [];
        response.forEach((user: User) => {
          const newUser = {
            label: `${user.firstname} ${user.lastname}`,
            value: [user._id, user.firstname + " " + user.lastname]
          };
          this.responsableListe.push(newUser);
        });
      })
      .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Utilisateur', detail: "Impossible de récuperer la liste des salariés, veuillez contacter un administrateur" }); });
  }
  //envoi du forulaire creation de project 
  addProject() {
    if (this.formAddProject.invalid) {
      // Vérifier si le formulaire est invalide, si oui, ne rien faire
      return;
    }
    // Construire l'objet à envoyer au serveur avec les données du formulaire
    const currentDate = new Date();
    const costumid_="P"+currentDate.getTime();  
    const newProject = {
      titre: this.formAddProject.get('titre').value,
      createur_id: this.userConnected._id,
      createur: this.userConnected.firstname + " " + this.userConnected.lastname,
      created_date: currentDate,
      debut: this.formAddProject.get('debut').value,
      fin: this.formAddProject.get('fin').value,
      responsable_id: this.formAddProject.get('responsable').value[0],
      responsable: this.formAddProject.get('responsable').value[1],
      description: this.formAddProject.get('description').value,
      avancement: 0,
      identifian:costumid_,
    };
    this.projectService.postProject(newProject);
    this.formAddProject.reset();
    this.listeprojets();
    this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ajout réussie' });
    this.listeprojets();
  }

  delete(id, ri) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      this.projectService.delete(id)
        .then(data => {
          // The Promise is resolved successfully
          this.project.splice(ri, 1);
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'supression réussie' })
        })
        .catch(error => {
          // Handle errors from the Promise if needed
          console.log('Error:', error);
        });
    }
  }

  initialisation_project(project: Project) {
    this.showUpdateProjectForm = true;

    this.project_id = project._id;
    const debut = project.debut; // Supposons que project.debut soit une date valide
    const dateObject = new Date(debut); // Conversion en objet Date
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(dateObject.getDate()).padStart(2, '0');
    const new_Date_d = `${year}-${month}-${day}`;
    //pour fin 
    this.project_id = project._id;
    const fin = project.fin; // Supposons que project.debut soit une date valide
    const dateObjectf = new Date(fin); // Conversion en objet Date
    const yearf = dateObjectf.getFullYear();
    const monthf = String(dateObjectf.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const dayf = String(dateObjectf.getDate()).padStart(2, '0');
    const new_Date_fin = `${yearf}-${monthf}-${dayf}`;
    this.formAddProject = this.formBuilder.group({
      titre: project.titre,
      responsable:this.responsableListe,
       debut: new Date(new_Date_d),
      fin: new Date(new_Date_fin),
      description: project.description
    });

  }
  UpdateProject() {
    this.projectService.getProject(this.project_id).then((data) => {

      data.titre = this.formAddProject.get('titre').value,
        data.debut = this.formAddProject.get('debut').value,
        data.fin = this.formAddProject.get('fin').value,
        data.responsable_id = this.formAddProject.get('responsable')?.value[0],
        data.responsable = this.formAddProject?.get('responsable')?.value[1],
        data.description = this.formAddProject.get('description').value,
        this.projectService.putProject(data);
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'modification réussie' })
      this.formAddProject.reset();

    })  }
  //PATIE TACHES
  addTache(project_id) {
       
    const currentDate = new Date();
    const costumid_="T"+currentDate.getTime();
    if (this.formAddTache.invalid)
      return; {
    }
    const newTache = {

      libelle: this.formAddTache.get('libelle').value,
      number_of_hour: this.formAddTache.get('number_of_hour').value,
      date_limite: this.formAddTache.get('date_limite').value,
      priorite: this.formAddTache.get('priorite').value,
      description_task: this.formAddTache.get('description').value,
      avancement: 0,
      project_id: this.projectIdForTask,
      validation:"La tâche n’est pas validée",
      identifian: costumid_,
    }
    this.projectService.postTask(newTache)
    this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ajout réussie' })
    this.formAddTache.reset();


  }

  showTaskList(project_id) {
    this.projectService.getTasksByIdProject(project_id).then((data) => {
      this.task = [];
      this.task = data;
      this.projectIdForTask = project_id;


    })
  }

  //INITIALISATION DU FORMULAIRE POUR MODIFIER UNE TACHE
  initialisation(task: Task) {
    const dl = task.date_limite; // Supposons que project.debut soit une date valide
    const dateObjectl = new Date(dl); // Conversion en objet Date
    const year = dateObjectl.getFullYear();
    const month = String(dateObjectl.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(dateObjectl.getDate()).padStart(2, '0');
    const new_date = `${year}-${month}-${day}`;
    this.showUpdateTacheForm = true;
    this.task_id = task._id;
    console.log(new_date);
    this.formAddTache = this.formBuilder.group({
      libelle: task.libelle,
      priorite: task.priorite,
      number_of_hour: task.number_of_hour,
      date_limite: new Date(new_date),
      description: task.description_task,

    });
  }

  onUpdatetask() {

    this.projectService.getTask(this.task_id).then((data) => {
      data.libelle = this.formAddTache.get('libelle').value,
        data.number_of_hour = this.formAddTache.get('number_of_hour').value,
        data.date_limite = this.formAddTache.get('date_limite').value,
        data.priorite = this.formAddTache.get('priorite').value,
        data.description_task = this.formAddTache.get('description').value,

        this.projectService.putTask(data)
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'Modification réussie' });
      this.formAddTache.reset();})};

  transformtask(task: Task) {
    const taskDataJson = JSON.stringify(task);
    this.router.navigate(['/ticketing/gestion/ajout'], { queryParams: { data: taskDataJson } });
  }

  affectertask(task: Task) {
    this.router.navigate(['/ticketing/suivi/non-assignes'], { queryParams: { data: task } })
  }

  deleteTask(id, ri) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")) {
      this.projectService.deleteTask(id)
        .then(data => {
          // The Promise is resolved successfully
          this.task.splice(ri, 1);
          this.messageService.add({ severity: 'success', summary: 'success', detail: ' réussie' })
        })
        .catch(error => {
          // Handle errors from the Promise if needed
          console.log('Error:', error);
        });
    }
  }
  taches(id, ri) {
    this.showTachesTable = true;
  }
  //PARTIE RESSOURCES
  addRessources() {
    if (this.formAddressources.invalid)
      return; {
    }
    const newRessources = {
      nom: this.formAddressources.get('nom').value,
      importance: this.formAddressources.get('importance').value,
      project_id: this.projectIdForTask,
    }
    this.projectService.postRessources(newRessources)
    this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ajout réussie' })
    this.formAddressources.reset();}

  showRessources(project_id) {
    this.showressources = true;
    this.projectIdForTask = project_id;
    this.projectService.getRessourcesByIdProject(project_id).then((data) => {
      this.ressources = [];
      this.ressources = data;})
  }

  //INITIALISATION DU FORMULAIRE POUR MODIFIER UNE ressource
  initialisation_r(ressources: Ressources) {
    this.showUpdateRessourcesForm = true;
    this.ressources_id = ressources._id;
    this.formAddressources = this.formBuilder.group({
      nom: ressources.nom,
      importance: ressources.importance});}

  onUpdateressources() {
    this.projectService.getRessources(this.ressources_id).then((data) => {
      data.nom = this.formAddressources.get('nom').value,
        data.importance = this.formAddressources.get('importance').value,
        this.projectService.putRessources(data);
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'modification réussie' });
      this.formAddressources.reset();})
  };

  delete_r(ressources_id, rir) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
      this.projectService.deleteRessources(ressources_id)
        .then(data => {
          // The Promise is resolved successfully
          this.ressources.splice(rir, 1);
          this.messageService.add({ severity: 'success', summary: 'success', detail: ' réussie' })})
        .catch(error => {
          // Handle errors from the Promise if needed
          console.log('Error:', error);});}}
  //PARTIE BUDGET  
  addBudget() {
    if (this.formAddbudget.invalid)
      return; {
    }
    const newBudjet = {
      libelle: this.formAddbudget.get('libelle').value,
      charge: this.formAddbudget.get('charge').value,
      depense: this.formAddbudget.get('depense').value,
      project_id: this.projectIdForTask,}
    this.projectService.postBudget(newBudjet);
    this.messageService.add({ severity: 'success', summary: 'success', detail: 'Ajout réussie' });
    this.formAddbudget.reset();}

  showBudget(project_id) {
    this.showbudget = true;
    this.projectIdForTask = project_id;
    this.projectService.getBudgetByIdProject(project_id).then((data) => {
      this.budget = [];
      this.budget = data;
      this.budget_charge = 0;
      this.budgect_depense = 0;
      for (let j = 0; j < data.length + 1; j = j + 1) {
        this.budgect_depense = this.budgect_depense + data[j].depense;
        this.budget_charge = this.budget_charge + data[j].charge;
      }})}

  //INITIALISATION DU FORMULAIRE POUR MODIFIER UNE ressource
  initialisation_b(budget: Budget) {
    this.showUpdateBudgetForm = true;
    this.budgetid = budget._id;
    this.formAddbudget = this.formBuilder.group({
      libelle: budget.libelle,
      charge: budget.charge,
      depense: budget.depense
    });
  }

  onUpdatebudget() {
    this.projectService.getBudget(this.budgetid).then((data) => {
      data._id = this.budgetid;
      data.libelle = this.formAddbudget.get('libelle').value,
        data.charge = this.formAddbudget.get('charge').value,
        data.depense = this.formAddbudget.get('depense').value,
        this.projectService.putBudget(data);
      this.messageService.add({ severity: 'success', summary: 'success', detail: 'modification réussie' });
      this.formAddbudget.reset();})
  };

  delete_b(budget_id, rir) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce budget ?")) {
      this.projectService.deleteBudget(budget_id)
        .then(data => {
          // The Promise is resolved successfully
          this.budget.splice(rir, 1);
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'réussie' });
        })
        .catch(error => {
          // Handle errors from the Promise if needed
          console.log('Error:', error);
        });}}
}