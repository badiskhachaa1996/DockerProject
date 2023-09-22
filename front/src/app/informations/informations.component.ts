import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {
  selectedTabIndex: number = 0;
  ecoles: EcoleAdmission[] = [];
  formations: FormationAdmission[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
