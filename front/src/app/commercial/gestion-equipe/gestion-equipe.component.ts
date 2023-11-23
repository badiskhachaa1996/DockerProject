import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TeamCommercialService } from 'src/app/services/team-commercial.service';
import { teamCommercial } from 'src/app/models/teamCommercial';
import { Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-equipe',
  templateUrl: './gestion-equipe.component.html',
  styleUrls: ['./gestion-equipe.component.scss']
})
export class GestionEquipeComponent implements OnInit {
  team: teamCommercial[] = []
  commercialAvailable: any[] = [];
  defaultCommercial: any[];
  responsable: any[] = [];
  showFormAddEquipe: Boolean = false
  showFormUpdate: teamCommercial = null
  token: any;
  formAddEquipe: UntypedFormGroup = this.formBuilder.group({
    owner_id: ['', [Validators.required]],
    team_id: ['', [Validators.required]]
  })

  formUpdateEquipe: UntypedFormGroup = this.formBuilder.group({
    team_id: ['', [Validators.required]]
  })

  constructor(private router: Router, private messageService: MessageService, private formBuilder: UntypedFormBuilder, private UserService: AuthService, 
    private TeamCommercialService: TeamCommercialService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getAllCommercialV2().subscribe(u => {
      u.forEach(user => {
        if (user.role == "Responsable")
          this.responsable.push({ label: user.lastname + " " + user.firstname, value: user._id })
        else if (user.role == "Agent")
          this.commercialAvailable.push({ label: user.lastname + " " + user.firstname, value: user._id })
      })
      this.TeamCommercialService.getAll().subscribe(teams => {
        this.team = teams
        teams.forEach(t => {
          if (this.customIncludes(this.responsable, t.owner_id._id) != -1)
            this.responsable.splice(this.customIncludes(this.responsable, t.owner_id._id), 1)
          t.team_id.forEach(u => {
            if (this.customIncludes(this.commercialAvailable, u._id) != -1)
              this.commercialAvailable.splice(this.customIncludes(this.commercialAvailable, u._id), 1)
          })
        })
        this.defaultCommercial = this.commercialAvailable
      })
    })
  }

  customIncludes(arr, id: string) {
    let r = -1
    arr.forEach((ele, index) => {
      if (id == ele.value) {
        r = index
      }
    })
    return r
  }
  onAddTeam() {
    this.TeamCommercialService.create(new teamCommercial(
      null, this.token['id'], this.formAddEquipe.value.owner_id, this.formAddEquipe.value.team_id
    )).subscribe(team => {
      this.messageService.add({ severity: "success", summary: "Création d'une équipe", detail: "Création de l'équipe avec succès" })
      this.team.push(team)
      this.showFormAddEquipe = false
    }, err => {
      console.error(err)
      this.messageService.add({ severity: "error", summary: "Erreur lors de la création d'une équipe", detail: err.error })
    })
  }
  onUpdateTeam() {
    this.showFormUpdate.team_id = this.formUpdateEquipe.value.team_id
    this.TeamCommercialService.updateTeam(this.showFormUpdate).subscribe(team => {
      this.messageService.add({ severity: "success", summary: "Modification d'une équipe", detail: "Modification de l'équipe avec succès" })
      this.team.splice(this.customIncludes(this.team, team._id), 1, team)
      team.team_id.forEach(u => {
        if (this.customIncludes(this.defaultCommercial, u._id) != -1)
          this.defaultCommercial.splice(this.customIncludes(this.defaultCommercial, u._id), 1)
      })
      this.commercialAvailable = this.defaultCommercial
      this.showFormUpdate = null
    }, err => {
      console.error(err)
      this.messageService.add({ severity: "error", summary: "Erreur lors de la création d'une équipe", detail: err.error })
    })
  }
  showUpdate(rowData: teamCommercial) {
    let listeID = []
    rowData.team_id.forEach(u => {
      listeID.push(u._id)
      this.commercialAvailable.push({ label: u.lastname + " " + u.firstname, value: u._id })
    })
    this.formUpdateEquipe.setValue({ team_id: listeID })
    this.showFormUpdate = rowData
    this.showFormAddEquipe = false
  }

  seeConseilled(rowData: teamCommercial) {
    this.router.navigate(["/detail-equipe-commercial", rowData._id])
  }

  seeDemandes(rowData: teamCommercial) {
    this.router.navigate(["/liste-demande-commercial", rowData._id])
  }


}
