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

@Component({
  selector: 'app-reinscrit',
  templateUrl: './reinscrit.component.html',
  styleUrls: ['./reinscrit.component.scss']
})
export class ReinscritComponent implements OnInit {

  @ViewChild('fileInput') fileInput: FileUpload;
  showUploadFile: Etudiant;
  etudiants: Etudiant[] = [];
  users= {};
  token;
  imageToShow;
  parcoursList = []

  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  statutList = [
    { value: "Etudiant" },
    { value: "Alternant" }
  ]

  ListDocuments: String[] = []
  ListPiped: String[] = []
  DocTypes: any[] = [
    { value: null, label: "Choississez le type de fichier", },
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];
  showAssignForm: Etudiant = null;

  AssignForm: FormGroup = this.formBuilder.group({
    groupe: ["", Validators.required],
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
    nom_tuteur: [''],
    prenom_tuteur: [''],
    adresse_tuteur: [''],
    email_tuteur: [''],
    phone_tuteur: [''],
    indicatif_tuteur: [''],
    remarque: ['']
  })

  initForm(etudiant: Etudiant) {
    let s = (etudiant.statut == "Etudiant") ? "Etudiant" : "Alternant";
    this.AssignForm.patchValue({
      customid: etudiant.custom_id,
      statut: { value: s },
      sos_email: etudiant.sos_email,
      sos_phone: etudiant.sos_phone,
      nom_rl: etudiant.nom_rl,
      prenom_rl: etudiant.prenom_rl,
      phone_rl: etudiant.phone_rl,
      email_rl: etudiant.email_rl,
    })
    if (s == "Alternant") {
      this.AssignForm.patchValue({
        numero_ine: etudiant.numero_INE,
        numero_nir: etudiant.numero_NIR,
        adresse_rl: etudiant.adresse_rl,
        entreprise: etudiant.entreprise,
        nom_tuteur: etudiant.nom_tuteur,
        prenom_tuteur: etudiant.prenom_tuteur,
        adresse_tuteur: etudiant.adresse_tuteur,
        email_tuteur: etudiant.email_tuteur,
        phone_tuteur: etudiant.phone_tuteur,
        indicatif_tuteur: etudiant.indicatif_tuteur,

      })
    }
  }

  uploadFileForm: FormGroup = new FormGroup({
    typeDoc: new FormControl(this.DocTypes[0], Validators.required)
  })

  groupeList = [];
  constructor(public etudiantService: EtudiantService, private messageService: MessageService,
    private formBuilder: FormBuilder, public classeService: ClasseService, public userService: AuthService) { }

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
    this.refreshEtudiant()
  }

  onAddEtudiant() {
    let etd: Etudiant = new Etudiant(
      this.showAssignForm._id,
      this.showAssignForm.user_id,
      this.AssignForm.value.groupe,
      this.AssignForm.value.statut.value,
      this.users[this.showAssignForm.user_id].nationalite,
      this.showAssignForm.date_naissance,
      this.showAssignForm.code_partenaire,
      null, null, null, null,
      this.AssignForm.value.numero_ine, this.AssignForm.value.numero_nir, this.AssignForm.value.sos_email, this.AssignForm.value.sos_phone, this.AssignForm.value.nom_rl, this.AssignForm.value.prenom_rl, this.AssignForm.value.phone_rl, this.AssignForm.value.email_rl, this.AssignForm.value.adresse_rl,//A faire pour Alternant
      this.showAssignForm.dernier_diplome,
      this.AssignForm.value.statut.value == "Alternant",
      this.AssignForm.value.nom_tuteur, this.AssignForm.value.prenom_tuteur, this.AssignForm.value.adresse_tuteur, this.AssignForm.value.email_tuteur, this.AssignForm.value.phone_tuteur, this.AssignForm.value.indicatif_tuteur
      , this.showAssignForm.isHandicaped, this.showAssignForm.suivi_handicaped, this.showAssignForm.entreprise, this.showAssignForm.diplome, this.parcoursList, this.AssignForm.value.remarque
    )
    etd.custom_id=this.generateCode(etd)
    this.etudiantService.update(etd).subscribe(data => {
      this.refreshEtudiant()
      this.messageService.add({ severity: "success", summary: "Etudiant réinscrit avec succès" })
      this.showAssignForm = null
    }, err => {
      this.messageService.add({ severity: "error", summary: "Problème avec la réinscription", detail: err })
      console.error(err)
    })
  }
  refreshEtudiant() {
    this.etudiantService.getAllWait().subscribe(data => {
      this.etudiants = data
    })
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user) => {
          this.users[user._id] = user;
        });
      })
    );
  }

  generateCode(prospect:Etudiant) {
    let user: any = prospect.user_id
    let code_pays = user.nationnalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code=>{
      if(code[user.nationnalite] && code[user.nationnalite]!=undefined){
        code_pays=code[user.nationnalite]
      }
    })
    let prenom = user.firstname.substring(0, 1)
    let nom = user.lastname.substring(0, 1)
    let y = 0
    for (let i = 0; i < (nom.match(" ") || []).length; i++) {
      nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
      y = nom.indexOf(" ", y) + 1
    }
    let dn = new Date(prospect.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = Object.keys(this.users).length.toString()
    console.log(nb)
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

  loadPP(rowData) {
    this.imageToShow = "../assets/images/avatar.PNG"
    this.userService.getProfilePicture(rowData.user_id).subscribe((data) => {
      if (data.error) {
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        let reader: FileReader = new FileReader();
        reader.addEventListener("load", () => {
          this.imageToShow = reader.result;
        }, false);
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          reader.readAsDataURL(blob);
        }
      }

    })
    this.etudiantService.getFiles(rowData?._id).subscribe(
      (data) => {
        this.ListDocuments = data
      },
      (error) => { console.error(error) }
    );
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

}
