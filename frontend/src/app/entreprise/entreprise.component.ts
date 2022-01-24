import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { subscribeOn } from 'rxjs/operators';
import { Entreprise } from '../models/Entreprise';
import { EntrepriseService } from '../services/entreprise.service';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.css']
})
export class EntrepriseComponent implements OnInit {

  entreprises: Entreprise[] = [];

  formAddEntreprise: FormGroup;
  showFormAddEntreprise: boolean = false;

  formUpdateEntreprise: FormGroup;
  showFormUpdateEntreprise: boolean = false;

  entrepriseToUpdate: Entreprise;
  idEntrepriseToUpdate: string;


  constructor(private entrepriseService: EntrepriseService, private formBuilder: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {


    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => { this.entreprises = response; }),
      ((error) => { console.log(error); })
    );

    //Initialisation du formulaire d'ajout d'une entreprise
    this.onInitFormAddEntreprise();

    //Initialisation du formulaire de mise à jour d'une entreprise
    this.onInitFormUpdateEntreprise();

  }


  //methode d'initialisation du formulaire d'ajout d'une entreprise
  onInitFormAddEntreprise() {
    this.formAddEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      fm_juridique: [''],
      vip: [''],
      type_ent: [''],
      isInterne: [false],
      siret: [''],
      code_ape_naf: [''],
      num_tva: [''],
      nom_contact: [''],
      prenom_contact: [''],
      fc_contact: [''],
      email_contact: [''],
      phone_contact: [''],
      nom_contact_2nd: [''],
      prenom_contact_2nd: [''],
      fc_contact_2nd: [''],
      email_contact_2nd: [''],
      phone_contact_2nd: [''],
      pays_adresse: [''],
      ville_adresse: [''],
      rue_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      email: [''],
      phone: [''],
      website: [''],
      financeur: [''],
    })
  }

  //Methode d'ajout d'une entreprise
  onAddEntreprise() {
    //recuperation des données du formulaire
    let r_sociale = this.formAddEntreprise.get('r_sociale')?.value;
    let fm_juridique = this.formAddEntreprise.get('fm_juridique')?.value;
    let vip = this.formAddEntreprise.get('vip')?.value;
    let type_ent = this.formAddEntreprise.get('type_ent')?.value;
    let isInterne = this.formAddEntreprise.get('isInterne')?.value;
    let siret = this.formAddEntreprise.get('siret')?.value;
    let code_ape_naf = this.formAddEntreprise.get('code_ape_naf')?.value;
    let num_tva = this.formAddEntreprise.get('num_tva')?.value;
    let nom_contact = this.formAddEntreprise.get('nom_contact')?.value;
    let prenom_contact = this.formAddEntreprise.get('prenom_contact')?.value;
    let fc_contact = this.formAddEntreprise.get('fc_contact')?.value;
    let email_contact = this.formAddEntreprise.get('email_contact')?.value;
    let phone_contact = this.formAddEntreprise.get('phone_contact')?.value;
    let nom_contact_2nd = this.formAddEntreprise.get('nom_contact_2nd')?.value;
    let prenom_contact_2nd = this.formAddEntreprise.get('prenom_contact_2nd')?.value;
    let fc_contact_2nd = this.formAddEntreprise.get('fc_contact_2nd')?.value;
    let email_contact_2nd = this.formAddEntreprise.get('email_contact_2nd')?.value;
    let phone_contact_2nd = this.formAddEntreprise.get('phone_contact_2nd')?.value;
    let pays_adresse = this.formAddEntreprise.get('pays_adresse')?.value;
    let ville_adresse = this.formAddEntreprise.get('ville_adresse')?.value;
    let rue_adresse = this.formAddEntreprise.get('rue_adresse')?.value;
    let numero_adresse = this.formAddEntreprise.get('numero_adresse')?.value;
    let postal_adresse = this.formAddEntreprise.get('postal_adresse')?.value;
    let email = this.formAddEntreprise.get('email')?.value;
    let phone = this.formAddEntreprise.get('phone')?.value;
    let website = this.formAddEntreprise.get('website')?.value;
    let financeur = this.formAddEntreprise.get('financeur')?.value;

    let entreprise = new Entreprise(null, r_sociale, fm_juridique, vip, type_ent, isInterne, siret, code_ape_naf, num_tva, nom_contact, prenom_contact, fc_contact, email_contact, phone_contact, nom_contact_2nd, prenom_contact_2nd, fc_contact_2nd, email_contact_2nd, phone_contact_2nd, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse, email, phone, website, financeur);

    this.entrepriseService.create(entreprise).subscribe(
      ((response) => {

        this.messageService.add({ severity: 'success', summary: 'Ajout de l\entreprise' });

        //Recuperation de la liste des entreprises
        this.entrepriseService.getAll().subscribe(
          ((entreprisesFromDb) => { this.entreprises = entreprisesFromDb; }),
          ((error) => { console.log(error); })
        );

      }),
      ((error) => { console.log(error); })
    );

    this.showFormAddEntreprise = false;
  }

  //Methode d'initialisation du formulaire de mise à jour d'une entreprise
  onInitFormUpdateEntreprise()
  { 
    this.formUpdateEntreprise = this.formBuilder.group({
      r_sociale: ['', Validators.required],
      fm_juridique: [''],
      vip: [''],
      type_ent: [''],
      isInterne: [false],
      siret: [''],
      code_ape_naf: [''],
      num_tva: [''],
      nom_contact: [''],
      prenom_contact: [''],
      fc_contact: [''],
      email_contact: [''],
      phone_contact: [''],
      nom_contact_2nd: [''],
      prenom_contact_2nd: [''],
      fc_contact_2nd: [''],
      email_contact_2nd: [''],
      phone_contact_2nd: [''],
      pays_adresse: [''],
      ville_adresse: [''],
      rue_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      email: [''],
      phone: [''],
      website: [''],
      financeur: [''],
    }); 
  }


  //Methode de modification d'une entreprise
  onUpdateEntreprise()
  {
        //recuperation des données du formulaire
        let r_sociale = this.formUpdateEntreprise.get('r_sociale')?.value;
        let fm_juridique = this.formUpdateEntreprise.get('fm_juridique')?.value;
        let vip = this.formUpdateEntreprise.get('vip')?.value;
        let type_ent = this.formUpdateEntreprise.get('type_ent')?.value;
        let isInterne = this.formUpdateEntreprise.get('isInterne')?.value;
        let siret = this.formUpdateEntreprise.get('siret')?.value;
        let code_ape_naf = this.formUpdateEntreprise.get('code_ape_naf')?.value;
        let num_tva = this.formUpdateEntreprise.get('num_tva')?.value;
        let nom_contact = this.formUpdateEntreprise.get('nom_contact')?.value;
        let prenom_contact = this.formUpdateEntreprise.get('prenom_contact')?.value;
        let fc_contact = this.formUpdateEntreprise.get('fc_contact')?.value;
        let email_contact = this.formUpdateEntreprise.get('email_contact')?.value;
        let phone_contact = this.formUpdateEntreprise.get('phone_contact')?.value;
        let nom_contact_2nd = this.formUpdateEntreprise.get('nom_contact_2nd')?.value;
        let prenom_contact_2nd = this.formUpdateEntreprise.get('prenom_contact_2nd')?.value;
        let fc_contact_2nd = this.formUpdateEntreprise.get('fc_contact_2nd')?.value;
        let email_contact_2nd = this.formUpdateEntreprise.get('email_contact_2nd')?.value;
        let phone_contact_2nd = this.formUpdateEntreprise.get('phone_contact_2nd')?.value;
        let pays_adresse = this.formUpdateEntreprise.get('pays_adresse')?.value;
        let ville_adresse = this.formUpdateEntreprise.get('ville_adresse')?.value;
        let rue_adresse = this.formUpdateEntreprise.get('rue_adresse')?.value;
        let numero_adresse = this.formUpdateEntreprise.get('numero_adresse')?.value;
        let postal_adresse = this.formUpdateEntreprise.get('postal_adresse')?.value;
        let email = this.formUpdateEntreprise.get('email')?.value;
        let phone = this.formUpdateEntreprise.get('phone')?.value;
        let website = this.formUpdateEntreprise.get('website')?.value;
        let financeur = this.formUpdateEntreprise.get('financeur')?.value;
    
        let entreprise = new Entreprise(this.entrepriseToUpdate._id, r_sociale, fm_juridique, vip, type_ent, isInterne, siret, code_ape_naf, num_tva, nom_contact, prenom_contact, fc_contact, email_contact, phone_contact, nom_contact_2nd, prenom_contact_2nd, fc_contact_2nd, email_contact_2nd, phone_contact_2nd, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse, email, phone, website, financeur);
    
        this.entrepriseService.update(entreprise).subscribe(
          ((response) => { 

            this.messageService.add({ severity: 'success', summary: 'Entreprise modifiée' });

            //Recuperation de la liste des entreprises
            this.entrepriseService.getAll().subscribe(
              ((entreprisesFromDb) => { this.entreprises = entreprisesFromDb; }),
              ((error) => { console.log(error); })
            );

            this.resetForms();
            this.showFormUpdateEntreprise = false;

           }),
          ((error) => { console.log(error); })
        );

  }


  //Recuperation de l'entreprise à mettre à jour
  onGetbyId()
  {
    //Recuperation de l'entreprise à modifier
    this.entrepriseService.getById(this.idEntrepriseToUpdate).subscribe(
      ((response) => { 
        this.entrepriseToUpdate = response; 
        this.formUpdateEntreprise.patchValue({ r_sociale: this.entrepriseToUpdate.r_sociale, fm_juridique: this.entrepriseToUpdate.fm_juridique, vip: this.entrepriseToUpdate.vip, type_ent: this.entrepriseToUpdate.type_ent, isInterne: this.entrepriseToUpdate.isInterne, siret: this.entrepriseToUpdate.siret, code_ape_naf: this.entrepriseToUpdate.code_ape_naf, num_tva: this.entrepriseToUpdate.num_tva, nom_contact: this.entrepriseToUpdate.nom_contact, prenom_contact: this.entrepriseToUpdate.prenom_contact, fc_contact: this.entrepriseToUpdate.fc_contact, email_contact: this.entrepriseToUpdate.email_contact, phone_contact: this.entrepriseToUpdate.phone_contact, nom_contact_2nd: this.entrepriseToUpdate.nom_contact_2nd, prenom_contact_2nd: this.entrepriseToUpdate.prenom_contact_2nd, fc_contact_2nd: this.entrepriseToUpdate.fc_contact_2nd, email_contact_2nd: this.entrepriseToUpdate.email_contact_2nd, phone_contact_2nd: this.entrepriseToUpdate.phone_contact_2nd, pays_adresse: this.entrepriseToUpdate.pays_adresse, ville_adresse: this.entrepriseToUpdate.ville_adresse, rue_adresse: this.entrepriseToUpdate.rue_adresse, numero_adresse: this.entrepriseToUpdate.numero_adresse, postal_adresse: this.entrepriseToUpdate.postal_adresse, email: this.entrepriseToUpdate.email, phone: this.entrepriseToUpdate.phone, website: this.entrepriseToUpdate.website, financeur: this.entrepriseToUpdate.financeur });
      }),
      ((error) => { console.log(error); })
    );
  }

  resetForms()
  { 
    this.formAddEntreprise.reset();
    this.formUpdateEntreprise.reset();
  }

}
