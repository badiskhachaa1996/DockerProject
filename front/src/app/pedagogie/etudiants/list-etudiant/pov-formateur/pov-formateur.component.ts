import { Component, OnInit } from '@angular/core';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { ClasseService } from 'src/app/services/classe.service';
import { CampusService } from 'src/app/services/campus.service';
@Component({
  selector: 'app-pov-formateur',
  templateUrl: './pov-formateur.component.html',
  styleUrls: ['./pov-formateur.component.scss']
})
export class PovFormateurComponent implements OnInit {

  etudiants = []
  token;
  constructor(private EtudiantService: EtudiantService, private router: Router, private classeService: ClasseService, private campusService: CampusService) { }

  filterAnneeScolaire = [
    { value: null, label: "Toutes les années" },
    { value: "2020-2021", label: "2020-2021" },
    { value: "2021-2022", label: "2021-2022" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
  ]

  typeEtudiant = [
    { label: "Tout types d'étudiants", value: null },
    { label: "Alternant", value: true },
    { label: "Initial", value: false }
  ]

  searchClass = []
  filterCampus = []
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    if (this.token)
      this.EtudiantService.getAllByFormateur(this.token.id).subscribe(etudiants => {
        this.etudiants = etudiants
      })
    this.onGetAllClasses()
  }

  onGetAllClasses() {
    this.searchClass = [{ label: 'Toutes les groupes', value: null }];

    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.searchClass.push({ label: classe.abbrv, value: classe._id });
        })
      }),
      ((error) => { console.error(error); })
    );
    this.filterCampus = [{ label: "Tout les campus", value: null }]
    this.campusService.getAllPopulate().subscribe(data => {
      data.forEach(c => {
        this.filterCampus.push({ value: c._id, label: c.libelle })
      })
    })
  }

}
