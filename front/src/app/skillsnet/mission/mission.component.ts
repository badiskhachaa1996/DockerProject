import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";

import { ProductService } from '../../service/productservice';
import { SelectItem } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MissionService } from 'src/app/services/skillsnet/mission.service';
import { Mission } from 'src/app/models/Mission';
import { Entreprise } from 'src/app/models/Entreprise';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit {

  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;

  missions: Mission[] = [];
  entreprises: Entreprise[] = [];
  entreprisesList: any = [];
  form: FormGroup;
  showForm: boolean = false;

  profilsList: any = [
    { label: 'Développeur' },
    { label: 'Réseaux' },
    { label: 'Commercial' },
    { label: 'Comptable' },
    { label: 'Support' },
  ];

  //Initialiser à vide ensuite modifier dans le ngOnInit
  competencesList: any = [];

  selectedMulti: string[] = [];

  missionTypes: any = [
    { label: 'Stage' },
    { label: 'Alternance' },
    { label: 'Professionnalisation' },
    { label: 'CDD' },
    { label: 'CDI' }
  ];

  token: any;

  constructor(private formBuilder: FormBuilder, private userService: AuthService, private productService: ProductService, private entrepriseService: EntrepriseService, private missionService: MissionService) { }

  ngOnInit(): void {
    this.sortOptions = [
      {label: 'Price High to Low', value: '!price'},
      {label: 'Price Low to High', value: 'price'}
    ];

    //Decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => { 
        response.forEach((entreprise) => {
          this.entreprisesList.push({ label: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
        });
      }),
      ((error) => console.log(error))
    );

    //Recuperation de la liste des missions
    this.missionService.getMissions()
    .then((response: Mission[]) => {
      response.forEach((mission) => {
        this.missions.push(mission);
      })
    })
    .catch((error) => console.log(error));

    //Initialisation du formulaire d'ajout
    this.form = this.formBuilder.group({
      entreprise_id: [''],
      missionName: ['', Validators.required],
      profil: [this.profilsList[0], Validators.required],
      competences: ['', Validators.required],
      missionDesc: ['', Validators.required],
      type: [this.missionTypes[0], Validators.required],
      debut: [''],
    });

  }


  //Méthode d'ajout d'une mission
  onAddMission(): void {}


  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    } else {
        this.sortOrder = 1;
        this.sortField = value;
    }
  }

}
