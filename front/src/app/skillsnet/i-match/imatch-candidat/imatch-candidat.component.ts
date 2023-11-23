import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Annonce } from 'src/app/models/Annonce';
import { Competence } from 'src/app/models/Competence';
import { Profile } from 'src/app/models/Profile';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
@Component({
  selector: 'app-imatch-candidat',
  templateUrl: './imatch-candidat.component.html',
  styleUrls: ['./imatch-candidat.component.scss', '../../../../assets/css/bootstrap.min.css']
})
export class ImatchCandidatComponent implements OnInit {

  portail = "entreprise";

  form: UntypedFormGroup;

  showDeposerOffre = false;

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

  skills = []
  profiles = []

  selectedSkills = []


  constructor(private formBuilder: UntypedFormBuilder, private SkillService: SkillsService,
    private EntrepriseService: EntrepriseService, private AnnonceService: AnnonceService,
    private ToastService: MessageService, private router: Router) { }

  ngOnInit(): void {
    //Initialisation du formulaire d'ajout de CV
    this.form = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      company_email: ['', Validators.required],
      company_phone: ['', Validators.required],
      profile: ['', Validators.required],
      competences: [, Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      consent: [false, Validators.required],
    });

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

  submitForm() {
    this.EntrepriseService.createEntrepriseRepresentant({
      newEntreprise: {
        r_sociale: this.form.value.r_sociale,
        phone_ent: this.form.value.company_phone,
        email: this.form.value.company_email,
      },
      newRepresentant: new User(
        null,
        this.form.value.firstname,
        this.form.value.lastname,
        null,
        this.form.value.company_phone,
        null,
        this.form.value.company_email,
        null,
        'user',
        false,
        null,
        null,
        null,
        null,
        // 'Représentant',
        'CEO Entreprise',
      )
    }).subscribe((data) => {
      this.ToastService.add({ severity: 'success', summary: 'Votre entreprise a été rajouté ainsi que votre compte' })
      this.AnnonceService.postAnnonce(
        new Annonce(
          false, null, data.representant._id, null,
          new Date(this.form.value.start_date), null,
          this.form.value.description, data.entreprise._id,
          this.form.value.r_sociale,
          this.form.value.location,
          this.form.value.company_email,
          null, this.form.value.company_phone,
          this.form.value.profile,
          this.form.value.competences, null, null,
          new Date(),
          "iMatch", false, this.onGenerateID('EXT', "Alternance"), new Date()
        )).then(r => {
          this.ToastService.add({ severity: 'success', summary: 'Votre offre a été rajouté' })
          this.router.navigate(['/login'])
        })
    })
  }

  onGenerateID(profilLabel, contrat) {
    let label = profilLabel.replace(/[^A-Z]+/g, "");
    if (label == '')
      label = "UNK"
    let cont = "OC"
    if (contrat == "Alternance")
      cont = "OA"
    else if (contrat == "Stage")
      cont = "OS"
    let random = Math.random().toString(36).substring(5).toUpperCase();
    return label + cont + random
  }
}
