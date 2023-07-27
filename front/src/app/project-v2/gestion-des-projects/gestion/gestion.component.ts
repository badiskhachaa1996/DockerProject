import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { Project } from 'src/app/models/Project';
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
  responsableListe: any[] = [];
  project!: Project[];
  userConnected: User;
  token: any;
  showTachesTable: boolean = false;
  showtache: boolean = false;
  nbr_project:Number;
  nbr_projectEnCour:Number;
  nbr_projectCloturer:Number;

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

    this.projectService.getProjects().then((data) => {
      console.log(data);
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

    //INITIALISATION DU FORMULAIRE
    this.formAddProject = this.formBuilder.group({
      titre: ['', Validators.required],
      responsable: [''],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
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
    console.log(this.formAddProject.get('responsable'))
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
  taches(id,ri){
    console.log("i am here");
    this.showTachesTable=true;
  }
}
