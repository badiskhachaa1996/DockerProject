import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MailType } from 'src/app/models/MailType';
import { EmailTypeService } from 'src/app/services/email-type.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailTypeComponent implements OnInit {

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
  /*
  downloadAdminFile(path) {
    this.EmailTypeService.downloadPJ(path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      //saveAs(blob, path)
    }, (error) => {
      console.error(error)
    })
  }

  FileUploadAdmin(event: { files: [File], target: EventTarget }) {

    if (event.files != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('date', new Date().toString())
      formData.append('nom', event.files[0].name)
      formData.append('path', event.files[0].name)
      formData.append('file', event.files[0])
      this.admissionService.uploadAdminFile(formData, this.showUploadFile._id).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        if (res.documents_administrative)
          this.prospects[this.showUploadFile.type_form][this.prospects[this.showUploadFile.type_form].indexOf(this.showUploadFile)].documents_administrative = res.documents_administrative
        event.target = null;
        this.showUploadFile = null;

        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }*/

}
