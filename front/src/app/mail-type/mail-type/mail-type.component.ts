import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EmailType } from 'src/app/models/EmailType';
import { EmailTypeService } from 'src/app/services/email-type.service';

@Component({
  selector: 'app-mail-type',
  templateUrl: './mail-type.component.html',
  styleUrls: ['./mail-type.component.scss']
})
export class MailTypeComponent implements OnInit {

  emails: EmailType[] = []
  addEmail = false
  selectedEmail: EmailType = null
  updateEmail: EmailType = null
  constructor(private EmailTypeService: EmailTypeService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.EmailTypeService.getAll().subscribe(data => {
      //this.emails = data
    })
  }
  //Ajout
  formAdd = new FormGroup({
    objet: new FormControl('', [Validators.required]),
    body: new FormControl(),
    type: new FormControl('', Validators.required)
  })
  onAdd() {
    this.EmailTypeService.create({ ...this.formAdd.value, custom_id: this.generateID() }).subscribe(data => {
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
  onInitUpdate(email: EmailType) {
    this.formEdit.patchValue({ ...email })
    this.updateEmail = email
  }
  onUpdate() {
    this.EmailTypeService.update({ ...this.formEdit.value }).subscribe(data => {
      this.emails.splice(this.emails.indexOf(this.updateEmail), 1, data)
      this.updateEmail = null
      this.formEdit.reset()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour de l\'email avec succès' })
    })
  }
  //Delete
  onDelete(email: EmailType) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + email.email + " ?")) {
      this.EmailTypeService.delete(email._id).subscribe(data => {
        this.emails.splice(this.emails.indexOf(email), 1)
        this.ToastService.add({ severity: 'success', summary: 'Suppression de l\'email avec succès' })
      })
    }
  }
  generateID() {
    return 'XXXX'
  }
}
