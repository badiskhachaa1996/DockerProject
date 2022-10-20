import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entreprise } from 'src/app/models/Entreprise';
import { Mission } from 'src/app/models/Mission';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { TuteurService } from 'src/app/services/tuteur.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { MissionService } from 'src/app/services/skillsnet/mission.service';
import { log } from 'console';
import { Tuteur } from 'src/app/models/Tuteur';


@Component({
  selector: 'app-mes-missions',
  templateUrl: './mes-missions.component.html',
  styleUrls: ['./mes-missions.component.scss']
})
export class MesMissionsComponent implements OnInit {

  missions: Mission[] = [];
  entreprises: Entreprise[] = [];
  entreprisesWithCEO: Entreprise[] = [];
  entreprisesList: any = [{ label: 'Veuillez choisir une entreprise', value: null }];
  form: FormGroup;
  showForm: boolean = false;
  formUpdate: FormGroup;
  showFormUpdate: boolean = false;

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

  constructor(private tuteurService: TuteurService, private router: Router, private messageService: MessageService, private formBuilder: FormBuilder, private userService: AuthService, private entrepriseService: EntrepriseService, private missionService: MissionService) { }

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

    //Recuperation de la liste des missions de ce utilisateur
    this.missionService.getMissionsByUserId(this.token.id)
    .then((response: Mission[]) => {
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


    //Initialisation du formulaire d'ajout d'une mission
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

    //Initialisation du formulaire de modification d'une mission
    this.formUpdate = this.formBuilder.group({
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


  //Méthode d'ajout d'une mission
  onAddMission(): void 
  {
    const mission = new Mission();

    mission.user_id         = this.token.id;
    mission.missionType     = this.form.get('missionType')?.value.label;
    mission.debut           = this.form.get('debut')?.value;
    mission.missionName     = this.form.get('missionName')?.value;
    mission.missionDesc     = this.form.get('missionDesc')?.value;

    //Si l'utilisateur est rattaché à une entreprise: tuteur ou representant, l'entreprise id de la mission sera l'entreprise id de l'utilisateur
    if(this.userConnected.type == 'CEO Entreprise')
    {
      mission.entreprise_id = this.entreprisesWithCEO[this.userConnected._id]._id;
    } 
    else if (this.userConnected.type == 'Tuteur')
    {
      mission.entreprise_id = this.tuteurs[this.userConnected._id].entreprise_id;
    }
    else 
    {
      mission.entreprise_id   = this.form.get('entreprise_id')?.value.value;
    }
    

    mission.profil          = this.form.get('profil')?.value.label;
    mission.competences     = [];
    mission.workplaceType   = this.form.get('workplaceType')?.value.label;
    mission.publicationDate = new Date();
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


  //Méthode de modification d'une mission
  onUpdateMission(): void 
  {
    const mission = new Mission();

    mission._id             = this.missionSelected._id;
    mission.user_id         = this.missionSelected.user_id;
    mission.missionType     = this.formUpdate.get('missionType')?.value.label;
    mission.debut           = this.formUpdate.get('debut')?.value;
    mission.missionName     = this.formUpdate.get('missionName')?.value;
    mission.missionDesc     = this.formUpdate.get('missionDesc')?.value;

    //Si l'utilisateur est rattaché à une entreprise: tuteur ou representant, l'entreprise id de la mission sera l'entreprise id de l'utilisateur
    if(this.userConnected.type == 'CEO Entreprise' || this.userConnected.type == 'Tuteur')
    {
      mission.entreprise_id = this.missionSelected.entreprise_id;
    } 
    else 
    {
      mission.entreprise_id = this.formUpdate.get('entreprise_id')?.value.value;
    }
    

    mission.profil          = this.formUpdate.get('profil')?.value.label;
    mission.competences     = [];
    mission.workplaceType   = this.formUpdate.get('workplaceType')?.value.label;
    mission.publicationDate = new Date();
    this.formUpdate.get('competences')?.value.forEach((competence) => {
      mission.competences.push(competence.label);
    });
    mission.isClosed      = this.missionSelected.isClosed;

    //Envoi de la mission en BD
    this.missionService.putMission(mission)
    .then((response) => {
      this.messageService.add({ severity: "success", summary: "La mission a été modifier" })
      this.formUpdate.reset();

      //Recuperation de la liste des missions
      this.missionService.getMissions()
      .then((response: Mission[]) => {
        this.missions = response;
      })
      .catch((error) => console.log(error));
    })
    .catch((error) => { console.log(error); });

  }


  //Methode de redirection vers la page des missions de mon entreprise
  onGoToEntrepriseMissions() 
  {
    this.router.navigate(['/entreprise-missions']);
  }

  onFillForm()
  {
    this.formUpdate.patchValue({
      entreprise_id:    { label: this.entreprises[this.missionSelected.entreprise_id].r_sociale, value: this.missionSelected.entreprise_id },
      missionName:      this.missionSelected.missionName,
      // profil:           { label: this.missionSelected.profil },
      // competences:      this.missionSelected.competences,
      workplaceType:    { label: this.missionSelected.workplaceType },
      missionDesc:      this.missionSelected.missionDesc,
      missionType:      { label: this.missionSelected.missionType },
      debut:            this.missionSelected.debut,
    });
  }

}
