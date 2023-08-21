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
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { Profile } from 'src/app/models/Profile';
import { Competence } from 'src/app/models/Competence';
import { Router } from '@angular/router';

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
    { label: 'Non', value: false },
    { label: 'Oui', value: true },
  ];

  profiles: Profile[] = [];
  profilsList: any = [
    { label: '', value: null },
  ];

  locationOptions = [
    { label: 'Distanciel' },
    { label: 'Présentiel' },
    { label: 'Alterné à définir' }
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

  constructor(private skillsService: SkillsService, private tuteurService: TuteurService, private entrepriseService: EntrepriseService,
    private messageService: MessageService, private formBuilder: FormBuilder, private userService: AuthService,
    private annonceService: AnnonceService, private router: Router) { }

  ngOnInit(): void {
    //Decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // recuperation de la liste des classes
    this.onGetAllClasses();

    //Initialisation du formulaire d'ajout
    this.form = this.formBuilder.group({
      is_interne: [true, Validators.required],
      entreprise_id: [''],
      entreprise_name: [''],
      entreprise_ville: [''],
      entreprise_mail: [''],
      entreprise_phone_indicatif: [''],
      entreprise_phone: [''],
      missionName: [''],
      profil: [this.profilsList[0]],
      competences: [''],
      outils: [''],
      workplaceType: [this.locationOptions[1]],
      missionDesc: [''],
      missionType: [this.missionTypes[0]],
      debut: [''],
      source: [''],
    });

    //Initialisation du formulaire de modification d'une annonce
    this.formUpdate = this.formBuilder.group({
      // is_interne:                          [true, Validators.required],
      entreprise_id: [''],
      entreprise_name: [''],
      entreprise_ville: [''],
      entreprise_mail: [''],
      entreprise_phone_indicatif: [''],
      entreprise_phone: [''],
      missionName: [''],
      profil: [this.profilsList[0]],
      competences: [''],
      outils: [''],
      workplaceType: [this.locationOptions[1]],
      missionDesc: [''],
      missionType: [this.missionTypes[0]],
      debut: [''],
      source: [''],
    });

  }

  // recuperation de toute les classes necessaire au fonctionnement du module
  onGetAllClasses(): void {
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

    //Récupération de la liste des profiles
    this.skillsService.getProfiles()
      .then((response: Profile[]) => {
        this.profiles = response;

        response.forEach((profile: Profile) => {
          this.profilsList.push({ label: profile.libelle, value: profile._id });
        })
      })
      .catch((error) => { console.log(error); });
  }

  //Methode qui servira à modifier le contenu de la liste de competences en fonction du profil
  chargeCompetence(event) {
    // vidage de la table des compétences
    this.competencesList = [];

    const label = event.value.label;
    const id = event.value.value;

    // recuperation de la liste des compétences du profile
    this.skillsService.getCompetenceByProfil(id)
      .then((response: Competence[]) => {
        response.forEach((competence: Competence) => {
          this.competencesList.push({ label: competence.libelle, value: competence._id });
        })
      })
      .catch((error) => { console.log(error); })

    // switch(label){
    //   case 'Développeur':
    //     this.competencesList = [
    //       { label: "HTML 5" },
    //       { label: "CSS 3" },
    //       { label: "Java" },
    //       { label: "Javascript" },
    //       { label: "XML" },
    //       { label: "C" },
    //       { label: "C#" },
    //       { label: "Python" },
    //       { label: "PHP" },
    //       { label: "Kotlin" },
    //       { label: "SQL" },
    //       { label: "NoSQL" },
    //       { label: "Android" },
    //       { label: "C#-ASP.NET" },
    //       { label: "VB.NET" },
    //       { label: "ASP" },
    //       { label: "PrimeFaces" },
    //       { label: "Bootstrap" },
    //       { label: "Talwind" },
    //       { label: "AngularJS" },
    //       { label: "Angular" },
    //       { label: "Ionic" },
    //       { label: "Node.js" },
    //       { label: "Express" },
    //       { label: "React" },
    //       { label: "React Native" },
    //       { label: "Flutter" },
    //       { label: "Vue.js" },
    //       { label: "Next.js" },
    //       { label: "Symfony" },
    //       { label: "Laravel" },
    //       { label: "CakePhp" },
    //       { label: "Fortran" },
    //       { label: "Coffeescript" },
    //       { label: "Django" },
    //       { label: "Tornado" },
    //       { label: "Pyramid" },
    //       { label: "Flask" },
    //       { label: "Panda" },
    //       { label: "Canvas" },
    //       { label: "JQuery" },
    //       { label: "MariaDb" },
    //       { label: "MySql" },
    //       { label: "SQL server" },
    //       { label: "PL/SQL" },
    //       { label: "PostgreSQL" },
    //       { label: "Sqlite" },
    //       { label: "Oracle database" },
    //       { label: "MongoDb" },
    //       { label: "Firebase" },
    //       { label: "Cassandra" },
    //       { label: "Redis" },
    //       { label: "Apache HBase" },
    //       { label: "Neo4J" },
    //       { label: "RavenDb" },
    //       { label: "DynamoDb" },
    //       { label: "CouchBase" },
    //       { label: "CouchDB" },
    //       { label: "Git/ Gitlab CLI" },
    //       { label: "GitLab" },
    //       { label: "GitHub" },
    //       { label: "Docker" },
    //       { label: "Kubernetes" },
    //       { label: "Jenkins" },
    //       { label: "Linux" },
    //       { label: "Windows" },
    //       { label: "MacOS" },
    //       { label: "Pattern MVC" },
    //       { label: "Pattern Observer" },
    //       { label: "Pattern Strategy" },
    //       { label: "Pattern Composite" },
    //       { label: "Agile Scrum" },
    //       { label: "UML" },
    //       { label: "Merise" },
    //     ];

    //     break;
    //   case 'DevOps':
    //     this.competencesList = [
    //       { label: "Linux" },
    //       { label: "Windows" },
    //       { label: "MacOS" },
    //       { label: "Python" },
    //       { label: "Bash" },
    //       { label: "Java" },
    //       { label: "C" },
    //       { label: "HTML" },
    //       { label: "CSS" },
    //       { label: "Javascript" },
    //       { label: "PHP" },
    //       { label: "Bootstrap" },
    //       { label: "JQuery" },
    //       { label: "NodeJs" },
    //       { label: "Express" },
    //       { label: "Django" },
    //       { label: "React" },
    //       { label: "Azure" }, 
    //       { label: "Cisco Packet Tracer" }, 
    //       { label: "Nginx" }, 
    //       { label: "Tomcat" }, 
    //       { label: "JBoss" },
    //       { label: "Apach Maven" },
    //       { label: "Git/ Gitlab CLI" },
    //       { label: "GitLab" },
    //       { label: "GitHub" },
    //       { label: "Docker" },
    //       { label: "Confluence" },
    //       { label: "Jenkins" },
    //       { label: "Ansible" },
    //       { label: "Swarm" },
    //       { label: "Kubernetes" },
    //       { label: "Prometheus" },
    //       { label: "Opensearch" },
    //       { label: "Grafana" },
    //       { label: "VmWare" },
    //       { label: "Selenium Grid" },
    //       { label: "Pattern MVC" },
    //       { label: "Pattern Observer" },
    //       { label: "Pattern Strategy" },
    //       { label: "Pattern Composite" },
    //       { label: "TDMA" },
    //       { label: "FDMA" },
    //       { label: "CDMA/CD" },
    //       { label: "LAN" },
    //       { label: "WAN" },
    //       { label: "VPN" },
    //       { label: "Routage statique" },
    //       { label: "Routage dynamique" },
    //       { label: "Office Excel" },
    //       { label: "Office Word" },
    //       { label: "Office Power Point" },
    //       { label: "Office Access" },
    //       { label: "RSA" },
    //       { label: "Honeypots" },
    //       { label: "OWASP ZAP" },
    //       { label: "Metasploit" },
    //       { label: "IDS" },
    //       { label: "DMZ" },
    //       { label: "Dos(flood)" },
    //       { label: "Agile Scrum" },
    //       { label: "UML" },
    //       { label: "Merise" },
    //     ];

    //     break;
    //   case 'Testeur':
    //     this.competencesList = [
    //       { label: "Réseau IP" },
    //       { label: "OSI" },
    //       { label: "Shell" },
    //       { label: "Linux" },
    //       { label: "Full Unix" },
    //     ];

    //     break;
    //   case 'Expert base de données':
    //     this.competencesList = [
    //       { label: "MariaDb" },
    //       { label: "MySql" },
    //       { label: "SQL server" },
    //       { label: "PL/SQL" },
    //       { label: "PostgreSQL" },
    //       { label: "Sqlite" },
    //       { label: "Oracle database" },
    //       { label: "MongoDb" },
    //       { label: "Firebase" },
    //       { label: "Cassandra" },
    //       { label: "Redis" },
    //       { label: "Apache HBase" },
    //       { label: "Neo4J" },
    //       { label: "RavenDb" },
    //       { label: "DynamoDb" },
    //       { label: "CouchBase" },
    //       { label: "CouchDB" },
    //       { label: "UML" },
    //       { label: "Merise" },
    //     ];

    //     break;
    //   case 'Chargé(e) Relation Clients':
    //     this.competencesList = [
    //       { label: "Polyvalent(e) et capable de gérer plusieurs dossiers en parallèle" },
    //       { label: "Travail en équipe" },
    //       { label: "Qualités relationnelles (bienveillance et patience)" },
    //       { label: "Autonome et rigoureux" },
    //       { label: "Pack Office" },
    //       { label: "Zendesk" },
    //       { label: "Trello" },
    //       { label: "Crisp" },
    //       { label: "Télémarketing" },
    //     ];

    //     break;
    //   case 'Chargé(e) de recrutement bilingue Anglais':
    //     this.competencesList = [
    //       { label: "Identification des profils recherchés auprès des opérationnels" },
    //       { label: "Diffusion des annonces" },
    //       { label: "Sourcing" },
    //       { label: "Tri des candidatures" },
    //       { label: "Rédaction des comptes rendus d'entretien" },
    //       { label: "Suivi des contrats: du recrutement jusqu’à la facturation" },
    //       { label: "Suivi et analyse des indicateurs de performance du processus de recrutement" },
    //       { label: "Participation à divers projets RH" },
    //     ];

    //     break;
    //   case 'Office Manager':
    //     this.competencesList = [
    //       { label: "Thématiques bien-être" },
    //       { label: "Pratiques de quelques thérapies (hypnose, énergéticien, massages thérapeutiques, magnétiseurs, psychologue, coach)" },
    //       { label: "Capacité d'organisation et de gestion des priorités" },
    //       { label: "Tu as le sens du contact, et la sororité t'inspire" },
    //       { label: "Capacité d'adaptation " },
    //       { label: "Esprit d'initiative" },
    //       { label: "Tu as une belle plume" },
    //       { label: "Autonome" },
    //       { label: "Force de proposition" },
    //       { label: "Esprit compétitif" },
    //       { label: "On dit de toi que tu es brute, authentique, et sincère" },
    //     ];

    //     break;
    //   case 'Assistant(e) de direction':
    //     this.competencesList = [
    //       { label: "MAJ prévisionnel" },
    //       { label: "Analyse des performances, aide aux décisions stratégiques" },
    //       { label: "Optimisation : mise en place de processus et d’outils opérationnels pour fluidifier les opérations" },
    //       { label: "Mise en place de partenariats avec des marques et fédérations" },
    //       { label: "Monitoring et reporting" },
    //       { label: "Création de supports de communication marketing" },
    //       { label: "Gestion des activités courante de la start-up" },
    //     ];

    //     break;
    //   case 'Commercial Junior Solutions':
    //     this.competencesList = [
    //       { label: "Prospection, démarchage et suivi clientèle" },
    //       { label: "Marketing, élaboration d’une offre commerciale" },
    //       { label: "Animation du site antalis.fr pour l’activité Solutions" },
    //       { label: "Gestion de la bourse de fret" },
    //       { label: "Déplacements en clientèle" },
    //       { label: "Autonomie" },
    //       { label: "Persévérance" },
    //       { label: "Ecoute active" },
    //       { label: "Qualités organisationnelles et relationnelles" },
    //       { label: "Pugnacité et curiosité" },
    //     ];

    //     break;
    //   case 'Assistant(e) marketing':
    //     this.competencesList = [
    //       { label: "Communication(réseaux sociaux, emailing)" },
    //       { label: "Création de visuels" },
    //       { label: "Support aux actions marketing (newsletters, emailings, mise à jour du site e-commerce...)" },
    //       { label: "Participation à la modération des communautés sur les réseaux sociaux" },
    //       { label: "Aide au développement des partenariats et du programme d’affiliation" },
    //       { label: "Études et analyses de marché pour aider au positionnement des futures offres de formation" },
    //       { label: "Goût pour les nouveaux médias et aisance pour la découverte de nouveaux logiciels et outils de gestion" },
    //       { label: "Maîtrise des codes du web" },
    //       { label: "Excellente expression écrite, maîtrise de l’orthographe" },
    //       { label: "Connaissances des logiciels d’édition visuelle (Canva, Photoshop, Illustrator...)" },
    //       { label: "Esprit d’équipe" },
    //       { label: "Créativité" },
    //       { label: "Sens de l'écoute" },
    //       { label: "Diplomatie" },
    //       { label: "Proactivité" },
    //       { label: "Force de proposition" },
    //     ];

    //     break;
    //   case 'Commercial junior':
    //     this.competencesList = [
    //       { label: "Détecter des nouveaux projets de transformation digitale au travers d’une activité de prospection commerciale quotidienne" },
    //       { label: "Apprendre à identifier les nouveaux prospects et à qualifier les projets : identifier les besoins et les attentes" },
    //       { label: "Planifier des nouveaux rendez-vous prospects dans le cadre des avant-vente gérées par l’équipe avant-vente" },
    //       { label: "Identifier les besoins en vente de produit" },
    //     ];

    //     break;
    //   case 'Chargé de Communication':
    //     this.competencesList = [
    //       { label: "Plan de communication" },
    //       { label: "Reporting" },
    //       { label: "Community management" },
    //       { label: "Organisation d'evènements" },
    //       { label: "Indesign" },
    //       { label: "Photoshop" },
    //       { label: "Illustrator" },
    //       { label: "Sens de l'initiative" },
    //       { label: "Sens de l'organisation" },
    //       { label: "Aisance relationnelle et rédactionnelle" },
    //       { label: "Créativité" },
    //       { label: "Rigueur" },
    //       { label: "Réactivité" },
    //     ];

    //     break;
    //   case 'Commercial/Business Developer':
    //     this.competencesList = [
    //       { label: "Prospection commerciale" },
    //       { label: "Définir et appliquer une stratégie de prospection" },
    //       { label: "Négocier des contrats" },
    //       { label: "Prospecter par téléphone" },
    //       { label: "Conclure de nouveaux partenariats" },
    //       { label: "Etablir et suivre les KPI Marketing" },
    //       { label: "Revoir et développer la stratégie Marketing" },
    //       { label: "Créer des campagnes marketing ciblées" },
    //       { label: "Création de supports de com à destination des cibles BtoB (avec la cellule Communication)" },
    //       { label: "Répondre aux demandes de réservations de salle ou de devis événementiel + suivi/relance" },
    //       { label: "Organiser les visites de nos espaces pour les clients et prospects" },
    //       { label: "Faire le suivi hebdomadaire avec l’équipe opérationnelle du planning de réservation/événementiel" },
    //       { label: "Mettre à jour et gérer des plateformes de réservation partenaires CRM" },
    //       { label: "Réaliser un audit de nos bases de données CRM et diagnostique stratégique" },
    //       { label: "Améliorer et exploiter le système du CRM" },
    //     ];

    //     break;
    //   default: 
    //     this.competencesList = [];
    // }

  }


  //Méthode d'ajout d'une mission
  onAddAnnonce(): void {
    const annonce = new Annonce();

    //Si l'utilisateur est rattaché à une entreprise: tuteur ou representant, l'entreprise id de la mission sera l'entreprise id de l'utilisateur
    if (this.userConnected.type == 'CEO Entreprise') {
      annonce.entreprise_id = this.entreprisesWithCEO[this.userConnected._id]._id;
      annonce.is_interne = true;
    }
    else if (this.userConnected.type == 'Tuteur') {
      annonce.entreprise_id = this.tuteurs[this.userConnected._id].entreprise_id;
      annonce.is_interne = true;
    }
    else {
      annonce.entreprise_id = this.form.get('entreprise_id')?.value.value;
      annonce.is_interne = this.form.get('is_interne')?.value;
    }


    annonce.user_id = this.token.id;
    annonce.missionType = this.form.get('missionType')?.value.label;
    annonce.debut = this.form.get('debut')?.value;
    annonce.missionName = this.form.get('missionName')?.value;
    annonce.missionDesc = this.form.get('missionDesc')?.value;

    annonce.entreprise_name = this.form.get('entreprise_name')?.value;
    annonce.entreprise_ville = this.form.get('entreprise_ville')?.value;
    annonce.entreprise_mail = this.form.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif = this.form.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone = this.form.get('entreprise_phone')?.value;

    annonce.profil = this.form.get('profil')?.value.value;
    annonce.competences = [];
    annonce.outils = [];
    annonce.workplaceType = this.form.get('workplaceType')?.value.label;
    annonce.publicationDate = new Date();

    this.form.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.value);
    });

    this.form.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });

    annonce.source = this.form.get('source')?.value;
    annonce.isClosed = false;
    annonce.custom_id = this.onGenerateID(this.form.get('profil')?.value.label)
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
  onUpdateAnnonce(): void {
    const annonce = new Annonce();

    annonce.is_interne = this.annonceSelected.is_interne;
    annonce.entreprise_id = this.annonceSelected.entreprise_id;
    annonce._id = this.annonceSelected._id;
    annonce.user_id = this.token.id;
    annonce.missionType = this.formUpdate.get('missionType')?.value.label;
    annonce.debut = this.formUpdate.get('debut')?.value;
    annonce.missionName = this.formUpdate.get('missionName')?.value;
    annonce.missionDesc = this.formUpdate.get('missionDesc')?.value;

    annonce.entreprise_name = this.formUpdate.get('entreprise_name')?.value;
    annonce.entreprise_ville = this.formUpdate.get('entreprise_ville')?.value;
    annonce.entreprise_mail = this.formUpdate.get('entreprise_mail')?.value;
    annonce.entreprise_phone_indicatif = this.formUpdate.get('entreprise_phone_indicatif').value;
    annonce.entreprise_phone = this.formUpdate.get('entreprise_phone')?.value;

    annonce.profil = this.formUpdate.get('profil')?.value.value;
    annonce.competences = [];
    annonce.outils = [];
    annonce.workplaceType = this.formUpdate.get('workplaceType')?.value.label;
    annonce.publicationDate = new Date();

    this.formUpdate.get('competences')?.value.forEach((competence) => {
      annonce.competences.push(competence.value);
    });

    this.formUpdate.get('outils')?.value.forEach((outil) => {
      annonce.outils.push(outil.label);
    });

    annonce.source = this.formUpdate.get('source')?.value;
    annonce.isClosed = false;

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
  onFillForm() {
    this.formUpdate.patchValue({
      is_interne: this.annonceSelected.is_interne,
      // entreprise_id:                this.annonceSelected.entreprise_id,
      entreprise_name: this.annonceSelected.entreprise_name,
      entreprise_ville: this.annonceSelected.entreprise_ville,
      entreprise_mail: this.annonceSelected.entreprise_mail,
      entreprise_phone_indicatif: this.annonceSelected.entreprise_phone_indicatif,
      entreprise_phone: this.annonceSelected.entreprise_phone,
      missionName: this.annonceSelected.missionName,
      // profil:                    { label: this.annonceSelected.profil },
      // competences:               this.annonceSelected.competences,
      workplaceType: { label: this.annonceSelected.workplaceType },
      missionDesc: this.annonceSelected.missionDesc,
      missionType: { label: this.annonceSelected.missionType },
      debut: this.annonceSelected.debut,
      source: this.annonceSelected.source,
    });
  }

  InitMatching(annonce: Annonce) {
    this.router.navigate(['matching', annonce._id])
  }

  onGenerateID(profilLabel) {
    let label = profilLabel.replace(/[^A-Z]+/g, "");
    if (label == '')
      label = "UNK"
    let random = Math.random().toString(36).substring(5).toUpperCase();
    return label + "-" + random
  }

}
