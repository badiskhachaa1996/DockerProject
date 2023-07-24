import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Conge } from 'src/app/models/Conge';
import { CongeService } from 'src/app/services/conge.service';
import { RhService } from 'src/app/services/rh.service';
import { saveAs } from 'file-saver';
import mongoose from 'mongoose';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { MailType } from 'src/app/models/MailType';
import { FileUpload } from 'primeng/fileupload';
import { HistoriqueEmail } from 'src/app/models/HistoriqueEmail';
import jwt_decode from "jwt-decode";

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

  showEmailView: boolean = false;
  formEmailPerso: FormGroup;
  formEmailType: FormGroup;
  mailDropdown: any[] = [];

  uploadFilePJ: {
    date: Date,
    nom: string,
    path: string,
    _id: string
  } = null;

  piece_jointes: any[] = [];
  mailTypeSelected: MailType;
  @ViewChild('fileInput') fileInput: FileUpload;
  historiqueEmails: HistoriqueEmail[] = []

  token: any;

  constructor(private emailTypeService: EmailTypeService, private formBuilder: FormBuilder, private congeService: CongeService, private rhService: RhService, private messageService: MessageService) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem('token'));

    // recuperation de la liste des collaborateurs
    this.rhService.getCollaborateurs()
    .then((response) => {
      response.forEach((collaborateur) => {
        let {user_id} = collaborateur;

        let userName = `${user_id.firstname} ${user_id.lastname}`;
        let userObj = {label: userName, value: user_id._id};
        this.collaborateursFilter.push(userObj);
      });
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de récupérer la liste des collaborateurs' }) });

    // recuperation de la liste des congés
    this.onGetConges();
    
    // initialisation du formulaire de modification d'une demande de congé
    this.formUpdateConge = this.formBuilder.group({
      type:             ['', Validators.required],
      other:            [''],
      debut:            ['', Validators.required],
      fin:              ['', Validators.required],
      nb_jour:          ['', Validators.required],
      motif:            ['', Validators.required],
      note:             ['', Validators.required],
      note_decideur:    ['', Validators.required],
    });

    // initialisation des formulaires d'envois de mails
    this.formEmailPerso = new FormGroup({
      objet: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      cc: new FormControl([]),
      send_from: new FormControl('', Validators.required)
    });

    this.formEmailType = new FormGroup({
      objet: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      cc: new FormControl([]),
      send_from: new FormControl('', Validators.required)
    });
  }


  // méthode de recuperation de la liste des congés
  onGetConges(): void
  {
    this.congeService.getAll()
    .then((response) => {
      this.conges = response;
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
    this.congeService.patchStatut(conge.statut, conge._id)
    .then((response) => {
      this.onGetConges();
      delete this.clonedConges[conge._id as string];
      this.messageService.add({ severity: 'success', summary: 'Conge', detail: 'Statut de la demande mis à jour' });
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Erreur système', detail: 'Impossible de mettre à jour le statut de la demande' }); });
  }

  onRowEditCancel(conge: Conge, index: number) {
    this.conges[index] = this.clonedConges[conge._id as string];
    delete this.clonedConges[conge._id as string];
  }
  //* fin

  // méthode de remplissage du formulaire de mise à jour d'une demande de congé
  onFillFormUpdate(conge: Conge): void
  {
    this.congeToUpdate = conge;

    if(conge.type_conge === "Autre motif")
    {
      this.showOtherTextArea = true;
    }

    this.formUpdateConge.patchValue({
      type:     conge.type_conge,
      other:    conge.other_motif,
      debut:    new Date(conge.date_debut),
      fin:      new Date(conge.date_fin),
      nb_jour:  conge.nombre_jours,
      motif:    conge.motif,
      note:             conge?.note,
      node_decideur:    conge?.note_decideur,
    });

    this.showFormUpdateConge = true;
  }

  // méthode qui affiche ou non le champs de saisie pour autres motif
  onShowOtherTextArea(event: any) {
    event.value == 'Autre motif' ? this.showOtherTextArea = true : this.showOtherTextArea = false;
  }

  // méthode de mise à jour d'une demande de congé
  onUpdateConge(): void
  {
    // recuperation des valeurs du formulaire
    const formValue = this.formUpdateConge.value;

    this.congeToUpdate.type_conge     = formValue.type;
    this.congeToUpdate.other_motif    = formValue.other;

    this.congeToUpdate.date_debut     = formValue.debut;
    this.congeToUpdate.date_fin       = formValue.fin;
    this.congeToUpdate.nombre_jours   = formValue.nb_jour;
    this.congeToUpdate.motif          = formValue.motif;
    this.congeToUpdate.note          = formValue.note;
    this.congeToUpdate.note_decideur          = formValue.note_decideur;

    this.congeService.putConge(this.congeToUpdate)
    .then(() => {
      this.formUpdateConge.reset();
      this.showFormUpdateConge = false;
      this.showOtherTextArea = false;
      this.messageService.add({ severity: 'success', summary: 'Congé', detail: "La demande à bien été modifié" });
      this.onGetConges();
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Congé', detail: 'Impossible de prendre en compte vos modifications' }); });
  }

  // méthode d'upload de fichier
  FileUploadPJ(event: [File]) {
    if (event != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('nom', this.uploadFilePJ.nom)
      formData.append('pj_id', this.uploadFilePJ._id)
      formData.append('path', event[0].name)
      formData.append('_id', this.mailTypeSelected?._id)
      formData.append('file', event[0])
      this.emailTypeService.uploadPJ(formData).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.piece_jointes[this.piece_jointes.indexOf(this.uploadFilePJ)].path = event[0].name
        this.uploadFilePJ = null;
        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  onAddPj() {
    this.piece_jointes.push({ date: new Date(), nom: "Téléverser le fichier s'il vous plaît", path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  // méthode d'initialisation de la vue envoi de mail
  onInitEmailView(conge: Conge): void
  {
    this.congeToUpdate = conge;

    this.emailTypeService.HEgetAllTo(this.congeToUpdate._id).subscribe(data => {
      this.historiqueEmails = data
    });

    this.emailTypeService.getAll().subscribe(data => {
      data.forEach(val => {
        this.mailDropdown.push({ label: val.email, value: val })
      })
    });

    this.showEmailView = true;
  }

  downloadPJFile(pj) {
    this.emailTypeService.downloadPJ(this.mailTypeSelected?._id, pj._id, pj.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      saveAs(blob, pj.path)
    }, (error) => {
      console.error(error)
    })
  }

  onUploadPJ(uploadFilePJ) {
    if (uploadFilePJ?.nom && uploadFilePJ.nom != 'Cliquer pour modifier le nom du document ici') {
      document.getElementById('selectedFile').click();
      this.uploadFilePJ = uploadFilePJ
    } else {
      this.messageService.add({ severity: 'error', summary: 'Vous devez d\'abord donner un nom au fichier avant de l\'upload' });
    }
  }

  onDeletePJ(ri) {
    delete this.piece_jointes[ri];
  }

  onEmailPerso() {

    const {user_id}: any = this.congeToUpdate;

    this.emailTypeService.sendPerso({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: user_id.email, send_from: this.formEmailPerso.value.send_from._id, pieces_jointes: this.piece_jointes, mailTypeSelected: this.mailTypeSelected }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.emailTypeService.HEcreate({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: this.congeToUpdate._id, send_from: this.formEmailPerso.value.send_from.email }).subscribe(data2 => {
        this.formEmailPerso.reset()
        this.historiqueEmails.push(data2)
        this.messageService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }

}
