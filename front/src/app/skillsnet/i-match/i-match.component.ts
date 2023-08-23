import { Component, OnInit } from '@angular/core';
import { CV } from 'src/app/models/CV';
import { Etudiant } from 'src/app/models/Etudiant';
import { ExterneSkillsnet } from 'src/app/models/ExterneSkillsnet';
import { User } from 'src/app/models/User';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { ExterneSNService } from 'src/app/services/skillsnet/externe-sn.service';

@Component({
  selector: 'app-i-match',
  templateUrl: './i-match.component.html',
  styleUrls: ['./i-match.component.scss']
})
export class IMatchComponent implements OnInit {

  cvs = []
  filteredCVS = []
  etudiants = {}
  externes = {}
  dicPicture = {}

  constructor(private CVService: CvService, private EtudiantService: EtudiantService, private ExterneService: ExterneSNService) { }

  ngOnInit(): void {
    this.CVService.getCvs().then((cvs: CV[]) => {
      cvs.forEach(cv => {
        if (cv.user_id)
          this.cvs.push(cv)
      })
      this.filteredCVS = this.cvs
    })
    this.EtudiantService.getAll().subscribe(etudiants => {
      etudiants.forEach(et => {
        if (et.user_id)
          this.etudiants[et.user_id] = et
      })
    })
    this.ExterneService.getAll().subscribe(exs => {
      exs.forEach(et => {
        if (et.user_id)
          this.externes[et.user_id._id] = et
      })
    })
    this.CVService.getAllPicture().subscribe(data => {
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

  calculateAge(user_id: string) {
    let date_naissance = new Date(2000, 1, 1)
    if (this.externes[user_id] && this.externes[user_id].date_naissance)
      date_naissance = this.externes[user_id].date_naissance
    else if (this.etudiants[user_id] && this.etudiants[user_id].date_naissance)
      date_naissance = this.etudiants[user_id].date_naissance
    else
      return ''
    var dob = new Date(date_naissance);
    //calculate month difference from current date in time  
    var month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format  
    var age_dt = new Date(month_diff);

    //extract year from date      
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user  
    var age = Math.abs(year - 1970);
    return `${age} ans`
  }

  researchValue = ""

  updateFilter() {
    this.filteredCVS = []
    this.cvs.forEach((cv: CV) => {
      let bufferUser: any = cv.user_id
      let user_id: User = bufferUser
      if (user_id && (user_id.lastname.toLowerCase().includes(this.researchValue.toLowerCase()) || user_id.firstname.toLowerCase().includes(this.researchValue.toLowerCase())))
        this.filteredCVS.push(cv)
    })
  }

  clearFilter() {
    this.filteredCVS = this.cvs
    this.researchValue = ""
  }

}
