import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Mail } from 'src/app/models/Mail';
import { EmailTypeService } from 'src/app/services/email-type.service';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
@Component({
  selector: 'app-configuration-mail',
  templateUrl: './configuration-mail.component.html',
  styleUrls: ['./configuration-mail.component.scss']
})
export class ConfigurationMailComponent implements OnInit {
  emails: Mail[] = []
  addEmail = false
  selectedEmail: Mail = null
  updateEmail: Mail = null
  dicSignature = {}
  token;
  user: User;
  constructor(private EmailTypeService: EmailTypeService, private ToastService: MessageService, private UserService: AuthService) { }

  ngOnInit(): void {
    this.EmailTypeService.getAll().subscribe(data => {
      this.emails = data
    })
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getPopulate(this.token.id).subscribe(data => {
      this.user = data
    })
    this.EmailTypeService.getAllSignature().subscribe(data => {
      this.dicSignature = data.files // {id:{ file: string, extension: string }}
      data.ids.forEach(id => {
        const reader = new FileReader();
        const byteArray = new Uint8Array(atob(data.files[id].file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.files[id].extension })
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          this.dicSignature[id].url = reader.result;
        }
      })

    })
  }
  //Ajout
  formAdd = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)
  })
  onAdd() {
    console.log(this.user)
    this.EmailTypeService.testEmail({
      email: this.formAdd.value.email,
      password: this.formAdd.value.password,
      to: this.user.email
    }).subscribe(data => {
      if (data.r == 'success')
        this.EmailTypeService.create({ ...this.formAdd.value }).subscribe(data2 => {
          console.log(data,data2)
          this.emails.push(data2)
          this.addEmail = false
          this.formAdd.reset()
          this.ToastService.add({ severity: 'success', summary: 'Ajout de l\'email avec succès' })
        })
      else
        this.ToastService.add({ severity: 'error', summary: 'Le mail n\'a pas pu être envoyé' })
    }, error => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Le mail n\'a pas pu être envoyé', detail: error.error })
    })

  }

  //Update
  formEdit = new FormGroup({
    email: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)
  })
  onInitUpdate(email: Mail) {
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
  onDelete(email: Mail) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ' + email.email + " ?")) {
      this.EmailTypeService.delete(email._id).subscribe(data => {
        this.emails.splice(this.emails.indexOf(email), 1)
        this.ToastService.add({ severity: 'success', summary: 'Suppression de l\'email avec succès' })
      })
    }
  }
  //Upload Signature
  onUploadSignature(email: Mail) {
    document.getElementById('selectedFile').click();
    this.selectedEmail = email
  }
  FileUploadPC(event: File[]) {
    if (event && event.length > 0 && this.selectedEmail != null) {
      const formData = new FormData();

      formData.append('id', this.selectedEmail._id)
      formData.append('name', event[0].name)
      formData.append('file', event[0])
      this.EmailTypeService.uploadSignature(formData).subscribe(() => {
        this.ToastService.add({ severity: 'success', summary: 'Signature', detail: 'Mise à jour de la signature avec succès' });
        this.EmailTypeService.getAllSignature().subscribe(data => {
          const reader = new FileReader();
          reader.readAsDataURL(event[0]);
          reader.onloadend = () => {
            if (this.dicSignature[this.selectedEmail._id])
              this.dicSignature[this.selectedEmail._id].url = reader.result;
            else {
              this.dicSignature[this.selectedEmail._id] = {}
              this.dicSignature[this.selectedEmail._id].url = reader.result;
            }
          }
        })
      }, (error) => {
        console.error(error)
      })
    }
  }

}
