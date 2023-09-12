import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import { MicrosoftService } from 'src/app/services/microsoft.service';
import { CV } from 'src/app/models/CV';

import { CvService } from 'src/app/services/skillsnet/cv.service';


@Component({
  selector: 'app-rendez-vous',
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.scss', '../../../../assets/css/bootstrap.min.css']
})
export class RendezVousComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required)
  })

  cv: CV;
  profilePic
  dicPicture

  ID: any = this.route.snapshot.paramMap.get('user_id');
  USER: { cv_id, lastname, firstname, email, email_perso, winner_email, winner_lastname, winner_firstname, winner_id, profilePic, profile, civilite }
  constructor(private route: ActivatedRoute, private McService: MicrosoftService, private UserService: AuthService,
    private ToastService: MessageService, private router: Router, private MeetingTeamService: MeetingTeamsService, private cvservice: CvService) { }

  ngOnInit(): void {
    let d = new Date()
    d.setDate(d.getDate() + 2)
    this.form.patchValue({ date: d })
    this.UserService.nstuget(this.ID).subscribe(u => {
      this.USER = u

      this.dicPicture = this.USER.profilePic // {id:{ file: string, extension: string }}
        const reader = new FileReader();
        const byteArray = new Uint8Array(atob(this.dicPicture.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: this.dicPicture.extension })
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.profilePic = reader.result;
        }
    })

 




    this.cvservice.getByID(this.ID).subscribe((data) => {
      this.cv = data.dataCv;
    })

  }

  onSubmit() {
    let student_name = `${this.USER.lastname} ${this.USER.firstname}`;

    let student_email = this.USER?.email;
    if (!student_email)
      student_email = this.USER?.email_perso

    let company_email = this.form.value.email;

    let winner_email = this.USER?.winner_email;

    let meeting_start_date = new Date(this.form.value.date);

    let description = "Entretien d'embauche";

    let meeting_end_date = new Date(meeting_start_date.getTime() + 45 * 60000);

    const event = {
      subject: "Entretien d'embauche - " + student_name,
      body: {
        contentType: 'HTML',
        content: description
      },
      start: {
        dateTime: meeting_start_date,
        timeZone: 'Europe/London'
      },
      end: {
        dateTime: meeting_end_date,
        timeZone: 'Europe/London'
      },
      location: {
        displayName: 'En Ligne'
      },
      attendees: [
        {
          emailAddress: {
            address: company_email,
          },
          type: 'required'
        },
        {
          emailAddress: {
            address: student_email,
            name: student_name
          },
          type: 'required'
        },
        {
          emailAddress: {
            address: winner_email,
            name: `${this.USER.winner_lastname} ${this.USER.winner_firstname}`
          },
          type: 'required'
        }
      ], isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness'
    };
    this.McService.createTeamsMeeting(event).then(r => {
      if (r) {
        this.ToastService.add({ severity: 'success', detail: 'Le rendez-vous a été planifié' })
        this.MeetingTeamService.create(new MeetingTeams(null, this.USER.winner_id, this.ID, null, company_email, meeting_start_date, new Date(), description + "\nNuméro de téléphone de l'entreprise: " + this.form.value.phone)).subscribe(mt => {
          
        })
        this.router.navigate(['/imatch'])
      }
    })
  }

}
