import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { saveAs as importedSaveAs } from "file-saver";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-cvtheque',
  templateUrl: './cvtheque.component.html',
  styleUrls: ['./cvtheque.component.scss']
})
export class CvthequeComponent implements OnInit {

  // partie dedié aux CV
  cvLists: CV[] = [];
  showFormAddCV: boolean = false;
  formAddCV: FormGroup;

  showFormUpdateCV: boolean = false;
  formUpdateCV: FormGroup;

  languesList: any[] = [
    { label: 'Français' },
    { label: 'Anglais' },
    { label: 'Espagnol' },
    { label: 'Allemand' },
    { label: 'Arabe' },
    { label: 'Italien' },
  ]

  competencesList: any[] = [
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
    { label: "Confluence" },
    { label: "Jenkins" },
    { label: "Ansible" },
    { label: "Swarm" },
    { label: "Selenium Grid" },
    { label: "Kubernetes" },
    { label: "Prometheus" },
    { label: "Opensearch" },
    { label: "Grafana" },
    { label: "VmWare" },
    { label: "Linux" },
    { label: "Windows" },
    { label: "MacOS" },
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
    { label: "Réseau IP" },
    { label: "OSI" },
    { label: "Shell" },
    { label: "Full Unix" },
    { label: "Agile Scrum" },
    { label: "UML" },
    { label: "Merise" },
    { label: "Prospection commerciale" },
    { label: "Définir et appliquer une stratégie de prospection" },
    { label: "Négocier des contrats" },
    { label: "Prospecter par téléphone" },
    { label: "Conclure de nouveaux partenariats" },
    { label: "Etablir et suivre les KPI Marketing" },
    { label: "Revoir et développer la stratégie Marketing" },
    { label: "Créer des campagnes marketing ciblées" },
    { label: "Création de supports de com à destination des cibles BtoB (avec la cellule Communication)" },
    { label: "Répondre aux demandes de réservations de salle ou de devis événementiel + suivi/relance" },
    { label: "Organiser les visites de nos espaces pour les clients et prospects" },
    { label: "Faire le suivi hebdomadaire avec l’équipe opérationnelle du planning de réservation/événementiel" },
    { label: "Mettre à jour et gérer des plateformes de réservation partenaires CRM" },
    { label: "Réaliser un audit de nos bases de données CRM et diagnostique stratégique" },
    { label: "Améliorer et exploiter le système du CRM" },
    { label: "Plan de communication" },
    { label: "Reporting" },
    { label: "Community management" },
    { label: "Organisation d'evènements" },
    { label: "Indesign" },
    { label: "Photoshop" },
    { label: "Illustrator" },
    { label: "Sens de l'initiative" },
    { label: "Sens de l'organisation" },
    { label: "Aisance relationnelle et rédactionnelle" },
    { label: "Créativité" },
    { label: "Rigueur" },
    { label: "Réactivité" },
    { label: "Détecter des nouveaux projets de transformation digitale au travers d’une activité de prospection commerciale quotidienne" },
    { label: "Apprendre à identifier les nouveaux prospects et à qualifier les projets : identifier les besoins et les attentes" },
    { label: "Planifier des nouveaux rendez-vous prospects dans le cadre des avant-vente gérées par l’équipe avant-vente" },
    { label: "Identifier les besoins en vente de produit" },
    { label: "Communication(réseaux sociaux, emailing)" },
    { label: "Création de visuels" },
    { label: "Support aux actions marketing (newsletters, emailings, mise à jour du site e-commerce...)" },
    { label: "Participation à la modération des communautés sur les réseaux sociaux" },
    { label: "Aide au développement des partenariats et du programme d’affiliation" },
    { label: "Études et analyses de marché pour aider au positionnement des futures offres de formation" },
    { label: "Goût pour les nouveaux médias et aisance pour la découverte de nouveaux logiciels et outils de gestion" },
    { label: "Maîtrise des codes du web" },
    { label: "Excellente expression écrite, maîtrise de l’orthographe" },
    { label: "Connaissances des logiciels d’édition visuelle (Canva, Photoshop, Illustrator...)" },
    { label: "Esprit d’équipe" },
    { label: "Créativité" },
    { label: "Sens de l'écoute" },
    { label: "Diplomatie" },
    { label: "Proactivité" },
    { label: "Force de proposition" },
    { label: "Prospection, démarchage et suivi clientèle" },
    { label: "Marketing, élaboration d’une offre commerciale" },
    { label: "Animation du site antalis.fr pour l’activité Solutions" },
    { label: "Gestion de la bourse de fret" },
    { label: "Déplacements en clientèle" },
    { label: "Autonomie" },
    { label: "Persévérance" },
    { label: "Ecoute active" },
    { label: "Qualités organisationnelles et relationnelles" },
    { label: "Pugnacité et curiosité" },
    { label: "Thématiques bien-être" },
    { label: "Pratiques de quelques thérapies (hypnose, énergéticien, massages thérapeutiques, magnétiseurs, psychologue, coach)" },
    { label: "Capacité d'organisation et de gestion des priorités" },
    { label: "Tu as le sens du contact, et la sororité t'inspire" },
    { label: "Capacité d'adaptation " },
    { label: "Esprit d'initiative" },
    { label: "Tu as une belle plume" },
    { label: "Autonome" },
    { label: "Force de proposition" },
    { label: "Esprit compétitif" },
    { label: "On dit de toi que tu es brute, authentique, et sincère" },
    { label: "MAJ prévisionnel" },
    { label: "Analyse des performances, aide aux décisions stratégiques" },
    { label: "Optimisation : mise en place de processus et d’outils opérationnels pour fluidifier les opérations" },
    { label: "Mise en place de partenariats avec des marques et fédérations" },
    { label: "Monitoring et reporting" },
    { label: "Création de supports de communication marketing" },
    { label: "Gestion des activités courante de la start-up" },
    { label: "Identification des profils recherchés auprès des opérationnels" },
    { label: "Diffusion des annonces" },
    { label: "Sourcing" },
    { label: "Tri des candidatures" },
    { label: "Rédaction des comptes rendus d'entretien" },
    { label: "Suivi des contrats: du recrutement jusqu’à la facturation" },
    { label: "Suivi et analyse des indicateurs de performance du processus de recrutement" },
    { label: "Participation à divers projets RH" },
    { label: "Polyvalent(e) et capable de gérer plusieurs dossiers en parallèle" },
    { label: "Travail en équipe" },
    { label: "Qualités relationnelles (bienveillance et patience)" },
    { label: "Autonome et rigoureux" },
    { label: "Pack Office" },
    { label: "Zendesk" },
    { label: "Trello" },
    { label: "Crisp" },
    { label: "Télémarketing" },
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

  typeList: any = [
    { label: 'Tous les types', value: null },
    { label: 'Etudiant', value: 'Etudiant' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Formateur', value: 'Formateur' },
  ];

  selectedMultiCpt: string[] = [];
  selectedMultiOutils: string[] = [];
  selectedMultilang: string[] = [];
  loading:boolean = true;

  users: User[] = [];
  dropdownUser: any[] = [
    { label: 'Choisir un utilisateur', value: null }
  ];

  uploadedFiles: any;

  token: any;

  @ViewChild('filter') filter: ElementRef;


  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private cvService: CvService, private userService: AuthService, private router: Router,) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

    //Initialisation du formulaire d'ajout de CV
    this.formAddCV = this.formBuilder.group({
      user_id:                    ['', Validators.required],
      experiences_pro:            this.formBuilder.array([]),
      experiences_sco:            this.formBuilder.array([]),
      competences:                [],
      outils:                     ['', Validators.required],
      langues:                    [],
      video_lien:                 [],
    });

  }


  // methode de recuperation des données utile
  onGetAllClasses(): void
  {
    // recuperation des CVs
    this.cvService.getCvs()
    .then((response: CV[]) => { 
      this.cvLists = response; 
      this.loading = false;
    })
    .catch((error) => { console.error(error); })


    // recuperation de la liste des users et remplissage de la dropdown
    this.userService.getAllForCV()
    .then((response: User[]) => {
      this.users = response;

      // remplissage de la dropdown des users pour ajouter le CV
      response.forEach((user: User) => {
      let username = `${user.firstname} ${user.lastname} . ${user.type}`;
      this.dropdownUser.push({ label: username, value: user._id });
      })
    })
    .catch(error => console.log(error));

  }


  //Traitement des formArray
  /* Xp pro */
  getXpPros()
  {
    return this.formAddCV.get('experiences_pro') as FormArray;
  }

  onAddXpPro()
  {
    const newXpProControl = this.formBuilder.control('', Validators.required);
    this.getXpPros().push(newXpProControl); 
  }

  onRemoveXpPro(i: number)
  {
    this.getXpPros().removeAt(i);
  }
  /* end Xp pro */

  /* Xp sco */
  getXpScos()
  {
    return this.formAddCV.get('experiences_sco') as FormArray;
  }

  onAddXpSco()
  {
    const newXpScoControl = this.formBuilder.control('', Validators.required);
    this.getXpScos().push(newXpScoControl); 
  }

  onRemoveXpSco(i: number)
  {
    this.getXpScos().removeAt(i);
  }
  /* end xp sco */

  // upload du cv brute
  onUpload(event: any) {
    if(event.target.files.length > 0)
    {
        this.uploadedFiles = event.target.files[0];
    }
  }

  // methode d'ajout du cv
  onAddCV(): void
  {
    // recuperation des données du formulaire
    const formValue = this.formAddCV.value;
    //création du cv
    let cv = new CV();
    
    cv.user_id = formValue.user_id;
    cv.experiences_pro = [];
    formValue.experiences_pro?.forEach(xpPro => {
      cv.experiences_pro.push(xpPro);
    });

    cv.experiences_sco = [];
    formValue.experiences_sco?.forEach(xpSco => {
      cv.experiences_sco.push(xpSco);
    });

    cv.competences = [];
    formValue.competences?.forEach(cpt => {
      cv.competences.push(cpt.label);
    });

    cv.outils = [];
    formValue.outils?.forEach((outil) => {
      cv.outils.push(outil.label);
    });

    cv.langues = [];
    formValue.langues?.forEach(langue => {
      cv.langues.push(langue.label);
    });

    cv.video_lien = formValue.video_lien;

    // si un cv brute à été ajouté
    if(this.uploadedFiles)
    {
      cv.filename = this.uploadedFiles.name;
      let formData = new FormData();
      formData.append('id', cv.user_id);
      formData.append('file', this.uploadedFiles);

      //ajout du cv
      this.cvService.postCv(cv)
      .then((response: CV) => {
        this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })
        
        // envoi du fichier brute
        this.cvService.postCVBrute(formData)
        .then(() => {
        
        })
        .catch((error) => { 
          this.formAddCV.reset();
          this.showFormAddCV = false;
          this.onGetAllClasses();
         });
      })
      .catch((error) => { 
        this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
        console.log(error); 
       });
      
    } else {
      //ajout du cv
      this.cvService.postCv(cv)
      .then((response: CV) => {
        this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })
        this.formAddCV.reset();
        this.showFormAddCV = false;
        this.onGetAllClasses();
      })
      .catch((error) => { 
        this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
        console.log(error); 
      });
    }
  }



  // methode pour vider les filtres
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
}
}
