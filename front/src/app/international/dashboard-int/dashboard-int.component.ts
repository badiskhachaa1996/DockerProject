import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UIChart } from 'primeng/chart';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-int',
  templateUrl: './dashboard-int.component.html',
  styleUrls: ['./dashboard-int.component.scss']
})
export class DashboardIntComponent implements OnInit {

  @ViewChild('chart') chart: UIChart;

  filterPays = environment.pays
  filterFormation = [
  ]
  filterSource = [
    { label: "Partenaire", value: "Partenaire" },
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
  filterRentree = []
  filterEcole = []
  filterCampus = [
    { value: "Paris - France", label: "Paris - France" },
    { value: "Montpellier - France", label: "Montpellier - France" },
    { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
    { value: "Rabat - Maroc", label: "Rabat - Maroc" },
    { value: "La Valette - Malte", label: "La Valette - Malte" },
    { value: "UAE - Dubai", label: "UAE - Dubai" },
    { value: "En ligne", label: "En ligne" },
  ]
  filterPhase = [
    { value: 'Toutes les phases', label: null },
    { value: 'Non affecté', label: "Non affecté" },
    { value: "En phase d'orientation scolaire", label: "En phase d'orientation scolaire" },
    { value: "En phase d'admission", label: "En phase d'admission" },
    { value: "Paiements", label: "Paiements" }, //TODO
    { value: "En phase d'orientation consulaire", label: "En phase d'orientation consulaire" },
    { value: "Inscription définitive", label: "Inscription définitive" },
    //{ value: "Recours", label: "Recours" },
  ]

  source = [];
  rentree_scolaire = [];
  formation = [];
  dates = [null, null];
  ecole = [];
  campus = [];
  pays = [];
  phase_candidature = null;

  stats = {
    tt_prospects: 0,
    tt_admis: 0,
    tt_paiements: 0,
    tt_visa: 0,
    tt_etudiants: 0,
    tt_orientation: 0,
    tt_admission: 0,
    tt_consulaire: 0,
    recours: 0,
    nn_affecte: 0
  }
  stats_orientation = {
    contact: 0,
    non_contact: 0,
    joignable: 0,
    non_joignable: 0,
    valide: 0,
    non_valide: 0,
    oriente: 0,
    suspension: 0
  }
  stats_admission = {
    traite: 0,
    non_traite: 0,
    admissible: 0,
    non_admissible: 0,
    attente: 0,
  }
  stats_consulaire = {
    contacte: 0,
    non_contacte: 0,
    logement: 0
  }
  stats_paiements = {
    preinscription: {
      virement: 0,
      espece: 0,
      cheque: 0,
      lien: 0,
      compensation: 0,
      total: 0
    },
    inscription: {
      virement: 0,
      espece: 0,
      cheque: 0,
      lien: 0,
      compensation: 0,
      total: 0
    }
  }
  constructor(private FAService: FormulaireAdmissionService, private AService: AdmissionService, private ToastService: MessageService) { }
  ngOnInit(): void {
    this.FAService.RAgetAll().subscribe(data => {
      data.forEach(d => this.filterRentree.push({ label: d.nom, value: d.nom }))
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(d => {
        this.filterFormation.push({ label: d.nom, value: d.nom })
      })
      console.log(data, this.filterFormation)
    })
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(d => {
        this.filterEcole.push({ label: d.titre, value: d.url_form })
      })
    })
    this.ToastService.add({ severity: 'info', summary: "Chargement des statistiques en cours ..." })
    this.AService.getDataForDashboardInternationalBasique().subscribe(r => {
      this.stats = r.stats
      this.stats_admission = r.stats_admission
      this.stats_consulaire = r.stats_consulaire
      this.stats_orientation = r.stats_orientation
      this.stats_paiements = r.stats_paiements
      this.ToastService.add({ severity: 'success', summary: "Chargement des statistiques avec succès" })
      this.basicData.datasets[0].data = [this.stats.nn_affecte, this.stats.tt_orientation, this.stats.tt_admission, this.stats.tt_paiements, this.stats.tt_consulaire, this.stats.recours]
      this.chart.reinit();
    })
  }

  updateFilter() {
    let data = {
      source: this.source,
      rentree_scolaire: this.rentree_scolaire,
      formation: this.formation,
      url_form: this.ecole,
      date_1: this.dates[0],
      date_2: this.dates[1],
      campus: this.campus,
      pays: this.pays
    }
    this.ToastService.clear()
    this.ToastService.add({ severity: 'info', summary: "Chargement des statistiques en cours ..." })
    this.AService.getDataForDashboardInternational(data).subscribe(r => {
      this.stats_admission = r.stats_admission
      this.stats_consulaire = r.stats_consulaire
      this.stats_orientation = r.stats_orientation
      this.stats_paiements = r.stats_paiements
      this.ToastService.add({ severity: 'success', summary: "Chargement des statistiques avec succès" })
      this.basicData.datasets[0].data = [this.stats.nn_affecte, this.stats.tt_orientation, this.stats.tt_admission, this.stats.tt_paiements, this.stats.tt_consulaire, this.stats.recours]
      this.chart.reinit();
    })
  }

  horizontalOptions = {
    indexAxis: 'y',
    plugins: { legend: { labels: { color: '#495057' } } },
    scales: {
      x: {
        ticks: { color: '#495057' },
        grid: { color: '#ebedef' }
      },
      y: {
        ticks: { color: '#495057' },
        grid: { color: '#ebedef' }
      }
    }
  };

  basicData = {
    labels: ['Non affecté', 'Orientation', 'Admission', 'Paiements', 'Accompagnement consulaire', 'Recours'],
    datasets: [
      {
        label: 'Leads',
        backgroundColor: '#42A5F5',
        data: [0, 0, 0, 0, 0, 0]
      }
    ]
  };

}
