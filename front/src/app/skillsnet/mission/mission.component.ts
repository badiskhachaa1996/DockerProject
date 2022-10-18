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

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit {

  missions: Mission[] = [];
  entreprises: Entreprise[] = [];
  entreprisesList: any = [{ label: 'Veuillez choisir une entreprise', value: null }];
  form: FormGroup;
  showForm: boolean = false;

  profilsList: any = [
    { label: '' },
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

  constructor(private messageService: MessageService, private formBuilder: FormBuilder, private userService: AuthService, private entrepriseService: EntrepriseService, private missionService: MissionService) { }

  ngOnInit(): void {
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
      this.missions = response;
    })
    .catch((error) => console.log(error));

    //Initialisation du formulaire d'ajout
    this.form = this.formBuilder.group({
      entreprise_id:    [''],
      missionName:      ['', Validators.required],
      profil:           [this.profilsList[0], Validators.required],
      competences:      ['', Validators.required],
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


  //Méthode d'ajout d'une mission
  onAddMission(): void 
  {
    const mission = new Mission();

    mission.missionType   = this.form.get('missionType')?.value.label;
    mission.debut         = this.form.get('debut')?.value;
    mission.missionName   = this.form.get('missionName')?.value;
    mission.missionDesc   = this.form.get('missionDesc')?.value;
    mission.entreprise_id = this.form.get('entreprise_id')?.value.value;
    mission.profil        = this.form.get('profil')?.value.label;
    mission.competences   = [];
    this.form.get('competences')?.value.forEach((competence) => {
      mission.competences.push(competence.label);
    });
    mission.isClosed      = false;

    //Envoi de la mission en BD
    this.missionService.postMission(mission)
    .then((response) => {
      this.messageService.add({ severity: "success", summary: "La mission a été ajouté" })
      this.form.reset();

      //Recuperation de la liste des missions
      this.missionService.getMissions()
      .then((response: Mission[]) => {
        this.missions = response;
      })
      .catch((error) => console.log(error));
    })
    .catch((error) => { console.log(error); });

  }
  

}
