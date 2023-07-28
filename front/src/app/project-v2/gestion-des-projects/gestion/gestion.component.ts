import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Project } from 'src/app/models/Project';
import {Task} from 'src/app/models/project/Task';
import { ProjectService } from 'src/app/services/projectv2.service';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss'],

})
export class GestionComponent implements OnInit {
  showAddProjectForm: boolean = false;
  formAddProject: FormGroup;
  formAddTache: FormGroup;
  responsableListe: any[] = [];
  project!: Project[];
  task!: Task[];
  userConnected: User;
  token: any;
  showTachesTable: boolean = false;
  showtache: boolean = false;
  showAddTacheForm : boolean = false;
  nbr_project:Number;
  nbr_projectEnCour:Number;
  nbr_projectCloturer:Number;
  prioriteListe: any[] = [
    { label: 'Priorité normale', value: "Priorité normale" },
    { label: 'Basse priorité', value: "Basse priorité" },
    { label: 'Moyenne priorité', value: "Moyenne priorité" },
    { label: 'Haute priorité', value: "Haute priorité" },
  ];
  projectIdForTask:any

  constructor(
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private messageService: MessageService,
    private projectService: ProjectService
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
    this.projectService.getProjects()
  .then(projects => {
    this.nbr_project = projects.length;
    console.log(this.nbr_project);
  })
  .catch(error => {
    console.error('Error fetching projects:', error);
  });

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

  }

  //recuperation de user qui vas cree le formulaire
  getthecrateur() {
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => { this.userConnected = response; },
      error: (error) => { console.log(error); this.messageService.add({ severity: 'error', summary: 'Utilisateur', detail: "Impossible de récuperer l'utilisateur connecté, veuillez contacter un administrateur" }); },
      complete: () => console.log("information de l'utilisateur connecté récuperé")
    });
  }

  // recuperation des utilisateur  pour les afficher dans le drop down
  getallusers(): void {


    this.userService.getAllSalarie()
      .then((response) => {
        this.responsableListe = [];

        response.forEach((user: User) => {
          console.log(user.firstname)
          const newUser = {
            label: `${user.firstname} ${user.lastname}`,
            value: [user._id, user.firstname + " " + user.lastname]
          };
          this.responsableListe.push(newUser);
          console.log(newUser);
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
    const newProject = {
      titre: this.formAddProject.get('titre').value,
      createur_id: this.userConnected._id,
      createur: this.userConnected.firstname+" "+this.userConnected.lastname,
      created_date: currentDate,
      debut: this.formAddProject.get('debut').value,
      fin: this.formAddProject.get('fin').value,
      responsable_id: this.formAddProject.get('responsable').value[0],
      responsable: this.formAddProject.get('responsable').value[1],
      description: this.formAddProject.get('description').value,
      avancement: 0,
    };
    console.log("1111");
    console.log(newProject);
    this.projectService.postProject(newProject);

  }

  delete(id, ri) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
      this.projectService.delete(id)
        .then(data => {
          // The Promise is resolved successfully
          this.project.splice(ri, 1);
        })
        .catch(error => {
          // Handle errors from the Promise if needed
          console.log('Error:', error);
        });
    }
  }

  onUpdate(project){}
//PATIE TACHES
addTache(project_id){
  console.log(11111111111111111);
  console.log(project_id);
  if (this.formAddTache.invalid) 
  return;{
  }
  const newTache ={
    
    libelle:this.formAddTache.get('libelle').value,
    number_of_hour:this.formAddTache.get('number_of_hour').value,
    date_limite:this.formAddTache.get('date_limite').value,
    priorite:this.formAddTache.get('priorite').value,
    description:this.formAddTache.get('description').value,
    project_id:this.projectIdForTask,
    

  }
  this.projectService.postTask(newTache)


}



showTaskList(project_id){
    this.projectService.getTasksByIdProject(project_id).then((data) => {

        console.log(this.projectIdForTask);
        console.log(data);
        this.task= [];
        this.task = data;
        this.projectIdForTask=project_id;
        

})}

  taches(id,ri){
   
    this.showTachesTable=true;
  }

}
