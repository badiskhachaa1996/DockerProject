import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CampusService } from 'src/app/services/campus.service';

import { DiplomeService } from 'src/app/services/diplome.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';

import { HistoriqueService } from 'src/app/services/historique.service';
import { ServService } from 'src/app/services/service.service';
import jwt_decode from "jwt-decode";
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Historique } from 'src/app/models/Historique';


@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {

  serviceList: any[];
  display: Boolean = false;
  currentRoot: String = this.router.url;
  IsAdmin: boolean = false;
  User_role: String;
  emailExists = false;
  roleList = environment.role;
  showForm: boolean = true;
  civiliteList = environment.civilite;
  statutList = environment.typeUser
  campusList = []
  formationList = []
  entreprisesList = []

  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(environment.civilite[0], [Validators.required]),
    lastname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    firstname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+((@estya+\.com)|(@estyagroup+\.com)|(@elitech+\.education)|(@eduhorizons+\.com)|(@adgeducation+\.com)|(@intedgroup+\.com))$")]),
    indicatif: new FormControl('', [Validators.pattern('[- +()0-9]+')]),
    phone: new FormControl('', [Validators.pattern('[- +()0-9]+')]),
    role: new FormControl('', Validators.required),
    service_id: new FormControl("", Validators.required),
    entreprise: new FormControl(""),
    type: new FormControl(this.statutList[0], [Validators.required, Validators.pattern('[^0-9]+')]),
    pays_adresse: new FormControl("", [Validators.pattern('[^0-9]+')]),
    ville_adresse: new FormControl("", [Validators.pattern('[^0-9]+')]),
    rue_adresse: new FormControl("", [Validators.pattern('[^0-9]+')]),
    postal_adresse: new FormControl("", [Validators.pattern('[0-9]+')]),
    campus: new FormControl(""),
    formation: new FormControl(""),
    departement: new FormControl('')
  })


  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get email() { return this.RegisterForm.get('email'); }
  get indicatif() { return this.RegisterForm.get('indicatif'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get role() { return this.RegisterForm.get('role').value; }
  get departement() { return this.RegisterForm.get('departement').value; }
  get service_id() { return this.RegisterForm.get('service_id'); }
  get civilite() { return this.RegisterForm.get('civilite'); }
  get pays_adresse() { return this.RegisterForm.get('pays_adresse'); }
  get ville_adresse() { return this.RegisterForm.get('ville_adresse'); }
  get rue_adresse() { return this.RegisterForm.get('rue_adresse'); }
  get numero_adresse() { return this.RegisterForm.get('numero_adresse'); }
  get postal_adresse() { return this.RegisterForm.get('postal_adresse'); }
  get entreprise() { return this.RegisterForm.get('entreprise').value.value; }
  get type() { return this.RegisterForm.get('type').value.value; }
  get campus() { return this.RegisterForm.get('campus').value.value; }
  get formation() { return this.RegisterForm.get('formation').value.value; }

  constructor(private router: Router, private AuthService: AuthService, private messageService: MessageService, private servService: ServService,
    private entrepriseService: EntrepriseService, private campusService: CampusService, private formationService: DiplomeService, private HistoriqueService: HistoriqueService) { }


  ngOnInit(): void {
    this.servService.getAll().subscribe((data) => {
      this.serviceList = data;
      this.RegisterForm.get('service_id').setValue(data[0]._id)
    })

    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.User_role = decodeToken.role;
    }
    this.IsAdmin = this.User_role == "Admin"
    if (this.User_role == "Responsable") {
      this.roleList = [{ value: "Responsable" }, { value: "Agent" }]
    } else if (this.IsAdmin) {
      this.roleList = [{ value: "Responsable" }, { value: "Agent" }, { value: "Admin" }]
    }

    this.entrepriseService.getAll().subscribe(
      ((response) => {
        response.forEach(entreprise => {
          this.entreprisesList.push({ label: entreprise.r_sociale, value: entreprise._id });
        })
        this.RegisterForm.patchValue({ entreprise: this.entreprisesList[0] })
      }),
      ((error) => { console.error(error); })
    );
    this.campusService.getAll().subscribe(data => {
      this.campusList = []
      data.forEach(element => {
        this.campusList.push({ label: element.libelle, value: element._id });
      });
      this.RegisterForm.patchValue({ campus: this.campusList[0] })
    })
    this.formationService.getAll().subscribe(data => {
      this.formationList = []
      data.forEach(element => {
        this.formationList.push({ label: element.titre, value: element._id });
      });
      this.RegisterForm.patchValue({ formation: this.formationList[0] })
    })
  }
  saveUser() {
    let user = new User(null,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.indicatif,
      this.RegisterForm.value.phone,
      this.RegisterForm.value.email,
      this.RegisterForm.value.email,
      null,
      this.RegisterForm.value.role.value,
      false,
      this.RegisterForm.value.service_id,
      this.RegisterForm.value.civilite.value,
      null,
      null,
      this.RegisterForm.value.type.value,
      this.RegisterForm.value.entreprise.value,
      this.RegisterForm.value.pays_adresse,
      this.RegisterForm.value.ville_adresse,
      this.RegisterForm.value.rue_adresse,
      this.RegisterForm.value.numero_adresse,
      this.RegisterForm.value.postal_adresse, null, null, null,
      this.RegisterForm.value.departement

    );

    if (this.router.url == "/register") {
      user.role = "user"
    }
    this.AuthService.registerAdmin(user).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Création d\'agent', detail: 'Création d\'agent réussie' });

      if (this.router.url == "/register") {
        this.router.navigateByUrl('/login')
      }
      let histo = new Historique(null, data._id, new Date(), null, this.RegisterForm.value.role.value)
      this.HistoriqueService.create(histo).subscribe(data => {
        this.messageService.add({ severity: 'success', summary: 'Message d\'inscription', detail: 'Inscription réussie' });
        this.RegisterForm.reset();
      }, (err2) => {
        console.error(err2)
      })
    }, (error) => {
      console.error(error)
      if (error.status == 400 || error.includes("400") || error.keyValue.includes("email")) {
        //Bad Request (Email déjà utilisé)
        this.messageService.add({ severity: 'error', summary: 'Erreur d\'inscription', detail: 'Email déjà utilisé' });
        this.emailExists = true;
      } else if (error.status == 500 || error.includes("500")) {
        //Bad Request (Champ non fourni)
        this.messageService.add({ severity: 'error', summary: 'Erreur d\'inscription', detail: 'Tous les champs ne sont pas remplis' });
      }
    });
  }

}
