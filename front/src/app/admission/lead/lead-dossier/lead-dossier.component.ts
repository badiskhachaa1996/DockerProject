import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-lead-dossier',
  templateUrl: './lead-dossier.component.html',
  styleUrls: ['./lead-dossier.component.scss']
})
export class LeadDossierComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  documents = []
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService) { }

  ngOnInit(): void {
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(data => {
        this.PROSPECT = data
      })
  }



}
