import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Formateur } from '../models/Formateur';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { FormateurService } from '../services/formateur.service';

@Component({
  selector: 'app-formateur',
  templateUrl: './formateur.component.html',
  styleUrls: ['./formateur.component.css']
})
export class FormateurComponent implements OnInit {

  formateurs: Formateur[] = [];

  formAddFormateur: FormGroup;
  showFormAddFormateur: boolean = false;

  formUpdateFormateur: FormGroup;
  showFormUpdateFormateur: boolean = false;
  formateurToUpdate: Formateur = new Formateur();
  idFormateurToUpdate: string;

  users: User[] = [];
  civiliteList = environment.civilite;
  statutList = [];
  typeContratList = [];
  prestataireList = [];
  affichePrestataire: string;

  constructor(private formateurService: FormateurService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    //Recuperation de la liste des formateurs
    this.formateurService.getAll().subscribe(
      (data) => { this.formateurs = data; },
      (error) => { console.log(error) }
    );

    //Initialisation du formulaire d'ajout de formateur
    this.onInitFormAddFormateur();

    //Initialisation du formulaire de modification de formateur
    this.onInitFormUpdateFormateur();

    //Tableau de liste de statuts
    this.statutList = [
      { label: '--- Statut ---', value: null },
      { label: 'Prestataire', value: 'Prestataire' },
      { label: 'Sous traitant', value: 'Sous traitant' },
      { label: 'Vacataire', value: 'Vacataire' }
    ];

    //Tableau de la liste des types de contrat
    this.typeContratList = [
      { label: '--- Type de contrat ---', value: null },
      { label: 'CDI', value: 'CDI' },
      { label: 'CDD', value: 'CDD' },
      { label: 'Prestation', value: 'Prestation' },
      { label: 'Vacation', value: 'Vacation' },
      { label: 'Sous-traitance', value: 'Sous-traitance' }
    ];

    //Tableau de liste des prestataire
    this.prestataireList = [
      { label: '--- Prestataire Entreprise ---', value: null },
      { label: 'EliteLabs', value: 'EliteLabs' },
      { label: 'Autre', value: 'Autre' }
    ];

  }

  //Methode d'initialisation du formulaire d'ajout de nouveau formateur
  onInitFormAddFormateur() {
    this.formAddFormateur = this.formBuilder.group({
      civilite: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      pays_adresse: ['', Validators.required],
      ville_adresse: ['', Validators.required],
      rue_adresse: ['', Validators.required],
      numero_adresse: ['', Validators.required],
      postal_adresse: ['', Validators.required],

      statut: ['', Validators.required],
      type_contrat: ['', Validators.required],
      taux_h: ['', Validators.required],
      taux_j: ['', Validators.required],
      isInterne: [false, Validators.required],
      prestataire_id: ['']
    });
  }


  //Methode d'ajout du nouveau formateur dans la base de données
  onAddFormateur() {
    //recupération des données du formulaire
    let civilite = this.formAddFormateur.get('civilite')?.value.value;
    let firstname = this.formAddFormateur.get('firstname')?.value;
    let lastname = this.formAddFormateur.get('lastname')?.value;
    let phone = this.formAddFormateur.get('phone')?.value;
    let email = this.formAddFormateur.get('email')?.value;
    let pays_adresse = this.formAddFormateur.get('pays_adresse')?.value;
    let ville_adresse = this.formAddFormateur.get('ville_adresse')?.value;
    let rue_adresse = this.formAddFormateur.get('rue_adresse')?.value;
    let numero_adresse = this.formAddFormateur.get('numero_adresse')?.value;
    let postal_adresse = this.formAddFormateur.get('postal_adresse')?.value;

    let statut = this.formAddFormateur.get('statut')?.value.value;
    let type_contrat = this.formAddFormateur.get('type_contrat')?.value.value;
    let taux_h = this.formAddFormateur.get('taux_h')?.value;
    let taux_j = this.formAddFormateur.get('taux_j')?.value;
    let isInterne = this.formAddFormateur.get('isInterne')?.value;
    let prestataire_id = this.formAddFormateur.get('prestataire_id')?.value.value;

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(null, firstname, lastname, phone, email, null, 'user', civilite, null,'formateur', null, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse);

    //création et envoie du nouvelle objet diplôme
    let newFormateur = new Formateur(null, '', statut, type_contrat, taux_h, taux_j, isInterne, prestataire_id);

    this.formateurService.create({ 'newUser': newUser, 'newFormateur': newFormateur }).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Ajout de formateur', detail: response.success });
        this.formateurService.getAll().subscribe(
          (data) => {
            this.formateurs = data;
          },
          (error) => { console.log(error) }
        );

        //this.router.navigate(['formateur']);
      }),
      ((error) => { console.log(error); })
    );

    this.showFormAddFormateur = false;
  }

  //Methode de recuperation du diplome à mettre à jour
  onGetbyId() {
    //Recuperation du formateur à modifier
    this.formateurService.getById(this.idFormateurToUpdate).subscribe(
      ((response) => 
      { 
        this.formateurToUpdate = response; 
        this.formUpdateFormateur.patchValue({statut: this.formateurToUpdate.statut, type_contrat: this.formateurToUpdate.type_contrat, isInterne: this.formateurToUpdate.isInterne, taux_h: this.formateurToUpdate.taux_h, taux_j: this.formateurToUpdate.taux_j});
      }),
      ((error) => { console.log(error); })
    );
  }

  //Methode d'initialisation du formulaire de modification de formateur
  onInitFormUpdateFormateur() {
    this.formUpdateFormateur = this.formBuilder.group({
      statut: ['', Validators.required],
      type_contrat: ['', Validators.required],
      taux_h: ['', Validators.required],
      taux_j: ['', Validators.required],
      isInterne: [false, Validators.required],
      prestataire_id: ['']
    });
  }

  //Methode d'ajout du nouveau formateur dans la base de données
  onUpdateFormateur() {

    //Mis à jour du formateur et envoi dans la base de données
    this.formateurToUpdate.statut = this.formUpdateFormateur.get('statut')?.value.value;
    this.formateurToUpdate.type_contrat = this.formUpdateFormateur.get('type_contrat')?.value.value;
    this.formateurToUpdate.taux_h = this.formUpdateFormateur.get('taux_h')?.value;
    this.formateurToUpdate.taux_j = this.formUpdateFormateur.get('taux_j')?.value;
    this.formateurToUpdate.isInterne = this.formUpdateFormateur.get('isInterne')?.value;
    this.formateurToUpdate.prestataire_id = this.formUpdateFormateur.get('prestataire_id')?.value.value;

    this.formateurService.updateById(this.formateurToUpdate).subscribe(
      (() => {
        this.messageService.add({ severity: 'success', summary: 'Modification de formateur', detail: 'Cet formateur a bien été modifié' });
        this.formateurService.getAll().subscribe(
          (data) => {
            this.formateurs = data;
          },
          (error) => { console.log(error) }
        );
      }),
      ((error) => { console.log(error); })
    );

    this.showFormUpdateFormateur = false;
  }


  onGetStatut() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formAddFormateur.get('statut').value.value;
  }

  onGetStatutToUpdate() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formUpdateFormateur.get('statut').value.value;
  }


}
