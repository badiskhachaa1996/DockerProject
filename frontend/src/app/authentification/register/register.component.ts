import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailExists=false;

  RegisterForm: FormGroup= new FormGroup({
    lastname:new FormControl('',[Validators.required,Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname:new FormControl('',[Validators.required,Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    email:new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone:new FormControl('',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.maxLength(10),Validators.minLength(10)]),
    adresse:new FormControl('',[Validators.required]),
    password:new FormControl('',[Validators.required,Validators.minLength(5)]),
    verifypassword:new FormControl('',[Validators.required,Validators.minLength(5)])
  })

  saveUser(){
    //Enregistrement de l'user
    //environment.listUser.push(JSON.stringify(this.RegisterForm.value))
    let user = <User>{
      firstname:this.RegisterForm.value.firstname,
      lastname: this.RegisterForm.value.lastname,
      phone:this.RegisterForm.value.phone,
      email:this.RegisterForm.value.email,
      password:this.RegisterForm.value.password,
      adresse:this.RegisterForm.value.adresse
    }
    this.AuthService.register(user).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Message d\'inscription', detail:'Inscription réussie'});
      this.router.navigate(['/login'])
    },(error)=>{
      if(error.status==400){
        //Bad Request (Email déjà utilisé)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Email déjà utilisé'});
        this.emailExists=true;
      }
      console.log(error)
    });
    
  }

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get email() { return this.RegisterForm.get('email'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get password() { return this.RegisterForm.get('password'); }
  get verifypassword() { return this.RegisterForm.get('verifypassword'); }

  constructor(private router: Router, private AuthService: AuthService,private messageService: MessageService) { }

  ngOnInit(): void {
  }

}
