import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Entreprise } from 'src/app/models/Entreprise';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-add-entreprise',
  templateUrl: './add-entreprise.component.html',
  styleUrls: ['./add-entreprise.component.scss']
})
export class AddEntrepriseComponent implements OnInit {

  display: boolean;

  formAddEntreprise: FormGroup;

  choiceList = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false },
  ];

  commercials: any[] = [{ label: 'Choisir le commercial référent', value: null }];

  civiliteList = environment.civilite;

  formSteps: any[] = [
    { label: "Entreprise", icon: "pi pi-sitemap", i: 0 },
    { label: "Representant", icon: "pi pi-user", i: 1 },
  ];

  ActiveIndex = 0;

  categorieList = [
    'Sous-traitant',
    "Alternant",
    "Prestataire",
    "Autre"
  ];

  userConnected: User;
  token: any;

  constructor(private entrepriseService: EntrepriseService, private userService: AuthService ,private formBuilder: FormBuilder, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    // décodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // recuperation de la liste des commercials
    this.userService.getAllCommercial().subscribe({
      next: (response) => { 
        response.forEach((commercial: User) => {
          this.commercials.push({ label: `${commercial.firstname} ${commercial.lastname}`, value: commercial._id });
        });
      },
      error: (error) => { this.messageService.add({ severity: 'error', summary: 'Commerciaux', detail: "Impossible de récuperé la liste des commerciaux" }); },
      complete: () => { console.log('Liste des commerciaux récuperé'); }
    });

    // recuperation de l'utilisateur connecté
    this.userService.getInfoById(this.token.id).subscribe({
      next: (response) => { this.userConnected = response; },
      error: (error) => { console.log(error) },
      complete: () => { console.log('Utilisateur connecté récupéré')}
    });

    //Initialisation du formulaire d'ajout d'une entreprisei
    this.onInitFormAddEntreprise();
  }

  //methode d'initialisation du formulaire d'ajout d'une entreprise
  onInitFormAddEntreprise() {
    this.formAddEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      // fm_juridique: [''],
      activite: ['', Validators.required],
      // type_ent: [''],
      categorie: [[], Validators.required],
      isInterne: [false, Validators.required],
      crc: [''], 
      nb_salarie: [''],
      convention: [''],
      idcc: [''], 
      indicatif_ent: ['', Validators.required],
      phone_ent: ['', Validators.required],
      adresse_ent: ['', Validators.required],
      code_postale_ent: ['', Validators.required],
      ville_ent: ['', Validators.required],
      adresse_ec: [''],
      postal_ec: [''],
      ville_ec: [''],  
      siret: [''],
      code_ape_naf: [''],
      // num_tva: [''],
      // telecopie: [''],
      OPCO: [''],
      // organisme_prevoyance: [''],
      commercial: [this.commercials[0].value],

      civilite_rep: [this.civiliteList[0]],
      nom_rep: [''],
      prenom_rep: [''],
      email_rep: ['', Validators.email],
      indicatif_rep: [''],
      phone_rep: [''],
    })
  }

  nextPage() {
    this.ActiveIndex++
  }

  previousPage() {
    this.ActiveIndex--
  }

  //Methode d'ajout d'une entreprise
  onAddEntreprise() {
    //recuperation des données du formulaire
    let r_sociale = this.formAddEntreprise.get('r_sociale')?.value;
    // let fm_juridique = this.formAddEntreprise.get('fm_juridique')?.value;
    let activite = this.formAddEntreprise.get('activite')?.value;
    // let type_ent = this.formAddEntreprise.get('type_ent')?.value;
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
    // let num_tva = this.formAddEntreprise.get('num_tva')?.value;
    // let telecopie = this.formAddEntreprise.get('telecopie')?.value;
    let opco = this.formAddEntreprise.get('OPCO')?.value;
    // let organisme_prevoyance = this.formAddEntreprise.get('organisme_prevoyance')?.value;
    let commercial_id = this.formAddEntreprise.get('commercial')?.value;

    let civilite_rep = this.formAddEntreprise.get('civilite_rep')?.value;
    let nom_rep = this.formAddEntreprise.get('nom_rep')?.value;
    let prenom_rep = this.formAddEntreprise.get('prenom_rep')?.value;
    let email_rep = this.formAddEntreprise.get('email_rep')?.value;
    let indicatif_rep = this.formAddEntreprise.get('indicatif_rep').value;
    let phone_rep = this.formAddEntreprise.get('phone_rep').value;

    let entreprise = new Entreprise()

    entreprise.r_sociale = r_sociale;
    entreprise.activite = activite;
    entreprise.categorie = categorie;
    entreprise.isInterne = isInterne;
    entreprise.crc = crc;
    entreprise.nb_salarie = nb_salarie;
    entreprise.convention = convention;
    entreprise.idcc = idcc;
    entreprise.indicatif_ent = indicatif_ent;
    entreprise.phone_ent = phone_ent;
    entreprise.adresse_ent = adresse_ent;
    entreprise.code_postale_ent = code_postale_ent;
    entreprise.ville_ent = ville_ent;
    entreprise.adresse_ec = adresse_ec;
    entreprise.postal_ec = postal_ec;
    entreprise.ville_ec = ville_ec;
    entreprise.siret = siret;
    entreprise.code_ape_naf = code_ape_naf;
    entreprise.OPCO = opco;
    entreprise.commercial_id = commercial_id;
    

    let representant = new User(
      null,
      prenom_rep,
      nom_rep, 
      indicatif_rep,
      phone_rep,
      null,
      email_rep, 
      null,
      'user',
      false,
      null,
      civilite_rep.value,
      null,
      null,
      // 'Représentant',
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
        this.messageService.add({ severity: 'success', summary: 'Entreprise', detail: "Entreprise ajouté" });
        this.formAddEntreprise.reset();
        this.ActiveIndex = 0;
      }),
      ((error) => { 
        this.messageService.add({ severity: 'error', summary: 'Entreprise', detail: "Ajout impossible, verifiez que l'entreprise n'existe pas déjà, ou que les données sont bien saisies. Si le problème persiste veuillez contacter un administrateur via la solution ticketing" });
        console.error(error); 
      })
    );
  }

}
