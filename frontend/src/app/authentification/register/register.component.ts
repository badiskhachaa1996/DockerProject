import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  RegisterForm: FormGroup= new FormGroup({
    nom:new FormControl('',[Validators.required,Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    prenom:new FormControl('',[Validators.required,Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    email:new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone:new FormControl('',[Validators.required,Validators.pattern('^[0-9]+$'),Validators.maxLength(10),Validators.minLength(10)]),
    adresse:new FormControl('',[Validators.required]),
    password:new FormControl('',[Validators.required,Validators.minLength(5)])
  })

  saveUser(){
    //Enregistrement de l'user
    environment.listUser.push(JSON.stringify(this.RegisterForm.value))
    this.router.navigate(['/login']);
  }

  get nom() { return this.RegisterForm.get('nom'); }
  get prenom() { return this.RegisterForm.get('prenom'); }
  get email() { return this.RegisterForm.get('email'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get password() { return this.RegisterForm.get('password'); }

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
