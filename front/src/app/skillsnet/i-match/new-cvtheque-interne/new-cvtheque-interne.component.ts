import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { saveAs as importedSaveAs } from "file-saver";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Matching } from 'src/app/models/Matching';
import { MeetingTeamsService } from 'src/app/services/meeting-teams.service';
import { MeetingTeams } from 'src/app/models/MeetingTeams';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { Profile } from 'src/app/models/Profile';
import { Competence } from 'src/app/models/Competence';
@Component({
  selector: 'app-new-cvtheque-interne',
  templateUrl: './new-cvtheque-interne.component.html',
  styleUrls: ['./new-cvtheque-interne.component.scss']
})
export class NewCvthequeInterneComponent implements OnInit {
  nationList = environment.nationalites;
  paysList = environment.pays;
  civiliteList = environment.civilite;

  cvs: any[] = []
  defaultcvs = this.cvs
  dicPicture = {}
  dicMatching = {}
  constructor(private AuthService: AuthService, private CVService: CvService, private MatchingService: MatchingService, private router: Router,
    private ToastService: MessageService, private RDVService: MeetingTeamsService, private skillsService: SkillsService) { }

  ngOnInit(): void {
    this.updateAllCVs()
    //Récupération de la liste des profiles
    this.skillsService.getProfiles()
      .then((response: Profile[]) => {
        response.forEach((profile: Profile) => {
          this.profilFilter.push({ label: profile.libelle, value: profile._id });
        })
      })
      .catch((error) => { console.error(error); });
    this.skillsService.getCompetences()
      .then((response: Competence[]) => {
        response.forEach((competence: Competence) => {
          this.competencesList.push({ label: competence.libelle, value: competence._id });
        })
      })
      .catch((error) => { console.error(error); })
  }

  updateAllCVs() {
    this.CVService.getCvs().then(cvs => {
      this.cvs = cvs
      this.defaultcvs = cvs
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
    this.MatchingService.getAll().subscribe(matchings => {
      this.dicMatching = {}
      matchings.forEach(m => {
        if (m.cv_id)
          if (this.dicMatching[m.cv_id._id])
            this.dicMatching[m.cv_id._id] = this.dicMatching[m.cv_id._id] + 1
          else
            this.dicMatching[m.cv_id._id] = 1
      })
    })
  }

  disponible(d: Date) {
    return new Date(d).getTime() <= new Date().getTime()
  }

  onFilterInput() {

  }

  deleteCV(cv: CV) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      this.CVService.deleteCV(cv._id).then(r => {
        this.updateAllCVs()
        //TODO IF TYPE GNGNGN SUPPRIMER LEXTERNE
      })
    }
  }

  goToCV(cv: CV) {
    localStorage.setItem('seeEditBTNCV', 'true')
    this.router.navigate(['imatch/cv', cv._id])
  }
  downloadOldCV(cv: CV) {
    this.CVService.downloadCV(cv.user_id._id).then(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), 'cv.pdf')
    })
  }
  cvToUpdate;
  formUpdate = new FormGroup({
    civilite: new FormControl('Monsieur', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    nationnalite: new FormControl(''),
    email_perso: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    pays_adresse: new FormControl(''),
    ville_adresse: new FormControl(''),
    rue_adresse: new FormControl(''),
    numero_adresse: new FormControl(''),
    postal_adresse: new FormControl(''),
    _id: new FormControl('', Validators.required),
    last_modified_at: new FormControl(new Date())
  })

  cvToAdd;
  formAdd = new FormGroup({
    civilite: new FormControl('Monsieur', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    nationnalite: new FormControl(''),
    email_perso: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    pays_adresse: new FormControl(''),
    ville_adresse: new FormControl(''),
    rue_adresse: new FormControl(''),
    numero_adresse: new FormControl(''),
    postal_adresse: new FormControl('')
  })
  onInitUpdate(cv: CV) {
    this.formUpdate.patchValue({ ...cv.user_id })
    this.cvToUpdate = cv
    this.scrollToTop()
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  saveUpdate() {
    this.AuthService.update({ ...this.formUpdate.value }).subscribe(r => {
      this.formUpdate.reset()
      this.CVService.putCv({ ...this.cvToUpdate, last_modified_at: new Date() }).then()
      this.cvToUpdate = null
      this.updateAllCVs()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour réussi' })
    })
  }
  saveAdd() {
    this.AuthService.create({ ...this.formAdd.value, type: 'Prospect' }).subscribe(user => {
      this.CVService.postCv({ user_id: user._id }).then(cv => {
        this.ToastService.add({ severity: 'success', summary: 'Création du cv avec succès.' })
        this.formAdd.reset()
        this.formAdd.patchValue({ civilite: 'Monsieur' })
        this.cvToAdd = false
        this.updateAllCVs()
      })
    })

  }
  userMatchingData: User
  onLoadMatching(user_id: User) {
    /*this.MatchingService.getAllByCVUSERID(user_id).subscribe(matchings => {
      this.matchingToSee = matchings
    })*/
    this.userMatchingData = user_id
    this.MatchingService.generateMatchingV1USERID(user_id._id).subscribe(r => {
      this.matchingToSee = r
    })
    this.RDVService.getAllByUserID(user_id._id).subscribe(rdvs => {
      console.log(rdvs)
      rdvs.forEach(rd => {
        if (rd.offre_id)
          this.rdvDic[rd.offre_id._id] = rd
      })
    })

  }
  rdvDic = {}
  matchingToSee: Matching[] = []
  displayRDV = false
  dataRDV = null
  seeRDV(rdv: MeetingTeams) {
    console.log(rdv)
    this.displayRDV = true
    this.dataRDV = rdv
  }



  profilFilter = [
    //{ label: "Choisissez un profil", value: null },
  ]

  locations = [
    //{ label: "Choisissez une ville", value: null },
    { label: "100% Télétravail", value: "100% Télétravail" },
    { label: "Aix-Marseille", value: "Aix-Marseille" },
    { label: "Amiens", value: "Amiens" },
    { label: "Angers", value: "Angers" },
    { label: "Annecy", value: "Annecy" },
    { label: "Auxerre", value: "Auxerre" },
    { label: "Avignon", value: "Avignon" },
    { label: "Bayonne", value: "Bayonne" },
    { label: "Bergerac", value: "Bergerac" },
    { label: "Besançon", value: "Besançon" },
    { label: "Biarritz", value: "Biarritz" },
    { label: "Bordeaux", value: "Bordeaux" },
    { label: "Boulogne-sur-mer", value: "Boulogne-sur-mer" },
    { label: "Brest", value: "Brest" },
    { label: "Caen", value: "Caen" },
    { label: "Calais", value: "Calais" },
    { label: "Cannes", value: "Cannes" },
    { label: "Chambéry", value: "Chambéry" },
    { label: "Clermont-Ferrand", value: "Clermont-Ferrand" },
    { label: "Dijon", value: "Dijon" },
    { label: "France", value: "France" },
    { label: "Grenoble", value: "Grenoble" },
    { label: "La Réunion", value: "La Réunion" },
    { label: "La Roche sur Yon", value: "La Roche sur Yon" },
    { label: "La Rochelle", value: "La Rochelle" },
    { label: "Le Havre", value: "Le Havre" },
    { label: "Le Mans", value: "Le Mans" },
    { label: "Lille", value: "Lille" },
    { label: "Limoges", value: "Limoges" },
    { label: "Lyon", value: "Lyon" },
    { label: "Mâcon", value: "Mâcon" },
    { label: "Metz", value: "Metz" },
    { label: "Montauban", value: "Montauban" },
    { label: "Montpellier", value: "Montpellier" },
    { label: "Mulhouse", value: "Mulhouse" },
    { label: "Nancy", value: "Nancy" },
    { label: "Nantes", value: "Nantes" },
    { label: "Nice", value: "Nice" },
    { label: "Nîmes", value: "Nîmes" },
    { label: "Niort", value: "Niort" },
    { label: "Orléans", value: "Orléans" },
    { label: "Oyonnax", value: "Oyonnax" },
    { label: "Paris/Ile de France", value: "Paris/Ile de France" },
    { label: "Pau", value: "Pau" },
    { label: "Perpignan", value: "Perpignan" },
    { label: "Poitiers", value: "Poitiers" },
    { label: "Reims", value: "Reims" },
    { label: "Rennes", value: "Rennes" },
    { label: "Rodez", value: "Rodez" },
    { label: "Rouen", value: "Rouen" },
    { label: "Saint-Etienne", value: "Saint-Etienne" },
    { label: "Saint-Tropez", value: "Saint-Tropez" },
    { label: "Strasbourg", value: "Strasbourg" },
    { label: "Toulon", value: "Toulon" },
    { label: "Toulouse", value: "Toulouse" },
    { label: "Troyes", value: "Troyes" },
    { label: "Valence", value: "Valence" },
    { label: "Guadeloupe", value: "Guadeloupe" },
  ]

  competencesList = [

  ]

  etudes = [
    { label: 'Baccalauréat', value: 'Baccalauréat' },
    { label: 'BTS (Brevet de Technicien Supérieur)', value: 'BTS (Brevet de Technicien Supérieur)' },
    { label: 'Bachelor', value: 'Bachelor' },
    { label: 'Master 1er année', value: 'Master 1er année' },
    { label: 'Master 2ème année', value: 'Master 2ème année' },
  ]
  filter_value = {
    profil: [],
    locations: [],
    disponibilite: '',
    competences: [],
    niveau: [],
    winner: '',
    search: ''
  }
  updateFilter() {
    this.cvs = []
    this.defaultcvs.forEach((val: CV) => {
      let r = true
      let competences_ids = []
      val.competences.forEach(c => {
        competences_ids.push(c._id)
      })
      if (this.filter_value.profil.length != 0 && (val.competences.length != 0 || this.filter_value.profil != val.competences[0].profile_id?._id))
        r = false
      else if (this.filter_value.locations.length != 0 && (!val.mobilite_lieu || !this.filter_value.locations.includes(val.mobilite_lieu)))
        r = false
      else if (this.filter_value.disponibilite && new Date(this.filter_value.disponibilite).getTime() > new Date(val.disponibilite).getTime())
        r = false
      else if (this.filter_value.competences.length != 0) {
        if (competences_ids.length == 0)
          r = false
      }
      else if (this.filter_value.search) {
        if (!val.a_propos.includes(this.filter_value.search) &&
          !val.centre_interets.includes(this.filter_value.search) &&
          !val.user_id?.lastname.includes(this.filter_value.search) &&
          !val.user_id?.firstname.includes(this.filter_value.search) &&
          !val.mobilite_lieu.includes(this.filter_value.search))
          r = false
      }
      if (r)
        this.cvs.push(val)
    })
  }

}