import { Component, OnInit } from '@angular/core';
import { CV } from 'src/app/models/CV';
import { Competence } from 'src/app/models/Competence';
import { Etudiant } from 'src/app/models/Etudiant';
import { ExterneSkillsnet } from 'src/app/models/ExterneSkillsnet';
import { Profile } from 'src/app/models/Profile';
import { User } from 'src/app/models/User';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { ExterneSNService } from 'src/app/services/skillsnet/externe-sn.service';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { saveAs as importedSaveAs } from "file-saver";
@Component({
  selector: 'app-i-match',
  templateUrl: './i-match.component.html',
  styleUrls: ['./i-match.component.scss', '../../../assets/css/bootstrap.min.css']
})
export class IMatchComponent implements OnInit {

  cvs = []
  filteredCVS = []
  etudiants = {}
  externes = {}
  dicPicture = {}
  skills = []
  profiles = []
  locations = [
    { label: "100% Télétravail",value: "100% Télétravail"},
    { label: "Aix-Marseille",value: "Aix-Marseille"},
    { label: "Amiens",value: "Amiens"},
    { label: "Angers",value: "Angers"},
    { label: "Annecy",value: "Annecy"},
    { label: "Auxerre",value: "Auxerre"},
    { label: "Avignon",value: "Avignon"},
    { label: "Bayonne",value: "Bayonne"},
    { label: "Bergerac",value: "Bergerac"},
    { label: "Besançon",value: "Besançon"},
    { label: "Biarritz",value: "Biarritz"},
    { label: "Bordeaux",value: "Bordeaux"},
    { label: "Boulogne-sur-mer",value: "Boulogne-sur-mer"},
    { label: "Brest",value: "Brest"},
    { label: "Caen",value: "Caen"},
    { label: "Calais",value: "Calais"},
    { label: "Cannes",value: "Cannes"},
    { label: "Chambéry",value: "Chambéry"},
    { label: "Clermont-Ferrand",value: "Clermont-Ferrand"},
    { label: "Dijon",value: "Dijon"},
    { label: "France",value: "France"},
    { label: "Grenoble",value: "Grenoble"},
    { label: "La Réunion",value: "La Réunion"},
    { label: "La Roche sur Yon",value: "La Roche sur Yon"},
    { label: "La Rochelle",value: "La Rochelle"},
    { label: "Le Havre",value: "Le Havre"},
    { label: "Le Mans",value: "Le Mans"},
    { label: "Lille",value: "Lille"},
    { label: "Limoges",value: "Limoges"},
    { label: "Lyon",value: "Lyon"},
    { label: "Mâcon",value: "Mâcon"},
    { label: "Metz",value: "Metz"},
    { label: "Montauban",value: "Montauban"},
    { label: "Montpellier",value: "Montpellier"},
    { label: "Mulhouse",value: "Mulhouse"},
    { label: "Nancy",value: "Nancy"},
    { label: "Nantes",value: "Nantes"},
    { label: "Nice",value: "Nice"},
    { label: "Nîmes",value: "Nîmes"},
    { label: "Niort",value: "Niort"},
    { label: "Orléans",value: "Orléans"},
    { label: "Oyonnax",value: "Oyonnax"},
    { label: "Paris/Ile de France",value: "Paris/Ile de France"},
    { label: "Pau",value: "Pau"},
    { label: "Perpignan",value: "Perpignan"},
    { label: "Poitiers",value: "Poitiers"},
    { label: "Reims",value: "Reims"},
    { label: "Rennes",value: "Rennes"},
    { label: "Rodez",value: "Rodez"},
    { label: "Rouen",value: "Rouen"},
    { label: "Saint-Etienne",value: "Saint-Etienne"},
    { label: "Saint-Tropez",value: "Saint-Tropez"},
    { label: "Strasbourg",value: "Strasbourg"},
    { label: "Toulon",value: "Toulon"},
    { label: "Toulouse",value: "Toulouse"},
    { label: "Troyes",value: "Troyes"},
    { label: "Valence",value: "Valence"},
    { label: "Guadeloupe",value: "Guadeloupe"},
  ]
  disponibilite = []

  constructor(private CVService: CvService, private EtudiantService: EtudiantService,
    private ExterneService: ExterneSNService, private SkillService: SkillsService) { }

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
    this.SkillService.getCompetences().then((competences: Competence[]) => {
      competences.forEach(competence => {
        this.skills.push({ label: competence.libelle, value: competence.libelle })
      })
    })
    this.SkillService.getProfiles().then((profiles: Profile[]) => {
      profiles.forEach(profil => {
        this.profiles.push({ label: profil.libelle, value: profil._id })
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
  selectedSkills = []
  selectedProfiles = []
  selectedLocations = []

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
      if (this.rangeDates.length == 2 && this.rangeDates[0] != new Date(1980))
        if (!(this.rangeDates[0] < new Date(cv.disponibilite) && new Date(cv.disponibilite) < this.rangeDates[1]))
          added = false; console.log('Date ISSUE', this.rangeDates, new Date(cv.disponibilite))
      if (this.selectedSkills.length != 0) {
        let tempSkill = []
        cv.competences.forEach((skill: any) => {
          tempSkill.push(skill.libelle)
        })
        if (!(this.selectedSkills.every(elem => tempSkill.includes(elem))))
          added = false; console.log('SKILLS ISSUE')
      }
      if (this.selectedLocations.length !=0) {
        this.selectedLocations.forEach(p => {
          console.log(p)
          console.log(cv.mobilite_lieu)
          console.log(p.toLowerCase())
          if (!(cv.mobilite_lieu.includes(p.toLowerCase())))
          console.log("Heeeere")
          added = false;console.log('Location ISSUE')
        })
        
      }
      if (this.selectedProfiles.length != 0) {
        let bufferProfil: any = cv.competences[0]
        let profil: Profile = bufferProfil.profile_id
        let temp = false
        this.selectedProfiles.forEach(p => {
          if (profil == p)
            temp = true
        })
        if (!temp)
          added = false
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
    return d <= new Date()
  }

  onClickCV(cv: any) {
    this.CVService.downloadCV(cv.user_id._id).then((data: any) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), 'cv.pdf')
    })
  }

}
