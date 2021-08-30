import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';
import { LazyLoadEvent } from 'primeng/api';
import { User } from 'src/app/models/User';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

 
  tabUser = [];

datasource: User [];
  cols: any[];

  totalRecords: number;

  showForm: string = "Ajouter";
  loading: boolean;
  router: any;
  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    this.AuthService.getAll().subscribe((data) => {
      this.tabUser = data;
      this.totalRecords=this.tabUser.length;
      console.log(this.totalRecords)
    })

    this.cols = [
      { field: 'lastname', header: 'Nom' },
      { field: 'firstname', header: 'Prenom' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Téléphone' },
      { field: 'adresse', header: 'Adresse' },
      { field: 'action', header: "Action" }
    ];
    this.loading = true;
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



  loadUsersLazy(event: LazyLoadEvent) {
    this.loading = true;

    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    setTimeout(() => {
        if (this.datasource) {
            this.tabUser = this.datasource.slice(event.first, (event.first + event.rows));
            this.loading = false;
        }
    }, 1000);
}
modify(data){
  console.log(data)
  this.router.navigateByUrl("/ticket/update",{state:data});
}
}

