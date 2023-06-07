import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Service } from 'src/app/models/Service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { SujetService } from 'src/app/services/sujet.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  constructor(private ServServ: ServService, private ToastService: MessageService, private SujetServ: SujetService, private UserService: AuthService) { }
  services: Service[] = []
  sujetDic = {}
  ngOnInit(): void {
    this.ServServ.getAll().subscribe(data => {
      this.services = data
    })
    this.SujetServ.getAll().subscribe(data => {
      data.forEach(element => {
        if (this.sujetDic[element.service_id])
          this.sujetDic[element.service_id] = this.sujetDic[element.service_id] + "\n" + element.label
        else
          this.sujetDic[element.service_id] = element.label
      });
    })
  }
  //Ajout Service
  ServiceForm = new FormGroup({
    label: new FormControl('', Validators.required)
  })
  onAdd() {
    this.ServServ.addService({ ...this.ServiceForm.value, active: true }).subscribe(data => {
      this.services.push(data)
      this.ServiceForm.reset()
      this.addService = false
      this.ToastService.add({ severity: 'success', summary: "Ajout du service avec succès" })
    })
  }
  addService = false
  initAddService() {
    this.addService = true
  }
  //Ajout Sujet
  SujetForm = new FormGroup({
    label: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required)
  })
  onAddSujet() {
    this.SujetServ.addSujet({ ...this.SujetForm.value }).subscribe(data => {
      if (this.sujetDic[data.service_id])
        this.sujetDic[data.service_id] = this.sujetDic[data.service_id] + "\n" + data.label
      else
        this.sujetDic[data.service_id] = data.label
      this.SujetForm.reset()
      this.addSujet = null
      this.ToastService.add({ severity: 'success', summary: "Ajout du sujet avec succès" })
    })
  }
  addSujet: Service = null
  AddSujet(service: Service) {
    this.addSujet = service
    this.SujetForm.patchValue({ service_id: service._id })
  }
  //
  deleteService(service: Service, ri: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer " + service.label + " ?"))
      this.ServServ.delete(service._id).subscribe(s => {
        this.services.splice(ri, 1)
        this.ToastService.add({ severity: 'success', summary: "Le service a été supprimé avec succès" })
      })
  }
  //Ajout des membres
  onAddMember(agent: User) {
    agent.service_list.push(this.addmember._id)
    this.UserService.update({ ...agent }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Le membre a été ajouté au service avec succès" })
      this.memberList.push(data)
      this.memberDropdown.splice(this.memberDropdown.indexOf({ label: `${agent.lastname} ${agent.firstname}`, value: agent }), 1)
    })
  }
  addmember: Service = null
  memberList: User[] = []
  memberDropdown = []
  AddMember(service: Service) {
    this.addmember = service
    this.UserService.getAllByServiceFromList(service._id).subscribe(data => {
      this.memberList = data
      this.UserService.getAllAgent().subscribe(dataAgent => {
        dataAgent.forEach(agent => {
          if (!data.includes(agent)) {
            this.memberDropdown.push({ label: `${agent.lastname} ${agent.firstname}`, value: agent })
          }
        })
      })
    })

  }
  removeMember(user: User, ri) {
    user.service_list.splice(user.service_list.indexOf(this.addmember._id), 1)
    this.UserService.update({ ...user }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Le membre a été supprimé du service avec succès" })
      this.memberList.splice(ri, 1)
      this.memberDropdown.push(this.memberDropdown.indexOf({ label: `${data.lastname} ${data.firstname}`, value: data }), 1)
    })
  }
}
