import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { EtudiantService } from 'src/app/services/etudiant.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  token: User;

  etudiants: Etudiant[] = []

  formAssignEmail: FormGroup = new FormGroup({
    email_ims: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+((@estya+\.com)|(@estyagroup+\.com)|(@elitech+\.education)|(@eduhorizons+\.com)|(@adgeducation+\.com)|(@intedgroup+\.com)|(@espic+\.com))$")]),
  })

  showAssignForm: Etudiant = null

  showUpdateForm(etu: any) {
    this.formAssignEmail.setValue({ email_ims: etu.user_id.email })
  }

  AssignEmailForm() {
    this.etudiantService.assignEmail(this.showAssignForm._id, this.formAssignEmail.value.email_ims).subscribe(d => {

      this.messageService.add({ severity: "success", detail: "Mis à jour avec succès par: " + this.formAssignEmail.value.email_ims, summary: "Assignation de l'émail " })
      this.etudiants.forEach((val, index) => {
        if (val._id == this.showAssignForm._id) {
          this.etudiants.splice(index, 1)
        }
      })
      this.showAssignForm = null
    }, err => {
      console.error(err)
      if (err.error.email)
        this.messageService.add({ severity: "error", summary: "Erreur lors de l'insertion de l'email", detail: "Cette email existe déjà dans la BD" })
      else
        this.messageService.add({ severity: "error", summary: "Erreur lors de l'insertion de l'email", detail: err.message })
    })

  }

  constructor(private etudiantService: EtudiantService, private messageService: MessageService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }

    this.etudiantService.getAllWaitForCreateAccount().subscribe(
      ((responseEtu) => {
        this.etudiants = responseEtu
      }),
      ((error) => { console.error(error); })
    );

  }

}
