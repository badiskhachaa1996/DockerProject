import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
import { Prospect } from 'src/app/models/Prospect';
import { RentreeAdmission } from 'src/app/models/RentreeAdmission';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-gen-doc-inscription',
  templateUrl: './gen-doc-inscription.component.html',
  styleUrls: ['./gen-doc-inscription.component.scss']
})
export class GenDocInscriptionComponent implements OnInit {

  ecole_id = this.route.snapshot.paramMap.get('ecole');
  prospect_id = this.route.snapshot.paramMap.get('prospect_id');
  formation_id = this.route.snapshot.paramMap.get('formation');
  rentree_id = this.route.snapshot.paramMap.get('rentree');

  frais_preinscription = "550"
  date_limite_arrivee = new Date()

  user: User
  prospect: Prospect
  ecole: EcoleAdmission
  formation: FormationAdmission
  rentree: RentreeAdmission

  constructor(private route: ActivatedRoute, private AdmissionService: AdmissionService, private FAService: FormulaireAdmissionService) { }

  ngOnInit(): void {
    this.AdmissionService.getPopulateByUserid(this.prospect_id).subscribe(data => {
      this.user = data.user_id
      this.prospect = data
    })
    this.FAService.EAgetByID(this.ecole_id).subscribe(data => {
      this.ecole = data
      this.user.pays_adresse
    })
    this.FAService.FAgetByID(this.formation_id).subscribe(data => {
      this.formation = data
    })
    this.FAService.RAgetByID(this.rentree_id).subscribe(data => {
      this.rentree = data
      this.updateDateLimite()
    })
  }

  updateDateLimite() {
    this.date_limite_arrivee = new Date(this.rentree.date_commencement)
    this.date_limite_arrivee.setMonth(this.date_limite_arrivee.getMonth() + 1)
  }

  exportPDF(){
    
  }

}
