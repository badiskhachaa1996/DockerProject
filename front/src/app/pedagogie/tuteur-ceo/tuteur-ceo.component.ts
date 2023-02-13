import { Component, OnInit } from '@angular/core';
import { Entreprise } from 'src/app/models/Entreprise';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { TuteurService } from 'src/app/services/tuteur.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-tuteur-ceo',
  templateUrl: './tuteur-ceo.component.html',
  styleUrls: ['./tuteur-ceo.component.scss']
})
export class TuteurCeoComponent implements OnInit {

  loading:boolean = true;
  entreprises: Entreprise[] = [];
  tuteurs: Tuteur[] = [];
  tuteurToUpdate: Tuteur;
  showTuteursForEnterprise: boolean = false;

  //Déclaration 
  formAddTuteur: FormGroup;
  showFormAddTuteur = false;
  formUpdateTuteur: FormGroup;
  showFormUpdateTuteur = false;

  civiliteList = environment.civilite;
  nationList = environment.nationalites;
  paysList = environment.pays;

  // entreprise selectionné
  entrepriseSelected: Entreprise;

  token: any;
  
  constructor(private tuteurService: TuteurService, private router: Router, private messageService: MessageService, private entrepriseService: EntrepriseService, private userService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des classes
    this.onGetAllClasses();
    
    //initialisation du formulaire d'ajout de tuteur
    this.formAddTuteur = this.formBuilder.group({
      civilite: [this.civiliteList[0]],
      firstname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      lastname: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      indicatif: [''],
      phone: ['', [Validators.pattern("^[0-9+]+$")]],
      fonction: [''],
      anciennete: [''],
      niveau_formation: [''],
      email_perso: ['', [Validators.required, Validators.email]],
      numero_adresse: ['', [Validators.pattern("^[0-9+]+$")]],
      rue_adresse: ['', [Validators.pattern('[^0-9]+')]],
      postal_adresse: ['', [Validators.pattern("^[0-9+]+$")]],
      ville_adresse: ['', [Validators.pattern('[^0-9]+')]],
      pays_adresse: [this.paysList[76]],
      nationnalite: [this.nationList[0].value],
      date_naissance: ['']
    });

    // initialisation du formulaire de mise à jour d'un tuteur
    this.formUpdateTuteur = this.formBuilder.group({
      fonction: [''],
      anciennete: [''],
      niveau_formation: [''],
    });
  }


  // methode de recuperation de la liste des classes
  onGetAllClasses(): void
  {
    // recuperation de la liste des entreprises du CEO connecté
    this.entrepriseService.getEntreprisesByIdCEO(this.token.id)
    .then((response) => { this.entreprises = response; this.loading = false;})
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Entreprise', detail: error.error }); });
  }


  // methode d'ajout d'un nouveau tuteur
  onAddTuteur() {
    let civilite = this.formAddTuteur.get('civilite')?.value.value;
    let firstname = this.formAddTuteur.get('firstname')?.value;
    let lastname = this.formAddTuteur.get('lastname')?.value;
    let indicatif = this.formAddTuteur.get('indicatif')?.value;
    let phone = this.formAddTuteur.get('phone')?.value;
    let fonction = this.formAddTuteur.get('fonction')?.value;
    let entreprise = this.entrepriseSelected._id;
    let anciennete = this.formAddTuteur.get('anciennete')?.value;
    let niveau_formation = this.formAddTuteur.get('niveau_formation')?.value;
    let email_perso = this.formAddTuteur.get('email_perso')?.value
    let numero_adresse = this.formAddTuteur.get('numero_adresse')?.value;
    let rue_adresse = this.formAddTuteur.get('rue_adresse')?.value;
    let postal_adresse = this.formAddTuteur.get('postal_adresse')?.value;
    let ville_adresse = this.formAddTuteur.get('ville_adresse')?.value;
    let pays_adresse = this.formAddTuteur.get('pays_adresse')?.value;
    let nationnalite = this.formAddTuteur.get('nationnalite')?.value.value;
    let date_naissance = this.formAddTuteur.get('date_naissance')?.value;

    // recuperer sur le travail effectuer par slimane
    let newUser = new User(
      null,
      firstname,
      lastname,
      indicatif,
      phone,
      null,// email estya
      email_perso,
      null, //pdw
      'user',
      null, //etat
      null, //service_id
      civilite.value,
      null, //pathImageProfil
      null, //typeImageProfil
      'Tuteur',
      entreprise,
      pays_adresse.value,
      ville_adresse,
      rue_adresse,
      numero_adresse,
      postal_adresse,
      nationnalite,
      null,//verifedEmail
      null);//date creation

    let newTuteur = new Tuteur(
      entreprise,//entreprise id
      null, //user_id se gère dans le back
      fonction,
      anciennete,
      niveau_formation,
      date_naissance
    );

    this.tuteurService.create({ 'newTuteur': newTuteur, 'newUser': newUser }).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Tuteur', detail: 'Ajout reussie' });
        this.showFormAddTuteur = false;
        this.formAddTuteur.reset();
        this.onGetAllClasses();
      }),
      ((error) => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Tuteur', detail: "Ajout impossible, veuillez verifier les informations saisie, si le problème persiste contactez un administrateur, i.sall@intedgroup.com, m.hue@intedgroup.com" });
      })
    );
  }


  //récupération du tuteur à modifier
  onFillForm(tuteur: Tuteur) {
    this.tuteurToUpdate = tuteur;

    this.formUpdateTuteur.patchValue({
      fonction: tuteur.fonction,
      anciennete: tuteur.anciennete,
      niveau_formation: tuteur.niveau_formation,
    });
  }

  onUpdateTuteur() {
    let fonction = this.formUpdateTuteur.get('fonction').value;
    let anciennete = this.formUpdateTuteur.get('anciennete').value;
    let niveau_formation = this.formUpdateTuteur.get('niveau_formation').value;

    this.tuteurToUpdate.fonction          = fonction;
    this.tuteurToUpdate.anciennete        = anciennete;
    this.tuteurToUpdate.niveau_formation  = niveau_formation;

    this.tuteurService.updateById(this.tuteurToUpdate._id, this.tuteurToUpdate).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Tuteur', detail: 'Modifié avec succès' });
        this.onGetAllClasses();
        this.showFormUpdateTuteur = false;
        this.formUpdateTuteur.reset();
      }),
      ((error) => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Tuteur', detail: error.error });
      })

    );
  }


  // Methode de recuperation des alternants de l'entreprise
  onLoadTuteurs(entreprise: Entreprise): void
  {
    this.entrepriseSelected = entreprise;

    this.tuteurService.getAllByEntrepriseId(entreprise._id).subscribe({
      next: (response) => { 
        this.tuteurs = response; 
        console.log(this.tuteurs); 
        this.showTuteursForEnterprise = true; 
      },
      error: (error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Contrats', detail: error.error }); },
      complete: () => { console.log('Liste des contrats récuperé')}
    });
  }

}
