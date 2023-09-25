import { Component, OnInit } from '@angular/core';
import { CampusService } from 'src/app/services/campus.service';
import { ClasseService } from 'src/app/services/classe.service';
import { EcoleService } from 'src/app/services/ecole.service';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { DiplomeService } from 'src/app/services/diplome.service';
import { AuthService } from 'src/app/services/auth.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-dashboard-alternance',
  templateUrl: './dashboard-alternance.component.html',
  styleUrls: ['./dashboard-alternance.component.scss']
})
export class DashboardAlternanceComponent implements OnInit {

  dropDownCommecialList = [];
  dropDownAnnee: any[] = [
    { label: "2021-2022"},
    { label: "2022-2023"},
    { label: '2023-2024' },
    { label: '2024-2025' },
    { label: '2025-2026' },
  ];

  filtreEcole = [
    { label : "Choissisez une école", value: null }
  ];

  filtreCampus = [
    { value: null, label: "Campus" }
  ];
  formationList = []
  myFormationList = {}
  dropdownCFA = [];
  ListeContrats: ContratAlternance[] = []
  campusFiltered: User;
  showFilterByCampus: boolean = false;

  listeContratsFiltredByCommercial: ContratAlternance[] = [];
  listeContratsFiltredByCampus: ContratAlternance[] =[];
  constructor(
    private etudiantService: EtudiantService,
    private authService: AuthService, 
    public classeService: ClasseService,
    private formationService: DiplomeService, 
    private EcoleService: EcoleService,
    private campusService: CampusService) { }

  ngOnInit(): void {
    this.campusService.getAll().subscribe(campus => {
      campus.forEach(c => {
        this.filtreCampus.push({ label: c.libelle, value: c._id })
      })
    })

    //Lister toutes les formations
    this.formationService.getAll().subscribe(data => {

      data.forEach(element => {
        this.formationList.push({ label: element.titre, value: element._id });
        this.myFormationList[element._id] = element;
      });
    })

    this.EcoleService.getAll().subscribe(data => {
      data.forEach(e => {
        this.dropdownCFA.push({ value: e._id, label: e.libelle })
        this.filtreEcole.push({ value: e._id, label: e.libelle })
      })
    })
  }
  onFilterByCampus(event: any): void {
    console.log(event)
    // on vide le tableau avant de le remplir
    this.listeContratsFiltredByCampus = [];
    // Parcourt la liste des contrats pour récupérer les contrats avec l'id du commercial filtré
    this.ListeContrats.forEach((contrat) => {
      let { code_commercial }: any = contrat;
      this.campusFiltered = code_commercial;
      if (code_commercial._id == event.value) {
        this.listeContratsFiltredByCampus.push(contrat);
      }
    });
    this.showFilterByCampus = true;
  }

}
