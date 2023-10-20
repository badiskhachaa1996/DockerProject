import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Annonce } from 'src/app/models/Annonce';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import jwt_decode from "jwt-decode";
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-voir-details-offre',
  templateUrl: './voir-details-offre.component.html',
  styleUrls: ['./voir-details-offre.component.scss']
})
export class VoirDetailsOffreComponent implements OnInit {
  @Input() ANNONCE_ID
  @Output() UPDATE = new EventEmitter<{ ANNONCE_ID: string }>();
  @Output() MATCHING = new EventEmitter<{ ANNONCE_ID: string }>();

  constructor(private AnnonceService: AnnonceService, private CvService: CvService, private MatchingService: MatchingService,
    private ToastService: MessageService, private userService: AuthService) { }
  ANNONCE: Annonce
  profil_str = ""
  token;
  isEtudiant = true
  ngOnInit(): void {
    this.AnnonceService.getAnnonce(this.ANNONCE_ID).then(annonce => {
      this.ANNONCE = annonce
      this.profil_str = annonce.profil?.libelle
      if (!this.profil_str)
        this.profil_str = annonce.competences[0]?.profile_id?.libelle
    })
    this.token = jwt_decode(localStorage.getItem("token"));
    this.userService.getPopulate(this.token.id).subscribe(user => {
      console.log(user)
      this.isEtudiant = (user.type == 'Initial' || user.type == 'Alternant' || user.type == 'Prospect' || user.type == 'Externe' || user.type == 'Externe-InProgress' || (user.type == null && user.role == 'user'))
    })
  }

  InitPostulate() {
    this.CvService.getCvbyUserId(this.token.id).subscribe(cv => {
      if (cv) {
        let matching = {
          offre_id: this.ANNONCE._id,
          matcher_id: this.token.id,
          cv_id: cv._id,
          type_matching: "Candidat",
          date_creation: new Date()
        }
        this.MatchingService.create(matching).subscribe(match => {
          this.ToastService.add({ summary: "Matching enregistré", severity: "success" })
        })
      } else {
        this.ToastService.add({ summary: "Non eligible au matching", severity: "error", detail: "Merci de créer votre cv pour pouvoir être eligible au matching" })
      }
    })
  }

  Edit() {
    this.UPDATE.emit({ ANNONCE_ID: this.ANNONCE_ID })
  }

  Matching() {
    this.MATCHING.emit({ ANNONCE_ID: this.ANNONCE_ID })
  }

}
