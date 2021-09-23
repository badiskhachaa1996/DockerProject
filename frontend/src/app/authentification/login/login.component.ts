import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { PopupRequest, AuthenticationResult } from '@azure/msal-browser';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService) { }

  LoginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  get email() { return this.LoginForm.get('email'); }
  get password() { return this.LoginForm.get('password'); }

  ngOnInit(): void {
    console.log(localStorage.getItem("token"))//localStorage.getItem('modify')=="true"
    if (localStorage.getItem('modify') == "true") {
      localStorage.removeItem('modify')
      this.router.navigate(['/modification'])
    } else if (localStorage.getItem("token") != null) {
      this.router.navigate(['/ticket/suivi'])
    }
  }

  toLogin() {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          if (response.account) {
            this.AuthService.AuthMicrosoft(response.account.username, response.account.name).subscribe((data) => {
              this.auth(data)
            })
          }
        });
    } else {
      this.msalService.loginPopup()
        .subscribe((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
          if (response.account) {
            this.AuthService.AuthMicrosoft(response.account.username, response.account.name).subscribe((data) => {
              this.auth(data)
            })
          }
        });
    }
  }

  auth(data) {
    console.log(data)
    localStorage.setItem("token", data.token)
    console.log(localStorage.getItem("token"))
    if (data.message) {
      localStorage.setItem("modify", "true")
      window.location.reload();
      //this.router.navigate(['/modification'])
    } else {
      window.location.reload();
      //this.router.navigate(['/ticket/suivi'])
    }
  }
}
