import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { RhService } from 'src/app/services/rh.service';
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
  typeList = [
    { label: 'Non défini', value: null },
    { label: 'Collaborateur', value: 'Collaborateur' },
    { label: 'Responsable', value: 'Responsable' },
    { label: 'Formateur', value: 'Formateur' },
  ]
  typeList2 = [
    { label: 'Non défini', value: null },
    { label: 'Collaborateur', value: 'Collaborateur' },
    { label: 'Responsable', value: 'Responsable' },
    { label: 'Externe-InProgress', value: 'Externe-InProgress' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
  ]
  roleList = [
    { label: 'User', value: 'user' },
    { label: 'Etudiant', value: 'Etudiant' },
    { label: 'Admin', value: 'Admin' },
  ]
  dropdownModule = [
    { value: "Admission", label: "Admission" },
    { value: "Partenaire", label: "Partenaire" },
    { value: "Ticketing", label: "Ticketing" },
    { value: "CRM", label: "CRM" },
    { value: "Mailing", label: "Mailing" },
    { value: "Commerciale", label: "Commerciale" },
    { value: "International", label: "International" },
    { value: "Pedagogie", label: "Pedagogie" },
    { value: "iMatch", label: "iMatch" },
    { value: "Générateur de Document", label: "Générateur de Document" },
    { value: "Ressources Humaines", label: "Ressources Humaines" },
    { value: "Admin IMS", label: "Admin IMS" },
    { value: "Administration", label: "Administration" },
    { value: "Booking", label: "Booking" },
    { value: "Questionnaire", label: "Questionnaire" },
    { value: "Intuns", label: "Intuns" },
    { value: "Gestions des emails", label: "Gestions des emails" },
    { value: "Links", label: "Links" },
    { value: "Remboursement", label: "Remboursement" }
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

  addForm = new UntypedFormGroup({
    civilite: new UntypedFormControl(''),
    lastname: new UntypedFormControl('', Validators.required),
    firstname: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    rue_adresse: new UntypedFormControl(''),
    postal_adresse: new UntypedFormControl(''),
    ville_adresse: new UntypedFormControl(''),
    pays_adresse: new UntypedFormControl(''),
    indicatif: new UntypedFormControl(''),
    phone: new UntypedFormControl(''),
    mention: new UntypedFormControl('', Validators.required),
    service_id: new UntypedFormControl(''),
    role: new UntypedFormControl('user', Validators.required),
    type: new UntypedFormControl(null),
    _id: new UntypedFormControl('', Validators.required),
    type_supp: new UntypedFormControl([])
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
    this.UserService.update({ ...this.addForm.value, roles_list: this.roles_list, haveNewAccess: true }).subscribe(data => {
      this.ToastService.add({ summary: 'Mise à jour de l\'agent avec succès', severity: 'success' })
      if (this.addForm.value.type == 'Collaborateur' && this.USER.type != 'Collaborateur' || this.addForm.value.type_supp.includes('Collaborateur') && !this.USER.type_supp.includes('Collaborateur') || this.addForm.value.type == 'Formateur' && this.USER.type != 'Formateur')
        this.CollaborateurService.getCollaborateurByUserId(this.USER._id).then(c => {
          if (!c)
            this.CollaborateurService.postCollaborateur({ user_id: this.USER, localisation: this.SITE }).then(c => {
              this.router.navigate(['/agent/list'])
            })
          else
            this.router.navigate(['/agent/list'])
        })
      else
        this.CollaborateurService.getCollaborateurByUserId(this.USER._id).then(c => {
          if (c)
            this.CollaborateurService.patchCollaborateurData({ _id: c._id, user_id: this.USER, localisation: this.SITE }).then(c => {
              this.router.navigate(['/agent/list'])
            })
          else
            this.router.navigate(['/agent/list'])
        })


    })
  }
  constructor(private UserService: AuthService, private ToastService: MessageService,
    private ServiceS: ServService, private route: ActivatedRoute, private router: Router,
    private CollaborateurService: RhService) { }
  addRole() {
    this.roles_list.push({ role: null, module: null, _id: new mongoose.Types.ObjectId().toString() })
  }

  deleteRole(ri) {
    this.roles_list.splice(ri, 1)
  }
  USER: User
  ngOnInit(): void {
    this.ServiceS.getAll().subscribe(services => {
      services.forEach(val => { this.serviceList.push({ label: val.label, value: val._id }) })
      this.UserService.getPopulate(this.ID).subscribe(data => {
        this.USER = data

        if (this.USER?.role == 'Admin')
          this.dropdownModule.splice(11, 1) //Supprimer Admin-IMS
        if (this.USER?.type == 'Responsable')
          this.dropdownModule.splice(10, 1) //Supprimer RH
        
        let { service_id }: any = data
        this.addForm.patchValue({ ...data, service_id: service_id?._id })
        this.onSelectRole()
        this.roles_list = data.roles_list
        this.CollaborateurService.getCollaborateurByUserId(this.ID).then(val => {
          if (val) {
            if (!data.haveNewAccess)
              this.addForm.patchValue({ type: 'Collaborateur' })
            this.SITE = val.localisation
          }
        })
      })
    })


  }
  onSelectRole() {
    if (this.addForm.value.role == 'user' || this.addForm.value.role == 'Admin') {
      this.typeList = [
        { label: 'Non défini', value: null },
        { label: 'Collaborateur', value: 'Collaborateur' },
        { label: 'Responsable', value: 'Responsable' },
        { label: 'Formateur', value: 'Formateur' },
      ]
    } else {
      this.typeList = [
        { label: 'Externe-InProgress', value: 'Externe-InProgress' },
        { label: 'Initial', value: 'Initial' },
        { label: 'Alternant', value: 'Alternant' },
      ]
    }
  }

}
