import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-firstconnection',
  templateUrl: './firstconnection.component.html',
  styleUrls: ['./firstconnection.component.css']
})
export class FirstconnectionComponent implements OnInit {

  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private ClasseService:ClasseService) { }

  civiliteList = environment.civilite;
  userConnected: User;

  statutList = environment.typeUser

  campusList = environment.campus

  formationList = environment.formations

  entreprisesList =environment.entreprisesList

  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(environment.civilite[0], [Validators.required]),
    lastname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),//Lettre et espace
    firstname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),//Si il finit par .png ou .jpg
    phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    adresse: new FormControl('', [Validators.required]),
    entreprise : new FormControl(this.entreprisesList[0]),
    type: new FormControl(this.statutList[0], [Validators.required]),
    campus: new FormControl(this.campusList[0]),
    formation : new FormControl('')
  })

  ngOnInit(): void {
    let token = jwt_decode(localStorage.getItem("token"))
    if (token) {
      this.AuthService.getById(token['id']).subscribe((data) => {
        this.userConnected = jwt_decode(data.userToken)['userFromDb']
        console.log(this.userConnected)
        if (this.userConnected.adresse == null || this.userConnected.phone == null || this.userConnected.civilite == null ||this.userConnected.type == null) {
          this.RegisterForm.patchValue({
            lastname: this.userConnected.lastname,
            firstname: this.userConnected.firstname })
        } else {
          this.router.navigateByUrl('/ticket/suivi')
        }
      })
    } else {
      this.router.navigateByUrl('/login')
    }

    this.ClasseService.seeAll().subscribe((data)=>{
      this.formationList = data;
      this.RegisterForm.patchValue({
        formation: data[0]
      })
    })

  }

  saveUser() {
    let user = new User(this.userConnected._id,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.phone,
      null,
      null,
      'user',
      null,
      this.RegisterForm.value.adresse,
      null,
      this.RegisterForm.value.civilite.value,
      null,
      null,
      this.RegisterForm.value.campus.value,
      this.RegisterForm.value.type.value,
      this.RegisterForm.value.formation._id,
      this.RegisterForm.value.entreprise.value
    )
    this.AuthService.update(user).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Profil', detail: 'Création du profil réussie' });
      localStorage.removeItem('modify')
      window.location.reload();
    }, (error) => {
      if (error.status == 500 || error.includes("500")) {
        //Bad Request (Champ non fourni)
        this.messageService.add({ severity: 'error', summary: 'Profil', detail: 'Tous les champs ne sont pas remplis' });
      } else {
        console.log(error)
        this.messageService.add({ severity: 'error', summary: 'Contacté un administrateur', detail: error });
      }

    });
  }

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get civilite() { return this.RegisterForm.get('civilite'); }

  get entreprise() { return this.RegisterForm.get('entreprise').value.value; }
  get type() { return this.RegisterForm.get('type').value.value; }
  get campus() { return this.RegisterForm.get('campus').value.value; }
  get formation() { return this.RegisterForm.get('formation').value; }

}
