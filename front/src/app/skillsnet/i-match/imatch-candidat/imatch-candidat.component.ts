import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Competence } from 'src/app/models/Competence';
import { Profile } from 'src/app/models/Profile';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';

@Component({
  selector: 'app-imatch-candidat',
  templateUrl: './imatch-candidat.component.html',
  styleUrls: ['./imatch-candidat.component.scss', '../../../../assets/css/bootstrap.min.css']
})
export class ImatchCandidatComponent implements OnInit {

  portail = "entreprise";

  form: FormGroup;

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


  constructor(private formBuilder: FormBuilder,private SkillService: SkillsService, ) { }

  ngOnInit(): void {
        //Initialisation du formulaire d'ajout de CV
        this.form = this.formBuilder.group({
          company_name: ['', Validators.required],
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

        console.log(this.skills)
        console.log(this.profiles)
  }

}
