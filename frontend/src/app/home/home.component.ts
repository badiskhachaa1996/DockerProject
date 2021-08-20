import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  User=JSON.parse(environment.User);

  listUser=environment.listUser;
  listUserInscrit=environment.UserInscrit;
  listUserPreInscrit=environment.UserPreInscrit;

  tabUser:any[]=[];
  UserPreInscrit:any[]=[];
  UserInscrit:any[]=[];

  cols: any[];

  draggedUser: any;

  showForm:string="Ajouter";

  dragStart(event, user: any) {
    this.draggedUser = user;
  }

  dragEnd(event) {
      this.draggedUser = null;
  }

  dragListToPreInscrit(event?){
    this.tabUser.splice(this.tabUser.indexOf(this.draggedUser),1)
    this.UserPreInscrit.push(this.draggedUser)
    this.save()
  }

  dragPreInscritToInscrit(event?){
    this.UserPreInscrit.splice(this.UserPreInscrit.indexOf(this.draggedUser),1)
    this.UserInscrit.push(this.draggedUser)
    this.save()
  }

  dragInscritToList(event?){
    this.UserInscrit.splice(this.UserInscrit.indexOf(this.draggedUser),1)
    this.tabUser.push(this.draggedUser)
    this.save()
  }

  constructor() { }

  ngOnInit(): void {
    this.listUser.forEach(user => {
      this.tabUser.push(JSON.parse(user))
    });

    this.listUserInscrit.forEach(user => {
      this.UserInscrit.push(JSON.parse(user))
    });

    this.listUserPreInscrit.forEach(user => {
      this.UserPreInscrit.push(JSON.parse(user))
    });

    this.cols = [
      { field: 'nom', header: 'Nom' },
      { field: 'prenom', header: 'Prenom' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Téléphone' },
      { field: 'adresse', header: 'Adresse' },
      {field:null,header:"Action"}
  ];
  }
  ListToPreInscrit(user,event?){
    this.tabUser.splice(this.tabUser.indexOf(user),1)
    this.UserPreInscrit.push(user)
    this.save()
  }

  PreInscritToInscrit(user,event?){
    this.UserPreInscrit.splice(this.UserPreInscrit.indexOf(user),1)
    this.UserInscrit.push(user)
    this.save()
  }

  InscritToList(user,event?){
    this.UserInscrit.splice(this.UserInscrit.indexOf(user),1)
    this.tabUser.push(user)
    this.save()
  }

  save(){
    let temp=[];
    this.tabUser.forEach(user => {
      temp.push(JSON.stringify(user))
    });
    environment.listUser=temp;
    temp=[];
    this.UserPreInscrit.forEach(user => {
      temp.push(JSON.stringify(user))
    });
    environment.UserPreInscrit=temp;
    temp=[];
    this.UserInscrit.forEach(user => {
      temp.push(JSON.stringify(user))
    });
    environment.UserInscrit=temp;
  }

  toggleForm(){
    if(this.showForm=="Ajouter"){
      this.showForm="Fermer";
    }else{
      this.showForm="Ajouter"
    }

  }

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
    this.tabUser.push(this.RegisterForm.value)
    this.RegisterForm.reset()
  }

  get nom() { return this.RegisterForm.get('nom'); }
  get prenom() { return this.RegisterForm.get('prenom'); }
  get email() { return this.RegisterForm.get('email'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get password() { return this.RegisterForm.get('password'); }

}
