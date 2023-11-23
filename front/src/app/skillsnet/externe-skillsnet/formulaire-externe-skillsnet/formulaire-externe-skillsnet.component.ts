import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formulaire-externe-skillsnet',
  templateUrl: './formulaire-externe-skillsnet.component.html',
  styleUrls: ['./formulaire-externe-skillsnet.component.scss']
})
export class FormulaireExterneSkillsnetComponent implements OnInit {
  token;
  RegisterForm: UntypedFormGroup = new UntypedFormGroup({
    lastname: new UntypedFormControl('', [Validators.required]),
    firstname: new UntypedFormControl('', [Validators.required]),
    phone: new UntypedFormControl(undefined),
    civilite: new UntypedFormControl('', Validators.required),
    pays_adresse: new UntypedFormControl(),
    ville_adresse: new UntypedFormControl(),
    rue_adresse: new UntypedFormControl(),
    numero_adresse: new UntypedFormControl(),
    postal_adresse: new UntypedFormControl(),
    _id: new UntypedFormControl(),
    password_clear: new UntypedFormControl('', Validators.required),
    password_confirmed: new UntypedFormControl('', Validators.required)
  })

  civiliteList: any = [
    { label: 'Monsieur' },
    { label: 'Madame' },
    { label: 'Autre' },
  ];

  paysList = environment.pays;

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get indicatif() { return this.RegisterForm.get('indicatif'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get civilite() { return this.RegisterForm.get('civilite'); }

  get pays_adresse() { return this.RegisterForm.get('pays_adresse'); }
  get ville_adresse() { return this.RegisterForm.get('ville_adresse'); }
  get rue_adresse() { return this.RegisterForm.get('rue_adresse'); }
  get numero_adresse() { return this.RegisterForm.get('numero_adresse'); }
  get postal_adresse() { return this.RegisterForm.get('postal_adresse'); }

  get password_confirmed() { return this.RegisterForm.get('password_confirmed'); }
  get password_clear() { return this.RegisterForm.get('password_clear'); }

  saveUser() {
    let user = { ...this.RegisterForm.value }
    user['type'] = "Externe"
    this.AuthService.update(user).subscribe(newUser => {
      this.messageService.add({ summary: 'Votre compte a été mis à jour avec succès', severity: 'success' })
      this.router.navigate(["/"])
    })
  }

  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService) { }


  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.AuthService.getPopulate(this.token.id).subscribe(user => {
      this.RegisterForm.patchValue({
        lastname: user.lastname,
        firstname: user.firstname,
        phone: user.phone,
        civilite: user.civilite,
        pays_adresse: user.pays_adresse,
        ville_adresse: user.ville_adresse,
        rue_adresse: user.rue_adresse,
        numero_adresse: user.numero_adresse,
        postal_adresse: user.postal_adresse,
        _id: user._id
      })
      if (user.type != "Externe-InProgress") {
        this.router.navigate(["/"])
      }
    })
  }

}
