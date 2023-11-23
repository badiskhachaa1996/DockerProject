import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MailAuto } from 'src/app/models/MailAuto';
import { MailType } from 'src/app/models/MailType';
import { EmailTypeService } from 'src/app/services/email-type.service';

@Component({
  selector: 'app-mail-auto',
  templateUrl: './mail-auto.component.html',
  styleUrls: ['./mail-auto.component.scss']
})
export class MailAutoComponent implements OnInit {


  emails: MailAuto[] = []
  addEmail = false
  selectedEmail: MailAuto = null
  updateEmail: MailAuto = null
  constructor(private EmailTypeService: EmailTypeService, private ToastService: MessageService) { }

  mailTypeDropdown = []
  mailDropdown = []
  etatDropdown = [
    { label: "En cours d'automatisation", value: "En cours d'automatisation" },
    { label: 'Automatisé', value: 'Automatisé' },
    { label: 'Correction demandé', value: 'Correction demandé' },
  ]

  ngOnInit(): void {
    this.EmailTypeService.MAgetAll().subscribe(data => {
      this.emails = data
    })
    this.EmailTypeService.MTgetAll().subscribe(data => {
      data.forEach(e => {
        this.mailTypeDropdown.push({ label: e.custom_id + " | " + e.objet, value: e._id })
      })
    })
    this.EmailTypeService.getAll().subscribe(data => {
      data.forEach(e => {
        this.mailDropdown.push({ label: e.email, value: e._id })
      })
    })
  }
  //Ajout
  formAdd = new UntypedFormGroup({
    condition: new UntypedFormControl('', Validators.required),
    mailType: new UntypedFormControl('', Validators.required),
    mail: new UntypedFormControl('', Validators.required)
  })
  onAdd() {
    this.EmailTypeService.MAcreate({ ...this.formAdd.value }).subscribe(data => {
      this.emails.push(data)
      this.addEmail = false
      this.formAdd.reset()
      this.ToastService.add({ severity: 'success', summary: 'Ajout de l\'automatisation avec succès' })
    })
  }

  //Update
  formEdit = new UntypedFormGroup({
    condition: new UntypedFormControl('', Validators.required),
    mailType: new UntypedFormControl('', Validators.required),
    mail: new UntypedFormControl('', Validators.required),
    etat: new UntypedFormControl('', Validators.required),
    _id: new UntypedFormControl('', Validators.required)
  })
  onInitUpdate(email: MailAuto) {
    this.formEdit.patchValue({
      ...email, mailType: email.mailType._id,
      mail: email.mail._id
    })
    this.updateEmail = email
  }
  onUpdate() {
    this.EmailTypeService.MAupdate({ ...this.formEdit.value }).subscribe(data => {
      this.emails.splice(this.emails.indexOf(this.updateEmail), 1, data)
      this.updateEmail = null
      this.formEdit.reset()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour de l\'automatisation avec succès' })
    })
  }
  //Delete
  onDelete(email: MailAuto) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + email.custom_id + " ?")) {
      this.EmailTypeService.MAdelete(email._id).subscribe(data => {
        this.emails.splice(this.emails.indexOf(email), 1)
        this.ToastService.add({ severity: 'success', summary: 'Suppression de l\'automatisation avec succès' })
      })
    }
  }
  generateID() {
    let nb = (this.emails.length + 1).toString()
    if (nb.length == 2)
      nb = "0" + nb
    else if (nb.length == 1)
      nb = "00" + nb
    else if (nb.length > 3)
      nb = nb.substring(0, 3)
    return this.randomCharGen(3) + nb
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

}
