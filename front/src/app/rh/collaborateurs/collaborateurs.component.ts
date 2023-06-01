import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collaborateurs',
  templateUrl: './collaborateurs.component.html',
  styleUrls: ['./collaborateurs.component.scss']
})
export class CollaborateursComponent implements OnInit {

  showFormAdd: boolean = false;

  // chargement des données du tableau
  loading: boolean;

  // liste de données
  civiliteList: any[] = [];
  localisationList: any[] = [];
  serviceList: any[] = [];
  contratList: any[] = [];
  statutList: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // initialisation des données
    this.loading = false;
    this.civiliteList = environment.civilite;
    this.localisationList = [
      { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
      { label: 'Paris - Louvre', value: 'Paris - Louvre' },
      { label: 'Montpellier', value: 'Montpellier' },
      { label: 'Dubaï', value: 'Dubaï' },
      { label: 'Congo', value: 'Congo' },
      { label: 'Maroc', value: 'Maroc' },
      { label: 'Tunis M1', value: 'Tunis M1' },
      { label: 'Tunis M4', value: 'Tunis M4' },
      { label: 'Autre', value: 'Autre' },
    ];
    this.contratList = [
      { label: 'Stage', value: 'Value' },
      { label: 'CDI', value: 'CDI' },
      { label: 'CDD', value: 'CDD' },
      { label: 'Alternant', value: 'Alternant' },
      { label: 'Prestation', value: 'Prestation' },
    ];
    this.statutList = [
      { label: 'Actif', value: 'Actif' },
      { label: 'Démission', value: 'Démission' },
      { label: 'Abandon poste', value: 'Abandon poste' },
      { label: 'Fin contrat', value: 'Fin contrat' },
    ];
  }

  //TODO: Ajouter la mention dans service

}
