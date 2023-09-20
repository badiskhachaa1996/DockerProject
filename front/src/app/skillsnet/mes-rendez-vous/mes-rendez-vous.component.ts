import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-mes-rendez-vous',
  templateUrl: './mes-rendez-vous.component.html',
  styleUrls: ['./mes-rendez-vous.component.scss']
})
export class MesRendezVousComponent implements OnInit {
  token;
  meetings: MeetingTeams[] = []
  constructor(private MeetingTeamsService: MeetingTeamsService, private ToastService: MessageService, private AuthService: AuthService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.AuthService.getPopulate(this.token.id).subscribe(user => {
      this.MeetingTeamsService.getAllByEmail(user.email_perso).subscribe(mts => {
        this.meetings = mts
      })
    })

  }

  form = new FormGroup({
    statut: new FormControl('', Validators.required)
  })

  rdvToUpdate: MeetingTeams
  meetingSelected: MeetingTeams
  showForm

  statutDropdown = [
    { label: "Planifié", value: "Planifié" },
    { label: "Validé par le candidat", value: "Validé par le candidat" },
    { label: "Annulé", value: "Annulé" },
    { label: "Fait", value: "Fait" },
  ]

  onInitUpdate(rdv: MeetingTeams) {
    this.form.patchValue({ statut: rdv.statut })
    this.rdvToUpdate = rdv
    this.scrollToTop()
  }

  onInitCustom(rdv: MeetingTeams, type = 'Note') {
    this.showForm = type
    this.meetingSelected = rdv
    this.scrollToTop()
  }

  onUpdateCustom() {
    this.MeetingTeamsService.update({ ...this.meetingSelected }).subscribe(r => {
      this.showForm = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour du rendez-vous avec succès' })
    })
  }

  onUpdate() {
    this.MeetingTeamsService.update({ _id: this.rdvToUpdate._id, ...this.form.value }).subscribe(r => {
      this.meetings[this.meetings.indexOf(this.rdvToUpdate)].statut = this.form.value.statut
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

  onCancel() {

  }
  seeOffer() {

  }
  seeCV() {

  }


}
