import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Annonce } from 'src/app/models/Annonce';
import { Matching } from 'src/app/models/Matching';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
@Component({
  selector: 'app-cv-etudiant',
  templateUrl: './cv-etudiant.component.html',
  styleUrls: ['./cv-etudiant.component.scss']
})
export class CvEtudiantComponent implements OnInit {
  activeIndex1 = 0
  token;
  USER
  matchingList = []
  visibleSidebar = false
  annonceSelected: Annonce
  rdvDic = {}
  handleClose(e) { }
  constructor(private AuthService: AuthService, private MatchingService: MatchingService, private ToastService: MessageService, private RDVService: MeetingTeamsService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"));
    this.AuthService.getPopulate(this.token.id).subscribe(user => {
      this.USER = user
    })
    this.MatchingService.getAllByCVUSERID(this.token.id).subscribe(matchings => {
      this.matchingList = matchings
    })
    this.RDVService.getAllByUserID(this.token.id).subscribe(rdvs => {
      rdvs.forEach(rd => {
        if (rd.offre_id)
          this.rdvDic[rd.offre_id._id] = rd
      })
    })
  }

  changeStatut(statut: string, match: Matching) {
    match.statut = statut
    this.MatchingService.update(match._id, { statut }).subscribe(r => {
      this.ToastService.add({ severity: 'success', summary: 'Statut du matching mis à jour' })
    })
  }
  seeOffre(offer_id) {
    this.visibleSidebar = true;
    this.annonceSelected = offer_id;
  }

  onExpand(match: Matching) {

  }
  displayRDV = false
  dataRDV;
  seeRDV(rdv: MeetingTeams) {
    this.displayRDV = true
    this.dataRDV = rdv
  }
}
