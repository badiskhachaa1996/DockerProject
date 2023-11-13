import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-rendez-vous-resultats',
  templateUrl: './rendez-vous-resultats.component.html',
  styleUrls: ['./rendez-vous-resultats.component.scss']
})
export class RendezVousResultatsComponent implements OnInit {
  meetings: MeetingTeams[] = []
  constructor(private MeetingTeamsService: MeetingTeamsService, private ToastService: MessageService, private UserService: AuthService) { }
  defaultmeetings: MeetingTeams[] = []
  isEntreprise = false
  isEtudiant = false
  token
  ngOnInit(): void {

    let token: any = jwt_decode(localStorage.getItem("token"));
    this.UserService.getPopulate(token.id).subscribe(userConnected => {
      this.isEtudiant = (userConnected.type == 'Initial' || userConnected.type == 'Alternant' || userConnected.type == 'Prospect' || userConnected.type == 'Externe' || userConnected.type == 'Externe-InProgress' || (userConnected.type == null && userConnected.role == "user"))
      this.isEntreprise = (userConnected.type == 'Tuteur' || userConnected.type == 'CEO Entreprise')
      if (!this.isEtudiant && !this.isEntreprise) {
        this.MeetingTeamsService.getAll().subscribe(mts => {
          this.meetings = mts
          this.defaultmeetings = this.meetings
        })
      } else if (this.isEtudiant) {
        this.MeetingTeamsService.getAllByUserID(token.id).subscribe(mts => {
          this.meetings = mts
          this.defaultmeetings = this.meetings
        })
      } else if (this.isEntreprise) {
        this.MeetingTeamsService.getAllByEmail(userConnected.email_perso).subscribe(mts => {
          this.meetings = mts
          this.defaultmeetings = this.meetings
        })
      }
    })
  }

  form = new FormGroup({
    statut: new FormControl('Planifié'),
    meeting_start_date: new FormControl('')
  })

  rdvToUpdate: MeetingTeams

  statutDropdown = [
    { label: "Planifié", value: "Planifié" },
    { label: "Validé", value: "Validé" },
    { label: "Annulé", value: "Annulé" },
  ]
  filterStatut = [
    { label: "Tous les statuts", value: null },
    { label: "Planifié", value: "Planifié" },
    { label: "Validé", value: "Validé" },
    { label: "Annulé", value: "Annulé" },
  ]

  onInitUpdate(rdv: MeetingTeams) {
    this.form.patchValue({ ...rdv })
    this.rdvToUpdate = rdv
    this.scrollToTop()
  }

  onUpdate() {
    this.MeetingTeamsService.update({ _id: this.rdvToUpdate._id, statut: 'Planifié', ...this.form.value }).subscribe(r => {
      this.meetings[this.meetings.indexOf(this.rdvToUpdate)].statut = 'Planifié'
      this.form.reset()
      this.rdvToUpdate = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour du rendez-vous avec succès' })
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
  onFilterDate(date: Date) {
    this.meetings = []
    date = new Date(date)
    date.setHours(0, 0, 0, 0)
    this.defaultmeetings.forEach(m => {
      //console.log(new Date(date).getTime() < new Date(m.meeting_start_date).getTime(), new Date(date).getTime(), new Date(m.meeting_start_date).getTime())
      if (m.meeting_start_date && date.getTime() < date.getTime())
        this.meetings.push(m)
    })
  }
  changeStatut(statut: string, rdv: MeetingTeams) {
    rdv.statut = statut
    this.MeetingTeamsService.update({ ...rdv }).subscribe(r => {
      this.ToastService.add({ severity: 'success', summary: 'Statut du rendez-vous mis à jour' })
    })
  }
  deleteRDV(rdv) {
    this.MeetingTeamsService.delete(rdv._id).subscribe(r => {
      this.meetings.splice(this.meetings.indexOf(rdv), 1)
    })
  }
}
