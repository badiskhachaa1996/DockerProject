import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MemberInt } from 'src/app/models/memberInt';
import { TeamsInt } from 'src/app/models/TeamsInt';
import { AuthService } from 'src/app/services/auth.service';
import { TeamsIntService } from 'src/app/services/teams-int.service';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-teams-int',
  templateUrl: './teams-int.component.html',
  styleUrls: ['./teams-int.component.scss']
})
export class TeamsIntComponent implements OnInit {
  teams: TeamsInt[] = []
  selectedTeam: TeamsInt
  constructor(private TeamsIntService: TeamsIntService, private MessageService: MessageService, private UserService: AuthService) { }
  AccessLevel = "Spectateur"
  token;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.TeamsIntService.TIgetAll().subscribe(data => {
      this.teams = data
    })
    this.UserService.getPopulate(this.token.id).subscribe(data => {
      if (data.roles_list)
        data.roles_list.forEach(role => {
          if (role.module == "International")
            this.AccessLevel = role.role
        })
      if (data.role == "Admin")
        this.AccessLevel = "Super-Admin"
    })
  }

  updateForm: UntypedFormGroup = new UntypedFormGroup({
    _id: new UntypedFormControl('', Validators.required),
    nom: new UntypedFormControl('', Validators.required),
    description: new UntypedFormControl('')
  })

  initUpdate(etudiant) {
    this.selectedTeam = etudiant
    this.updateForm.patchValue({ ...etudiant })
  }

  onUpdate() {
    this.TeamsIntService.TIupdate({ ...this.updateForm.value }).subscribe(data => {
      this.teams.splice(this.teams.indexOf(this.selectedTeam), 1, data)
      this.selectedTeam = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de l'équipe ${data.nom} avec succès` })
    })
  }

  createForm: UntypedFormGroup = new UntypedFormGroup({
    nom: new UntypedFormControl('', Validators.required),
    description: new UntypedFormControl(''),
    date_creation: new UntypedFormControl(new Date(), Validators.required)
  })

  newTeam = false

  initCreate() {
    this.newTeam = true
  }

  onCreate() {
    this.TeamsIntService.TIcreate({ ...this.createForm.value, custom_id: this.generateID({ ...this.createForm.value }) }).subscribe(data => {
      this.teams.push(data)
      this.newTeam = null
      this.createForm.reset()
      this.MessageService.add({ severity: "success", summary: `Ajout d'une nouvelle équipe avec succès` })
    })
  }

  delete(team: TeamsInt) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette équipe ainsi que les membres de l'équipe ?"))
      this.TeamsIntService.TIdelete(team._id).subscribe(data => {
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

  generateID(team: TeamsInt) {
    let ID = team.nom.substring(0, 2).toUpperCase() + this.pad(Math.floor(Math.random() * (999998)).toString())
    return ID
  }

  pad(number: string) {
    while (number.length < 6)
      number = `0${number}`
    return number
  }


}
