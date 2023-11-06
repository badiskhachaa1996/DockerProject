import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MemberInt } from 'src/app/models/memberInt';
import { TeamsRH } from 'src/app/models/TeamsRH';
import { AuthService } from 'src/app/services/auth.service';
import { TeamsIntService } from 'src/app/services/teams-int.service';
import jwt_decode from "jwt-decode";
import { TeamsRHService } from 'src/app/services/teams-rh.service';
import { RhService } from 'src/app/services/rh.service';
import { MicrosoftService } from 'src/app/services/microsoft.service';
import { MemberRH } from 'src/app/models/memberRH';
@Component({
  selector: 'app-gestion-equipe-rh',
  templateUrl: './gestion-equipe-rh.component.html',
  styleUrls: ['./gestion-equipe-rh.component.scss']
})
export class GestionEquipeRhComponent implements OnInit {
  teams: TeamsRH[] = []
  selectedTeam: TeamsRH
  userList = []
  membersDic = {}
  AllmembersDic = {}
  responsableDic = {}
  constructor(private TeamsRHService: TeamsRHService, private MessageService: MessageService, private UserService: AuthService,
    private CollaborateurService: RhService, private MicrosoftService: MicrosoftService) { }
  token;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.TeamsRHService.TRgetAll().subscribe(data => {
      this.teams = data
      data.forEach(t => {
        this.AllmembersDic[t._id] = []
      })
    })
    this.CollaborateurService.getCollaborateurs().then(users => {
      users.forEach(u => {
        if (u.user_id)
          this.userList.push({ label: `${u.user_id.firstname} ${u.user_id.lastname}`, value: u.user_id._id })
      })
    })
    this.refreshMember()
    //this.MicrosoftService.sendNotif()
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required)
  })

  initUpdate(etudiant) {
    this.selectedTeam = etudiant
    this.updateForm.patchValue({ ...etudiant })
  }

  onUpdate() {
    this.TeamsRHService.TRupdate({ ...this.updateForm.value }).subscribe(data => {
      this.teams.splice(this.teams.indexOf(this.selectedTeam), 1, data)
      this.selectedTeam = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de l'équipe ${data.nom} avec succès` })
    })
  }

  createForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required)
  })

  newTeam = false

  initCreate() {
    this.newTeam = true
  }

  onCreate() {
    console.log({ ...this.createForm.value })
    this.TeamsRHService.TRcreate({ ...this.createForm.value }).subscribe(data => {
      this.teams.push(data)
      this.newTeam = null
      this.createForm.reset()
      this.MessageService.add({ severity: "success", summary: `Ajout d'une nouvelle équipe avec succès` })
    })
  }

  delete(team: TeamsRH) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette équipe ainsi que les membres de l'équipe ?"))
      this.TeamsRHService.TRdelete(team._id).subscribe(data => {
        this.teams.splice(this.teams.indexOf(team), 1)
        this.MessageService.add({ severity: "success", summary: `Suppression de l'équipe et des membres avec succès` })
      })
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  deleteMB(member: MemberRH) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?"))
      this.TeamsRHService.MRdelete(member._id).subscribe(data => {
        this.refreshMember()
        this.MessageService.add({ severity: "success", summary: `Suppression de ce membre avec succès` })
      })
  }

  refreshMember() {
    this.responsableDic = {}
    this.membersDic = {}
    this.teams.forEach(t => {
      this.AllmembersDic[t._id] = []
    })
    this.TeamsRHService.MRgetAll().subscribe(mr => {
      mr.forEach(val => {
        if (val.user_id && val.team_id) {
          if (this.AllmembersDic[val.team_id._id])
            this.AllmembersDic[val.team_id._id].push(val)
          else
            this.AllmembersDic[val.team_id._id] = [val]

          if (val.role == 'Responsable')
            if (this.responsableDic[val.team_id._id])
              this.responsableDic[val.team_id._id].push(val)
            else
              this.responsableDic[val.team_id._id] = [val]
          else
            if (this.membersDic[val.team_id._id])
              this.membersDic[val.team_id._id].push(val)
            else
              this.membersDic[val.team_id._id] = [val]
        }

      })
      console.log(this.membersDic)
    })
  }

  convertMB(member: MemberRH) {
    if (member.role == 'Responsable')
      member.role = 'Membre'
    else
      member.role = 'Responsable'
    this.TeamsRHService.MRupdate({ _id: member._id, role: member.role }).subscribe(r => {
      this.refreshMember()
    })
  }
  newMember: TeamsRH;
  AddMbForm = new FormGroup({
    user_id: new FormControl('', Validators.required),
    role: new FormControl('Membre', Validators.required),
  })
  AddMember(team: TeamsRH) {
    this.newMember = team
  }
  roleList = [
    { label: 'Membre', value: 'Membre' },
    { label: 'Responsable', value: 'Responsable' }
  ]
  onAddMember() {
    this.TeamsRHService.MRcreate({ ...this.AddMbForm.value, team_id: this.newMember._id }).subscribe(r => {
      this.refreshMember()
    })
  }

}
