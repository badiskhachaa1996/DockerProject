import { Component, OnInit } from '@angular/core';
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

  cv: CV;
  user: User;
  dicPicture = {}

  constructor(private UserService: AuthService, private cvservice: CvService, private route: ActivatedRoute, private router: Router) {
    const id = this.route.snapshot.paramMap.get('id')
    this.cvservice.getByID(id).subscribe((data) => {
      this.cv = data.dataCv;
      this.user = data.dataCv.user_id
      if (!data) {
        this.UserService.getPopulate(id).subscribe(u => {
          this.user = u
        })
      }
    })

    this.cvservice.getAllPicture().subscribe(data => {
      this.dicPicture = data.files // {id:{ file: string, extension: string }}
      data.ids.forEach(id => {
        const reader = new FileReader();
        const byteArray = new Uint8Array(atob(data.files[id].file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.files[id].extension })
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.dicPicture[id].url = reader.result;
        }
      })
    })
  }
  takeARendezVous() {
    this.router.navigate(['rendez-vous/', this.user._id])
  }

  ngOnInit(): void {

  }
}
