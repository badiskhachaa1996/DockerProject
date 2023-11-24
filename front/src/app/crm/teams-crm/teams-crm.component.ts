import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TeamsCRM } from 'src/app/models/TeamsCRM';
import { TeamsCrmService } from 'src/app/services/crm/teams-crm.service';

@Component({
  selector: 'app-teams-crm',
  templateUrl: './teams-crm.component.html',
  styleUrls: ['./teams-crm.component.scss']
})
export class TeamsCrmComponent implements OnInit {

  teams: TeamsCRM[] = []
  selectedTeam: TeamsCRM
  constructor(private TeamsIntService: TeamsCrmService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.TeamsIntService.TIgetAll().subscribe(data => {
      this.teams = data
    })
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    description: new FormControl('')
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

  createForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    description: new FormControl(''),
    date_creation: new FormControl(new Date(), Validators.required)
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

  delete(team: TeamsCRM) {
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

  generateID(team: TeamsCRM) {
    let ID = team.nom.substring(0, 2).toUpperCase() + this.pad(Math.floor(Math.random() * (999998)).toString())
    return ID
  }

  pad(number: string) {
    while (number.length < 6)
      number = `0${number}`
    return number
  }


}
