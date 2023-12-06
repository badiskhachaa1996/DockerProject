import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Prospect } from 'src/app/models/Prospect';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import mongoose from 'mongoose';
import { NotificationService } from 'src/app/services/notification.service';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { Notification } from 'src/app/models/notification';
import { SocketService } from 'src/app/services/socket.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { FileUpload } from 'primeng/fileupload';
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {
  token;
  @ViewChild('dt1') dt1: Table | undefined;
  prospects: Prospect[] = [];
  prospectI: Prospect[] = [];
  PROSPECT:Prospect;
  ListDocuments: String[] = [];
  ListPiped: String[] = [];
  prospect_acctuelle: Prospect;
  visible: boolean = false;
  visibleC: boolean=false;
  visibleADM: boolean=false;
  visiblep: boolean=false;
  showUploadFile = null;
  selectedTabIndex: number = 0;
  showupdateLeadForm: boolean = false;
  displayFilter: boolean = false;
  showdoc:boolean=false;
  showDocAdmin: Prospect = null
  civiliteList = environment.civilite;
  userConnected:User
  paysList = environment.pays;
  nationList = environment.nationalites;
  Frythme: String; Fcampus: String; Frentree: String; Fecoles: String;
  Fformation: String; Fetape: String; Fsource: String; FYpareo: boolean; FTeams: boolean; Fgroupe: Boolean;
  EcoleListRework = [];
  campusDropdown = [];
  programeFrDropdown = [];
  programEnDropdown = [];
  rentreeList = [];
  DocumentsCandidature: any[] = [];
  DocumentsAdministratif: any[] = [];
  DoccumentProfessionel: any[] = [];
  groupe_dropdown = [
    { value: "BIG DATA 1", label: "BIG DATA 1" },
    { value: "BIG DATA 2", label: "BIG DATA 2" },
    { value: "BIG DATA 3", label: "BIG DATA 3" },
    { value: "BIG DATA 4", label: "BIG DATA 4" },
  ];
  programList =
    [
      { value: "Programme Français" },
      { value: "Programme Anglais" },
    ];
  rythme_filtre = [
    { label: "Tous les rythmes", value: null },
    { label: "Initiale", value: 'Initiale' },
    { label: "Alternance", value: 'Alternance' }
  ];
  typeFormationDropdown = [
    { value: "Initiale" },
    { value: "Alternance" }
  ];
  campusfiltre =
    [
      { value: null, label: "Tous les campus" },
      { value: "Paris", label: "Paris - France" },
      { value: "Montpellier", label: "Montpellier - France" },
      { value: "Brazzaville", label: "Brazzaville - Congo" },
      { value: "Rabat", label: "Rabat - Maroc" },
      { value: "La Valette", label: "La Valette - Malte" },
      { value: "UAE", label: "UAE - Dubai" },
      { value: "En ligne", label: "En ligne" },
    ];
  sourceFiltre = [
    { label: "Toutes sources", value: null },
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
    { label: "Lead", value: "Lead" },
    { label: "Site Web", value: "Site Web" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
  ];
  sourceList = [
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
    { label: "Lead", value: "Lead" },
    { label: "Site Web", value: "Site Web" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
  ]
  etapeFiltre = [
    { label: "all", value: null },
    { label: "", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
    { label: "Lead", value: "Lead" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
  ];
  EcoleFiltre = [{
    label: "Toutes les écoles", value: null
  }]
  formationsFitre = [
    { label: "Toutes les Formations ", value: null }
  ];
  rentreeFiltere = [{ label: "Toutes les rentrées ", value: null, _id: null }];
  EtapeFiltere = [
    { label: "Toutes les étapes", value: null },
    { label: "Etape 1", value: "Etape 1" },
    { label: "Etape 2", value: "Etape 2" },
    { label: "Etape 3", value: "Etape 3" },
    { label: "Etape 4", value: "Etape 4" },

  ];
  documentDropdownc = [
    { label: "Formulaire de candidature", value: "Formulaire de candidature" },
    { label: "Test de Sélection", value: "Test de Sélection" },
    { label: "Attente", value: "Attente" },
  ]
  documentDropdowna = [
    { label: "Attestation inscription", value: "Attestation inscription" },
    { label: "Certificat de scolarité", value: "Certificat de scolarité" },
    { label: "Attestation de présence / assiduité", value: "Attestation de présence / assiduité" },
    { label: "Réglement intérieur", value: "Réglement intérieur" },
    { label: "Livret d'accueil", value: "Livret d'accueil" },
    { label: "Autorisation de diffusion et d'utilisation de photographie et vidéos", value: "Autorisation de diffusion et d'utilisation de photographie et vidéos" }
  ];
  documentDropdownpro = [
    { label: "Convention de stage", value: "Convention de stage" },
    { label: "Attestation de stage", value: "Attestation de stage" },
    { label: "Satisfaction de stage", value: "Satisfaction de stage" },
    { label: "Contrat d'apprentisage", value: "Contrat d'apprentisage" },
    { label: "Convention de formation", value: "Convention de formation" },
    { label: "Livret de suivi", value: "Livret de suivi" },
    { label: "Convocation d'examen", value: "Convocation d'examen" },
    { label: "Bulletin de note", value: "Bulletin de note" },
    { label: "Suivi post formation-orientation", value: "Suivi post formation-orientation" }

  ];
  filterValue: string | null = null;
  updateLeadForm: FormGroup = new FormGroup({
    civilite: new FormControl(environment.civilite[0], Validators.required),
    lastname: new FormControl('',),
    firstname: new FormControl('',),
    date_naissance: new FormControl('',),
    pays: new FormControl(this.paysList[76], Validators.required),
    nationalite: new FormControl('',),
    indicatif: new FormControl('',),
    phone: new FormControl('',),
    email_perso: new FormControl('',),
    rue: new FormControl('',),
    ville: new FormControl('',),
    codep: new FormControl('',),
    ecole: new FormControl('',),
    campus: new FormControl('',),
    rentree_scolaire: new FormControl('',),
    programme: new FormControl('',),
    formation: new FormControl('',),
    rythme_formation: new FormControl('',),
    source: new FormControl('',),
    commercial: new FormControl('',),
    nomlead: new FormControl('',),
  })
  compteForm: FormGroup = new FormGroup({
    teams: new FormControl('',),
    Ypareo: new FormControl('',),
    groupe: new FormControl('',),
  })
  uploadAdminFileForm: FormGroup = new FormGroup({
    //typeDoc: new FormControl(this.DocTypes[0], Validators.required),
    date: new FormControl(this.convertTime(new Date), Validators.required),
    nom: new FormControl("",),
    note: new FormControl(""),
    traited_by: new FormControl("",),
    type: new FormControl(""),
  })

  constructor(private EmailTypeS: EmailTypeService,private commercialService: CommercialPartenaireService,private NotifService: NotificationService,private Socket: SocketService,private UserService: AuthService,private FAService: FormulaireAdmissionService, private admissionService: AdmissionService, private messageService: MessageService,private ToastService: MessageService,) { }

  ngOnInit(): void {
    //RECUPERATION PROSPECT
    this.token = jwt_decode(localStorage.getItem('token'));
    this.getthecrateur();
    this.admissionService.getAllInsDef().subscribe((results => {
      this.prospects = results
    }))
    //RECUPERATION ECOLES
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(e => {
        this.EcoleFiltre.push({ label: e.titre, value: e.url_form })
        this.FAService.RAgetByEcoleID(e._id).subscribe(dataEcoles => {
          dataEcoles.forEach(rentre => {
            this.rentreeFiltere.push({ label: rentre.nom, value: rentre.nom, _id: rentre._id })
          })
        })
      })
    });
    //RECUPERATION DES FORMATIONS
    this.FAService.FAgetAll().subscribe(form => {
      form.forEach(f => {
        this.formationsFitre.push({ label: f.nom, value: f.nom })
      })
    })

    console.log(this.EcoleListRework);
  }
  //AFFICHER LES COMPTES
  onShowCompte(prospect: Prospect) {
    this.visible = true;
    this.prospect_acctuelle = prospect;
    if (this.prospect_acctuelle?.teams != "NON") {
      this.compteForm.patchValue({
        teams: this.prospect_acctuelle?.teams
      })
    } else {
      this.compteForm.patchValue({
        teams: ''
      })
    }
    if (this.prospect_acctuelle?.Ypareo != "NON") {
      this.compteForm.patchValue({

        Ypareo: this.prospect_acctuelle?.Ypareo,
      })
    } else {
      this.compteForm.patchValue({
        Ypareo: ''
      })
    };
    if (this.prospect_acctuelle?.groupe != "NON") {
      this.compteForm.patchValue({
        groupe: this.prospect_acctuelle?.groupe,
      })
    } else {
      this.compteForm.patchValue({
        groupe: ''
      })
    }
  };
  getthecrateur() {
    this.UserService.getInfoById(this.token.id).subscribe({
      next: (response) => { this.userConnected = response; },
      error: (error) => { console.error(error); },
      complete: () => console.log("information de l'utilisateur connecté récuperé")
    });
  }
  //AJOUTER UN COMPTE TEAMS
  onAddTeams() {
    this.prospect_acctuelle.teams = this.compteForm.value.teams
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resultat => {
      console.log(resultat);
      this.messageService.add({ severity: "success", summary: "Modification du compte teams avec succès" })
    });
  }
  //AJOUTER UN COMPTE YPAREO
  onAddYpareo() {
    this.prospect_acctuelle.Ypareo = this.compteForm.value.Ypareo
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resu => {
      console.log(resu);
      this.messageService.add({ severity: "success", summary: "Modification du compte Ypareo avec succès" })
    });
  }
  //AFFECTER UN GROUP
  onAddGroup(event: any) {
    this.prospect_acctuelle.groupe = event.value;
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(res => {
      console.log(res);
      this.messageService.add({ severity: "success", summary: "Modification du groupe avec succès" })
    });
  }
  //SUPRIMER UN COMPTE TEAMS
  onDeleteTeams() {
    this.prospect_acctuelle.teams = "NON"
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resultat => {
      console.log(resultat);
      this.messageService.add({ severity: "success", summary: "Suppresion du compte Teams avec succès" })
    });
  }
  //SUPRIMER UN COMPTE YPARIO
  onDeleteYpareo() {
    this.prospect_acctuelle.Ypareo = "NON"
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resu => {
      console.log(resu);
      this.messageService.add({ severity: "success", summary: "Suppresion du compte Ypareo avec succès" })
    });
  }
  //SUPRIMER UN PROSPECT
  deletePro(prospect: Prospect) {
    console.log("hello")
    this.admissionService.delete(prospect._id, prospect.user_id._id).subscribe(res => { console.log(res) });
  }
  //INTIALISATION DE LA MODIFICATION D'UN ETUDIANT 
  initupdateLeadForm(prospect: Prospect) {
    this.prospect_acctuelle = prospect;
    console.log(prospect.user_id.civilite);
    this.updateLeadForm.patchValue({
      civilite: prospect.user_id.civilite,
      lastname: prospect.user_id.lastname,
      firstname: prospect.user_id.firstname,
      date_naissance: this.conersiondate(prospect.date_naissance),
      pays: prospect.user_id.pays_adresse,
      nationalite: prospect.user_id.nationnalite,
      indicatif: prospect.user_id.indicatif,
      phone: prospect.user_id.phone,
      email_perso: prospect.user_id.email_perso,
      rue: prospect.user_id.rue_adresse,
      ville: prospect.user_id.ville_adresse,
      codep: prospect.user_id.postal_adresse,
      //ecole
      campus: prospect.campus_choix_1,
      rentree_scolaire: prospect.rentree_scolaire,
      programme: prospect.programme,
      formation: prospect.formation,
      rythme_formation: prospect.rythme_formation,
      source: prospect.source,
      //commercial
      //nomlead
    })
    this.showupdateLeadForm = true
  };
  //MODIFICATION
  UpadateProspect() {
    this.prospect_acctuelle.user_id.civilite = this.updateLeadForm.value.civilite;
    this.prospect_acctuelle.user_id.lastname = this.updateLeadForm.value.lastname;
    this.prospect_acctuelle.user_id.firstname = this.updateLeadForm.value.firstname;
    this.prospect_acctuelle.date_naissance = this.updateLeadForm.value.date_naissanc;
    this.prospect_acctuelle.user_id.pays = this.updateLeadForm.value.pays;
    this.prospect_acctuelle.user_id.nationalite = this.updateLeadForm.value.nationalite;
    this.prospect_acctuelle.user_id.indicatif = this.updateLeadForm.value.indicatif;
    this.prospect_acctuelle.user_id.phone = this.updateLeadForm.value.phone;
    this.prospect_acctuelle.user_id.email_perso = this.updateLeadForm.value.email_perso;
    this.prospect_acctuelle.user_id.rue = this.updateLeadForm.value.rue;
    this.prospect_acctuelle.user_id.ville = this.updateLeadForm.value.ville;
    this.prospect_acctuelle.user_id.postal_adresse = this.updateLeadForm.value.postal_adresse;
    this.prospect_acctuelle.campus_choix_1 = this.updateLeadForm.value.campus_choix_1;
    this.prospect_acctuelle.rentree_scolaire = this.updateLeadForm.value.rentree_scolaire;
    this.prospect_acctuelle.programme = this.updateLeadForm.value.programme;
    this.prospect_acctuelle.formation = this.updateLeadForm.value.formation;
    this.prospect_acctuelle.rythme_formation = this.updateLeadForm.value.rythme_formation;
    this.prospect_acctuelle.source = this.updateLeadForm.value.source;

    const user = this.prospect_acctuelle.user_id
    const prospect = this.prospect_acctuelle
    this.admissionService.update({ prospect, user }).subscribe(data => { console.log(data) });
  }
  //A LA SELECTION D4UNE ECOLE 
  onSelectEcole() {
    this.FAService.EAgetByParams(this.updateLeadForm.value.ecole).subscribe(data => {
      this.FAService.RAgetByEcoleID(data._id).subscribe(dataEcoles => {
        let dicFilFr = {}
        let fFrList = []

        let dicFilEn = {}
        let fEnList = []
        data.formations.forEach(f => {
          if (f.langue.includes('Programme Français')) {
            if (dicFilFr[f.filiere]) {
              dicFilFr[f.filiere].push({ label: f.nom, value: f.nom })
            } else {
              dicFilFr[f.filiere] = [{ label: f.nom, value: f.nom }]
              fFrList.push(f.filiere)
            }
          }
          //this.programeFrDropdown.push({ label: f.nom, value: f.nom })
          if (f.langue.includes('Programme Anglais'))
            if (dicFilEn[f.filiere]) {
              dicFilEn[f.filiere].push({ label: f.nom, value: f.nom })
            } else {
              dicFilEn[f.filiere] = [{ label: f.nom, value: f.nom }]
              fEnList.push(f.filiere)
            }
        })
        this.programeFrDropdown = []
        fFrList.forEach(f => {
          let ft = f
          if (f == undefined || f == "undefined")
            f = "Autre"
          this.programeFrDropdown.push(
            { label: f, value: f, items: dicFilFr[ft] }
          )
        })
        this.programEnDropdown = []
        fEnList.forEach(f => {
          let ft = f
          if (f == undefined || f == "undefined")
            f = "Autre"
          this.programEnDropdown.push(
            { label: f, value: f, items: dicFilEn[ft] }
          )
        })
        this.rentreeList = []
        dataEcoles.forEach(rentre => {
          this.rentreeList.push({ label: rentre.nom, value: rentre.nom, _id: rentre._id })
        })
      })
      this.campusDropdown = []
      data.campus.forEach(c => {
        this.campusDropdown.push({ label: c, value: c })
      })
    })

  }
  conersiondate(a) {
    const dl = a // Supposons que project.debut soit une date valide
    const dateObjectl = new Date(dl); // Conversion en objet Date
    const year = dateObjectl.getFullYear();
    const month = String(dateObjectl.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(dateObjectl.getDate()).padStart(2, '0');
    const new_date = `${year}-${month}-${day}`;
    return new_date
  }
  clearFilter() {
    this.Frythme = null; this.Fcampus = null; this.Frentree = null; this.Fecoles = null; this.Fformation = null; this.Fetape = null; this.Fsource = null;

  }
  onTeamsCheckboxChange(event: any) {
    console.log('Checkbox changed', event);
    if (event.checked) {
      console.log(event.checked)
      // Checkbox est coché, appliquer le filtre
      this.dt1?.filter('NON', 'teams', 'equals');
      this.FTeams = true;
    }
    if (event.checked.length < 1) {
      console.log("notchecked")
      // Checkbox est décoché, réinitialiser le filtre
      this.dt1?.filter('', 'teams', 'equals');
      this.FTeams = false;

    }
  }
  onYpareoCheckboxChange(event: any) {
    console.log('Checkbox changed', event);
    if (event.checked) {
      console.log(event.checked)
      // Checkbox est coché, appliquer le filtre
      this.dt1?.filter('NON', 'Ypareo', 'equals');
      this.FYpareo = true;
    }
    if (event.checked.length < 1) {
      console.log("notchecked")
      // Checkbox est décoché, réinitialiser le filtre
      this.dt1?.filter('', 'Ypareo', 'equals');
      this.FYpareo = false;
    }
  }
  onGroupeCheckboxChange(event: any) {
    console.log('Checkbox changed', event);
    if (event.checked) {
      console.log(event.checked)
      // Checkbox est coché, appliquer le filtre
      this.dt1?.filter('NON', 'groupe', 'equals');
      this.Fgroupe = true;

    }
    if (event.checked.length < 1) {
      console.log("notchecked")
      // Checkbox est décoché, réinitialiser le filtre
      this.dt1?.filter('', 'groupe', 'equals');
      this.Fgroupe = false;
    }
  }
 
  addDoc() {
    if (this.PROSPECT.documents_autre)
      this.PROSPECT.documents_autre.push({ date: new Date(), nom: 'Cliquer pour modifier le nom du document ici', path: '', _id: new mongoose.Types.ObjectId().toString() })
    else
      this.PROSPECT.documents_autre = [{ date: new Date(), nom: 'Cliquer pour modifier le nom du document ici', path: '', _id: new mongoose.Types.ObjectId().toString() }]
  }
  convertTime(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  //DOOOOOOOOOOOCument
  FileUploadAdmin(event: { files: [File], target: EventTarget }) {

    if (this.uploadAdminFileForm.valid && event.files != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();

      formData.append('id', this.showUploadFile._id)
      formData.append('date', this.uploadAdminFileForm.value.date)
      formData.append('note', this.uploadAdminFileForm.value.note)
      formData.append('nom', this.uploadAdminFileForm.value.nom)
      formData.append('type', this.uploadAdminFileForm.value.type)
      formData.append('custom_id', this.generateCustomID(this.uploadAdminFileForm.value.nom))
      formData.append('traited_by', this.userConnected?.firstname + ' ' + this.userConnected?.lastname)
      formData.append('path', event.files[0].name)
      formData.append('file', event.files[0])
      this.admissionService.uploadAdminFile(formData, this.showUploadFile._id).subscribe(res => {
        this.Socket.NewNotifV2(this.showUploadFile.user_id._id, `Un document est disponibe dans votre espace pour le téléchargement `)

        this.NotifService.create(new Notification(null, null, false,
          `Un document est disponibe dans votre espace pour le téléchargement `,
          new Date(), this.showUploadFile.user_id._id, null)).subscribe(test => { })
        if (this.showUploadFile.code_commercial)
          this.commercialService.getByCode(this.showUploadFile.code_commercial).subscribe(commercial => {
            if (commercial) {
              this.Socket.NewNotifV2(commercial.user_id._id, `Un document est disponible pour l'étudiant ${this.showDocAdmin?.user_id?.firstname} ${this.showDocAdmin?.user_id?.lastname}`)

              this.NotifService.create(new Notification(null, null, false,
                `Un document est disponible pour l'étudiant ${this.showDocAdmin?.user_id?.firstname} ${this.showDocAdmin?.user_id?.lastname}`,
                new Date(), commercial.user_id._id, null)).subscribe(test => { })

              this.EmailTypeS.defaultEmail({
                email: commercial.user_id?.email,
                objet: '[IMS] Admission - Document inscription disponible  d\'un de vos leads ',
                mail: `

                Cher partenaire,

                Nous avons le plaisir de vous informer qu'un document important est désormais disponible pour l'étudiant ${this.showDocAdmin?.user_id?.firstname} ${this.showDocAdmin?.user_id?.lastname}. Ce document est accessible via notre plateforme en ligne ou peut être récupéré auprès de notre équipe administrative. Nous tenons à vous remercier pour votre collaboration continue dans le suivi et le soutien des étudiants. Votre engagement est essentiel pour assurer leur réussite et leur satisfaction.
                
                N'hésitez pas à nous contacter si vous avez des questions supplémentaires ou besoin de plus amples informations.
                
                Cordialement,
              `
              }).subscribe(() => { })
            }
          })
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        if (res.documents_administrative) {
          if (this.showDocAdmin.documents_administrative)
            this.showDocAdmin.documents_administrative.push()
        }
        this.showDocAdmin.documents_administrative = res.documents_administrative
        event.target = null;
        this.showUploadFile = null;
        this.initDocument(this.PROSPECT);
        this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }

  }
  @ViewChild('fileInput') fileInput: FileUpload;
  
  generateCustomID(nom) {
    let reeldate = new Date();

    let date = (reeldate.getDate()).toString() + (reeldate.getMonth() + 1).toString() + (reeldate.getFullYear()).toString();

    let random = Math.random().toString(36).substring(5).toUpperCase();

    nom = nom.substr(0, 2).toUpperCase();

    return 'DOC' + nom + date + random;
  }
  initDocument(prospect) {
    this.PROSPECT = prospect;
    console.log(this.PROSPECT)
    this.showDocAdmin = prospect;
    console.log(prospect)
    this.DocumentsCandidature = this.PROSPECT.documents_administrative.filter(document =>
      ["Formulaire de candidature", "Test de Sélection", "Attente"].includes(document.type)
    );

    this.DocumentsAdministratif = this.PROSPECT.documents_administrative.filter(document =>
      ["Attestation inscription", "Certificat de scolarité", "Attestation de présence / assiduité", "Réglement intérieur", "Livret d'accueil", "Livret d'accueil", "Autorisation de diffusion et d'utilisation de photographie et vidéos"].includes(document.type)
    );
    this.DoccumentProfessionel = this.PROSPECT.documents_administrative.filter(document =>
      ["Convention de stage", "Attestation de stage", "Satisfaction de stage", "Contrat d'apprentisage", "Convention de formation", "Livret de suivi", "Convocation d'examen", "Bulletin de note", "Suivi post formation-orientation"].includes(document.type)
    );
    this.admissionService.getFiles(prospect?._id).subscribe(
      (data) => {
        if (data) {
          this.ListDocuments = data
          this.ListPiped = []
          data.forEach(doc => {
            let docname: string = doc.replace("/", ": ").replace('releve_notes', 'Relevé de notes ').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
            this.ListPiped.push(docname)
          })
        }

      },
      (error) => { console.error(error) }
    );
    this.showdoc=true;
  }
  downloadAdminFile(path, prospect: Prospect = null) {
    if (!prospect)
      this.admissionService.downloadFileAdmin(this.showDocAdmin._id, path).subscribe((data) => {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        var blob = new Blob([byteArray], { type: data.documentType });

        importedSaveAs(blob, path)
      }, (error) => {
        console.error(error)
      })
    else
      this.admissionService.downloadFileAdmin(prospect._id, path).subscribe((data) => {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        var blob = new Blob([byteArray], { type: data.documentType });

        importedSaveAs(blob, path)
      }, (error) => {
        console.error(error)
      })
  }
  deleteDocument(doc: { date: Date, nom: string, path: string, _id: string }, ri) {
    this.PROSPECT.documents_administrative.splice(ri, 1)
    this.admissionService.updateV2({ documents_administrative: this.PROSPECT.documents_administrative, _id: this.PROSPECT._id }, "Suppresion d'un document autre Lead-Dossier").subscribe(a => {
      console.log(a)
    })
    this.admissionService.deleteFile(this.PROSPECT._id, `${doc._id}/${doc.path}`).subscribe(p => {
      console.log(p)

    })
    this.initDocument(this.PROSPECT);
  }  docToUpload: { date: Date, nom: string, path: string, _id: string }

  initUpload(doc: { date: Date, nom: string, path: string, _id: string }, id = "selectedFile", p: Prospect) {
    this.docToUpload = doc
    this.PROSPECT = p
    document.getElementById(id).click();
  }
}
