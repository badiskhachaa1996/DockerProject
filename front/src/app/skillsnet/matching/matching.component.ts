import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Entreprise } from 'src/app/models/Entreprise';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { CV } from 'src/app/models/CV';
import { Annonce } from 'src/app/models/Annonce';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { Matching } from 'src/app/models/Matching';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {
  token;
  offre: Annonce;
  matcher: User;

  matching: Matching[] = [];

  statutList = ["En Cours", "Validé par l'étudiant", "Validé par l'étudiant et l'entreprise"]

  isNotWinner = false

  showUpdateStatut = false

  matchingsPotentiel: {
    cv: CV,
    taux: number
  }[] = []

  formUpdateStatut: FormGroup = new FormGroup({
    statut: new FormControl('', [Validators.required]),
    remarque: new FormControl('', [Validators.required]),
    _id: new FormControl('', [Validators.required]),
  })

  constructor(private MatchingService: MatchingService, private route: ActivatedRoute,
    private AnnonceService: AnnonceService, private UserService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.isNotWinner = this.token.role == "Admin"
    this.UserService.getPopulate(this.token.id).subscribe(u => {
      this.matcher = u
      if (!this.isNotWinner)
        this.isNotWinner = (u.role == "Commercial" || u.type == "Commercial" || u.type == "CEO Entreprise" || u.type == "Entreprise")
    })
    this.AnnonceService.getAnnonce(this.route.snapshot.paramMap.get('offre_id')).then(offre => {
      this.offre = offre
      this.MatchingService.generateMatchingV1(offre._id).subscribe(cvs => {
        this.matchingsPotentiel = cvs
      })
      this.MatchingService.getAllByOffreID(offre._id).subscribe(matched => {
        this.matching = matched
      })
    })


  }

  InitUpdateStatut(match: Matching) {
    this.formUpdateStatut.setValue({ _id: match._id, remarque: match.remarque, statut: match.statut })
    this.showUpdateStatut = true
    this.messageService.add({ summary: "Mis à jour du statut du matching en cours de dévéloppement", severity: "info", detail: `Pouvoir modifier le statut pour mettre 'Validé du coté Entreprise ou Winner/Alternant'` })
  }

  AcceptMatching(cv: CV) {
    let type_matching = "MR"
    if (this.matcher.type == "CEO Entreprise" || this.matcher.type == "Entreprise")
      type_matching = "ME"
    else if (this.matcher.type == "Commercial")
      type_matching = "MW"
    else if (this.matcher.type == "Alternant")
      type_matching = "MA"
    let matching = {
      offre_id: this.offre._id,
      matcher_id: this.token.id,
      cv_id: cv._id,
      type_matching,
      date_creation: new Date()
    }
    this.MatchingService.create(matching).subscribe(match => {
      this.messageService.add({ summary: "Matching enregistré", severity: "success", detail: `Type matching:${type_matching}` })
      this.matching.push(match)
      this.matchingsPotentiel.forEach((m, idx) => {
        let b1: any = m.cv.user_id
        let b2: any = m.cv.user_id
        if (b1._id == b2._id)
          this.matchingsPotentiel.splice(idx, 1)
      })
    })
  }

  onUpdateStatut() {
    let m = {
      ...this.formUpdateStatut.value
    }
  }
}
