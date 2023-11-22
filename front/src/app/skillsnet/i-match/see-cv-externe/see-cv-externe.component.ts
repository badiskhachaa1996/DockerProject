import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-see-cv-externe',
  templateUrl: './see-cv-externe.component.html',
  styleUrls: ['./see-cv-externe.component.scss']
})
export class SeeCvExterneComponent implements OnInit {

  cv: CV;
  user: User;
  dicPicture
  profilePic
  @Input() CV_ID = ""
  @Output() UPDATE = new EventEmitter<{ label: string, CV_USER_ID: string }>();
  @Output() RDV = new EventEmitter<{ label: string, ID: string }>();
  constructor(private UserService: AuthService, private cvservice: CvService, private route: ActivatedRoute, private router: Router) {

  }
  takeARendezVous() {
    this.RDV.emit({ label: `RDV - ${this.user.lastname} ${this.user.firstname}`, ID: this.CV_ID })
    //this.router.navigate(['rendez-vous/', this.user._id])
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id')
    if (this.CV_ID)
      id = this.CV_ID
    this.cvservice.getByID(id).subscribe((data) => {
      this.cv = data.dataCv;
      this.competencesList =  [...this.cv.competences];
      this.competencesList.splice(3, 999)
      this.user = data.dataCv.user_id
      if (!data) {
        this.UserService.getPopulate(id).subscribe(u => {
          this.user = u
        })
      }
    })

    this.cvservice.getPictureByUser(id).subscribe(data => {
      this.dicPicture = data // {id:{ file: string, extension: string }}
      const reader = new FileReader();
      const byteArray = new Uint8Array(atob(data["fileOne"].file).split('').map(char => char.charCodeAt(0)));
      let blob: Blob = new Blob([byteArray], { type: data["fileOne"].extension })
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        this.profilePic = reader.result;
      }
    })
  }

  gotoEdit() {
    this.UPDATE.emit({ label: `GENCV - ${this.user.lastname} ${this.user.firstname}`, CV_USER_ID: this.user._id })
    //this.router.navigate(['generateur-cv/', this.user._id])
  }
  competencesList = []
  seeAllCompetences() {
    let id = this.route.snapshot.paramMap.get('id')
    if (this.CV_ID)
      id = this.CV_ID
    this.cvservice.getByID(id).subscribe((data) => {
      this.competencesList = this.cv.competences
    })
  }

  hideAllCompetences() {
    let id = this.route.snapshot.paramMap.get('id')
    if (this.CV_ID)
      id = this.CV_ID
    this.cvservice.getByID(id).subscribe((data) => {
      this.competencesList =  [...this.cv.competences];
      this.competencesList.splice(3, 999)
    })
  }

}
