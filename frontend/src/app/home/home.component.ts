import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  User = JSON.parse(environment.User);

  tabUser: any[] = [];
  UserPreInscrit: any[] = [];
  UserInscrit: any[] = [];

  cols: any[];

  draggedUser: any;

  showForm: string = "Ajouter";

  dragStart(event, user: any) {
    this.draggedUser = user;
  }

  dragEnd(event) {
    this.draggedUser = null;
  }

  dragListToPreInscrit(event?) {
    this.tabUser.splice(this.tabUser.indexOf(this.draggedUser), 1)
    this.UserPreInscrit.push(this.draggedUser)
  }

  dragPreInscritToInscrit(event?) {
    this.UserPreInscrit.splice(this.UserPreInscrit.indexOf(this.draggedUser), 1)
    this.UserInscrit.push(this.draggedUser)
  }

  dragInscritToList(event?) {
    this.UserInscrit.splice(this.UserInscrit.indexOf(this.draggedUser), 1)
    this.tabUser.push(this.draggedUser)
  }

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    this.AuthService.getAll().subscribe((data) => {
      this.tabUser = data;
    })

    this.cols = [
      { field: 'lastname', header: 'Nom' },
      { field: 'firstname', header: 'Prenom' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Téléphone' },
      { field: 'adresse', header: 'Adresse' },
      { field: null, header: "Action" }
    ];
  }
  ListToPreInscrit(user, event?) {
    this.tabUser.splice(this.tabUser.indexOf(user), 1)
    this.UserPreInscrit.push(user)
  }

  PreInscritToInscrit(user, event?) {
    this.UserPreInscrit.splice(this.UserPreInscrit.indexOf(user), 1)
    this.UserInscrit.push(user)
  }

  InscritToList(user, event?) {
    this.UserInscrit.splice(this.UserInscrit.indexOf(user), 1)
    this.tabUser.push(user)
  }

  toggleForm() {
    if (this.showForm == "Ajouter") {
      this.showForm = "Fermer";
    } else {
      this.showForm = "Ajouter"
    }

  }    

  RegisterForm: FormGroup = new FormGroup({
    lastname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]),
    adresse: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    verifypassword: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  saveUser() {
    //Enregistrement de l'user
    this.tabUser.push(this.RegisterForm.value)
    this.RegisterForm.reset()
    this.toggleForm()
  }

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get email() { return this.RegisterForm.get('email'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get password() { return this.RegisterForm.get('password'); }
  get verifypassword() { return this.RegisterForm.get('verifypassword'); }

}
