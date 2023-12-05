import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { CommercialPartenaire } from '../../models/CommercialPartenaire';
import { Partenaire } from '../../models/Partenaire';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { PartenaireService } from '../../services/partenaire.service';
import { Entreprise } from 'src/app/models/Entreprise';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-partenaire-inscription',
  templateUrl: './partenaire-inscription.component.html',
  styleUrls: ['./partenaire-inscription.component.scss']
})
export class PartenaireInscriptionComponent implements OnInit {
  paysList = environment.pays;
  etatForm = 1;
  nationList = environment.nationalites;
  fr = environment.fr;
  civiliteList = environment.civilite;
  emailExist = false

  maxYear = new Date().getFullYear() - 16;
  minYear = new Date().getFullYear() - 50;
  rangeYear = this.minYear + ":" + this.maxYear;
  minDateCalendar = new Date("01/01/" + this.minYear);
  maxDateCalendar = new Date("01/01/" + this.maxYear);

  typeSoc =
    [
      { value: "Professionnelle" },
      { value: "Particulier" },
    ];

  formatJuridique =
    [
      { label: "EIRL", value: "EIRL" },
      { label: "EURL", value: "EURL" },
      { label: "SARL", value: "SARL" },
      { label: "SA", value: "SA" },
      { label: "SAS", value: "SAS" },
      { label: "SNC", value: "SNC" },
      { label: "Etudiant IMS", value: "Etudiant IMS" },
      { label: "Individuel", value: "Individuel" },
    ];

  pL = Math.random() * 900;


  constructor(public PartenaireService: PartenaireService, private router: Router, private messageService: MessageService, private UserService: AuthService) { }

  RegisterForm: UntypedFormGroup = new FormGroup({

    //Informations de la société
    nomSoc: new FormControl('', [Validators.required]),
    type: new UntypedFormControl(this.typeSoc[0], Validators.required),
    email_partenaire: new FormControl('', [Validators.required, Validators.email]),
    created_by :   new FormControl,
    indicatifPhone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    phone_partenaire: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    Services: new FormControl('', [Validators.required]),
    ville_ent: new FormControl("", Validators.required),
    code_postale_ent: new FormControl("", Validators.required),
    adresse_ent: new FormControl("", Validators.required),
    localisation: new FormControl('', Validators.required),
    facebook: new FormControl(""),
    site_web: new FormControl(""),
    Pays: new FormControl([], [Validators.required]),
    civilite: new FormControl(environment.civilite[0], [Validators.required]),
    lastname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    firstname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    description: new FormControl(""),
    indicatifWhatsapp: new FormControl('', [Validators.pattern('[- +()0-9]+')]),
    whatsApp: new FormControl('', [Validators.pattern('[- +()0-9]+')]),
  })

  //Récupération des informations de la société
  get nomSoc() { return this.RegisterForm.get('nomSoc'); }
  get type() { return this.RegisterForm.get('type'); }
  get email_partenaire() { return this.RegisterForm.get('email_partenaire'); }
  get indicatifPhone() { return this.RegisterForm.get('indicatifPhone'); }
  get phone_partenaire() { return this.RegisterForm.get('phone_partenaire'); }
  get Services() { return this.RegisterForm.get('Services'); }
  get adresse_ent() { return this.RegisterForm.get('adresse_ent'); }
  get code_postale_ent() { return this.RegisterForm.get('code_postale_ent'); }
  get ville_ent() { return this.RegisterForm.get('ville_ent'); }


  get Pays() { return this.RegisterForm.get('Pays'); }

  //Récupération des informations du représentant
  get civilite() { return this.RegisterForm.get('civilite'); }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }

  get whatsApp() { return this.RegisterForm.get('whatsApp'); }


  txtBtnBack = "Se connecter"
  token : any

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.PartenaireService.getNBAll().subscribe(data => {
      this.pL = data.nb
    })
    if (localStorage.getItem('token'))
      this.txtBtnBack = "Retourner à IMS"
  }


  changeEtatForm(val = 2) {
    this.etatForm += val
  }


  submitForm() {
    let u = new User(
      null,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.indicatifPhone,
      this.RegisterForm.value.phone_partenaire,
      this.RegisterForm.value.email_partenaire,
      this.RegisterForm.value.email_partenaire,
      this.generatePassword(),
      "Agent",
      true,
      null,
      this.RegisterForm.value.civilite.value,
      null,
      null,
      "Commercial",
      null
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
      null,      
      
      this.RegisterForm.value.type.value,
      this.RegisterForm.value.APE,
      this.RegisterForm.value.Services,
      this.RegisterForm.value.Pays.join(','),
      this.RegisterForm.value.whatsApp,
      this.RegisterForm.value.indicatifPhone,
      this.RegisterForm.value.indicatifWhatsapp,
      this.RegisterForm.value.site_web,
      this.RegisterForm.value.facebook,
      this.RegisterForm.value.description,
   
      null, null, null, null, null, null, null, null, null, null,

      this.RegisterForm.value.localisation, null,null, this.token.id,
      this.RegisterForm.value.code_postale_ent,
      this.RegisterForm.value.adresse_ent,
      this.RegisterForm.value.ville_ent,
    )
p.date_creation = new Date()
    let c = new CommercialPartenaire(null, null, null, p.code_partenaire + "001", "Admin", true, null, this.RegisterForm.value.whatsApp, null, this.RegisterForm.value.localisation)

    this.PartenaireService.inscription(u, p, c).subscribe(data => {
      console.log(data)
      this.messageService.add({ severity: 'success', summary: 'Partenaire crée', detail: "Votre demande a été envoyé au responsable du service\nPour toute question merci de contacter: orientation.aa@intedgroup.com" });
    }, error => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Une erreur a été detecté', detail: error });
    })
  }

  verifEmailInBD() {
    this.emailExist = false
    this.UserService.getByEmail(this.RegisterForm.value.email).subscribe((dataMail) => {
      if (dataMail) {
        this.emailExist = true
        this.messageService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: "L'inscription ne pourra pas être finalisé" });
        return true
      }
    },
      (error) => {
        return false
      })
  }

  generateCode() {
    /*let random = Math.random().toString(36).substring(0, 3).toUpperCase();

    let prenom = firstname.replace(/[^a-z0-9]/gi, '').substr(0, 1).toUpperCase();

    return prenom + random;*/

    let n = (this.pL + 1).toString().substring(0, 3)
    while (n.length < 3) {
      n = "0" + n
    }
    let pays = this.RegisterForm.value.Pays[0].toUpperCase().substring(0, 3)
    return "EHP" + pays + n
  };

  generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-$&@0123456789_-$&@0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
  }

  redirectTo() {
    this.router.navigate(["admin/partenaire"])
  };

}

