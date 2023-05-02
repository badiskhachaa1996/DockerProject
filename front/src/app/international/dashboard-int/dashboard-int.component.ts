import { Component, OnInit } from '@angular/core';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-dashboard-int',
  templateUrl: './dashboard-int.component.html',
  styleUrls: ['./dashboard-int.component.scss']
})
export class DashboardIntComponent implements OnInit {



  filterPays = [
    { value: null, label: "Tous les pays" }
  ]
  filterFormation = [
    { value: null, label: "Toutes les formations" }
  ]
  filterSource = [
    { value: null, label: 'Tous les sources' }, { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Site web ESTYA", value: "Site web ESTYA" },
    { label: "Site web Ecole", value: "Site web" },
    { label: "Equipe communication", value: "Equipe communication" },
    { label: "Bureau Congo", value: "Bureau Congo" },
    { label: "Bureau Maroc", value: "Bureau Maroc" },
    { label: "Collaborateur interne", value: "Collaborateur interne" },
    { label: "Report", value: "Report" },
    { label: "IGE", value: "IGE" }
  ]
  filterRentree = [{ value: null, label: 'Toutes les rentrées scolaires' },]
  filterEcole = [{ value: null, label: 'Toutes les écoles"' },]
  filterCampus = [
    { value: null, label: "Tous les campus" },
    { value: "Paris - France", label: "Paris - France" },
    { value: "Montpellier - France", label: "Montpellier - France" },
    { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
    { value: "Rabat - Maroc", label: "Rabat - Maroc" },
    { value: "La Valette - Malte", label: "La Valette - Malte" },
    { value: "UAE - Dubai", label: "UAE - Dubai" },
    { value: "En ligne", label: "En ligne" },
  ]
  filterPhase = [
    { value: null, label: "Toutes les phases de candidature" },
    { value: 'Non affecté', label: "Non affecté" },
    { value: "En phase d'orientation scolaire", label: "En phase d'orientation scolaire" },
    { value: "En phase d'admission", label: "En phase d'admission" },
    { value: "En phase d'orientation consulaire", label: "En phase d'orientation consulaire" },
    { value: "Inscription définitive", label: "Inscription définitive" },
    { value: "Recours", label: "Recours" },
  ]

  source;
  rentree_scolaire;
  formation;
  dates;
  ecole;
  campus;
  pays;
  phase_candidature;

  stats = {
    tt_prospects: 0,
    tt_admis: 0,
    tt_paiements: 0,
    tt_visa: 0,
    tt_etudiants: 0,
    tt_orientation: 0,
    tt_admission: 0,
    tt_consulaire: 0,
  }
  constructor(private FAService: FormulaireAdmissionService) { }
  ngOnInit(): void {
    this.FAService.RAgetAll().subscribe(data => {
      data.forEach(d => this.filterRentree.push({ label: d.nom, value: d.nom }))
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.filterFormation.push({ label: d.nom, value: d.nom })
      })
    })
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(d => {
        this.filterEcole.push({ label: d.titre, value: d.url_form })
      })
    })
  }

  updateFilter() {

  }

}
