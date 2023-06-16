import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { saveAs as importedSaveAs } from "file-saver";
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import mongoose from 'mongoose';
@Component({
  selector: 'app-lead-dossier',
  templateUrl: './lead-dossier.component.html',
  styleUrls: ['./lead-dossier.component.scss']
})
export class LeadDossierComponent implements OnInit {

  ID = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService, private ToastService: MessageService) { }

  ngOnInit(): void {
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(data => {
        this.PROSPECT = data
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
    this.docToUpload = doc
    document.getElementById(id).click();
  }

  uploadFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.PROSPECT._id);
    formData.append('document', `${this.docToUpload.nom}`);
    formData.append('file', event[0]);
    this.ProspectService.uploadFile(formData, this.PROSPECT._id).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
      this.PROSPECT.documents_dossier.splice(this.PROSPECT.documents_dossier.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })
      this.ProspectService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }).subscribe(a => {
        console.log(a)
      })
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });
  }

  delete(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.PROSPECT.documents_dossier.splice(this.PROSPECT.documents_dossier.indexOf(doc), 1)
    this.ProspectService.deleteFile(this.PROSPECT._id, `${doc.nom}/${doc.path}`).subscribe(p => {
      this.ProspectService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }).subscribe(a => {
        console.log(a)
      })
    })

  }

  addDoc() {
    this.PROSPECT.documents_autre.push({ date: new Date(), nom: '', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  uploadOtherFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.PROSPECT._id);
    formData.append('document', `${this.docToUpload.nom}`);
    formData.append('file', event[0]);
    this.ProspectService.uploadFile(formData, this.PROSPECT._id).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
      this.PROSPECT.documents_autre.splice(this.PROSPECT.documents_autre.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })

      this.ProspectService.updateV2({ documents_autre: this.PROSPECT.documents_autre, _id: this.PROSPECT._id }).subscribe(a => {
        console.log(a)
      })
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });

  }
  deleteOther(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.PROSPECT.documents_autre.splice(this.PROSPECT.documents_autre.indexOf(doc), 1)
    this.ProspectService.deleteFile(this.PROSPECT._id, `${doc.nom}/${doc.path}`).subscribe(p => {
      this.ProspectService.updateV2({ documents_autre: this.PROSPECT.documents_autre, _id: this.PROSPECT._id }).subscribe(a => {
        console.log(a)
      })
    })
  }



}
