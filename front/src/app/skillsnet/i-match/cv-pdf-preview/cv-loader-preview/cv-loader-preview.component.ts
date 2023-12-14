import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';

@Component({
  selector: 'app-cv-loader-preview',
  templateUrl: './cv-loader-preview.component.html',
  styleUrls: ['./cv-loader-preview.component.scss']
})
export class CvLoaderPreviewComponent implements OnInit {
  pdfSrc: any = ''
  constructor(private route: ActivatedRoute, private CVService: CvService, private AuthService: AuthService) { }
  reader: FileReader = new FileReader();
  imgPDP;
  CV: CV
  user: User
  @Input() CV_ID = ""
  fullName = ""
  profil = "Profil Non Spécifié"
  loaded = false
  ngOnInit(): void {
    this.reader.addEventListener("load", () => {
      this.imgPDP = this.reader.result;
    }, false);
    this.CVService.getByID(this.CV_ID).subscribe(cv => {
      this.CV = cv.dataCv
      if (this.CV.profil)
        this.profil = this.CV.profil.libelle
      else if (this.CV.competences && this.CV.competences.length != 0 && this.CV.competences[0]?.profile_id)
        this.profil = this.CV.competences[0]?.profile_id?.libelle
      this.user = this.CV.user_id
      this.fullName = `${this.user?.lastname} ${this.user?.firstname}`
      if (this.CV.showCVPDF)
        this.CVService.downloadCV(this.user._id).then(r => {
          const byteArray = new Uint8Array(atob(r.file).split('').map(char => char.charCodeAt(0)));
          var blob = new Blob([byteArray], { type: r.extension });
          const fileReader = new FileReader();
          fileReader.onload = () => {
            this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
          };
          fileReader.readAsArrayBuffer(blob);

        })

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
        this.loaded = true
      })
    })

  }

}
