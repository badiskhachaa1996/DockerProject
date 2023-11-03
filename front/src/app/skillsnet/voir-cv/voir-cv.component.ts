import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';

@Component({
  selector: 'app-voir-cv',
  templateUrl: './voir-cv.component.html',
  styleUrls: ['./voir-cv.component.scss']
})
export class VoirCvComponent implements OnInit {

  user: User
  ecoleImage = 'espic'
  CV: CV
  @Input() CV_ID = ""
  ID = this.route.snapshot.paramMap.get('cv_id');

  constructor(private route: ActivatedRoute, private CVService: CvService, private AuthService: AuthService) { }
  reader: FileReader = new FileReader();
  ngOnInit(): void {
    this.reader.addEventListener("load", () => {
      this.imgPDP = this.reader.result;
    }, false);
    if (this.CV_ID)
      this.ID = this.CV_ID
    this.CVService.getByID(this.ID).subscribe(cv => {
      this.CV = cv.dataCv
      this.user = this.CV.user_id
      this.AuthService.getProfilePicture(this.CV.user_id._id).subscribe((data) => {
        if (data.error) {
          this.imgPDP = null
        } else {
          const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([byteArray], { type: data.documentType })
          if (blob) {
            this.imgPDP = null
            this.reader.readAsDataURL(blob);
          }
        }
      })
    })

  }
  imgPDP;
}
