import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Alternant } from '../models/Alternant';
import { Classe } from '../models/Classe';
import { Entreprise } from '../models/Entreprise';
import { User } from '../models/User';
import { AlternantService } from '../services/alternant.service';
import { AuthService } from '../services/auth.service';
import { ClasseService } from '../services/classe.service';
import { EntrepriseService } from '../services/entreprise.service';

@Component({
  selector: 'app-alternant',
  templateUrl: './alternant.component.html',
  styleUrls: ['./alternant.component.css']
})
export class AlternantComponent implements OnInit {

  alternants: Alternant[] = [];

  formAddAlternant: FormGroup;
  showFormAddAlternant: boolean = false;

  formUpdateAlternant: FormGroup;
  showFormUpdateAlternant: boolean = false;

  alternantToUpdate: Alternant;
  idAlternantToUpdate: string;
  idUserOfAlternantToUpdate: string;

  users: User[]= [];
  dropdownUser: any[] = [{ libelle: "Toutes les utilisateurs", value: null }];

  classes: Classe[]= [];
  dropdownClasse: any[] = [{ libelle: "Toutes les Classes", value: null }];

  entreprises: Entreprise[]= [];
  dropdownEntreprise: any[] = [{ libelle: "Toutes les Entreprises", value: null }];

  civiliteList = environment.civilite;
  statutList = environment.profil;

  //Information a modifier dans le formulaire de modification
  roleToUpdate: string;
  statutToUpdate : string;
  classeToUpdate : string;
  entrepriseToUpdate : string;

  dropdownRole: any[] = [
    { libelle: "Utilisateur", value: "user"},
    { libelle: "Agent", value: "Agent"}
  ];

  constructor(private formBuilder: FormBuilder, private userService: AuthService, private alternantService: AlternantService, private entrepriseService: EntrepriseService, private messageService: MessageService, private classeService: ClasseService) { }

  ngOnInit(): void {

    //Methode de recuperation de toute les listes
    this.onGetAllClasses();

    //Initialisation du formulaire d'ajout et de modification d'un alternant
    this.onInitFormAddAlternant();
    this.onInitFormUpdateAlternant();

  }


  //Methode de recuperation des differentes classes
  onGetAllClasses()
  {
    //Recuperation de la liste des users
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach(user => {
          this.dropdownUser.push({ libelle: user.lastname + ' ' + user.firstname, value: user._id });
          this.users[user._id] = user;
        })
      }),
      ((error) => { console.log(error); })
    );

    //Recuperation de la liste des classes
    this.classeService.getAll().subscribe(
      ((response) => {
        response.forEach(classe => {
          this.dropdownClasse.push({ libelle: classe.nom, value: classe._id });
          this.classes[classe._id] = classe;
        })
      }),
      ((error) => { console.log(error); })
    );

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => {
        response.forEach(entreprise => {
          this.dropdownEntreprise.push({ libelle: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
        })
      }),
      ((error) => { console.log(error); })
    );

    //Recuperation de la liste des alternants
    this.alternantService.getAll().subscribe(
      ((response) => {
        this.alternants = response;
      }),
      ((error) => { console.log(error); })
    );
  }


  //Methode d'initialisation du formulaire d'ajout d'un alternant
  onInitFormAddAlternant() {
    this.formAddAlternant = this.formBuilder.group({
      
      civilite: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      pays_adresse: ['', Validators.required],
      ville_adresse: ['', Validators.required],
      rue_adresse: ['', Validators.required],
      numero_adresse: ['', Validators.required],
      postal_adresse: ['', Validators.required],

      role: ['', Validators.required],
      classe_id: ['', Validators.required],
      statut: ['', Validators.required],
      date_de_naissance: ['', Validators.required],
      entreprise_id: ['', Validators.required],
    });
  }


  //Methode d'ajout d'un alternant
  onAddAlternant() {
    //Recuperation des données du formulaire
    let civilite = this.formAddAlternant.get('civilite')?.value.value;
    let firstname = this.formAddAlternant.get('firstname')?.value;
    let lastname = this.formAddAlternant.get('lastname')?.value;
    let phone = this.formAddAlternant.get('phone')?.value;
    let email = this.formAddAlternant.get('email')?.value;
    let pays_adresse = this.formAddAlternant.get('pays_adresse')?.value;
    let ville_adresse = this.formAddAlternant.get('ville_adresse')?.value;
    let rue_adresse = this.formAddAlternant.get('rue_adresse')?.value;
    let numero_adresse = this.formAddAlternant.get('numero_adresse')?.value;
    let postal_adresse = this.formAddAlternant.get('postal_adresse')?.value;

    let role = this.formAddAlternant.get('role')?.value.value;
    let classe_id = this.formAddAlternant.get('classe_id')?.value.value;
    let statut = this.formAddAlternant.get('statut')?.value.value;
    let date_de_naissance = this.formAddAlternant.get('date_de_naissance')?.value;
    let entreprise_id = this.formAddAlternant.get('entreprise_id')?.value.value;

    //Pour la création du nouvel alternant on crée aussi un user
    let newUser = new User(null, firstname, lastname, phone, email, null, '', role, null, null, civilite, null, null, null, entreprise_id, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse);
    
    //creation et envoi de user et alternant
    let newAlternant = new Alternant(null, '', role, classe_id, statut, pays_adresse, date_de_naissance, entreprise_id);

    this.alternantService.create({'newAlternant': newAlternant, 'newUser': newUser}).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Alternant ajouté' });
        //Recuperation de la liste des differentes informations
        this.onGetAllClasses();
        
        this.showFormAddAlternant = false;
        this.resetForms();
      }),
      ((error) => { console.log(error); })
    );

  }


  //Methode d'initialisation du formulaire de modification d'un alternant
  onInitFormUpdateAlternant()
  {
    this.formUpdateAlternant = this.formBuilder.group({
      role: ['', Validators.required],
      classe_id: ['', Validators.required],
      statut: ['', Validators.required],
      date_de_naissance: ['', Validators.required],
      entreprise_id: ['', Validators.required],
    });
  }


  //Methode de modification d'un alternant
  onUpdateAlternant()
  {
    //Recuperation des données du formulaire
    let role = this.formUpdateAlternant.get('role')?.value.value;
    let classe_id = this.formUpdateAlternant.get('classe_id')?.value.value;
    let statut = this.formUpdateAlternant.get('statut')?.value.value;
    let date_de_naissance = this.formUpdateAlternant.get('date_de_naissance')?.value;
    let entreprise_id = this.formUpdateAlternant.get('entreprise_id')?.value.value;
    
    let alternant = new Alternant(this.idAlternantToUpdate, this.idUserOfAlternantToUpdate, role, classe_id, statut, '', date_de_naissance, entreprise_id);
    
    this.alternantService.update(alternant).subscribe(
      ((responde) => {
        this.messageService.add({ severity: 'success', summary: 'Alternant modifié' });
        //Recuperation de la liste des differentes informations
        this.onGetAllClasses(); 

        this.showFormUpdateAlternant = false;
        this.resetForms();
      }),
      ((error) => { console.log(error); })
    );
  }


  //Methôde de recuperation de l'alternant à modifier
  onGetbyId()
  {
    //Recuperation de l'alternant à modifier
    this.alternantService.getById(this.idAlternantToUpdate).subscribe(
      ((response) => { 
        this.alternantToUpdate = response;
        console.log(this.alternantToUpdate); 
        this.formUpdateAlternant.patchValue({role: { libelle: this.roleToUpdate, value: this.alternantToUpdate.role }, statut: { libelle: this.statutToUpdate, value: this.alternantToUpdate.statut }, classe_id: { libelle: this.classeToUpdate, value: this.alternantToUpdate.classe_id }, entreprise_id: { libelle: this.entrepriseToUpdate, value: this.alternantToUpdate.entreprise_id }, date_de_naissance: new Date(this.alternantToUpdate.date_de_naissance).toISOString().slice(0, 10)  });
      }),
      ((error) => { console.log(error); })
    );
  }


  resetForms() {
    this.formAddAlternant.reset();
    this.formUpdateAlternant.reset();
  }

}
