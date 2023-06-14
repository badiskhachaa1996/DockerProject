import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-lead-informations-personnel',
  templateUrl: './lead-informations-personnel.component.html',
  styleUrls: ['./lead-informations-personnel.component.scss']
})
export class LeadInformationsPersonnelComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService) { }
  formUpdateUser = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    nationnalite: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required),
  })

  formUpdateProspect = new FormGroup({
    date_naissance: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required),
  })
  ngOnInit(): void {
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(data => {
        this.PROSPECT = data
      })
  }

}
