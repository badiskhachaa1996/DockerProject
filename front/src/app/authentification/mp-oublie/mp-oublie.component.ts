import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mp-oublie',
  templateUrl: './mp-oublie.component.html',
  styleUrls: ['./mp-oublie.component.scss']
})
export class MpOublieComponent implements OnInit {
  buttonRetour: boolean = false;

  constructor(private messageService: MessageService, private authService: AuthService, private router: Router,) { }
  form_mpoublie: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

  })

  submitForm() {
    let email_saisie = this.form_mpoublie.value.email;
    this.authService.getByEmail(email_saisie).subscribe(UserExist => {
      console.log(UserExist)
      if (UserExist == true) {

        this.authService.pwdToken(email_saisie).subscribe(mpToken => {
          if (mpToken) {
            console.log(mpToken)
            this.messageService.add({ severity: 'info', summary: 'Email envoyé', detail: 'Rendez vous sur le mail reçu pour continuer' });
          }

        },
          error => { console.log(error) })
        this.buttonRetour = true;
      
      }
      else {
        this.form_mpoublie.patchValue({ email: '' })
        console.log("email non existant");
        this.messageService.add({ severity: 'error', summary: 'Email érroné', detail: 'Verifiez la saisie de votre email' });
      }

    },
      error => { console.log(error) })


  }
  ngOnInit(): void {

  }

}
