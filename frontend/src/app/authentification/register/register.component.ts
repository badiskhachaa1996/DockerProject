import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { DropdownModule } from 'primeng/dropdown';
import { ServService } from 'src/app/services/service.service';
import { Service } from 'src/app/models/Service';
import { ListUserComponent } from 'src/app/authentification/list-user/list-user.component'
import { HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ClasseService } from 'src/app/services/classe.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Services: any[];
  pass: any ;
  currentRoot: String = this.router.url;
  IsAdmin: boolean = false;
  User_role: String;
  emailExists = false;
  Roles = environment.role;
  showForm: boolean = true;
  civiliteList = environment.civilite;
  statutList = environment.typeUser
  campusList = environment.campus
  formationList = environment.formations
  entreprisesList =environment.entreprisesList


  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(environment.civilite[0], [Validators.required]),
    lastname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),//Lettre et espace
    firstname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),//Si il finit par .png ou .jpg
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]),
    phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    adresse: new FormControl('', [Validators.required]),
    /*password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    verifypassword: new FormControl('', [Validators.required, Validators.minLength(5)]),*/
    role: new FormControl('user', Validators.required),
    service_id: new FormControl(null),
    entreprise : new FormControl(this.entreprisesList[0]),
    type: new FormControl(this.statutList[0], [Validators.required]),
    campus: new FormControl(this.campusList[0]),
    formation : new FormControl('')

  })

  saveUser() {
    let user = new User(null,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.phone,
      this.RegisterForm.value.email,
      null,
      //this.RegisterForm.value.password,
      this.RegisterForm.value.role.value || this.Roles[0].value,
      null,
      this.RegisterForm.value.adresse,
      this.RegisterForm.value.service_id,
      this.RegisterForm.value.civilite.value,
      null,
      null,
      this.RegisterForm.value.campus.value,
      this.RegisterForm.value.type.value,
      this.RegisterForm.value.formation._id,
      this.RegisterForm.value.entreprise.value
    )

    if (this.router.url == "/register") {
      user.role="user"
    }
    this.AuthService.registerAdmin(user).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Message d\'inscription', detail: 'Inscription réussie' });

      if (this.router.url == "/register") {
        this.router.navigateByUrl('/login')
      } else {
        this.listUserComponenet.showFormAdd = false
        if (data.role != "user") {
          this.listUserComponenet.tabUser.push(data)
        }
      }
    }, (error) => {
      if (error.status == 400 || error.includes("400")) {
        //Bad Request (Email déjà utilisé)
        this.messageService.add({ severity: 'error', summary: 'Erreur d\'inscription', detail: 'Email déjà utilisé' });
        this.emailExists = true;
      } else if (error.status == 500 || error.includes("500")) {
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
  /*get password() { return this.RegisterForm.get('password'); }
  get verifypassword() { return this.RegisterForm.get('verifypassword'); }*/
  get role() { return this.RegisterForm.get('role').value; }
  get service_id() { return this.RegisterForm.get('service_id'); }
  get civilite() { return this.RegisterForm.get('civilite'); }

  get entreprise() { return this.RegisterForm.get('entreprise').value.value; }
  get type() { return this.RegisterForm.get('type').value.value; }
  get campus() { return this.RegisterForm.get('campus').value.value; }
  get formation() { return this.RegisterForm.get('formation').value.value; }
  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private servService: ServService, private listUserComponenet: ListUserComponent, private ClasseService:ClasseService) { }

  ngOnInit(): void {
    this.servService.getAll().subscribe((data) => {
      this.Services = data;
      this.RegisterForm.get('service_id').setValue(data[0]._id)
    })

    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.User_role = decodeToken.role;
    }
    this.IsAdmin = this.User_role == "Admin" || this.User_role == "Responsable"
    if (this.User_role == "Responsable") {
      this.Roles = [this.Roles[0]]
    } else if (this.IsAdmin) {
      this.Roles = [this.Roles[0], this.Roles[1]]
    }
    this.ClasseService.seeAll().subscribe((data)=>{
      this.formationList = data;
      this.RegisterForm.patchValue({
        formation: data[0]
      })
    })
  }


}
