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
  tuteurInfoPerso: any;
  idTuteur = this.route.snapshot.paramMap.get('idTuteur');
  ParmTuteur = this.route.snapshot.paramMap.get('idTuteur');
  constructor(private entrepriseService: EntrepriseService, private route: ActivatedRoute,
    private messageService: MessageService, private router: Router,
    private authService: AuthService, private tuteurService: TuteurService) { }

  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))
    console.log(this.token)


    //LISTE A AFFICHER POUR LADMIN
    if (this.token.role == "Admin") {

      this.entrepriseService.getAllContrats().subscribe(Allcontrats => {
        console.log(Allcontrats)
        this.ListeContrats = Allcontrats;

      })

    }
    //LISTE A AFFICHER POUR LES CEO ENTREPRISE 
    else if (!this.idTuteur && this.token.type == "CEO Entreprise") {

      this.entrepriseService.getByDirecteurId(this.token.id).subscribe(entrepriseData => {
        console.log(entrepriseData)
        this.entrepriseService.getAllContratsbyEntreprise(entrepriseData._id).subscribe(listeData => {

          this.ListeContrats = listeData;
          console.log(listeData)
        })
      }, (eror) => { console.log(eror) })

    }
    // LISTE A AFFICHER POUR LES TUTEURS
    else if (this.token.type == "Tuteur") {
      this.tuteurService.getByUserId(this.token.id).subscribe(TutData => {
        this.idTuteur = TutData._id


        console.log(this.idTuteur)
        this.entrepriseService.getAllContratsbyTuteur(this.idTuteur).subscribe(listeData => {

          this.ListeContrats = listeData;
          console.log(listeData)
        })
      })
    }
    else {
      this.entrepriseService.getAllContratsbyTuteur(this.idTuteur).subscribe(listeData => {

        this.ListeContrats = listeData;
        console.log(listeData)
        this.tuteurService.getById(this.idTuteur).subscribe(TutData => {
          this.authService.getInfoById(TutData._id).subscribe(TuteurInfoPerso => {
            console.log(TuteurInfoPerso)
            this.tuteurInfoPerso = TuteurInfoPerso
          })


        })
      })
    }


  }
  showPresence(alternant_id) {
    console.log(alternant_id)
    this.router.navigate(["details/" + alternant_id]);
  }


  // showPresence(alternant_id) {
  //   console.log(alternant_id)
  //   this.router.navigate(["details/" + alternant_id]);
  // }


}
