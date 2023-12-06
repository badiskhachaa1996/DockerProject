import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { saveAs as importedSaveAs } from "file-saver";
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import mongoose from 'mongoose';
import { ConfigService } from 'src/app/dev-components/service-template/app.config.service';
@Component({
  selector: 'app-lead-dossier',
  templateUrl: './lead-dossier.component.html',
  styleUrls: ['./lead-dossier.component.scss']
})
export class LeadDossierComponent implements OnInit {
  documentsObligatoires = ['CV', "Pièce d'identité", "Dernier diplôme obtenu",
    "Relevés de note de deux dernières année"]
  ID = this.route.snapshot.paramMap.get('id');
  @Input() PROSPECT_ID
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService, private ToastService: MessageService, private ConfigService: ConfigService) { }
  resideFr = false
  alternance = false
  ngOnInit(): void {
    if (!this.ID)
      this.ID = this.PROSPECT_ID
    console.log(this.ID,this.PROSPECT_ID)
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(data => {
        this.PROSPECT = data
        console.log(this.PROSPECT)
        this.checkIfDossierComplet()
        if (!this.PROSPECT.etat_dossier)
          this.PROSPECT.etat_dossier = "En attente"
      })
  }

  downloadFile(doc: { date: Date, nom: String, path: String }) {
    this.ProspectService.downloadFile(this.PROSPECT._id, `${doc.nom}/${doc.path}`).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      importedSaveAs(new Blob([byteArray], { type: data.documentType }), doc.path)
    }, (error) => {
      console.error(error)
    })
  }
  docToUpload: { date: Date, nom: string, path: string, _id: string }
  initUpload(doc: { date: Date, nom: string, path: string, _id: string }, id = "selectedFile") {
    if (!this.docToUpload) {
      this.docToUpload = doc
      document.getElementById(id).click();
    } else
      this.ToastService.add({ severity: 'info', summary: 'Un autre fichier est entrain d\'être uploadé', detail: `${this.docToUpload} est en train d'être uploadé merci de patientez avant d'uploadé un autre fichier` })


  }

  uploadFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.PROSPECT._id);
    formData.append('document', `${this.docToUpload.nom}`);
    formData.append('file', event[0]);
    this.ProspectService.uploadFile(formData, this.PROSPECT._id).subscribe(res => {

      this.PROSPECT.documents_dossier.splice(this.PROSPECT.documents_dossier.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })
      this.ProspectService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }, "Affectation du dossier Lead-Dossier").subscribe(a => {
        this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
        this.docToUpload = null
        this.checkIfDossierComplet()
      })
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });
  }

  delete(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.PROSPECT.documents_dossier[this.PROSPECT.documents_dossier.indexOf(doc)].path = null
    this.ProspectService.deleteFile(this.PROSPECT._id, `${doc.nom}/${doc.path}`).subscribe(p => {
      this.ProspectService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }, "Suppresion d'un document du dossier Lead-Dossier").subscribe(a => {
        this.checkIfDossierComplet()
      })
    }, error => {
      console.error(error)
      this.ProspectService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }, "Suppresion d'un document du dossier Lead-Dossier").subscribe(a => {
        this.checkIfDossierComplet()
      })
    })

  }

  addDoc() {
    this.PROSPECT.documents_autre.push({ date: new Date(), nom: 'Cliquer pour modifier le nom du document ici', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  uploadOtherFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.PROSPECT._id);
    formData.append('document', `${this.docToUpload._id}`);
    formData.append('file', event[0]);
    this.ProspectService.uploadFile(formData, this.PROSPECT._id).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
      this.PROSPECT.documents_autre.splice(this.PROSPECT.documents_autre.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })

      this.ProspectService.updateV2({ documents_autre: this.PROSPECT.documents_autre, _id: this.PROSPECT._id }, "Ajout d'un document du dossier Lead-Dossier").subscribe(a => {
        this.docToUpload = null
      })
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });

  }
  deleteOther(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.PROSPECT.documents_autre.splice(this.PROSPECT.documents_autre.indexOf(doc), 1)
    this.ProspectService.updateV2({ documents_autre: this.PROSPECT.documents_autre, _id: this.PROSPECT._id }, "Suppresion d'un document autre Lead-Dossier").subscribe(a => {
      console.log(a)
    })
    this.ProspectService.deleteFile(this.PROSPECT._id, `${doc._id}/${doc.path}`).subscribe(p => {
      console.log(p)

    })
  }

  downloadOtherFile(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.ProspectService.downloadFile(this.PROSPECT._id, `${doc._id}/${doc.path}`).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      importedSaveAs(new Blob([byteArray], { type: data.documentType }), doc.path)
    }, (error) => {
      console.error(error)
    })
  }
  checkIfDossierComplet() {
    let r = false
    this.documentsObligatoires = ['CV', "Pièce d'identité", "Dernier diplôme obtenu",
      "Relevés de note de deux dernières année"]
    if (this.alternance)
      this.documentsObligatoires.push('Carte vitale ou attestation provisoire')

    if (!this.resideFr)
      this.documentsObligatoires.push('Test de niveau en Français - TCF ou DELF')

    this.PROSPECT.documents_dossier.forEach(val => {
      if (this.documentsObligatoires.includes(val.nom) && !val.path)
        r = true
    })
    if (r)
      this.PROSPECT.etat_dossier = 'Manquant'
    else
      this.PROSPECT.etat_dossier = 'Complet'
    this.ConfigService.emitChange(this.PROSPECT.etat_dossier);
  }


}
