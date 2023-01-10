import { Component, OnInit } from '@angular/core';
import { ProspectIntuns } from 'src/app/models/ProspectIntuns';
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-prospects-intuns',
  templateUrl: './prospects-intuns.component.html',
  styleUrls: ['./prospects-intuns.component.scss']
})
export class ProspectsIntunsComponent implements OnInit {
  prospectsIntuns: ProspectIntuns[];
  constructor(private admissionService: AdmissionService) { }

  ngOnInit(): void {
    this.admissionService.getAllProspectsIntuns().subscribe(tempIntuns => {
      this.prospectsIntuns = tempIntuns
    })
  }

}
