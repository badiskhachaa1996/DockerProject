import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Partenaire } from 'src/app/models/Partenaire';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { SupportMarketingService } from 'src/app/services/support-marketing.service';
import jwt_decode from "jwt-decode";
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { environment } from 'src/environments/environment';
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-dashboard-partenaire',
  templateUrl: './dashboard-partenaire.component.html',
  styleUrls: ['./dashboard-partenaire.component.scss']
})
export class DashboardPartenaireComponent implements OnInit {
  token;
  isResponsable = false
  PartenaireList: { label: string, value: string }[] = []
  PaysList: { label: string, value: string }[] = [
    { value: null, label: "Tous les pays" }
  ]
  RentreeScolaireList: { label: string, value: string }[] = [
    { value: null, label: 'Toutes les rentrées scolaires' }
  ]
  CommercialList: { label: string, value: string }[] = []
  PARTENAIRE: Partenaire;
  ID = this.route.snapshot.paramMap.get('id');

  RentreeScolaireSelected;
  PaysSelected;
  PartenaireSelected: string[];
  CommercialSelected: string[];


  constructor(private route: ActivatedRoute, private SMService: SupportMarketingService, private ToastService: MessageService, private PService: PartenaireService,
    private CService: CommercialPartenaireService, private FAService: FormulaireAdmissionService, private AService: AdmissionService) { }

  globalstats = {
    nb_partenaire: 0,
    anciennete: {
      nouveau: 0,
      ancien: 0
    },
    contribution: {
      actif: 0,
      non_actif: 0,
      occasionel: 0
    },
    etat_contrat: {
      pas_contrat: 0,
      en_cours: 0,
      signe: 0
    }
  }

  activitystats = {
    chiffre_affaire: 999,
    nb_prospects: 2578,
    nb_prospects_contact: 1231,
    nb_prospects_accepte: 1000,
    nb_prospects_preinscrits: 357,
    nb_visas: 1857,
    nb_inscrits: 1231,
    nb_alternants: 892,
    nb_contrats: 757,
    nb_chaumage: 5
  }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    if (this.ID) {
      this.PService.getById(this.ID).subscribe(data => {
        this.PARTENAIRE = data
      })
      this.CService.getAllByPartenaireID(this.ID).subscribe(data => {
        data.forEach(d => {
          let buffer: any = d.user_id //TODO problème d'affichage
          this.CommercialList.push({ label: buffer.lastname + " " + buffer.firstname, value: d._id })
        })
      })
    }
    else {
      this.isResponsable = true
    }
    this.PService.getAll().subscribe(data => {
      data.forEach(d => {
        this.PartenaireList.push({ label: d.nom, value: d._id })
      })
    })
    this.FAService.RAgetAll().subscribe(data => {
      data.forEach(d => this.RentreeScolaireList.push({ label: d.nom, value: d.nom }))
    })
    this.PaysList = this.PaysList.concat(environment.pays)
    this.onUpdateFilter()
  }

  onSelectCommercial(ids: []) {
    this.CommercialSelected = ids
    this.onUpdateFilter()
  }

  onSelectPartenaire(ids: []) {
    this.PartenaireSelected = ids
    this.onUpdateFilter()
  }

  onUpdateFilter() {
    let data = {}
    if (this.PaysSelected) data['pays'] = this.PaysSelected

    if (this.RentreeScolaireSelected) data['rentree_scolaire'] = this.RentreeScolaireSelected

    if (this.isResponsable) {
      //Charger les stats de tous les Partenaires
      if (this.PartenaireSelected && this.PartenaireSelected.length != 0) data['partenaire_id'] = this.PartenaireSelected
    } else {
      //Charger les stats de this.ID
      data['partenaire_id'] = [this.ID]
      if (this.CommercialSelected && this.CommercialSelected.length != 0) data['commercial_id'] = this.CommercialSelected
    }
    this.ToastService.clear()
    this.ToastService.add({ severity: 'info', summary: "Chargement des statistiques en cours ..." })
    this.AService.getDataForDashboardPartenaire(data).subscribe(stats => {
      this.ToastService.add({ severity: 'success', summary: "Chargement des statistiques avec succès" })
      this.globalstats = stats.globalstats
      this.activitystats = stats.activitystats
    })
  }

}
