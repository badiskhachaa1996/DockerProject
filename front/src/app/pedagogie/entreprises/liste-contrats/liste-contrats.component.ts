import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-liste-contrats',
  templateUrl: './liste-contrats.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./liste-contrats.component.scss']
})
export class ListeContratsComponent implements OnInit {
  token;
  ListeContrats = []
  idTuteur = this.route.snapshot.paramMap.get('idTuteur');
  constructor(private entrepriseService: EntrepriseService, private route: ActivatedRoute, private messageService: MessageService, private router: Router, private authService: AuthService,) { }

  ngOnInit(): void {


    this.token = jwt_decode(localStorage.getItem("token"))
    console.log(this.token)
    
    if (!this.idTuteur && this.token)
      this.idTuteur = this.token.id

  
    this.entrepriseService.getAllContrats(this.idTuteur).subscribe(listeData => {
      this.ListeContrats = listeData;


    })
  }

}
