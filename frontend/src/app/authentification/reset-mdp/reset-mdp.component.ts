import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ServService } from 'src/app/services/service.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-reset-mdp',
  templateUrl: './reset-mdp.component.html',
  styleUrls: ['./reset-mdp.component.css']
})
export class ResetMdpComponent implements OnInit {

  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private servService: ServService) { }

  ngOnInit(): void {
  }
  ResetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),

  })

  EnvoyerMail() {
    let user = {email:this.ResetForm.value.email}

    this.AuthService.sendemail(user).subscribe(data=>{
      console.log(data)
    },(error)=>{
      console.log(error)
    }); 
    
      this.messageService.add({ severity: 'success', summary: 'Message email', detail: 'vous avez reçu un mail pour reinitialiser votre mot de passe' });

 
  }
  get email() { return this.ResetForm.get('email'); }


}
