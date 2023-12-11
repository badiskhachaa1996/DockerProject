import { Component, Input, OnInit, Output } from '@angular/core';
import { CV } from 'src/app/models/CV';
import { Competence } from 'src/app/models/Competence';
import { Profile } from 'src/app/models/Profile';
import { User } from 'src/app/models/User';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { ExterneSNService } from 'src/app/services/skillsnet/externe-sn.service';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { saveAs as importedSaveAs } from "file-saver";
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidat-list',
  templateUrl: './candidat-list.component.html',
  styleUrls: ['./candidat-list.component.scss', '../../../../../assets/css/bootstrap.min.css']
})
export class CandidatListComponent implements OnInit {

  @Input() showDeposerOffre;

  @Input() locations;


  cvs = []
  filteredCVS = []
  etudiants = {}
  externes = {}
  dicPicture = {}

  @Input() skills;
  @Input() profiles;
  
  disponibilite = []
  etudes = [
    { label: 'Baccalauréat', value: 'Baccalauréat' },
    { label: 'BTS (Brevet de Technicien Supérieur)', value: 'BTS (Brevet de Technicien Supérieur)' },
    { label: 'Bachelor', value: 'Bachelor' },
    { label: 'Master 1er année', value: 'Master 1er année' },
    { label: 'Master 2ème année', value: 'Master 2ème année' },
  ]

  constructor(private CVService: CvService, private EtudiantService: EtudiantService,
    private ExterneService: ExterneSNService, private SkillService: SkillsService, private router: Router) { }

  ngOnInit(): void {
    this.CVService.getCvsPublic().then((cvs: CV[]) => {
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
        if (data.files[id]) {
          const byteArray = new Uint8Array(atob(data.files[id].file).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([byteArray], { type: data.files[id].extension })
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.dicPicture[id].url = reader.result;
          }
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

  calculatePrime(user_id: string) {
    let date_naissance = new Date(2000, 1, 1)
    if (this.externes[user_id] && this.externes[user_id].date_naissance)
      date_naissance = this.externes[user_id].date_naissance
    else if (this.etudiants[user_id] && this.etudiants[user_id].date_naissance)
      date_naissance = this.etudiants[user_id].date_naissance
    else
      return 9999
    var dob = new Date(date_naissance);
    //calculate month difference from current date in time  
    var month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format  
    var age_dt = new Date(month_diff);

    //extract year from date      
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user  
    var age = Math.abs(year - 1970);
    return age
  }

  researchValue = ""
  Age = null
  rangeDates = []
  dispoFilter = null
  selectedSkills = []
  selectedProfiles = []
  selectedLocations = []
  selectEtude = []

  updateFilter() {
    this.filteredCVS = []
    this.cvs.forEach((cv: CV) => {
      let bufferUser: any = cv.user_id
      let user_id: User = bufferUser
      if (user_id && (user_id.lastname.toLowerCase().includes(this.researchValue.toLowerCase()) || user_id.firstname.toLowerCase().includes(this.researchValue.toLowerCase())))
        this.filteredCVS.push(cv)
      else if (cv.mobilite_lieu && cv.mobilite_lieu.includes(this.researchValue.toLowerCase())) {
        this.filteredCVS.push(cv)
      }
    })
    let newFiltered = []
    this.filteredCVS.forEach((cv: CV) => {
      let bufferUser: any = cv.user_id
      let user_id: User = bufferUser
      let added = true
      if (this.Age != null && this.Age && this.Age.toString() != "0")
        if (!(user_id && `${this.Age} ans` == this.calculateAge(user_id._id)))
          added = false; console.log('Age ISSUE', `${this.Age} ans`, this.calculateAge(user_id._id))
      /*if (this.rangeDates.length == 2 && this.rangeDates[0] != new Date(1980))
        if (!(this.rangeDates[0] < new Date(cv.disponibilite) && new Date(cv.disponibilite) < this.rangeDates[1]))
          added = false; console.log('Date ISSUE', this.rangeDates, new Date(cv.disponibilite))*/
      if (this.dispoFilter) {
        let db = new Date(this.dispoFilter)
        let df = new Date(this.dispoFilter)
        df.setMonth(df.getMonth() + 1)
        if (!(db <= new Date(cv.disponibilite)))
          added = false;
      }

      if (this.selectedSkills.length != 0) {
        let tempSkill = []
        cv.competences.forEach((skill: any) => {
          tempSkill.push(skill.libelle)
        })
        if (!(this.selectedSkills.every(elem => tempSkill.includes(elem))))
          added = false;
      }
      if (this.selectedLocations.length != 0) {
        this.selectedLocations.forEach(p => {
          if (!cv.mobilite_lieu || !cv.mobilite_lieu.includes(p))
            added = false;
        })
      }
      if (this.selectEtude.length != 0) {
        this.selectEtude.forEach(p => {
          if (!cv.niveau_etude || !cv.niveau_etude.includes(p))
            added = false
        })

      }
      if (this.selectedProfiles.length != 0) {
        let bufferProfil: any = cv.competences[0]
        if (bufferProfil && bufferProfil.profile_id) {
          let profil: Profile = bufferProfil.profile_id
          let temp = false
          this.selectedProfiles.forEach(p => {
            if (profil._id == p)
              temp = true
          })
          if (!temp)
            added = false
        } else {
          added = false
        }

      }

      if (added)
        newFiltered.push(cv)

    })
    this.filteredCVS = newFiltered
  }

  clearFilter() {
    this.filteredCVS = this.cvs
    this.researchValue = ""
    this.Age = null
    this.rangeDates = []
    this.selectedSkills = []
    this.selectedProfiles = []
    this.selectedLocations = []
  }

  disponible(d: Date) {
    return new Date(d).getTime() <= new Date().getTime()
  }
  onClickCV(cv: any) {
    this.CVService.downloadCV(cv.user_id._id).then((data: any) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), 'cv.pdf')
    })
  }

  takeARendezVous(cv: any) {
    this.router.navigate(['rendez-vous/', cv.user_id._id])
  }
}
