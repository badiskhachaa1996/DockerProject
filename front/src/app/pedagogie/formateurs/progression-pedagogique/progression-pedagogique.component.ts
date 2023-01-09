import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressionPeda } from 'src/app/models/ProgressionPeda';
import { Seance } from 'src/app/models/Seance';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressionPedaService } from 'src/app/services/pedagogie/progression-peda.service';

@Component({
  selector: 'app-progression-pedagogique',
  templateUrl: './progression-pedagogique.component.html',
  styleUrls: ['./progression-pedagogique.component.scss']
})
export class ProgressionPedagogiqueComponent implements OnInit {

  constructor(private router: Router,private route: ActivatedRoute, private PPService: ProgressionPedaService, private AuthService: AuthService) { }
  ID = this.route.snapshot.paramMap.get('formateur_id');
  FORMATEUR: User;
  ppList: ProgressionPeda[] = [];
  ngOnInit(): void {
    this.PPService.getAllByUserID(this.ID).subscribe(data => {
      this.ppList = data
    })
    this.AuthService.getPopulate(this.ID).subscribe(data => {
      this.FORMATEUR = data
    })
  }

  getDuree(seance: Seance) {
    let d_b = new Date(seance.date_debut)
    let d_f = new Date(seance.date_fin)
    let h = d_f.getHours() - d_b.getHours()
    let m = Math.abs(d_f.getMinutes() - d_b.getMinutes())
    return h.toString() + "H" + m.toString()
  }

  seeSeance(seance){
    this.router.navigate(['emergement',seance._id])
  }

}
