import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-lead-suivi',
  templateUrl: './lead-suivi.component.html',
  styleUrls: ['./lead-suivi.component.scss']
})
export class LeadSuiviComponent implements OnInit {

  ID = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService) { }

  ngOnInit(): void {
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(data => {
        this.PROSPECT = data
      })
  }

  visaList = [
    { label: "Oui", value: "Oui" },
    { label: "Non concerné", value: "Non concerné" },
    { label: "Non", value: "Non" },
    { label: "Pas de retour", value: "Pas de retour" },
  ]

  cfList = [
    { label: "Pas d'avancement", value: "Pas d'avancement" },
    { label: "Compte Campus France crée", value: "Compte Campus France crée" },
    { label: "En attente de l'entretien", value: "En attente de l'entretien" },
    { label: "Entretien Validé", value: "Entretien Validé" },
  ]

  updateValue(label) {
    let dic = { _id: this.PROSPECT._id }
    dic[label] = this.PROSPECT[label]
    this.ProspectService.updateV2(dic).subscribe(data => {
      console.log(label, data[label],dic)
    })
  }

}
