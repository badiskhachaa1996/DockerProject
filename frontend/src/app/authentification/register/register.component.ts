import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { DropdownModule } from 'primeng/dropdown';
import { ServService } from 'src/app/services/service.service';
import { Service } from 'src/app/models/Service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Services: any[];
  currentRoot: String = this.router.url;
  IsAdmin: boolean = false;
  User_role: String;
  emailExists = false;
  Roles = environment.role;

  RegisterForm: FormGroup = new FormGroup({
    lastname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]),
    adresse: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    verifypassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
    role: new FormControl('user', [Validators.required])


  })

  saveUser() {
    console.log(localStorage.getItem("token"));
    //Enregistrement de l'user
    //environment.listUser.push(JSON.stringify(this.RegisterForm.value))
    let user = new User(null,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.phone,
      this.RegisterForm.value.email,
      this.RegisterForm.value.password,
      this.RegisterForm.value.role.value || "user",
      null,
      this.RegisterForm.value.adresse,
      this.RegisterForm.value.service_id
    )
    console.log(user)
    this.AuthService.register(user).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Message d\'inscription', detail: 'Inscription réussie' });
      this.router.navigate(['/login'])
    }, (error) => {
      if (error.status == 400) {
        //Bad Request (Email déjà utilisé)
        this.messageService.add({ severity: 'error', summary: 'Erreur d\'inscription', detail: 'Email déjà utilisé' });
        this.emailExists = true;
      }else if(error.status == 500) {
        //Bad Request (Champ non fourni)
        this.messageService.add({ severity: 'error', summary: 'Erreur d\'inscription', detail: 'Tous les champs ne sont pas remplis' });
      }
    });

  }

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get email() { return this.RegisterForm.get('email'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get password() { return this.RegisterForm.get('password'); }
  get verifypassword() { return this.RegisterForm.get('verifypassword'); }
  get role() { return this.RegisterForm.get('role').value; }
  get service_id() { return this.RegisterForm.get('service_id'); }
  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private servService: ServService) { }

  ngOnInit(): void {
    this.servService.getAll().subscribe((data) => {
      this.Services = data;
    })

    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.User_role = decodeToken.role;
    }
    this.IsAdmin=this.User_role == "admin"
  }

}
