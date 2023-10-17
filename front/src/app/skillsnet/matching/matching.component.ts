import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {
  @Input() ID = '';
  @Output() rdv = new EventEmitter<{ label: string, ID: string, offer_id: string }>();
  @Output() cv = new EventEmitter<{ label: string, ID: string }>();
  token;
  offre: Annonce;
  matcher: User;
  isCommercial = false

  matching: Matching[] = [];

  statutList = [{ value: "En cours" }, { value: "Entretien" }, { value: "Accepté" }, { value: "Refusé" }]

  isNotWinner = false

  showUpdateStatut = false

  matchingsPotentiel: Matching[] = []

  formUpdateStatut: FormGroup = new FormGroup({
    statut: new FormControl('', [Validators.required]),
    remarque: new FormControl('', []),
    _id: new FormControl('', [Validators.required]),
  })

  constructor(private MatchingService: MatchingService, private route: ActivatedRoute,
    private AnnonceService: AnnonceService, private UserService: AuthService,
    private messageService: MessageService, private RDVService: MeetingTeamsService,
    private router: Router) { }
  rdvDic = {}
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
      this.isCommercial = u.role == "Commercial" || u.type == "Commercial"
    })
    if (this.route.snapshot.paramMap.get('offre_id'))
      this.AnnonceService.getAnnonce(this.route.snapshot.paramMap.get('offre_id')).then(offre => {
        this.offre = offre
        this.MatchingService.generateMatchingV1(offre._id).subscribe(cvs => {
          this.matchingsPotentiel = cvs
        })
        this.MatchingService.getAllByOffreID(offre._id).subscribe(matched => {
          this.matching = matched
        })
        this.RDVService.getAllByOffreID(offre._id).subscribe(rdvs => {
          rdvs.forEach(rd => {
            if (rd.user_id)
              this.rdvDic[rd.user_id._id] = rd
          })
        })
      })
    else if (this.ID)
      this.AnnonceService.getAnnonce(this.ID).then(offre => {
        this.offre = offre
        this.MatchingService.generateMatchingV1(offre._id).subscribe(cvs => {
          this.matchingsPotentiel = cvs
        })
        this.MatchingService.getAllByOffreID(offre._id).subscribe(matched => {
          this.matching = matched
        })
        this.RDVService.getAllByOffreID(offre._id).subscribe(rdvs => {
          rdvs.forEach(rd => {
            if (rd.user_id)
              this.rdvDic[rd.user_id._id] = rd
          })
        })
      })

  }

  InitUpdateStatut(match: Matching) {
    this.formUpdateStatut.setValue({ _id: match._id, remarque: match.remarque, statut: match.statut })
    this.showUpdateStatut = true
    //this.messageService.add({ summary: "Mis à jour du statut du matching en cours de dévéloppement", severity: "info", detail: `Pouvoir modifier le statut pour mettre 'Validé du coté Entreprise ou Winner/Alternant'` })
  }

  AcceptMatching(cv: CV, taux = 0, match: Matching = null) {
    let type_matching = "Commercial"
    if (this.token.type == "CEO Entreprise" || this.token.type == "Entreprise" || this.token.type == "Tuteur")
      type_matching = "Entreprise"
    else if (this.token.type == "Initial" || this.token.type == "Alternant" || this.token.type == null)
      type_matching = "Candidat"
    let matching = {
      offre_id: this.offre._id,
      matcher_id: this.token.id,
      cv_id: cv?._id,
      type_matching,
      date_creation: new Date(),
      taux,
      accepted: true,
      favoris: null,
      hide: null
    }
    if (!match._id)
      this.MatchingService.create(matching).subscribe(match => {
        this.messageService.add({ summary: "Matching enregistré", severity: "success", detail: `Type matching:${type_matching}` })
        this.matching.push(match)
        this.matchingsPotentiel.forEach((m, idx) => {
          let b1: any = m.cv_id.user_id
          let b2: any = m.cv_id.user_id
          if (b1._id == b2._id)
            this.matchingsPotentiel.splice(idx, 1)
        })
      })
    else {
      this.MatchingService.update(match._id, matching).subscribe(match => {
        this.messageService.add({ summary: "Matching enregistré", severity: "success", detail: `Type matching:${type_matching}` })
        this.matching.push(match)
        this.matchingsPotentiel.forEach((m, idx) => {
          let b1: any = m.cv_id.user_id
          let b2: any = m.cv_id.user_id
          if (b1._id == b2._id)
            this.matchingsPotentiel.splice(idx, 1)
        })
      })
    }

  }

  onUpdateStatut() {
    let m = {
      ...this.formUpdateStatut.value
    }
    this.MatchingService.update(m._id, m).subscribe(matching => {
      this.matching.splice(this.includesId(matching._id), 1, matching)
      this.formUpdateStatut.reset()
      this.showUpdateStatut = false
      this.messageService.add({ summary: 'Mis à jour du statut de matching avec succès', severity: 'success' })
    })
  }

  includesId(id: string) {
    let r = -1
    this.matching.forEach((val, index) => {
      if (val._id == id)
        r = index
    })
    return r
  }

  UpdateStatut(m) {
    this.MatchingService.update(m._id, { statut: "Validé par l'étudiant et l'entreprise" }).subscribe(matching => {
      this.matching.splice(this.includesId(matching._id), 1, matching)
      this.formUpdateStatut.reset()
      this.showUpdateStatut = false
      this.messageService.add({ summary: 'Mis à jour du statut de matching avec succès', severity: 'success' })
    })
  }

  hideAndSeek(match, idx) {
    console.log(idx)
    let favoris = false
    if (!match?.hide != false)
      favoris = match?.favoris
    let offre_id = this.ID
    if (!offre_id)
      offre_id = this.route.snapshot.paramMap.get('offre_id')
    if (match._id)
      this.MatchingService.update(match._id, { hide: !match.hide, favoris }).subscribe(matching => {
        this.matchingsPotentiel.splice(idx, 1)
        if (matching.hide)
          this.matchingsPotentiel.push(matching)
        else
          this.matchingsPotentiel.unshift(matching)
      })
    else
      this.MatchingService.create({ ...match, matcher_id: this.token.id, offre_id, hide: true }).subscribe(matching => {
        this.matchingsPotentiel.splice(idx, 1)
        if (matching.hide)
          this.matchingsPotentiel.push(matching)
        else
          this.matchingsPotentiel.unshift(matching)
      })
  }
  myFavorite(match, idx) {
    let hide = false
    if (!match?.favoris != false)
      hide = match?.hide
    let offre_id = this.ID
    if (!offre_id)
      offre_id = this.route.snapshot.paramMap.get('offre_id')
    if (match._id)
      this.MatchingService.update(match._id, { favoris: !match?.favoris, hide }).subscribe(matching => {
        this.matchingsPotentiel.splice(idx, 1)
        if (matching.favoris)
          this.matchingsPotentiel.unshift(matching)
        else
          this.matchingsPotentiel.push(matching)
      })
    else
      this.MatchingService.create({ ...match, matcher_id: this.token.id, offre_id, favoris: true }).subscribe(matching => {
        this.matchingsPotentiel.splice(idx, 1)
        if (matching.favoris)
          this.matchingsPotentiel.unshift(matching)
        else
          this.matchingsPotentiel.push(matching)
      })
  }

  cancelMatching(match: Matching) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce matching ?"))
      this.MatchingService.delete(match._id).subscribe(r => {
        this.matching.splice(this.matching.indexOf(match), 1)
        this.matchingsPotentiel.push(r)
      })
  }
  seeCV(cv: CV) {
    console.log(cv)
    this.cv.emit({ ID: cv._id, label: `CV - ${cv?.user_id?.firstname} ${cv?.user_id.lastname}` })
    //this.router.navigate(['cv', cv_id])
  }
  takeRDV(match: Matching) {
    //OFFER LA
    let ID = this.ID
    if(!this.ID)
      ID = this.route.snapshot.paramMap.get('offre_id')
    this.rdv.emit({ ID: match?.cv_id?.user_id?._id, offer_id: ID, label: `${this.offre.custom_id} - ${match?.cv_id?.user_id.firstname} ${match?.cv_id?.user_id.lastname}` })
    //this.router.navigate(['rendez-vous/', match?.cv_id?.user_id?._id])
  }
  @ViewChild('dtmatching') dtmatching: Table;
  filterCustomFav(e) {
    console.log(e)
    if (e == false)
      this.dtmatching.filter('', 'favoris', 'contains')
    else
      this.dtmatching.filter(true, 'favoris', 'equals')
  }
}
