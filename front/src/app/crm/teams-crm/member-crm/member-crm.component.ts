import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MemberCRM } from 'src/app/models/memberCRM';
import { AuthService } from 'src/app/services/auth.service';
import { TeamsCrmService } from 'src/app/services/crm/teams-crm.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-member-crm',
  templateUrl: './member-crm.component.html',
  styleUrls: ['./member-crm.component.scss']
})
export class MemberCrmComponent implements OnInit {


  members: MemberCRM[] = []
  selectedMember: MemberCRM
  teamsList = []
  localisationList = [
    { label: "Montpellier", value: "Montpellier" },
    { label: "Paris - Champs sur Marne", value: "Paris - Champs sur Marne" },
    { label: "Paris - Louvre", value: "Paris - Louvre" },
    { label: "Maroc", value: "Maroc" },
    { label: "Tunis", value: "Tunis" },
    { label: "A distance", value: "A distance" },
    { label: "Congo", value: "Congo" },
    { label: "Dubai", value: "Dubai" },
    { label: "Malte", value: "Malte" },
  ]
  roleList = [
    { label: "Super Admin", value: "Super Admin" },
    { label: "Admin", value: "Admin" },
    { label: "Agent Orientation", value: "Agent Orientation" },
    { label: "Agent Admission", value: "Agent Admission" },
  ]
  userList = []
  constructor(private TeamsIntService: TeamsCrmService, private MessageService: MessageService, private UserService: AuthService) { }

  ngOnInit(): void {
    this.TeamsIntService.MIgetAll().subscribe(data => {
      this.members = data
    })
    this.TeamsIntService.TIgetAll().subscribe(data => {
      data.forEach(f => {
        this.teamsList.push({ label: f.nom, value: f._id })
      })
    })
    this.UserService.getAll().subscribe(users => {
      //Imagine tu dois charger toute la DB .........
      users.forEach(user => {
        if (user && user.type==="Collaborateur")
          this.userList.push({ label: `${user.firstname} ${user.lastname} | ${user.type}`, value: user._id })
      })
    })
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    team_id: new FormControl('', Validators.required),
    localisation: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    numero_whatapp: new FormControl('', Validators.required)
  })

  initUpdate(etudiant: MemberCRM) {
    this.selectedMember = etudiant
    this.updateForm.patchValue({ ...etudiant, team_id: etudiant.team_id._id })
  }

  onUpdate() {
    this.TeamsIntService.MIupdate({ ...this.updateForm.value }).subscribe(data => {
      this.members.splice(this.members.indexOf(this.selectedMember), 1, data)
      this.selectedMember = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour du membre ${data.user_id.lastname} ${data.user_id.firstname} avec succès` })
    })
  }

  createForm: FormGroup = new FormGroup({
    user_id: new FormControl('', Validators.required),
    team_id: new FormControl('', Validators.required),
    localisation: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    numero_whatapp: new FormControl('', Validators.required),
    date_creation: new FormControl(new Date(), Validators.required),
    custom_id: new FormControl("00X00", Validators.required)
  })

  newMember = false

  initCreate() {
    this.newMember = true
  }

  onCreate() {
    this.generateID()
    this.TeamsIntService.MIcreate({ ...this.createForm.value }).subscribe(data => {
      this.members.push(data)
      this.newMember = null
      this.createForm.reset()
      this.MessageService.add({ severity: "success", summary: `Ajout d'un nouveau membre avec succès` })
    })
  }

  delete(member: MemberCRM) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?"))
      this.TeamsIntService.MIdelete(member.user_id._id).subscribe(data => {
        this.members.splice(this.members.indexOf(member), 1)
        this.MessageService.add({ severity: "success", summary: `Suppression du membre avec succès` })
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

  generateID() {
    this.userList.forEach(element => {
      if (element.value == this.createForm.value.user_id) {
        this.teamsList.forEach(elementTeam => {
          if (elementTeam.value == this.createForm.value.team_id) {
            let ID = elementTeam.label.substring(0, 2)
            ID = ID + element.label.substring(0, 1)
            ID = ID + element.label.substring(element.label.indexOf(' ') + 1, element.label.indexOf(' ') + 2)
            ID = ID + this.pad(Math.floor(Math.random() * (9998)).toString())
            ID = ID.toUpperCase();
            console.log(ID)
            this.createForm.patchValue({ custom_id: ID })
          }
        })

      }
    })

  }

  pad(number: string) {
    while (number.length < 4)
      number = `0${number}`
    return number
  }


}
