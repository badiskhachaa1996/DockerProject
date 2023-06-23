import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-version-non-iframe',
  templateUrl: './version-non-iframe.component.html',
  styleUrls: ['./version-non-iframe.component.scss']
})
export class VersionNonIframeComponent implements OnInit {

  form_origin: string = this.route.snapshot.paramMap.get('ecole');
  constructor(private route: ActivatedRoute, private FAService: FormulaireAdmissionService, private router: Router) { }
  ECOLE: EcoleAdmission
  ngOnInit(): void {
    this.FAService.EAgetByParams(this.form_origin).subscribe(data => {
      if (!data)
        this.router.navigate(['/'])
      this.ECOLE = data
    })
  }

}
