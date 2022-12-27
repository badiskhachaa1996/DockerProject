import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Annonce } from 'src/app/models/Annonce';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { AnnonceService } from 'src/app/services/skillsnet/annonce.service';
import { Entreprise } from 'src/app/models/Entreprise';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { TuteurService } from 'src/app/services/tuteur.service';

@Component({
  selector: 'app-mes-offres',
  templateUrl: './mes-offres.component.html',
  styleUrls: ['./mes-offres.component.scss']
})
export class MesOffresComponent implements OnInit {

  annonces: Annonce[] = [];

  entreprises: Entreprise[] = [];
  entreprisesWithCEO: Entreprise[] = [];
  entreprisesList: any = [{ label: 'Veuillez choisir une entreprise', value: null }];

  tuteurs: Tuteur[] = [];

  form: FormGroup;
  showForm: boolean = false;
  formUpdate: FormGroup;
  showFormUpdate: boolean = false;

  userConnected: User;
  annonceSelected: Annonce;

  entrepriseType = [
    {label: 'Non', value: false},
    {label: 'Oui', value: true},
  ];

  profilsList: any = [
    { label: '' },
    { label: 'Développeur' },
    { label: 'DevOps' },
    { label: 'Testeur' },
    { label: 'Expert base de données' },
    { label: 'Expert architecture fonctionnelle' },
  ];

  locationOptions = [
    {label: 'Distanciel'},
    {label: 'Présentiel'},
    {label: 'Alterné à définir'}
  ];

  outilsList: any[] = [
    { label: 'Visual studio Code' },
    { label: 'Android studio' },
    { label: 'Wamp Server' },
    { label: 'Xamp Server' },
    { label: 'Mamp Server' },
    { label: "MySQl Workbench" },
    { label: "JMerise" },
    { label: "DIA" },
    { label: "StarUML" },
    { label: "mongoDb Compas" },
    { label: 'Eclipse' },
    { label: 'Git' },
    { label: 'Mercurial' },
    { label: 'IDL' },
    { label: 'Matlab' },
    { label: 'Netcdf' },
    { label: 'IDFS' },
    { label: 'Teamviewer' },
    { label: 'Ocean' },
    { label: 'Jira' },
    { label: 'Trello' },
  ];

  //Initialiser à vide ensuite modifier dans la selection des profil
  competencesList: any[] = [];

  selectedMulti: string[] = [];
  selectedMultiOutils: string[] = [];

  missionTypes: any = [
    { label: 'Stage' },
    { label: 'Alternance' },
    { label: 'Professionnalisation' },
    { label: 'CDD' },
    { label: 'CDI' }
  ];

  token: any;

  constructor(private tuteurService: TuteurService, private entrepriseService: EntrepriseService, private messageService: MessageService, private formBuilder: FormBuilder, private userService: AuthService, private annonceService: AnnonceService) { }

  ngOnInit(): void {
    //Decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // recuperation de la liste des classes
    this.onGetAllClasses();

    //Initialisation du formulaire d'ajout
    this.form = this.formBuilder.group({
      is_interne:                          [true, Validators.required],
      entreprise_id:                      [''],
      entreprise_name:                    [''],
      entreprise_ville:                   [''],
      entreprise_mail:                    [''],
      entreprise_phone_indicatif:         [''],
      entreprise_phone:                   [''],
      missionName:                        [''],
      profil:                             [this.profilsList[0]],
      competences:                        [''],
      outils:                             [''],
      workplaceType:                      [this.locationOptions[1]],
      missionDesc:                        [''],
      missionType:                        [this.missionTypes[0]],
      debut:                              [''],
      source:                             [''],
    });

    //Initialisation du formulaire de modification d'une annonce
    this.formUpdate = this.formBuilder.group({
      // is_interne:                          [true, Validators.required],
      entreprise_id:                      [''],
      entreprise_name:                    [''],
      entreprise_ville:                   [''],
      entreprise_mail:                    [''],
      entreprise_phone_indicatif:         [''],
      entreprise_phone:                   [''],
      missionName:                        [''],
      profil:                             [this.profilsList[0]],
      competences:                        [''],
      outils:                             [''],
      workplaceType:                      [this.locationOptions[1]],
      missionDesc:                        [''],
      missionType:                        [this.missionTypes[0]],
      debut:                              [''],
      source:                             [''],
    });

  }

  // recuperation de toute les classes necessaire au fonctionnement du module
  onGetAllClasses(): void
  {
    //Recuperation de l'utilisateur connecté
    this.userService.getInfoById(this.token.id).subscribe(
      ((response) => { 
        this.userConnected = response; 
      }),
      ((error) => { console.log(error); })
    );

    //Recuperation de la liste des annonces
    this.annonceService.getAnnoncesByUserId(this.token.id)
    .then((response: Annonce[]) => {
      this.annonces = response;
    })
    .catch((error) => console.log(error));

    //Recuperation de la liste des entreprises
    this.entrepriseService.getAll().subscribe(
      ((response) => { 
        response.forEach((entreprise) => {
          this.entreprisesList.push({ label: entreprise.r_sociale, value: entreprise._id });
          this.entreprises[entreprise._id] = entreprise;
          this.entreprisesWithCEO[entreprise.directeur_id] = entreprise;
        });
      }),
      ((error) => console.log(error))
    );

    //Récupération de la liste des tuteurs
    this.tuteurService.getAll().subscribe(
      ((response) => { 
        response.forEach((tuteur) => {
          this.tuteurs[tuteur.user_id] = tuteur;
        });
      }),
    )
  }

  //Methode qui servira à modifier le contenu de la liste de competences en fonction du profil
  chargeCompetence(event)
  {
    const label = event.value.label;

    switch(label){
      case 'Développeur':
        this.competencesList = [
          { label: "HTML 5" },
          { label: "CSS 3" },
          { label: "Java" },
          { label: "Javascript" },
          { label: "XML" },
          { label: "C" },
          { label: "C#" },
          { label: "Python" },
          { label: "PHP" },
          { label: "Kotlin" },
          { label: "SQL" },
          { label: "NoSQL" },
          { label: "Android" },
          { label: "C#-ASP.NET" },
          { label: "VB.NET" },
          { label: "ASP" },
          { label: "PrimeFaces" },
          { label: "Bootstrap" },
          { label: "Talwind" },
          { label: "AngularJS" },
          { label: "Angular" },
          { label: "Ionic" },
          { label: "Node.js" },
          { label: "Express" },
          { label: "React" },
          { label: "React Native" },
          { label: "Flutter" },
          { label: "Vue.js" },
          { label: "Next.js" },
          { label: "Symfony" },
          { label: "Laravel" },
          { label: "CakePhp" },
          { label: "Fortran" },
          { label: "Coffeescript" },
          { label: "Django" },
          { label: "Tornado" },
          { label: "Pyramid" },
          { label: "Flask" },
          { label: "Panda" },
          { label: "Canvas" },
          { label: "JQuery" },
          { label: "MariaDb" },
          { label: "MySql" },
          { label: "SQL server" },
          { label: "PL/SQL" },
          { label: "PostgreSQL" },
          { label: "Sqlite" },
          { label: "Oracle database" },
          { label: "MongoDb" },
          { label: "Firebase" },
          { label: "Cassandra" },
          { label: "Redis" },
          { label: "Apache HBase" },
          { label: "Neo4J" },
          { label: "RavenDb" },
          { label: "DynamoDb" },
          { label: "CouchBase" },
          { label: "CouchDB" },
          { label: "Git/ Gitlab CLI" },
          { label: "GitLab" },
          { label: "GitHub" },
          { label: "Docker" },
          { label: "Kubernetes" },
          { label: "Jenkins" },
          { label: "Linux" },
          { label: "Windows" },
          { label: "MacOS" },
          { label: "Pattern MVC" },
          { label: "Pattern Observer" },
          { label: "Pattern Strategy" },
          { label: "Pattern Composite" },
          { label: "Agile Scrum" },
          { label: "UML" },
          { label: "Merise" },
        ];

        break;
      case 'DevOps':
        this.competencesList = [
          { label: "Linux" },
          { label: "Windows" },
          { label: "MacOS" },
          { label: "Python" },
          { label: "Bash" },
          { label: "Java" },
          { label: "C" },
          { label: "HTML" },
          { label: "CSS" },
          { label: "Javascript" },
          { label: "PHP" },
          { label: "Bootstrap" },
          { label: "JQuery" },
          { label: "NodeJs" },
          { label: "Express" },
          { label: "Django" },
          { label: "React" },
          { label: "Azure" }, 
          { label: "Cisco Packet Tracer" }, 
          { label: "Nginx" }, 
          { label: "Tomcat" }, 
          { label: "JBoss" },
          { label: "Apach Maven" },
          { label: "Git/ Gitlab CLI" },
          { label: "GitLab" },
          { label: "GitHub" },
          { label: "Docker" },
          { label: "Confluence" },
          { label: "Jenkins" },
          { label: "Ansible" },
          { label: "Swarm" },
          { label: "Kubernetes" },
          { label: "Prometheus" },
          { label: "Opensearch" },
          { label: "Grafana" },
          { label: "VmWare" },
          { label: "Selenium Grid" },
          { label: "Pattern MVC" },
          { label: "Pattern Observer" },
          { label: "Pattern Strategy" },
          { label: "Pattern Composite" },
          { label: "TDMA" },
          { label: "FDMA" },
          { label: "CDMA/CD" },
          { label: "LAN" },
          { label: "WAN" },
          { label: "VPN" },
          { label: "Routage statique" },
          { label: "Routage dynamique" },
          { label: "Office Excel" },
          { label: "Office Word" },
          { label: "Office Power Point" },
          { label: "Office Access" },
          { label: "RSA" },
          { label: "Honeypots" },
          { label: "OWASP ZAP" },
          { label: "Metasploit" },
          { label: "IDS" },
          { label: "DMZ" },
          { label: "Dos(flood)" },
          { label: "Agile Scrum" },
          { label: "UML" },
          { label: "Merise" },
        ];

        break;
      case 'Testeur':
        this.competencesList = [
          { label: "Réseau IP" },
          { label: "OSI" },
          { label: "Shell" },
          { label: "Linux" },
          { label: "Full Unix" },
        ];

        break;
      case 'Expert base de données':
        this.competencesList = [
          { label: "MariaDb" },
          { label: "MySql" },
          { label: "SQL server" },
          { label: "PL/SQL" },
          { label: "PostgreSQL" },
          { label: "Sqlite" },
          { label: "Oracle database" },
          { label: "MongoDb" },
          { label: "Firebase" },
          { label: "Cassandra" },
          { label: "Redis" },
          { label: "Apache HBase" },
          { label: "Neo4J" },
          { label: "RavenDb" },
          { label: "DynamoDb" },
          { label: "CouchBase" },
          { label: "CouchDB" },
          { label: "UML" },
          { label: "Merise" },
        ];

        break;
      default: 
        this.competencesList = [];
    }

  }


  //Méthode d'ajout d'une mission
  onAddAnnonce(): void 
  {
    const annonce = new Annonce();

    //Si l'utilisateur est rattaché à une entreprise: tuteur ou representant, l'entreprise id de la mission sera l'entreprise id de l'utilisateur
    if(this.userConnected.type == 'CEO Entreprise')
    {
      annonce.entreprise_id = this.entreprisesWithCEO[this.userConnected._id]._id;
      annonce.is_interne                = true; 
    } 
    else if (this.userConnected.type == 'Tuteur')
    {
      annonce.entreprise_id = this.tuteurs[this.userConnected._id].entreprise_id;
      annonce.is_interne                = true; 
    }
    else 
    {
      annonce.entreprise_id   = this.form.get('entreprise_id')?.value.value;
      annonce.is_interne                = this.form.get('is_interne')?.value; 
    }

 
    annonce.user_id                   = this.token.id;
    annonce.missionType               = this.form.get('missionType')?.value.label;
    annonce.debut                     = this.form.get('debut')?.value;
    annonce.missionName               = this.form.get('missionName')?.value;
    annonce.missionDesc               = this.form.get('missionDesc')?.value;

    annonce.entreprise_name           = this.form.get('entreprise_name')?.value;
    annonce.entreprise_ville          = this.form.get('entreprise_ville')?.value;
    annonce.entreprise_mail           = this.form.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif          = this.form.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone          = this.form.get('entreprise_phone')?.value;

    annonce.profil                    = this.form.get('profil')?.value.label;
    annonce.competences               = [];
    annonce.outils                    = [];
    annonce.workplaceType             = this.form.get('workplaceType')?.value.label;
    annonce.publicationDate           = new Date();

    this.form.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.label);
    });

    this.form.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });

    annonce.source                    = this.form.get('source')?.value;
    annonce.isClosed                  = false;

    //Envoi de l'annonce en BD
    this.annonceService.postAnnonce(annonce)
    .then((response) => {
      this.messageService.add({ severity: "success", summary: "L'annonce a été ajouté" })
      this.form.reset();
      this.showForm = false;

      //Recuperation de la liste des classes
      this.onGetAllClasses();
    })
    .catch((error) => { console.log(error); });

  }

  //Méthode de modification d'une annonce
  onUpdateAnnonce(): void
  {
    const annonce = new Annonce();

    annonce.is_interne                = this.annonceSelected.is_interne; 
    annonce.entreprise_id             = this.annonceSelected.entreprise_id;
    annonce._id                       = this.annonceSelected._id;
    annonce.user_id                   = this.token.id;
    annonce.missionType               = this.formUpdate.get('missionType')?.value.label;
    annonce.debut                     = this.formUpdate.get('debut')?.value;
    annonce.missionName               = this.formUpdate.get('missionName')?.value;
    annonce.missionDesc               = this.formUpdate.get('missionDesc')?.value;

    annonce.entreprise_name           = this.formUpdate.get('entreprise_name')?.value;
    annonce.entreprise_ville          = this.formUpdate.get('entreprise_ville')?.value;
    annonce.entreprise_mail           = this.formUpdate.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif          = this.formUpdate.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone          = this.formUpdate.get('entreprise_phone')?.value;

    annonce.profil                    = this.formUpdate.get('profil')?.value.label;
    annonce.competences               = [];
    annonce.outils                    = [];
    annonce.workplaceType             = this.formUpdate.get('workplaceType')?.value.label;
    annonce.publicationDate           = new Date();

    this.formUpdate.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.label);
    });

    this.formUpdate.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });

    annonce.source                    = this.formUpdate.get('source')?.value;
    annonce.isClosed                  = false;

    //Envoi de l'annonce en BD
    this.annonceService.putAnnonce(annonce)
    .then((response) => {
      this.messageService.add({ severity: "success", summary: "L'annonce a été modifier" })
      this.formUpdate.reset();
      this.showFormUpdate = false;

      //Recuperation de la liste des classes
      this.onGetAllClasses();
    })
    .catch((error) => { console.log(error); });
  }

  // methode de remplissage du formulaire de modification
  onFillForm()
  {
    this.formUpdate.patchValue({
      is_interne:                   this.annonceSelected.is_interne,
      // entreprise_id:                this.annonceSelected.entreprise_id,
      entreprise_name:              this.annonceSelected.entreprise_name,
      entreprise_ville:             this.annonceSelected.entreprise_ville,
      entreprise_mail:              this.annonceSelected.entreprise_mail,
      entreprise_phone_indicatif:   this.annonceSelected.entreprise_phone_indicatif,
      entreprise_phone:             this.annonceSelected.entreprise_phone,
      missionName:                  this.annonceSelected.missionName,
      // profil:                    { label: this.annonceSelected.profil },
      // competences:               this.annonceSelected.competences,
      workplaceType:                { label: this.annonceSelected.workplaceType },
      missionDesc:                  this.annonceSelected.missionDesc,
      missionType:                  { label: this.annonceSelected.missionType },
      debut:                        this.annonceSelected.debut,
      source:                       this.annonceSelected.source,
    });
  }


}
