import { Component, Input, OnInit } from '@angular/core';
import { Matching } from 'src/app/models/Matching';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import jwt_decode from 'jwt-decode';
import { Tuteur } from 'src/app/models/Tuteur';
import { Entreprise } from 'src/app/models/Entreprise';
import { TuteurService } from 'src/app/services/tuteur.service';
@Component({
  selector: 'app-matching-viewer',
  templateUrl: './matching-viewer.component.html',
  styleUrls: ['./matching-viewer.component.scss']
})
export class MatchingViewerComponent implements OnInit {
  matchingToSee: Matching[] = []
  @Input() USER_ID = '';
  rdvDic = {}
  constructor(private RDVService: MeetingTeamsService, private MatchingService: MatchingService, private EntrepriseService: EntrepriseService, private TuteurService: TuteurService) { }
  token;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.EntrepriseService.getByDirecteurId(this.token.id).subscribe((t: Entreprise) => {
      if (t) {
        this.MatchingService.getMatchingByUserAndEntreprise(this.USER_ID, t._id).subscribe(r => {
          this.matchingToSee = r
        })
      } else {
        this.TuteurService.getPopulatebyUserID(this.token.id).subscribe(tuteur => {
          if (tuteur) {
            this.MatchingService.getMatchingByUserAndEntreprise(this.USER_ID, t._id).subscribe(r => {
              this.matchingToSee = r
            })
          } else {
            this.MatchingService.generateMatchingV1USERID(this.USER_ID).subscribe(r => {
              this.token = jwt_decode(localStorage.getItem('token'));
              this.matchingToSee = r
            })
          }
        })
      }
    })

    this.RDVService.getAllByUserID(this.USER_ID).subscribe(rdvs => {
      rdvs.forEach(rd => {
        if (rd.offre_id)
          this.rdvDic[rd.offre_id._id] = rd
      })
    })
  }

  displayRDV = false
  dataRDV = null
  seeRDV(rdv: MeetingTeams) {
    this.displayRDV = true
    this.dataRDV = rdv
  }

}
