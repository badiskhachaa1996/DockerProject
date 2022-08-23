import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Tuteur } from 'src/app/models/Tuteur';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { TuteurService } from 'src/app/services/tuteur.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { Entreprise } from 'src/app/models/Entreprise';


@Component({
  selector: 'app-tuteur',
  templateUrl: './tuteur.component.html',
  styleUrls: ['./tuteur.component.scss']
})
export class TuteurComponent implements OnInit {

  
//Déclaration 
  addTuteurForm: FormGroup;
  showFormAddTuteur = false;
  updateTuteurForm : FormGroup;
  showFormModifTuteur = false;

  civiliteList = environment.civilite;
  nationList = environment.nationalites;
  paysList = environment.pays;

  entrepriseId: string;
  
  entreprises: Entreprise[] = [];
  entrepriseDirector : Entreprise;
  entrepriseDirectorId : string;
  updateTuteurId: string;
  tuteurList : Tuteur[] = [];
  tuteurs : Tuteur[] = [];
  entrepriseList = [];
  userList = [];
  users : User[]=[];
  dropdownUser = [];
  tuteurUpdate : Tuteur;
  updateTuteur : Tuteur;
  

  isAdmin = false
  isAgent = false
  isCEO = false;
  isType = false;

  token;
  dropdownEntreprise: any[] = [{ libelle: 'Choissisez une entreprise', value: null }];
  
 
  

//constructeur - injection des services
  constructor(private formBuilder: FormBuilder, 
    private router: Router, private tuteurService : TuteurService, 
    private messageService : MessageService, private UserService : AuthService,
    private entrepriseService : EntrepriseService, private ActiveRoute :ActivatedRoute) { }

//Initialisateur -
  ngOnInit(): void {
    
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getPopulate(this.token.id).subscribe(dataUser => {
            if (dataUser) {
              this.isAdmin = dataUser.role == "Admin"
              this.isAgent = dataUser.role == "Agent"
              this.isCEO = dataUser.type == "CEO Entreprise"  
            }
            
            if(this.isCEO){
             
              // récupération de l'entreprise du user
              this.entrepriseService.getByDirecteurId(this.token.id).subscribe(
                ((response) => { 
                  //recupere l'entreprise avec l'id
                this.entrepriseDirector = response
                //selectionne l'id de l'entreprise             
                this.entrepriseId = this.entrepriseDirector._id
                
                // console.log(this.entrepriseDirector)
                // récupération de la liste des tuteur par l'entreprise id
                this.tuteurService.getAllByEntrepriseId(this.entrepriseId).subscribe(
                  ((responseTuteur) => {
                    this.tuteurList=responseTuteur
                  })
                )
              }))
            }
            if(!this.isCEO){
            //recupération des entreprises
           
    
console.log(this.entreprises)
//récupération des tuteur
  this.tuteurService.getAll().subscribe(
    (dataTuteur) => {
      dataTuteur.forEach(tuteur => {
        this.tuteurs.push(tuteur);
      })
    }
  );
  console.log(this.tuteurs)

//récupération des tuteur
    this.UserService.getAll().subscribe(
      (dataUser) => {
        dataUser.forEach(user => {
          this.users.push(user);
        })
      }
    );

    this.entrepriseService.getAll().subscribe(
      (data) => {
        data.forEach(entreprise =>{
          this.dropdownEntreprise.push({ libelle: entreprise.r_sociale, value: entreprise._id});
        })
      })
    }
  })
        
   this.onInitFormAddTuteur()
   this.onInitUpdateTuteurForm()
  }

//
resetAddTuteur() {
  this.onInitFormAddTuteur()
 
}

//
resetUpdateTuteur() {
  this.onInitUpdateTuteurForm()
}
  
//Initialisation du formulaire d'ajout du tuteur - Vérification des erreurs
  onInitFormAddTuteur() {
    this.addTuteurForm = this.formBuilder.group({
      civilite: [this.civiliteList[0], Validators.required],
      firstname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      lastname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      indicatif: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      fonction: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      entreprise: [''],
      anciennete: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      niveau_formation: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      email_perso: [''],
      numero_adresse: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      rue_adresse: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      postal_adresse: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      ville_adresse: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      pays_adresse: [this.paysList[0], Validators.required],
      nationnalite: [this.nationList[0], Validators.required],
      date_naissance: ['', [Validators.required]]
    })

  }
  
//Récupération des valeur des champs - pour la partie de traitement des erreurs sur le formulaire
get civilite() { return this.addTuteurForm.get('civilite').value; };
get firstname() { return this.addTuteurForm.get('firstname'); };
get lastname() { return this.addTuteurForm.get('lastname'); };
get indicatif() { return this.addTuteurForm.get('indicatif'); };
get phone() { return this.addTuteurForm.get('phone'); };
get fonction() { return this.addTuteurForm.get('fonction').value; };
get entreprise() { return this.addTuteurForm.get('entreprise').value.value; };
get anciennete() { return this.addTuteurForm.get('anciennete').value; };
get niveau_formation() { return this.addTuteurForm.get('niveau_formation').value; };
get email_perso() { return this.addTuteurForm.get('email_perso'); };
get numero_adresse() { return this.addTuteurForm.get('numero_adresse'); };
get rue_adresse() { return this.addTuteurForm.get('rue_adresse'); };
get postal_adresse() { return this.addTuteurForm.get('postal_adresse'); };
get ville_adresse() { return this.addTuteurForm.get('ville_adresse'); };
get pays_adresse() { return this.addTuteurForm.get('pays_adresse'); };
get nationnalite() { return this.addTuteurForm.get('nationnalite'); };
get date_naissance() { return this.addTuteurForm.get('date_naissance'); };

//méthode d'ajout du tuteur
  onAddTuteur(){
    let civilite = this.addTuteurForm.get('civilite')?.value.value;
    let firstname = this.addTuteurForm.get('firstname')?.value;
    let lastname = this.addTuteurForm.get('lastname')?.value;
    let indicatif = this.addTuteurForm.get('indicatif')?.value;
    let phone = this.addTuteurForm.get('phone')?.value;
    let fonction = this.addTuteurForm.get('fonction')?.value;
    if(this.isCEO){
      var entreprise = this.entrepriseId
    }else if(!this.isCEO){
      entreprise = this.addTuteurForm.get('entreprise')?.value.value;
    }
    let anciennete = this.addTuteurForm.get('anciennete')?.value;
    let niveau_formation = this.addTuteurForm.get('niveau_formation')?.value;
    let email_perso = this.addTuteurForm.get('email_perso')?.value
    let numero_adresse = this.addTuteurForm.get('numero_adresse')?.value;
    let rue_adresse = this.addTuteurForm.get('rue_adresse')?.value;
    let postal_adresse = this.addTuteurForm.get('postal_adresse')?.value;
    let ville_adresse = this.addTuteurForm.get('ville_adresse')?.value;
    let pays_adresse = this.addTuteurForm.get('pays_adresse')?.value;
    let nationnalite = this.addTuteurForm.get('nationnalite')?.value.value;
    let date_naissance = this.addTuteurForm.get('date_naissance')?.value;
    //Pour la création du nouvel étudiant on crée aussi un user
    let newUser = new User(
      null,
      firstname, 
      lastname, 
      indicatif, 
      phone,
      null,// email estya
      email_perso,
      null, //pdw
      'user',
      null, //etat
      null, //service_id
      civilite.value,
      null, //pathImageProfil
      null, //typeImageProfil
      'Tuteur',
      entreprise,
      pays_adresse.value, 
      ville_adresse, 
      rue_adresse, 
      numero_adresse, 
      postal_adresse,
      nationnalite,
      null,//verifedEmail
      null);//date creation
      console.log(newUser) 

    let newTuteur = new Tuteur(
      entreprise,//entreprise id
      null,//question morgan user_id
      fonction,
      anciennete,
      niveau_formation,
      date_naissance
    );
    console.log(newTuteur)

    this.tuteurService.create({ 'newTuteur': newTuteur, 'newUser': newUser}).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Tuteur ajouté' });
        this.showFormAddTuteur = false;
      }),
      ((error) => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: error.error });
      })
    );

    this.resetAddTuteur()

  }


////Modification du tuteur
//Initialisation du formulaire d'ajout du tuteur - Vérification des erreurs
onInitUpdateTuteurForm() {
  this.updateTuteurForm = this.formBuilder.group({
    fonction: [''],
    anciennete: [''],
    niveau_formation: [''],
    
  })
 
}

//récupération du tuteur à modifier
OnGetByIdTuteur(rowData : Tuteur){
  this.tuteurService.getById(this.updateTuteurId).subscribe(
    (response) => {
      this.updateTuteur = response;
      this.updateTuteurForm.patchValue({
        fonction: rowData.fonction,
        anciennete: rowData.anciennete,
        niveau_formation: rowData.niveau_formation,
      });
    })
   
   
  }

onUpdateTuteur(){
  
  let fonction = this.updateTuteurForm.get('fonction').value;
  let anciennete = this.updateTuteurForm.get('anciennete').value;
  let niveau_formation = this.updateTuteurForm.get('niveau_formation').value;

  this.tuteurUpdate = new Tuteur(
    null,
    null,
    fonction,
    anciennete,
    niveau_formation,
    null
  );

  console.log(this.tuteurUpdate);
  
  this.tuteurService.updateById(this.updateTuteurId, this.tuteurUpdate).subscribe(
    ((response) => {
      this.messageService.add({ severity: 'success', summary: 'Tuteur ajouté' });
      console.log(this.tuteurUpdate);
    }),
    ((error) => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: error.error });
    })
   
  );

  this.resetUpdateTuteur()

}


}
