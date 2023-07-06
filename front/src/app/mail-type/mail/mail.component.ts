import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MailType } from 'src/app/models/MailType';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { saveAs } from "file-saver";
import { FileUpload } from 'primeng/fileupload';
import mongoose from 'mongoose';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailTypeComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  emails: MailType[] = []
  addEmail = false
  selectedEmail: MailType = null
  updateEmail: MailType = null
  pieces_jointe = []
  constructor(private EmailTypeService: EmailTypeService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.EmailTypeService.MTgetAll().subscribe(data => {
      this.emails = data
    })
  }
  //Ajout
  formAdd = new FormGroup({
    objet: new FormControl('', [Validators.required, Validators.minLength(2)]),
    body: new FormControl(),
    type: new FormControl('', Validators.required)
  })
  onAdd() {
    this.EmailTypeService.MTcreate({ ...this.formAdd.value, custom_id: this.generateID() }).subscribe(data => {
      this.emails.push(data)
      this.addEmail = false
      this.formAdd.reset()
      this.ToastService.add({ severity: 'success', summary: 'Ajout de l\'email avec succès' })
    })
  }

  //Update
  formEdit = new FormGroup({
    objet: new FormControl('', [Validators.required]),
    body: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)
  })
  onInitUpdate(email: MailType) {
    this.formEdit.patchValue({ ...email })
    this.updateEmail = email
  }
  onUpdate() {
    this.EmailTypeService.MTupdate({ ...this.formEdit.value }).subscribe(data => {
      this.emails.splice(this.emails.indexOf(this.updateEmail), 1, data)
      this.updateEmail = null
      this.formEdit.reset()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour de l\'email avec succès' })
    })
  }
  //Delete
  onDelete(email: MailType) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + email.objet + " ?")) {
      this.EmailTypeService.MTdelete(email._id).subscribe(data => {
        this.emails.splice(this.emails.indexOf(email), 1)
        this.ToastService.add({ severity: 'success', summary: 'Suppression de l\'email avec succès' })
      })
    }
  }
  generateID() {
    let objet: string = this.formAdd.value.objet
    let nb = (this.emails.length + 1).toString()
    if (nb.length == 2)
      nb = "0" + nb
    else if (nb.length == 1)
      nb = "00" + nb
    else if (nb.length > 3)
      nb = nb.substring(0, 3)
    return (objet.substring(0, 2) + this.randomCharGen(3) + nb).toUpperCase()
  }

  randomCharGen(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  addPJ: MailType = null
  uploadFilePJ: {
    date: Date,
    nom: string,
    path: string,
    _id: string
  } = null
  onInitPJ(email: MailType) {
    this.addPJ = email
  }

  downloadPJFile(pj: { _id, nom, path }) {
    this.EmailTypeService.downloadPJ(this.addPJ._id, pj._id, pj.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      saveAs(blob, pj.path)
    }, (error) => {
      console.error(error)
    })
  }
  onAddPj() {
    this.addPJ.pieces_jointe.push({ date: new Date(), nom: 'Cliquer pour modifier le nom du document ici', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  onUploadPJ(uploadFilePJ) {
    if (uploadFilePJ?.nom && uploadFilePJ.nom != 'Cliquer pour modifier le nom du document ici') {
      document.getElementById('selectedFile').click();
      this.uploadFilePJ = uploadFilePJ
    } else {
      this.ToastService.add({ severity: 'error', summary: 'Vous devez d\'abord donner un nom au fichier avant de l\'upload' });
    }

  }

  FileUploadPJ(event: [File]) {
    console.log(event)
    if (event != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('nom', this.uploadFilePJ.nom)
      formData.append('pj_id', this.uploadFilePJ._id)
      formData.append('path', event[0].name)
      formData.append('_id', this.addPJ._id)
      formData.append('file', event[0])
      this.EmailTypeService.uploadPJ(formData).subscribe(res => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        let pj = this.emails[this.emails.indexOf(this.addPJ)].pieces_jointe
        pj[pj.indexOf(this.uploadFilePJ)].path = event[0].name
        this.uploadFilePJ = null;
        this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }
  savePJlist() {
    this.EmailTypeService.MTupdate({ _id: this.addPJ._id, pieces_jointe: this.addPJ.pieces_jointe }).subscribe(data => {
      this.emails.splice(this.emails.indexOf(this.addPJ), 1, data)
      this.addPJ = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour des pièces jointes avec succès' })
    })
  }

  onDeletePJ(ri) {
    delete this.addPJ.pieces_jointe[ri]
  }

}
