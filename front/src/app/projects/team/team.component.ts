import  jwt_decode  from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/Team';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from 'src/app/services/team.service';
import { MessageService } from 'primeng/api';
import { User} from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  token: any;
  teams: Team[] = [];
  clonedTeams: { [s: string]: Team; } = {};
  showFormAddTeam: boolean = false;
  formAddTeam: FormGroup;  
  showFormAddSalaries : boolean = false;
  formAddSalaries: FormGroup;
  showFormUpdateTeam: boolean = false;
  formUpdateTeam: FormGroup;
  showTableOfSalaries: boolean = false;
  dropdownUser: any[] = []; 
  selectedMulti: string[] = [];


  constructor(private userService: AuthService, private formBuilder: FormBuilder, private teamService: TeamService, private messageService: MessageService) { }

  ngOnInit(): void 
  {
    //Décodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    //Initialisation du formulaire d'ajout d'une équipe
    this.formAddTeam = this.formBuilder.group({
      libelle: ['', Validators.required],
      abbreviation: ['', Validators.required],
    });

    //Initialisation du formulaire de modification d'une équipe
    this.formUpdateTeam = this.formBuilder.group({
      libelle: ['', Validators.required],
      abbreviation: ['', Validators.required],
    })

    //Permet d'afficher la liste des équipes et de la liste des salariés
    this.onGetAllClasses();
  }

  onGetAllClasses(): void 
  {
    //Récupération de la liste des équipes
    this.teamService.getTeams()
    .then((response) => { this.teams = response; })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary: 'Équipes', detail: "Impossible de récupérer la liste des équipes, veuillez contacter un administrator "}); });

    //Récupération de la liste des salariés
    this.userService.getAllSalarie()
    .then((response) => {
      this.dropdownUser = [];

      response.forEach((user: User) => {
        this.dropdownUser.push({ label: `${user.firstname} ${user.lastname}`, value: user._id });
      });
    })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Utilisateur', detail: "Impossible de récuperer la liste des salariés, veuillez contacter un administrateur" }); });

  }

  onAddTeam(): void 
  {
    let formValue = this.formAddTeam.value;
    const team = new Team();

    team.libelle = formValue.libelle;
    team.abbreviation = formValue.abbreviation;
    
    console.log(team);

    this.teamService.createTeam(team)
    .then((response) =>{
      this.messageService.add({severity: 'success', summary: 'Team', detail: response.success });
      this.formAddTeam.reset();
      this.showFormAddTeam = false;
      this.onGetAllClasses();
    }) 
    .catch((error) =>{ console.error(error); this.messageService.add({severity: 'error', summary: 'Team', detail: error.error }); });
  }


  onRowEditInit(team: Team) 
  {
    this.clonedTeams[team._id] = {...team}; 
  }

  onRowEditSave(team: Team)
  {
    this.teamService.updateTeam(team)
    .then((response) =>{
      this.messageService.add({severity: 'success', summary: 'Team', detail: "Mis à jour réussi"});
      this.onGetAllClasses();
    })
    .catch((error) => { console.error(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: error.error }); });

    delete this.clonedTeams[team._id];
    this.messageService.add({severity:'success', summary: 'Team', detail:'Mis à jour réussi'});
  }

  onRowEditCancel(project: Team, index: number) 
  {
    delete this.clonedTeams[project._id];
  }

}
