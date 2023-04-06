import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-mp-oublie',
  templateUrl: './mp-oublie.component.html',
  styleUrls: ['./mp-oublie.component.scss']
})
export class MpOublieComponent implements OnInit {

  // logo intedgroup
  logo: string;

  formSendLink: FormGroup;
  formUpdatePwd: FormGroup;
  userEmail: string;

  // id de l'utilisateur dans l'url
  userIdParams: string;

  showSuccessMessage: boolean;
  isPasswordUpdated: boolean;

  constructor(private messageService: MessageService, private formBuilder: FormBuilder, private userService: AuthService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.logo = "assets/images/logo-ims.png";
    this.showSuccessMessage = false;
    this.isPasswordUpdated = false;

    // vérification de l'existence d'un paramètre id dans l'url
    this.userIdParams = this.activatedRoute.snapshot.params['id']

    // initialisation du formulaire d'envoie de mail
    this.formSendLink = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // initialisation du formulaire de modification du mot de passe
    this.formUpdatePwd = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      cfmPassword: ['', Validators.required],
    });
  }

  // vérification du formulaire de modification du mot de passe
  get password() { return this.formUpdatePwd.get('password'); };
  get cfmPassword() { return this.formUpdatePwd.get('cfmPassword'); };


  onSendEmail(): void
  {
    const email = this.formSendLink.value.email;
    this.userEmail = email;

    this.userService.sendRecoveryPasswordEmail(email)
    .then((response) => {
      this.messageService.add({severity: 'success', summary: 'Email', detail: response.successMsg});
      this.showSuccessMessage = true;
    })
    .catch((err) => {console.log(err); this.messageService.add({severity: 'error', summary: 'Email', detail: err.errMsg})});
  }

  onUpdatePassword(): void
  {
    const formValue = this.formUpdatePwd.value;

    const password = formValue.password;
    const cfmPassword = formValue.cfmPassword;

    // vérifie si les mot de passe sont identique
    if(password != cfmPassword)
    {
      this.messageService.add({severity: 'error', summary: 'Mot de passe', detail: 'Mot de passe non identique'});
    } else {
      this.userService.recoveryPassword(this.userIdParams, password)
      .then((response) => {
        this.messageService.add({severity: 'success', summary: 'Mot de passe', detail: response.successMsg});
        this.isPasswordUpdated = true;
      })
      .catch((err) => { this.messageService.add({severity: 'error', summary: 'Mot de passe', detail: err.error.errMsg}); });
    }
  }
}
