import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { DropdownModule } from 'primeng/dropdown';
import { AuthService } from 'src/app/services/auth.service';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { ServService } from 'src/app/services/service.service';
import { Service } from 'src/app/models/Service';
import { SelectableRow } from 'primeng/table';
import { ListUserComponent } from '../list-user/list-user.component';
import { ClasseService } from 'src/app/services/classe.service';
@Component({
  selector: 'app-upduser',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateUserComponent implements OnInit {
  Services: Service[]
  currentRoot: String = this.router.url;
  IsAdmin: boolean = false;
  Roles = environment.role;
  showForm: boolean = true;
  civiliteList = environment.civilite;
  statutList = environment.typeUser
  campusList = environment.campus
  formationList = environment.formations
  entreprisesList =environment.entreprisesList

  userupdate: User = null;


  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(this.civiliteList[0], [Validators.required]),
    lastname: new FormControl(this.listUserComponent.selectedUser.lastname, [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname: new FormControl(this.listUserComponent.selectedUser.firstname, [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    phone: new FormControl(this.listUserComponent.selectedUser?.phone, [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    adresse: new FormControl(this.listUserComponent.selectedUser?.adresse, [Validators.required]),
    role: new FormControl(this.listUserComponent.selectedUser.role, [Validators.required]),
    service_id: new FormControl(this.listUserComponent.selectedUser.service_id, [Validators.required]),
    entreprise : new FormControl({value:this.listUserComponent.selectedUser.entreprise}),
    type: new FormControl({value:this.listUserComponent.selectedUser.type}, [Validators.required]),
    campus: new FormControl({value:this.listUserComponent.selectedUser.campus}),
    formation : new FormControl('')
  })

  UpdateUser() {
    let user = new User(
      this.userupdate._id,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.phone,
      this.RegisterForm.value.email,
      null,
      this.RegisterForm.value.role.value || "user",
      null,
      this.RegisterForm.value.adresse,
      this.RegisterForm.value.service_id,
      this.RegisterForm.value.civilite.value,
      null,
      null,
      this.RegisterForm.value.campus.value,
      this.RegisterForm.value.type.value,
      this.RegisterForm.value.formation._id,
      this.RegisterForm.value.entreprise.value)
    this.AuthService.update(user).subscribe((data) => {
      this.listUserComponent.tabUser.splice(this.listUserComponent.tabUser.indexOf(this.listUserComponent.selectedUser), 1, data)
      this.messageService.add({ severity: 'success', summary: 'Message de modification', detail: 'Cette utilisateur a bien été modifié' });
    }, (error) => {
      console.error(error)
    });
    this.listUserComponent.showFormModify = false
  }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get role() { return this.RegisterForm.get('role'); }
  get service_id() { return this.RegisterForm.get('service_id'); }
  get civilite() { return this.RegisterForm.get('civilite'); }
  get entreprise() { return this.RegisterForm.get('entreprise').value.value; }
  get type() { return this.RegisterForm.get('type').value.value; }
  get campus() { return this.RegisterForm.get('campus').value.value; }
  get formation() { return this.RegisterForm.get('formation').value.value; }
  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private servService: ServService, private listUserComponent: ListUserComponent,private ClasseService:ClasseService) { }

  ngOnInit(): void {

    this.servService.getAll().subscribe((data) => {
      this.Services = data;
      this.Services.forEach(civ => {
        if (civ._id == this.listUserComponent.selectedUser.service_id) {
          this.RegisterForm.get("service_id").setValue(civ)
        }
      })
      if(this.RegisterForm.get("service_id").value==null){
        this.RegisterForm.get("service_id").setValue(this.Services[0])
      }
    })

    this.AuthService.getById(this.listUserComponent.selectedUser._id).subscribe((data) => {
      this.userupdate = jwt_decode(data['userToken'])['userFromDb']
    }, (err) =>{
      console.error(err)
    })

    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.IsAdmin = decodeToken.role == "Admin"
    }
    this.civiliteList.forEach(civ => {
      if (civ.value == this.listUserComponent.selectedUser.civilite) {
        this.RegisterForm.get("civilite").setValue(civ)
      }
    })

    this.Roles.forEach(civ => {
      if (civ.value == this.listUserComponent.selectedUser.role) {
        this.RegisterForm.get("role").setValue(civ)
      }
    })

    this.ClasseService.seeAll().subscribe((data)=>{
      this.formationList = data;
    })

    this.ClasseService.getAll().subscribe((data)=>{
      data.forEach(element => {
        if(element._id==this.listUserComponent.selectedUser.formation){
          this.RegisterForm.patchValue({
            formation: element
          })
        }
      });
    })

  }

}