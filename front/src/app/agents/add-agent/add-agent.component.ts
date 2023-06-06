import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {
  civiliteDropdown = [
    { value: 'Monsieur' },
    { value: 'Madame' },
    { value: 'Autre' },
  ]
  paysDropdown = environment.pays
  roles_list: { role: string, module: string }[] = []


  mentionList = [
    { value: 'IGM - Inted Group Marketing', label: 'IGM - Inted Group Marketing' },
    { value: 'IGN - Inted Group Partenaires', label: 'IGN - Inted Group Partenaires' },
    { value: 'IGW - Inted Group Commercial', label: 'IGW - Inted Group Commercial' },
    { value: 'IGE - Inted Group Admission', label: 'IGE - Inted Group Admission' },
    { value: 'IGI - Inted Group Administration', label: 'IGI - Inted Group Administration' },
    { value: 'IGP - Inted Group Pédagogie', label: 'IGP - Inted Group Pédagogie' },
    { value: 'IGA - Inted Group Facturation', label: 'IGA - Inted Group Facturation' },
    { value: 'IGL - Inted Group Juridique', label: 'IGL - Inted Group Juridique' },
    { value: 'IGQ - Inted Group Qualité', label: 'IGQ - Inted Group Qualité' },
    { value: 'IGA - Inted Group Comptabilité', label: 'IGA - Inted Group Comptabilité' },
    { value: 'IGS - Inted Group Support', label: 'IGS - Inted Group Support' },
    { value: 'IGH - Inted Group RH', label: 'IGH - Inted Group RH' },
    { value: 'IGD - Inted Group Direction', label: 'IGD - Inted Group Direction' },
    { value: 'GWO IGWIN - INTED GROUP', label: 'GWO IGWIN - INTED GROUP' },
  ];

  serviceList = [
    { value: "Admission", label: "Admission" }
  ]

  addForm = new FormGroup({

  })
  onAdd(){
    
  }
  constructor() { }
  addRole() {
    this.roles_list.push({ role: null, module: null })
  }

  deleteRole(ri) {
    this.roles_list.splice(ri, 1)
  }
  ngOnInit(): void {
  }

}
