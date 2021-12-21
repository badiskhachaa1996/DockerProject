import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClasseService } from 'src/app/services/classe.service';
import { Inscription } from 'src/app/models/Inscription';

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

  entreprisesList =environment.entreprisesList

  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(environment.civilite[0], [Validators.required]),
    lastname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),//Lettre et espace
    firstname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),//Si il finit par .png ou .jpg
    phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    entreprise : new FormControl(this.entreprisesList[0]),
    type: new FormControl(this.statutList[0], [Validators.required]),
    pays_adresse: new FormControl("",[Validators.required]),
    ville_adresse: new FormControl("",[Validators.required]),
    rue_adresse: new FormControl("",[Validators.required]),
    numero_adresse: new FormControl("",[Validators.required]),
    postal_adresse: new FormControl("",[Validators.required]),
    classe: new FormControl(""),
    statut:new FormControl(""),
    nationalite:new FormControl("",[Validators.required]),
    date_de_naissance:new FormControl("",[Validators.required]),
  })

  ngOnInit(): void {
    let token = jwt_decode(localStorage.getItem("token"))
    if (token) {
      this.AuthService.getById(token['id']).subscribe((data) => {
        this.userConnected = jwt_decode(data.userToken)['userFromDb']
        if (this.userConnected.phone == null || this.userConnected.civilite == null ||this.userConnected.type == null) {
          this.RegisterForm.patchValue({
            lastname: this.userConnected.lastname,
            firstname: this.userConnected.firstname })
        } else {
          localStorage.removeItem("modify")
          this.router.navigateByUrl('/ticket/suivi')
        }
      })
    } else {
      this.router.navigateByUrl('/login')
    }

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
      null,
      this.RegisterForm.value.civilite.value,
      null,
      null,
      this.RegisterForm.value.type.value,
      this.RegisterForm.value.entreprise.value,
      this.RegisterForm.value.pays_adresse,
      this.RegisterForm.value.ville_adresse,
      this.RegisterForm.value.rue_adresse,
      this.RegisterForm.value.numero_adresse,
      this.RegisterForm.value.postal_adresse,
    )
    let inscription = new Inscription(null,this.userConnected._id,
      this.RegisterForm.value.classe,
      this.RegisterForm.value.statut,
  
      )
    this.AuthService.update(user,inscription).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Profil', detail: 'Création du profil réussie' });
      localStorage.removeItem('modify')
      window.location.reload();
    }, (error) => {
      if (error.status == 500) {
        //Bad Request (Champ non fourni)
        this.messageService.add({ severity: 'error', summary: 'Profil', detail: 'Tous les champs ne sont pas remplis' });
      } else {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Contacté un administrateur', detail: error });
      }

    });
  }

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get civilite() { return this.RegisterForm.get('civilite'); }

  get entreprise() { return this.RegisterForm.get('entreprise').value.value; }
  get type() { return this.RegisterForm.get('type').value.value; }

  get pays_adresse() { return this.RegisterForm.get('pays_adresse'); }
  get ville_adresse() { return this.RegisterForm.get('ville_adresse'); }
  get rue_adresse() { return this.RegisterForm.get('rue_adresse'); }
  get numero_adresse() { return this.RegisterForm.get('numero_adresse'); }
  get postal_adresse() { return this.RegisterForm.get('postal_adresse'); }

  get classe() { return this.RegisterForm.get('classe'); }
  get statut() { return this.RegisterForm.get('statut'); }
  get nationalite() { return this.RegisterForm.get('nationalite'); }
  get date_de_naissance() { return this.RegisterForm.get('date_de_naissance'); }

}
