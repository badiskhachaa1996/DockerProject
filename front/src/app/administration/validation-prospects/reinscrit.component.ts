import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Etudiant } from 'src/app/models/Etudiant';
import { User } from 'src/app/models/User';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";
import { ClasseService } from 'src/app/services/classe.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { saveAs as importedSaveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { Entreprise } from 'src/app/models/Entreprise';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { AdmissionService } from 'src/app/services/admission.service';
import { Prospect } from 'src/app/models/Prospect';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';

@Component({
  selector: 'app-reinscrit',
  templateUrl: './reinscrit.component.html',
  styleUrls: ['./reinscrit.component.scss']
})
export class ReinscritComponent implements OnInit {

  @ViewChild('fileInput') fileInput: FileUpload;
  showUploadFile: Etudiant;

  users = {};
  token;
  imageToShow;
  parcoursList = []
  dropdownEntreprise = [];

  dropdownFiliere: any[] = [];
  dropdownCampus: any[] = [];
  statutDossier = [
    { value: "Document Manquant", label: "Document Manquant" },
    { value: "Paiement non finalisé", label: "Paiement non finalisé" },
    { value: "Dossier Complet", label: "Dossier Complet" },
    { value: "Abandon", label: "Abandon" }
  ]

  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  statutList = [
    { value: "Initial" },
    { value: "Alternant" }
  ]

  ListDocuments: String[] = []
  ListPiped: String[] = []
  DocTypes: any[] = [
    { value: null, label: "Choisissez le type de fichier", },
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];
  showAssignForm: Prospect = null;

  AssignForm: FormGroup = this.formBuilder.group({
    filiere: ["", Validators.required],
    statut: [this.statutList[0], Validators.required],
    numero_ine: [''],
    numero_nir: [''],
    sos_email: [''],
    sos_phone: [''],
    nom_rl: [''],
    prenom_rl: [''],
    phone_rl: [''],
    email_rl: [''],
    adresse_rl: [''],
    entreprise: [''],
    // indicatif_tuteur: [''],
    remarque: [''],
    campus_id: [' '],
    statut_dossier: [this.statutDossier[0].value],
    //email_ims: ['', Validators.required]

  })


  prospects: any[] = [];
  dicCommercial: any = {};

  refreshProspect() {
    //Recuperation de la liste des utilisateurs
    this.admissionService.getAllWait().subscribe(d => {
      this.prospects = d
    })
  }
  etudiants: Etudiant[] = []
  refreshEtudiant() {
    this.etudiantService.getAllWaitForVerif().subscribe(d => {
      this.etudiants = d
    })
  }
  showAssignFormEtu: Etudiant = null

  initFormEtu(etudiant: Etudiant) {
    this.showAssignFormEtu = etudiant;
    this.showUploadFile = null;
    this.showAssignForm = null
    let s = (etudiant?.statut == "Initial") ? "Initial" : "Alternant";
    this.payementList = etudiant.payment_reinscrit
    this.AssignForm.patchValue({
      customid: etudiant?.custom_id,
      statut: { value: s },
      statut_dossier: etudiant.statut_dossier
    })
  }

  initForm(etudiant: Prospect) {
    this.showAssignForm = etudiant;
    this.showAssignFormEtu = null
    this.showUploadFile = null;
    let s = (etudiant?.rythme_formation == "Initial") ? "Initial" : "Alternant";
    this.payementList = etudiant.payement
    this.AssignForm.patchValue({
      customid: etudiant?.customid,
      statut: { value: s },
      statut_dossier: etudiant.statut_dossier
    })
  }

  uploadFileForm: FormGroup = new FormGroup({
    typeDoc: new FormControl(this.DocTypes[0], Validators.required)
  })

  groupeList = [];
  constructor(public etudiantService: EtudiantService, private messageService: MessageService, private campusService: CampusService, private diplomeService: DiplomeService, private commercialService: CommercialPartenaireService,
    private formBuilder: FormBuilder, public classeService: ClasseService, public userService: AuthService, private entrepriseService: EntrepriseService, private admissionService: AdmissionService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem("token"))
    this.classeService.getAll().subscribe(groupes => {
      groupes.forEach(g => {
        this.groupeList.push({ label: g.abbrv, value: g._id, nom: g.nom })
      })
      this.AssignForm.patchValue({
        groupe: this.groupeList[0].value
      })
    })
    this.refreshProspect()
    this.refreshEtudiant()
    this.entrepriseService.getAll().subscribe(
      (data) => {
        data.forEach(entreprise => {
          this.dropdownEntreprise.push({ libelle: entreprise.r_sociale, value: entreprise._id });
        })
      })

    this.campusService.getAllPopulate().subscribe(data => {
      data.forEach(c => {
        let e: any = c.ecole_id
        let n = e.libelle + " - " + c.libelle
        this.dropdownCampus.push({ value: c._id, label: n })
      })
      this.AssignForm.patchValue({ campus_id: this.dropdownCampus[0].value })
    })

    this.diplomeService.getAll().subscribe(data => {
      data.forEach(d => {
        this.dropdownFiliere.push({ value: d._id, label: d.titre })
      })
      this.AssignForm.patchValue({ filiere: this.dropdownFiliere[0].value })
    })

    this.commercialService.getAllPopulate().subscribe(dataC => {
      dataC.forEach(c => {
        if (c.code_commercial_partenaire && c.partenaire_id)
          this.dicCommercial[c.code_commercial_partenaire] = c.partenaire_id
      })
      console.log(this.dicCommercial)
    })
  }

  onUpdateEtudiant() {
    let bypass: any = this.showAssignFormEtu.user_id
    let etd: Etudiant = new Etudiant(
      this.showAssignFormEtu._id,
      bypass._id,
      null,
      this.AssignForm.value.statut,
      bypass.nationnalite,
      this.showAssignFormEtu.date_naissance,
      this.showAssignFormEtu.code_partenaire,
      null, null, null, this.showAssignFormEtu.custom_id,
      this.AssignForm.value.numero_ine,
      this.AssignForm.value.numero_nir,
      this.AssignForm.value.sos_email,
      this.AssignForm.value.sos_phone,
      this.AssignForm.value.nom_rl,
      this.AssignForm.value.prenom_rl,
      this.AssignForm.value.phone_rl,
      this.AssignForm.value.email_rl,

      this.AssignForm.value.adresse_rl,
      this.showAssignFormEtu.dernier_diplome,
      this.AssignForm.value.statut == "Alternant",
      this.showAssignFormEtu.isHandicaped,
      this.showAssignFormEtu.suivi_handicaped,
      this.showAssignFormEtu.diplome,
      this.parcoursList,
      this.AssignForm.value.remarque,
      null,//TODO
      null,
      null,//TODO
      null,
      this.AssignForm.value.campus_id,
      this.AssignForm.value.statut_dossier,
      this.AssignForm.value.filiere,
      true
    )
    if (!this.showAssignFormEtu.custom_id)
      etd.custom_id = this.generateCodeEtu(this.showAssignFormEtu)
    if (this.showAssignForm.statut_dossier.includes('Paiement non finalisé')) {
      if (confirm("Cette étudiant a été signalé avec un paiement non finalisé,\nÊtes vous sur de vouloir l'assigner à la pédagogie ?")) {
        this.etudiantService.update(etd).subscribe(data => {
          this.etudiants.forEach((val, index) => {
            if (val._id == data._id) {
              this.etudiants.splice(index, 1)
            }
          })
          this.messageService.add({ severity: "success", summary: "Etudiant réinscrit avec succès" })
          this.showAssignFormEtu = null
        }, err => {
          this.messageService.add({ severity: "error", summary: "Problème avec la réinscription", detail: err })
          console.error(err)
        })
      }
    }
    else
      this.etudiantService.update(etd).subscribe(data => {
        this.etudiants.forEach((val, index) => {
          if (val._id == data._id) {
            this.etudiants.splice(index, 1)
          }
        })
        this.messageService.add({ severity: "success", summary: "Etudiant réinscrit avec succès" })
        this.showAssignFormEtu = null
      }, err => {
        this.messageService.add({ severity: "error", summary: "Problème avec la réinscription", detail: err })
        console.error(err)
      })
  }

  onAddEtudiant() {
    let bypass: any = this.showAssignForm.user_id
    let etd: Etudiant = new Etudiant(
      this.showAssignForm._id,
      bypass._id,
      null,
      this.AssignForm.value.statut,
      bypass.nationnalite,
      this.showAssignForm.date_naissance,
      this.showAssignForm.code_commercial,
      null, null, null, this.showAssignForm.customid,
      this.AssignForm.value.numero_ine,
      this.AssignForm.value.numero_nir,
      this.AssignForm.value.sos_email,
      this.AssignForm.value.sos_phone,
      this.AssignForm.value.nom_rl,
      this.AssignForm.value.prenom_rl,
      this.AssignForm.value.phone_rl,
      this.AssignForm.value.email_rl,

      this.AssignForm.value.adresse_rl,
      this.showAssignForm.professional_experience,
      this.AssignForm.value.statut == "Alternant",
      this.showAssignForm.mobilite_reduite,
      this.showAssignForm.nir,
      this.showAssignForm.formation,
      this.parcoursList,
      this.AssignForm.value.remarque,
      null,//TODO
      null,
      null,//TODO
      null,
      this.AssignForm.value.campus_id,
      this.AssignForm.value.statut_dossier,
      this.AssignForm.value.filiere,
      true
    )
    if (!this.showAssignForm.customid)
      etd.custom_id = this.generateCode(this.showAssignForm)
    //this.AssignForm.value.email_ims
    if (this.showAssignForm.statut_dossier.includes('Paiement non finalisé')) {
      if (confirm("Cette étudiant a été signalé avec un paiement non finalisé,\nÊtes vous sur de vouloir l'assigner à la pédagogie ?"))
        this.etudiantService.validateProspect(etd, bypass._id).subscribe(data => {
          this.prospects.forEach((val, index) => {
            if (val._id == data._id) {
              this.prospects.splice(index, 1)
            }
          })
          this.messageService.add({ severity: "success", summary: "Etudiant réinscrit avec succès" })
          this.showAssignForm = null
        }, err => {
          this.messageService.add({ severity: "error", summary: "Problème avec la réinscription", detail: err })
          console.error(err)
        })
    }
    else {
      this.etudiantService.validateProspect(etd, bypass._id).subscribe(data => {
        this.prospects.forEach((val, index) => {
          if (val._id == data._id) {
            this.prospects.splice(index, 1)
          }
        })
        this.messageService.add({ severity: "success", summary: "Etudiant réinscrit avec succès" })
        this.showAssignForm = null
      }, err => {
        this.messageService.add({ severity: "error", summary: "Problème avec la réinscription", detail: err })
        console.error(err)
      })

    }

  }

  showPayement: Prospect;
  formUpdateDossier: FormGroup = this.formBuilder.group({
    statut_dossier: [this.statutDossier[0].value]
  });

  showPayementFC(etu: Prospect) {
    let bypass: any = etu.user_id
    this.admissionService.getPopulateByUserid(bypass._id).subscribe(p => {
      console.log(p, bypass)
      this.showPayement = p
    })
    this.payementList = etu.payement
    this.formUpdateDossier.patchValue({ statut_dossier: etu.statut_dossier })
  }
  showPayementEtu: Etudiant = null
  showPayementEtuFC(etu: Etudiant) {
    let bypass: any = etu.user_id
    this.etudiantService.getPopulateByUserid(bypass._id).subscribe(p => {
      this.showPayementEtu = p
    })
    this.payementList = etu.payment_reinscrit
    this.formUpdateDossier.patchValue({ statut_dossier: etu.statut_dossier })
  }

  payementList = []

  onAddPayement() {
    if (this.payementList == null) {
      this.payementList = []
    }
    this.payementList.push({ type: "", montant: 0, date: "" })
  }

  changeMontant(i, event, type) {
    if (type == "montant") {
      this.payementList[i][type] = parseInt(event.target.value);
    } else {
      this.payementList[i][type] = event.target.value;
    }
  }

  deletePayement(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le payement ?")) {
      this.payementList.splice(i, 1)
    }
  }

  addNewPayment() {
    this.admissionService.addNewPayment(this.showPayement._id, { payement: this.payementList }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Le payement a été ajouter" })
      let statut_dossier = this.formUpdateDossier.get("statut_dossier")?.value;
      this.admissionService.updateDossier(this.showPayement._id, statut_dossier).subscribe(
        ((responde) => {
          this.messageService.add({ severity: 'success', summary: 'Statut du dossier mis à jour: ' + statut_dossier });
          this.showPayement = null
          this.refreshProspect()
          //Recuperation de la liste des differentes informations
          //this.resetForms();
        }),
        ((error) => { console.error(error); })
      );
    }, err => {
      console.error(err)
      this.messageService.add({ severity: "error", summary: "Erreur" })
    })
  }

  addNewPaymentEtu() {
    this.etudiantService.addNewPayment(this.showPayementEtu._id, { payement: this.payementList }).subscribe(data => {
      this.messageService.add({ severity: "success", summary: "Le payement a été ajouter" })
      let statut_dossier = this.formUpdateDossier.get("statut_dossier")?.value;
      this.etudiantService.updateDossier(this.showPayementEtu._id, statut_dossier).subscribe(
        ((responde) => {
          this.messageService.add({ severity: 'success', summary: 'Statut du dossier mis à jour: ' + statut_dossier });
          this.showPayementEtu = null
          this.refreshEtudiant()
          //Recuperation de la liste des differentes informations
          //this.resetForms();
        }),
        ((error) => { console.error(error); })
      );
    }, err => {
      console.error(err)
      this.messageService.add({ severity: "error", summary: "Erreur" })
    })
  }
  generateCode(prospect: Prospect) {
    let user: any = prospect.user_id
    let code_pays = user.nationnalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[user.nationnalite] && code[user.nationnalite] != undefined) {
        code_pays = code[user.nationnalite]
      }
    })
    let prenom = user.firstname.substring(0, 1)
    let nom = user.lastname.substring(0, 1)
    let y = 0
    for (let i = 0; i < (nom.match(" ") || []).length; i++) {
      console.log(nom)
      nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
      y = nom.indexOf(" ", y) + 1
    }
    let dn = new Date(prospect.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = Object.keys(this.users).length.toString()
    nb = nb.substring(nb.length - 3)
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
    return r

  }

  generateCodeEtu(prospect: Etudiant) {
    let user: any = prospect.user_id
    let code_pays = user.nationnalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[user.nationnalite] && code[user.nationnalite] != undefined) {
        code_pays = code[user.nationnalite]
      }
    })
    let prenom = user.firstname.substring(0, 1)
    let nom = user.lastname.substring(0, 1)
    let y = 0
    for (let i = 0; i < (nom.match(" ") || []).length; i++) {
      console.log(nom)
      nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
      y = nom.indexOf(" ", y) + 1
    }
    let dn = new Date(prospect.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = Object.keys(this.users).length.toString()
    nb = nb.substring(nb.length - 3)
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
    return r

  }

  expandRow(etu: Etudiant) {
    this.etudiantService.getFiles(etu?._id).subscribe(
      (data) => {
        this.ListDocuments = data
        this.ListPiped = []
        data.forEach(doc => {
          let docname: string = doc.replace("/", ": ").replace('releve_notes', 'Relevé de notes ').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
          this.ListPiped.push(docname)
        })
      },
      (error) => { console.error(error) }
    );
  }

  downloadFile(id, i) {
    this.etudiantService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), this.ListPiped[i])
    }, (error) => {
      console.error(error)
    })

  }
  VisualiserFichier(id, i) {
    this.etudiantService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    }, (error) => {
      console.error(error)
    })

  }


  deleteFile(id, i) {
    if (confirm("Voulez-vous vraiment supprimer le fichier " + this.ListPiped[i] + " ?")) {
      this.etudiantService.deleteFile(id, this.ListDocuments[i]).subscribe((data) => {
        this.messageService.add({ severity: "success", summary: "Le fichier a bien été supprimé" })
        this.ListDocuments.splice(i, 1)
        this.ListPiped.splice(i, 1)
      }, (error) => {
        this.messageService.add({ severity: "error", summary: "Le fichier n'a pas pu être supprimé", detail: error })
        console.error(error)
      })
    }
  }

  FileUpload(event) {
    if (this.uploadFileForm.value.typeDoc != null && event.files != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('id', this.showUploadFile._id)
      formData.append('document', this.uploadFileForm.value.typeDoc)
      formData.append('file', event.files[0])
      this.etudiantService.uploadFile(formData, this.showUploadFile._id).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.expandRow(this.showUploadFile)
        event.target = null;
        this.showUploadFile = null;
        this.fileInput.clear()
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }



  //Verification si le prospect est mineure ou majeur
  onIsMinor(): boolean {
    let result: boolean = false;

    //recuperation de l'année actuelle
    let anneeActuel = new Date().getFullYear();
    //recuperation de l'année de naissance du prospect
    let anneeDeNaissance = new Date(this.showAssignForm.date_naissance).getFullYear();

    //Calcule de la difference
    if (anneeActuel - anneeDeNaissance >= 18) {
      result = false;
    } else {
      result = true;
    }

    return result;
  }

  onAddParcours() {
    this.parcoursList.push({ diplome: "", date: new Date() })
  }

  /*onChangeParcours(i, event, type) {
    console.log(event.target.value)
    if (type == "date") {
      this.parcoursList[i][type] = new Date(event.target.value);
    } else {
      this.parcoursList[i][type] = event.target.value;
    }
  }*/

  onRemoveParcours(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le parcours ?")) {
      this.parcoursList.splice(i)
    }
  }

  getPayementRestant(){
    return "Test"
  }

  getPayementRestantEtu(){
    
  }

}
