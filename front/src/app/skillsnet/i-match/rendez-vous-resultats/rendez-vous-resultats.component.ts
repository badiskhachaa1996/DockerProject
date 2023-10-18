import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';

@Component({
  selector: 'app-rendez-vous-resultats',
  templateUrl: './rendez-vous-resultats.component.html',
  styleUrls: ['./rendez-vous-resultats.component.scss']
})
export class RendezVousResultatsComponent implements OnInit {
  meetings: MeetingTeams[] = []
  constructor(private MeetingTeamsService: MeetingTeamsService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.MeetingTeamsService.getAll().subscribe(mts => {
      this.meetings = mts
    })
  }

  form = new FormGroup({
    statut: new FormControl('', Validators.required),
    note: new FormControl('')
  })

  rdvToUpdate: MeetingTeams

  statutDropdown = [
    { label: "Planifié", value: "Planifié" },
    { label: "Validé", value: "Validé" },
    { label: "Annulé", value: "Annulé" },
  ]


  onInitUpdate(rdv: MeetingTeams) {
    this.form.patchValue({ statut: rdv.statut })
    this.rdvToUpdate = rdv
    this.scrollToTop()
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

}
