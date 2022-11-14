import { Component, OnInit } from '@angular/core';
import { Agent } from 'http';
import { Etudiant } from '../models/Etudiant';
import { Formateur } from '../models/Formateur';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { CommercialPartenaireService } from '../services/commercial-partenaire.service';
import { EtudiantService } from '../services/etudiant.service';
import { FormateurService } from '../services/formateur.service';

@Component({
  selector: 'app-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss']
})
export class UsersSettingsComponent implements OnInit {

  users: User[] = [];
  userToUpdate: User;
  showFormUpdate: boolean = false;
  showUsersList: boolean = true;

  typeList: any = [
    { label: 'Tous les types', value: null },
    { label: 'Salarié', value: 'Salarié' },
    { label: 'CEO Entreprise', value: 'CEO Entreprise' },
    { label: 'Tuteur', value: 'Tuteur' },
    { label: 'Etudiant', value: 'Etudiant' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Formateur', value: 'Formateur' },
    { label: 'Commercial', value: 'Commercial' },
  ];

  roleList: any = [
    { label: 'Tous les rôles', value: null },
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Agent', value: 'Agent' },
    { label: 'Responsable', value: 'Responsable' },
  ];


  etudiants: Etudiant[] = [];
  formateurs: Formateur[] = [];
  agents: User[] = [];
  

  constructor(private userService: AuthService, private etudiantService: EtudiantService, 
              private formateurService: FormateurService, private commercialService: CommercialPartenaireService) { }

  ngOnInit(): void {
    //Recuperation de la liste des users
    this.userService.getAllPopulate()
      .then((response: User[]) => { this.users = response })
      .catch((error) => { console.log(error) });

    //Recuperation de la liste des étudiants
    this.etudiantService.getAll().subscribe(
      ((response) => { this.etudiants = response }),
      ((error) => { console.log(error) })
    );

    //Recuperation de la liste des formateurs
    this.formateurService.getAll().subscribe(
      ((response) => { this.formateurs = response }),
      ((error) => { console.log(error) })
    );

    //Recuperation de la liste des agents
    this.userService.getAllAgent().subscribe(
      ((response) => { this.agents = response }),
      ((error) => { console.log(error) })
    );
  }


}
