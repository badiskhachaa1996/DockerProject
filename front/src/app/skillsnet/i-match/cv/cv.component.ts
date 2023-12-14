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
  reader: FileReader = new FileReader();
  constructor(private UserService: AuthService, private cvservice: CvService, private route: ActivatedRoute, private router: Router) {

  }
  takeARendezVous() {
    this.router.navigate(['rendez-vous/', this.user._id])
  }
  pdfSrc: any = ''
  ngOnInit(): void {
    this.reader.addEventListener("load", () => {
      this.profilePic = this.reader.result;
    }, false);
    let id = this.route.snapshot.paramMap.get('id')
    if (this.CV_ID)
      id = this.CV_ID
    this.cvservice.getByID(id).subscribe((data) => {
      this.cv = data.dataCv;
      this.user = data.dataCv.user_id
      if (this.cv.showCVPDF)
        this.cvservice.downloadCV(this.user._id).then(r => {
          const byteArray = new Uint8Array(atob(r.file).split('').map(char => char.charCodeAt(0)));
          var blob = new Blob([byteArray], { type: r.extension });
          const fileReader = new FileReader();
          fileReader.onload = () => {
            this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
          };
          fileReader.readAsArrayBuffer(blob);

        })

      this.UserService.getProfilePicture(this.user._id).subscribe((data) => {
        if (data.error) {
          this.profilePic = null
        } else {
          const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([byteArray], { type: data.documentType })
          if (blob) {
            this.profilePic = null
            this.reader.readAsDataURL(blob);
          }
        }
      })
      if (!data) {
        this.UserService.getPopulate(id).subscribe(u => {
          this.user = u
        })
      }
    })


    if (localStorage.getItem('seeEditBTNCV')) {
      localStorage.removeItem('seeEditBTNCV')
      this.showEditBtn = true
    }
  }

  gotoEdit() {
    this.router.navigate(['i-match/generateur-cv/', this.user._id])
  }

  showMore() {
    this.showingmore = true
  }

  showLess() {
    this.showingmore = false
  }
}
