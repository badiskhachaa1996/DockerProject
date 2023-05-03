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

@Component({
  selector: 'app-dashboard-partenaire',
  templateUrl: './dashboard-partenaire.component.html',
  styleUrls: ['./dashboard-partenaire.component.scss']
})
export class DashboardPartenaireComponent implements OnInit {
  token;
  isResponsable = false
  PartenaireList: { label: string, value: Partenaire }[]
  PaysList: { label: string, value: string }[]
  RentreeScolaireList: { label: string, value: string }[]
  CommercialList: { label: string, value: string }[]
  PartenaireSelected: Partenaire;
  ID = this.route.snapshot.paramMap.get('id');
  filterRentreeScolaire = [
    { value: null, label: 'Toutes les rentrées scolaires' }
  ]
  filterPays = [
    { value: null, label: "Tous les pays" }
  ]
  constructor(private route: ActivatedRoute, private SMService: SupportMarketingService, private ToastService: MessageService, private PService: PartenaireService,
    private CService: CommercialPartenaireService, private FAService: FormulaireAdmissionService) { }

  globalstats = {
    nb_partenaire: 1563,
    anciennete: {
      nouveau: 85,
      ancien: 1478
    },
    contribution: {
      actif: 1510,
      non_actif: 30,
      occasionel: 22
    },
    etat_contrat: {
      pas_contrat: 421,
      en_cours: 932,
      signe: 210
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
        this.PartenaireSelected = data
      })
      this.CService.getByUserId(this.token.id).subscribe(data => {
        this.isResponsable = data.isAdmin
      })
    }
    else {
      this.isResponsable = true
    }
    this.PService.getAll().subscribe(data => {
      this.PartenaireList = [{ label: "Tous les Partenaires", value: null, }]
      data.forEach(d => {
        this.PartenaireList.push({ label: d.nom, value: d })
      })
    })
    this.FAService.RAgetAll().subscribe(data => {
      data.forEach(d => this.filterRentreeScolaire.push({ label: d.nom, value: d.nom }))
    })
    this.filterPays = this.filterPays.concat(environment.pays)
  }

}
