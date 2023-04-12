import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MemberInt } from 'src/app/models/memberInt';
import { TeamsIntService } from 'src/app/services/teams-int.service';

@Component({
  selector: 'app-member-int',
  templateUrl: './member-int.component.html',
  styleUrls: ['./member-int.component.scss']
})
export class MemberIntComponent implements OnInit {

  members: MemberInt[]
  selectedMember: MemberInt
  teamsList = []
  constructor(private TeamsIntService: TeamsIntService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.TeamsIntService.MIgetAll().subscribe(data => {
      this.members = data
    })
    this.TeamsIntService.TIgetAll().subscribe(data => {
      data.forEach(f => {
        this.teamsList.push({ label: f.nom, value: f._id })
      })
    })
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    team_id: new FormControl('', Validators.required),
    localisation: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
  })

  initUpdate(etudiant) {
    this.selectedMember = etudiant
    this.updateForm.patchValue({ ...etudiant })
  }

  onUpdate() {
    this.TeamsIntService.MIupdate({ ...this.updateForm.value }).subscribe(data => {
      this.members.splice(this.members.indexOf(this.selectedMember), 1, data)
      this.selectedMember = null
      this.MessageService.add({ severity: "success", summary: `Mis à jour de la formation de ${data.user_id.lastname} ${data.user_id.firstname} avec succès` })
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
