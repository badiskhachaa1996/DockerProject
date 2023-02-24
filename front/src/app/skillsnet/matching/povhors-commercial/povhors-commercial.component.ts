import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { CV } from 'src/app/models/CV';
import jwt_decode from 'jwt-decode';
import { Annonce } from 'src/app/models/Annonce';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { Matching } from 'src/app/models/Matching';
import { User } from 'src/app/models/User';
@Component({
  selector: 'app-povhors-commercial',
  templateUrl: './povhors-commercial.component.html',
  styleUrls: ['./povhors-commercial.component.scss']
})
export class POVHorsCommercialComponent implements OnInit {
  token;
  //TYPE = this.route.snapshot.paramMap.get('type')
  ID = this.route.snapshot.paramMap.get('id')
  USER: User;
  AllowRemarque = false

  matching: Matching[] = [];

  constructor(private MatchingService: MatchingService, private route: ActivatedRoute, private router: Router,
    private AnnonceService: AnnonceService, private UserService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.MatchingService.getAllByCVUSERID(this.ID).subscribe(matching => {
      this.matching = matching
    })
    this.AllowRemarque = this.token.role == "Admin"
    this.UserService.getPopulate(this.ID).subscribe(u => {
      this.USER = u
      if (!this.AllowRemarque)
        this.AllowRemarque = (u.role == "Commercial" || u.type == "Commercial")
    })
  }

  Validate(match: Matching) {
    this.MatchingService.update(match._id, { statut: "Validé par l'étudiant" }).subscribe(m => {
      this.matching.splice(this.includesId(m._id), 1, m)
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

}
