import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-lead-programme',
  templateUrl: './lead-programme.component.html',
  styleUrls: ['./lead-programme.component.scss']
})
export class LeadProgrammeComponent implements OnInit {
  @Input() ID
  ID2 = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService) { }
  ngOnInit(): void {
    if (!this.ID2 && this.ID)
      this.ID2 = this.ID
    if (this.ID2)
      this.ProspectService.getPopulate(this.ID2).subscribe(data => {
        if (data)
          this.PROSPECT = data
      })
  }

}
