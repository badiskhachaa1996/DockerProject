import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as mongoose from 'mongoose';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { Partenaire } from 'src/app/models/Partenaire';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { environment } from 'src/environments/environment';
import { saveAs } from "file-saver";
import { FileUpload } from 'primeng/fileupload';
@Component({
  selector: 'app-list-collaborateur',
  templateUrl: './list-collaborateur.component.html',
  styleUrls: ['./list-collaborateur.component.scss']
})
export class ListCollaborateurComponent implements OnInit {

  partenaire: Partenaire;
  paysList = environment.pays
  commercialPartenaires: CommercialPartenaire[] = [];

  formAddCommercial: FormGroup;
  showFormAddCommercial: boolean = false;

  formUpdateCommercial: FormGroup;
  showFormUpdateCommercial: boolean = false;

  idCommercialToUpdate: string;
  commercialToUpdate: CommercialPartenaire;

  idUserToUpdate: string;
  userToUpdate: User;

  idPartenaire: string = this.activatedRoute.snapshot.params['id'];

  users: User[] = [];
  dropdownUser: User[] = [];

  token

  civiliteList = [
    { label: 'Mr', value: 'Mr' },
    { label: 'Mme', value: 'Mme' },
    { label: 'Autre', value: 'Autre' },
  ];

  statutList = [
    { label: 'Interne', value: 'Interne' },
    { label: 'Interne admin', value: 'Interne admin' },
    { label: 'Externe', value: 'Externe' }
  ];

  contributionList = [
    { label: 'Actif', value: 'Actif' },
    { label: 'Inactif', value: 'Inactif' },
    { label: 'Occasionnelle', value: 'Occasionnelle' },
  ]

  etatContratList = [
    { label: 'Non', value: 'Non' },
    { label: 'En cours', value: 'En cours' },
    { label: 'Signé', value: 'Signé' },
    { label: 'Annulé', value: 'Annulé' },
  ]

  canDelete = false
  gestionCommercial: CommercialPartenaire
  formGestion: FormGroup = new FormGroup({
    contribution: new FormControl(),
    pays_prospections: new FormControl([]),
    localisation: new FormControl(),
    etat_contrat: new FormControl(),
    commissions: new FormControl([])
  })

  formCommission: FormGroup = new FormGroup({
    description: new FormControl(''),
    montant: new FormControl(0),
  })

  onAddCommission() {
    let commissions: [{ description: string, montant: number, _id: string }] = this.formGestion.value.commissions
    commissions.push({ ...this.formCommission.value, _id: new mongoose.Types.ObjectId().toString() })
    this.formGestion.patchValue({ commissions })
    this.gestionCommercial.commissions = commissions
    this.formCommission.reset()
    this.AddCommission = false
  }
  onGestion() {
    this.commercialPartenaireService.newUpdate({ ...this.formGestion.value, _id: this.gestionCommercial._id }).subscribe(data => {
      this.commercialPartenaires.splice(this.commercialPartenaires.indexOf(this.gestionCommercial), 1, data)
      this.formGestion.reset()
      this.gestionCommercial = null
      this.messageService.add({ severity: 'success', summary: 'Modification du collaborateur avec succès' });
    })
  }

  AddCommission = false

  constructor(private partenaireService: PartenaireService, private activatedRoute: ActivatedRoute, private messageService: MessageService,
    private commercialPartenaireService: CommercialPartenaireService, private userService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem('token'));
    this.canDelete = (this.token && (this.token['role'] == 'Admin' || this.token['role'] == "Responsable"))
    //Recuperation des données
    this.onGetData();

    //Recuperation des infos du partenaire
    this.partenaireService.getById(this.activatedRoute.snapshot.params['id']).subscribe(
      ((response) => { this.partenaire = response; }),
      ((error) => { console.error(error); })
    );

    //Initialisation des formulaires
    this.onInitFormAddCommercial();
    this.onInitFormUpdateCommercial();
  }


  //Methode d'initialisation du formulaire d'ajout d'un commercial-partenaire
  onInitFormAddCommercial() {
    this.formAddCommercial = this.formBuilder.group({
      civilite: [this.civiliteList[0]],
      firstname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      lastname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      email: ['', Validators.required],
      statut: [this.statutList[0], Validators.required],
      password: ['', Validators.required],
      password_confirmed: ['', Validators.required],
    });
  }

  //pour la partie de traitement des erreurs sur le formulaire
  get firstname() { return this.formAddCommercial.get('firstname'); };
  get lastname() { return this.formAddCommercial.get('lastname'); };
  get phone() { return this.formAddCommercial.get('phone'); };

  get password() { return this.formAddCommercial.get('password'); };
  get password_confirmed() { return this.formAddCommercial.get('password_confirmed'); };


  //Methode d'ajout du commercial
  onAddCommercial() {
    //recupération des données du formulaire
    let civilite = this.formAddCommercial.get('civilite')?.value.value;
    let firstname = this.formAddCommercial.get('firstname')?.value;
    let lastname = this.formAddCommercial.get('lastname')?.value;
    let phone = this.formAddCommercial.get('phone')?.value;
    let email = this.formAddCommercial.get('email')?.value;
    let password = this.formAddCommercial.get('password')?.value;
    let statut = this.formAddCommercial.get('statut')?.value.value;

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(null, firstname, lastname, null, phone, email, email, password, 'Agent', null, null, civilite, null, null, null, null, null, null, null, null, null);

    //Pour la creation du nouveau commercial
    let newCommercialPartenaire = new CommercialPartenaire(null, this.partenaire._id, null, this.generateCode(), statut);

    this.commercialPartenaireService.create({ 'newUser': newUser, 'newCommercialPartenaire': newCommercialPartenaire }).subscribe(
      ((response) => {
        if (response.success) {
          //Recuperation des données apres ajout du commercial
          this.onGetData();

          this.messageService.add({ severity: 'success', summary: 'Ajout reussi' });

          this.formAddCommercial.reset();
          this.showFormAddCommercial = false;

        } else {
          console.error(response)
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout', detail: "L'email est peut être déjà utilisé" });
        }
      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout, veuillez contacter un administrateur' });
        console.error(error);
      })
    );
  }
  generateCode(): string {
    let n = (this.commercialPartenaires.length + 1).toString().substring(0, 2)
    while (n.length < 2) {
      n = "0" + n
    }
    return this.partenaire.code_partenaire + "C" + n
  }


  //Methode de recuperation du commercial
  onGetById() {
    this.commercialPartenaireService.getById(this.idCommercialToUpdate).subscribe(
      ((commercialFromDb) => {
        this.commercialToUpdate = commercialFromDb;
        //Recuperation du user à mettre à jour
        this.userService.getInfoById(this.idUserToUpdate).subscribe(
          ((userFromDb) => {
            this.userToUpdate = userFromDb;
            //Suite du traitement patchValue ici
            this.formUpdateCommercial.patchValue({
              civilite: { 'label': this.userToUpdate.civilite, 'value': this.userToUpdate.civilite },
              firstname: this.userToUpdate.firstname,
              lastname: this.userToUpdate.lastname,
              phone: this.userToUpdate.phone,
              email: this.userToUpdate.email,
              statut: { 'label': this.commercialToUpdate.statut, 'value': this.commercialToUpdate.statut }
            });

          }),
          ((error) => { console.error(error); })
        );

      }),
      ((error) => { console.error(error); })
    );
  }


  //Methode d'initialisation du formulaire de mise à jour d'un commercial-partenaire
  onInitFormUpdateCommercial() {
    this.formUpdateCommercial = this.formBuilder.group({
      civilite: [''],
      firstname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      lastname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      email: ['', Validators.required],
      statut: ['', Validators.required],
    });
  }


  //pour la partie de traitement des erreurs sur le formulaire
  get firstname_m() { return this.formUpdateCommercial.get('firstname'); };
  get lastname_m() { return this.formUpdateCommercial.get('lastname'); };
  get phone_m() { return this.formUpdateCommercial.get('phone'); };


  //Methode de mise à jour d'un commercial-partenaire
  onUpdateCommercial() {
    //recupération des données du formulaire
    let civilite = this.formUpdateCommercial.get('civilite')?.value.value;
    let firstname = this.formUpdateCommercial.get('firstname')?.value;
    let lastname = this.formUpdateCommercial.get('lastname')?.value;
    let phone = this.formUpdateCommercial.get('phone')?.value;
    let email = this.formUpdateCommercial.get('email')?.value;

    let statut = this.formUpdateCommercial.get('statut')?.value.value;

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(this.userToUpdate._id, firstname, lastname, '', phone, email, null, null, 'Agent', null, null, civilite, null, null, null, null, null, null, null, null, null);

    //Pour la creation du nouveau commercial
    let newCommercialPartenaire = new CommercialPartenaire(this.commercialToUpdate._id, this.commercialToUpdate.partenaire_id, this.commercialToUpdate.user_id, this.commercialToUpdate.code_commercial_partenaire, statut);

    //Requete de mise à jour
    this.commercialPartenaireService.update({ 'userToUpdate': newUser, 'commercialToUpdate': newCommercialPartenaire }).subscribe(
      ((response) => {
        if (response.success) {
          //Recuperation des données apres ajout du commercial
          this.onGetData();

          this.messageService.add({ severity: 'success', summary: 'Modification reussi' });
          this.formUpdateCommercial.reset();
          this.showFormUpdateCommercial = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de modification' });
        }
      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de la modification, veuillez contacter un administrateur' });
        console.error(error);
      })
    );

  }


  listPartenaire = {}

  //Methode de recuperation des données user et commercial
  onGetData() {
    //Recuperation de la liste des users
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach(user => {
          this.users[user._id] = user;
        });

      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des commercials
    if (this.idPartenaire) {
      this.commercialPartenaireService.getAllByPartenaireID(this.idPartenaire).subscribe(
        ((response) => { this.commercialPartenaires = response; }),
        ((error) => { console.error(error); })
      );
    } else {
      this.commercialPartenaireService.getAll().subscribe(
        ((response) => { this.commercialPartenaires = response; }),
        ((error) => { console.error(error); })
      );
    }
    this.partenaireService.getAll().subscribe(data => {
      data.forEach(p => {
        this.listPartenaire[p._id] = p
      })
    })

  }

  exportExcel() {
    let dataExcel = []
    //Clean the data
    this.commercialPartenaires.forEach(p => {
      let user: any = p.user_id
      let partenaire: Partenaire = this.listPartenaire[p.partenaire_id]
      if (user && user.lastname && user.lastname && p.code_commercial_partenaire) {
        let t = {}
        t['NOM'] = user?.lastname.toUpperCase()
        t['Prenom'] = user?.firstname
        t['Code Commercial'] = p?.code_commercial_partenaire
        t['Est Admin'] = (p.isAdmin) ? "Oui" : "Non";
        t['ID'] = p._id
        t['Email'] = user?.email_perso
        t['phone'] = user?.phone
        t['Nationalite'] = user?.nationnalite
        t['password'] = user.password

        t['p_nom'] = partenaire.nom
        t['p_email'] = partenaire.email
        t['services'] = partenaire.Services
        t['Pays'] = partenaire.Pays
        dataExcel.push(t)
      }
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "partenaires" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");

  }


  seePreRecruted(rowData: CommercialPartenaire) {
    this.router.navigate(["/international/partenaire/" + rowData.code_commercial_partenaire])
  }

  seeAlternants(rowData: CommercialPartenaire) {
    this.router.navigate(["/international/partenaire/alternants/" + rowData.code_commercial_partenaire])
  }

  seeRecruted(rowData: CommercialPartenaire) {
    this.router.navigate(["/etudiants/" + rowData.code_commercial_partenaire])
  }

  delete(rowData: CommercialPartenaire) {
    if (confirm("La suppression de ce commercial, supprimera aussi son compte IMS et enlevera les codes commerciaux de ces leads\nL'équipe IMS ne sera pas responsable si cela occasione un problème du à la suppression\nEtes-vous sûr de vouloir faire cela ?"))
      this.commercialPartenaireService.delete(rowData._id).subscribe(p => {
        this.commercialPartenaires.forEach((val, index) => {
          if (val._id == rowData._id) {
            this.commercialPartenaires.splice(index, 1)
          }
        })
      })
  }

  clonedCommission = []

  onRowEditInit(product) {
    this.clonedCommission[product._id] = { ...product };
  }

  onRowEditSave(product: any) {
    if (product.montant > 0) {

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Commision est mise à jour' });
      let commissions: [{ description: string, montant: number }] = this.formGestion.value.commissions
      commissions.splice(commissions.indexOf(this.clonedCommission[product._id]), 1)
      this.formGestion.patchValue({ commissions })
      delete this.clonedCommission[product._id];
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Le montant est invalide' });
    }
  }

  onRowEditCancel(product: any, index: number) {
    this.gestionCommercial.commissions[index] = this.clonedCommission[product._id];
    delete this.clonedCommission[product._id];
  }

  deleteCommission(commission) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commission ?')) {
      this.gestionCommercial.commissions.splice(this.gestionCommercial.commissions.indexOf(commission), 1)
      let commissions: [{ description: string, montant: number }] = this.formGestion.value.commissions
      commissions.splice(commissions.indexOf(commission), 1)
      this.formGestion.patchValue({ commissions })
    }

  }
  onInitGestion(commercial: CommercialPartenaire) {
    this.gestionCommercial = commercial;
    this.formGestion.patchValue({ ...commercial })
    this.clonedCommission = commercial.commissions
  }

  downloadContrat() {
    this.commercialPartenaireService.downloadContrat(this.gestionCommercial._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), data.fileName)
    }, (error) => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }



  uploadContrat() {
    document.getElementById('selectedFile').click();
  }

  FileUpload(event: { files: [File], target: EventTarget }) {
    console.log(event)
    if (event.files != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();

      formData.append('id', this.gestionCommercial._id)
      formData.append('path', event.files[0].name)
      formData.append('file', event.files[0])
      this.commercialPartenaireService.uploadContrat(formData, this.gestionCommercial._id).subscribe((data) => {
        this.gestionCommercial.contrat = data.contrat
        this.messageService.add({ severity: 'success', summary: 'Fichier envoyé', detail: 'Envoi avec succès' });
      }, (error) => {
        console.error(error)
        this.messageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
      })
    }
  }
  @ViewChild('fileInput') fileInput: FileUpload;


}
