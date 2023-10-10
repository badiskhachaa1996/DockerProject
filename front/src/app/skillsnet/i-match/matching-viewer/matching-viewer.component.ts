import { Component, Input, OnInit } from '@angular/core';
import { Matching } from 'src/app/models/Matching';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';

@Component({
  selector: 'app-matching-viewer',
  templateUrl: './matching-viewer.component.html',
  styleUrls: ['./matching-viewer.component.scss']
})
export class MatchingViewerComponent implements OnInit {
  matchingToSee: Matching[] = []
  @Input() USER_ID = '';
  rdvDic = {}
  constructor(private RDVService: MeetingTeamsService, private MatchingService: MatchingService) { }

  ngOnInit(): void {
    console.log(this.USER_ID)
    this.MatchingService.generateMatchingV1USERID(this.USER_ID).subscribe(r => {
      this.matchingToSee = r
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
