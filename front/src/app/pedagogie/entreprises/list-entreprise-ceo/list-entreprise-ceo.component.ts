import { Component, OnInit } from '@angular/core';
import { Entreprise } from 'src/app/models/Entreprise';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ContratAlternance } from 'src/app/models/ContratAlternance';

@Component({
  selector: 'app-list-entreprise-ceo',
  templateUrl: './list-entreprise-ceo.component.html',
  styleUrls: ['./list-entreprise-ceo.component.scss']
})
export class ListEntrepriseCeoComponent implements OnInit {

  loading:boolean = true;
  entreprises: Entreprise[] = [];
  contracts: ContratAlternance[] = [];
  showContractForEnterprise: boolean = false;

  // entreprise selectionné
  entrepriseSelected: Entreprise;

  token: any;

  constructor(private router: Router, private messageService: MessageService, private entrepriseService: EntrepriseService, private userService: AuthService) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des entreprises du CEO connecté
    this.entrepriseService.getEntreprisesByIdCEO(this.token.id)
    .then((response) => { this.entreprises = response; this.loading = false;})
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Entreprise', detail: error.error }); })
  }

  // Methode de recuperation des alternants de l'entreprise
  onLoadContracts(entreprise: Entreprise): void
  {
    this.entrepriseSelected = entreprise;

    this.entrepriseService.getAllContratsbyEntreprise(entreprise._id).subscribe({
      next: (response) => { 
        this.contracts = response; 
        this.showContractForEnterprise = true; 
      },
      error: (error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Contrats', detail: error.error }); },
      complete: () => { console.log('Liste des contrats récuperé')}
    });
  }

  // methode de edirection vers la liste des présences
  showPresence(alternant_id: String): void 
  {
    this.router.navigate(["details/" + alternant_id]);
  }

}
