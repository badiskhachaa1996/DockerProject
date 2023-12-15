import { Component, Input, OnInit } from '@angular/core';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { saveAs as importedSaveAs } from "file-saver";
import mongoose from 'mongoose';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-documents-candidature-viewer',
  templateUrl: './documents-candidature-viewer.component.html',
  styleUrls: ['./documents-candidature-viewer.component.scss']
})
export class DocumentsCandidatureViewerComponent implements OnInit {
  documentsObligatoires = ['CV', "Pièce d'identité", "Dernier diplôme obtenu",
    "Relevés de note de deux dernières année"]
  ID = this.route.snapshot.paramMap.get('id');
  @Input() PROSPECT_ID
  @Input() selectedDocs = 'documents_dossier'
  documents = []
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService, private ToastService: MessageService) { }
  resideFr = false
  alternance = false
  ngOnInit(): void {
    if (!this.ID)
      this.ID = this.PROSPECT_ID
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(data => {
        this.PROSPECT = data
        if (this.selectedDocs == 'documents_dossier')
          this.documents = this.PROSPECT.documents_dossier
        else if (this.selectedDocs == 'documents_administrative')
          this.documents = this.PROSPECT.documents_administrative
        this.checkIfDossierComplet()
        if (!this.PROSPECT.etat_dossier)
          this.PROSPECT.etat_dossier = "En attente"
      })
  }

  checkIfDossierComplet() {
    let r = false
    if (this.selectedDocs == 'documents_dossier') {
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
    }
    if (r)
      this.PROSPECT.etat_dossier = 'Manquant'
    else
      this.PROSPECT.etat_dossier = 'Complet'
  }

  /* Debut: documents_dossier */
  downloadFile(doc: { date: Date, nom: String, path: String }) {
    if (this.selectedDocs == 'documents_dossier')
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
    if (this.selectedDocs == 'documents_dossier')
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
    if (this.selectedDocs == 'documents_dossier') {
      this.PROSPECT.documents_dossier[this.PROSPECT.documents_dossier.indexOf(doc)].path = null
      this.ProspectService.deleteFile(this.PROSPECT._id, `${doc.nom}/${doc.path}`).subscribe(p => {
        this.ProspectService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }, "Suppression d'un document du dossier Lead-Dossier").subscribe(a => {
          this.checkIfDossierComplet()
        })
      }, error => {
        console.error(error)
        this.ProspectService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }, "Suppression d'un document du dossier Lead-Dossier").subscribe(a => {
          this.checkIfDossierComplet()
        })
      })
    }


  }
  /* Sous Partie Document autre */
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
    this.ProspectService.updateV2({ documents_autre: this.PROSPECT.documents_autre, _id: this.PROSPECT._id }, "Suppression d'un document autre Lead-Dossier").subscribe(a => {
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

  /* Fin: documents_dossier */
  /* Debut: documents_administrative */
}