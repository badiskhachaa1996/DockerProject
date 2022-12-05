import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Avancement } from 'src/app/models/Avancement';

@Component({
  selector: 'app-info-ims',
  templateUrl: './info-ims.component.html',
  styleUrls: ['./info-ims.component.scss']
})
export class InfoImsComponent implements OnInit {

  avancements: Avancement[];
  avancementToUpdate: Avancement;

  showFormAdd: boolean;
  formAdd: FormGroup;

  showFormUpdate: boolean;
  formUpdate: FormGroup;

  moduleList: any[] = [
    { label: 'Ticketing' },
    { label: 'Pédagogie' },
    { label: 'Administration' },
    { label: 'Admission' },
    { label: 'Alternance' },
    { label: 'Partenaires' },
    { label: 'Commercial' },
    { label: 'Support' },
    { label: 'Booking' },
    { label: 'SkillsNet' },
    { label: 'RH' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
