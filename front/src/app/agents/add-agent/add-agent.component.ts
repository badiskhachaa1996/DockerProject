import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
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
  roles_list: { role: string, module: string, _id: string }[] = []

  dropdownModule = [
    { value: "Admission", label: "Admission" },
    { value: "Partenaire", label: "Partenaire" },
    { value: "Ticketing", label: "Ticketing" },
    { value: "CRM", label: "CRM" },
    { value: "Mailing", label: "Mailing" },
    { value: "Commerciale", label: "Commerciale" },
    { value: "International", label: "International" },
    { value: "Pedagogie", label: "Pedagogie" },
  ]
  dropdownRole = [
    { value: "Agent", label: "Agent" },
    { value: "Spectateur", label: "Spectateur" },
    { value: "Admin", label: "Admin" },
    { value: "Super-Admin", label: "Super-Admin" },
  ]

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

  ]

  addForm = new FormGroup({
    civilite: new FormControl(''),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    rue_adresse: new FormControl(''),
    postal_adresse: new FormControl(''),
    ville_adresse: new FormControl(''),
    pays_adresse: new FormControl(''),
    indicatif: new FormControl(''),
    phone: new FormControl(''),
    mention: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
  })

  onAdd() {
    this.UserService.create({ ...this.addForm.value, roles_list: this.roles_list, role: "Agent" }).subscribe(data => {
      this.ToastService.add({ summary: 'Création de l\'agent avec succès', severity: 'success' })
      this.addForm.reset()
      this.roles_list = []
    })
  }
  constructor(private UserService: AuthService, private ToastService: MessageService, private ServiceS: ServService) { }
  addRole() {
    this.roles_list.push({ role: null, module: null, _id: new mongoose.Types.ObjectId().toString() })
  }

  deleteRole(ri) {
    this.roles_list.splice(ri, 1)
  }
  ngOnInit(): void {
    this.ServiceS.getAll().subscribe(services => {
      services.forEach(val => { this.serviceList.push({ label: val.label, value: val._id }) })
    })
  }

}
