import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EtudiantIntuns } from 'src/app/models/intuns/EtudiantIntuns';
import { EtudiantsIntunsService } from 'src/app/services/intuns/etudiants-intuns.service';

@Component({
  selector: 'app-employabilite',
  templateUrl: './employabilite.component.html',
  styleUrls: ['./employabilite.component.scss']
})
export class EmployabiliteComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  dataIntuns: EtudiantIntuns
  constructor(private route: ActivatedRoute, private EtudiantIntunsService: EtudiantsIntunsService) { }

  ngOnInit(): void {
    if (this.ID) {
      this.EtudiantIntunsService.EIgetByID(this.ID).subscribe(r => {
        this.dataIntuns = r
      })
    }
  }

}
