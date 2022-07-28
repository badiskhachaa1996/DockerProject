import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClasseService } from 'src/app/services/classe.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import { Classe } from 'src/app/models/Classe';
import { Entreprise } from 'src/app/models/Entreprise';
import { DiplomeService } from 'src/app/services/diplome.service';
import { Diplome } from 'src/app/models/Diplome';

@Component({
  selector: 'app-first-connection',
  templateUrl: './first-connection.component.html',
  styleUrls: ['./first-connection.component.scss']
})
export class FirstConnectionComponent implements OnInit {

  constructor(private router: Router, private formBuilder: FormBuilder, private AuthService: AuthService, private messageService: MessageService, private classeService: ClasseService, private entrepriseService: EntrepriseService, private ss: EventEmitterService, private diplomeService: DiplomeService) { }

  civiliteList = environment.civilite;
  dropdownClasse: any[] = [];
  dropdownEntreprise: any[] = [];
  dropdownDiplome: any[] = [];
  userConnected: User;
  nationList = environment.nationalites;
  paysList = environment.pays;
  programeFrDropdown = environment.programeFrDropdown;
  programEnDropdown = environment.programEnDropdown;
  maxYear = new Date().getFullYear() - 16
  minYear = new Date().getFullYear() - 60
  rangeYear = this.minYear + ":" + this.maxYear
  minDateCalendar = new Date("01/01/" + this.minYear)
  maxDateCalendar = new Date("01/01/" + this.maxYear)
  fr = environment.fr

  statutList = [
    { value: "Etudiant", actif: false },
    { value: "Alternant", actif: false },]

  classes: Classe[] = [];
  entreprises: Entreprise[] = [];
  RegisterForm: FormGroup;
  diplomes: Diplome[] = [];

  onInitRegisterForm() {
    this.RegisterForm = this.formBuilder.group({
      civilite: new FormControl(environment.civilite[0], [Validators.required]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      firstname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      indicatif: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      entreprise_id: new FormControl(this.dropdownEntreprise[0]),
      type: new FormControl(this.statutList[0], [Validators.required]),
      pays_adresse: new FormControl(this.paysList[0], [Validators.required, Validators.pattern('[^0-9]+')]),
      ville_adresse: new FormControl("", [Validators.required, Validators.pattern('[^0-9]+')]),
      rue_adresse: new FormControl("", [Validators.required, Validators.pattern('[^0-9]+')]),
      numero_adresse: new FormControl("", [Validators.required, Validators.pattern('[0-9]+')]),
      postal_adresse: new FormControl("", [Validators.required, Validators.pattern('[0-9]+')]),
      classe_id: new FormControl(this.dropdownClasse[0]),
      nationalite: new FormControl(this.nationList[0]),
      date_naissance: new FormControl("", Validators.required),
      entreprise: new FormControl(""),
      diplome: new FormControl(this.programeFrDropdown[0]),
    });
  }

  ngOnInit(): void {
    this.onGetAllClasses();
    this.onInitRegisterForm();
    let token = jwt_decode(localStorage.getItem("token"))

    console.log(token)
    this.AuthService.getById(token['id']).subscribe((data) => {
      console.log(data)
      this.userConnected = jwt_decode(data.userToken)['userFromDb']
      console.log(jwt_decode(data.userToken))

      this.RegisterForm.patchValue({
        lastname: this.userConnected.lastname,
        firstname: this.userConnected.firstname
      })

      if (this.userConnected.email.endsWith("@adgeducation.com")) {
        this.programeFrDropdown = environment.ADGprogrameFrDropdown;
      }
    })


  }

  onGetAllClasses() {


    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(item => {
          this.dropdownClasse.push({ nom: item.nom, value: item._id });
          this.classes[item._id] = item;
        });

      }),
      ((error) => { console.error(error) })
    );


    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => {
        response.forEach(item => {
          this.dropdownEntreprise.push({ nom: item.r_sociale, value: item._id });
          this.entreprises[response[item._id]] = item;
        });

      }),
      ((error) => { console.error(error) })
    );

    //Recuperation de la liste des diplome
    this.diplomeService.getAll().subscribe(
      ((response) => {
        response.forEach(item => {
          this.dropdownDiplome.push({ nom: item.titre, value: item._id });
          this.diplomes[item._id] = item;
        });

      }),
      ((error) => { console.error(error) })
    );
  }


  saveUser() {

    let user = new User(this.userConnected._id,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.indicatif,
      this.RegisterForm.value.phone,
      null,
      null,
      null,
      'user',//role
      null,//etat
      null,//service_id
      this.RegisterForm.value.civilite.value,
      null,
      null,
      this.RegisterForm.value.type.value,
      this.RegisterForm.value.entreprise_id?.value,
      this.RegisterForm.value.pays_adresse.value,
      this.RegisterForm.value.ville_adresse,
      this.RegisterForm.value.rue_adresse,
      this.RegisterForm.value.numero_adresse,
      this.RegisterForm.value.postal_adresse,
      this.RegisterForm.value.nationalite.value,
    )
    /* SAVE PREINSCRIT
    let inscription = new Inscription(null, this.userConnected._id,
      this.RegisterForm.get('classe_id')?.value.value,
      this.RegisterForm.value.type.value,
    )
    this.AuthService.update(user, inscription).subscribe((data: any) => {
      this.messageService.add({ severity: 'success', summary: 'Profil', detail: 'Création du Utilisateur réussie' });
    }, (error) => {
      if (error.status == 500) {
        //Bad Request (Champ non fourni)
        this.messageService.add({ severity: 'error', summary: 'Profil', detail: 'Tous les champs ne sont pas remplis' });
      } else {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Contacté un administrateur', detail: error });
      }

    });*/

    //Save Etudiant
    if (this.RegisterForm.value.nationalite.value == "" || this.RegisterForm.value.date_naissance == "") {
      this.messageService.add({ severity: 'error', summary: 'Profil', detail: 'Tous les champs ne sont pas remplis' });
    } else {
      let date = new Date(this.RegisterForm.value.date_naissance)

      let calc = -(date.getUTCFullYear() - new Date().getUTCFullYear())
      if (15 < calc && calc < 61) {

        let etudiant = new Etudiant(
          null,
          this.userConnected._id,
          null,
          "Etudiant", //statut
          this.RegisterForm.value.nationalite.value,
          this.RegisterForm.value.date_naissance,
          null,
          null,
          null,
          null,
          "",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          this.RegisterForm.value.type.value !== "Etudiant",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          this.RegisterForm.value.entreprise,
          this.RegisterForm.value.diplome.value
        )
        this.AuthService.updateEtudiant(user, etudiant).subscribe((data: any) => {
          this.messageService.add({ severity: 'success', summary: 'Profil', detail: 'Création du profil Etudiant réussie' });
          localStorage.removeItem('modify')
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.ss.connected()
            this.router.navigate(["/"]);
          });
        }, (error) => {
          if (error.status == 500) {
            //Bad Request (Champ non fourni)
            console.log("problème ici")
            console.error(error)
            this.messageService.add({ severity: 'error', summary: 'Profil', detail: 'Tous les champs ne sont pas remplis' });
          } else {
            console.error(error)
            this.messageService.add({ severity: 'error', summary: 'Contacté un administrateur', detail: error });
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Profil', detail: 'La date de naissance est trop récente ou trop vieille' });
      }

    }
  }

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get indicatif() { return this.RegisterForm.get('indicatif'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get civilite() { return this.RegisterForm.get('civilite'); }


  get type() { return this.RegisterForm.get('type').value.value; }

  get pays_adresse() { return this.RegisterForm.get('pays_adresse'); }
  get ville_adresse() { return this.RegisterForm.get('ville_adresse'); }
  get rue_adresse() { return this.RegisterForm.get('rue_adresse'); }
  get numero_adresse() { return this.RegisterForm.get('numero_adresse'); }
  get postal_adresse() { return this.RegisterForm.get('postal_adresse'); }

  get classe_id() { return this.RegisterForm.get('classe_id'); }
  get statut() { return this.RegisterForm.get('statut'); }
  get nationalite() { return this.RegisterForm.get('nationalite').value; }
  get date_naissance() { return this.RegisterForm.get('date_naissance'); }
  get entreprise() { return this.RegisterForm.get('entreprise'); }
  get diplome() { return this.RegisterForm.get('diplome'); }

}
