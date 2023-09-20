import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { SuiviCandidatService } from 'src/app/services/skillsnet/suivi-candidat.service';
import jwt_decode from "jwt-decode";
import { User } from 'src/app/models/User';
import { Entreprise } from 'src/app/models/Entreprise';
import { SuiviCandidat } from 'src/app/models/SuiviCandidat';
@Component({
  selector: 'app-suivi-candidat',
  templateUrl: './suivi-candidat.component.html',
  styleUrls: ['./suivi-candidat.component.scss']
})
export class SuiviCandidatComponent implements OnInit {
  candidats = []
  token;
  USER: User
  ENTREPRISE: Entreprise
  selectedSuivi: SuiviCandidat
  showForm;

  avancementDropdown = [
    { label: "Entretien Préliminaire", value: "Entretien Préliminaire" },
    { label: "Entretien Final", value: "Entretien Final" },
    { label: "Présélectionné", value: "Présélectionné" },
    { label: "En Attente de Décision", value: "En Attente de Décision" },
    { label: "Offre d'Emploi", value: "Offre d'Emploi" },
    { label: "Embauché", value: "Embauché" },
    { label: "À Réexaminer", value: "À Réexaminer" },
    { label: "Retiré", value: "Retiré" },
  ]
  constructor(private SuiviCandidatService: SuiviCandidatService, private entrepriseService: EntrepriseService, private UserService: AuthService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"));
    this.UserService.getPopulate(this.token.id).subscribe(r => {
      this.USER = r
    })
    this.entrepriseService.getByDirecteurId(this.token.id).subscribe(r2 => {
      this.ENTREPRISE = r2
      this.SuiviCandidatService.getAllByEntrepriseID(r2._id).subscribe(r3 => {
        this.candidats = r3
      })
    })
  }

  onContact(data: SuiviCandidat) {
    this.selectedSuivi = data
    this.showForm = "Contact"
    this.scrollToTop()
  }

  onAvancement(data: SuiviCandidat) {
    this.selectedSuivi = data
    this.showForm = "Avancement"
    this.scrollToTop()
  }

  onNote(data: SuiviCandidat) {
    this.selectedSuivi = data
    this.showForm = "Note"
    this.scrollToTop()
  }

  onUpdate() {
    this.SuiviCandidatService.update({ ...this.selectedSuivi }).subscribe(r => {
      this.showForm = null
    })
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

}
