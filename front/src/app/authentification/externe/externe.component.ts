import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-externe',
  templateUrl: './externe.component.html',
  styleUrls: ['./externe.component.scss']
})
export class ExterneComponent implements OnInit {

  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })

  constructor(public authService: AuthService, private router: Router, private messageService: MessageService, private ss: EventEmitterService, private socket: SocketService) { }

  ngOnInit(): void {
    
  }

  Login() {
    let userToLog = { email: this.formLogin.value.email, password: this.formLogin.value.password };
    this.authService.login(userToLog).subscribe((data) => {
      localStorage.setItem('token', data.token)
      this.socket.isAuth()
      this.authService.WhatTheRole(jwt_decode(data.token)['id']).subscribe((roleConnected) => {
        if (roleConnected.type == "Prospect") {
          localStorage.setItem('ProspectConected', roleConnected.Ptoken)
          this.router.navigate(['/suivre-ma-preinscription'])
        } else if (roleConnected.type == "Commercial" || roleConnected.type == "Partenaire") {
          this.router.navigateByUrl('/ticket/suivi', { skipLocationChange: true })
        }

      })
    }, error => {
      if (error.status == 304) {
        this.messageService.add({ severity: 'error', summary: "Activation compte", detail: "Validez votre compte via le mail envoyé dans votre boîte mail" });
      }
      else {
        this.messageService.add({ severity: 'error', summary: "Authentification", detail: "Email ou Mot de passe Incorrect" });
      }

      console.log(error)
    })

  }

}
