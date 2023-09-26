import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Annonce } from 'src/app/models/Annonce';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';

@Component({
  selector: 'app-entreprise-list',
  templateUrl: './entreprise-list.component.html',
  styleUrls: ['./entreprise-list.component.scss', '../../../../../assets/css/bootstrap.min.css']
})
export class EntrepriseListComponent implements OnInit {

  form = new FormGroup({
    full_name: new FormControl('', Validators.required),
    email_adress: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    cv: new FormControl('', Validators.required)
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

  constructor(private skillsService: SkillsService, private annonceService: AnnonceService, private entrepriseService: EntrepriseService,) {}

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

    }

}
