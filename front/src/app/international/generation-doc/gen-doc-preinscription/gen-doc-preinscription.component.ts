import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-gen-doc-preinscription',
  templateUrl: './gen-doc-preinscription.component.html',
  styleUrls: ['./gen-doc-preinscription.component.scss']
})
export class GenDocPreinscriptionComponent implements OnInit {
  constructor(private AService: AdmissionService, private route: ActivatedRoute, private FAService: FormulaireAdmissionService) { }
  prospect: Prospect
  ecole: EcoleAdmission
  ngOnInit(): void {
    this.AService.getById(this.route.snapshot.paramMap.get('prospect_id')).subscribe(data => {
      this.prospect = data
    })
  }

}
