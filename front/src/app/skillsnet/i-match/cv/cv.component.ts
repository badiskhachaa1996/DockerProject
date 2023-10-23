import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.scss', '../../../../assets/css/bootstrap.min.css']
})
export class CvComponent implements OnInit {

  showingmore = false

  cv: CV;
  user: User;
  dicPicture
  profilePic
  showEditBtn = false
  @Input() CV_ID = ""
  constructor(private UserService: AuthService, private cvservice: CvService, private route: ActivatedRoute, private router: Router) {

  }
  takeARendezVous() {
    this.router.navigate(['rendez-vous/', this.user._id])
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id')
    if (this.CV_ID)
      id = this.CV_ID
    this.cvservice.getByID(id).subscribe((data) => {
      this.cv = data.dataCv;
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
    if (localStorage.getItem('seeEditBTNCV')) {
      localStorage.removeItem('seeEditBTNCV')
      this.showEditBtn = true
    }
  }

  gotoEdit() {
    this.router.navigate(['generateur-cv/', this.user._id])
  }

  showMore() {
    this.showingmore = true
  }

  showLess() {
    this.showingmore = false
  }
}
