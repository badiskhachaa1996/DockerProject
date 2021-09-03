import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,private AuthService:AuthService,private messageService: MessageService) { }

  errorLogin=false;

  LoginForm: FormGroup= new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(5)])
  })

  login(){
    //Connexion
    let user = {
      email:this.LoginForm.value.email,
      password:this.LoginForm.value.password
    }
    this.AuthService.login(user).subscribe((data)=>{
      if(data.token!=null){
        localStorage.setItem("token",data.token);
        window.location.reload();
       
      }
    },(error)=>{
      if(error.status==404){
        //Not Found (Pas de correspondance pour le duo email/passwd)
        this.messageService.add({severity:'error', summary:'Erreur de Connexion', detail:'Email ou mot de passe incorrect'});
        this.errorLogin=true;
      }
      console.log(error)
    });
  }
  

  get email() { return this.LoginForm.get('email'); }
  get password() { return this.LoginForm.get('password'); }

  ngOnInit(): void {
    if(localStorage.getItem("token")!=null){
      this.router.navigate(['/ticket/suivi'])
    }
  }

}
