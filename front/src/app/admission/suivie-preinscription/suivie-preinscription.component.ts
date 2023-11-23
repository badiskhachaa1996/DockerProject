import { Component, OnInit, ViewChild } from '@angular/core';

import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { saveAs } from "file-saver";
import { MessageService } from 'primeng/api';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AdmissionService } from 'src/app/services/admission.service';
import { Prospect } from 'src/app/models/Prospect';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-suivie-preinscription',
  templateUrl: './suivie-preinscription.component.html',
  styleUrls: ['./suivie-preinscription.component.scss']
})
export class SuiviePreinscriptionComponent implements OnInit {

  @ViewChild('fileInput') fileInput: FileUpload;
  showUpdatePassword = false
  passwordForm = new UntypedFormGroup({
    passwordactual: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required),
    verifypassword: new UntypedFormControl('', Validators.required),
  });
  onUpdatePassword() {
    let passwordactual = this.passwordForm.get('passwordactual').value;
    let password = this.passwordForm.get('password').value;
    let verifypassword = this.passwordForm.get('verifypassword').value;
    if (password = verifypassword) {
      let bypass: any = this.ProspectConnected.user_id
      this.UserService.verifPassword({ 'id': bypass._id, 'password': passwordactual }).subscribe(
        ((responseV) => {
          console.log(responseV);

          this.UserService.updatePwd(bypass._id, verifypassword).subscribe((updatedPwd) => {

            this.passwordForm.reset();
            this.showUpdatePassword = false;
            this.messageService.add({ severity: 'success', summary: 'Mot de passe ', detail: 'Votre mot de passe a été mis à jour avec succès' });

          }), ((error) => { console.error(error) })


        }),
      ), ((error) => {
        console.error(error)
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Mot de passe ', detail: 'Les mots de passe ne correspondent pas' });
      this.passwordForm.get('verifypassword').dirty
    }
  }
  ecoleProspect: any;
  subscription: Subscription;
  ListDocuments: String[] = [];
  ListPiped: String[] = [];
  boolVisa = ''
  ProspectConnected: Prospect = {}

  diplomeTest: boolean = false;
  piece_identiteTest: boolean = false;
  CVTest: boolean = false;
  LMTest: boolean = false;
  RdNTest: boolean = false;
  RdNTest2: boolean = false;
  TCFTest: boolean = false;
  editInfo = false
  codeCommercial;
  isCommercial = true
  DocTypes: any[] = [
    { value: null, label: "Choisissez le type de fichier", },
    { value: 'Carte_vitale', label: 'Carte vitale', },
    { value: 'Carte_sejour', label: "Carte séjour" },
    { value: 'Carte_etudiant', label: "Carte étudiant" },
    { value: 'Attestation_scolarite', label: 'Attestation de scolarité' },
    { value: 'Attestation_travail', label: 'Attestation de travaille' },
    { value: 'Visa', label: "Visa" },
    { value: "Justificatif_Sportif_Haut_Niveau", label: "Justificatif Sportif Haut Niveau" }
  ];

  DocTypes2: any[] = [
    { value: 'piece_identite', label: 'Pièce d\'identité', },
    { value: 'CV', label: "CV" },
    { value: 'LM', label: "LM" },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'releve_notes', label: 'Relevé de notes' },
    { value: 'TCF', label: "TCF" }
  ];
  isCommercialv2 = false
  cfList = [
    { label: "Pas d'avancement" },
    { label: "Compte Campus France crée" },
    { label: "En attente de l'entretien" },
    { label: "Entretien Validé" },
  ]

  visaList = [
    { label: "Oui", value: "Oui" },
    { label: "Non concerné", value: "Non concerné" },
    { label: "Non", value: "Non" },
    { label: "Pas de retour", value: "Pas de retour" },
  ]

  uploadFileForm: UntypedFormGroup = new UntypedFormGroup({
    typeDoc: new UntypedFormControl(this.DocTypes[0], Validators.required)
  })
  constructor(public activatedRoute: ActivatedRoute, private router: Router, private messageService: MessageService, private admissionService: AdmissionService, private UserService: AuthService) { }

  ngOnInit(): void {
    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);
    this.codeCommercial = localStorage.getItem("CommercialCode")
    if (localStorage.getItem('token'))
      this.isCommercialv2 = true
    if (this.activatedRoute.snapshot.params?.user_id) {
      this.admissionService.getPopulateByUserid(this.activatedRoute.snapshot.params?.user_id).subscribe(doc => {
        this.ProspectConnected = doc
        let { _id }: any = this.ProspectConnected.user_id
        this.ecoleProspect = this.ProspectConnected.type_form
        this.boolVisa = this.ProspectConnected.avancement_visa
        this.getFiles()
        this.UserService.getProfilePicture(_id).subscribe((data) => {
          console.log(data)
          if (data.error) {
            this.imageToShow = "../assets/images/avatar.PNG"
          } else {
            const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
            let blob: Blob = new Blob([byteArray], { type: data.documentType })
            if (blob) {
              this.imageToShow = "../assets/images/avatar.PNG"
              this.reader.readAsDataURL(blob);
            }
          }
        })
        this.getResteAPayer()
      })
    } else {
      this.ProspectConnected = jwt_decode(localStorage.getItem('ProspectConected'))['prospectFromDb'];
      this.getFiles()
      this.isCommercial = false

      let { _id }: any = this.ProspectConnected.user_id
      this.UserService.getProfilePicture(_id).subscribe((data) => {
        console.log(data)
        if (data.error) {
          this.imageToShow = "../assets/images/avatar.PNG"
        } else {
          const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([byteArray], { type: data.documentType })
          if (blob) {
            this.imageToShow = "../assets/images/avatar.PNG"
            this.reader.readAsDataURL(blob);
          }
        }
      })
      this.admissionService.getPopulateByUserid(_id).subscribe(data => {
        this.ProspectConnected = data
        console.log(data)
      })
    }

  }

  getFiles() {
    this.admissionService.getFiles(this.ProspectConnected._id).subscribe(
      (data) => {
        this.ListPiped = []
        this.ListDocuments = data
        for (let doc of this.ListDocuments) {
          let docname: string = doc.replace("/", ": ").replace('releve_notes1', '1er relevé de notes ').replace('releve_notes2', '2ème relevé de notes').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
          this.ListPiped.push(docname)
          if (doc.includes('diplome/')) {
            this.diplomeTest = true;
          }
          if (doc.includes('piece_identite/')) {
            this.piece_identiteTest = true;
          }
          if (doc.includes('CV/')) {
            this.CVTest = true;
          }
          if (doc.includes('LM/')) {
            this.LMTest = true;
          }
          if (doc.includes('releve_notes1/')) {
            this.RdNTest = true;
          }
          if (doc.includes('releve_notes2/')) {
            this.RdNTest2 = true;
          }
          if (doc.includes('TCF/')) {
            this.TCFTest = true;
          }
        }
      },
      (error) => { console.error(error) }
    );
  }

  resetAuth() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }

  comeBack() {
    localStorage.removeItem('ProspectConected');
    this.router.navigateByUrl('/gestion-preinscriptions/' + this.codeCommercial)
  }



  FileUpload(event, doc: string) {
    let docname: string = doc.replace("/", ": ").replace('releve_notes1', '1er relevé de notes ').replace('releve_notes2', '2ème relevé de notes').replace('diplome', 'Diplôme').replace('piece_identite', 'Pièce d\'identité').replace("undefined", "Document");
    this.messageService.add({ severity: 'info', summary: 'Fichier en cours d\envoi', detail: docname + ' en cours d\'upload\nVeuillez Patientez' });
    let formData = new FormData();
    formData.append('id', this.ProspectConnected._id);
    formData.append('document', doc);
    formData.append('file', event.files[0]);
    this.admissionService.uploadFile(formData, this.ProspectConnected._id, 'ProspectConected').subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: docname + ' a été envoyé' });
      this.getFiles()
      if (this.diplomeTest && this.piece_identiteTest && this.CVTest && this.LMTest && this.RdNTest && this.RdNTest2 && this.TCFTest) {
        this.messageService.add({ severity: 'success', summary: 'Tous les documents ont été envoyés', detail: "Attendez la validation par un agent." });
      }
      if (this.ProspectConnected.etat_traitement != "Nouvelle") {
        this.admissionService.changeEtatTraitement(this.ProspectConnected._id, "Retour Etudiant", 'ProspectConected')
      }
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: doc, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });


    this.fileInput.clear()
    event.target = null;
  }

  changementVisa(value) {
    this.admissionService.updateVisa(this.ProspectConnected._id, value).subscribe(v => {
      if (value == 'true')
        this.messageService.add({ severity: 'success', summary: `Changement du statut du visa par: Reçu` })
      else
        this.messageService.add({ severity: 'success', summary: `Changement du statut du visa par: En attente` })
    })
  }
  demandeConsultant: UntypedFormGroup = new UntypedFormGroup({
    mail: new UntypedFormControl('', Validators.required)
  })
  sendDemande() {
    this.admissionService.envoieMail(this.demandeConsultant.value.mail, this.ProspectConnected).subscribe(r => {
      this.messageService.add({ severity: 'success', summary: "Demande envoyé avec succès !" })
      this.demandeConsultant.reset()
    })
  }
  editInfoForm: UntypedFormGroup = new UntypedFormGroup({
    lastname: new UntypedFormControl('', Validators.required),
    firstname: new UntypedFormControl('', Validators.required),
    phone: new UntypedFormControl('', Validators.required),
    date_naissance: new UntypedFormControl('', Validators.required),
    nationnalite: new UntypedFormControl('', Validators.required),
    _id: new UntypedFormControl("", Validators.required)
  })
  initEditForm() {
    let bypass: any = this.ProspectConnected?.user_id
    this.editInfoForm.setValue({
      lastname: bypass?.lastname,
      firstname: bypass?.firstname,
      phone: bypass?.phone,
      date_naissance: new Date(this.ProspectConnected?.date_naissance),
      nationnalite: bypass.nationnalite,
      _id: bypass._id
    })
    console.log(this.editInfoForm.value.date_naissance)
    this.editInfo = true;
  }

  saveInfo() {
    this.UserService.patchById({ ...this.editInfoForm.value }).then(users => {
      this.admissionService.getPopulateByUserid(this.editInfoForm.value._id).subscribe(doc => {
        this.ProspectConnected = doc
        this.messageService.add({ severity: 'success', summary: "Modifications des informations avec succès" })
        this.editInfo = false
      })
    })
  }
  padTo2Digits(num) { return num.toString().padStart(2, '0'); }
  formatDate(date) {

    date = new Date(date)
    if (date != 'Invalid Date' && date.getFullYear() != '1970')
      return [this.padTo2Digits(date.getDate()), this.padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('/');
    else return ''
  }
  clickFile() {
    document.getElementById('selectedFile').click();
  }
  imageToShow: any = "../assets/images/avatar.PNG";
  reader: FileReader = new FileReader();
  FileUploadPDP(event) {
    if (event && event.length > 0) {
      const formData = new FormData();
      let { _id }: any = this.ProspectConnected.user_id
      formData.append('id', _id)
      formData.append('file', event[0])

      this.UserService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de votre photo de profil avec succès' });
        this.imageToShow = "../assets/images/avatar.PNG"
        this.reader.readAsDataURL(event[0]);
        let avoidError: any = document.getElementById('selectedFile')
        avoidError.value = ""
        //this.UserService.reloadImage(this.token.id)
      }, (error) => {
        console.error(error)
      })
    }
  }
  downloadAttestation() {
    this.messageService.add({ severity: "info", summary: "Cette fonctionnalité est encore en développement, merci de patienter." })
  }
  resteAPayer = 0

  getResteAPayer() {
    let total = 0
    this.ProspectConnected.payement.forEach(val => {
      total += parseInt(val.montant)
    })
    let toPay = 0 //TODO Récupérer le reste à Payer
    this.resteAPayer = toPay - total
    if (this.resteAPayer < 0)
      this.resteAPayer = 0
  }

  VisualiserFichier(id, i) {
    this.admissionService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    }, (error) => {
      console.error(error)
    })

  }

  updateValue(label) {
    let dic = { _id: this.ProspectConnected._id }
    dic[label] = this.ProspectConnected[label]
    this.admissionService.updateV2(dic,"Mis à jour du suivi Suivi").subscribe(data => {
      console.log(data, data[label], "Succès")
    })
  }

  cols = [
    { header: "Date de délivrance" },
    { header: "Nom du document" },
    { header: "Lien de téléchargement" },
  ]

  downloadAdminFile(path) {
    this.admissionService.downloadFileAdmin(this.ProspectConnected._id, path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(blob, path)
    }, (error) => {
      console.error(error)
    })

  }
}
