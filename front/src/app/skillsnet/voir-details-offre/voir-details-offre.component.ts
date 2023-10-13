import { Component, OnInit, Input } from '@angular/core';
import { Annonce } from 'src/app/models/Annonce';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import jwt_decode from "jwt-decode";
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-voir-details-offre',
  templateUrl: './voir-details-offre.component.html',
  styleUrls: ['./voir-details-offre.component.scss']
})
export class VoirDetailsOffreComponent implements OnInit {
  @Input() ANNONCE_ID
  constructor(private AnnonceService: AnnonceService, private CvService: CvService, private MatchingService: MatchingService,
    private ToastService: MessageService) { }
  ANNONCE: Annonce
  profil_str = ""
  token;
  ngOnInit(): void {

    this.AnnonceService.getAnnonce(this.ANNONCE_ID).then(annonce => {
      this.ANNONCE = annonce
      this.profil_str = annonce.profil?.libelle
      if (!this.profil_str)
        this.profil_str = annonce.competences[0]?.profile_id?.libelle
    })
    this.token = jwt_decode(localStorage.getItem("token"));
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

}
