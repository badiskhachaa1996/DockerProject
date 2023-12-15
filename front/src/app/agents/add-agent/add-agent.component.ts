import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { RhService } from 'src/app/services/rh.service';
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

  dropdownModule = environment.ModuleAccessList
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

  addForm = new UntypedFormGroup({
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
    type: new FormControl(null),
    role: new FormControl('user'),
    haveNewAccess: new FormControl(false, Validators.required)
  })
  localisationList: any[] = [
    { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ];
  SITE = []
  onAdd() {
    this.UserService.create({ ...this.addForm.value, roles_list: this.roles_list }).subscribe(data => {
      this.ToastService.add({ summary: 'Création de l\'agent avec succès', severity: 'success' })
      this.roles_list = []
      if (this.addForm.value.type == 'Collaborateur' || this.addForm.value.type == 'Formateur')
        this.CollaborateurService.postCollaborateur({ user_id: data, localisation: this.SITE }).then(c => {
        })
      this.addForm.reset()
    })
  }
  constructor(private UserService: AuthService, private ToastService: MessageService, private ServiceS: ServService, private CollaborateurService: RhService) { }
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

  typeList = [
    { label: 'Non défini', value: null },
    { label: 'Collaborateur', value: 'Collaborateur' },
    { label: 'Responsable', value: 'Responsable' },
  ]
  roleList = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'Admin' },
  ]

}
