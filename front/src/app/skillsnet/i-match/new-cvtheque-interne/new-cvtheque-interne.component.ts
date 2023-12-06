import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { saveAs as importedSaveAs } from "file-saver";
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Matching } from 'src/app/models/Matching';
import jwt_decode from "jwt-decode";
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
  isEtudiant = true
  isEntreprise = false
  token;
  constructor(private AuthService: AuthService, private CVService: CvService, private MatchingService: MatchingService, private router: Router,
    private ToastService: MessageService, private RDVService: MeetingTeamsService, private skillsService: SkillsService) { }

  ngOnInit(): void {
    this.updateAllCVs()
    this.token = jwt_decode(localStorage.getItem("token"));
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
    this.AuthService.getPopulate(this.token.id).subscribe(user => {
      this.isEtudiant = (user.type == 'Initial' || user.type == 'Alternant' || user.type == 'Prospect' || user.type == 'Externe' || user.type == 'Externe-InProgress' || (user.type == null && user.role == "user"))
      this.isEntreprise = (user.type == 'CEO Entreprise' || user.type == 'Tuteur')
      if (this.isEntreprise)
        this.activeIndex1 = 1
      if (user.savedMatching)
        this.matchingList = user.savedMatching
    })
  }

  updateAllCVs() {
    this.CVService.getCvs().then(cvs => {
      this.cvs = cvs
      this.defaultcvs = cvs
      this.auteurFilter = [{ label: 'Tous les auteurs', value: null }, { label: 'Candidat', value: 'Candidat' }]
      let temp_createur_id = []
      cvs.forEach(val => {
        if (val.createur_id && !temp_createur_id.includes(val.createur_id._id) && val.createur_id._id != val.user_id._id) {
          this.auteurFilter.push({ label: `${val.createur_id.firstname} ${val.createur_id.lastname}`, value: val.createur_id._id })
          temp_createur_id.push(val.createur_id._id)
        }
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
    this.AuthService.getAll
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
  seeCV = false
  expandcv(cv) {
    this.seeCV = false
    this.CVService.downloadCV(cv.user_id._id).then(data => {
      if (data)
        this.seeCV = true
    })
  }
  downloadOldCV(cv: CV) {
    this.CVService.downloadCV(cv.user_id._id).then(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), 'cv.pdf')
    })
  }
  cvToUpdate;
  formUpdate = new UntypedFormGroup({
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
  formAdd = new UntypedFormGroup({
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
    this.AuthService.create({ ...this.formAdd.value, type: 'Prospect', }).subscribe(user => {
      this.CVService.postCv({ user_id: user._id, createur_id: this.token.id }).then(cv => {
        this.ToastService.add({ severity: 'success', summary: 'Création du cv avec succès.' })
        this.formAdd.reset()
        this.formAdd.patchValue({ civilite: 'Monsieur' })
        this.cvToAdd = false
        this.updateAllCVs()
      })
    })

  }

  activeIndex1 = 1
  handleClose(e) {
    this.matchingList.splice(e.index - 3)
    this.AuthService.update({ _id: this.token.id, savedMatching: this.matchingList }).subscribe(r => {

    })
  }





  profilFilter = [
    //{ label: "Choisissez un profil", value: null },
  ]
  typeFilter = [
    { label: 'Choisissez un Type', value: null },
  ]

  colorFilter = [
    { label: 'Rouge', value: 'red' },
    { label: 'Orange', value: 'orange' },
    { label: 'Vert', value: 'green' }
  ]
  ecoleFilter = [
    {
      label: "Espic", value: 'espic'
    },
    {
      label: "Studinfo", value: 'studinfo'
    },
    {
      label: "ADG Education", value: 'adg'
    },
    {
      label: "MedaSup", value: 'medasup'
    },
    {
      label: "BTECH", value: 'btech'
    },
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
  auteurFilter = []
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
    search: '',
    type: null,
    taux: '',
    createur_id: null,
    ecole: '',
  }
  updateFilter() {
    this.cvs = []
    this.defaultcvs.forEach((val: CV) => {
      let r = true
      let competences_ids = []
      let idsP = []
      let strprofile = ""
      val.competences.forEach(c => {
        competences_ids.push(c._id)
        idsP.push(c.profile_id?._id)
        strprofile = strprofile + c.profile_id?.libelle
      })
      if (this.filter_value.profil.length != 0 && (val.competences.length == 0 || !this.atleastOne(idsP, this.filter_value.profil)))
        r = false;
      if (this.filter_value.locations.length != 0 && (!val.mobilite_lieu || (!this.filter_value.locations.includes(val.mobilite_lieu) && !this.atleastOne(this.filter_value.locations, val.mobilite_lieu))))
        r = false
      if (this.filter_value.disponibilite && new Date(this.filter_value.disponibilite).getTime() > new Date(val.disponibilite).getTime())
        r = false
      if (this.filter_value.competences.length != 0) {
        if (competences_ids.length == 0 || !this.atleastOne(competences_ids, this.filter_value.competences))
          r = false
      }
      if (this.filter_value.niveau.length != 0 && (!this.filter_value.niveau.includes(val.niveau_etude))) {
        r = false
      }
      if (this.filter_value.search) {
        let name = `${val?.user_id?.lastname?.toLowerCase()} ${val?.user_id?.firstname?.toLowerCase()} ${val?.user_id?.firstname?.toLowerCase()} ${val?.user_id?.lastname?.toLowerCase()} ${val?.profil?.libelle}`
        if (!val?.a_propos?.toLowerCase().includes(this.filter_value.search.toLowerCase()) &&
          !val?.centre_interets?.toLowerCase().includes(this.filter_value.search.toLowerCase()) &&
          !val?.user_id?.lastname?.toLowerCase().includes(this.filter_value.search.toLowerCase()) &&
          !val?.user_id?.firstname?.toLowerCase().includes(this.filter_value.search.toLowerCase()) &&
          !val?.mobilite_lieu?.includes(this.filter_value.search.toLowerCase()) &&
          !name.includes(this.filter_value.search.toLowerCase()) &&
          !strprofile.toLowerCase().includes(this.filter_value.search.toLowerCase()))
          r = false
      }
      if (this.filter_value.taux) {
        if (this.filter_value.taux == 'red' && (val.taux > 10))
          r = false
        else if (this.filter_value.taux == 'orange' && (val.taux <= 10 || val.taux > 60))
          r = false
        else if (this.filter_value.taux == 'green' && (val.taux <= 60))
          r = false
      }
      if (this.filter_value.createur_id) {
        if (!val.createur_id)
          r = false
        else if (this.filter_value.createur_id == 'Candidat' && val.createur_id._id != val.user_id._id)
          r = false
        else if (this.filter_value.createur_id != 'Candidat' && this.filter_value.createur_id != val.createur_id._id)
          r = false
      }
      if (this.filter_value.ecole && this.filter_value.ecole != val.ecole)
        r = false
      //if(this.filter_value.type && !this.filter_value.type.includes(val))
      if (r)
        this.cvs.push(val)
    })
  }
  displayFilter = false
  clearFilter() {
    this.filter_value = {
      profil: [],
      locations: [],
      disponibilite: '',
      competences: [],
      niveau: [],
      winner: '',
      search: '',
      type: null,
      taux: '',
      createur_id: null,
      ecole: '',
    }
    this.cvs = this.defaultcvs
  }

  matchingList = []

  onLoadMatching(cv: CV) {
    let ids = []
    this.matchingList.forEach(u => {
      ids.push(u._id)
    })
    if (!ids.includes(cv._id)) {
      this.matchingList.push(cv)
      this.AuthService.update({ _id: this.token.id, savedMatching: this.matchingList }).subscribe(r => {
        this.activeIndex1 = 2 + this.matchingList.length
      })
    } else {
      this.activeIndex1 = ids.indexOf(cv._id) + 2
    }

  }

  cvList = []
  goToCV(cv: CV) {
    //localStorage.setItem('seeEditBTNCV', 'true')
    //this.router.navigate(['i-match/cv', cv._id])
    this.cvList.push({ label: "CV - " + cv?.user_id?.lastname + " " + cv?.user_id?.firstname, CV_ID: cv._id })
    setTimeout(() => {
      this.activeIndex1 = 2 + this.cvList.length + this.matchingList.length
    }, 5)

  }
  updateCVList = []

  updateCV(element) {
    this.updateCVList.push(element)
    setTimeout(() => {
      this.activeIndex1 = 2 + this.cvList.length + this.updateCVList.length + this.matchingList.length
    }, 1)
  }

  rdvList: { label: string, ID: string, offer_id: string }[] = []

  takeRDV(element) {
    this.rdvList.push(element)
    setTimeout(() => {
      this.activeIndex1 = 2 + this.cvList.length + this.updateCVList.length + this.matchingList.length + this.rdvList.length
    }, 1)
  }

  atleastOne(arr1, arr2) {
    let r = false
    arr1.forEach(val => {
      if (arr2.includes(val))
        r = true
    })
    return r
  }

  onPrinting() {
    this.cvToUpdate = null
  }


}
