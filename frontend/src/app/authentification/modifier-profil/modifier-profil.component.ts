import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { Service } from 'src/app/models/Service';

@Component({
  selector: 'app-modifier-profil',
  templateUrl: './modifier-profil.component.html',
  styleUrls: ['./modifier-profil.component.css']
})
export class ModifierProfilComponent implements OnInit {
  Services: Service[]
  items: MenuItem[]
  Roles = environment.role;
  showForm: boolean = true;
  civiliteList = environment.civilite;
  decodeToken: any = jwt_decode(localStorage.getItem("token"))
  token = null;

  reader:FileReader = new FileReader();

  retour: boolean = false;
  toggleUpdate: boolean = false
  toggleUpdatepwd: boolean = false
  userupdate: any = this.decodeToken;
  userco: any = this.userupdate;
  imageToShow: any ="../assets/images/avatar.PNG";

  public ToggleUpdate() {
    this.toggleUpdate = !this.toggleUpdate
    this.toggleUpdatepwd = false

    this.civiliteList.forEach((civ) => {
      if (civ.value == this.userco.civilite) {
        this.RegisterForm.setValue({ lastname: this.userco.lastname, firstname: this.userco.firstname, phone: this.userco?.phone, adresse: this.userco?.adresse, civilite: civ })
      }
    })

    return this.toggleUpdate
  }
  public ToggleUpdatepwd() {
    this.toggleUpdatepwd = !this.toggleUpdatepwd
    this.toggleUpdate = false
    return this.toggleUpdatepwd
  }

  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(this.civiliteList[0], [Validators.required]),
    lastname: new FormControl(this.userupdate.lastname, [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(10), Validators.minLength(10)]),
    adresse: new FormControl('', [Validators.required]),

  })

  PwdForm: FormGroup = new FormGroup({
    passwordactual: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    verifypassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
  })

  get passwordactual() { return this.PwdForm.get('passwordactual'); }
  get password() { return this.PwdForm.get('password'); }
  get verifypassword() { return this.PwdForm.get('verifypassword'); }

  userpw: User;

  UpdatePwd() {
    this.AuthService.getById(this.userupdate.id).subscribe((data) => {
      this.userpw = jwt_decode(data['userToken'])['userFromDb']
      this.AuthService.updatePassword(this.userpw._id, {password:this.PwdForm.value.password,actualpassword:this.PwdForm.value.passwordactual}).subscribe((data) => {
        if(data.error){
          this.messageService.add({ severity: 'error', summary: 'Message de modification', detail: 'Le mot de passe actuel ne correspond pas' });
        }else{
          this.messageService.add({ severity: 'success', summary: 'Message de modification', detail: 'Mon mot de passe a bien été modifié' });
          this.toggleUpdatepwd=false;
        }
      }, (error) => {
        console.log(error)
      });
    }, (err) => console.log(err))
  }
  UpdateUser() {
    let user = new User(this.userco._id, this.RegisterForm.value.firstname, this.RegisterForm.value.lastname, this.RegisterForm.value.phone, this.userupdate.email, this.userupdate.password, this.userupdate.role, this.userupdate.etat, this.RegisterForm.value.adresse, this.userupdate.service_id, this.RegisterForm.value.civilite.value)
    this.AuthService.update(user).subscribe((data) => { 
      this.userco=data;
      this.toggleUpdate=false;
      this.messageService.add({ severity: 'success', summary: 'Message de modification', detail: 'Mon profil a bien été modifié' });

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


  onClickMenu(item: any) {
    console.log("option Modifier profil")

  }
  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private servService: ServService,) { }


  ngOnInit(): void {
    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);

    this.token = jwt_decode(localStorage.getItem("token"))

    if (this.token["role"].includes("user")) {
      this.retour = true;
    }


    let decodeToken: any = jwt_decode(localStorage.getItem("token"))
    this.userupdate = decodeToken;
    this.AuthService.getProfilePicture(decodeToken.id).subscribe((data)=>{
      if(data.error){
        this.imageToShow="../assets/images/avatar.PNG"
      }else{
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob:Blob = new Blob([byteArray], { type: data.documentType })
        if (blob) { 
          this.imageToShow="../assets/images/avatar.PNG"
          this.reader.readAsDataURL(blob);
        }
      }

    })

    this.AuthService.getById(this.userupdate.id).subscribe((data) => {

      this.userco = jwt_decode(data['userToken'])['userFromDb']

    }, (err) => console.log(err))

    this.items = [
      {
        label: 'Modifier mes informations',
        icon: 'pi pi-fw pi-refresh',
        command: (event) => {
          this.ToggleUpdate();

          //event.item: menuitem metadata
        }
      },
      {
        label: 'Changer ma photo de profil',
        icon: 'pi pi-fw pi-image',
        command: (event) => {
          document.getElementById('selectedFile').click();
        }
      },
      {
        label: 'Modifier mon mot de passe ',
        icon: 'pi pi-fw pi-lock',
        command: (event) => {
          this.ToggleUpdatepwd();
        }
      }
    ];

  }
  clickFile() {
    document.getElementById('selectedFile').click();
  }

  FileUpload(event) {
    if (event && event.length > 0) {
      const formData = new FormData();
      formData.append('file', event[0])
      formData.append('id', this.token.id)
      this.AuthService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de votre photo de profil avec succès' });
          this.imageToShow="../assets/images/avatar.PNG"
          this.reader.readAsDataURL(event[0]);
          let avoidError : any = document.getElementById('selectedFile')
          avoidError.value=""
          this.AuthService.reloadImage(this.token.id)
      }, (error) => {
        console.log(error)
      })
    }
  }

  getImage(){
    if(this.imageToShow){
      return this.imageToShow
    }else{
      return "../assets/images/avatar.PNG"
    }
  }

  showTitle(){
    if(this.toggleUpdate){
      return "Modifier mes informations"
    }else if (this.toggleUpdatepwd){
      return "Modifier mon mot de passe"
    }else{
      return "Mes informations"
    }
  }

}