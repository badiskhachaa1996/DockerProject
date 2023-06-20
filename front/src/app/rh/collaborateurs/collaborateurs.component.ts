import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { User } from 'src/app/models/User';
import { RhService } from 'src/app/services/rh.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collaborateurs',
  templateUrl: './collaborateurs.component.html',
  styleUrls: ['./collaborateurs.component.scss']
})
export class CollaborateursComponent implements OnInit {

  collaborateurs: Collaborateur[] = [];
  agents: any[] = [];
  collaborateurToUpdate: Collaborateur;
  collaborateurPersonalData: User; // information personnelles du collaborateur pour la mise à jour des données
  formAdd: FormGroup; // ajout du collaborateur
  showFormAdd: boolean = false;
  formUpdate: FormGroup; // mise à jour des infos collaborateur du collaborateur
  showFormUpdate: boolean = false;
  formUpdatePersonalInfo: FormGroup; // mise à jour des informations personnelles du collaborateur
  showFormUpdatePersonalInfo: boolean = false;

  // chargement des données du tableau
  loading: boolean = false;

  // liste de données
  localisationList: any[] = [
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

  contratList: any[] = [
    { label: 'Stage', value: 'Stage' },
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Prestation', value: 'Prestation' }
  ];

  statutList: any[] = [
    { label: 'Actif', value: 'Actif' },
    { label: 'Démission', value: 'Démission' },
    { label: 'Abandon poste', value: 'Abandon poste' },
    { label: 'Fin contrat', value: 'Fin contrat' },
  ];

  civiliteList: any[] = [
    { label: 'Monsieur', value: 'Monsieur' },
    { label: 'Madame', value: 'Madame' },
    { label: 'Autre', value: 'Autre' },
  ];

  constructor(private messageService: MessageService, private rhService: RhService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // recuperation de la liste des collaborateurs
    this.onGetCollaborateurs();
    
    // recuperation de la liste des agents
    this.rhService.getAgents()
    .then((response) => {
      this.agents = [];
      response.forEach((user: User) => {
        let userName = `${user?.lastname} ${user?.firstname}`;
        this.agents.push({label: userName, value: user._id});
      });
    })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des agents'}); });

    // initialisation du formulaire d'ajout
    this.formAdd = this.formBuilder.group({
      user_id:        ['', Validators.required],
      matricule:      [''],
      date_demarrage: [new Date()],
      date_naissance: [new Date()],
      localisation:   [''],
      intitule_poste: [''],
      contrat_type:   ['', Validators.required],
      statut:         [''],
      h_cra:          ['']
    });

    // initialisation du formulaire de mise à jour
    this.formUpdate = this.formBuilder.group({
      user_id:        ['', Validators.required],
      matricule:      [''],
      date_demarrage: [''],
      date_naissance: [''],
      localisation:   [''],
      intitule_poste: [''],
      contrat_type:   ['', Validators.required],
      statut:         [''],
      h_cra:          ['']
    });

    // initialisation du formulaire de lise à jour des informations personnelles du collaborateur
    this.formUpdatePersonalInfo = this.formBuilder.group({
      civilite: [''],
      firstname: [''],
      lastname: [''],
      indicatif: [''],
      phone: [''],
      email: [''],
      email_perso: [''],
      role: [''],
    });
  }

  // recuperation de la liste des collaborateurs
  onGetCollaborateurs(): void
  {
    this.rhService.getCollaborateurs()
    .then((response) => { this.collaborateurs = response; })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs'}); });
  }

  // méthode d'ajout du collaborateur
  onAdd(): void
  {
    // recuperation des données du formulaire
    const formValue = this.formAdd.value;
    
    // création du nouvel objet collaborateur
    const collaborateur =  new Collaborateur();
    collaborateur.user_id         = formValue.user_id;
    collaborateur.matricule       = formValue.matricule;
    collaborateur.date_demarrage  = formValue.date_demarrage;
    collaborateur.date_naissance  = formValue.date_naissance;
    collaborateur.localisation    = formValue.localisation;
    collaborateur.intitule_poste  = formValue.intitule_poste;
    collaborateur.contrat_type    = formValue.contrat_type;
    collaborateur.statut          = formValue.statut;
    collaborateur.h_cra           = formValue.h_cra;

    // envoi des données en base de données
    this.rhService.postCollaborateur(collaborateur)
    .then((response) => {
      this.messageService.add({severity: 'success', summary: 'Agents', detail: 'Collaborateur ajouté avec succès'});
      // recuperation de la liste des collaborateurs
      this.onGetCollaborateurs();
      // masque le formulaire de mise à jour
      this.showFormAdd = false;
    })
    .catch((error) => { this.messageService.add({severity: 'error', summary: 'Agents', detail: "Ajout impossible"}); });
  }

  // remplissage du formulaire de modification
  onFillForm(collaborateur: Collaborateur): void
  {
    this.collaborateurToUpdate = collaborateur;
    const {user_id} = collaborateur;

    this.formUpdate.patchValue({
      user_id: collaborateur.user_id._id,
      matricule: collaborateur.matricule,
      date_demarrage: new Date(collaborateur.date_demarrage),
      date_naissance: new Date(collaborateur.date_naissance),
      localisation: collaborateur.localisation,
      intitule_poste: collaborateur.intitule_poste,
      contrat_type: collaborateur.contrat_type,
      statut: collaborateur.statut,
      h_cra: collaborateur.h_cra,
    });

    // affichage du formulaire
    this.showFormUpdate = true;
  }

  // mise à jour des données collaborateur d'un collaborateur
  onUpdate(): void
  {
    // recuperation des données du formulaire
    const formValue = this.formUpdate.value;
    // affectations des données à la variable de mise à jour
    this.collaborateurToUpdate.user_id         = formValue.user_id;
    this.collaborateurToUpdate.matricule       = formValue.matricule;
    this.collaborateurToUpdate.date_demarrage  = formValue.date_demarrage;
    this.collaborateurToUpdate.date_naissance  = formValue.date_naissance;
    this.collaborateurToUpdate.localisation    = formValue.localisation;
    this.collaborateurToUpdate.intitule_poste  = formValue.intitule_poste;
    this.collaborateurToUpdate.contrat_type    = formValue.contrat_type;
    this.collaborateurToUpdate.statut          = formValue.statut;
    this.collaborateurToUpdate.h_cra           = formValue.h_cra;

    this.rhService.patchCollaborateurData(this.collaborateurToUpdate)
    .then((response) => {
      this.messageService.add({severity: 'success', summary: 'Collaborateur', detail: 'Collaborateur mis à jour avec succès'});
      this.showFormUpdate = false;
      // recuperation de la liste des collaborateurs
      this.onGetCollaborateurs();
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Collaborateur', detail: 'Impossible de mettre à jour le collaborateur' }); });
  }

  // remplissage du formulaire de mise à jour des informations personnelles
  onFillFormUpdatePersonalData(collaborateur: Collaborateur): void
  {
    this.collaborateurToUpdate = collaborateur;
    // recuperation des informations user du collaborateur;
    const {user_id} = collaborateur;
    this.collaborateurPersonalData = user_id;

    this.formUpdatePersonalInfo.patchValue({
      civilite:     { label: user_id?.civilite, value: user_id?.civilite },
      firstname:    user_id?.firstname,
      lastname:     user_id?.lastname,
      indicatif:    user_id?.indicatif,
      phone:        user_id?.phone,
      email:        user_id?.email,
      email_perso:  user_id?.email_perso,
      role:         user_id?.role,
    });
    // affichage du formulaire
    this.showFormUpdatePersonalInfo = true;
  }

  // mise à jour des informations personnelles du collaborateur
  onUpdatePersonalData(): void
  {
    const formValue = this.formUpdatePersonalInfo.value;
    this.collaborateurPersonalData.civilite     = formValue.civilite;
    this.collaborateurPersonalData.firstname    = formValue.firstname;
    this.collaborateurPersonalData.lastname     = formValue.lastname;
    this.collaborateurPersonalData.indicatif    = formValue.indicatif;
    this.collaborateurPersonalData.phone        = formValue.phone;
    this.collaborateurPersonalData.email        = formValue.email;
    this.collaborateurPersonalData.email_perso  = formValue.email_perso;
    this.collaborateurPersonalData.role         = formValue.role;

    // envoi des données en bases de données
    this.rhService.patchCollaborateurPersonalData(this.collaborateurPersonalData)
    .then((response) => {
      this.messageService.add({ severity: 'success', summary: 'Informations personnelles du collaborateur mis à jour avec succès' });
      this.showFormUpdatePersonalInfo = false;
      this.onGetCollaborateurs();
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Informations personnelles', detail: 'Impossible de mettre à jour les informations personnelles du collaborateur' }); });
  }

}
