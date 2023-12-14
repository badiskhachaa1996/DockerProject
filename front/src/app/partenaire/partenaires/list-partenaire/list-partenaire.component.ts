import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from "file-saver";
import { TabViewModule } from 'primeng/tabview';

import { MessageService as ToastService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { CampusService } from 'src/app/services/campus.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { AuthService } from 'src/app/services/auth.service';
import { Partenaire } from 'src/app/models/Partenaire';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { TeamsIntService } from 'src/app/services/teams-int.service';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { RhService } from 'src/app/services/rh.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list-partenaire',
  templateUrl: './list-partenaire.component.html',
  styleUrls: ['./list-partenaire.component.scss'],
  providers: [MessageService, ConfirmationService],
  styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }
    `]
})
export class ListPartenaireComponent implements OnInit {
  selectedPartnerName: string | undefined;

  selectedInsert: Partenaire | null = null;
  activeIndex1: number = 0;
  expandedRows = {};
  FjTopatch: any;
  Ttopatch: any;
  partenaires: Partenaire[] = []
  users = {}
  token;

  rowData: any;

  currenData
  uploadedFileName: string;

  handleClose(e) {

    e.close();
  }
  showFormAddPartenaire = false
  statutList = environment.typeUser
  civiliteList = environment.civilite;
  paysList = environment.pays;
  filterPays = this.paysList
  entreprisesList = []
  campusList = []
  formationList = []
  typeSoc = [{ value: "Professionel (Société)" }, { value: "Particulier (Personne)" }]
  formatJuridique = [{ value: "EIRL" }, { value: "EURL" }, { value: "SARL" }, { value: "SA" }, { value: "SAS" }, { value: "SNC" }, { value: "Etudiant IMS" }, { value: "Individuel" }]
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  dropdownAnciennete = [
    { label: "Nouveau < 1 an", value: "Nouveau < 1 an" },
    { label: "Ancien > 1 an", value: "Ancien > 1 an" }
  ]
  dropdownContribution = [
    { label: "Actif", value: "Actif" },
    { label: "Inactif", value: "Inactif" },
    { label: "Occasionnel", value: "Occasionnel" },
  ]
  dropdownEtatContrat = [
    { label: "Non", value: "Non" },
    { label: "En cours", value: "En cours" },
    { label: "Signé", value: "Signé" },
    { label: "Annulé", value: "Annulé" },
  ]
  dropdownType = [
    { label: 'Apporteur d\'affaire', value: 'Apporteur d\'affaire' },
    { label: 'Agence de voyage', value: 'Agence de voyage' },
    { label: 'Entreprise', value: 'Entreprise' },
  ]
  localisationList = environment.pays

  registerForm: FormGroup;

  formModifPartenaire: FormGroup;
  partenaireToUpdate: Partenaire;
  idPartenaireToUpdate: Partenaire;
  idUserOfPartenaireToUpdate: string;
  showFormModifPartenaire = false;
  partenaireList: any = {};
  internationalList = []

  managePartenaire: Partenaire

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('dt') table: Table;

  canDelete = false

  filterAnciennete = [{ label: 'Toutes les anciennetes', value: null },
  { label: "Nouveau < 1 an", value: "Nouveau < 1 an" },
  { label: "Ancien > 1 an", value: "Ancien > 1 an" }]

  filterContribution = [{ label: 'Toutes les contributions', value: null },
  { label: "Actif", value: "Actif" },
  { label: "Inactif", value: "Inactif" },
  { label: "Occasionnel", value: "Occasionnel" }]
  filterEtat = [{ label: 'Tous les états de contrats', value: null },
  { label: "Non", value: "Non" },
  { label: "En cours", value: "En cours" },
  { label: "Signé", value: "Signé" },
  { label: "Annulé", value: "Annulé" },]
  AccessLevel = "Spectateur"
  constructor(private formBuilder: FormBuilder, private messageService: ToastService, private partenaireService: PartenaireService, private route: ActivatedRoute,
    private router: Router, private UserService: AuthService, private CService: CommercialPartenaireService, private PartenaireService: PartenaireService,
    private MIService: TeamsIntService , private rHservise:RhService ,private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    //this.getPartenaireList();
    let tkn: any = jwt_decode(localStorage.getItem("token"))
    this.canDelete = (tkn && (tkn['role'] == 'Admin' || tkn['role'] == "Responsable"))

    this.updateList();
    this.filterPays = [{ label: 'Tous les pays', value: null }].concat(this.paysList)
    this.onInitFormModifPartenaire()
    this.rHservise.getCollaborateurs().then(data => {
      data.forEach(d => {
        if (d.user_id)
          this.internationalList.push({ label: `${d.user_id.lastname} ${d.user_id.firstname}`, value: d._id })
      })
    })
    this.UserService.getPopulate(tkn.id).subscribe(user => {
      let data: User = user
      data.roles_list.forEach(val => {
        if (val.module == "Partenaire")
          this.AccessLevel = val.role
      })
      if (user.role == 'Admin')
        this.AccessLevel = 'Super-Admin'
    })
  }

  partenaireDic = {}



  updateList() {
    this.partenaireService.getAll().subscribe(data => {
      this.partenaires = data
    })
    this.CService.getAllPopulate().subscribe((commercials: CommercialPartenaire[]) => {
      commercials.forEach(c => {
        if (c.user_id && c.partenaire_id && c.user_id.last_connexion) {
          if (this.partenaireDic[c.partenaire_id._id]) {
            if (new Date(c.user_id.last_connexion).getTime() > new Date(this.partenaireDic[c.partenaire_id._id]).getTime())
              this.partenaireDic[c.partenaire_id._id] = new Date(c.user_id.last_connexion)
          } else {
            this.partenaireDic[c.partenaire_id._id] = new Date(c.user_id.last_connexion)
          }
        }
      })
    })
    /*this.UserService.getAll().subscribe(dataU => {
      dataU.forEach(u => {
        this.users[u._id] = u
      })
    })*/
  }

  seePreRecruted(rowData: Partenaire) {
    this.router.navigate(["/international/partenaire/" + rowData._id])
  }

  seeAlternants(rowData: Partenaire) {
    this.router.navigate(["/international/partenaire/alternants/" + rowData._id])
  }

  seeRecruted(rowData: Partenaire) {
    this.router.navigate(["/etudiants/" + rowData._id])
  }

  seeUnderPartenaire(rowData) {
    this.router.navigate(["/collaborateur/" + rowData._id])
  }

  delete(rowData: Partenaire) {
    if (confirm("La suppression de ce partenaire, supprimera aussi tous les commerciaux/collaborateurs avec leurs comptes IMS et enlevera leurs codes commerciaux de tous leurs leads\n L'équipe IMS ne sera pas responsable si cela occasione un problème du à la suppresion\nEtes-vous sûr de vouloir faire cela ?"))
      this.partenaireService.delete(rowData._id).subscribe(p => {
        this.partenaires.forEach((val, index) => {
          if (val._id == p._id) {
            this.partenaires.splice(index, 1)
          }
        })
      })
  }


  //Permet de vider les filtres
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }



  //Méthode de récupération du partenaire à modifier
  onGetbyId(rowData: Partenaire) {


    for (var i = 0; i < this.formatJuridique.length; i++) {
      if (this.formatJuridique[i].value === rowData.format_juridique) {
        this.FjTopatch = i
      }
    }

    for (var i = 0; i < this.typeSoc.length; i++) {
      if (this.typeSoc[i].value === rowData.type) {
        this.Ttopatch = i
      }
    }

    this.commissions = rowData.commissions
    console.log(rowData.commissions)
    this.idPartenaireToUpdate = rowData;
    this.formModifPartenaire.patchValue({
      nom: rowData.nom,
      phone: rowData.phone,
      emailPartenaire: rowData.email,
      number_TVA: rowData.number_TVA,
      SIREN: rowData.SIREN,
      SIRET: rowData.SIRET,
      format_juridique: this.formatJuridique[this.FjTopatch],
      type: this.typeSoc[this.Ttopatch],
      APE: rowData.APE,
      Services: rowData.Services,
      Pays: rowData.Pays,
      WhatsApp: rowData.WhatsApp,
      indicatif: rowData.indicatifPhone,
      indicatif_whatsapp: rowData.indicatifWhatsapp,
    });
  }


  updateSelectedPartnerName(name: string | undefined) {
    this.selectedPartnerName = name;
  }




  //Méthode d'initialisation du formulaire de modification d'un partenaire
  onInitFormModifPartenaire() {
    this.formModifPartenaire = this.formBuilder.group({
      nom: ['', [Validators.required]],
      type: ['', [Validators.required]],
      format_juridique: ['', [Validators.required]],
      indicatif: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      phone: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      indicatif_whatsapp: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      WhatsApp: ['', [Validators.pattern('[- +()0-9]+')]],
      emailPartenaire: ['', [Validators.required, Validators.email]],
      number_TVA: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      SIREN: ['', [Validators.pattern('[- +()0-9]+')]],
      SIRET: ['', [Validators.pattern('[- +()0-9]+')]],
      APE: [''],
      Services: ['', [Validators.required]],
      Pays: ['', [Validators.required]],
    });

  };

  //Traitement du formulaire de modification 
  get nomSoc_m() { return this.formModifPartenaire.get('nomSoc'); }
  get type_m() { return this.formModifPartenaire.get('type'); }
  get format_juridique_m() { return this.formModifPartenaire.get('format_juridique'); }
  get indicatif_m() { return this.formModifPartenaire.get('indicatif'); }
  get phonePartenaire_m() { return this.formModifPartenaire.get('phonePartenaire'); };
  get indicatif_whatsapp_m() { return this.formModifPartenaire.get('indicatif_whatsapp'); };
  get WhatsApp_m() { return this.formModifPartenaire.get('WhatsApp'); };
  get emailPartenaire_m() { return this.formModifPartenaire.get('emailPartenaire'); };
  get number_TVA_m() { return this.formModifPartenaire.get('number_TVA'); };
  get SIREN_m() { return this.formModifPartenaire.get('SIREN'); };
  get SIRET_m() { return this.formModifPartenaire.get('SIRET'); };
  get APE_m() { return this.formModifPartenaire.get('APE'); };
  get Services_m() { return this.formModifPartenaire.get('Services'); };
  get Pays_m() { return this.formModifPartenaire.get('Pays'); };


  //Méthode de modification d'un partenaire
  onModdifPartenaire() {
    let nomSoc_m = this.formModifPartenaire.get('nomSoc').value;
    let type_m = this.formModifPartenaire.get('type').value;
    let format_juridique_m = this.formModifPartenaire.get('format_juridique').value;
    let indicatif_m = this.formModifPartenaire.get('indicatif').value;
    let phonePartenaire_m = this.formModifPartenaire.get('phonePartenaire').value;
    let indicatif_whatsapp_m = this.formModifPartenaire.get('indicatif_whatsapp').value;
    let WhatsApp_m = this.formModifPartenaire.get('WhatsApp').value;
    let emailPartenaire_m = this.formModifPartenaire.get('emailPartenaire').value;
    let number_TVA_m = this.formModifPartenaire.get('number_TVA').value;
    let SIREN_m = this.formModifPartenaire.get('SIREN').value;
    let SIRET_m = this.formModifPartenaire.get('SIRET').value;
    let APE_m = this.formModifPartenaire.get('APE').value;
    let Services_m = this.formModifPartenaire.get('Services').value;
    let Pays_m = this.formModifPartenaire.get('Pays').value;
    this.partenaireToUpdate = new Partenaire(
      this.idPartenaireToUpdate._id,
      null,
      null,
      nomSoc_m,
      phonePartenaire_m,
      emailPartenaire_m,
      number_TVA_m,
      SIREN_m,
      SIRET_m,
      format_juridique_m.value,
      type_m.value,
      APE_m,
      Services_m,
      Pays_m,
      WhatsApp_m,
      indicatif_m,
      indicatif_whatsapp_m,
    );

    this.partenaireService.updatePartenaire(this.partenaireToUpdate).subscribe(
      ((reponses) => {
        this.messageService.add({ severity: 'success', summary: 'Modification du partenaire', detail: 'Le partenaire a bien été modifié. ' });
        this.partenaireService.getAll().subscribe(
          ((reponses) => {
            this.partenaires = reponses;
          }),
          ((error) => { console.error(error); })
        );
      }),
      ((error) => { console.error(error); })
    );

    this.formModifPartenaire.reset();
    this.showFormModifPartenaire = false;



  }



  showFormModifyPartenaire(rowData: any) {
    this.showFormModifPartenaire = true;
    this.activeIndex1 = 2;
    this.idPartenaireToUpdate = rowData;
    this.onGetbyId(rowData);
    this.loadPP(rowData);
  }

  onRedirect() {
    this.router.navigate(['partenaireInscription']);
  }

  clickFile() {
    document.getElementById('selectedFile').click();
  }

  FileUploadPC(event) {
    if (event && event.length > 0 && this.idPartenaireToUpdate != null) {
      const formData = new FormData();

      formData.append('id', this.idPartenaireToUpdate._id)
      formData.append('file', event[0])
      this.CService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de la photo de profil avec succès' });
        this.loadPP(this.idPartenaireToUpdate)
      }, (error) => {
        console.error(error)
      })
    }
  }

  clickFile2() {

    
    document.getElementById('selectedFile2').click();
  }
 
  FileUpload2(event) {
    if (event && event.length > 0 && this.idPartenaireToUpdate != null) {
      const formData = new FormData();
 
      formData.append('id', this.idPartenaireToUpdate._id)
      formData.append('file', event[0])
      this.PartenaireService.uploadEtatContrat(formData).subscribe(data => {
        this.resetFileInput(event);
        this.uploadedFileName = event[0].name;
        this.messageService.add({ severity: 'success', summary: 'Etat de Contract', detail: 'Nouvelle etat de contrat enregistré' })
 
      })
    }
  }
  resetFileInput(event) {
    if (event && event.length > 0) {
      event[0].value = "";

    }
  }

  imageToShow: any = "../assets/images/avatar.PNG"
  commissions: any[] = []
  loadPP(rowData) {
    this.imageToShow = "../assets/images/avatar.PNG"
    console.log(rowData)
    this.CService.getProfilePicture(rowData._id).subscribe((data) => {
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
  }
  editInfoCommercial = false
  editInfoCommercialForm: FormGroup = new FormGroup({
    indicatifPhone: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    indicatifWhatsapp: new FormControl(''),
    WhatsApp: new FormControl(''),
    site_web: new FormControl(''),
    facebook: new FormControl(''),
    Pays: new FormControl([], Validators.required),
    Services: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })
  initEditCommercialForm() {
    this.editInfoCommercial = true
    this.editInfoCommercialForm.setValue({
      indicatifPhone: this.idPartenaireToUpdate.indicatifPhone,
      phone: this.idPartenaireToUpdate.phone,
      indicatifWhatsapp: this.idPartenaireToUpdate.indicatifWhatsapp,
      WhatsApp: this.idPartenaireToUpdate.WhatsApp,
      site_web: this.idPartenaireToUpdate.site_web,
      facebook: this.idPartenaireToUpdate.facebook,
      Pays: this.idPartenaireToUpdate.Pays.split(','),
      Services: this.idPartenaireToUpdate.Services,
      description: this.idPartenaireToUpdate.description,
    })
  }

  saveEditCommercialInfo() {

    let data = { ...this.editInfoCommercialForm.value }
    data._id = this.idPartenaireToUpdate._id
    data.Pays = data.Pays.join(',')
    this.PartenaireService.newUpdate(data).subscribe(partenaire => {
      this.idPartenaireToUpdate = partenaire
      this.messageService.add({ severity: 'success', summary: 'Informations Partenaires', detail: 'Mise à jour des informations avec succès' });
      this.editInfoCommercial = false
    })
  }

  ajoutCommission = new FormGroup({
    description: new FormControl('', Validators.required),
    montant: new FormControl('', Validators.required)
  })
  addCommission() {
    if (this.commissions)
      this.commissions.push({ ...this.ajoutCommission.value })
    else {
      this.commissions = [{ ...this.ajoutCommission.value }]
    }
    //Update sur le server
    this.PartenaireService.newUpdate({ _id: this.idPartenaireToUpdate._id, commissions: this.commissions }).subscribe(data => {

      this.ajoutCommission.reset()
    })

  }
  deleteCommission(co) {
    this.commissions.splice(this.commissions.indexOf(co), 1)
    //Update sur le server
    this.PartenaireService.newUpdate({ _id: this.idPartenaireToUpdate._id, commissions: this.commissions }).subscribe(data => {
    })
  }
  clonedCommissions: { [s: string]: { _id: string, description: string, montant: string }; } = {};
  onRowEditInit(co: { _id: string, description: string, montant: string }) {
    this.clonedCommissions[co._id] = { ...co };
  }

  onRowEditSave(product: { _id: string, description: string, montant: string }) {
    delete this.clonedCommissions[product._id];

    this.PartenaireService.newUpdate({ _id: this.idPartenaireToUpdate._id, commissions: this.commissions }).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commission mis à jour' });
    })
  }

  onRowEditCancel(product: { _id: string, description: string, montant: string }, index: number) {
    
    //console.log(product, index, this.commissions[index], this.clonedCommissions[product._id])
    this.commissions[index] = this.clonedCommissions[product._id];
    delete this.clonedCommissions[product._id];
  }

  downloadContrat() {
    console.log('downloadContrat called with id:', this.idPartenaireToUpdate._id);

    this.PartenaireService.downloadContrat(this.idPartenaireToUpdate._id)
      .then((response: Blob) => {
        console.log('Download successful. Response:', response);

        let downloadUrl = window.URL.createObjectURL(response);
        
        saveAs(downloadUrl, this.idPartenaireToUpdate.pathEtatContrat);
        this.messageService.add({ severity: "success", summary: "Contrat", detail: `Téléchargement réussi` });
      })
      .catch((error) => { 
        console.error('Download failed. Error:', error);
        this.messageService.add({ severity: "error", summary: "Calendrier", detail: `Impossible de télécharger le fichier` }); 
      });
  }
  editInfoPartenariat = false
  editInfoPartenariatForm: FormGroup = new FormGroup({
    statut_anciennete: new FormControl('', Validators.required),
    contribution: new FormControl('', Validators.required),
    typePartenaire: new FormControl(''),
    groupeWhatsApp: new FormControl(''),
    localisation: new FormControl('')
  })
  initEditPartenariatForm() {
    this.editInfoPartenariat = true
    console.log(this.idPartenaireToUpdate)
    this.editInfoPartenariatForm.patchValue({
      ...this.idPartenaireToUpdate
    })
  }

  saveEditPartenariatForm() {
    let data = { ...this.editInfoPartenariatForm.value }
    data._id = this.idPartenaireToUpdate._id
    this.PartenaireService.newUpdate(data).subscribe(partenaire => {
      this.idPartenaireToUpdate = partenaire
      this.messageService.add({ severity: 'success', summary: 'Informations Partenaires', detail: 'Mise à jour des informations avec succès' });
      this.editInfoPartenariat = false
    })
  }

  updateEtatContrat() {

    let data = { _id: this.idPartenaireToUpdate._id, etat_contrat: this.idPartenaireToUpdate.etat_contrat }
    this.PartenaireService.newUpdate(data).subscribe(partenaire => {
      console.log(partenaire)
    })
  }
  /*getPartenaireList() 
  {
    this.partenaireService.getAll().subscribe((data) =>{
      this.partenaireList = data;
    }, error => {
      console.error(error)
    })
  }*/

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 50) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  onSelectManage(id: string) {
    this.PartenaireService.newUpdate({ manage_by: id, _id: this.managePartenaire._id }).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Attribution du partenaire avec succès' })
      
      this.cd.detectChanges();

    })
  }

  initManage(rowData: Partenaire) {
    this.managePartenaire = rowData
    if (!rowData.manage_by)
      this.managePartenaire['manage_by'] = { _id: null }
  }
}

