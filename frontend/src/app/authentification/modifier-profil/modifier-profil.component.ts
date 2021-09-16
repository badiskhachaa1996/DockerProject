import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from 'src/app/services/auth.service';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { ServService } from 'src/app/services/service.service';
import { Service } from 'src/app/models/Service';
import { SelectableRow } from 'primeng/table';

@Component({
  selector: 'app-modifier-profil',
  templateUrl: './modifier-profil.component.html',
  styleUrls: ['./modifier-profil.component.css']
})
export class ModifierProfilComponent implements OnInit {
  Services: Service[]
  items : MenuItem[]
  Roles = environment.role;
  showForm: boolean = true;
  civiliteList = environment.civilite;
  decodeToken: any = jwt_decode(localStorage.getItem("token"))
  token = null;

  retour: boolean = false;

  toggleUpdate:boolean =false
  userupdate: any =  this.decodeToken;
  userco : any=this.userupdate;

  public  ToggleUpdate(){
    this.toggleUpdate=!this.toggleUpdate
    return this.toggleUpdate
  }
  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(this.civiliteList[0], [Validators.required]),
    lastname: new FormControl(this.userupdate.lastname, [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]),
    adresse: new FormControl('', [Validators.required]),

  })

  PwdForm: FormGroup = new FormGroup({
    
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    verifypassword: new FormControl('', [Validators.required, Validators.minLength(5)]),

  })
  userpw : User;
  UpdatePwd(){
    this.AuthService.getById(this.userupdate.id).subscribe((data) => {
      
    this.userpw = jwt_decode(data['userToken'])['userFromDb']
      console.log(this.userpw)

    

    let Userpwd = new User(this.userco._id, this.userpw.firstname, this.userpw.lastname, this.userpw.phone, this.userpw.email, this.RegisterForm.value.password, this.userpw.role , this.userpw.etat, this.userpw.adresse, this.userpw.service_id,this.userpw.civilite)
    this.AuthService.update(Userpwd).subscribe((data) => {

      this.messageService.add({ severity: 'success', summary: 'Message de modification', detail: 'Mon profil a bien été modifié' });
      console.log(data)
    }, (error) => {
      console.log(error)
    });
  }, (err) => console.log(err) )
  }
  UpdateUser() {
    let user = new User(this.userco._id, this.RegisterForm.value.firstname, this.RegisterForm.value.lastname, this.RegisterForm.value.phone, this.userupdate.email, this.userupdate.password, this.userupdate.role , this.userupdate.etat, this.RegisterForm.value.adresse, this.userupdate.service_id,this.RegisterForm.value.civilite.value)
    this.AuthService.update(user).subscribe((data) => {

      this.messageService.add({ severity: 'success', summary: 'Message de modification', detail: 'Mon profil a bien été modifié' });
      console.log(data)
    }, (error) => {
      console.log(error)
    });
   
  }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get role() { return this.RegisterForm.get('role'); }
  get service_id() { return this.RegisterForm.get('service_id'); }
  get civilite() { return this.RegisterForm.get('civilite'); }


  onClickMenu(item: any){
    console.log("option Modifier profil")
        
  }
  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private servService: ServService,) { }

  
  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))

    if (this.token["role"].includes("User")) {
      this.retour = true;
    }


    let decodeToken: any = jwt_decode(localStorage.getItem("token"))
    this.userupdate = decodeToken;
    console.log(this.userupdate.id)

    this.AuthService.getById(this.userupdate.id).subscribe((data) => {
      
      this.userco = jwt_decode(data['userToken'])['userFromDb']
      console.log(this.userco)

    }, (err) => console.log(err) )

    this.servService.getAll().subscribe((data) => {
      this.Services = data;
      this.Services.forEach(civ=>{
        if(civ._id==this.userupdate.service_id){
          this.RegisterForm.get("service_id").setValue(civ)
        }
      })
    })
    
   
    
    this.civiliteList.forEach(civ=>{
      if(civ.value==this.userupdate.civilite){
        this.RegisterForm.get("civilite").setValue(civ)
      }
    })

    this.Roles.forEach(civ=>{
      if(civ.value==this.userupdate.role){
        this.RegisterForm.get("role").setValue(civ)
      }
    })


    this.items = [
      { label: 'Modifier mes informations', icon: 'pi pi-fw pi-refresh', command: (event) => {
       this.ToggleUpdate();
        console.log(this.toggleUpdate)
        //event.item: menuitem metadata
    }},
      { label: 'Changer ma photo de profil', icon: 'pi pi-fw pi-image' },
      { label: 'Modifier mon mot de passe ', icon: 'pi pi-fw pi-lock' }
  ];

  }

}