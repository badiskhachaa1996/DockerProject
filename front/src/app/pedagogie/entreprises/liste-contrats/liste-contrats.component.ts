import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { AuthService } from 'src/app/services/auth.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';


@Component({
  selector: 'app-liste-contrats',
  templateUrl: './liste-contrats.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./liste-contrats.component.scss']
})
export class ListeContratsComponent implements OnInit {

  token;
  ListeContrats: ContratAlternance[] = []
  idTuteur = this.route.snapshot.paramMap.get('idTuteur');
  tuteurs: Tuteur[] = [];
  IDTuteur: Tuteur;
  alternantId=[];
  contrats : ContratAlternance[]=[]
  constructor(private entrepriseService: EntrepriseService, private route: ActivatedRoute,
    private messageService: MessageService, private router: Router,
    private authService: AuthService, private tuteurService: TuteurService) { }

  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))
    console.log(this.token)
    // let idTuteur = this.token._id

    if (!this.idTuteur && this.token){
    //get tuteur By UserID => idTUTEUR
      this.idTuteur = this.token.id
 
      this.tuteurService.getByUserId(this.idTuteur).subscribe(tuteur => {
        this.IDTuteur = tuteur
        this.idTuteur = this.IDTuteur._id 
        console.log(this.idTuteur)
        this.entrepriseService.getAllContrats(this.idTuteur).subscribe(listeData => {
          this.ListeContrats = listeData;
          console.log(listeData)
          this.contrats= listeData
          // this.alternantId = this.ListeContrats.alternant_id
          
        })    
      })
    }

  // showPresence(alternant_id) {
  //   console.log(alternant_id)
  //   this.router.navigate(["details/" + alternant_id]);
  // }

}
}
