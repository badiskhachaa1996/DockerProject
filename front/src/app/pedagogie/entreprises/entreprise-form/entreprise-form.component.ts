import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { retry } from 'rxjs';
import { Entreprise } from 'src/app/models/Entreprise';
import { User } from 'src/app/models/User';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entreprise-form',
  templateUrl: './entreprise-form.component.html',
  styleUrls: ['./entreprise-form.component.scss']
})
export class EntrepriseFormComponent implements OnInit {

  // url du logo dans le dossier du projet
  logoSrc: string;
  etape1Src: string;
  etape2Src: string;
  etape3Src: string;


  // étape du formulaire
  formSteps: any[] = [
    { label: "Entreprise", icon: "pi pi-sitemap", i: 0 },
    { label: "Représentant", icon: "pi pi-user", i: 1 },
  ];

  categorieList = [
    'Sous-traitant',
    "Alternant",
    "Prestataire",
    "Autre"
  ]
  civiliteList = environment.civilite;

  ActiveIndex = 0;

  formAddEntreprise: FormGroup;
  showFormAddEntreprise: boolean = true;
  showEndArea: boolean = false;

  commercialId: string;

  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private activatedRoute: ActivatedRoute, private entrepriseService: EntrepriseService) { }

  ngOnInit(): void {
    // initialisation des src imgs
    this.logoSrc = 'assets/images/logo-ims-new.png';
    this.etape1Src = 'assets/images/etape1.png';
    this.etape2Src = 'assets/images/etape2.png';
    this.etape3Src = 'assets/images/etape3.png';

    // recuperation de l'identifiant dans l'url
    this.commercialId = this.activatedRoute.snapshot.paramMap.get('id');

    // initialisation du formulaire de mise à jour d'une entreprise
    this.formAddEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      activite: ['', Validators.required],
      categorie: [[], Validators.required],
      crc: ['', Validators.required], 
      nb_salarie: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      convention: ['', Validators.required],
      idcc: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      indicatif_ent: ['', [Validators.pattern('^[0-9]+$')]],
      phone_ent: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      adresse_ent: ['', Validators.required],
      code_postale_ent: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      ville_ent: ['', Validators.required],
      adresse_ec: ['', Validators.required],
      postale_ec: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      ville_ec: ['', Validators.required],  
      siret: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      code_ape_naf: ['', [Validators.required]],
      OPCO: ['', Validators.required],
      commercial: ['', Validators.required],

      civilite_rep: [this.civiliteList[0]],
      nom_rep: ['', Validators.required],
      prenom_rep: ['', Validators.required],
      email_rep: ['', [Validators.required,   Validators.email, Validators.email]],
      indicatif_rep: ['', [Validators.pattern('^[0-9]+$')]],
      phone_rep: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    })
  }

  nextPage() 
  {
    this.ActiveIndex++
  }

  previousPage() 
  {
    this.ActiveIndex--
  }

  //**** Première partie du formulaire ***//
  get r_sociale() { return this.formAddEntreprise.get('r_sociale'); }
  get activite() { return this.formAddEntreprise.get('activite'); }
  get categorie() { return this.formAddEntreprise.get('categorie').value; }
  get crc() { return this.formAddEntreprise.get('crc'); }
  get nb_salarie() { return this.formAddEntreprise.get('nb_salarie'); }
  get convention() { return this.formAddEntreprise.get('convention'); }
  get idcc() { return this.formAddEntreprise.get('idcc'); }
  get indicatif_ent() { return this.formAddEntreprise.get('indicatif_ent'); }
  get phone_ent() { return this.formAddEntreprise.get('phone_ent'); }
  get adresse_ent() { return this.formAddEntreprise.get('adresse_ent'); }
  get code_postale_ent() { return this.formAddEntreprise.get('code_postale_ent'); }
  get ville_ent() { return this.formAddEntreprise.get('ville_ent'); }
  get adresse_ec() { return this.formAddEntreprise.get('adresse_ec'); } 
  get postale_ec() { return this.formAddEntreprise.get('postale_ec'); }
  get ville_ec() { return this.formAddEntreprise.get('ville_ec'); }
  get siret() { return this.formAddEntreprise.get('siret'); }
  get code_ape_naf() { return this.formAddEntreprise.get('code_ape_naf'); }
  get OPCO() { return this.formAddEntreprise.get('OPCO'); }

  //**** Deuxième partie du formulaire ***//
  get civilite_rep() { return this.formAddEntreprise.get('civilite_rep').value ;}
  get nom_rep() { return this.formAddEntreprise.get('nom_rep'); }
  get prenom_rep() { return this.formAddEntreprise.get('prenom_rep'); }
  get email_rep() { return this.formAddEntreprise.get('email_rep'); }
  get indicatif_rep () { return this.formAddEntreprise.get('indicatif_rep'); }
  get phone_rep() { return this.formAddEntreprise.get('phone_rep'); }
  
  
    // méthode d'ajout des entreprises
  onAddEntreprise(): void
  {
    //recuperation des données du formulaire
    let r_sociale = this.formAddEntreprise.get('r_sociale')?.value;
    let activite = this.formAddEntreprise.get('activite')?.value;
    let categorie = this.formAddEntreprise.get('categorie')?.value;
    let isInterne = this.formAddEntreprise.get('isInterne')?.value;
    let crc = this.formAddEntreprise.get('crc')?.value;
    let nb_salarie = this.formAddEntreprise.get('nb_salarie')?.value;
    let convention = this.formAddEntreprise.get('convention')?.value;
    let idcc = this.formAddEntreprise.get('idcc')?.value;
    let indicatif_ent = this.formAddEntreprise.get('indicatif_ent')?.value;
    let phone_ent = this.formAddEntreprise.get('phone_ent')?.value;
    let adresse_ent = this.formAddEntreprise.get('adresse_ent')?.value;
    let code_postale_ent = this.formAddEntreprise.get('code_postale_ent')?.value
    let ville_ent = this.formAddEntreprise.get('ville_ent')?.value;
    let adresse_ec = this.formAddEntreprise.get('adresse_ec')?.value;
    let postal_ec = this.formAddEntreprise.get('postal_ec')?.value;
    let ville_ec = this.formAddEntreprise.get('ville_ec')?.value;
    let siret = this.formAddEntreprise.get('siret')?.value; 
    let code_ape_naf = this.formAddEntreprise.get('code_ape_naf')?.value;
    let opco = this.formAddEntreprise.get('OPCO')?.value;
    let commercial_id = this.commercialId;
    let civilite_rep = this.formAddEntreprise.get('civilite_rep')?.value;
    let nom_rep = this.formAddEntreprise.get('nom_rep')?.value;
    let prenom_rep = this.formAddEntreprise.get('prenom_rep')?.value;
    let email_rep = this.formAddEntreprise.get('email_rep')?.value;
    let indicatif_rep = this.formAddEntreprise.get('indicatif_rep').value;
    let phone_rep = this.formAddEntreprise.get('phone_rep').value;

    let entreprise = new Entreprise(
      null, 
      r_sociale, 
      null, 
      activite, 
      null, 
      categorie, 
      isInterne, 
      crc, 
      nb_salarie, 
      convention, 
      idcc, 
      indicatif_ent, 
      phone_ent, 
      adresse_ent, 
      code_postale_ent, 
      ville_ent, 
      adresse_ec, 
      postal_ec, 
      ville_ec, 
      siret, 
      code_ape_naf, 
      null, 
      null, 
      opco, 
      null, 
      null,
      commercial_id,
    );

    let representant = new User(
      null,
      prenom_rep,
      nom_rep, 
      indicatif_rep,
      phone_rep,
      email_rep,
      email_rep, 
      null,
      'user',
      false,
      null,
      civilite_rep.value,
      null,
      null,
      'CEO Entreprise',
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
    );

    this.entrepriseService.createEntrepriseRepresentant({'newEntreprise': entreprise, 'newRepresentant': representant}).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Entreprise', detail: response.success });
        this.formAddEntreprise.reset();
        this.ActiveIndex = 0;
        this.showFormAddEntreprise = false;
        this.showEndArea = true;
      }),
      ((error) => { 
        this.messageService.add({ severity: 'error', summary: 'Entreprise', detail: "Ajout impossible, verifiez que l'entreprise n'existe pas déjà, ou que les données sont bien saisies. Si le problème persiste veuillez contacter un administrateur via la solution ticketing" });
      })
    );
  }

}
