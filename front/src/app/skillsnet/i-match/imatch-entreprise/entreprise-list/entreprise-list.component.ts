import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Annonce } from 'src/app/models/Annonce';
import { CV } from 'src/app/models/CV';
import { Competence } from 'src/app/models/Competence';
import { Entreprise } from 'src/app/models/Entreprise';
import { Matching } from 'src/app/models/Matching';
import { Profile } from 'src/app/models/Profile';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { ExterneSNService } from 'src/app/services/skillsnet/externe-sn.service';
import { MatchingService } from 'src/app/services/skillsnet/matching.service';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-entreprise-list',
  templateUrl: './entreprise-list.component.html',
  styleUrls: ['./entreprise-list.component.scss', '../../../../../assets/css/bootstrap.min.css']
})
export class EntrepriseListComponent implements OnInit {
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.France, CountryISO.Tunisia];

  civiliteList: any = [
    { label: 'Monsieur' },
    { label: 'Madame' },
    { label: 'Autre' },
  ];
  pdfSrc
  form = new FormGroup({
    civilite: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    email_perso: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required]),
    consent: new FormControl(false, Validators.required)
  })

  offres = []
  filteredOffres = []

  dicPicture = {}

  profiles = []
  skills = []

  locations = [
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

  annonces: Annonce[] = [];
  annonceSelected: Annonce;

  showDetails = false;

  showPostuler = false;

  constructor(private skillsService: SkillsService, private annonceService: AnnonceService,
    private entrepriseService: EntrepriseService, private cvService: CvService, private AuthService: AuthService,
    private ExterneService: ExterneSNService, private MatchingService: MatchingService, private ToastService: MessageService) { }

  ngOnInit(): void {

    // recuperation de la liste des classes
    this.onGetAllClasses();

  }

  researchValue = ""
  selectedProfiles = []
  selectedLocations = []
  dispoFilter = null
  selectedSkills = []


  updateFilter() {
    this.filteredOffres = []
    this.offres.forEach((offre: Annonce) => {
      let bufferUser: any = offre.entreprise_id
      let entreprise: Entreprise = bufferUser
      if (entreprise && (entreprise.r_sociale.toLowerCase().includes(this.researchValue.toLowerCase())))
        this.filteredOffres.push(offre)
      else if (offre.entreprise_name && offre.entreprise_name.includes(this.researchValue.toLowerCase()))
        this.filteredOffres.push(offre)
      else if (offre.missionName && offre.missionName.includes(this.researchValue.toLowerCase()))
        this.filteredOffres.push(offre)
      else if (offre.missionDesc && offre.missionDesc.includes(this.researchValue.toLowerCase()))
        this.filteredOffres.push(offre)
    })
    let newFiltered = []
    this.filteredOffres.forEach((offre: Annonce) => {
      let added = true

      if (this.selectedProfiles.length != 0) {
        let bufferProfil: any = offre.profil
        if (bufferProfil) {
          let profil: Profile = bufferProfil
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

      if (this.selectedLocations.length != 0) {
        this.selectedLocations.forEach(p => {
          if (!offre.entreprise_ville || !offre.entreprise_ville.includes(p))
            added = false;
        })
      }

      if (this.dispoFilter) {
        let db = new Date(this.dispoFilter)
        let df = new Date(this.dispoFilter)
        df.setMonth(df.getMonth() + 1)
        if (!(db <= new Date(offre.debut)))
          added = false;
      }

      if (this.selectedSkills.length != 0) {
        let tempSkill = []
        offre.competences.forEach((skill: any) => {
          tempSkill.push(skill.libelle)
        })
        if (!(this.selectedSkills.every(elem => tempSkill.includes(elem))))
          added = false;
      }

      if (added)
        newFiltered.push(offre)

    })
    this.filteredOffres = newFiltered
  }

  clearFilter() {
    this.filteredOffres = this.offres
    this.researchValue = ""
    this.selectedSkills = []
    this.selectedProfiles = []
    this.selectedLocations = []
  }

  // recuperation de toute les classes necessaire au fonctionnement du module
  onGetAllClasses(): void {

    //Recuperation de la liste des annonces
    this.annonceService.getAnnonces()
      .then((response: Annonce[]) => {
        response.forEach(offre => {
          this.offres.push(offre)
        })
        this.filteredOffres = this.offres
      })
      .catch((error) => console.error(error));

    this.skillsService.getCompetences().then((competences: Competence[]) => {
      competences.forEach(competence => {
        this.skills.push({ label: competence.libelle, value: competence.libelle })
      })
    })
    this.skillsService.getProfiles().then((profiles: Profile[]) => {
      profiles.forEach(profil => {
        this.profiles.push({ label: profil.libelle, value: profil._id })
      })
    })

  }
  uploadedFiles: any;
  onUpload(event: any) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.pdfSrc = reader.result as string;
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  onSubmit() {
    this.ExterneService.create({ ...this.form.value }, null).subscribe(externe => {
      if (this.uploadedFiles?.length != 0) {
        console.log(this.uploadedFiles)
        let formData = new FormData();

        formData.append('id', externe.user_id._id);
        formData.append('file', this.uploadedFiles);
        this.cvService.postCVBrute(formData)
          .then(() => {

          })
          .catch((error) => {
            console.error(error)
          });
      }

      let bufferExt: any = externe.user_id
      this.cvService.postCv({ user_id: externe.user_id._id, date_creation: new Date(), createur_id: bufferExt._id }).then(newCv => {
        this.MatchingService.create({
          offre_id: this.annonceSelected._id,
          matcher_id: externe.user_id._id,
          cv_id: newCv._id,
          type_matching: "Candidat",
          date_creation: new Date()
        }).subscribe(m => {
          this.ToastService.add({ severity: 'success', summary: "Matching crée", detail: 'Un compte a été crée, vos identifiants ont été envoyés sur votre adresse email' })
          this.form.reset();
          this.showPostuler = false;
        }, error => {
          console.error(error)
          this.ToastService.add({ severity: 'error', summary: "Matching déjà crée", detail: 'Un matching existe déjà entre vous et cette offre.' })
          this.form.reset();
          this.showPostuler = false;
        })
      })

    })

  }

  deleteDoc() {
    this.uploadedFiles = null
    this.pdfSrc = null
  }

}
