import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { CommercialPartenaire } from '../models/CommercialPartenaire';
import { Partenaire } from '../models/Partenaire';
import { User } from '../models/User';
import { PartenaireService } from '../services/partenaire.service';

@Component({
  selector: 'app-partenaire-inscription',
  templateUrl: './partenaire-inscription.component.html',
  styleUrls: ['./partenaire-inscription.component.scss']
})
export class PartenaireInscriptionComponent implements OnInit {

  etatForm = 1;
  nationList = environment.nationalites;
  fr = environment.fr;
  civiliteList = environment.civilite;

  maxYear = new Date().getFullYear() - 16;
  minYear = new Date().getFullYear() - 50;
  rangeYear = this.minYear + ":" + this.maxYear;
  minDateCalendar = new Date("01/01/" + this.minYear);
  maxDateCalendar = new Date("01/01/" + this.maxYear);

  typeSoc =
    [
      { value: "Professionel (Société)" },
      { value: "Particulier (Personne)" },
    ];

  formatJuridique =
    [
      { value: "EIRL" },
      { value: "EURL" },
      { value: "SARL" },
      { value: "SA" },
      { value: "SAS" },
      { value: "SNC" },
      { value: "Etudiant IMS" },
      { value: "Individuel" },
    ];

  pL = Math.random() * 900;


  constructor(public PartenaireService: PartenaireService, private router: Router, private messageService: MessageService) { }

  RegisterForm: FormGroup = new FormGroup({

    //Informations de la société
    nomSoc: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    type: new FormControl(this.typeSoc[0]),
    format_juridique: new FormControl(this.formatJuridique[0]),
    indicatifPhone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    phone_partenaire: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14), Validators.minLength(9)]),
    email_partenaire: new FormControl('', [Validators.required, Validators.email]),
    number_TVA: new FormControl(''),
    SIREN: new FormControl('', [Validators.pattern('[0-9]+')]),
    SIRET: new FormControl('', [Validators.pattern('[0-9]+')]),
    APE: new FormControl(''),
    Services: new FormControl('', [Validators.required]),
    Pays: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),

    //Informations du représentant
    civilite: new FormControl(environment.civilite[0], [Validators.required]),
    lastname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    firstname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    whatsApp: new FormControl('', [Validators.pattern('[- +()0-9]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    date_naissance: new FormControl(""),
    nationalite: new FormControl(this.nationList[0], [Validators.required, Validators.pattern('[^0-9]+')]),
    numero_adresse: new FormControl("", [Validators.required, Validators.pattern('[0-9]+')]),
    rue_adresse: new FormControl("", [Validators.required, Validators.pattern('[^0-9]+')]),
    postal_adresse: new FormControl("", [Validators.required, Validators.pattern('[0-9]+')]),
    ville_adresse: new FormControl("", [Validators.required, Validators.pattern('[^0-9]+')]),
    pays_adresse: new FormControl("", [Validators.required, Validators.pattern('[^0-9]+')]),
    statut: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    password_confirmed: new FormControl("", [Validators.required]),
  })

  //Récupération des informations de la société
  get nomSoc() { return this.RegisterForm.get('nomSoc'); }
  get type() { return this.RegisterForm.get('type'); }
  get format_juridique() { return this.RegisterForm.get('format_juridique'); }
  get indicatifPhone() { return this.RegisterForm.get('indicatifPhone'); }
  get phone_partenaire() { return this.RegisterForm.get('phone_partenaire'); }
  get email_partenaire() { return this.RegisterForm.get('email_partenaire'); }
  get number_TVA() { return this.RegisterForm.get('number_TVA'); }
  get SIREN() { return this.RegisterForm.get('SIREN'); }
  get SIRET() { return this.RegisterForm.get('SIRET'); }
  get APE() { return this.RegisterForm.get('APE'); }
  get Services() { return this.RegisterForm.get('Services'); }
  get Pays() { return this.RegisterForm.get('Pays'); }

  //Récupération des informations du représentant
  get civilite() { return this.RegisterForm.get('civilite'); }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get whatsApp() { return this.RegisterForm.get('whatsApp'); }
  get email() { return this.RegisterForm.get('email'); }
  get date_naissance() { return this.RegisterForm.get('date_naissance'); }
  get nationalite() { return this.RegisterForm.get('nationalite'); }
  get numero_adresse() { return this.RegisterForm.get('numero_adresse'); }
  get rue_adresse() { return this.RegisterForm.get('rue_adresse'); }
  get postal_adresse() { return this.RegisterForm.get('postal_adresse'); }
  get ville_adresse() { return this.RegisterForm.get('ville_adresse'); }
  get pays_adresse() { return this.RegisterForm.get('pays_adresse'); }
  get statut() { return this.RegisterForm.get('statut'); }
  get password() { return this.RegisterForm.get('password'); }
  get password_confirmed() { return this.RegisterForm.get('password_confirmed'); }


  ngOnInit(): void {
    this.PartenaireService.getNBAll().subscribe(data => {
      this.pL = data.nb
    })
  }


  changeEtatForm(val = 1) {
    this.etatForm += val
  }


  submitForm() {
    if (this.passwordCorrect()) {
      let u = new User(
        null,
        this.RegisterForm.value.firstname,
        this.RegisterForm.value.lastname,
        "+33",//TODO Indicatif
        this.RegisterForm.value.phone,
        this.RegisterForm.value.email,
        this.RegisterForm.value.email,
        this.RegisterForm.value.password,
        "Agent",
        true,
        null,
        this.RegisterForm.value.civilite.value,
        null,
        null,
        "Commercial",
        null,
        this.RegisterForm.value.pays_adresse,
        this.RegisterForm.value.ville_adresse,
        this.RegisterForm.value.rue_adresse,
        this.RegisterForm.value.numero_adresse,
        this.RegisterForm.value.postal_adresse,
        this.RegisterForm.value.nationalite,
      )

      let p = new Partenaire(
        null,
        null,
        this.generateCode(),
        this.RegisterForm.value.nomSoc,
        this.RegisterForm.value.phone_partenaire,
        this.RegisterForm.value.email_partenaire,
        this.RegisterForm.value.number_TVA,
        this.RegisterForm.value.SIREN,
        this.RegisterForm.value.SIRET,
        this.RegisterForm.value.format_juridique.value,
        this.RegisterForm.value.type.value,
        this.RegisterForm.value.APE,
        this.RegisterForm.value.Services,
        this.RegisterForm.value.Pays,
        this.RegisterForm.value.whatsApp,
        this.RegisterForm.value.indicatifPhone,

      )

      let c = new CommercialPartenaire(null, null, null, p.code_partenaire + "001", "Admin")

      this.PartenaireService.inscription(u, p, c).subscribe(data => {
        this.messageService.add({ severity: 'success', summary: 'Partenaire ajouté' });
      }, error => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Une erreur a été detecté', detail: error });
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Mot de passe incorrect', detail: "Les mots de passe ne correspondent pas" });
    }

  }
  generateCode() {
    /*let random = Math.random().toString(36).substring(0, 3).toUpperCase();

    let prenom = firstname.replace(/[^a-z0-9]/gi, '').substr(0, 1).toUpperCase();

    return prenom + random;*/

    let n = (this.pL + 1).toString().substring(0, 3)
    while (n.length < 3) {
      n = "0" + n
    }
    let pays = this.RegisterForm.value.Pays.toUpperCase().substring(0, 3)
    return "EHP" + pays + n
  };

  passwordCorrect() {
    return this.RegisterForm.value.password == this.RegisterForm.value.password_confirmed
  };

  redirectLogin() {
    this.router.navigate(["/login"])
  };

}

