import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Conge } from 'src/app/models/Conge';
import { CongeService } from 'src/app/services/conge.service';
import { RhService } from 'src/app/services/rh.service';

@Component({
  selector: 'app-conges-autorisations',
  templateUrl: './conges-autorisations.component.html',
  styleUrls: ['./conges-autorisations.component.scss']
})
export class CongesAutorisationsComponent implements OnInit {

  conges: Conge[] = [];
  
  filterStatut: any[] = [
    { label: 'En attente', value: 'En attente' },
    { label: 'Refusé', value: 'Refusé' },
    { label: 'Validé', value: 'Validé' },
  ];

  filterType: any[] = [
    { label: 'Congé payé', value: 'Congé payé' },
    { label: 'Congé sans solde', value: 'Congé sans solde' },
    { label: 'Absence maladie', value: 'Absence maladie' },
    { label: 'Télétravail', value: 'Télétravail' },
    { label: 'Départ anticipé', value: 'Départ anticipé' },
    { label: 'Autorisation', value: 'Autorisation' },
    { label: 'Autre motif', value: 'Autre motif' },
  ];

  collaborateursFilter: any[] = [];
  btnActions: MenuItem[] = [];

  constructor(private congeService: CongeService, private rhService: RhService, private messageService: MessageService) { }

  ngOnInit(): void {
    // recuperation de la liste des collaborateurs
    this.rhService.getCollaborateurs()
    .then((response) => {
      response.forEach((collaborateur) => {
        let {user_id} = collaborateur;

        let userName = `${user_id.firstname} ${user_id.lastname}`;
        let userObj = {label: userName, value: user_id._id};
        this.collaborateursFilter.push(userObj);
      });
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de récupérer la liste des collaborateurs' }) });

    // recuperation de la liste des congés
    this.onGetConges();
    
  }


  // méthode de recuperation de la liste des congés
  onGetConges(): void
  {
    this.congeService.getAll()
    .then((response) => {
      this.conges = response;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de récupérer la liste des congés' }) });
  }

}
