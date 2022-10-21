import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";

import { MessageService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MissionService } from 'src/app/services/skillsnet/mission.service';
import { Mission } from 'src/app/models/Mission';
import { Entreprise } from 'src/app/models/Entreprise';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {

  missions: { mission: Mission, score: Number }[] = [];
  entreprises: Entreprise[] = [];
  entreprisesWithCEO: Entreprise[] = [];
  entreprisesList: any = [{ label: 'Veuillez choisir une entreprise', value: null }];
  form: FormGroup;
  showForm: boolean = false;

  userConnected: User;
  missionSelected: Mission;

  profilsList: any = [
    { label: '' },
    { label: 'Développeur' },
    { label: 'Réseaux' },
    { label: 'Commercial' },
    { label: 'Comptable' },
    { label: 'Support' },
  ];

  locationOptions = [
    {label: 'Distanciel'},
    {label: 'Présentiel'},
    {label: 'Alterné à définir'}
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

  tuteurs: Tuteur[] = [];
  token: any;

  constructor(private tuteurService: TuteurService, private router: Router, private route: ActivatedRoute, private messageService: MessageService, private formBuilder: FormBuilder, private userService: AuthService, private entrepriseService: EntrepriseService, private missionService: MissionService) { }

  ngOnInit(): void {
    //Decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    //Recuperation de l'utilisateur connecté
    this.userService.getInfoById(this.token.id).subscribe(
      ((response) => { this.userConnected = response; }),
      ((error) => { console.log(error); })
    );

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => { 
        response.forEach((entreprise) => {
          this.entreprisesList.push({ label: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
          this.entreprisesWithCEO[entreprise.directeur_id] = entreprise;
        });
      }),
      ((error) => console.log(error))
    );
    //Recuperation de la liste des missions
    this.missionService.getMissionFromCV(this.route.snapshot.paramMap.get('user_id'))
    .then((response) => {
      this.missions = response;
    })
    .catch((error) => console.log(error));

    //Récupération de la liste des tuteurs
    this.tuteurService.getAll().subscribe(
      ((response) => { 
        response.forEach((tuteur) => {
          this.tuteurs[tuteur.user_id] = tuteur;
        });
      }),
    )

    //Initialisation du formulaire d'ajout
    this.form = this.formBuilder.group({
      entreprise_id:    [''],
      missionName:      ['', Validators.required],
      profil:           [this.profilsList[0], Validators.required],
      competences:      ['', Validators.required],
      workplaceType:    [this.locationOptions[1], Validators.required],
      missionDesc:      ['', Validators.required],
      missionType:      [this.missionTypes[0], Validators.required],
      debut:            [''],
    });

  }


  //Methode qui servira à modifier le contenu de la liste de competences en fonction du profil
  chargeCompetence(event)
  {
    const label = event.value.label;

    if(label == "Développeur")
    {
      this.competencesList = [
        { label: "PHP" },
        { label: "HTML 5" },
        { label: "CSS 3" },
        { label: "Java" },
      ];
    } 
    else if(label == "Réseaux")
    {
      this.competencesList = [
        { label: "TCP IP" },
        { label: "Ip config" },
        { label: "DHCP" },
        { label: "DNS" },
      ];
    }
  }

}
