import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
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
  ID = this.route.snapshot.paramMap.get('cv_id');

  constructor(private route: ActivatedRoute, private CVService: CvService) { }

  ngOnInit(): void {
    this.CVService.getByID(this.ID).subscribe(cv => {
      console.log(cv)
      this.CV = cv.dataCv
      this.user = this.CV.user_id
    })
  }

}
