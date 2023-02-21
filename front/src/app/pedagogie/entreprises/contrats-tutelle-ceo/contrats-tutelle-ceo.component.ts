import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { ContratAlternance } from 'src/app/models/ContratAlternance';

@Component({
  selector: 'app-contrats-tutelle-ceo',
  templateUrl: './contrats-tutelle-ceo.component.html',
  styleUrls: ['./contrats-tutelle-ceo.component.scss']
})
export class ContratsTutelleCeoComponent implements OnInit {

  contracts: ContratAlternance[] = [];
  token: any;

  constructor(private messageService: MessageService, private entrepriseService: EntrepriseService, private userService: AuthService) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des contrat sous la tutelle du ceo
    this.entrepriseService.getContratsByCeo(this.token.id)
    .then((response) => { 
      this.contracts = response.contrats;
      this.messageService.add({ severity: 'success', summary:'Contrats', detail: response.success });
    })
    .catch((error) => { console.log(error.error); this.messageService.add({ severity: 'error', summary:'Contrats', detail: error.errorMsg }); });
  }

}
