import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-agent',
  templateUrl: './update-agent.component.html',
  styleUrls: ['./update-agent.component.scss']
})
export class UpdateAgentComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  civiliteDropdown = [
    { value: 'Monsieur' },
    { value: 'Madame' },
    { value: 'Autre' },
  ]
  paysDropdown = environment.pays
  roles_list: { role?: string, module?: string, _id?: string }[] = []

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
    _id: new FormControl('', Validators.required)
  })

  onAdd() {
    console.log({ ...this.addForm.value, roles_list: this.roles_list })
    this.UserService.update({ ...this.addForm.value, roles_list: this.roles_list }).subscribe(data => {
      this.ToastService.add({ summary: 'Mise à jour de l\'agent avec succès', severity: 'success' })
      this.router.navigate(['/agent/list'])
    })
  }
  constructor(private UserService: AuthService, private ToastService: MessageService, private ServiceS: ServService, private route: ActivatedRoute, private router: Router) { }
  addRole() {
    this.roles_list.push({ role: null, module: null, _id: new mongoose.Types.ObjectId().toString() })
  }

  deleteRole(ri) {
    this.roles_list.splice(ri, 1)
  }
  ngOnInit(): void {
    this.ServiceS.getAll().subscribe(services => {
      services.forEach(val => { this.serviceList.push({ label: val.label, value: val._id }) })
      this.UserService.getPopulate(this.ID).subscribe(data => {
        let { service_id }: any = data
        this.addForm.patchValue({ ...data, service_id: service_id._id })
        this.roles_list = data.roles_list
      })
    })

  }


}
