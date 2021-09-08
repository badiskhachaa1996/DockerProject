import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import {DropdownModule} from 'primeng/dropdown';
import { AuthService } from 'src/app/services/auth.service';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { ServService } from 'src/app/services/service.service';
import { Service } from 'src/app/models/Service';
import { SelectableRow } from 'primeng/table';
import { ListUserComponent } from '../list-user/list-user.component';
@Component({
  selector: 'app-upduser',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateUserComponent implements OnInit {
  Services :Service[]
  currentRoot:String = this.router.url;
  IsAdmin : boolean=false;
  User_role:String ;
  id_role:any;
  emailExists=false;
  Roles = environment.role;
  showForm : boolean =true;

userupdate:any=[User];
  
 
  RegisterForm: FormGroup= new FormGroup({
    lastname:new FormControl([this.listUserComponent.selectedUser.lastname],[Validators.required,Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname:new FormControl(this.listUserComponent.selectedUser.firstname,[Validators.required,Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    email:new FormControl(this.listUserComponent.selectedUser.email,[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    phone:new FormControl(this.listUserComponent.selectedUser.phone,[Validators.required,Validators.pattern('^[0-9]+$'),Validators.maxLength(10),Validators.minLength(10)]),
    adresse:new FormControl(this.listUserComponent.selectedUser.adresse,[Validators.required]),
    password:new FormControl('',[Validators.required,Validators.minLength(5)]),
    verifypassword:new FormControl('',[Validators.required,Validators.minLength(5)]),
    role:new FormControl(this.listUserComponent.selectedUser.role,[Validators.required]),
    service_id:new FormControl(this.listUserComponent.selectedUser.service_id,[Validators.required])
    
    

  })

  toggleForm(){
    this.showForm=!this.showForm
    if (this.listUserComponent.showForm == "Ajouter") {
      this.listUserComponent.formtype = "new";
      this.listUserComponent.showForm = "Fermer";

    } else {
      this.listUserComponent.formtype = "new";
      this.listUserComponent.showForm = "Ajouter";
    }
  }


  UpdateUser(){
    console.log('to'+this.userupdate);
    let user = new User(this.userupdate._id,this.RegisterForm.value.firstname,this.RegisterForm.value.lastname,this.RegisterForm.value.phone,this.RegisterForm.value.email,this.RegisterForm.value.password,this.RegisterForm.value.role.value ||"user",null,this.RegisterForm.value.adresse,this.RegisterForm.value.service_id)
    console.log("user : "+user)
    this.AuthService.update(user).subscribe((data)=>{
      
      this.messageService.add({severity:'success', summary:'Message de modification', detail:'Votre message a bien été modifié'});
   console.log(data)
    },(error)=>{
      if(error.status==400){
        //Bad Request (Email déjà utilisé)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'auth service update '});
        this.emailExists=true;
      }
      console.log(error)
    });
    this.listUserComponent.showForm="Ajouter"
  }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get email() { return this.RegisterForm.get('email'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get password() { return this.RegisterForm.get('password'); }
  get verifypassword() { return this.RegisterForm.get('verifypassword'); }
  get role() { return this.RegisterForm.get('role'); }
  get service_id() { return this.RegisterForm.get('service_id'); }
  constructor(private router: Router, private AuthService: AuthService,private messageService: MessageService,private servService:ServService,private listUserComponent:ListUserComponent) { }

  ngOnInit(): void {

    this.servService.getAll().subscribe((data) => {
     this.Services=data;
      })
  let idu :any= JSON.parse(localStorage.getItem('updateUser'))._id 
  console.log("JE SAIS PAS ")
  console.log(idu)
   this.AuthService.getById(idu).subscribe((data)=>{
     console.log(jwt_decode(data['userToken'])['userFromDb'])
   
     this.userupdate= jwt_decode(data['userToken'])['userFromDb']
   },(err)=>console.log(err))
  
    if(localStorage.getItem("token")!=null){
      jwt_decode : jwt_decode; 
   
      let decodeToken:any =jwt_decode(localStorage.getItem("token"))
     this.User_role = decodeToken.role;
    
     
    }
    if(this.User_role =="admin"){
      this.IsAdmin = true
      console.log(this.IsAdmin);
    }
    else{this.IsAdmin == false};
    console.log("+"+this.IsAdmin);
 
  }

}