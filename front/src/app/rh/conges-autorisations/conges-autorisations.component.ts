import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Conge } from 'src/app/models/Conge';
import { CongeService } from 'src/app/services/conge.service';
import { RhService } from 'src/app/services/rh.service';
import { saveAs } from 'file-saver';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { MailType } from 'src/app/models/MailType';
import { FileUpload } from 'primeng/fileupload';
import { HistoriqueEmail } from 'src/app/models/HistoriqueEmail';
import jwt_decode from "jwt-decode";
import { Table } from 'primeng/table';
import { Collaborateur } from 'src/app/models/Collaborateur';
@Component({
  selector: 'app-conges-autorisations',
  templateUrl: './conges-autorisations.component.html',
  styleUrls: ['./conges-autorisations.component.scss']
})
export class CongesAutorisationsComponent implements OnInit {

  conges: Conge[] = [];
  clonedConges: { [s: string]: Conge } = {};
  congeToUpdate: Conge;
  formUpdateConge: FormGroup;
  showFormUpdateConge: boolean = false;
  showOtherTextArea: boolean = false;

  filterStatut: any[] = [
    { label: 'En attente', value: 'En attente' },
    { label: 'Refusé', value: 'Refusé' },
    { label: 'Validé', value: 'Validé' },
  ];


  filterUrgent: any[] = [
    { label: 'Toutes les urgences', value: null },
    { label: 'Urgent', value: true },
    { label: 'Non Urgent', value: false },
  ];

  filterType: any[] = [
    { label: 'Congé payé', value: 'Congé payé' },
    { label: 'Congé sans solde', value: 'Congé sans solde' },
    { label: 'Absence maladie', value: 'Absence maladie' },
    { label: 'Télétravail', value: 'Télétravail' },
    { label: 'Départ anticipé', value: 'Départ anticipé' },
    { label: 'Autorisation', value: 'Autorisation' },
    { label: 'Autre motif', value: 'Autre motif' },
  ];

  congeTypeList: any[] = [
    { label: 'Congé payé', value: 'Congé payé' },
    { label: 'Congé sans solde', value: 'Congé sans solde' },
    { label: 'Absence maladie', value: 'Absence maladie' },
    { label: 'Télétravail', value: 'Télétravail' },
    { label: 'Départ anticipé', value: 'Départ anticipé' },
    { label: 'Autorisation', value: 'Autorisation' },
    { label: 'Autre motif', value: 'Autre motif' },
  ];

  collaborateursFilter: any[] = [];
  btnActions: MenuItem[] = [];
  token;
  constructor(private formBuilder: FormBuilder, private congeService: CongeService, private rhService: RhService, private messageService: MessageService) { }
  siteSelected = []

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
  dicCollab = []
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    // recuperation de la liste des collaborateurs
    this.rhService.getCollaborateurs()
      .then((response) => {
        response.forEach((collaborateur: Collaborateur) => {
          if (collaborateur.user_id) {
            let { user_id } = collaborateur;

            let userName = `${user_id.firstname} ${user_id.lastname}`;
            let userObj = { label: userName, value: user_id._id };
            this.collaborateursFilter.push(userObj);
            this.dicCollab[user_id._id] = collaborateur
          }

        });
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de récupérer la liste des collaborateurs' }) });

    // recuperation de la liste des congés
    this.onGetConges();

    // initialisation du formulaire de modification d'une demande de congé
    this.formUpdateConge = this.formBuilder.group({
      type: ['', Validators.required],
      other: [''],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
      nb_jour: ['', Validators.required],
      motif: ['', Validators.required],
      note_decideur: ['', Validators.required],
      urgent: [false, Validators.required]
    });
  }


  // méthode de recuperation de la liste des congés
  onGetConges(): void {
    this.congeService.getAll()
      .then((response) => {
        this.conges = [];
        response.forEach(c => {
          if (c.user_id)
            this.conges.push(c)
        })
        this.defaultConge = this.conges
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de récupérer la liste des congés' }) });
  }


  // méthode de téléchargement du justificatif lié à une demande de congé
  onDonwloadJustificatif(id: string): void {
    this.congeService.donwloadJustificatif(id)
      .then((response: Blob) => {
        let downloadUrl = window.URL.createObjectURL(response);
        saveAs(downloadUrl, `jusiticatif.${response.type.split('/')[1]}`);
        this.messageService.add({ severity: "success", summary: "Justificatif", detail: `Téléchargement réussi` });
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Justificatif", detail: `Impossible de télécharger le fichier` }); });
  }


  // méthode de suppression d'une demande de congé
  onDeleteConge(id: string): void {
    this.congeService.deleteConge(id)
      .then((response) => {
        this.messageService.add({ severity: "success", summary: "Congé", detail: "Démandé retirée" });
        this.onGetConges();
      })
      .catch((error) => { this.messageService.add({ severity: "error", summary: "Congé", detail: "Impossible de de retiter votre demande" }) });
  }


  //* Modification du statut de la demande
  onRowEditInit(conge: Conge) {
    this.clonedConges[conge._id as string] = { ...conge };
  }

  onRowEditSave(conge: Conge) {
    if (conge.statut == 'Validé' && !conge.valided_by) {
      conge.valided_by = this.token.id
      conge.valided_date = new Date()
    }
    this.congeService.putConge(conge)
      .then((response) => {
        this.onGetConges();
        delete this.clonedConges[conge._id as string];
        this.messageService.add({ severity: 'success', summary: 'Conge', detail: 'Statut de la demande mis à jour' });
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de mettre à jour le statut de la demande' }); });
  }

  onRowEditCancel(conge: Conge, index: number) {
    this.conges[index] = this.clonedConges[conge._id as string];
    this.defaultConge[index] = this.clonedConges[conge._id as string];
    delete this.clonedConges[conge._id as string];
  }
  //* fin

  // méthode de remplissage du formulaire de mise à jour d'une demande de congé
  onFillFormUpdate(conge: Conge): void {
    this.congeToUpdate = conge;

    if (conge.type_conge === "Autre motif") {
      this.showOtherTextArea = true;
    }

    this.formUpdateConge.patchValue({
      type: conge.type_conge,
      other: conge.other_motif,
      debut: new Date(conge.date_debut),
      fin: new Date(conge.date_fin),
      nb_jour: conge.nombre_jours,
      motif: conge.motif,
      note_decideur: conge?.note_decideur,
      urgent: conge?.urgent
    });

    this.showFormUpdateConge = true;
  }

  onFillFormCommentaire(conge: Conge): void {
    this.congeToUpdate = conge;

    this.formUpdateConge.patchValue({
      note_decideur: conge?.note_decideur,
    });

    this.showFormCommentaireConge = true;
  }

  // méthode qui affiche ou non le champs de saisie pour autres motif
  onShowOtherTextArea(event: any) {
    event.value == 'Autre motif' ? this.showOtherTextArea = true : this.showOtherTextArea = false;
  }
  showFormCommentaireConge = false
  // méthode de mise à jour d'une demande de congé
  onUpdateConge(): void {
    // recuperation des valeurs du formulaire
    const formValue = this.formUpdateConge.value;

    this.congeToUpdate.type_conge = formValue.type;
    this.congeToUpdate.other_motif = formValue.other;

    this.congeToUpdate.date_debut = formValue.debut;
    this.congeToUpdate.date_fin = formValue.fin;
    this.congeToUpdate.nombre_jours = formValue.nb_jour;
    this.congeToUpdate.motif = formValue.motif;
    if (this.congeToUpdate.note_decideur != formValue.note_decideur) {
      this.congeToUpdate.commented_by = this.token.id
      this.congeToUpdate.commented_date = new Date()
    }
    this.congeToUpdate.note_decideur = formValue.note_decideur;
    this.congeToUpdate.urgent = formValue.urgent
    this.congeService.putConge(this.congeToUpdate)
      .then(() => {
        this.formUpdateConge.reset();
        this.showFormUpdateConge = false;
        this.showFormCommentaireConge = false
        this.showOtherTextArea = false;
        this.messageService.add({ severity: 'success', summary: 'Congé', detail: "La demande à bien été modifié" });
        this.onGetConges();
      })
      .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Congé', detail: 'Impossible de prendre en compte vos modifications' }); });
  }
  @ViewChild('dt1') dt1: Table;
  filterCustomUrgent(e) {
    console.log(e)
    if (e == false)
      this.dt1.filter('', 'urgent', 'contains')
    else
      this.dt1.filter(true, 'urgent', 'equals')
  }
  defaultConge: Conge[] = []
  onFilterSite(site: string[]) {
    this.conges = []
    if (site.length != 0)
      this.defaultConge.forEach(c => {
        console.log(this.dicCollab[c.user_id._id], site)
        if (c.user_id && this.dicCollab[c.user_id._id])
          if (this.atleastOne(this.dicCollab[c.user_id._id]?.localisation, site))
            this.conges.push(c)
      })
    else
      this.conges = this.defaultConge
  }

  atleastOne(arr1: string[], arr2: string[]) {
    if (typeof arr1 != typeof ['qsdqdqsd'])
      arr1 = [arr1.toString()]
    if (typeof arr2 != typeof ['qsdqdqsd'])
      arr2 = [arr2.toString()]
    let r = false
    if (arr1) {
      arr1.forEach(val => {
        if (arr2.includes(val))
          r = true
      })
    }
    return r

  }
}
