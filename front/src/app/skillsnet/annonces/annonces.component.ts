import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Annonce } from 'src/app/models/Annonce';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';

@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.scss']
})
export class AnnoncesComponent implements OnInit {

  annonces: Annonce[] = [];

  form: FormGroup;
  showForm: boolean = false;
  formUpdate: FormGroup;
  showFormUpdate: boolean = false;

  userConnected: User;
  annonceSelected: Annonce;

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

  token: any;

  constructor(private messageService: MessageService, private formBuilder: FormBuilder, private userService: AuthService, private annonceService: AnnonceService) { }

  ngOnInit(): void {
    //Decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    //Recuperation de l'utilisateur connecté
    this.userService.getInfoById(this.token.id).subscribe(
      ((response) => { 
        this.userConnected = response; 
      }),
      ((error) => { console.log(error); })
    );

    //Recuperation de la liste des annonces
    this.annonceService.getAnnonces()
    .then((response: Annonce[]) => {
      this.annonces = response;
    })
    .catch((error) => console.log(error));

    //Initialisation du formulaire d'ajout
    this.form = this.formBuilder.group({
      entreprise_name:                    [''],
      entreprise_ville:                   [''],
      entreprise_mail:                    [''],
      entreprise_phone_indicatif:         [''],
      entreprise_phone:                   [''],
      missionName:                        [''],
      profil:                             [this.profilsList[0]],
      competences:                        [''],
      workplaceType:                      [this.locationOptions[1]],
      missionDesc:                        [''],
      missionType:                        [this.missionTypes[0]],
      debut:                              [''],
      source:                             [''],
    });

    //Initialisation du formulaire de modification d'une annonce
    this.formUpdate = this.formBuilder.group({
      entreprise_name:                    [''],
      entreprise_ville:                   [''],
      entreprise_mail:                    [''],
      entreprise_phone_indicatif:         [''],
      entreprise_phone:                   [''],
      missionName:                        [''],
      profil:                             [this.profilsList[0]],
      competences:                        [''],
      workplaceType:                      [this.locationOptions[1]],
      missionDesc:                        [''],
      missionType:                        [this.missionTypes[0]],
      debut:                              [''],
      source:                             [''],
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
  onAddAnnonce(): void 
  {
    const annonce = new Annonce();

    annonce.user_id                   = this.token.id;
    annonce.missionType               = this.form.get('missionType')?.value.label;
    annonce.debut                     = this.form.get('debut')?.value;
    annonce.missionName               = this.form.get('missionName')?.value;
    annonce.missionDesc               = this.form.get('missionDesc')?.value;

    annonce.entreprise_name           = this.form.get('entreprise_name')?.value;
    annonce.entreprise_ville          = this.form.get('entreprise_ville')?.value;
    annonce.entreprise_mail           = this.form.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif          = this.form.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone          = this.form.get('entreprise_phone')?.value;

    annonce.profil                    = this.form.get('profil')?.value.label;
    annonce.competences               = [];
    annonce.workplaceType             = this.form.get('workplaceType')?.value.label;
    annonce.publicationDate           = new Date();

    this.form.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.label);
    });
    annonce.source                    = this.form.get('source')?.value;
    annonce.isClosed                  = false;

    //Envoi de l'annonce en BD
    this.annonceService.postAnnonce(annonce)
    .then((response) => {
      this.messageService.add({ severity: "success", summary: "L'annonce a été ajouté" })
      this.form.reset();

      //Recuperation de la liste des annonces
      this.annonceService.getAnnonces()
      .then((response: Annonce[]) => {
        this.annonces = response;
      })
      .catch((error) => console.log(error));
    })
    .catch((error) => { console.log(error); });

  }

  //Méthode de modification d'une annonce
  onUpdateAnnonce(): void
  {
    const annonce = new Annonce();

    annonce._id                       = this.annonceSelected._id;
    annonce.user_id                   = this.token.id;
    annonce.missionType               = this.formUpdate.get('missionType')?.value.label;
    annonce.debut                     = this.formUpdate.get('debut')?.value;
    annonce.missionName               = this.formUpdate.get('missionName')?.value;
    annonce.missionDesc               = this.formUpdate.get('missionDesc')?.value;

    annonce.entreprise_name           = this.formUpdate.get('entreprise_name')?.value;
    annonce.entreprise_ville          = this.formUpdate.get('entreprise_ville')?.value;
    annonce.entreprise_mail           = this.formUpdate.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif          = this.formUpdate.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone          = this.formUpdate.get('entreprise_phone')?.value;

    annonce.profil                    = this.formUpdate.get('profil')?.value.label;
    annonce.competences               = [];
    annonce.workplaceType             = this.formUpdate.get('workplaceType')?.value.label;
    annonce.publicationDate           = new Date();

    this.formUpdate.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.label);
    });
    annonce.source                    = this.formUpdate.get('source')?.value;
    annonce.isClosed                  = false;

    //Envoi de l'annonce en BD
    this.annonceService.putAnnonce(annonce)
    .then((response) => {
      this.messageService.add({ severity: "success", summary: "L'annonce a été modifier" })
      this.formUpdate.reset();
      this.showFormUpdate = false;

      //Recuperation de la liste des annonces
      this.annonceService.getAnnonces()
      .then((response: Annonce[]) => {
        this.annonces = response;
      })
      .catch((error) => console.log(error));
    })
    .catch((error) => { console.log(error); });
  }

  // methode de remplissage du formulaire de modification
  onFillForm()
  {
    this.formUpdate.patchValue({
      entreprise_name:              this.annonceSelected.entreprise_name,
      entreprise_ville:             this.annonceSelected.entreprise_ville,
      entreprise_mail:              this.annonceSelected.entreprise_mail,
      entreprise_phone_indicatif:   this.annonceSelected.entreprise_phone_indicatif,
      entreprise_phone:             this.annonceSelected.entreprise_phone,
      missionName:                  this.annonceSelected.missionName,
      // profil:                    { label: this.annonceSelected.profil },
      // competences:               this.annonceSelected.competences,
      workplaceType:                { label: this.annonceSelected.workplaceType },
      missionDesc:                  this.annonceSelected.missionDesc,
      missionType:                  { label: this.annonceSelected.missionType },
      debut:                        this.annonceSelected.debut,
      source:                       this.annonceSelected.source,
    });
  }


}
