import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import mongoose from 'mongoose';
import { MessageService } from 'primeng/api';
import { Service } from 'src/app/models/Service';
import { Sujet } from 'src/app/models/Sujet';
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
  memberDic = {}
  responsableDic = {}
  ngOnInit(): void {
    this.ServServ.getAll().subscribe(data => {
      this.services = data
    })
    this.SujetServ.getAll().subscribe(data => {
      data.forEach(element => {
        if (this.sujetDic[element.service_id])
          this.sujetDic[element.service_id] = this.sujetDic[element.service_id] + ", " + element.label
        else
          this.sujetDic[element.service_id] = element.label
      });
    })
    this.UserService.getAllAgent().subscribe(data => {
      data.forEach(user => {
        let dicRoles = {}
        if (user.roles_ticketing_list && user.roles_ticketing_list.length != 0) {

          user.roles_ticketing_list.forEach(roleTicket => {
            let buffer: any = roleTicket.module
            dicRoles[buffer] = roleTicket.role
          })
        }

        if (user.service_list) {
          user.service_list.forEach(service => {
            if (this.memberDic[service]) {
              this.memberDic[service] = this.memberDic[service] + ", " + user.firstname + " " + user.lastname.toUpperCase()
            }
            else {
              this.memberDic[service] = user.firstname + " " + user.lastname.toUpperCase()
            }
            if (dicRoles[service] && dicRoles[service] == 'Responsable') {
              if (this.responsableDic[service])
                this.responsableDic[service].push(user)
              else
                this.responsableDic[service] = [user]
            }
          })
        }
      })
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
  sujetList: Sujet[] = []
  onAddSujet() {
    this.SujetServ.addSujet({ ...this.SujetForm.value }).subscribe(data => {
      if (this.sujetDic[data.service_id])
        this.sujetDic[data.service_id] = this.sujetDic[data.service_id] + ", " + data.label
      else
        this.sujetDic[data.service_id] = data.label
      this.SujetForm.reset()
      this.sujetList.push(data)
      this.ToastService.add({ severity: 'success', summary: "Ajout du sujet avec succès" })
    })
  }
  addSujet: Service = null
  AddSujet(service: Service) {
    this.addSujet = service
    this.SujetServ.getAllByServiceID(service._id).subscribe(data => {
      this.sujetList = data
    })
    this.SujetForm.patchValue({ service_id: service._id })
  }

  removeSujet(sujet: Sujet, ri) {
    this.SujetServ.delete(sujet._id).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Le sujet a été supprimé du service avec succès" })
      this.sujetList.splice(ri, 1)
      this.SujetServ.getAll().subscribe(data => {
        data.forEach(element => {
          if (this.sujetDic[element.service_id])
            this.sujetDic[element.service_id] = this.sujetDic[element.service_id] + ", " + element.label
          else
            this.sujetDic[element.service_id] = element.label
        });
      })
    })
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
    if (agent.service_list)
      agent.service_list.push(this.addMemberOfService._id)
    else
      agent.service_list = [this.addMemberOfService._id]
    this.UserService.update({ _id: agent._id, service_list: agent.service_list }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Le membre a été ajouté au service avec succès" })
      this.memberList.push(data)
      this.memberDropdown.splice(this.customIndexOfDropdown(this.memberDropdown, agent), 1)
      this.addMember = null
      this.MemberForm.reset()
      if (this.memberDic[this.addMemberOfService._id])
        this.memberDic[this.addMemberOfService._id] = this.memberDic[this.addMemberOfService._id] + ", " + agent.firstname + " " + agent.lastname.toUpperCase()
      else
        this.memberDic[this.addMemberOfService._id] = agent.firstname + " " + agent.lastname.toUpperCase()
    })
  }
  addMemberOfService: Service = null
  memberList: User[] = []
  memberDropdown = []
  responsableList: User[] = []
  AddMember(service: Service) {
    this.addMemberOfService = service
    this.memberDropdown = []
    if (this.responsableDic[service._id])
      this.responsableList = this.responsableDic[service._id]
    else
      this.responsableList = []
    this.UserService.getAllByServiceFromList(service._id).subscribe(data => {
      this.memberList = data
      this.UserService.getAllAgent().subscribe(dataAgent => {
        dataAgent.forEach(agent => {
          if (!this.customIncludes(data, agent)) {
            this.memberDropdown.push({ label: `${agent.lastname} ${agent.firstname}`, value: agent })
          }
        })
      })
    })
  }
  customIncludes(listUser: User[], agent: User) {
    let r = false
    listUser.forEach(val => {
      if (val._id.toString() == agent._id.toString())
        r = true
    })
    return r
  }
  customIndexOf(listUser: User[], agent: User) {
    let r = -1
    listUser.forEach((val, idx) => {
      if (val._id.toString() == agent._id.toString())
        r = idx
    })
    return r
  }
  customIndexOfDropdown(listUser: { value: User, label: string }[], agent: User) {
    let r = -1
    listUser.forEach((val, idx) => {
      if (val.value._id.toString() == agent._id.toString())
        r = idx
    })
    return r
  }
  removeMember(user: User, ri) {
    user.service_list.splice(user.service_list.indexOf(this.addMemberOfService._id), 1)
    this.UserService.update({ _id: user._id, service_list: user.service_list }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Le membre a été supprimé du service avec succès" })
      this.memberList.splice(ri, 1)
      this.memberDropdown.push(this.memberDropdown.indexOf({ label: `${data.lastname} ${data.firstname}`, value: data }))
      this.UserService.getAllAgent().subscribe(data => {
        this.memberDic = {}
        data.forEach(user => {
          let dicRoles = {}
          if (user.roles_ticketing_list) {
            user.roles_ticketing_list.forEach(roleTicket => {
              dicRoles[roleTicket.module._id] = roleTicket.role
            })
          }
          if (user.service_list)
            user.service_list.forEach(service => {
              if (this.memberDic[service]) this.memberDic[service] = this.memberDic[service] + ", " + user.firstname + " " + user.lastname.toUpperCase()
              else this.memberDic[service] = user.firstname + " " + user.lastname.toUpperCase()
              if (dicRoles[service] && dicRoles[service] == 'Responsable') {
                if (this.responsableDic[service])
                  this.responsableDic[service].push(user)
                else
                  this.responsableDic[service] = [user]
              }
            })

        })
      })
    })
  }

  displayRolesTicketing = false
  seeRole: User = null
  onSeeRole(user: User) {
    this.seeRole = user
    this.displayRolesTicketing = true
    this.ServServ.getAll().subscribe(services => {
      this.moduleList = []
      services.forEach((s: Service) => {
        this.moduleList.push({ label: s.label, value: s })
      })
    })
  }
  roleList = [{ value: 'Agent', label: 'Agent' }, { value: 'Responsable', label: 'Responsable' }]
  moduleList = []

  initAddModule() {
    this.seeRole.roles_ticketing_list.push({ _id: new mongoose.Types.ObjectId().toString(), module: null, role: "Agent" })
  }

  saveModule() {
    let approved = true
    this.seeRole.roles_ticketing_list.forEach(val => {
      if (val.module == null)
        approved = false
    })
    if (approved) {
      this.UserService.update({ _id: this.seeRole._id, roles_ticketing_list: this.seeRole.roles_ticketing_list }).subscribe(r => {
        this.ToastService.add({ severity: 'success', summary: "Mis à jour des roles de Ticketing avec succès" })
      })
    } else {
      alert('Un module n\'est pas selectionné')
    }
  }

  deleteModule(module, idx) {
    this.seeRole.roles_ticketing_list.splice(idx, 1)
  }

  addMember;
  MemberForm: FormGroup = new FormGroup(
    { member: new FormControl('', Validators.required) }
  )
  onAddMb() {
    this.onAddMember(this.MemberForm.value.member)
  }

  initAddMember() {
    this.addMember = true
  }
  convertRole(user: User, service: Service, role: string = 'Agent') {
    if (role != 'Responsable') {
      this.responsableList.splice(this.customIndexOf(this.responsableList, user), 1)
      this.responsableDic[service._id].splice(this.customIndexOf(this.responsableDic[service._id], user), 1)
      user.roles_ticketing_list.forEach((roleTicket, idx) => {
        if (roleTicket.module._id == service._id) {
          user.roles_ticketing_list[idx].role = 'Agent'
        }
      })
    }
    else {
      this.responsableList.push(user)
      this.responsableDic[service._id].push(user)
      user.roles_ticketing_list.forEach((roleTicket, idx) => {
        if (roleTicket.module._id == service._id) {
          user.roles_ticketing_list[idx].role = 'Responsable'
        }
      })
    }
    console.log(user.roles_ticketing_list)
    this.UserService.update({ _id: user._id, roles_ticketing_list: user.roles_ticketing_list }).subscribe(r => {
      this.ToastService.add({ severity: 'success', summary: "Mis à jour des roles de Ticketing avec succès" })
    })

  }
}
